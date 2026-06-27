import { getCandidates } from "@/data/loader";
import {
  Award, ArrowRight, CheckCircle2
} from "lucide-react";
import { DashboardCharts } from "@/components/dashboard/charts";
import { TopTalentLeaderboard } from "@/components/dashboard/podium";

export default function DashboardPage() {
  const candidates = getCandidates();

  const totalCandidates = candidates.length;
  const topScore = candidates.length > 0 ? Math.max(...candidates.map(c => c.final_score)) : 0;
  const hiddenGems = candidates.filter(c => c.hidden_gem).length;
  const highPotential = candidates.filter(
    c => c.future_potential === "Very High" || c.future_potential === "High"
  ).length;
  const bestCandidate = [...candidates].sort((a, b) => b.final_score - a.final_score)[0];

  /* ── shared inline style tokens ── */
  const orange = "var(--brand)";
  const orangeDim = "var(--brand-dim)";
  const muted = "var(--text-muted)";
  const mutedLight = "var(--text-muted-light)";
  const cardBg = "var(--bg-card)";
  const borderCol = "var(--border-main)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", height: "100%", width: "100%" }}>

      {/* ── ROW 1: Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "2px" }}>
            Recruit<span style={{ color: orange }}>Lens</span>
          </h1>
          <p style={{ fontSize: "11px", color: muted, fontWeight: 500 }}>See Beyond the Resume</p>
        </div>
      </div>

      {/* ── ROW 2: Recommendation Banner ── */}
      {bestCandidate && (
        <div className="dash-card-rec" style={{ flexShrink: 0, padding: "14px 20px", position: "relative", overflow: "hidden" }}>
          {/* Accent radial right */}
          <div style={{
            position: "absolute", right: 0, top: 0, width: "200px", height: "100%", pointerEvents: "none",
            background: "radial-gradient(ellipse at right center, var(--brand-dim), transparent 70%)"
          }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                  <Award style={{ width: "12px", height: "12px", color: orange }} />
                  <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.16em", color: orange }}>
                    Top Recommendation
                  </span>
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 900, color: "var(--text-main)", letterSpacing: "-0.02em" }}>
                  Candidate: {bestCandidate.candidate_id}
                </h3>
              </div>
              <div style={{ display: "flex", gap: "12px", fontSize: "11px", fontWeight: 500, color: mutedLight }}>
                {["Semantic match", "Low risk", "High potential"].map(t => (
                  <span key={t} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 style={{ width: "11px", height: "11px", color: orange }} /> {t}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: "30px", fontWeight: 900, color: orange, lineHeight: 1, textShadow: "0 0 24px var(--brand-dim)" }}>
                96<span style={{ fontSize: "18px" }}>%</span>
              </div>
              <div style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: mutedLight }}>
                Confidence
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ROW 3: Pipeline + Metric Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px", flexShrink: 0 }}>

        {/* Pipeline */}
        <div className="dash-card-track" style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
          {[
            { count: "100", label: "Candidates", isOrange: false },
            { count: "67", label: "Qualified", isOrange: false },
            { count: "25", label: "Strong", isOrange: true },
            { count: "10", label: "Finalists", isOrange: true },
            { count: "1", label: "Hired", isOrange: true, bright: true },
          ].map((s, i, arr) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px", fontWeight: 900,
                  background: s.bright ? orange : s.isOrange ? "var(--brand-dim)" : "var(--bg-card-hover)",
                  color: s.bright ? "#fff" : s.isOrange ? orange : "var(--text-muted-light)",
                  border: `1px solid ${s.isOrange ? "var(--border-hover)" : "var(--border-main)"}`,
                  boxShadow: s.bright ? "0 0 16px var(--brand-shadow)" : "none"
                }}>
                  {s.count}
                </div>
                <span style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: s.isOrange ? orangeDim : "var(--text-muted)" }}>
                  {s.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <ArrowRight style={{ width: "13px", height: "13px", color: "var(--border-main)", marginBottom: "16px" }} />
              )}
            </div>
          ))}
        </div>

        {/* 4 Metric cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px" }}>
          {[
            { label: "Evaluated", value: totalCandidates, sub: "Candidates", accent: orange, isOrange: true },
            { label: "Top Score", value: topScore.toFixed(1), sub: "Match Score", accent: orange, isOrange: true },
            { label: "Hidden Gems", value: hiddenGems, sub: "Discovered", accent: orange, isOrange: true },
            { label: "High Potential", value: highPotential, sub: "Candidates", accent: orange, isOrange: true },
          ].map(({ label, value, sub, accent, isOrange }) => (
            <div key={label} className={isOrange ? "dash-card-orange" : "dash-card"}
              style={{ padding: "12px 14px", position: "relative", overflow: "hidden" }}>
              {isOrange && (
                <div style={{
                  position: "absolute", top: "-18px", right: "-18px",
                  width: "80px", height: "80px", borderRadius: "50%", pointerEvents: "none",
                  background: "radial-gradient(circle, var(--brand-dim) 0%, transparent 70%)"
                }} />
              )}
              <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", marginBottom: "6px" }}>
                  <div style={{
                    width: "5px", height: "5px", borderRadius: "50%",
                    background: isOrange ? orange : "var(--text-muted)",
                    boxShadow: isOrange ? "0 0 6px var(--brand-shadow)" : "none"
                  }} />
                  <span style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: mutedLight }}>
                    {label}
                  </span>
                </div>
                <div style={{ fontSize: "26px", fontWeight: 900, color: accent, letterSpacing: "-0.03em", lineHeight: 1, textShadow: isOrange ? "0 0 20px var(--brand-dim)" : "none" }}>
                  {value}
                </div>
                <div style={{ fontSize: "10px", color: muted, marginTop: "2px" }}>{sub}</div>
                <div style={{ marginTop: "8px", height: "2px", width: "28px", borderRadius: "1px", background: isOrange ? `linear-gradient(90deg, transparent, ${orange}, transparent)` : "var(--border-main)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ROW 4: Charts + Right Leaderboard Panel (flex-1) ── */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_1fr_280px] gap-[10px]">

        {/* 4 Analytics Charts — 2 col spans on desktop */}
        <div className="lg:col-span-2 min-h-0">
          <DashboardCharts candidates={candidates} />
        </div>

        {/* Right Leaderboard Panel */}
        <div className="min-h-0">
          <TopTalentLeaderboard candidates={candidates} />
        </div>

      </div>

    </div>
  );
}
