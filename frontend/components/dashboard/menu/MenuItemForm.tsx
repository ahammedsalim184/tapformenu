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
  onDisplayOrderChange: (value: string) => void;

  onImageChange: (value: File | null) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;

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
      className="
        fixed
        inset-0
        z-50
        flex
        items-end
        justify-center
        bg-black/45
        p-0
        backdrop-blur-[3px]
        sm:items-center
        sm:p-4
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-item-form-title"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !saving
        ) {
          onClose();
        }
      }}
    >
      <div
        className="
          flex
          max-h-[92dvh]
          w-full
          flex-col
          overflow-hidden
          rounded-t-[26px]
          bg-white
          text-gray-950
          shadow-[0_-10px_40px_rgba(0,0,0,0.16)]
          sm:max-w-lg
          sm:rounded-[26px]
          sm:shadow-[0_20px_60px_rgba(0,0,0,0.15)]
        "
      >
        <div
          className="
            shrink-0
            border-b
            border-gray-100
            bg-white
            px-4
            pb-4
            pt-2.5
            sm:px-6
            sm:pb-5
            sm:pt-5
          "
        >
          <div className="mx-auto mb-3 h-1.5 w-9 rounded-full bg-gray-200 sm:hidden" />

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2
                id="menu-item-form-title"
                className="
                  truncate
                  text-[18px]
                  font-semibold
                  tracking-[-0.02em]
                  text-gray-950
                  sm:text-lg
                "
              >
                {isEditing ? "Edit item" : "Add item"}
              </h2>

              <p className="mt-0.5 text-xs text-gray-500">
                Menu item
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              aria-label="Close"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-gray-100
                text-gray-500
                transition
                hover:bg-gray-200
                hover:text-gray-900
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  d="M6 6l12 12"
                />
                <path
                  strokeLinecap="round"
                  d="M18 6L6 18"
                />
              </svg>
            </button>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              overscroll-contain
              px-4
              py-4
              sm:px-6
              sm:py-5
            "
          >
            <div className="space-y-4">
              {error && (
                <div
                  className="
                    flex
                    gap-2.5
                    rounded-xl
                    border
                    border-red-100
                    bg-red-50
                    px-3.5
                    py-3
                  "
                  role="alert"
                >
                  <div
                    className="
                      flex
                      h-6
                      w-6
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-red-100
                      text-red-600
                    "
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4M12 16h.01"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                      />
                    </svg>
                  </div>

                  <p className="min-w-0 text-xs leading-5 text-red-700">
                    {error}
                  </p>
                </div>
              )}

              <div>
                <label
                  htmlFor="menu-item-name"
                  className="
                    mb-1.5
                    block
                    text-[13px]
                    font-semibold
                    text-gray-800
                  "
                >
                  Name
                </label>

                <input
                  id="menu-item-name"
                  type="text"
                  name="name"
                  required
                  value={name}
                  onChange={(event) =>
                    onNameChange(event.target.value)
                  }
                  placeholder="e.g. Chicken Biryani"
                  disabled={saving}
                  autoComplete="off"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-3.5
                    text-[16px]
                    font-medium
                    text-gray-950
                    caret-gray-950
                    outline-none
                    placeholder:text-gray-400
                    transition
                    focus:border-gray-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-gray-100
                    disabled:cursor-not-allowed
                    disabled:bg-gray-100
                    disabled:text-gray-500
                  "
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label
                    htmlFor="menu-item-description"
                    className="
                      text-[13px]
                      font-semibold
                      text-gray-800
                    "
                  >
                    Description
                  </label>

                  <span className="text-[10px] font-medium text-gray-400">
                    Optional
                  </span>
                </div>

                <textarea
                  id="menu-item-description"
                  name="description"
                  rows={3}
                  value={description}
                  onChange={(event) =>
                    onDescriptionChange(event.target.value)
                  }
                  placeholder="Short description of the item"
                  disabled={saving}
                  className="
                    min-h-[92px]
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-3.5
                    py-3
                    text-[16px]
                    leading-5
                    text-gray-950
                    caret-gray-950
                    outline-none
                    placeholder:text-gray-400
                    transition
                    focus:border-gray-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-gray-100
                    disabled:cursor-not-allowed
                    disabled:bg-gray-100
                    disabled:text-gray-500
                  "
                />
              </div>

              <div>
                <label
                  htmlFor="menu-item-category"
                  className="
                    mb-1.5
                    block
                    text-[13px]
                    font-semibold
                    text-gray-800
                  "
                >
                  Category
                </label>

                <select
                  id="menu-item-category"
                  name="category"
                  required
                  value={category}
                  onChange={(event) =>
                    onCategoryChange(event.target.value)
                  }
                  disabled={saving}
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-3.5
                    text-[16px]
                    font-medium
                    text-gray-950
                    outline-none
                    transition
                    focus:border-gray-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-gray-100
                    disabled:cursor-not-allowed
                    disabled:bg-gray-100
                    disabled:text-gray-500
                  "
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

              <div>
                <label
                  htmlFor="menu-item-image"
                  className="
                    mb-1.5
                    block
                    text-[13px]
                    font-semibold
                    text-gray-800
                  "
                >
                  Image
                </label>

                <label
                  htmlFor="menu-item-image"
                  className="
                    flex
                    min-h-12
                    cursor-pointer
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-dashed
                    border-gray-300
                    bg-gray-50
                    px-3.5
                    py-2
                    transition
                    hover:border-gray-400
                    hover:bg-gray-100
                    active:scale-[0.99]
                  "
                >
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-gray-200
                      text-gray-500
                    "
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="3"
                      />
                      <circle
                        cx="8.5"
                        cy="8.5"
                        r="1.5"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 15-5-5L5 21"
                      />
                    </svg>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className="
                        truncate
                        text-[13px]
                        font-medium
                        text-gray-900
                      "
                    >
                      {image
                        ? image.name
                        : "Choose an image"}
                    </p>

                    {isEditing && !image && (
                      <p className="mt-0.5 text-[10px] text-gray-400">
                        Current image stays
                      </p>
                    )}
                  </div>

                  <span
                    className="
                      shrink-0
                      rounded-lg
                      bg-gray-950
                      px-3
                      py-2
                      text-[11px]
                      font-semibold
                      text-white
                    "
                  >
                    Browse
                  </span>

                  <input
                    id="menu-item-image"
                    type="file"
                    name="image"
                    accept="image/*"
                    disabled={saving}
                    onChange={(event) =>
                      onImageChange(
                        event.target.files?.[0] ?? null
                      )
                    }
                    className="sr-only"
                  />
                </label>
              </div>

              <div>
                <div
                  className="
                    mb-1.5
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <label className="text-[13px] font-semibold text-gray-800">
                    Price
                  </label>

                  <div
                    className="
                      flex
                      shrink-0
                      rounded-lg
                      bg-gray-100
                      p-1
                    "
                  >
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        onPriceRangeChange(false)
                      }
                      className={`
                        min-h-8
                        rounded-md
                        px-3
                        text-[11px]
                        font-semibold
                        transition
                        ${
                          !priceRange
                            ? "bg-white text-gray-950 shadow-sm"
                            : "text-gray-500"
                        }
                      `}
                    >
                      Fixed
                    </button>

                    <button
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        onPriceRangeChange(true)
                      }
                      className={`
                        min-h-8
                        rounded-md
                        px-3
                        text-[11px]
                        font-semibold
                        transition
                        ${
                          priceRange
                            ? "bg-white text-gray-950 shadow-sm"
                            : "text-gray-500"
                        }
                      `}
                    >
                      Range
                    </button>
                  </div>
                </div>

                {!priceRange && (
                  <div className="relative">
                    <span
                      className="
                        pointer-events-none
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-sm
                        font-semibold
                        text-gray-500
                      "
                    >
                      ₹
                    </span>

                    <input
                      id="menu-item-price"
                      type="number"
                      name="price"
                      step="0.01"
                      min="0"
                      inputMode="decimal"
                      value={price}
                      onChange={(event) =>
                        onPriceChange(event.target.value)
                      }
                      placeholder="Enter price"
                      disabled={saving}
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        py-3
                        pl-9
                        pr-3.5
                        text-[16px]
                        font-medium
                        text-gray-950
                        caret-gray-950
                        outline-none
                        placeholder:text-gray-400
                        transition
                        focus:border-gray-400
                        focus:bg-white
                        focus:ring-4
                        focus:ring-gray-100
                        disabled:cursor-not-allowed
                        disabled:bg-gray-100
                      "
                    />
                  </div>
                )}

                {priceRange && (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="relative">
                      <span
                        className="
                          pointer-events-none
                          absolute
                          left-3.5
                          top-1/2
                          -translate-y-1/2
                          text-sm
                          font-semibold
                          text-gray-500
                        "
                      >
                        ₹
                      </span>

                      <input
                        id="menu-item-price-min"
                        type="number"
                        name="price_min"
                        step="0.01"
                        min="0"
                        inputMode="decimal"
                        value={priceMin}
                        onChange={(event) =>
                          onPriceMinChange(
                            event.target.value
                          )
                        }
                        placeholder="Min"
                        disabled={saving}
                        className="
                          h-12
                          w-full
                          rounded-xl
                          border
                          border-gray-200
                          bg-gray-50
                          py-3
                          pl-9
                          pr-3
                          text-[16px]
                          font-medium
                          text-gray-950
                          caret-gray-950
                          outline-none
                          placeholder:text-gray-400
                          transition
                          focus:border-gray-400
                          focus:bg-white
                          focus:ring-4
                          focus:ring-gray-100
                          disabled:cursor-not-allowed
                          disabled:bg-gray-100
                        "
                      />
                    </div>

                    <div className="relative">
                      <span
                        className="
                          pointer-events-none
                          absolute
                          left-3.5
                          top-1/2
                          -translate-y-1/2
                          text-sm
                          font-semibold
                          text-gray-500
                        "
                      >
                        ₹
                      </span>

                      <input
                        id="menu-item-price-max"
                        type="number"
                        name="price_max"
                        step="0.01"
                        min="0"
                        inputMode="decimal"
                        value={priceMax}
                        onChange={(event) =>
                          onPriceMaxChange(
                            event.target.value
                          )
                        }
                        placeholder="Max"
                        disabled={saving}
                        className="
                          h-12
                          w-full
                          rounded-xl
                          border
                          border-gray-200
                          bg-gray-50
                          py-3
                          pl-9
                          pr-3
                          text-[16px]
                          font-medium
                          text-gray-950
                          caret-gray-950
                          outline-none
                          placeholder:text-gray-400
                          transition
                          focus:border-gray-400
                          focus:bg-white
                          focus:ring-4
                          focus:ring-gray-100
                          disabled:cursor-not-allowed
                          disabled:bg-gray-100
                        "
                      />
                    </div>
                  </div>
                )}
              </div>

              <div
                className="
                  overflow-hidden
                  rounded-xl
                  border
                  border-gray-100
                  bg-gray-50
                "
              >
                <div
                  className="
                    flex
                    min-h-14
                    items-center
                    justify-between
                    gap-4
                    px-3.5
                  "
                >
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">
                      Vegetarian
                    </p>

                    <p className="mt-0.5 text-[10px] text-gray-400">
                      Mark this item as vegetarian
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={vegetarian}
                    aria-label="Vegetarian"
                    disabled={saving}
                    onClick={() =>
                      onVegetarianChange(!vegetarian)
                    }
                    className="
                      relative
                      h-7
                      w-12
                      shrink-0
                      rounded-full
                      bg-gray-300
                      p-1
                      transition-colors
                      active:scale-95
                      focus:outline-none
                      focus:ring-2
                      focus:ring-gray-200
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <span
                      className={`
                        block
                        h-5
                        w-5
                        rounded-full
                        bg-white
                        shadow-sm
                        transition-transform
                        ${
                          vegetarian
                            ? "translate-x-5"
                            : "translate-x-0"
                        }
                      `}
                    />
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="menu-item-display-order"
                  className="
                    mb-1.5
                    block
                    text-[13px]
                    font-semibold
                    text-gray-800
                  "
                >
                  Display order
                </label>

                <input
                  id="menu-item-display-order"
                  type="number"
                  name="display_order"
                  min="0"
                  inputMode="numeric"
                  value={displayOrder}
                  onChange={(event) =>
                    onDisplayOrderChange(
                      event.target.value
                    )
                  }
                  placeholder="0"
                  disabled={saving}
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-3.5
                    text-[16px]
                    font-medium
                    text-gray-950
                    caret-gray-950
                    outline-none
                    placeholder:text-gray-400
                    transition
                    focus:border-gray-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-gray-100
                    disabled:cursor-not-allowed
                    disabled:bg-gray-100
                    disabled:text-gray-500
                  "
                />

                <p className="mt-1.5 text-[10px] text-gray-400">
                  Lower numbers appear first.
                </p>
              </div>
            </div>
          </div>

          <div
            className="
              shrink-0
              border-t
              border-gray-100
              bg-white
              px-4
              pt-3
              pb-[calc(0.75rem+env(safe-area-inset-bottom))]
              sm:px-6
              sm:py-4
            "
          >
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="
                  h-12
                  flex-1
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  text-[13px]
                  font-semibold
                  text-gray-700
                  transition
                  hover:bg-gray-50
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="
                  h-12
                  flex-1
                  rounded-xl
                  bg-gray-950
                  px-4
                  text-[13px]
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-gray-800
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {saving
                  ? isEditing
                    ? "Saving..."
                    : "Adding..."
                  : submitLabel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}