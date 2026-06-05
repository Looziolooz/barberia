// File-backed product + inventory store (server-only). Persists to
// data/products.json. Seeded on first access so the admin has data to show.
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Product, ProductInput } from "@/types/product";

const FILE = path.join(process.cwd(), "data", "products.json");

function now(): string {
  return new Date().toISOString();
}

function seed(): Product[] {
  const t = now();
  const base = (p: Omit<Product, "id" | "createdAt" | "updatedAt">): Product => ({
    id: randomUUID(),
    createdAt: t,
    updatedAt: t,
    ...p,
  });
  return [
    base({ name: "Aftershave Balm", category: "Skincare", price: 24, description: "Soothing post-shave balm that calms and hydrates.", image: "/images/products/post-shave.webp", active: true, stock: 18, lowStockThreshold: 5 }),
    base({ name: "Shave Kit", category: "Tools", price: 89, description: "Badger brush, safety razor and leather travel case.", image: "/images/products/shave-kit.webp", active: true, stock: 6, lowStockThreshold: 4 }),
    base({ name: "Styling Pomade", category: "Hair", price: 19, description: "Strong-hold matte pomade for a natural finish.", image: "/images/products/pomade.webp", active: true, stock: 2, lowStockThreshold: 6 }),
    base({ name: "Beard Oil", category: "Beard", price: 22, description: "Nourishing blend that softens and conditions the beard.", image: "/images/products/post-shave.webp", active: false, stock: 0, lowStockThreshold: 5 }),
  ];
}

async function readAll(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return JSON.parse(raw) as Product[];
  } catch {
    const seeded = seed();
    await writeAll(seeded);
    return seeded;
  }
}

async function writeAll(list: Product[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf8");
}

export async function listProducts(): Promise<Product[]> {
  const list = await readAll();
  return list.sort((a, b) => a.name.localeCompare(b.name));
}

function sanitize(input: Partial<ProductInput>): Partial<Product> {
  const out: Partial<Product> = {};
  if (typeof input.name === "string") out.name = input.name.trim();
  if (typeof input.category === "string") out.category = input.category.trim();
  if (typeof input.price === "number" && Number.isFinite(input.price)) out.price = Math.max(0, input.price);
  if (typeof input.description === "string") out.description = input.description.trim();
  if (typeof input.image === "string") out.image = input.image.trim();
  if (typeof input.active === "boolean") out.active = input.active;
  if (typeof input.stock === "number" && Number.isFinite(input.stock)) out.stock = Math.max(0, Math.round(input.stock));
  if (typeof input.lowStockThreshold === "number" && Number.isFinite(input.lowStockThreshold)) {
    out.lowStockThreshold = Math.max(0, Math.round(input.lowStockThreshold));
  }
  return out;
}

export type ProductResult = { ok: true; product: Product } | { ok: false; error: string };

export async function createProduct(input: ProductInput): Promise<ProductResult> {
  const clean = sanitize(input);
  if (!clean.name) return { ok: false, error: "Name is required." };
  if (!clean.category) return { ok: false, error: "Category is required." };
  if (clean.price === undefined) return { ok: false, error: "A valid price is required." };

  const list = await readAll();
  const t = now();
  const product: Product = {
    id: randomUUID(),
    name: clean.name,
    category: clean.category,
    price: clean.price,
    description: clean.description ?? "",
    image: clean.image ?? "",
    active: clean.active ?? true,
    stock: clean.stock ?? 0,
    lowStockThreshold: clean.lowStockThreshold ?? 5,
    createdAt: t,
    updatedAt: t,
  };
  list.push(product);
  await writeAll(list);
  return { ok: true, product };
}

export async function updateProduct(id: string, patch: Partial<ProductInput>): Promise<Product | null> {
  const list = await readAll();
  const p = list.find((x) => x.id === id);
  if (!p) return null;
  Object.assign(p, sanitize(patch), { updatedAt: now() });
  await writeAll(list);
  return p;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const list = await readAll();
  const next = list.filter((x) => x.id !== id);
  if (next.length === list.length) return false;
  await writeAll(next);
  return true;
}
