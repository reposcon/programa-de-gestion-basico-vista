export interface SaleDetail {
  id_product: number;
  name_product: string;
  quantity: number;
  price_unit: number;
  subtotal: number;
}

export interface Sale {
  id_user: number;
  client_name?: string; 
  total_sale: number;
  details: SaleDetail[];
}