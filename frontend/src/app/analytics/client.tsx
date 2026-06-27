"use client";

import { Candidate } from "@/data/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from "recharts";

export default function AnalyticsClient({ candidates }: { candidates: Candidate[] }) {

  // Aggregate Risk
  const risks = candidates.reduce((acc, c) => {
    acc[c.risk_level] = (acc[c.risk_level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const riskData = Object.keys(risks).map(k => ({ name: k, value: risks[k] }));

  // Aggregate Potential
  const potential = candidates.reduce((acc, c) => {
    acc[c.future_potential] = (acc[c.future_potential] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const potentialData = Object.keys(potential).map(k => ({ name: k, value: potential[k] }));

  // Aggregate Archetype
  const archetypes = candidates.reduce((acc, c) => {
    acc[c.archetype] = (acc[c.archetype] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const archetypeData = Object.keys(archetypes).map(k => ({ name: k, value: archetypes[k] }));

  // Aggregate Behavior (buckets)
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

  const COLORS = ['#7C5CFF', '#9F7AEA', '#10B981', '#F59E0B', '#EF4444'];
  const RISK_COLORS: Record<string, string> = { "Low": "#10B981", "Medium": "#F59E0B", "High": "#EF4444" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", height: "100%", width: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "2px" }}>
            Talent<span style={{ color: "#FF6500" }}>Analytics</span>
          </h1>
          <p style={{ fontSize: "11px", color: "#555", fontWeight: 500 }}>Deep dive into your candidate pool distribution and metrics</p>
        </div>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "10px" }}>
        
        {/* Risk Distribution */}
        <Card className="p-4 flex flex-col relative overflow-hidden">
          <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#E0E0E0", marginBottom: "10px", flexShrink: 0 }}>
            Risk Distribution
          </h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name] || COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.05)" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', color: '#fff' }} />
                <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#94A3B8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Archetype Distribution */}
        <Card className="p-4 flex flex-col relative overflow-hidden">
          <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#E0E0E0", marginBottom: "10px", flexShrink: 0 }}>
            Archetype Distribution
          </h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={archetypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value" label={{ fill: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                  {archetypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.05)" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', color: '#fff' }} />
                <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#94A3B8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Potential Distribution */}
        <Card className="p-4 flex flex-col relative overflow-hidden">
          <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#E0E0E0", marginBottom: "10px", flexShrink: 0 }}>
            Potential Distribution
          </h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={potentialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} fontWeight="bold" />
                <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} fontWeight="bold" />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', color: '#fff' }} />
                <Bar dataKey="value" fill="#FF6500" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Behavior Score Distribution */}
        <Card className="p-4 flex flex-col relative overflow-hidden">
          <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#E0E0E0", marginBottom: "10px", flexShrink: 0 }}>
            Behavior Score Range
          </h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={behaviorBuckets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} fontWeight="bold" />
                <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} fontWeight="bold" />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', color: '#fff' }} />
                <Line type="monotone" dataKey="count" stroke="#FF6500" strokeWidth={2.5} dot={{ r: 4, fill: '#FF6500', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#fff', stroke: '#FF6500', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
