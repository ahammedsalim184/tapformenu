"use client";

import { MenuItem, MenuVariant } from "./MenuTypes";

interface MenuVariantListProps {
  item: MenuItem;
  onAddVariant: (item: MenuItem) => void;
  onEditVariant: (item: MenuItem, variant: MenuVariant) => void;
  onDeleteVariant: (item: MenuItem, variant: MenuVariant) => void;
}

export default function MenuVariantList({
  item,
  onAddVariant,
  onEditVariant,
  onDeleteVariant,
}: MenuVariantListProps) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Variants
        </p>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onAddVariant(item);
          }}
          className="text-xs font-medium text-gray-700 hover:text-gray-900 hover:underline"
        >
          + Add Variant
        </button>
      </div>

      {item.variants.length === 0 ? (
        <p className="text-xs text-gray-400">
          No variants yet.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {item.variants.map((variant) => (
            <div
              key={variant.id}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5"
            >
              {variant.image && (
                <img
                  src={variant.image}
                  alt={variant.name}
                  className="h-7 w-7 rounded object-cover"
                />
              )}

              <span className="text-xs text-gray-700">
                {variant.name}
              </span>

              <span className="text-xs font-medium text-gray-900">
                {variant.price_range
                  ? `₹${variant.price_min} – ₹${variant.price_max}`
                  : `₹${variant.price}`}
              </span>

              {!variant.available && (
                <span className="text-[10px] text-red-500">
                  Unavailable
                </span>
              )}

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onEditVariant(item, variant);
                }}
                className="ml-1 text-[11px] font-medium text-gray-500 hover:text-gray-900"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteVariant(item, variant);
                }}
                className="text-[11px] font-medium text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}