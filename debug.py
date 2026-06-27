import json

def debug_candidate():
    file_path = "data/raw/candidates.jsonl"
    target_id = "CAND_0000847"

    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            if target_id in line:
                c = json.loads(line)
                if c["candidate_id"] == target_id:
                    print("TITLE")
                    print(c["profile"].get("current_title", ""))

                    print("\nHEADLINE")
                    print(c["profile"].get("headline", ""))

                    print("\nSUMMARY")
                    print(c["profile"].get("summary", ""))

                    print("\nSKILLS")
                    for skill in c.get("skills", []):
                        print(skill.get("name", ""))

                    print("\nCAREER HISTORY")

                    for job in c.get("career_history", []):
                        print(job.get("title", ""))
                        print(job.get("company", ""))
                        print(job.get("description", ""))
                        print("-" * 50)
                    return
                    
    print("Candidate not found.")

if __name__ == "__main__":
    debug_candidate()
