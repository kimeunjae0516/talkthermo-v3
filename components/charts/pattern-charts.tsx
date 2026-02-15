"use client";

import { AnalysisRecord } from "@/types/domain";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

export function PatternCharts({ records }: { records: AnalysisRecord[] }) {
  const trend = records.map((r) => ({ x: new Date(r.createdAt).toLocaleDateString(), score: r.toneScore }));
  const tagsMap = new Map<string, number>();
  records.forEach((r) => r.conflictTags.forEach((t) => tagsMap.set(t, (tagsMap.get(t) ?? 0) + 1)));
  const tags = [...tagsMap.entries()].map(([tag, count]) => ({ tag, count }));
  const styleMap = new Map<string, number>();
  records.forEach((r) => r.selectedSuggestionStyle && styleMap.set(r.selectedSuggestionStyle, (styleMap.get(r.selectedSuggestionStyle) ?? 0) + 1));
  const pie = [...styleMap.entries()].map(([name, value]) => ({ name, value }));

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="h-64 rounded-xl border border-white/10 p-2"><ResponsiveContainer><LineChart data={trend}><XAxis dataKey="x" /><YAxis domain={[0,100]} /><Tooltip /><Line type="monotone" dataKey="score" stroke="#8b9cfb" /></LineChart></ResponsiveContainer></div>
      <div className="h-64 rounded-xl border border-white/10 p-2"><ResponsiveContainer><BarChart data={tags}><XAxis dataKey="tag" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#82ca9d" /></BarChart></ResponsiveContainer></div>
      <div className="h-64 rounded-xl border border-white/10 p-2"><ResponsiveContainer><PieChart><Pie data={pie} dataKey="value" nameKey="name" outerRadius={80}>{pie.map((_, i)=><Cell key={i} fill={["#8b9cfb", "#82ca9d", "#ffc658"][i%3]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
    </div>
  );
}
