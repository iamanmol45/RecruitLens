"use client";

import { Candidate } from "@/data/loader";
import { Trophy, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface TopTalentLeaderboardProps {
  candidates: Candidate[];
}

export function TopTalentLeaderboard({ candidates }: TopTalentLeaderboardProps) {
  // Sort candidates by final_score descending
  const sortedCandidates = [...candidates].sort((a, b) => b.final_score - a.final_score);

  // Top 3 for visual podium
  const top3 = sortedCandidates.slice(0, 3);
  const c1 = top3[0]; // 1st
  const c2 = top3[1]; // 2nd
  const c3 = top3[2]; // 3rd

  // Top 5 for list view
  const top5 = sortedCandidates.slice(0, 5);

  // Vibrant podium colors
  const gold = { main: "#F59E0B", dim: "rgba(245,158,11,0.18)", border: "rgba(245,158,11,0.55)", text: "#FCD34D" };
  const silver = { main: "#94A3B8", dim: "rgba(148,163,184,0.18)", border: "rgba(148,163,184,0.55)", text: "#CBD5E1" };
  const bronze = { main: "#C084FC", dim: "rgba(192,132,252,0.18)", border: "rgba(192,132,252,0.55)", text: "#DDA0F5" };

  return (
    <div className="dash-card p-4 flex flex-col relative overflow-hidden h-full min-h-0">
      {/* Decorative radial brand glow */}
      <div style={{
        position: "absolute", top: "-20px", right: "-20px",
        width: "130px", height: "130px", borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(circle, var(--brand-dim) 0%, transparent 70%)"
      }} />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <Trophy className="w-4 h-4" style={{ color: gold.main }} />
        <h3 className="text-[13px] font-black uppercase tracking-wider" style={{ color: "var(--text-main)" }}>
          Top Talent Leaderboard
        </h3>
      </div>

      {/* Visual Podium Section */}
      <div className="flex items-end justify-center gap-3 flex-shrink-0 h-[145px] pb-1 pt-2 select-none mb-3"
        style={{ borderBottom: "1px solid var(--border-main)" }}>

        {/* 2nd Place Pillar — Silver */}
        {c2 && (
          <div className="flex flex-col items-center flex-1 max-w-[85px]">
            <div className="text-center mb-1 flex flex-col items-center">
              <span className="text-[10px] font-bold truncate max-w-[75px]" style={{ color: silver.text }}>
                {c2.candidate_id.replace("CAND_", "")}
              </span>
              <span className="text-[13px] font-black" style={{ color: silver.text }}>
                {c2.final_score.toFixed(1)}
              </span>
            </div>
            {/* Pillar stand */}
            <div
              className="w-full rounded-t-md flex flex-col items-center justify-between p-1.5 h-[65px]"
              style={{
                background: `linear-gradient(to bottom, ${silver.dim}, rgba(148,163,184,0.04))`,
                borderTop: `3px solid ${silver.main}`,
                borderLeft: `1px solid ${silver.border}`,
                borderRight: `1px solid ${silver.border}`,
                boxShadow: `0 0 12px ${silver.dim}`,
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black"
                style={{ background: silver.dim, border: `1px solid ${silver.border}`, color: silver.text }}
              >
                2
              </div>
              <span className="text-[8px] font-extrabold tracking-wider uppercase" style={{ color: silver.text }}>2nd</span>
            </div>
          </div>
        )}

        {/* 1st Place Pillar — Gold */}
        {c1 && (
          <div className="flex flex-col items-center flex-1 max-w-[90px]">
            <div className="text-center mb-1 flex flex-col items-center">
              <span className="text-[10px] font-extrabold truncate max-w-[80px]" style={{ color: gold.main }}>
                {c1.candidate_id.replace("CAND_", "")}
              </span>
              <span className="text-[15px] font-black" style={{ color: gold.main, textShadow: `0 0 10px ${gold.dim}` }}>
                {c1.final_score.toFixed(1)}
              </span>
            </div>
            {/* Pillar stand */}
            <div
              className="w-full rounded-t-md flex flex-col items-center justify-between p-1.5 h-[90px]"
              style={{
                background: `linear-gradient(to bottom, ${gold.dim}, rgba(245,158,11,0.04))`,
                borderTop: `3px solid ${gold.main}`,
                borderLeft: `1px solid ${gold.border}`,
                borderRight: `1px solid ${gold.border}`,
                boxShadow: `0 0 20px ${gold.dim}, 0 -4px 20px rgba(245,158,11,0.12)`,
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
                style={{ background: gold.dim, border: `1px solid ${gold.border}`, color: gold.main }}
              >
                1
              </div>
              <span className="text-[8px] font-extrabold tracking-wider uppercase" style={{ color: gold.main }}>1st</span>
            </div>
          </div>
        )}

        {/* 3rd Place Pillar — Purple */}
        {c3 && (
          <div className="flex flex-col items-center flex-1 max-w-[85px]">
            <div className="text-center mb-1 flex flex-col items-center">
              <span className="text-[10px] font-bold truncate max-w-[75px]" style={{ color: bronze.text }}>
                {c3.candidate_id.replace("CAND_", "")}
              </span>
              <span className="text-[13px] font-black" style={{ color: bronze.text }}>
                {c3.final_score.toFixed(1)}
              </span>
            </div>
            {/* Pillar stand */}
            <div
              className="w-full rounded-t-md flex flex-col items-center justify-between p-1.5 h-[45px]"
              style={{
                background: `linear-gradient(to bottom, ${bronze.dim}, rgba(192,132,252,0.03))`,
                borderTop: `3px solid ${bronze.main}`,
                borderLeft: `1px solid ${bronze.border}`,
                borderRight: `1px solid ${bronze.border}`,
                boxShadow: `0 0 12px ${bronze.dim}`,
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black"
                style={{ background: bronze.dim, border: `1px solid ${bronze.border}`, color: bronze.text }}
              >
                3
              </div>
              <span className="text-[8px] font-extrabold tracking-wider uppercase" style={{ color: bronze.text }}>3rd</span>
            </div>
          </div>
        )}

      </div>

      {/* List Table Section */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="text-[9px] font-extrabold tracking-wider uppercase mb-2 flex justify-between px-1"
          style={{ color: "var(--text-muted)" }}>
          <span>Candidate</span>
          <div className="flex gap-4">
            <span className="w-10 text-right">Match</span>
            <span className="w-10 text-right">Score</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-0.5 space-y-1.5">
          {top5.map((c, idx) => {
            const rankInfo = [
              { bg: gold.dim, border: gold.border, color: gold.main },
              { bg: silver.dim, border: silver.border, color: silver.text },
              { bg: bronze.dim, border: bronze.border, color: bronze.text },
              { bg: "rgba(100,100,100,0.12)", border: "rgba(150,150,150,0.25)", color: "var(--text-muted)" },
              { bg: "rgba(100,100,100,0.08)", border: "rgba(150,150,150,0.18)", color: "var(--text-muted)" },
            ][idx] ?? { bg: "transparent", border: "var(--border-main)", color: "var(--text-muted)" };

            return (
              <Link
                href={`/candidate/${c.candidate_id}`}
                key={c.candidate_id}
                className="flex items-center justify-between p-1.5 rounded-lg border transition-all duration-200 group"
                style={{
                  background: "var(--bg-card-hover)",
                  borderColor: "var(--border-main)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)";
                  (e.currentTarget as HTMLElement).style.background = "var(--bg-card-hover)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-main)";
                  (e.currentTarget as HTMLElement).style.background = "var(--bg-card-hover)";
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {/* Rank Badge */}
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    style={{ background: rankInfo.bg, border: `1px solid ${rankInfo.border}`, color: rankInfo.color }}
                  >
                    {idx + 1}
                  </span>

                  {/* Candidate Name / ID */}
                  <span className="text-[11px] font-semibold truncate transition-colors"
                    style={{ color: "var(--text-main)" }}>
                    {c.candidate_id}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[11px] font-bold flex-shrink-0">
                  <span className="w-10 text-right font-medium" style={{ color: "var(--text-muted)" }}>
                    {c.match_score}%
                  </span>
                  <span className="w-10 text-right flex items-center justify-end gap-0.5"
                    style={{ color: idx === 0 ? gold.main : "var(--text-main)", fontWeight: idx === 0 ? 900 : 700 }}>
                    {c.final_score.toFixed(1)}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
