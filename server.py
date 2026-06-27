import os
import json
import subprocess
from fastapi import FastAPI, BackgroundTasks, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import FileResponse

# Import existing logic to parse JD directly
from src.preprocessing.jd_parser import parse_jd

app = FastAPI(title="Recruitment Ranking API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JDInput(BaseModel):
    jd_text: str

@app.post("/api/run-pipeline")
def run_pipeline(
    jd_text: str = Form(None),
    file: UploadFile = File(None)
):
    if file:
        file_bytes = file.file.read()
        if file.filename.endswith(".docx"):
            with open("docs/job_description.docx", "wb") as f:
                f.write(file_bytes)
            if os.path.exists("docs/job_description.txt"):
                os.remove("docs/job_description.txt") # force main.py to read docx
            # Extract text for parse_jd
            from docx import Document
            doc = Document("docs/job_description.docx")
            extracted_text = "\n".join(p.text for p in doc.paragraphs)
        else:
            extracted_text = file_bytes.decode("utf-8", errors="ignore")
            with open("docs/job_description.txt", "w", encoding="utf-8") as f:
                f.write(extracted_text)
    elif jd_text:
        extracted_text = jd_text
        with open("docs/job_description.txt", "w", encoding="utf-8") as f:
            f.write(jd_text)
    else:
        return {"status": "error", "message": "No JD provided."}

    # 1. Parse the JD using the existing business logic
    parsed_jd = parse_jd(extracted_text)
        
    # 3. Execute the existing pipeline as a subprocess
    print("Starting pipeline via subprocess...")
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"
    
    process = subprocess.run(
        ["python", "main.py"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        cwd=os.getcwd(),
        env=env
    )
    
    if process.returncode != 0:
        print("Pipeline error:", process.stderr)
        return {"status": "error", "message": "Pipeline failed", "error": process.stderr[-500:]}
        
    return {
        "status": "success",
        "parsed_jd": parsed_jd,
        "message": "Pipeline completed successfully."
    }

@app.get("/api/candidates")
def get_candidates():
    with open("outputs/ranked_candidates.json", "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/api/statistics")
def get_statistics():
    with open("outputs/profile_report.json", "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/api/benchmark")
def get_benchmark():
    # Read all benchmark txt files and return them
    benchmarks = {}
    if os.path.exists("outputs/benchmarks"):
        for filename in os.listdir("outputs/benchmarks"):
            if filename.endswith(".txt"):
                with open(os.path.join("outputs/benchmarks", filename), "r", encoding="utf-8") as f:
                    benchmarks[filename.replace(".txt", "")] = f.read()
    return benchmarks

@app.get("/api/download/submission")
def download_submission():
    return FileResponse("outputs/submission.csv", filename="submission.csv")

@app.get("/api/download/ranked-json")
def download_ranked_json():
    return FileResponse("outputs/ranked_candidates.json", filename="ranked_candidates.json")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
