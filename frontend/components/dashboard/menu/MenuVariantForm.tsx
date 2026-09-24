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

  displayOrder: string;

  image: File | null;

  error: string;
  saving: boolean;

  onNameChange: (value: string) => void;

  onPriceRangeChange: (value: boolean) => void;
  onPriceChange: (value: string) => void;
  onPriceMinChange: (value: string) => void;
  onPriceMaxChange: (value: string) => void;

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

  displayOrder,

  image: _image,

  error,
  saving,

  onNameChange,

  onPriceRangeChange,
  onPriceChange,
  onPriceMinChange,
  onPriceMaxChange,

  onDisplayOrderChange,

  onImageChange: _onImageChange,

  onSubmit,
  onClose,

  submitLabel = "Add Variant",
}: MenuVariantFormProps) {
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
        bg-black/50
        p-0
        backdrop-blur-sm
        sm:items-center
        sm:p-4
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-variant-form-title"
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
          sm:max-w-md
          sm:rounded-[26px]
          sm:shadow-[0_20px_60px_rgba(0,0,0,0.2)]
        "
      >
        <div
          className="
            shrink-0
            border-b
            border-gray-200
            bg-white
            px-5
            pb-4
            pt-2.5
            sm:px-6
            sm:pb-5
            sm:pt-5
          "
        >
          <div className="mx-auto mb-3 h-1.5 w-9 rounded-full bg-gray-300 sm:hidden" />

          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-gray-900
                text-white
              "
            >
              {isEditing ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 20h9"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 3.5a2.121 2.121 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    d="M12 5v14"
                  />

                  <path
                    strokeLinecap="round"
                    d="M5 12h14"
                  />
                </svg>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2
                id="menu-variant-form-title"
                className="
                  text-[18px]
                  font-semibold
                  tracking-[-0.02em]
                  text-gray-950
                "
              >
                {isEditing ? "Edit Variant" : "Add Variant"}
              </h2>

              <p className="mt-0.5 truncate text-xs text-gray-500">
                {itemName}
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
                hover:text-gray-950
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="2"
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
              bg-white
              px-5
              py-5
              sm:px-6
              sm:py-6
            "
          >
            <div className="space-y-5">
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

                  <p className="min-w-0 pt-0.5 text-xs leading-5 text-red-700">
                    {error}
                  </p>
                </div>
              )}

              <div>
                <label
                  htmlFor="variant-name"
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
                  id="variant-name"
                  type="text"
                  required
                  value={name}
                  onChange={(event) =>
                    onNameChange(event.target.value)
                  }
                  placeholder="e.g. Large"
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
                  <label className="text-[13px] font-semibold text-gray-800">
                    Price
                  </label>

                  <div className="flex shrink-0 rounded-lg bg-gray-100 p-1">
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
                            : "text-gray-500 hover:text-gray-900"
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
                            : "text-gray-500 hover:text-gray-900"
                        }
                      `}
                    >
                      Range
                    </button>
                  </div>
                </div>

                {!priceRange ? (
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
                      id="variant-price"
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      required
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
                ) : (
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
                        id="variant-price-min"
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        required
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
                        id="variant-price-max"
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        required
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

              <div>
                <label
                  htmlFor="variant-display-order"
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
                  id="variant-display-order"
                  type="number"
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
              px-5
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