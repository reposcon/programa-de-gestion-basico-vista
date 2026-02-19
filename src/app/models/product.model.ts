export interface Product {
  id_product?: number;
  name_product: string;
  price_cost: number;
  price_sell: number;
  stock: number;
  tax_id: number;
  category_id: number;
  subcategory_id: number;
  is_tax_included: boolean;
  state_product: number;
}