"use client";

import { useMemo, useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Candidate } from "@/data/loader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function CandidatesClient({
  allCandidates,
}: {
  allCandidates: Candidate[];
}) {
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(() => {
    if (allCandidates.length === 0) return null;
    return [...allCandidates].sort((a, b) => b.final_score - a.final_score)[0];
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allCandidates
      .filter(
        (c) =>
          c.candidate_id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.archetype.toLowerCase().includes(q)
      )
      .sort((a, b) => b.final_score - a.final_score)
      .slice(0, 10);
  }, [allCandidates, search]);

  return (
    <div className="flex flex-col h-[calc(100vh-32px)] overflow-hidden">
      {/* Search bar absolutely positioned to sit next to Notification/Theme toggle */}
      <div className="fixed top-4 right-[120px] z-40 w-64">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[var(--bg-card)] border border-[var(--border-main)] focus:border-brand-primary/50 text-[var(--text-main)] placeholder-brand-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-4 shrink-0">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">Candidates</h2>
        <p className="text-brand-muted font-medium text-sm">Browse and filter all processed applications.</p>
      </div>

      <div className="flex gap-8 flex-1 min-h-0 overflow-hidden pb-4">
        <div
          className={`h-full transition-all ${
            selectedCandidate ? "hidden lg:block flex-1" : "flex-1 w-full"
          }`}
        >
          <div className="h-full flex flex-col border border-black rounded-[24px] bg-[var(--bg-card)] overflow-hidden shadow-[var(--shadow-card)]">
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {filtered.map((candidate) => {
              const isSelected = selectedCandidate?.candidate_id === candidate.candidate_id;
              return (
                <div key={candidate.candidate_id} className="w-full">
                  <Card
                    onClick={() => setSelectedCandidate(candidate)}
                    className={`w-full cursor-pointer transition-all duration-300 relative overflow-hidden group p-4 border border-black ${
                      isSelected
                        ? "bg-card ring-1 ring-[var(--brand-dim)] shadow-[0_0_25px_var(--brand-dim)]"
                        : "hover:-translate-y-0.5 hover:shadow-[0_8px_30px_var(--shadow-card),0_0_25px_var(--brand-dimmer)]"
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-bl-full -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-110" />
                    
                    <div className="flex justify-between items-center mb-3 flex-shrink-0 relative z-10">
                      <div className="flex gap-2">
                        {candidate.risk_level === "High" ? (
                          <Badge className="bg-brand-danger/20 text-brand-danger border-none px-2 py-0.5 text-[10px] font-bold">High Risk</Badge>
                        ) : candidate.risk_level === "Medium" ? (
                          <Badge className="bg-brand-warning/20 text-brand-warning border-none px-2 py-0.5 text-[10px] font-bold">Medium Risk</Badge>
                        ) : (
                          <Badge className="bg-brand-success/20 text-brand-success border-none px-2 py-0.5 text-[10px] font-bold">Low Risk</Badge>
                        )}
                        {candidate.hidden_gem && (
                          <Badge className="bg-brand-warning/20 text-brand-warning border-none px-2 py-0.5 text-[10px] font-bold">⭐ Gem</Badge>
                        )}
                        {candidate.honeypot_status === "Verified" && (
                          <Badge className="bg-green-500/20 text-green-500 border-none px-2 py-0.5 text-[10px] font-bold">🟢 Verified</Badge>
                        )}
                        {candidate.honeypot_status === "Needs Review" && (
                          <Badge className="bg-orange-500/20 text-orange-500 border-none px-2 py-0.5 text-[10px] font-bold">🟠 Needs Review</Badge>
                        )}
                        {candidate.honeypot_status === "High Risk" && (
                          <Badge className="bg-red-500/20 text-red-500 border-none px-2 py-0.5 text-[10px] font-bold">🔴 High Risk</Badge>
                        )}
                      </div>
                      <span className="text-base font-extrabold text-[var(--text-main)]">{candidate.final_score.toFixed(1)}</span>
                    </div>

                    <div className="relative z-10">
                      <h3 className="font-semibold text-[var(--text-main)] text-base leading-none mb-1">{candidate.candidate_id}</h3>
                      <p className="text-xs text-brand-muted mb-3">{candidate.title}</p>
                      
                      <div className="text-[11.5px] text-[var(--text-main)]/80 bg-[var(--bg-card-hover)] p-2.5 rounded-xl border border-[var(--border-main)] font-medium leading-relaxed mb-3">
                        <span className="text-brand-muted uppercase text-[9px] tracking-wider block mb-1">Archetype Match</span>
                        {candidate.archetype} - <span className="font-bold text-[var(--text-main)]">{candidate.match_score}%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] flex-shrink-0 pt-2 border-t border-[var(--border-main)] relative z-10">
                      <div>
                        <span className="text-[9px] text-brand-muted uppercase tracking-wider block">Experience</span>
                        <span className="font-bold text-[var(--text-main)]">{candidate.years_experience} yrs</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-brand-muted uppercase tracking-wider block">Potential</span>
                        <span className="font-bold text-brand-primary">{candidate.future_potential}</span>
                      </div>
                    </div>

                    <div className="mt-3 inline-flex justify-center items-center w-full py-1.5 bg-[var(--bg-card-hover)] hover:bg-[var(--border-main)] border border-[var(--border-main)] rounded-xl text-[11px] font-bold text-[var(--text-main)] transition-colors cursor-pointer relative z-10">
                      View Details <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
            </div>
          </div>
        </div>

        {selectedCandidate && (
          <div className="w-full lg:w-[350px] xl:w-[400px] shrink-0 h-full">
            <Card className="h-full border border-black bg-card rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.35)] relative flex flex-col overflow-hidden">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4 border-b border-[var(--border-main)] mb-4 shrink-0">
                <div>
                  <CardTitle className="text-xl font-bold text-[var(--text-main)] mb-1.5 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-[10px] font-bold border border-brand-primary/30">
                      {selectedCandidate.candidate_id.substring(selectedCandidate.candidate_id.length - 2)}
                    </div>
                    {selectedCandidate.candidate_id}
                  </CardTitle>
                  <p className="text-sm text-brand-muted mb-1">{selectedCandidate.title}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {selectedCandidate.risk_level === "High" ? (
                      <Badge className="bg-brand-danger/20 text-brand-danger border-none px-2 py-0.5 text-[10px]">
                        <span className="mr-1">🔴</span> High Risk
                      </Badge>
                    ) : selectedCandidate.risk_level === "Medium" ? (
                      <Badge className="bg-brand-warning/20 text-brand-warning border-none px-2 py-0.5 text-[10px]">
                        <span className="mr-1">🟡</span> Medium Risk
                      </Badge>
                    ) : (
                      <Badge className="bg-brand-success/20 text-brand-success border-none px-2 py-0.5 text-[10px]">
                        <span className="mr-1">🟢</span> Low Risk
                      </Badge>
                    )}

                    {selectedCandidate.hidden_gem && (
                      <Badge className="bg-brand-warning/20 text-brand-warning border-none px-2 py-0.5 text-[10px]">
                        <span className="mr-1">⭐</span> Hidden Gem
                      </Badge>
                    )}
                    {selectedCandidate.honeypot_status === "Verified" && (
                      <Badge className="bg-green-500/20 text-green-500 border-none px-2 py-0.5 text-[10px]">
                        <span className="mr-1">🟢</span> Verified
                      </Badge>
                    )}
                    {selectedCandidate.honeypot_status === "Needs Review" && (
                      <Badge className="bg-orange-500/20 text-orange-500 border-none px-2 py-0.5 text-[10px]">
                        <span className="mr-1">🟠</span> Needs Review
                      </Badge>
                    )}
                    {selectedCandidate.honeypot_status === "High Risk" && (
                      <Badge className="bg-red-500/20 text-red-500 border-none px-2 py-0.5 text-[10px]">
                        <span className="mr-1">🔴</span> High Risk
                      </Badge>
                    )}

                    {(selectedCandidate.future_potential === "High" ||
                      selectedCandidate.future_potential === "Very High") && (
                        <Badge className="bg-brand-primary/20 text-brand-primary border-none px-2 py-0.5 text-[10px]">
                          <span className="mr-1">🚀</span> High Potential
                        </Badge>
                      )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5 pt-1 flex flex-col flex-1 overflow-y-auto pb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[var(--bg-card-hover)] p-4 rounded-xl border border-[var(--border-main)]">
                    <div className="text-[11px] font-semibold text-brand-muted mb-1 uppercase tracking-wider">Final Score</div>
                    <div className="text-[26px] font-bold text-[var(--text-main)] leading-none">
                      {selectedCandidate.final_score.toFixed(1)}
                    </div>
                  </div>
                  <div className="bg-[var(--bg-card-hover)] p-4 rounded-xl border border-[var(--border-main)]">
                    <div className="text-[11px] font-semibold text-brand-muted mb-1 uppercase tracking-wider">Match Score</div>
                    <div className="text-[26px] font-bold text-brand-success leading-none">{selectedCandidate.match_score}%</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-xs font-medium text-brand-muted uppercase tracking-wider">Behavior</span>
                      <span className="text-xs font-bold text-brand-primary">{selectedCandidate.behavior_score}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <svg
                        className="h-full text-brand-primary"
                        width={`${selectedCandidate.behavior_score}%`}
                        preserveAspectRatio="none"
                      >
                        <rect width="100%" height="100%" fill="currentColor" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-xs font-medium text-brand-muted uppercase tracking-wider">Trajectory</span>
                      <span className="text-xs font-bold text-brand-secondary">{selectedCandidate.trajectory_score}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <svg
                        className="h-full text-brand-secondary"
                        width={`${selectedCandidate.trajectory_score}%`}
                        preserveAspectRatio="none"
                      >
                        <rect width="100%" height="100%" fill="currentColor" />
                      </svg>
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
                    <span className="text-brand-muted">Risk Level</span>
                    <span className="text-[var(--text-main)] font-medium">{selectedCandidate.risk_level}</span>
                  </div>
                  {selectedCandidate.honeypot_status !== "Verified" && (
                    <div className="pt-2">
                      <span className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${selectedCandidate.honeypot_status === 'High Risk' ? 'text-red-500' : 'text-orange-500'}`}>
                        {selectedCandidate.honeypot_status} Flags
                      </span>
                      <ul className={`list-disc list-inside text-xs ${selectedCandidate.honeypot_status === 'High Risk' ? 'text-red-400' : 'text-orange-400'}`}>
                        {selectedCandidate.honeypot_reasons.map((r, idx) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-brand-muted mb-3">Skill Coverage</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Python", "Retrieval"].map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 bg-brand-success/10 border border-brand-success/20 rounded-md text-[11px] font-bold text-brand-success flex items-center gap-1"
                      >
                        {skill} ✓
                      </span>
                    ))}

                    {selectedCandidate.missing_skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 bg-brand-danger/10 border border-brand-danger/20 rounded-md text-[11px] font-bold text-brand-danger flex items-center gap-1"
                      >
                        {skill} ✗
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-auto border-t border-[var(--border-main)]">
                  <Link 
                    href={`/candidate/${selectedCandidate.candidate_id}`} 
                    className="w-full inline-flex justify-center items-center py-2.5 px-4 bg-brand-primary hover:bg-brand-primary/90 text-black font-bold rounded-xl text-sm transition-all shadow-md shadow-brand-primary/20 cursor-pointer"
                  >
                    View Full Profile
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

