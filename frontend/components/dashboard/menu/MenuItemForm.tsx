"use client";

import { FormEvent } from "react";

interface Category {
  id: number;
  name: string;
}

interface MenuItemFormProps {
  open: boolean;
  categories: Category[];

  name: string;
  description: string;
  category: string;

  priceRange: boolean;
  price: string;
  priceMin: string;
  priceMax: string;

  vegetarian: boolean;
  available: boolean;
  displayOrder: string;

  image: File | null;

  error: string;
  saving: boolean;

  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;

  onPriceRangeChange: (value: boolean) => void;
  onPriceChange: (value: string) => void;
  onPriceMinChange: (value: string) => void;
  onPriceMaxChange: (value: string) => void;

  onVegetarianChange: (value: boolean) => void;
  onAvailableChange: (value: boolean) => void;
  onDisplayOrderChange: (value: string) => void;

  onImageChange: (value: File | null) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;

  /**
   * Optional label.
   * Defaults to "Add Item".
   * For editing we will pass "Save Changes".
   */
  submitLabel?: string;
}

export default function MenuItemForm({
  open,
  categories,

  name,
  description,
  category,

  priceRange,
  price,
  priceMin,
  priceMax,

  vegetarian,
  available,
  displayOrder,

  image,

  error,
  saving,

  onNameChange,
  onDescriptionChange,
  onCategoryChange,

  onPriceRangeChange,
  onPriceChange,
  onPriceMinChange,
  onPriceMaxChange,

  onVegetarianChange,
  onAvailableChange,
  onDisplayOrderChange,

  onImageChange,

  onSubmit,
  onClose,

  submitLabel = "Add Item",
}: MenuItemFormProps) {
  if (!open) {
    return null;
  }

  const isEditing = submitLabel === "Save Changes";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !saving
        ) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <form onSubmit={onSubmit}>
          {/* HEADER */}

          <div className="flex items-center justify-between border-b p-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {isEditing
                  ? "Edit Menu Item"
                  : "Add Menu Item"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {isEditing
                  ? "Update the details of this menu item."
                  : "Add a new item to your menu."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="text-2xl leading-none text-gray-400 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ×
            </button>
          </div>

          {/* FORM */}

          <div className="space-y-5 p-6">
            {/* ERROR */}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="whitespace-pre-line text-sm text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* NAME */}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Name
              </label>

              <input
                type="text"
                name="name"
                required
                value={name}
                onChange={(event) =>
                  onNameChange(event.target.value)
                }
                placeholder="Chicken Biryani"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                name="description"
                rows={3}
                value={description}
                onChange={(event) =>
                  onDescriptionChange(event.target.value)
                }
                placeholder="Description of the item..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
              />
            </div>

            {/* CATEGORY */}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Category
              </label>

              <select
                name="category"
                required
                value={category}
                onChange={(event) =>
                  onCategoryChange(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="">
                  Select category
                </option>

                {categories.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* IMAGE */}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Image
              </label>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(event) =>
                  onImageChange(
                    event.target.files?.[0] ?? null
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />

              {image && (
                <p className="mt-1 text-xs text-gray-500">
                  Selected: {image.name}
                </p>
              )}

              {isEditing && !image && (
                <p className="mt-1 text-xs text-gray-400">
                  Leave empty to keep the current image.
                </p>
              )}
            </div>

            {/* PRICING */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Pricing
              </label>

              <div className="flex gap-5">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="price_range"
                    value="false"
                    checked={!priceRange}
                    onChange={() =>
                      onPriceRangeChange(false)
                    }
                  />

                  Single Price
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="price_range"
                    value="true"
                    checked={priceRange}
                    onChange={() =>
                      onPriceRangeChange(true)
                    }
                  />

                  Price Range
                </label>
              </div>
            </div>

            {/* SINGLE PRICE */}

            {!priceRange && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(event) =>
                    onPriceChange(
                      event.target.value
                    )
                  }
                  placeholder="120"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                />
              </div>
            )}

            {/* PRICE RANGE */}

            {priceRange && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Minimum Price
                  </label>

                  <input
                    type="number"
                    name="price_min"
                    step="0.01"
                    min="0"
                    value={priceMin}
                    onChange={(event) =>
                      onPriceMinChange(
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Maximum Price
                  </label>

                  <input
                    type="number"
                    name="price_max"
                    step="0.01"
                    min="0"
                    value={priceMax}
                    onChange={(event) =>
                      onPriceMaxChange(
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                  />
                </div>
              </div>
            )}

            {/* DISPLAY ORDER */}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Display Order
              </label>

              <input
                type="number"
                name="display_order"
                value={displayOrder}
                onChange={(event) =>
                  onDisplayOrderChange(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            {/* VEGETARIAN */}

            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="vegetarian"
                checked={vegetarian}
                onChange={(event) =>
                  onVegetarianChange(
                    event.target.checked
                  )
                }
              />

              Vegetarian
            </label>

            {/* AVAILABLE */}

            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="available"
                checked={available}
                onChange={(event) =>
                  onAvailableChange(
                    event.target.checked
                  )
                }
              />

              Available
            </label>
          </div>

          {/* FOOTER */}

          <div className="flex justify-end gap-3 border-t p-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? isEditing
                  ? "Saving..."
                  : "Adding..."
                : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}