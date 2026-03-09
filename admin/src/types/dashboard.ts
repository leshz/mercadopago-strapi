export interface SalesTimelineEntry {
  date: string;
  count: number;
  revenue: number;
}

export interface OrderRatio {
  open: number;
  closed: number;
}

export interface RejectionReason {
  reason: string;
  count: number;
}

export interface PaymentMethod {
  method: string;
  count: number;
}

export interface TopProduct {
  name: string;
  count: number;
  revenue: number;
}

export interface DashboardSummary {
  totalSales: number;
  revenue: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  avgTicket: number;
  conversionRate: number;
}

export interface DashboardStats {
  salesTimeline: SalesTimelineEntry[];
  orderRatio: OrderRatio;
  rejectionReasons: RejectionReason[];
  paymentMethods: PaymentMethod[];
  topProducts: TopProduct[];
  summary: DashboardSummary;
}
