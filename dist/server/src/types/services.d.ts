/**
 * Types for Service Layer
 */
export interface CountryConfig {
    areaCode: string;
    identificationType: string;
}
export interface CustomerInfo {
    dni: string;
    email: string;
    lastName: string;
    name: string;
    phone: string;
}
export interface FulfillmentInfo {
    postalCode?: string;
    address: string;
    city: string;
    department: string;
}
export interface ProductInfo {
    pictures?: Array<{
        url: string;
    }>;
    promotion?: {
        with_discount?: boolean;
        price_with_discount?: number;
    };
    categories?: Array<{
        id: number;
    }>;
    price: number;
    name: string;
    short_description?: string;
    sku: string;
    quantity: number;
}
export interface CheckoutData {
    items: Array<{
        sku: string;
        quantity: number;
    }>;
    customer: CustomerInfo;
    fulfillment: FulfillmentInfo;
}
export interface CheckoutResult {
    orderId: number;
    paymentUrl: string;
    preferenceId: string;
    collectorId: string;
}
export interface PreferenceResult {
    id: string;
    initPoint: string;
    collectorId: string;
}
export interface OrderData {
    products: ProductInfo[];
    customer: CustomerInfo;
    fulfillment: FulfillmentInfo;
}
export interface PreferenceData {
    id: string;
    initPoint: string;
    collectorId: string;
}
export interface PaymentInfo {
    paymentId: string;
    status: string;
    orderId: string;
    paymentTypeId: string;
    items: StockItem[];
    rawData: unknown;
}
export interface StockItem {
    id: string;
    quantity: number | string;
}
export interface WebhookPayload {
    data: {
        id: string;
    };
    type: string;
    action?: string;
}
export interface ProductItem {
    sku: string;
    quantity: number;
}
