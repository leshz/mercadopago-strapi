import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { SalesTimelineEntry } from '../../types/dashboard';

interface SalesTimelineChartProps {
  data: SalesTimelineEntry[];
}

const SalesTimelineChart = ({ data }: SalesTimelineChartProps) => (
  <ResponsiveContainer width="100%" height={300}>
    <ComposedChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="date"
        tickFormatter={(v: string) => v.slice(5)}
        fontSize={12}
      />
      <YAxis yAxisId="left" fontSize={12} />
      <YAxis yAxisId="right" orientation="right" fontSize={12} />
      <Tooltip
        formatter={(value: number, name: string) => [
          name === 'revenue' ? `$${value.toLocaleString()}` : value,
          name === 'revenue' ? 'Revenue' : 'Orders',
        ]}
        labelFormatter={(label: string) => label}
      />
      <Legend />
      <Area
        yAxisId="left"
        type="monotone"
        dataKey="count"
        name="Orders"
        fill="#4945ff"
        fillOpacity={0.15}
        stroke="#4945ff"
      />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="revenue"
        name="Revenue"
        stroke="#ee5e52"
        strokeWidth={2}
        dot={false}
      />
    </ComposedChart>
  </ResponsiveContainer>
);

export { SalesTimelineChart };
