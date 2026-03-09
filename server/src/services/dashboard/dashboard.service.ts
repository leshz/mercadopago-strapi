/**
 * Dashboard Service
 * Responsabilidad: Agregar estadísticas de órdenes para el dashboard
 */
import type { Core } from '@strapi/strapi';
import type { TimelineEntry, ProductAccum } from '../../types';

const OPEN_STATUSES = ['initial', 'in_process', 'pending', 'in_mediation', 'authorized'];

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getStats(days: number) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const orders = await strapi.db
      .query('plugin::strapi-mercadopago.order')
      .findMany({
        where: {
          createdAt: { $gte: since.toISOString() },
        },
      });

    // --- Sales Timeline ---
    const timelineMap = new Map<string, { count: number; revenue: number }>();

    // Pre-fill all days with zeros
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const key = d.toISOString().slice(0, 10);
      timelineMap.set(key, { count: 0, revenue: 0 });
    }

    for (const order of orders) {
      const dateKey = new Date(order.createdAt).toISOString().slice(0, 10);
      const entry = timelineMap.get(dateKey);
      if (entry) {
        entry.count += 1;
        entry.revenue += order.total || 0;
      }
    }

    const salesTimeline: TimelineEntry[] = [];
    for (const [date, val] of timelineMap) {
      salesTimeline.push({ date, ...val });
    }

    // --- Order Ratio ---
    let open = 0;
    let closed = 0;
    for (const order of orders) {
      if (OPEN_STATUSES.includes(order.payment_status)) {
        open++;
      } else {
        closed++;
      }
    }
    const orderRatio = { open, closed };

    // --- Rejection Reasons ---
    const rejectionMap = new Map<string, number>();
    for (const order of orders) {
      if (order.payment_status === 'rejected' && order.status_detail) {
        rejectionMap.set(
          order.status_detail,
          (rejectionMap.get(order.status_detail) || 0) + 1
        );
      }
    }
    const rejectionReasons = [...rejectionMap.entries()]
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // --- Payment Methods ---
    const methodMap = new Map<string, number>();
    for (const order of orders) {
      if (order.paid_with) {
        methodMap.set(order.paid_with, (methodMap.get(order.paid_with) || 0) + 1);
      }
    }
    const paymentMethods = [...methodMap.entries()]
      .map(([method, count]) => ({ method, count }))
      .sort((a, b) => b.count - a.count);

    // --- Top Products ---
    const productMap = new Map<string, ProductAccum>();
    for (const order of orders) {
      let products: any[] = [];
      try {
        products = typeof order.products === 'string'
          ? JSON.parse(order.products)
          : order.products || [];
      } catch {
        continue;
      }

      for (const product of products) {
        const name = product.name || product.title || 'Unknown';
        const qty = Number(product.quantity) || 1;
        const price = Number(product.unit_price || product.price) || 0;
        const existing = productMap.get(name) || { name, count: 0, revenue: 0 };
        existing.count += qty;
        existing.revenue += price * qty;
        productMap.set(name, existing);
      }
    }
    const topProducts = [...productMap.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // --- Summary ---
    const totalSales = orders.length;
    const approvedOrders = orders.filter((o) => o.payment_status === 'approved');
    const approvedCount = approvedOrders.length;
    const rejectedCount = orders.filter((o) => o.payment_status === 'rejected').length;
    const pendingCount = orders.filter(
      (o) => OPEN_STATUSES.includes(o.payment_status)
    ).length;
    const revenue = approvedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const avgTicket = approvedCount > 0 ? Math.round(revenue / approvedCount) : 0;
    const conversionRate = totalSales > 0
      ? Math.round((approvedCount / totalSales) * 10000) / 100
      : 0;

    return {
      salesTimeline,
      orderRatio,
      rejectionReasons,
      paymentMethods,
      topProducts,
      summary: {
        totalSales,
        revenue,
        approvedCount,
        rejectedCount,
        pendingCount,
        avgTicket,
        conversionRate,
      },
    };
  },
});
