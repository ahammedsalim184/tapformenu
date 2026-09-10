"use client";

import {
  MenuCategory,
  MenuItem,
  MenuVariant,
} from "./MenuTypes";
import MenuItemCard from "./MenuItemCard";

interface MenuCategorySectionProps {
  category: MenuCategory;
  onEditCategory: (category: MenuCategory) => void;
  onDeleteCategory: (category: MenuCategory) => void;
  onAddItem: (categoryId: number) => void;
  onAddVariant: (item: MenuItem) => void;
  onEditVariant: (
    item: MenuItem,
    variant: MenuVariant
  ) => void;
  onDeleteVariant: (
    item: MenuItem,
    variant: MenuVariant
  ) => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (item: MenuItem) => void;
}

export default function MenuCategorySection({
  category,
  onEditCategory,
  onDeleteCategory,
  onAddItem,
  onAddVariant,
  onEditVariant,
  onDeleteVariant,
  onEditItem,
  onDeleteItem,
}: MenuCategorySectionProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">
              {category.name}
            </h2>

            {!category.active && (
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                Inactive
              </span>
            )}
          </div>

          {category.description && (
            <p className="mt-1 text-sm text-gray-500">
              {category.description}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEditCategory(category)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDeleteCategory(category)}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      {category.items.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-gray-500">
            No menu items in this category.
          </p>

          <button
            type="button"
            onClick={() => onAddItem(category.id)}
            className="mt-3 text-sm font-medium text-gray-900 underline hover:no-underline"
          >
            Add an item
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {category.items.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onAddVariant={onAddVariant}
              onEditVariant={onEditVariant}
              onDeleteVariant={onDeleteVariant}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
            />
          ))}
        </div>
      )}
    </section>
  );
}