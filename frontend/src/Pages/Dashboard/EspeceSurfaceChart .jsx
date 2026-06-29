import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const BAR_COLORS = {
  total_sup_labouree: '#FACC15',
  total_sup_emblavee: '#FB923C',
  total_sup_recoltee: '#38BDF8',
  total_sup_sinistree: '#F472B6',
  total_sup_deserbee: '#A3E635',
};

const EspeceSurfaceChart = ({ data }) => (
  <div style={{ width: '100%', height: '100%' }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis dataKey="espece_nom" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={40} />
        <Tooltip
          contentStyle={{
            borderRadius: '10px',
            border: 'none',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            fontSize: '12px',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
        <Bar dataKey="total_sup_labouree" fill={BAR_COLORS.total_sup_labouree} name="Labourée" radius={[4, 4, 0, 0]} />
        <Bar dataKey="total_sup_emblavee" fill={BAR_COLORS.total_sup_emblavee} name="Emblavée" radius={[4, 4, 0, 0]} />
        <Bar dataKey="total_sup_recoltee" fill={BAR_COLORS.total_sup_recoltee} name="Récoltée" radius={[4, 4, 0, 0]} />
        <Bar dataKey="total_sup_sinistree" fill={BAR_COLORS.total_sup_sinistree} name="Sinistrée" radius={[4, 4, 0, 0]} />
        <Bar dataKey="total_sup_deserbee" fill={BAR_COLORS.total_sup_deserbee} name="Désherbée" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default EspeceSurfaceChart;
