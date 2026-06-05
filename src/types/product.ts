export interface Product {
  id: string;
  name: string;
  category: string;
  price: number; // EUR
  description: string;
  image: string; // /images/products/... or external URL
  active: boolean;
  stock: number; // units on hand
  lowStockThreshold: number; // warn at/below this
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface ProductInput {
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
  active?: boolean;
  stock?: number;
  lowStockThreshold?: number;
}

export type StockState = "in-stock" | "low-stock" | "out-of-stock";

export function stockState(p: Pick<Product, "stock" | "lowStockThreshold">): StockState {
  if (p.stock <= 0) return "out-of-stock";
  if (p.stock <= p.lowStockThreshold) return "low-stock";
  return "in-stock";
}
