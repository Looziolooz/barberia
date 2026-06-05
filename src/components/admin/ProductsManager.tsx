"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import type { Messages } from "@/i18n/messages";

interface Draft {
  id?: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  active: boolean;
  stock: number;
  lowStockThreshold: number;
}

const emptyDraft: Draft = {
  name: "",
  category: "",
  price: 0,
  description: "",
  image: "",
  active: true,
  stock: 0,
  lowStockThreshold: 0,
};

function toDraft(p: Product): Draft {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    description: p.description,
    image: p.image,
    active: p.active,
    stock: p.stock,
    lowStockThreshold: p.lowStockThreshold,
  };
}

export function ProductsManager({ initial, dict }: { initial: Product[]; dict: Messages }) {
  const t = dict.admin.products;
  const inv = dict.admin.inventory;

  const [products, setProducts] = useState<Product[]>(initial);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const labelClass = "font-display text-[11px] uppercase tracking-[0.2em] text-cream/70";
  const inputClass =
    "border-b border-cream/25 bg-transparent py-3 text-cream outline-none focus:border-cream";
  const btnClass =
    "border border-cream/50 px-4 py-2 font-display text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-cream hover:text-background";
  const smallBtnClass =
    "border border-cream/50 px-3 py-1.5 font-display text-[10px] uppercase tracking-[0.22em] transition-colors hover:bg-cream hover:text-background";

  async function refetch(): Promise<boolean> {
    const res = await fetch("/api/admin/products");
    if (!res.ok) {
      const json = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(json?.error ?? "Error");
      return false;
    }
    const json = (await res.json()) as { products: Product[] };
    setProducts(json.products);
    return true;
  }

  async function handleSave() {
    if (!draft) return;
    setSaving(true);
    setError(null);

    const body = {
      name: draft.name,
      category: draft.category,
      price: Number(draft.price),
      description: draft.description,
      image: draft.image,
      active: draft.active,
      stock: Number(draft.stock),
      lowStockThreshold: Number(draft.lowStockThreshold),
    };

    try {
      const res = draft.id
        ? await fetch(`/api/admin/products/${draft.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
        : await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(json?.error ?? "Error");
        return;
      }

      const ok = await refetch();
      if (ok) setDraft(null);
    } catch {
      setError("Error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(t.confirmDelete)) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(json?.error ?? "Error");
        return;
      }
      await refetch();
    } catch {
      setError("Error");
    }
  }

  return (
    <div className="bg-background text-cream">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-[11px] uppercase tracking-[0.2em] text-cream/70">
          {t.title}
        </h1>
        <button type="button" className={btnClass} onClick={() => setDraft({ ...emptyDraft })}>
          {t.add}
        </button>
      </div>

      {error ? (
        <p className="mt-4 font-display text-[11px] uppercase tracking-[0.2em]" style={{ color: "#e08a8a" }}>
          {error}
        </p>
      ) : null}

      {draft ? (
        <div className="mt-6 border border-cream/15 p-6">
          <h2 className={labelClass}>{draft.id ? t.editProduct : t.newProduct}</h2>
          <form
            className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              void handleSave();
            }}
          >
            <label className="flex flex-col gap-2">
              <span className={labelClass}>{t.name}</span>
              <input
                className={inputClass}
                type="text"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>{t.category}</span>
              <input
                className={inputClass}
                type="text"
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>{t.price}</span>
              <input
                className={inputClass}
                type="number"
                step="0.01"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>{t.image}</span>
              <input
                className={inputClass}
                type="text"
                value={draft.image}
                onChange={(e) => setDraft({ ...draft, image: e.target.value })}
              />
            </label>

            <label className="flex flex-col gap-2 md:col-span-2">
              <span className={labelClass}>{t.description}</span>
              <textarea
                className={inputClass}
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>{inv.stock}</span>
              <input
                className={inputClass}
                type="number"
                value={draft.stock}
                onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>{inv.threshold}</span>
              <input
                className={inputClass}
                type="number"
                value={draft.lowStockThreshold}
                onChange={(e) => setDraft({ ...draft, lowStockThreshold: Number(e.target.value) })}
              />
            </label>

            <label className="flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
              />
              <span className={labelClass}>{t.active}</span>
            </label>

            <div className="flex items-center gap-3 md:col-span-2">
              <button type="submit" className={btnClass} disabled={saving}>
                {saving ? t.saving : t.save}
              </button>
              <button
                type="button"
                className={btnClass}
                onClick={() => {
                  setDraft(null);
                  setError(null);
                }}
              >
                {t.cancel}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="mt-8">
        {products.length === 0 ? (
          <p className="font-display text-[11px] uppercase tracking-[0.2em] text-cream/70">{t.none}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {products.map((p) => (
              <li
                key={p.id}
                className="flex items-start gap-4 border border-cream/15 p-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} className="h-16 w-16 object-cover" />
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-cream">{p.name}</span>
                    <span
                      className="font-display text-[10px] uppercase tracking-[0.2em]"
                      style={{ color: p.active ? "#7dd3a0" : "#e08a8a" }}
                    >
                      {p.active ? t.activeYes : t.activeNo}
                    </span>
                  </div>
                  <span className="font-display text-[11px] uppercase tracking-[0.2em] text-cream/70">
                    {p.category}
                  </span>
                  <span className="text-cream">{"€" + p.price}</span>
                  <span className="font-display text-[11px] uppercase tracking-[0.2em] text-cream/70">
                    {p.stock + " " + inv.units}
                  </span>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      className={smallBtnClass}
                      onClick={() => {
                        setError(null);
                        setDraft(toDraft(p));
                      }}
                    >
                      {t.edit}
                    </button>
                    <button
                      type="button"
                      className={smallBtnClass}
                      onClick={() => void handleDelete(p.id)}
                    >
                      {t.delete}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
