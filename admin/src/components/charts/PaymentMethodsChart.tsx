import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { PaymentMethod } from '../../types/dashboard';

interface PaymentMethodsChartProps {
  data: PaymentMethod[];
}

const PaymentMethodsChart = ({ data }: PaymentMethodsChartProps) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="method" fontSize={12} />
      <YAxis fontSize={12} />
      <Tooltip />
      <Bar dataKey="count" fill="#4945ff" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export { PaymentMethodsChart };
