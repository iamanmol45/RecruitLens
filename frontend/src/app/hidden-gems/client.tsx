"use client";

import { useState } from "react";
import { Candidate } from "@/data/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HiddenGemsClient({ allCandidates }: { allCandidates: Candidate[] }) {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  
  const hiddenGems = allCandidates.filter(c => c.hidden_gem);

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-32px)] overflow-hidden w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)] mb-2 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-brand-primary" />
            Hidden <span className="text-brand-primary">Gems</span>
          </h1>
          <p className="text-brand-muted font-medium">Candidates with exceptional potential despite lower initial match scores or unconventional backgrounds</p>
        </div>
      </div>

      {/* Split Grid / Side Window Layout */}
      <div className="flex gap-8 items-start flex-1 min-h-0 overflow-hidden">
        {hiddenGems.length === 0 ? (
          <Card className="bg-brand-surface/50 border border-dashed border-primary/28 rounded-[16px] h-full w-full flex flex-col items-center justify-center">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <Sparkles className="w-12 h-12 text-brand-muted/30 mb-4" />
              <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">No Hidden Gems Found</h3>
              <p className="text-brand-muted max-w-md font-medium">Your current candidate pool does not have any flagged hidden gems.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Left Side: Candidates Grid */}
            <div className={`h-full overflow-y-auto pr-2 transition-all ${selectedCandidate ? "hidden lg:block lg:w-2/3" : "w-full"}`}>
              <div className={`grid gap-4 pb-4 ${selectedCandidate ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                {hiddenGems.map((c) => {
                  const isSelected = selectedCandidate?.candidate_id === c.candidate_id;
                  return (
                    <Card 
                      key={c.candidate_id} 
                      onClick={() => setSelectedCandidate(c)}
                      className={`cursor-pointer relative overflow-hidden group p-4 flex flex-col h-full border transition-all duration-300 ${
                        isSelected
                          ? "border-brand-primary bg-card ring-1 ring-brand-primary/30 shadow-[0_0_25px_rgba(255,101,0,0.25)]"
                          : "hover:border-brand-primary/50 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.45),0_0_25px_rgba(255,101,0,0.30)]"
                      }`}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-bl-full -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-110" />
                      
                      <div className="flex justify-between items-center mb-3 flex-shrink-0 relative z-10">
                        <Badge className="bg-brand-warning/20 text-brand-warning border-none font-bold px-2 py-0.5 text-[10px]">
                          Hidden Gem
                        </Badge>
                        <span className="text-base font-extrabold text-[var(--text-main)]">{c.final_score.toFixed(1)}</span>
                      </div>
                      
                      <div className="relative z-10 flex-1">
                        <h3 className="font-semibold text-[var(--text-main)] text-base leading-none mb-1">{c.candidate_id}</h3>
                        <p className="text-xs text-brand-muted mb-3">{c.title}</p>
                        
                        <div className="text-[11.5px] text-[var(--text-main)]/80 bg-[var(--bg-card-hover)] p-2.5 rounded-xl border border-[var(--border-main)] italic font-medium leading-relaxed mb-3 line-clamp-3">
                          &ldquo;{c.hidden_gem_reason || "Identified as having exceptional trajectory despite skill gaps."}&rdquo;
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[11px] flex-shrink-0 pt-2 border-t border-[var(--border-main)] relative z-10">
                        <div>
                          <span className="text-[9px] text-brand-muted uppercase tracking-wider block">Experience</span>
                          <span className="font-bold text-[var(--text-main)]">{c.years_experience} yrs</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-brand-muted uppercase tracking-wider block">Potential</span>
                          <span className="font-bold text-brand-primary">{c.future_potential}</span>
                        </div>
                      </div>

                      <Link
                        href={`/candidate/${c.candidate_id}`}
                        className="mt-3 inline-flex justify-center items-center w-full py-1.5 bg-brand-primary hover:bg-brand-primary/90 border border-brand-primary/30 rounded-xl text-[11px] font-bold text-black transition-colors cursor-pointer relative z-10"
                        onClick={e => e.stopPropagation()}
                      >
                        View Full Profile <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Link>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Right Side: Profile Details Side Window */}
            {selectedCandidate && (
              <div className="w-full lg:w-1/3 h-full overflow-y-auto pr-1 pb-4 animate-in slide-in-from-right-4 duration-300">
                <Card className="border border-brand-primary/30 bg-card rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.35)] relative overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-[120px] h-[120px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(255,101,0,0.08)_0%,transparent_70%)]" />

                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 border-b border-[var(--border-main)] mb-4 relative z-10">
                    <div>
                      <CardTitle className="text-xl font-bold text-[var(--text-main)] mb-1 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-[10px] font-bold border border-brand-primary/30">
                          {selectedCandidate.candidate_id.substring(selectedCandidate.candidate_id.length - 2)}
                        </div>
                        {selectedCandidate.candidate_id}
                      </CardTitle>
                      <p className="text-sm text-brand-muted">{selectedCandidate.title}</p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {selectedCandidate.risk_level === "High" ? (
                          <Badge className="bg-brand-danger/20 text-brand-danger border-none px-2 py-0.5 text-[10px]"><span className="mr-1">🔴</span> High Risk</Badge>
                        ) : selectedCandidate.risk_level === "Medium" ? (
                          <Badge className="bg-brand-warning/20 text-brand-warning border-none px-2 py-0.5 text-[10px]"><span className="mr-1">🟡</span> Medium Risk</Badge>
                        ) : (
                          <Badge className="bg-brand-success/20 text-brand-success border-none px-2 py-0.5 text-[10px]"><span className="mr-1">🟢</span> Low Risk</Badge>
                        )}
                        <Badge className="bg-brand-warning/20 text-brand-warning border-none px-2 py-0.5 text-[10px]"><span className="mr-1">⭐</span> Hidden Gem</Badge>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedCandidate(null)} 
                      className="text-brand-muted hover:text-[var(--text-main)] transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-card-hover)] cursor-pointer"
                      aria-label="Close details"
                      title="Close details"
                    >
                      ✕
                    </button>
                  </CardHeader>

                  <CardContent className="space-y-6 pt-2 relative z-10">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[var(--bg-card-hover)] p-4 rounded-xl border border-[var(--border-main)]">
                        <div className="text-[11px] font-semibold text-brand-muted mb-1 uppercase tracking-wider">Final Score</div>
                        <div className="text-[26px] font-bold text-[var(--text-main)] leading-none">{selectedCandidate.final_score.toFixed(1)}</div>
                      </div>
                      <div className="bg-[var(--bg-card-hover)] p-4 rounded-xl border border-[var(--border-main)]">
                        <div className="text-[11px] font-semibold text-brand-muted mb-1 uppercase tracking-wider">Match Score</div>
                        <div className="text-[26px] font-bold text-brand-success leading-none">{selectedCandidate.match_score}%</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-end mb-1.5">
                          <span className="text-xs font-medium text-brand-muted uppercase tracking-wider">Behavior Score</span>
                          <span className="text-xs font-bold text-brand-primary">{selectedCandidate.behavior_score}</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-primary rounded-full" style={{ width: `${selectedCandidate.behavior_score}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-end mb-1.5">
                          <span className="text-xs font-medium text-brand-muted uppercase tracking-wider">Trajectory Score</span>
                          <span className="text-xs font-bold text-brand-secondary">{selectedCandidate.trajectory_score}</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-secondary rounded-full" style={{ width: `${selectedCandidate.trajectory_score}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-[var(--border-main)]">
                      <div className="flex justify-between text-sm">
                        <span className="text-brand-muted">Archetype</span>
                        <span className="text-[var(--text-main)] font-medium">{selectedCandidate.archetype}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-brand-muted">Experience</span>
                        <span className="text-[var(--text-main)] font-medium">{selectedCandidate.years_experience} Years</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-brand-muted">Potential</span>
                        <span className="text-brand-primary font-bold">{selectedCandidate.future_potential}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-brand-muted mb-2">Hidden Gem Insights</h4>
                      <p className="text-[12.5px] font-medium text-[var(--text-main)]/90 p-3.5 bg-[var(--bg-card-hover)] rounded-xl border border-[var(--border-main)] leading-relaxed italic">
                        &ldquo;{selectedCandidate.hidden_gem_reason}&rdquo;
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-brand-muted mb-3">Skill Coverage</h4>
                      <div className="flex flex-wrap gap-2">
                        {["Python", "Retrieval"].map(skill => (
                          <span key={skill} className="px-2 py-1 bg-brand-success/10 border border-brand-success/20 rounded-md text-[10px] font-bold text-brand-success flex items-center gap-1">
                            {skill} ✓
                          </span>
                        ))}
                        {selectedCandidate.missing_skills.map(skill => (
                          <span key={skill} className="px-2 py-1 bg-brand-danger/10 border border-brand-danger/20 rounded-md text-[10px] font-bold text-brand-danger flex items-center gap-1">
                            {skill} ✗
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--border-main)]">
                      <Link 
                        href={`/candidate/${selectedCandidate.candidate_id}`} 
                        className="w-full inline-flex justify-center items-center py-2.5 px-4 bg-brand-primary hover:bg-brand-primary/90 text-black font-bold rounded-xl text-xs transition-all shadow-lg shadow-brand-primary/20 cursor-pointer"
                      >
                        View Full Profile <ArrowRight className="w-3.5 h-3.5 ml-2" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
