import { RadialBar, RadialBarChart, PolarAngleAxis, ResponsiveContainer } from "recharts";

export function ToneGauge({ score }: { score: number }) {
  return (
    <div className="h-52 w-full">
      <ResponsiveContainer>
        <RadialBarChart innerRadius="65%" outerRadius="95%" data={[{ value: score }]} startAngle={180} endAngle={0}>
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar dataKey="value" fill="#8b9cfb" cornerRadius={8} background />
          <text x="50%" y="58%" textAnchor="middle" className="fill-white text-xl">{score}</text>
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
