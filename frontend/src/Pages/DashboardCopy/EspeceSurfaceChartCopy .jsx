
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

const EspeceSurfaceChartCopy = ({ data }) => {


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
          <Bar dataKey="total_sup_labouree" fill="#1D4ED8" name="Produits fabriqués" />
<Bar dataKey="total_sup_emblavee" fill="#3B82F6" name="Produits en stock" />
<Bar dataKey="total_sup_recoltee" fill="#8B5CF6" name="Produits vendus" />
<Bar dataKey="total_sup_sinistree" fill="#55eaf7ff" name="Pertes" />
<Bar dataKey="total_sup_deserbee" fill="#f463d2ff" name="Produits retournés" />


        </BarChart>
      </ResponsiveContainer>
</div>
  );
};

export default EspeceSurfaceChartCopy;
