"use client";

import { MenuItem, MenuVariant } from "./MenuTypes";
import MenuVariantList from "./MenuVariantList";

interface MenuItemCardProps {
  item: MenuItem;

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

  onEdit: (
    item: MenuItem
  ) => void;

  onDelete: (
    item: MenuItem
  ) => void;

  onToggleItem: (
    item: MenuItem
  ) => void;
}

function getItemImageUrl(
  image: string | null
) {
  if (!image) {
    return null;
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  if (image.startsWith("/media/")) {
    return `http://127.0.0.1:8000${image}`;
  }

  return `http://127.0.0.1:8000/media/${image}`;
}

export default function MenuItemCard({
  item,
  onAddVariant,
  onEditVariant,
  onDeleteVariant,
  onToggleVariant,
  onEdit,
  onDelete,
  onToggleItem,
}: MenuItemCardProps) {
  const imageUrl = getItemImageUrl(item.image);

  return (
    <article
      className="
        mx-3
        my-3
        overflow-hidden
        rounded-[22px]
        border
        border-gray-200
        bg-[#f1f1ef]
        text-gray-950
        shadow-[0_2px_10px_rgba(0,0,0,0.035)]
        transition
        duration-200
        sm:mx-5
        sm:my-5
        sm:rounded-[24px]
      "
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3.5">

          <button
            type="button"
            onClick={() => onEdit(item)}
            className="
              group
              flex
              min-w-0
              flex-1
              items-start
              gap-3.5
              text-left
              outline-none
            "
            aria-label={`Edit ${item.name}`}
          >
            <div
              className="
                relative
                h-[76px]
                w-[76px]
                shrink-0
                overflow-hidden
                rounded-[18px]
                bg-gray-100
                sm:h-24
                sm:w-24
              "
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <div
                  className="
                    flex
                    h-full
                    w-full
                    flex-col
                    items-center
                    justify-center
                    gap-1
                    text-gray-400
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
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

                  <span className="text-[9px] font-medium">
                    No image
                  </span>
                </div>
              )}

              {!item.available && imageUrl && (
                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    bg-black/40
                  "
                >
                  <span
                    className="
                      rounded-full
                      bg-white/95
                      px-2
                      py-1
                      text-[9px]
                      font-bold
                      text-gray-800
                    "
                  >
                    Unavailable
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3
                className="
                  text-[15px]
                  font-semibold
                  leading-5
                  tracking-[-0.015em]
                  text-gray-950
                  transition-colors
                  group-hover:text-gray-700
                  sm:text-base
                "
              >
                {item.name}
              </h3>

              {item.vegetarian && (
                <span
                  className="
                    mt-1.5
                    inline-flex
                    h-5
                    items-center
                    gap-1
                    rounded-full
                    bg-green-50
                    px-2
                    text-[10px]
                    font-semibold
                    text-green-700
                  "
                >
                  <span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-green-600
                    "
                  />

                  Veg
                </span>
              )}

              {item.description && (
                <p
                  className="
                    mt-1.5
                    line-clamp-2
                    text-xs
                    leading-5
                    text-gray-500
                    sm:text-sm
                  "
                >
                  {item.description}
                </p>
              )}

              <div className="mt-2">
                {item.price_range ? (
                  <span
                    className="
                      text-sm
                      font-bold
                      tracking-[-0.01em]
                      text-gray-950
                    "
                  >
                    ₹{item.price_min} – ₹
                    {item.price_max}
                  </span>
                ) : item.price ? (
                  <span
                    className="
                      text-sm
                      font-bold
                      tracking-[-0.01em]
                      text-gray-950
                    "
                  >
                    ₹{item.price}
                  </span>
                ) : (
                  <span
                    className="
                      text-xs
                      font-medium
                      text-gray-400
                    "
                  >
                    Price by variant
                  </span>
                )}
              </div>
            </div>
          </button>

          <div
            className="
              flex
              shrink-0
              flex-col
              items-center
              gap-2
            "
          >
            <button
              type="button"
              role="switch"
              aria-checked={item.available}
              aria-label={
                item.available
                  ? `Disable ${item.name}`
                  : `Enable ${item.name}`
              }
              onClick={(event) => {
                event.stopPropagation();
                onToggleItem(item);
              }}
              className="
                flex
                h-10
                w-12
                items-center
                justify-center
                rounded-xl
                transition
                active:scale-95
                focus:outline-none
                focus:ring-2
                focus:ring-gray-200
                focus:ring-offset-1
              "
            >
              <span
                className={`
                  flex
                  h-7
                  w-12
                  items-center
                  rounded-full
                  p-1
                  transition-all
                  duration-200
                  ${
                    item.available
                      ? "bg-green-300"
                      : "bg-gray-200"
                  }
                `}
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
                    duration-200
                    ${
                      item.available
                        ? "translate-x-5"
                        : "translate-x-0"
                    }
                  `}
                />
              </span>
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(item);
              }}
              aria-label={`Delete ${item.name}`}
              className="
                flex
                h-10
                w-10
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
                active:scale-95
                focus:outline-none
                focus:ring-2
                focus:ring-red-100
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
        </div>

        {!item.available && (
          <div
            className="
              mt-3
              flex
              items-center
              gap-1.5
              rounded-xl
              bg-red-50
              px-3
              py-2
              text-[11px]
              font-semibold
              text-red-600
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-red-500
              "
            />

            Currently unavailable
          </div>
        )}
      </div>

      <div
        className="
          border-t
          border-gray-100
          bg-gray-50/40
          px-4
          pb-4
          sm:px-5
          sm:pb-5
        "
      >
        <MenuVariantList
          item={item}
          onAddVariant={onAddVariant}
          onEditVariant={onEditVariant}
          onDeleteVariant={onDeleteVariant}
          onToggleVariant={onToggleVariant}
        />
      </div>
    </article>
  );
}