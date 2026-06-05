"use client";

import { useState } from "react";
import type { Product, StockState } from "@/types/product";
import { stockState } from "@/types/product";
import type { Messages } from "@/i18n/messages";

const STATE_COLOR: Record<StockState, string> = {
  "in-stock": "#7dd3a0",
  "low-stock": "#e0c07d",
  "out-of-stock": "#e08a8a",
};

interface RowEdit {
  stock: number;
  lowStockThreshold: number;
}

export function InventoryManager({
  initial,
  dict,
}: {
  initial: Product[];
  dict: Messages;
}) {
  const inv = dict.admin.inventory;

  const [products, setProducts] = useState<Product[]>(initial);
  const [edits, setEdits] = useState<Record<string, RowEdit>>(() => {
    const seed: Record<string, RowEdit> = {};
    for (const product of initial) {
      seed[product.id] = {
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold,
      };
    }
    return seed;
  });
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  function setField(id: string, field: keyof RowEdit, raw: string) {
    const value = Number.parseInt(raw, 10);
    const next = Number.isNaN(value) ? 0 : value;
    setEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: next },
    }));
    if (savedId === id) {
      setSavedId(null);
    }
  }

  function stateOf(id: string): StockState {
    const edit = edits[id];
    return stockState({
      stock: edit.stock,
      lowStockThreshold: edit.lowStockThreshold,
    });
  }

  async function save(id: string) {
    const edit = edits[id];
    setSavingId(id);
    setSavedId(null);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stock: edit.stock,
          lowStockThreshold: edit.lowStockThreshold,
        }),
      });
      if (!res.ok) {
        return;
      }
      const json: { product: Product } = await res.json();
      const updated = json.product;
      setProducts((prev) =>
        prev.map((product) => (product.id === id ? updated : product)),
      );
      setEdits((prev) => ({
        ...prev,
        [id]: {
          stock: updated.stock,
          lowStockThreshold: updated.lowStockThreshold,
        },
      }));
      setSavedId(id);
    } finally {
      setSavingId((prev) => (prev === id ? null : prev));
    }
  }

  const labelClass =
    "font-display text-[11px] uppercase tracking-[0.2em] text-cream/70";
  const inputClass =
    "w-20 border-b border-cream/25 bg-transparent py-1.5 text-cream outline-none focus:border-cream";
  const statusLabel: Record<StockState, string> = {
    "in-stock": inv.inStock,
    "low-stock": inv.lowStock,
    "out-of-stock": inv.outOfStock,
  };

  return (
    <div className="bg-background text-cream">
      <h1 className={labelClass}>{inv.title}</h1>

      {products.length > 0 ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse border border-cream/15 text-left">
            <thead>
              <tr className="border-b border-cream/15">
                <th className={`p-4 ${labelClass}`}>{inv.product}</th>
                <th className={`p-4 ${labelClass}`}>{inv.stock}</th>
                <th className={`p-4 ${labelClass}`}>{inv.threshold}</th>
                <th className={`p-4 ${labelClass}`}>{inv.status}</th>
                <th className={`p-4 ${labelClass}`}>
                  <span className="sr-only">{inv.save}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const edit = edits[product.id];
                const state = stateOf(product.id);
                const isSaving = savingId === product.id;
                return (
                  <tr
                    key={product.id}
                    className="border-b border-cream/15 align-middle"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 shrink-0 border border-cream/15 object-cover"
                        />
                        <div className="min-w-0">
                          <div className="truncate text-sm text-cream">
                            {product.name}
                          </div>
                          <div className="truncate text-[11px] uppercase tracking-[0.16em] text-cream/55">
                            {product.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        min={0}
                        inputMode="numeric"
                        value={edit.stock}
                        onChange={(event) =>
                          setField(product.id, "stock", event.target.value)
                        }
                        aria-label={inv.stock}
                        className={inputClass}
                      />
                      <span className="ml-2 text-[11px] uppercase tracking-[0.16em] text-cream/45">
                        {inv.units}
                      </span>
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        min={0}
                        inputMode="numeric"
                        value={edit.lowStockThreshold}
                        onChange={(event) =>
                          setField(
                            product.id,
                            "lowStockThreshold",
                            event.target.value,
                          )
                        }
                        aria-label={inv.threshold}
                        className={inputClass}
                      />
                    </td>
                    <td className="p-4">
                      <span
                        className="font-display text-[10px] uppercase tracking-[0.2em]"
                        style={{ color: STATE_COLOR[state] }}
                      >
                        {statusLabel[state]}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => save(product.id)}
                          disabled={isSaving}
                          className="border border-cream/50 px-3 py-1.5 font-display text-[10px] uppercase tracking-[0.22em] transition-colors hover:bg-cream hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {inv.save}
                        </button>
                        {savedId === product.id ? (
                          <span
                            className="font-display text-[10px] uppercase tracking-[0.2em]"
                            style={{ color: STATE_COLOR["in-stock"] }}
                          >
                            {inv.updated}
                          </span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className={`mt-6 ${labelClass}`}>{inv.none}</p>
      )}
    </div>
  );
}
