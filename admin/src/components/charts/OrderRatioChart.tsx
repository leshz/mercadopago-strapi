import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import type { OrderRatio } from '../../types/dashboard';

interface OrderRatioChartProps {
  data: OrderRatio;
  openLabel: string;
  closedLabel: string;
}

const COLORS = ['#f29d41', '#328048'];

const OrderRatioChart = ({ data, openLabel, closedLabel }: OrderRatioChartProps) => {
  const chartData = [
    { name: openLabel, value: data.open },
    { name: closedLabel, value: data.closed },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export { OrderRatioChart };
