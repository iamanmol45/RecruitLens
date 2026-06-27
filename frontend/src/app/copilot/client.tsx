"use client";

import { useState } from "react";
import { Candidate } from "@/data/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, CheckCircle2, AlertTriangle, TrendingUp, BookOpen, UserCircle } from "lucide-react";

export default function CopilotClient({ candidates }: { candidates: Candidate[] }) {
  // Sort by final score descending
  const topCandidates = [...candidates].sort((a, b) => b.final_score - a.final_score).slice(0, 20);
  const [selected, setSelected] = useState<Candidate>(topCandidates[0] || null);

  if (!selected) {
    return <div className="text-brand-text">No candidates available for assistant analysis.</div>;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Candidate List */}
      <div className="w-85 flex-shrink-0 flex flex-col h-full bg-[var(--bg-card)] backdrop-blur-[20px] rounded-[24px] border border-[var(--border-main)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border-main)] bg-[var(--bg-card-hover)]">
          <h3 className="font-bold text-[var(--text-main)] flex items-center gap-2 uppercase tracking-widest text-[13px]">
            <UserCircle className="w-4 h-4 text-brand-primary" />
            Top Candidates
          </h3>
        </div>
        <div className="overflow-y-auto flex-1 p-3 space-y-2">
          {topCandidates.map(c => (
            <button
              key={c.candidate_id}
              onClick={() => setSelected(c)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                selected.candidate_id === c.candidate_id 
                  ? "bg-brand-primary/20 border-brand-primary/50 text-[var(--text-main)] font-black" 
                  : "bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card-hover)]/80 text-[var(--text-muted)] border-[var(--border-main)]"
              } border cursor-pointer`}
            >
              <div className="font-bold text-[14px] truncate">{c.candidate_id}</div>
              <div className="text-[12px] truncate font-medium mt-0.5">{c.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Assistant Assessment */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pr-2">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[var(--text-main)] flex items-center gap-2 mb-2">
              <BrainCircuit className="w-8 h-8 text-brand-primary" />
              Recruiter Assistant
            </h2>
            <p className="text-brand-muted font-medium">Automated assessment for {selected.candidate_id}</p>
          </div>
          <div className="text-right">
            <div className="text-[40px] font-black text-[var(--text-main)] leading-none">{selected.final_score.toFixed(1)}</div>
            <div className="text-[12px] uppercase tracking-widest text-brand-primary font-bold mt-1">Final Score</div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 pb-12">
          {/* Why Selected & Strengths */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-4 border-b border-[var(--border-main)]">
              <CardTitle className="flex items-center gap-2 text-brand-primary text-[14px] uppercase tracking-widest font-bold">
                <CheckCircle2 className="w-5 h-5" />
                Why Selected & Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {selected.reasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] text-[var(--text-main)]/90 font-medium leading-relaxed">
                    <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Risks */}
          <Card className={selected.risks.length > 0 ? "border-brand-danger/25" : ""}>
            <CardHeader className={`pb-4 border-b ${selected.risks.length > 0 ? "border-brand-danger/10" : "border-[var(--border-main)]"}`}>
              <CardTitle className={`flex items-center gap-2 text-[14px] uppercase tracking-widest font-bold ${selected.risks.length > 0 ? "text-brand-danger" : "text-brand-warning"}`}>
                <AlertTriangle className="w-5 h-5" />
                Risks Identified
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {selected.risks.length > 0 ? (
                <ul className="space-y-4">
                  {selected.risks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] text-[var(--text-main)]/90 font-medium">
                      <span className="w-2 h-2 rounded-full bg-brand-danger mt-1.5 flex-shrink-0" />
                      {risk}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-[14px] font-bold text-brand-success flex items-center gap-2 bg-brand-success/10 p-4 rounded-xl border border-brand-success/20">
                  <CheckCircle2 className="w-5 h-5" /> No significant risks identified.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upskilling */}
          <Card className={selected.missing_skills.length > 0 ? "border-brand-warning/25" : ""}>
            <CardHeader className={`pb-4 border-b ${selected.missing_skills.length > 0 ? "border-brand-warning/10" : "border-[var(--border-main)]"}`}>
              <CardTitle className={`flex items-center gap-2 text-[14px] uppercase tracking-widest font-bold ${selected.missing_skills.length > 0 ? "text-brand-warning" : "text-brand-success"}`}>
                <BookOpen className="w-5 h-5" />
                Upskilling Effort: {selected.upskilling_effort}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {selected.missing_skills.length > 0 ? (
                <div>
                  <p className="text-[14px] font-medium text-brand-muted mb-4 leading-relaxed">The candidate needs to be upskilled in the following areas:</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.missing_skills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-[var(--bg-card-hover)] border border-brand-warning/30 rounded-lg text-xs font-bold text-brand-warning">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-[14px] font-bold text-brand-success flex items-center gap-2 bg-brand-success/10 p-4 rounded-xl border border-brand-success/20">
                  <CheckCircle2 className="w-5 h-5" /> Candidate possesses all required core skills.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Future Potential */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-4 border-b border-[var(--border-main)]">
              <CardTitle className="flex items-center gap-2 text-[14px] uppercase tracking-widest font-bold text-brand-secondary">
                <TrendingUp className="w-5 h-5" />
                Trajectory & Future Potential
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6 pt-6">
              <div className="bg-[var(--bg-card-hover)] p-5 rounded-xl border border-[var(--border-main)] text-center flex flex-col items-center justify-center">
                <div className="text-[11px] font-bold text-brand-muted mb-2 uppercase tracking-widest">Potential Rating</div>
                <div className="text-2xl font-black text-[var(--text-main)]">{selected.future_potential}</div>
              </div>
              <div className="bg-[var(--bg-card-hover)] p-5 rounded-xl border border-[var(--border-main)] text-center flex flex-col items-center justify-center">
                <div className="text-[11px] font-bold text-brand-muted mb-2 uppercase tracking-widest">Growth Type</div>
                <div className="text-xl font-bold text-[var(--text-main)]">{selected.growth_type}</div>
              </div>
              <div className="bg-[var(--bg-card-hover)] p-5 rounded-xl border border-[var(--border-main)] text-center flex flex-col items-center justify-center">
                <div className="text-[11px] font-bold text-brand-muted mb-2 uppercase tracking-widest">Leadership</div>
                <div className="text-xl font-bold text-[var(--text-main)]">{selected.leadership_growth ? "High Likelihood" : "Low Likelihood"}</div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
