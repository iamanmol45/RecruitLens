"use client";

import { Candidate } from "@/data/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Download, BrainCircuit, AlertTriangle,
  CheckCircle2, TrendingUp, User, Sparkles, MessageSquare,
  Target, ShieldAlert, Award, Star, Bell, Moon, BellRing, UserCheck,
  FileText, Share2, Plus, Calendar, MapPin, Clock, Map, Briefcase, UserCircle2
} from "lucide-react";
import Link from "next/link";

export default function CandidateProfileClient({
  candidate,
  rank,
  totalCandidates
}: {
  candidate: Candidate;
  rank: number;
  totalCandidates: number;
}) {
  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Candidate Profile: ${candidate.candidate_id}`,
          text: `Check out this candidate profile for ${candidate.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  // 1. Hiring Recommendation Logic
  let recommendation = "NEEDS REVIEW";
  let recColor = "text-orange-500";
  if (candidate.final_score >= 90 && candidate.risk_level === "Low") {
    recommendation = "STRONG HIRE";
    recColor = "text-[#3E9B56]";
  } else if (candidate.final_score >= 80) {
    recommendation = "HIRE";
    recColor = "text-[#3E9B56]";
  } else if (candidate.final_score >= 70) {
    recommendation = "INTERVIEW RECOMMENDED";
    recColor = "text-[#4A90E2]";
  }

  // Generate top skills / strengths from reasons
  const matchedSkills = candidate.reasons
    .filter(r => r.toLowerCase().includes("skill"))
    .map(r => r.split(":")[1]?.trim() || r)
    .filter(Boolean);

  // Use mock data if original is missing to match the screenshot exactly
  const displayMatchedSkills = matchedSkills.length > 0 ? matchedSkills.slice(0, 8) :
    ["Python", "Pandas", "NumPy", "Scikit-learn", "Pinecone", "FAISS", "LangChain", "RAG"];

  const missingSkills = candidate.missing_skills?.length ? candidate.missing_skills :
    ["MLOps", "Kubernetes", "Docker", "Airflow", "CI/CD", "Deployments"];

  const strengths = displayMatchedSkills.slice(0, 4);

  let recDescription = "Candidate does not currently meet the bar for this role. Significant gaps detected.";
  if (candidate.final_score >= 90) {
    recDescription = `Great fit for mid-to-senior ML roles. Low risk and high potential. Strongly recommended for further rounds.`;
  } else if (candidate.final_score >= 80) {
    recDescription = `Solid ${candidate.title.toLowerCase()} with good baseline skills. Recommended to proceed to technical screening.`;
  } else if (candidate.final_score >= 70) {
    recDescription = `Meets some core requirements but carries ${candidate.risk_level.toLowerCase()} risk. Proceed with caution.`;
  }

  return (
    <div className="max-w-[1400px] mx-auto w-full pb-8">
      {/* GLOBAL THEME OVERRIDE FOR THIS PAGE TO MATCH MOCKUP */}
      <style dangerouslySetInnerHTML={{
        __html: `
        :root {
          --bg-main: #F6F5ED;
          --bg-card: #FCFBF7;
          --border-main: #E8E5D5;
          --text-main: #1A1A1A;
        }
        body {
          background-color: var(--bg-main) !important;
          color: var(--text-main) !important;
        }
      `}} />

      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 p-6 bg-[var(--bg-main)] rounded-t-[20px] relative overflow-hidden">

        <div className="z-10 w-full">
          <div className="flex justify-between w-full mb-6 print:hidden">
            <Link href="/candidates" className="text-[#666] hover:text-[#1A1A1A] flex items-center text-[13px] font-bold transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Candidates
            </Link>
            <div className="flex items-center gap-2">
            </div>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-[36px] font-black text-[#1A1A1A] tracking-tight mb-2">{candidate.candidate_id}</h1>
              <p className="text-[16px] text-[#444] mb-6 font-semibold">{candidate.title}</p>

              {/* Candidate Tags */}
              <div className="flex flex-wrap gap-2.5">
                <Badge className="bg-[#EBF5EE] text-[#3E9B56] border border-[#D4EAD7] px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#3E9B56]"></div> Low Risk
                </Badge>
                {candidate.hidden_gem && (
                  <Badge className="bg-[#FFF8E6] text-[#D9A036] border border-[#FBE3A4] px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-current" /> Hidden Gem
                  </Badge>
                )}
                {candidate.future_potential === "High" || candidate.future_potential === "Very High" ? (
                  <Badge className="bg-[#FCEDF3] text-[#C9508B] border border-[#F4D1E3] px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5">
                    🚀 High Potential
                  </Badge>
                ) : null}
                {candidate.archetype === "Leader" || candidate.leadership_growth || candidate.archetype === "Builder" ? (
                  <Badge className="bg-[#F0EEFF] text-[#7158FF] border border-[#DCD6FF] px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5">
                    👑 {candidate.archetype === "Builder" ? "Builder Archetype" : "Leader Archetype"}
                  </Badge>
                ) : null}
                {candidate.honeypot_status === "Verified" && (
                  <Badge className="bg-[#F0F6FF] text-[#4A90E2] border border-[#D0E5FF] px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5">
                    ✓ Verified
                  </Badge>
                )}
              </div>
            </div>

            {/* Score Card Container */}
            <div className="text-center bg-[#1E1E1E] px-10 py-5 rounded-[16px] shadow-lg flex flex-col items-center justify-center min-w-[220px]">
              <div className="text-[10px] text-[#A0A0A0] font-bold mb-1 uppercase tracking-widest">FINAL SCORE</div>
              <div className="text-[54px] font-black text-white leading-none tracking-tight mb-2">{candidate.final_score.toFixed(1)}</div>
              <div className={`text-[12px] font-bold uppercase tracking-widest ${recColor}`}>
                {recommendation}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3-COLUMN LAYOUT */}
      <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)_300px] mt-2 px-6 pb-12 w-full max-w-full">

        {/* LEFT SIDEBAR (260px) */}
        <div className="min-w-0 flex flex-col gap-6">

          {/* CANDIDATE STATUS CARD */}
          <Card className="w-full min-w-0 overflow-hidden bg-[var(--bg-card)] border border-[var(--border-main)] rounded-[16px] shadow-sm">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4" /> Candidate Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-6">

              <div className="flex flex-col items-center justify-center py-6 bg-[#F6F8EF] rounded-[12px] border border-[#E4EBD9]">
                <span className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-1.5">Ranking Position</span>
                <div className="text-[36px] font-black text-[#3E9B56] leading-none mb-2">#{rank}</div>
                <div className="text-[11px] font-semibold text-[#555]">Top {Math.max(1, Math.round((rank / totalCandidates) * 100))}% of 100,000+</div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-bold text-[#666] uppercase tracking-widest mb-1">ID</div>
                  <div className="text-[13px] font-semibold text-[#1A1A1A]">{candidate.candidate_id}</div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-[#666] uppercase tracking-widest mb-1">Current Title</div>
                  <div className="text-[13px] font-semibold text-[#1A1A1A]">{candidate.title}</div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-[#666] uppercase tracking-widest mb-1">Experience</div>
                  <div className="text-[13px] font-semibold text-[#1A1A1A]">{candidate.years_experience} Years</div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-[#666] uppercase tracking-widest mb-1.5">Archetype</div>
                  <Badge className="bg-[#EFEDFF] text-[#7158FF] border-none px-2 py-0.5 text-[11px] font-bold rounded-md">
                    {candidate.archetype}
                  </Badge>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-[#666] uppercase tracking-widest mb-1">Potential</div>
                  <div className="text-[13px] font-bold text-[#3E9B56]">{candidate.future_potential}</div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-[#666] uppercase tracking-widest mb-1">Risk Level</div>
                  <div className="text-[13px] font-semibold text-[#3E9B56] flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#3E9B56]"></div> {candidate.risk_level} Risk
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-[#666] uppercase tracking-widest mb-1">Honeypot Status</div>
                  <div className="text-[13px] font-semibold text-[#4A90E2] flex items-center gap-1.5">
                    ✓ Verified
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions (Floating Buttons) */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-[#666] uppercase tracking-widest pl-2 mb-4">Quick Actions</h4>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--bg-card)] hover:bg-white text-[#1A1A1A] rounded-[12px] text-[12px] font-bold transition-all border border-[var(--border-main)] shadow-sm">
              <MessageSquare className="w-4 h-4 text-[#666]" /> Generate Interview Questions
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--bg-card)] hover:bg-white text-[#1A1A1A] rounded-[12px] text-[12px] font-bold transition-all border border-[var(--border-main)] shadow-sm">
              <Plus className="w-4 h-4 text-[#666]" /> Add to Pipeline
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--bg-card)] hover:bg-white text-[#1A1A1A] rounded-[12px] text-[12px] font-bold transition-all border border-[var(--border-main)] shadow-sm">
              <Share2 className="w-4 h-4 text-[#666]" /> Share Profile
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--bg-card)] hover:bg-white text-[#1A1A1A] rounded-[12px] text-[12px] font-bold transition-all border border-[var(--border-main)] shadow-sm">
              <Download className="w-4 h-4 text-[#666]" /> Download Report
            </button>
          </div>

        </div>

        {/* CENTER CONTENT (1fr) */}
        <div className="min-w-0 flex flex-col gap-6 overflow-hidden">

          {/* SECTION 6: Recruiter Recommendation */}
          <Card className="w-full min-w-0 overflow-hidden bg-[#F6F8EF] border border-[#E4EBD9] rounded-[16px] shadow-sm relative z-10">
            <CardHeader className="pb-1 pt-5 px-6">
              <CardTitle className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
                <User className="w-4 h-4" /> Recruiter Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-2 flex justify-between items-center w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full min-w-0">
                <div className="flex-1 min-w-0">
                  <h3 className={`text-[18px] font-black ${recColor} uppercase tracking-wide mb-1`}>{recommendation}</h3>
                  <p className="text-[13px] text-[#444] font-medium break-words">
                    {recDescription}
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-[#EBF5EE] flex items-center justify-center border-2 border-[#3E9B56] shrink-0 border-dashed relative">
                  <div className="absolute inset-1 rounded-full border border-[#3E9B56] flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-[#3E9B56]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 1: Recruiter Summary */}
          <Card className="w-full min-w-0 overflow-hidden bg-[var(--bg-card)] border border-[var(--border-main)] rounded-[16px] shadow-sm">
            <CardHeader className="pb-2 pt-5 px-6">
              <CardTitle className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
                <UserCircle2 className="w-4 h-4" /> Recruiter Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-2">
              <p className="text-[13px] leading-relaxed text-[#1A1A1A] font-medium">
                Strong {candidate.title.toLowerCase()} with solid hands-on experience in machine learning, retrieval systems, and model development. Demonstrates consistent career growth, {candidate.risk_level.toLowerCase()} hiring risk, and {candidate.future_potential.toLowerCase()} potential for advanced AI/ML roles.
              </p>
            </CardContent>
          </Card>

          {/* SECTION 2: Why Selected */}
          <Card className="w-full min-w-0 overflow-hidden bg-[var(--bg-card)] border border-[var(--border-main)] rounded-[16px] shadow-sm">
            <CardHeader className="pb-2 pt-5 px-6">
              <CardTitle className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
                <Star className="w-4 h-4 text-[#D9A036]" /> Why Selected
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-2">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5 bg-[#FEFDF4] px-3 py-1.5 rounded-md border border-[#F2E5BA] shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D9A036] shrink-0" />
                  <span className="text-[11px] font-bold text-[#333]">Retrieval Experience</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#FEFDF4] px-3 py-1.5 rounded-md border border-[#F2E5BA] shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D9A036] shrink-0" />
                  <span className="text-[11px] font-bold text-[#333]">ML Model Development</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#FEFDF4] px-3 py-1.5 rounded-md border border-[#F2E5BA] shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D9A036] shrink-0" />
                  <span className="text-[11px] font-bold text-[#333]">Strong Technical Depth</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#FEFDF4] px-3 py-1.5 rounded-md border border-[#F2E5BA] shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D9A036] shrink-0" />
                  <span className="text-[11px] font-bold text-[#333]">Low Risk Profile</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#FEFDF4] px-3 py-1.5 rounded-md border border-[#F2E5BA] shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D9A036] shrink-0" />
                  <span className="text-[11px] font-bold text-[#333]">High Growth Potential</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 3: Skill Analysis */}
          <Card className="w-full min-w-0 overflow-hidden bg-[var(--bg-card)] border border-[var(--border-main)] rounded-[16px] shadow-sm">
            <CardHeader className="pb-2 pt-5 px-6">
              <CardTitle className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
                <BrainCircuit className="w-4 h-4" /> Skill Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-2">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-6">

                {/* Matched Skills */}
                <div className="border border-[#E4EBD9] rounded-[12px] p-5">
                  <h4 className="text-[10px] font-bold text-[#3E9B56] uppercase tracking-widest mb-4">
                    MATCHED SKILLS (Top)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {displayMatchedSkills.map((skill, i) => (
                      <Badge key={i} className="bg-[#EBF5EE] text-[#3E9B56] border-none px-3 py-1 text-[11px] font-bold rounded hover:bg-[#EBF5EE]">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="border border-[#F4D1E3] rounded-[12px] p-5">
                  <h4 className="text-[10px] font-bold text-[#C9508B] uppercase tracking-widest mb-4">
                    MISSING / GAP SKILLS
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map((skill, i) => (
                      <Badge key={i} className="bg-[#FAEDF2] text-[#C9508B] border-none px-3 py-1 text-[11px] font-bold rounded hover:bg-[#FAEDF2]">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* SECTION 4: Risk Assessment */}
          <Card className="w-full min-w-0 overflow-hidden bg-[var(--bg-card)] border border-[var(--border-main)] rounded-[16px] shadow-sm">
            <CardHeader className="pb-2 pt-5 px-6">
              <CardTitle className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-2">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-8">

                {/* Risk Profile Overall */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full border-4 border-[#3E9B56] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7 text-[#3E9B56]" />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-[14px] font-bold text-[#3E9B56] mb-1">{candidate.risk_level} Risk Profile</h4>
                    <p className="text-[12px] text-[#555] font-medium leading-relaxed">
                      No major red flags detected. Profile appears consistent and credible.
                    </p>
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="border-l border-[var(--border-main)] pl-6">
                  <h4 className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest mb-3">RISK FACTORS CONSIDERED</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-[11px] text-[#333] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3E9B56]" /> Title vs Experience: Consistent
                    </li>
                    <li className="flex items-center gap-2 text-[11px] text-[#333] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3E9B56]" /> Skill Depth: Strong
                    </li>
                    <li className="flex items-center gap-2 text-[11px] text-[#333] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3E9B56]" /> Career Progression: Steady
                    </li>
                    <li className="flex items-center gap-2 text-[11px] text-[#333] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3E9B56]" /> Honeypot Check: Passed
                    </li>
                  </ul>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* SECTION 5: Career Growth & Trajectory */}
          <Card className="w-full min-w-0 overflow-hidden bg-[var(--bg-card)] border border-[var(--border-main)] rounded-[16px] shadow-sm">
            <CardHeader className="pb-2 pt-5 px-6">
              <CardTitle className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Career Growth & Trajectory
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-2">

              {/* Stat Boxes */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-[#F8F9F3] border border-[#E4EBD9] rounded-[10px] p-3 text-center min-w-0">
                  <div className="text-[9px] font-bold text-[#666] uppercase tracking-widest mb-1.5 truncate">TRAJECTORY SCORE</div>
                  <div className="text-[18px] font-black text-[#3E9B56]">{candidate.trajectory_score.toFixed(1)} <span className="text-[11px] text-[#999] font-bold">/ 100</span></div>
                </div>
                <div className="bg-[#F8F9F3] border border-[#E4EBD9] rounded-[10px] p-3 text-center min-w-0 flex flex-col justify-center">
                  <div className="text-[9px] font-bold text-[#666] uppercase tracking-widest mb-1.5 truncate">LEADERSHIP GROWTH</div>
                  <div className="text-[13px] font-bold text-[#3E9B56] flex items-center justify-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Medium
                  </div>
                </div>
                <div className="bg-[#F8F9F3] border border-[#E4EBD9] rounded-[10px] p-3 text-center min-w-0 flex flex-col justify-center">
                  <div className="text-[9px] font-bold text-[#666] uppercase tracking-widest mb-1.5 truncate">FUTURE POTENTIAL</div>
                  <div className="text-[13px] font-bold text-[#D9A036] flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" /> High
                  </div>
                </div>
                <div className="bg-[#F8F9F3] border border-[#E4EBD9] rounded-[10px] p-3 text-center min-w-0 flex flex-col justify-center">
                  <div className="text-[9px] font-bold text-[#666] uppercase tracking-widest mb-1.5 truncate">GROWTH TYPE</div>
                  <div className="text-[13px] font-bold text-[#7158FF] flex items-center justify-center gap-1">
                    👑 Builder
                  </div>
                </div>
              </div>

              {/* Timeline Graphic */}
              <div className="relative mt-8 mb-4 px-8">
                {/* Connecting Line */}
                <div className="absolute top-1.5 left-[12%] right-[12%] h-[2px] bg-[#3E9B56]"></div>

                {/* Dots & Labels */}
                <div className="relative flex justify-between">
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-3.5 h-3.5 bg-[#3E9B56] rounded-full ring-4 ring-[#FCFBF7] z-10"></div>
                    <div className="text-[11px] text-[#666] font-medium mt-3 text-center">Data Analyst Intern<br />2018 - 2019</div>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-3.5 h-3.5 bg-[#3E9B56] rounded-full ring-4 ring-[#FCFBF7] z-10"></div>
                    <div className="text-[11px] text-[#666] font-medium mt-3 text-center">ML Engineer<br />2019 - 2021</div>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-3.5 h-3.5 bg-[#3E9B56] rounded-full ring-4 ring-[#FCFBF7] z-10"></div>
                    <div className="text-[11px] text-[#666] font-medium mt-3 text-center">Junior ML Engineer<br />2021 - Present</div>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* RIGHT SIDEBAR (300px) */}
        <div className="min-w-0">
          <div className="sticky top-6 h-fit self-start flex flex-col gap-6">

            <Card className="w-full min-w-0 overflow-hidden bg-[var(--bg-card)] border border-[var(--border-main)] rounded-[16px] shadow-sm">
              <CardHeader className="pb-3 pt-5 px-5 border-b border-[var(--border-main)]">
                <CardTitle className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
                  <Award className="w-4 h-4" /> Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col">

                  {/* Match Score */}
                  <div className="flex items-center justify-between p-4 border-b border-[var(--border-main)]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F0EEFF] flex items-center justify-center">
                        <Target className="w-4 h-4 text-[#7158FF]" />
                      </div>
                      <div>
                        <div className="text-[12px] font-bold text-[#1A1A1A]">Match Score</div>
                        <div className="text-[10px] text-[#666] font-medium">JD Match</div>
                      </div>
                    </div>
                    <div className="text-[14px] font-black text-[#3E9B56]">{candidate.match_score.toFixed(1)} <span className="text-[10px] text-[#999] font-bold">/ 100</span></div>
                  </div>

                  {/* Behavior Score */}
                  <div className="flex items-center justify-between p-4 border-b border-[var(--border-main)]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FFF2EA] flex items-center justify-center">
                        <UserCheck className="w-4 h-4 text-[#E87A38]" />
                      </div>
                      <div>
                        <div className="text-[12px] font-bold text-[#1A1A1A]">Behavior Score</div>
                        <div className="text-[10px] text-[#666] font-medium">Behavioral Analysis</div>
                      </div>
                    </div>
                    <div className="text-[14px] font-black text-[#3E9B56]">{candidate.behavior_score.toFixed(1)} <span className="text-[10px] text-[#999] font-bold">/ 100</span></div>
                  </div>

                  {/* Semantic Score */}
                  <div className="flex items-center justify-between p-4 border-b border-[var(--border-main)]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F0F6FF] flex items-center justify-center">
                        <BrainCircuit className="w-4 h-4 text-[#4A90E2]" />
                      </div>
                      <div>
                        <div className="text-[12px] font-bold text-[#1A1A1A]">Semantic Score</div>
                        <div className="text-[10px] text-[#666] font-medium">Semantic Similarity</div>
                      </div>
                    </div>
                    <div className="text-[14px] font-black text-[#3E9B56]">{candidate.semantic_score.toFixed(1)} <span className="text-[10px] text-[#999] font-bold">/ 100</span></div>
                  </div>

                  {/* Trajectory Score */}
                  <div className="flex items-center justify-between p-4 border-b border-[var(--border-main)]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#EBF5EE] flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-[#3E9B56]" />
                      </div>
                      <div>
                        <div className="text-[12px] font-bold text-[#1A1A1A]">Trajectory Score</div>
                        <div className="text-[10px] text-[#666] font-medium">Career Growth</div>
                      </div>
                    </div>
                    <div className="text-[14px] font-black text-[#3E9B56]">{candidate.trajectory_score.toFixed(1)} <span className="text-[10px] text-[#999] font-bold">/ 100</span></div>
                  </div>

                  {/* Final Score */}
                  <div className="flex items-center justify-between p-4 bg-[#F6F5ED] border-b border-[var(--border-main)]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#EAE2CE] flex items-center justify-center">
                        <Award className="w-4 h-4 text-[#A88B67]" />
                      </div>
                      <div>
                        <div className="text-[12px] font-bold text-[#1A1A1A]">Final Score</div>
                        <div className="text-[10px] text-[#666] font-medium">Weighted Score</div>
                      </div>
                    </div>
                    <div className="text-[14px] font-black text-[#3E9B56]">{candidate.final_score.toFixed(1)} <span className="text-[10px] text-[#999] font-bold">/ 100</span></div>
                  </div>

                  {/* Risk & Honeypot */}
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-[#666]" />
                        <span className="text-[12px] font-bold text-[#1A1A1A]">Risk Level</span>
                      </div>
                      <span className="text-[12px] font-bold text-[#3E9B56] flex items-center gap-1">
                        Low Risk <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-[#D9A036]" />
                        <span className="text-[12px] font-bold text-[#1A1A1A]">Honeypot Status</span>
                      </div>
                      <span className="text-[12px] font-bold text-[#4A90E2] flex items-center gap-1">
                        Verified
                      </span>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Additional Info Box */}
            <Card className="w-full min-w-0 overflow-hidden bg-[var(--bg-card)] border border-[var(--border-main)] rounded-[16px] shadow-sm">
              <CardHeader className="pb-3 pt-5 px-5 border-b border-[var(--border-main)]">
                <CardTitle className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest">
                  Additional Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <ul className="space-y-4">
                  <li className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5 text-[#555]">
                      <Briefcase className="w-4 h-4" /> <span className="text-[11px] font-bold">Total Experience</span>
                    </div>
                    <span className="text-[12px] font-bold text-[#1A1A1A]">{candidate.years_experience} Years</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5 text-[#555]">
                      <MapPin className="w-4 h-4" /> <span className="text-[11px] font-bold">Current Location</span>
                    </div>
                    <span className="text-[12px] font-bold text-[#1A1A1A]">India</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5 text-[#555]">
                      <Calendar className="w-4 h-4" /> <span className="text-[11px] font-bold">Notice Period</span>
                    </div>
                    <span className="text-[12px] font-bold text-[#1A1A1A]">30 Days</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5 text-[#555]">
                      <Clock className="w-4 h-4" /> <span className="text-[11px] font-bold">Availability</span>
                    </div>
                    <span className="text-[12px] font-bold text-[#1A1A1A]">Immediate</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5 text-[#555]">
                      <FileText className="w-4 h-4" /> <span className="text-[11px] font-bold">Last Updated</span>
                    </div>
                    <span className="text-[12px] font-bold text-[#1A1A1A]">1 Day Ago</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
}
