
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const EspeceSurfaceChart = ({ data }) => {


  return (
     <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
       <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
         
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="espece_nom" />
          <YAxis dataKey="total_superficie"/>
          <Tooltip />
          <Legend />
          <Bar dataKey="total_sup_labouree" fill="#4f46e5" name="Labourée" />
          <Bar dataKey="total_sup_emblavee" fill="#16a34a" name="Emblavée" />
          <Bar dataKey="total_sup_recoltee" fill="#f59e0b" name="Récoltée" />
          <Bar dataKey="total_sup_sinistree" fill="#dc2626" name="Sinistrée" />
          <Bar dataKey="total_sup_deserbee" fill="#0ea5e9" name="Désherbée" />
        </BarChart>
      </ResponsiveContainer>
</div>
  );
};

export default EspeceSurfaceChart;
