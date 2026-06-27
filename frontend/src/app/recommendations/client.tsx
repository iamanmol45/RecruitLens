"use client";

import { Candidate } from "@/data/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Trophy, ShieldCheck, Rocket, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function RecommendationsClient({ allCandidates }: { allCandidates: Candidate[] }) {
  if (allCandidates.length === 0) return <div className="text-brand-text">No candidates available.</div>;

  // Best Overall (Highest Final Score)
  const bestOverall = [...allCandidates].sort((a, b) => b.final_score - a.final_score)[0];

  // Safest Bet (Low Risk, Highest Match)
  const safestBet = [...allCandidates]
    .filter(c => c.risk_level === "Low" && c.candidate_id !== bestOverall?.candidate_id)
    .sort((a, b) => b.match_score - a.match_score)[0];

  // Highest Ceiling (High Potential, High Trajectory)
  const highestCeiling = [...allCandidates]
    .filter(c => c.future_potential === "High" && c.candidate_id !== bestOverall?.candidate_id && c.candidate_id !== safestBet?.candidate_id)
    .sort((a, b) => b.trajectory_score - a.trajectory_score)[0];

  const renderCandidateCard = (c: Candidate, title: string, icon: React.ReactNode, colorClass: string, bgClass: string, reasonTitle: string, reasonDesc: string) => {
    if (!c) return null;
    return (
      <Card className="relative overflow-hidden group p-4 flex flex-col h-full">
        <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.03] rounded-bl-full -mr-12 -mt-12 ${bgClass.split(' ')[0]} transition-transform duration-500 group-hover:scale-110`} />
        
        {/* Card Header */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "8px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {icon}
            <span style={{ fontSize: "9px" }} className={`font-bold uppercase tracking-widest ${colorClass}`}>{title}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 900, color: "var(--text-main)" }}>{c.candidate_id}</h3>
              <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{c.title}</p>
            </div>
            <div style={{ textAlign: "right", background: "var(--bg-card-hover)", border: "1px solid var(--border-main)", padding: "4px 10px", borderRadius: "8px" }}>
              <div style={{ fontSize: "15px", fontWeight: 900, color: "var(--text-main)" }}>{c.final_score.toFixed(1)}</div>
              <div style={{ fontSize: "8px", textTransform: "uppercase", color: "var(--text-muted)" }}>Final Score</div>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ padding: "8px 12px", background: "var(--bg-card-hover)", borderRadius: "8px", border: "1px solid var(--border-main)" }}>
            <h4 style={{ fontSize: "11px", fontWeight: 800, color: "var(--text-main)", marginBottom: "2px" }}>{reasonTitle}</h4>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.4 }}>{reasonDesc}</p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", textAlign: "center", flexShrink: 0 }}>
            <div style={{ background: "var(--bg-card-hover)", padding: "6px", borderRadius: "8px", border: "1px solid var(--border-main)" }}>
              <div style={{ fontSize: "8px", fontWeight: 700, color: "var(--text-muted)" }}>Match</div>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "var(--text-main)" }}>{c.match_score}</div>
            </div>
            <div style={{ background: "var(--bg-card-hover)", padding: "6px", borderRadius: "8px", border: "1px solid var(--border-main)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: "8px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "2px" }}>Risk</div>
              <Badge className={`text-[8px] px-1.5 py-0 border-none font-bold ${c.risk_level === 'High' ? 'bg-brand-danger/20 text-brand-danger' : c.risk_level === 'Medium' ? 'bg-brand-warning/20 text-brand-warning' : 'bg-brand-success/20 text-brand-success'}`}>
                {c.risk_level}
              </Badge>
            </div>
            <div style={{ background: "var(--bg-card-hover)", padding: "6px", borderRadius: "8px", border: "1px solid var(--border-main)" }}>
              <div style={{ fontSize: "8px", fontWeight: 700, color: "var(--text-muted)" }}>Potential</div>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "var(--brand)" }}>{c.future_potential}</div>
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
            <h4 style={{ fontSize: "9px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Top Signals</h4>
            <ul style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {c.reasons.slice(0, 2).map((r, i) => (
                <li key={i} style={{ display: "flex", alignItems: "start", gap: "6px", fontSize: "11px", color: "var(--text-main)" }}>
                  <CheckCircle2 style={{ width: "12px", height: "12px", color: "var(--brand)", marginTop: "2px", flexShrink: 0 }}/>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link href={`/candidate/${c.candidate_id}`} style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", border: "1px solid var(--border-main)", color: "var(--text-main)", fontSize: "11px", fontWeight: 700, borderRadius: "8px", height: "32px" }} className="bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card-hover)]/80 transition-colors flex-shrink-0">
            View Executive Profile <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>
      </Card>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", height: "100%", width: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "2px" }}>
            Executive<span style={{ color: "var(--brand)" }}>Recommendations</span>
          </h1>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500 }}>Top picks categorized by hiring strategy and risk profile</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0 overflow-y-auto p-1">
        {renderCandidateCard(
          bestOverall, 
          "Best Overall Match", 
          <Trophy className="w-4 h-4 text-brand-warning" />, 
          "text-brand-warning", 
          "bg-brand-warning",
          "Highest Ranking Score",
          "This candidate has the strongest alignment of core skills and experience out of the entire pipeline."
        )}

        {renderCandidateCard(
          safestBet, 
          "Safest Bet", 
          <ShieldCheck className="w-4 h-4 text-brand-success" />, 
          "text-brand-success", 
          "bg-brand-success",
          "Lowest Attrition Risk",
          "Excellent foundational match with zero red flags identified in behavior or flight-risk patterns."
        )}

        {renderCandidateCard(
          highestCeiling, 
          "Highest Ceiling", 
          <Rocket className="w-4 h-4 text-brand-primary" />, 
          "text-brand-primary", 
          "bg-brand-primary",
          "Exceptional Trajectory",
          "While there may be minor skill gaps, their semantic velocity and leadership indicators are off the charts."
        )}
      </div>
    </div>
  );
}
