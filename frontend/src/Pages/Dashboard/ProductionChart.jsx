import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

const colors = ["#4f46e5", "#16a34a", "#f59e0b", "#dc2626", "#0ea5e9", "#9333ea"];

export default function ProductionChart({ data }) {
  
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
   {data.length > 0 &&
  Object.keys(data[0])
    .filter((key) => key !== "year")
    .map((key, index) => (
      <Line
        key={key}
        type="monotone"
        dataKey={key}
        stroke={colors[index % colors.length]}
        strokeWidth={2}
        dot={false}
      />
    ))}


        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}




