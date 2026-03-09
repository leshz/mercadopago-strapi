import type { OrderRatio } from '../../types/dashboard';
interface OrderRatioChartProps {
    data: OrderRatio;
    openLabel: string;
    closedLabel: string;
}
declare const OrderRatioChart: ({ data, openLabel, closedLabel }: OrderRatioChartProps) => import("react/jsx-runtime").JSX.Element;
export { OrderRatioChart };
