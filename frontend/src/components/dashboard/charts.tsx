"use client";

import { useState, useEffect } from "react";
import { Candidate } from "@/data/loader";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from "recharts";

interface DashboardChartsProps {
  candidates: Candidate[];
}

export function DashboardCharts({ candidates }: DashboardChartsProps) {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.classList.contains("light"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // 1. Aggregate Risk
  const risks = candidates.reduce((acc, c) => {
    acc[c.risk_level] = (acc[c.risk_level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const riskData = Object.keys(risks).map(k => ({ name: k, value: risks[k] }));

  // 2. Aggregate Potential
  const potential = candidates.reduce((acc, c) => {
    acc[c.future_potential] = (acc[c.future_potential] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const potentialData = Object.keys(potential).map(k => ({ name: k, value: potential[k] }));

  // 3. Aggregate Archetype
  const archetypes = candidates.reduce((acc, c) => {
    acc[c.archetype] = (acc[c.archetype] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const archetypeData = Object.keys(archetypes).map(k => ({ name: k, value: archetypes[k] }));

  // 4. Aggregate Behavior (buckets)
  const behaviorBuckets = [
    { name: "< 60", count: 0 },
    { name: "60-70", count: 0 },
    { name: "70-80", count: 0 },
    { name: "80-90", count: 0 },
    { name: "> 90", count: 0 },
  ];
  candidates.forEach(c => {
    if (c.behavior_score < 60) behaviorBuckets[0].count++;
    else if (c.behavior_score < 70) behaviorBuckets[1].count++;
    else if (c.behavior_score < 80) behaviorBuckets[2].count++;
    else if (c.behavior_score < 90) behaviorBuckets[3].count++;
    else behaviorBuckets[4].count++;
  });

  const COLORS = isLight
    ? ['#7C5CFF', '#10B981', '#34D399', '#F59E0B', '#EF4444']
    : ['#7C5CFF', '#FF6500', '#10B981', '#F59E0B', '#EF4444'];
  const RISK_COLORS: Record<string, string> = { "Low": "#10B981", "Medium": "#F59E0B", "High": "#EF4444" };
  const brandHazeColor = isLight ? "rgba(16,185,129,0.06)" : "rgba(255,101,0,0.06)";
  const brandColor = isLight ? "#10B981" : "#FF6500";
  const axisStroke = isLight ? "#9CA3AF" : "#555";
  const gridStroke = isLight ? "#E5E7EB" : "#1E1E1E";

  const tooltipStyle = {
    backgroundColor: isLight ? "#FFFFFF" : "#1A1A1A",
    border: isLight ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,101,0,0.3)",
    borderRadius: "10px",
    color: isLight ? "#1F2937" : "#F5F5F5",
    padding: "6px 10px",
    fontSize: "11px",
    boxShadow: isLight ? "0 4px 12px rgba(0,0,0,0.08)" : "0 8px 24px rgba(0,0,0,0.60)",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">

      {/* Risk Distribution */}
      <div className="dash-card rounded-[16px] p-4 flex flex-col relative overflow-hidden min-h-0">
        <div style={{
          position: "absolute", top: "-20px", right: "-20px",
          width: "80px", height: "80px", borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)"
        }} />
        <h3 className="text-[12px] font-black uppercase tracking-wider mb-1 flex-shrink-0" style={{ color: isLight ? "var(--text-main)" : "#E5E7EB" }}>
          Risk Distribution
        </h3>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={riskData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={4} dataKey="value">
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name] || COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.02)" />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend verticalAlign="bottom" height={20} wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', color: '#94A3B8', paddingTop: '4px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Archetype Distribution */}
      <div className="dash-card rounded-[16px] p-4 flex flex-col relative overflow-hidden min-h-0">
        <div style={{
          position: "absolute", top: "-20px", right: "-20px",
          width: "80px", height: "80px", borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(circle, rgba(124,92,255,0.06) 0%, transparent 70%)"
        }} />
        <h3 className="text-[12px] font-black uppercase tracking-wider mb-1 flex-shrink-0" style={{ color: isLight ? "var(--text-main)" : "#E5E7EB" }}>
          Archetype Distribution
        </h3>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={archetypeData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={4} dataKey="value">
                {archetypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.02)" />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend verticalAlign="bottom" height={20} wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', color: '#94A3B8', paddingTop: '4px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Potential Distribution */}
      <div className="dash-card rounded-[16px] p-4 flex flex-col relative overflow-hidden min-h-0">
        <div style={{
          position: "absolute", top: "-20px", right: "-20px",
          width: "80px", height: "80px", borderRadius: "50%", pointerEvents: "none",
          background: `radial-gradient(circle, ${brandHazeColor} 0%, transparent 70%)`
        }} />
        <h3 className="text-[12px] font-black uppercase tracking-wider mb-2 flex-shrink-0" style={{ color: isLight ? "var(--text-main)" : "#E5E7EB" }}>
          Potential Distribution
        </h3>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={potentialData} margin={{ top: 4, right: 6, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="name" stroke={axisStroke} fontSize={8} tickLine={false} axisLine={false} fontWeight="bold" />
              <YAxis stroke={axisStroke} fontSize={8} tickLine={false} axisLine={false} fontWeight="bold" width={22} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill={brandColor} radius={[3, 3, 0, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Behavior Score Distribution */}
      <div className="dash-card rounded-[16px] p-4 flex flex-col relative overflow-hidden min-h-0">
        <div style={{
          position: "absolute", top: "-20px", right: "-20px",
          width: "80px", height: "80px", borderRadius: "50%", pointerEvents: "none",
          background: `radial-gradient(circle, ${brandHazeColor} 0%, transparent 70%)`
        }} />
        <h3 className="text-[12px] font-black uppercase tracking-wider mb-2 flex-shrink-0" style={{ color: isLight ? "var(--text-main)" : "#E5E7EB" }}>
          Behavior Score Range
        </h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={behaviorBuckets} margin={{ top: 4, right: 6, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="name" stroke={axisStroke} fontSize={8} tickLine={false} axisLine={false} fontWeight="bold" />
              <YAxis stroke={axisStroke} fontSize={8} tickLine={false} axisLine={false} fontWeight="bold" width={22} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="count" stroke={brandColor} strokeWidth={2} dot={{ r: 3, fill: brandColor, strokeWidth: 0 }} activeDot={{ r: 5, fill: '#fff', stroke: brandColor, strokeWidth: 1.5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

