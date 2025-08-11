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

const colors = [
  "#1D4ED8", // Produits fabriqués (dark blue)
  "#3B82F6", // Produits en stock (bright blue)
  "#8B5CF6", // Produits vendus (violet)
  "#55EAF7", // Pertes (cyan clair)
  "#F463D2", // Produits retournés (rose-mauve)
];


// Données avec variations imprévisibles
const salesData = [
  { year: 2021, Smartphones: 1200, Laptops: 950, Accessories: 1500, "Services": 700 },
  { year: 2022, Smartphones: 1600, Laptops: 1400, Accessories: 1100, "Services": 900 },
  { year: 2023, Smartphones: 1000, Laptops: 1700, Accessories: 1800, "Services": 850 },
  { year: 2024, Smartphones: 1800, Laptops: 1300, Accessories: 1200, "Services": 1500 },
  { year: 2025, Smartphones: 1400, Laptops: 900, Accessories: 2000, "Services": 1300 },
];

export default function ProductionChartCopy() {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={salesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          {salesData.length > 0 &&
            Object.keys(salesData[0])
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




