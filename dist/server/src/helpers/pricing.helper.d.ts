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
export declare function calculateProductPricing(product: ProductWithPromotion): PricingSummary;
/**
 * Calcula el resumen de precio para múltiples productos
 */
export declare function calculateCartPricing(products: ProductWithPromotion[]): {
    totalFullPrice: number;
    totalFullPriceDiscount: number;
    totalDiscounted: number;
    total: number;
    items: {
        fullPrice: number;
        fullPriceDiscount: number;
        totalDiscounted: number;
        finalPrice: number;
        quantity?: number;
        price: number;
        promotion?: {
            price_with_discount?: number;
            with_discount?: boolean;
        };
    }[];
};
export {};
