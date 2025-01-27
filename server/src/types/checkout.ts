export type Reqproduct = {
  sku: number;
  quaity: number;
};

export type ReqCustomer = {
  dni: number;
  name: string;
  lastName: string;
  email: string;
  phone: number;
};
export type Reqfulfillment = {
  address: string;
  department: string;
  city: string;
  postalCode?: string;
  message?: string;
};
export type CheckoutBody = {
  customer: ReqCustomer;
  fulfillment: Reqfulfillment;
  items: Reqproduct[];
};
