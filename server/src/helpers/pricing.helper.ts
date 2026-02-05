/**
 * Pricing Helper
 * Funciones puras para cálculos de precios
 * NO tienen side effects, solo transforman datos
 */

export interface PricingSummary {
  fullPrice: number;
  fullPriceDiscount: number;
  totalDiscounted: number;
  finalPrice: number;
}

interface ProductWithPromotion {
  quantity?: number;
  price: number;
  promotion?: {
    price_with_discount?: number;
    with_discount?: boolean;
  };
}

/**
 * Calcula el resumen de precio de un producto individual
 */
export function calculateProductPricing(product: ProductWithPromotion): PricingSummary {
  const { quantity = 1, price, promotion } = product;
  const { price_with_discount = 0, with_discount = false } = promotion || {};

  // precio total * cantidad
  const fullPrice = price * quantity;

  // precio con descuento * cantidad
  const fullPriceDiscount = with_discount
    ? (price_with_discount || 0) * quantity
    : fullPrice;

  // precio total menos precio total con descuento
  const totalDiscounted = fullPrice - fullPriceDiscount;

  // precio total - total descontado
  const finalPrice = fullPrice - totalDiscounted;

  return { fullPrice, fullPriceDiscount, totalDiscounted, finalPrice };
}

/**
 * Calcula el resumen de precio para múltiples productos
 */
export function calculateCartPricing(products: ProductWithPromotion[]) {
  const pricingInfo = products.map((product) => ({
    ...product,
    ...calculateProductPricing(product),
  }));

  const totalFullPrice = pricingInfo.reduce(
    (acc, item) => acc + item.fullPrice,
    0
  );

  const totalFullPriceDiscount = pricingInfo.reduce(
    (acc, item) => acc + item.fullPriceDiscount,
    0
  );

  const totalDiscounted = pricingInfo.reduce(
    (acc, item) => acc + item.totalDiscounted,
    0
  );

  const total = totalFullPrice - totalDiscounted;

  return {
    totalFullPrice,
    totalFullPriceDiscount,
    totalDiscounted,
    total,
    items: pricingInfo,
  };
}
