import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { RejectionReason } from '../../types/dashboard';

interface RejectionReasonsChartProps {
  data: RejectionReason[];
}

const RejectionReasonsChart = ({ data }: RejectionReasonsChartProps) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" fontSize={12} />
      <YAxis
        type="category"
        dataKey="reason"
        fontSize={11}
        width={140}
        tickFormatter={(v: string) =>
          v.length > 20 ? `${v.slice(0, 20)}...` : v
        }
      />
      <Tooltip />
      <Bar dataKey="count" fill="#ee5e52" radius={[0, 4, 4, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export { RejectionReasonsChart };
