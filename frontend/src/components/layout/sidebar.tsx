"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Home, Users, Sparkles, BrainCircuit,
  GitCompare, UploadCloud, Target, FileText, X, CheckCircle2, Play, FileUp
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/candidates", label: "Candidates", icon: Users },
  { href: "/hidden-gems", label: "Hidden Gems", icon: Sparkles },
  { href: "/recommendations", label: "Recommendation", icon: Target },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/copilot", label: "AI Copilot", icon: BrainCircuit },
];

export function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    <>
      <aside
        className="dash-sidebar flex flex-col overflow-y-auto"
        style={{
          position: "fixed",
          left: 0, top: 0,
          width: "220px",
          height: "100vh",
          zIndex: 50,
        }}
      >
        {/* Theme-responsive top accent bar */}
        <div style={{ height: "2px", background: "linear-gradient(90deg, var(--brand), var(--brand-dimmer))", flexShrink: 0 }} />

        {/* Logo */}
        <div style={{ padding: "20px 18px 14px", flexShrink: 0 }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "linear-gradient(135deg, var(--brand), var(--brand-secondary))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 900, color: "#fff",
            boxShadow: "0 0 16px var(--brand-shadow)"
          }}>RL</div>
        </div>

        {/* Section label */}
        <div style={{ padding: "0 18px 8px", flexShrink: 0 }}>
          <span style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: "var(--text-muted)" }}>
            Menu
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: "2px" }}>
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-[10px] px-[12px] py-[9px] rounded-[12px] text-[12.5px] font-medium text-[#A8A27D] no-underline transition-all duration-200 border border-transparent hover:text-white hover:bg-white/10 focus:outline-none focus:ring-0"
            >
              <Icon
                style={{ width: "15px", height: "15px", flexShrink: 0, color: "inherit" }}
              />
              {label}
            </Link>
          ))}
        </nav>

        {/* Pipeline Tuning Section */}
        <div className="border-t border-[var(--border-main)] pt-4 pb-6 px-4 flex-shrink-0">
          <span className="text-[9px] text-neutral-500 font-extrabold uppercase tracking-widest block mb-3">
            Pipeline Tuning
          </span>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setTextMode(false);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 bg-[var(--brand-dim)] hover:bg-[var(--brand-dimmer)] border border-[var(--border-main)] hover:border-[var(--border-hover)] rounded-xl text-[11.5px] font-bold text-[#FFFFFF] cursor-pointer transition-all duration-200"
            >
              <UploadCloud className="w-4 h-4 text-[var(--brand)]" />
              <span>Upload JD File</span>
            </button>
            <button
              onClick={() => {
                setTextMode(true);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card-hover)]/80 border border-[var(--border-main)] rounded-xl text-[11.5px] font-semibold text-[var(--text-main)] cursor-pointer transition-all duration-200"
            >
              <FileText className="w-4 h-4 text-neutral-400" />
              <span>Paste JD Text</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-[var(--bg-backdrop)] animate-in fade-in duration-200">
          <div className="dash-card max-w-2xl w-full p-6 relative overflow-hidden flex flex-col max-h-[90vh]">
            {/* Background Glow */}
            <div style={{
              position: "absolute", top: "-20px", right: "-20px",
              width: "150px", height: "150px", borderRadius: "50%", pointerEvents: "none",
              background: "radial-gradient(circle, var(--brand-dim) 0%, transparent 70%)"
            }} />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-4 mb-4 flex-shrink-0">
              <h2 className="text-[16px] font-black uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-brand-primary" />
                Job Description Tuning
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setExtracted(null);
                  setJdText("");
                }}
                className="p-1.5 hover:bg-[var(--bg-card-hover)] border border-transparent hover:border-[var(--border-main)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer transition-colors"
                aria-label="Close"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            
            <div className="bg-brand-warning/10 border border-brand-warning/30 rounded-xl p-3 text-brand-warning flex items-start gap-3 mb-4 flex-shrink-0">
              <div className="mt-0.5">⚠️</div>
              <div>
                <h4 className="font-bold text-sm mb-1">Prototype Notice</h4>
                <p className="text-xs font-medium opacity-90">
                  The dynamic JD upload feature is currently in beta. For this presentation, the backend semantic matcher is heavily tuned for ML/AI roles. Uploading JDs for unrelated roles may yield suboptimal rankings.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 flex-shrink-0">
              <button
                className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${!textMode
                    ? "border-brand-primary bg-brand-primary/10 text-brand-primary shadow-[0_0_12px_var(--brand-dim)]"
                    : "border-[var(--border-main)] hover:border-[var(--border-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  }`}
                onClick={() => setTextMode(false)}
              >
                <FileUp className="w-4 h-4" />
                Upload JD File
              </button>
              <button
                className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${textMode
                    ? "border-brand-primary bg-brand-primary/10 text-brand-primary shadow-[0_0_12px_var(--brand-dim)]"
                    : "border-[var(--border-main)] hover:border-[var(--border-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  }`}
                onClick={() => setTextMode(true)}
              >
                <FileText className="w-4 h-4" />
                Paste JD Text
              </button>
            </div>

            {/* Main Area */}
            <div className="flex-1 overflow-y-auto pr-0.5 space-y-4 min-h-0">
              {!extracted ? (
                <div>
                  {textMode ? (
                    <textarea
                      className="w-full h-44 bg-[var(--bg-card-hover)] border border-[var(--border-main)] rounded-xl p-4 text-[var(--text-main)] text-[13px] font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary/50 resize-none"
                      placeholder="Paste the job description or matching criteria details here..."
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      aria-label="Job Description Text"
                      title="Job Description Text"
                    />
                  ) : (
                    <div className="border border-dashed border-[var(--border-main)] rounded-xl h-44 flex flex-col items-center justify-center hover:border-brand-primary/40 transition-colors bg-[var(--bg-card-hover)]/30 cursor-pointer relative">
                      <input
                        type="file"
                        accept=".txt,.docx,.csv"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                          }
                        }}
                        aria-label="Upload Job Description File"
                        title="Upload Job Description File"
                      />
                      <UploadCloud className="w-8 h-8 text-neutral-500 mb-3" />
                      <div className="text-[13px] text-[var(--text-main)] font-bold">
                        {selectedFile ? `Selected: ${selectedFile.name}` : "Drag & Drop JD file here"}
                      </div>
                      <div className="text-[11px] font-semibold text-neutral-500 mt-1">
                        supports .txt, .docx, or .csv
                      </div>
                    </div>
                  )}

                  {/* Run Pipeline Button */}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleRunRanking}
                      disabled={isProcessing || (!textMode && !jdText) || (textMode && !jdText.trim())}
                      className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-primary/90 disabled:bg-brand-primary/50 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-[0_0_15px_var(--brand-dim)]"
                    >
                      {isProcessing ? (
                        <>Processing JD...</>
                      ) : (
                        <><Play className="w-3.5 h-3.5 fill-current" /> Run Tuning Pipeline</>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  {/* Extracted requirement cards */}
                  <div className="flex items-center gap-2 text-brand-primary text-xs font-extrabold uppercase tracking-widest mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Tuning Parameter Update Successful
                  </div>
                  <p className="text-[12px] font-medium text-[var(--text-muted)]">
                    Candidate metrics are being matched against these extracted requirements.
                  </p>

                  <div className="space-y-3">
                    <div className="p-3 bg-[var(--bg-card-hover)] border border-[var(--border-main)] rounded-xl">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {extracted.skills.map((skill: string) => (
                          <span key={skill} className="px-2 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-md text-[10px] text-brand-primary font-bold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-[var(--bg-card-hover)] border border-[var(--border-main)] rounded-xl">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Experience</h4>
                        <p className="text-[12px] font-semibold text-[var(--text-main)] leading-relaxed">{extracted.experience}</p>
                      </div>
                      <div className="p-3 bg-[var(--bg-card-hover)] border border-[var(--border-main)] rounded-xl">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Leadership</h4>
                        <p className="text-[12px] font-semibold text-[var(--text-main)] leading-relaxed">{extracted.leadership}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        setExtracted(null);
                        setJdText("");
                      }}
                      className="px-4 py-2 bg-[var(--bg-card-hover)] border border-[var(--border-main)] hover:bg-[var(--bg-card-hover)]/80 text-[var(--text-main)] rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Close & Rerank Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
