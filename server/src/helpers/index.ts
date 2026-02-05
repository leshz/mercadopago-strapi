// Re-exportar desde helpers modulares
export {
  calculateProductPricing,
  calculateCartPricing,
  type PricingSummary,
} from './pricing.helper';

export {
  SUPPORTED_CURRENCIES,
  validateCurrency,
  formatAmount,
  COUNTRY_CONFIGS,
  type Currency,
} from './currency.helper';

// Aliases para compatibilidad con código existente
import { calculateProductPricing, calculateCartPricing } from './pricing.helper';

export const productPriceSummary = calculateProductPricing;
export const productsPricesSummary = (products: any[]) => {
  const result = calculateCartPricing(products);
  return {
    totalFullPrice: result.totalFullPrice,
    totalFullPriceDiscount: result.totalFullPriceDiscount,
    totalDiscounted: result.totalDiscounted,
    total: result.total,
  };
};

export const mergeShipmentAtProducts = (products, shipment) => {
    const addShipment = Object.keys(shipment).length > 0;
    return addShipment ? [...products, shipment] : products;
};

export const calculateWithShipment = (total: number, shipment: any) => {
    const addShipment = Object.keys(shipment).length > 0;
    return addShipment ? total + shipment?.unit_price : total;
};

export const fieldsImage = [
    "url",
    "width",
    "height",
    "alternativeText",
    "formats",
];
