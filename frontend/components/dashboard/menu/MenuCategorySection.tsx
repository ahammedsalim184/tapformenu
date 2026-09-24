"use client";

import {
  MenuCategory,
  MenuItem,
  MenuVariant,
} from "./MenuTypes";
import MenuItemCard from "./MenuItemCard";

interface MenuCategorySectionProps {
  category: MenuCategory;

  onEditCategory: (
    category: MenuCategory
  ) => void;

  onDeleteCategory: (
    category: MenuCategory
  ) => void;

  onAddItem: (
    categoryId: number
  ) => void;

  onAddVariant: (
    item: MenuItem
  ) => void;

  onEditVariant: (
    item: MenuItem,
    variant: MenuVariant
  ) => void;

  onDeleteVariant: (
    item: MenuItem,
    variant: MenuVariant
  ) => void;

  onToggleVariant: (
    item: MenuItem,
    variant: MenuVariant
  ) => void;

  onEditItem: (
    item: MenuItem
  ) => void;

  onDeleteItem: (
    item: MenuItem
  ) => void;

  // MENU ITEM AVAILABILITY TOGGLE
  onToggleItem: (
    item: MenuItem
  ) => void;
}

export default function MenuCategorySection({
  category,
  onEditCategory,
  onDeleteCategory,
  onAddItem,
  onAddVariant,
  onEditVariant,
  onDeleteVariant,
  onToggleVariant,
  onEditItem,
  onDeleteItem,
  onToggleItem,
}: MenuCategorySectionProps) {
  const itemCount = category.items.length;

  return (
    <section
      className="
        mb-8
        overflow-hidden
        rounded-[26px]
        border
        border-gray-200/70
        bg-white
        shadow-[0_4px_24px_rgba(0,0,0,0.035)]
        transition-shadow
        duration-200
        hover:shadow-[0_8px_32px_rgba(0,0,0,0.055)]
        sm:mb-10
        sm:rounded-[30px]
      "
    >
      {/* Category Header */}
      <header
        className="
          px-5
          pb-5
          pt-5
          sm:px-7
          sm:pb-6
          sm:pt-6
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* Category Info */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2
                className="
                  text-[19px]
                  font-semibold
                  tracking-[-0.025em]
                  text-gray-950
                  sm:text-[21px]
                "
              >
                {category.name}
              </h2>

              <span
                className="
                  rounded-full
                  bg-gray-100
                  px-2.5
                  py-1
                  text-[11px]
                  font-medium
                  text-gray-500
                "
              >
                {itemCount}{" "}
                {itemCount === 1 ? "item" : "items"}
              </span>

              {!category.active && (
                <span
                  className="
                    rounded-full
                    bg-amber-50
                    px-2.5
                    py-1
                    text-[11px]
                    font-medium
                    text-amber-700
                  "
                >
                  Inactive
                </span>
              )}
            </div>

            {category.description && (
              <p
                className="
                  mt-2
                  max-w-2xl
                  text-sm
                  leading-6
                  text-gray-500
                "
              >
                {category.description}
              </p>
            )}
          </div>

          {/* Category Actions */}
          <div
            className="
              flex
              w-full
              gap-2
              sm:w-auto
            "
          >
            <button
              type="button"
              onClick={() => onEditCategory(category)}
              className="
                flex
                h-10
                flex-1
                items-center
                justify-center
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                text-sm
                font-medium
                text-gray-700
                transition
                hover:border-gray-300
                hover:bg-gray-50
                active:scale-[0.98]
                sm:flex-none
              "
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => onDeleteCategory(category)}
              className="
                flex
                h-10
                flex-1
                items-center
                justify-center
                rounded-xl
                border
                border-red-100
                bg-red-50/40
                px-4
                text-sm
                font-medium
                text-red-600
                transition
                hover:border-red-200
                hover:bg-red-50
                active:scale-[0.98]
                sm:flex-none
              "
            >
              Delete
            </button>
          </div>
        </div>
      </header>

      {/* Category Content */}
      {itemCount === 0 ? (
        <div
          className="
            border-t
            border-gray-100
            px-5
            py-6
            sm:px-7
            sm:py-7
          "
        >
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              rounded-[22px]
              border
              border-dashed
              border-gray-200
              bg-gray-50/50
              px-5
              py-10
              text-center
            "
          >
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-white
                text-gray-400
                shadow-sm
                ring-1
                ring-gray-100
              "
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12M6 12h12"
                />
              </svg>
            </div>

            <h3
              className="
                mt-4
                text-sm
                font-semibold
                text-gray-900
              "
            >
              No menu items yet
            </h3>

            <p
              className="
                mt-1.5
                max-w-sm
                text-sm
                leading-6
                text-gray-500
              "
            >
              Add your first item to start building
              this category.
            </p>

            <button
              type="button"
              onClick={() => onAddItem(category.id)}
              className="
                mt-5
                inline-flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gray-950
                px-5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-gray-800
                active:scale-[0.98]
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 5v14M5 12h14"
                />
              </svg>

              Add menu item
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Items */}
          <div
            className="
              border-t
              border-gray-100
            "
          >
            <div className="divide-y divide-gray-100">
              {category.items.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onAddVariant={onAddVariant}
                  onEditVariant={onEditVariant}
                  onDeleteVariant={onDeleteVariant}
                  onToggleVariant={onToggleVariant}
                  onEdit={onEditItem}
                  onDelete={onDeleteItem}
                  onToggleItem={onToggleItem}
                />
              ))}
            </div>
          </div>

          {/* Add Item */}
          <div
            className="
              border-t
              border-gray-100
              bg-gray-50/40
              px-5
              py-4
              sm:px-7
              sm:py-5
            "
          >
            <button
              type="button"
              onClick={() => onAddItem(category.id)}
              className="
                group
                flex
                min-h-12
                w-full
                items-center
                justify-center
                gap-2.5
                rounded-xl
                border
                border-dashed
                border-gray-300
                bg-white
                px-4
                py-3
                text-sm
                font-semibold
                text-gray-700
                transition
                hover:border-gray-400
                hover:bg-gray-50
                hover:text-gray-950
                active:scale-[0.99]
              "
            >
              <span
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-lg
                  bg-gray-100
                  text-gray-600
                  transition
                  group-hover:bg-gray-200
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 5v14M5 12h14"
                  />
                </svg>
              </span>

              Add menu item
            </button>
          </div>
        </>
      )}
    </section>
  );
}