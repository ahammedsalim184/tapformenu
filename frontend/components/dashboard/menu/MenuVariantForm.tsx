"use client";

import { FormEvent } from "react";

interface MenuVariantFormProps {
open: boolean;

itemName: string;

name: string;

priceRange: boolean;
price: string;
priceMin: string;
priceMax: string;

available: boolean;
displayOrder: string;

image: File | null;

error: string;
saving: boolean;

onNameChange: (value: string) => void;

onPriceRangeChange: (value: boolean) => void;
onPriceChange: (value: string) => void;
onPriceMinChange: (value: string) => void;
onPriceMaxChange: (value: string) => void;

onAvailableChange: (value: boolean) => void;
onDisplayOrderChange: (value: string) => void;

onImageChange: (value: File | null) => void;

onSubmit: (event: FormEvent<HTMLFormElement>) => void;
onClose: () => void;

submitLabel?: string;
}

export default function MenuVariantForm({
open,

itemName,

name,

priceRange,
price,
priceMin,
priceMax,

available,
displayOrder,

image,

error,
saving,

onNameChange,

onPriceRangeChange,
onPriceChange,
onPriceMinChange,
onPriceMaxChange,

onAvailableChange,
onDisplayOrderChange,

onImageChange,

onSubmit,
onClose,

submitLabel = "Add Variant",
}: MenuVariantFormProps) {
// Do not render the modal when it is closed.
if (!open) {
return null;
}

const isEditing = submitLabel === "Save Changes";

return (
<div
className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
onMouseDown={(event) => {
if (event.target === event.currentTarget && !saving) {
onClose();
}
}}
> <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl"> <form onSubmit={onSubmit}>
{/* HEADER */}

```
      <div className="flex items-center justify-between border-b p-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Variant" : "Add Variant"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {isEditing
              ? "Update this variant for"
              : "Add a new variant to"}{" "}
            <span className="font-medium text-gray-700">
              {itemName}
            </span>
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
            Variant Name
          </label>

          <input
            type="text"
            name="name"
            required
            value={name}
            onChange={(event) =>
              onNameChange(event.target.value)
            }
            placeholder="Regular"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
          />
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
              Leave empty to keep the existing image.
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

              Fixed Price
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

        {/* FIXED PRICE */}

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
              required
              value={price}
              onChange={(event) =>
                onPriceChange(event.target.value)
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
                required
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
                required
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
