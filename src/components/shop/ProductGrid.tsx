"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types/product";
import type { Messages } from "@/i18n/messages";

const CATEGORIES = ["All", "Skincare", "Hair", "Beard", "Tools"] as const;

export function ProductGrid({
  products,
  dict,
}: {
  products: Product[];
  dict: Messages;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category)),
  ];

  return (
    <>
      <div className="mb-12 flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={
              "border px-4 py-2 font-display text-[10px] uppercase tracking-[0.22em] transition-colors" +
              (activeCategory === cat
                ? " border-cream bg-cream text-background"
                : " border-cream/30 text-cream/70 hover:border-cream/60")
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="font-display text-[11px] uppercase tracking-[0.2em] text-cream/50">
          No products in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col border border-cream/15"
            >
              <div className="relative aspect-square overflow-hidden bg-cream/5">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-display text-[11px] uppercase tracking-[0.2em] text-cream/30">
                    No image
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-sm uppercase tracking-[0.15em] text-cream">
                    {product.name}
                  </h3>
                  <span className="shrink-0 font-display text-sm text-cream/70">
                    €{product.price}
                  </span>
                </div>
                <span className="font-display text-[10px] uppercase tracking-[0.2em] text-cream/45">
                  {product.category}
                </span>
                {product.description ? (
                  <p className="mt-1 text-[12px] leading-[1.6] text-cream/60">
                    {product.description}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
