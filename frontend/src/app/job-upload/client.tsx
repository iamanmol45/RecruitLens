"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, FileText, CheckCircle2, Play, FileUp } from "lucide-react";

export default function JobUploadClient() {
  const [textMode, setTextMode] = useState(false);
  const [jdText, setJdText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [extracted, setExtracted] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleRunRanking = async () => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      if (!textMode && selectedFile) {
        formData.append("file", selectedFile);
      } else {
        formData.append("jd_text", jdText);
      }

      const response = await fetch("http://localhost:8000/api/run-pipeline", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.status === "success") {
        setExtracted({
          skills: data.parsed_jd.required_skills?.length ? data.parsed_jd.required_skills : ["No technical skills detected"],
          experience: data.parsed_jd.required_experience?.length ? data.parsed_jd.required_experience.join(", ") : "No production signals detected.",
          leadership: `Role Family: ${data.parsed_jd.role_family || "Unknown"}. Exp: ${data.parsed_jd.experience_min || "?"}-${data.parsed_jd.experience_max || "?"} years`,
        });
      } else {
        alert("Pipeline failed to run. Check server logs.");
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to the backend. Is server.py running?");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-2">
          <UploadCloud className="w-8 h-8 text-brand-primary" />
          Job Description Setup
        </h2>
        <p className="text-brand-muted font-medium mb-4">Upload a new JD to dynamically tune the ranking criteria for your pipeline.</p>
        
        <div className="bg-brand-warning/10 border border-brand-warning/30 rounded-xl p-4 text-brand-warning flex items-start gap-3">
          <div className="mt-0.5">⚠️</div>
          <div>
            <h4 className="font-bold text-sm mb-1">Prototype Notice</h4>
            <p className="text-xs font-medium opacity-90">
              The dynamic JD upload feature is currently in beta. For this presentation, the backend semantic matcher is heavily tuned for ML/AI roles. Uploading JDs for unrelated roles may yield suboptimal rankings.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className={`border transition-colors rounded-[24px] cursor-pointer ${!textMode ? 'border-brand-primary bg-card' : 'border-primary/28 bg-card hover:border-primary/50'}`} onClick={() => setTextMode(false)}>
          <CardContent className="p-8 flex flex-col items-center justify-center text-center h-48">
            <FileUp className={`w-12 h-12 mb-4 ${!textMode ? 'text-brand-primary' : 'text-brand-muted'}`} />
            <h3 className="font-bold text-[16px] text-white mb-1">Upload File</h3>
            <p className="text-[13px] font-medium text-brand-muted">.txt or .docx supported</p>
          </CardContent>
        </Card>
        <Card className={`border transition-colors rounded-[24px] cursor-pointer ${textMode ? 'border-brand-primary bg-card' : 'border-primary/28 bg-card hover:border-primary/50'}`} onClick={() => setTextMode(true)}>
          <CardContent className="p-8 flex flex-col items-center justify-center text-center h-48">
            <FileText className={`w-12 h-12 mb-4 ${textMode ? 'text-brand-primary' : 'text-brand-muted'}`} />
            <h3 className="font-bold text-[16px] text-white mb-1">Paste Text</h3>
            <p className="text-[13px] font-medium text-brand-muted">Manually enter JD</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          {textMode ? (
            <textarea 
              className="w-full h-48 bg-brand-surface border border-primary/28 rounded-xl p-5 text-white text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none"
              placeholder="Paste the job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
          ) : (
            <div className="border-2 border-dashed border-primary/28 rounded-xl h-48 flex flex-col items-center justify-center hover:border-brand-primary/50 transition-colors bg-brand-surface/50 relative cursor-pointer">
              <input 
                type="file" 
                accept=".txt,.docx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <UploadCloud className="w-8 h-8 text-brand-muted mb-4" />
              <div className="text-[14px] text-white font-bold">
                {selectedFile ? selectedFile.name : "Drag & Drop JD file here"}
              </div>
              <div className="text-[12px] font-medium text-brand-muted mt-1">or click to browse (.txt or .docx)</div>
            </div>
          )}
        </CardContent>
      </Card>
 
      <div className="flex justify-end">
        <button 
          onClick={handleRunRanking}
          disabled={isProcessing}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 disabled:bg-brand-primary/50 text-white rounded-xl font-bold transition-colors shadow-[0_0_20px_rgba(124,92,255,0.2)]"
        >
          {isProcessing ? (
            <>Processing JD...</>
          ) : (
            <><Play className="w-4 h-4 fill-current" /> Run Pipeline</>
          )}
        </button>
      </div>
 
      {extracted && (
        <Card className="border border-brand-success/20 bg-card rounded-[24px] mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="pb-4 border-b border-brand-success/10">
            <CardTitle className="flex items-center gap-2 text-brand-success text-[14px] font-bold uppercase tracking-widest">
              <CheckCircle2 className="w-5 h-5" /> Extracted Requirements
            </CardTitle>
            <p className="text-[13px] font-medium text-brand-muted mt-2">The system will now prioritize candidates matching these signals.</p>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-brand-muted mb-3">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {extracted.skills.map((skill: string) => (
                  <span key={skill} className="px-3 py-1.5 bg-[#262626] border border-brand-success/30 rounded-lg text-xs text-brand-success font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-brand-muted mb-3">Experience Requirements</h4>
                <p className="text-[14px] font-medium text-white/90 p-4 bg-[#262626] rounded-xl border border-white/10 leading-relaxed">{extracted.experience}</p>
              </div>
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-brand-muted mb-3">Leadership Expectations</h4>
                <p className="text-[14px] font-medium text-white/90 p-4 bg-[#262626] rounded-xl border border-white/10 leading-relaxed">{extracted.leadership}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
