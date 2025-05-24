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
const formatKey = (str) => str.replace(/\s+/g, "_");

const especes = data.map(item => formatKey(item.espece));
const years = data[0]?.yearly_production?.map(item => item.year) || [];

const transformedData = years.map(year => {
  const row = { year };
  data.forEach(item => {
    const key = formatKey(item.espece);
    const prod = item.yearly_production.find(p => p.year === year);
    row[key] = prod?.total_production || 0;
  });
  return row;
});


  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={transformedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          {especes.map((espece, i) => (
  <Line
    key={espece}
    type="natural"
    dataKey={espece}
    stroke={colors[i % colors.length]}
    name={espece.replace(/_/g, " ")} // show label with spaces again
    strokeWidth={2}
    dot={{ r: 3 }}
    activeDot={{ r: 5 }}
  />
))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


