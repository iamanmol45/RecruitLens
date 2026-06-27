"use client";

import { useState } from "react";
import { Candidate } from "@/data/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitCompare, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CompareClient({ allCandidates }: { allCandidates: Candidate[] }) {
  const [candidate1Id, setCandidate1Id] = useState<string>(allCandidates[0]?.candidate_id || "");
  const [candidate2Id, setCandidate2Id] = useState<string>(allCandidates[1]?.candidate_id || "");

  const c1 = allCandidates.find(c => c.candidate_id === candidate1Id);
  const c2 = allCandidates.find(c => c.candidate_id === candidate2Id);

  const renderMetric = (label: string, val1: any, val2: any, isHigherBetter = true, isRisk = false) => {
    let c1Better = false;
    let c2Better = false;

    if (typeof val1 === 'number' && typeof val2 === 'number') {
      c1Better = isHigherBetter ? val1 > val2 : val1 < val2;
      c2Better = isHigherBetter ? val2 > val1 : val2 < val1;
    } else if (isRisk) {
      const riskScores: Record<string, number> = { "Low": 1, "Medium": 2, "High": 3 };
      c1Better = riskScores[val1 as string] < riskScores[val2 as string];
      c2Better = riskScores[val2 as string] < riskScores[val1 as string];
    } else if (label === 'Potential') {
       const potScores: Record<string, number> = { "Low": 1, "Moderate": 2, "High": 3 };
       c1Better = potScores[val1 as string] > potScores[val2 as string];
       c2Better = potScores[val2 as string] > potScores[val1 as string];
    }

    return (
      <div className="flex flex-col mb-6">
        <div className="text-center text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-3">{label}</div>
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl border text-center transition-colors ${c1Better ? 'bg-brand-success/10 border-brand-success/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-brand-surface border-brand-primary/20'} ${!c1Better && c2Better ? 'opacity-50' : ''}`}>
            <div className={`text-[18px] font-black ${c1Better ? 'text-brand-success' : 'text-brand-text'}`}>
              {typeof val1 === 'number' && label.includes('Score') ? val1.toFixed(1) : val1}
            </div>
          </div>
          <div className={`p-4 rounded-xl border text-center transition-colors ${c2Better ? 'bg-brand-success/10 border-brand-success/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-brand-surface border-brand-primary/20'} ${!c2Better && c1Better ? 'opacity-50' : ''}`}>
            <div className={`text-[18px] font-black ${c2Better ? 'text-brand-success' : 'text-brand-text'}`}>
              {typeof val2 === 'number' && label.includes('Score') ? val2.toFixed(1) : val2}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-32px)] overflow-hidden w-full">
      <div className="flex-shrink-0">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-2">
          <GitCompare className="w-8 h-8 text-brand-primary" />
          Candidate Comparison
        </h2>
        <p className="text-brand-muted font-medium">Select two candidates to compare their strengths, risks, and overall fit.</p>
      </div>

      {c1 && c2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0 overflow-hidden">
          <Card className="h-full flex flex-col min-h-0">
            <CardHeader className="pb-4 border-b border-white/5 flex-shrink-0">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Candidate 1</label>
                  <select 
                    aria-label="Select Candidate 1"
                    value={candidate1Id} 
                    onChange={e => setCandidate1Id(e.target.value)}
                    className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-main)] rounded-xl px-5 py-4 text-[14px] font-bold text-brand-text focus:ring-2 focus:ring-brand-primary outline-none"
                  >
                    {allCandidates.filter(c => c.candidate_id !== candidate2Id).map(c => (
                      <option key={c.candidate_id} value={c.candidate_id} className="bg-brand-surface text-brand-text">{c.candidate_id} - {c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Candidate 2</label>
                  <select 
                    aria-label="Select Candidate 2"
                    value={candidate2Id} 
                    onChange={e => setCandidate2Id(e.target.value)}
                    className="w-full bg-[var(--bg-card-hover)] border border-[var(--border-main)] rounded-xl px-5 py-4 text-[14px] font-bold text-brand-text focus:ring-2 focus:ring-brand-primary outline-none"
                  >
                    {allCandidates.filter(c => c.candidate_id !== candidate1Id).map(c => (
                      <option key={c.candidate_id} value={c.candidate_id} className="bg-brand-surface text-brand-text">{c.candidate_id} - {c.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 overflow-y-auto flex-1 pr-4">
              {renderMetric("Final Score", c1.final_score, c2.final_score)}
              {renderMetric("Match Score", c1.match_score, c2.match_score)}
              {renderMetric("Behavior Score", c1.behavior_score, c2.behavior_score)}
              {renderMetric("Trajectory Score", c1.trajectory_score, c2.trajectory_score)}
              {renderMetric("Risk Level", c1.risk_level, c2.risk_level, false, true)}
              {renderMetric("Potential", c1.future_potential, c2.future_potential)}
              {renderMetric("Archetype", c1.archetype, c2.archetype, false)}
            </CardContent>
          </Card>

          {/* Detailed Lists */}
          <div className="flex flex-col gap-6 h-full min-h-0">
            <Card className="flex-1 min-h-0 flex flex-col">
              <CardHeader className="pb-4 border-b border-white/5 flex-shrink-0">
                <CardTitle className="text-[14px] font-bold text-brand-text uppercase tracking-widest">Why {c1.candidate_id}?</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 overflow-y-auto flex-1 pr-4">
                <ul className="space-y-3 mb-6">
                  {c1.reasons.slice(0, 3).map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-[13px] font-medium text-brand-text/90 leading-relaxed"><CheckCircle2 className="w-4 h-4 text-brand-success mt-0.5 flex-shrink-0"/>{r}</li>
                  ))}
                </ul>
                <div className="mt-4 pt-6 border-t border-white/5">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-brand-danger mb-3">Missing Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {c1.missing_skills.length > 0 ? c1.missing_skills.map(s => (
                      <span key={s} className="px-3 py-1.5 bg-brand-surface border border-white/5 rounded-lg text-xs font-bold text-brand-muted">{s}</span>
                    )) : <span className="text-[13px] font-bold text-brand-success">None</span>}
                  </div>
                </div>
                <div className="mt-8">
                  <Link href={`/candidate/${c1.candidate_id}`} className="text-[13px] font-bold uppercase tracking-widest text-brand-primary hover:text-brand-primary/80 flex items-center justify-center w-full bg-brand-primary/10 py-3 rounded-xl border border-brand-primary/20 transition-colors">
                    Full Profile <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </CardContent>
            </Card>
 
            <Card className="flex-1 min-h-0 flex flex-col">
              <CardHeader className="pb-4 border-b border-white/5 flex-shrink-0">
                <CardTitle className="text-[14px] font-bold text-brand-text uppercase tracking-widest">Why {c2.candidate_id}?</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 overflow-y-auto flex-1 pr-4">
                <ul className="space-y-3 mb-6">
                  {c2.reasons.slice(0, 3).map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-[13px] font-medium text-brand-text/90 leading-relaxed"><CheckCircle2 className="w-4 h-4 text-brand-success mt-0.5 flex-shrink-0"/>{r}</li>
                  ))}
                </ul>
                <div className="mt-4 pt-6 border-t border-white/5">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-brand-danger mb-3">Missing Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {c2.missing_skills.length > 0 ? c2.missing_skills.map(s => (
                      <span key={s} className="px-3 py-1.5 bg-brand-surface border border-white/5 rounded-lg text-xs font-bold text-brand-muted">{s}</span>
                    )) : <span className="text-[13px] font-bold text-brand-success">None</span>}
                  </div>
                </div>
                <div className="mt-8">
                  <Link href={`/candidate/${c2.candidate_id}`} className="text-[13px] font-bold uppercase tracking-widest text-brand-primary hover:text-brand-primary/80 flex items-center justify-center w-full bg-brand-primary/10 py-3 rounded-xl border border-brand-primary/20 transition-colors">
                    Full Profile <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
