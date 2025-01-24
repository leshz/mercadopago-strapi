export declare const productPriceSummary: (product: any) => {
    fullPrice: number;
    fullPriceDiscount: number;
    totalDiscounted: number;
    finalPrice: number;
};
export declare const productsPricesSummary: (products: any) => {
    totalFullPrice: any;
    totalFullPriceDiscount: any;
    totalDiscounted: any;
    total: number;
};
export declare const mergeShipmentAtProducts: (products: any, shipment: any) => any;
export declare const calculateWithShipment: (total: number, shipment: any) => any;
export declare const fieldsImage: string[];
