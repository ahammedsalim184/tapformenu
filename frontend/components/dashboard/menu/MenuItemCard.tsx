"use client";

import { MenuItem, MenuVariant } from "./MenuTypes";
import MenuVariantList from "./MenuVariantList";

interface MenuItemCardProps {
  item: MenuItem;
  onAddVariant: (item: MenuItem) => void;
  onEditVariant: (item: MenuItem, variant: MenuVariant) => void;
  onDeleteVariant: (item: MenuItem, variant: MenuVariant) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
}

export default function MenuItemCard({
  item,
  onAddVariant,
  onEditVariant,
  onDeleteVariant,
  onEdit,
  onDelete,
}: MenuItemCardProps) {
  return (
    <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            No image
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium text-gray-900">
            {item.name}
          </h3>

          {item.vegetarian && (
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
              Vegetarian
            </span>
          )}

          {!item.available && (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
              Unavailable
            </span>
          )}
        </div>

        {item.description && (
          <p className="mt-1 text-sm text-gray-500">
            {item.description}
          </p>
        )}

        <div className="mt-2 text-sm font-medium text-gray-900">
          {item.price_range ? (
            <>
              ₹{item.price_min} – ₹{item.price_max}
            </>
          ) : item.price ? (
            <>₹{item.price}</>
          ) : (
            <span className="text-gray-400">
              Price by variant
            </span>
          )}
        </div>

        <MenuVariantList
          item={item}
          onAddVariant={onAddVariant}
          onEditVariant={onEditVariant}
          onDeleteVariant={onDeleteVariant}
        />
      </div>

      <div className="flex shrink-0 items-start gap-2">
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(item)}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}