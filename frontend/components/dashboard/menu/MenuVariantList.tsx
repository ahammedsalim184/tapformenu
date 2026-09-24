"use client";

import { MenuItem, MenuVariant } from "./MenuTypes";

interface MenuVariantListProps {
  item: MenuItem;
  onAddVariant: (item: MenuItem) => void;
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
}

export default function MenuVariantList({
  item,
  onAddVariant,
  onEditVariant,
  onDeleteVariant,
  onToggleVariant,
}: MenuVariantListProps) {
  const variantCount = item.variants.length;

  return (
    <div className="mt-5">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-400">
            Variants
          </span>

          {variantCount > 0 && (
            <span className="text-[11px] font-medium text-gray-400">
              {variantCount}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onAddVariant(item);
          }}
          className="
            inline-flex
            min-h-9
            shrink-0
            items-center
            gap-1.5
            rounded-xl
            border
            border-gray-200
            bg-white
            px-3
            text-xs
            font-semibold
            text-gray-700
            transition
            hover:bg-gray-50
            hover:text-gray-950
            active:scale-[0.97]
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-3.5 w-3.5"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 5v14"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14"
            />
          </svg>

          Add variant
        </button>
      </div>

      {/* ==========================================
          EMPTY STATE
      ========================================== */}

      {variantCount === 0 ? (
        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-gray-200
            bg-gray-50/60
            px-4
            py-4
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-white
                text-gray-400
                shadow-sm
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 5v14"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14"
                />
              </svg>
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-700">
                No variants
              </p>

              <p className="mt-0.5 text-[11px] leading-4 text-gray-400">
                Add options such as Small, Medium, Large or different sizes.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ==========================================
           VARIANT LIST
        ========================================== */

        <div className="space-y-2">
          {item.variants.map((variant) => (
            <div
              key={variant.id}
              className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-[#dcdcd9]
                transition
                hover:border-gray-300
                hover:bg-[#d6d6d3]
              "
            >
              {/* ========================================
                  EDIT AREA
              ======================================== */}

              <button
                type="button"
                onClick={() =>
                  onEditVariant(item, variant)
                }
                aria-label={`Edit ${variant.name}`}
                className="
                  group
                  block
                  w-full
                  pr-32
                  text-left
                  outline-none
                "
              >
                <div className="flex min-h-[66px] items-center gap-3 p-3">
                  {/* Variant image */}

                  {variant.image ? (
                    <div
                      className="
                        h-10
                        w-10
                        shrink-0
                        overflow-hidden
                        rounded-xl
                        bg-gray-100
                      "
                    >
                      <img
                        src={variant.image}
                        alt={variant.name}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-200
                          group-hover:scale-105
                        "
                      />
                    </div>
                  ) : (
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-white
                        text-gray-300
                      "
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-4 w-4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="3"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m8 15 3-3 2 2 2-2 4 4"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Variant information */}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className="
                          truncate
                          text-sm
                          font-semibold
                          text-gray-900
                          transition-colors
                          group-hover:text-gray-600
                        "
                      >
                        {variant.name}
                      </p>
                    </div>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        font-semibold
                        text-gray-700
                      "
                    >
                      {variant.price_range
                        ? `₹${variant.price_min} – ₹${variant.price_max}`
                        : `₹${variant.price}`}
                    </p>
                  </div>
                </div>
              </button>

              {/* ========================================
                  ACTIVE / INACTIVE SWITCH
              ======================================== */}

              <button
                type="button"
                role="switch"
                aria-checked={variant.available}
                aria-label={
                  variant.available
                    ? `Disable ${variant.name}`
                    : `Enable ${variant.name}`
                }
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleVariant(item, variant);
                }}
                className="
                  absolute
                  right-[68px]
                  top-1/2
                  flex
                  h-7
                  w-12
                  -translate-y-1/2
                  items-center
                  rounded-full
                  p-1
                  transition-all
                  duration-200
                  focus:outline-none
                  focus:ring-2
                  focus:ring-green-200
                  focus:ring-offset-1
                "
                style={{
                  backgroundColor: variant.available
                    ? "#86efac"
                    : "#e5e7eb",
                }}
              >
                <span
                  className="
                    block
                    h-5
                    w-5
                    rounded-full
                    bg-white
                    shadow-sm
                    transition-transform
                    duration-200
                  "
                  style={{
                    transform: variant.available
                      ? "translateX(20px)"
                      : "translateX(0)",
                  }}
                />
              </button>

              {/* ========================================
                  DELETE BUTTON
              ======================================== */}

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteVariant(item, variant);
                }}
                aria-label={`Delete ${variant.name}`}
                className="
                  absolute
                  right-3
                  top-1/2
                  flex
                  h-10
                  w-10
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-red-100
                  bg-red-50
                  text-red-500
                  transition
                  hover:border-red-200
                  hover:bg-red-100
                  hover:text-red-600
                  active:scale-95
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 7h16"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 11v6"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 11v6"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 7l1 13h10l1-13"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 7V4h6v3"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}