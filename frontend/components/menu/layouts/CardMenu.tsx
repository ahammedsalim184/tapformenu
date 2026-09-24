"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  MenuCategory,
  MenuTheme,
} from "@/types/menu";

import { getMediaUrl } from "@/lib/api";
import { getMenuThemeStyles } from "@/components/menu/menuThemes";

interface CardMenuProps {
  categories: MenuCategory[];
  activeCategory: number;
  onCategoryChange: (index: number) => void;
  theme: MenuTheme;
}

function formatPrice(
  price: string | null,
  priceRange: boolean,
  priceMin: string | null,
  priceMax: string | null
) {
  const cleanPrice = (value: string) => {
    const number = Number(value);

    if (Number.isInteger(number)) {
      return number.toString();
    }

    return number.toString();
  };

  if (priceRange && priceMin && priceMax) {
    return `₹${cleanPrice(priceMin)} - ₹${cleanPrice(
      priceMax
    )}`;
  }

  if (price) {
    return `₹${cleanPrice(price)}`;
  }

  return null;
}

export default function CardMenu({
  categories,
  activeCategory,
  onCategoryChange,
  theme,
}: CardMenuProps) {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const categoryRefs = useRef<
    Array<HTMLElement | null>
  >([]);

  const startX = useRef(0);
  const currentX = useRef(0);
  const isSwiping = useRef(false);

  const [dragOffset, setDragOffset] =
    useState(0);

  const [activeHeight, setActiveHeight] =
    useState<number | null>(null);

  const styles =
    getMenuThemeStyles(theme);

  useEffect(() => {
    const activeElement =
      categoryRefs.current[activeCategory];

    if (!activeElement) return;

    const updateHeight = () => {
      setActiveHeight(
        activeElement.offsetHeight
      );
    };

    updateHeight();

    const resizeObserver =
      new ResizeObserver(updateHeight);

    resizeObserver.observe(activeElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [activeCategory, categories]);

  useEffect(() => {
    const handleResize = () => {
      const activeElement =
        categoryRefs.current[activeCategory];

      if (activeElement) {
        setActiveHeight(
          activeElement.offsetHeight
        );
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [activeCategory]);

  if (!categories.length) {
    return null;
  }

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    startX.current =
      event.touches[0].clientX;

    currentX.current =
      event.touches[0].clientX;

    isSwiping.current = true;
  };

  const handleTouchMove = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    if (!isSwiping.current) return;

    currentX.current =
      event.touches[0].clientX;

    const delta =
      currentX.current -
      startX.current;

    let offset = delta;

    if (
      (activeCategory === 0 &&
        delta > 0) ||
      (activeCategory ===
        categories.length - 1 &&
        delta < 0)
    ) {
      offset = delta * 0.25;
    }

    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current) return;

    isSwiping.current = false;

    const delta =
      currentX.current -
      startX.current;

    const threshold = 60;

    let nextCategory =
      activeCategory;

    if (
      Math.abs(delta) >= threshold &&
      delta < 0 &&
      activeCategory <
        categories.length - 1
    ) {
      nextCategory =
        activeCategory + 1;
    }

    if (
      Math.abs(delta) >= threshold &&
      delta > 0 &&
      activeCategory > 0
    ) {
      nextCategory =
        activeCategory - 1;
    }

    setDragOffset(0);

    if (
      nextCategory !== activeCategory
    ) {
      onCategoryChange(
        nextCategory
      );
    }
  };

  const handleTouchCancel = () => {
    isSwiping.current = false;
    setDragOffset(0);
  };

  const containerWidth =
    containerRef.current?.clientWidth ||
    1;

  const translate =
    -(activeCategory * 100) +
    (dragOffset / containerWidth) *
      100;

  return (
    <section
      className={`
        w-full
        overflow-hidden
        transition-colors
        duration-500
        ${styles.page}
      `}
    >
      <div
        ref={containerRef}
        className="w-full overflow-hidden"
        style={{
          height:
            activeHeight !== null
              ? `${activeHeight}px`
              : "auto",
          transition:
            "height 350ms cubic-bezier(0.22, 1, 0.36, 1)",
          touchAction: "pan-y",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        <div
          className="
            flex
            w-full
            items-start
          "
          style={{
            transform: `translate3d(${translate}%, 0, 0)`,
            transition:
              isSwiping.current ||
              dragOffset !== 0
                ? "none"
                : "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "transform",
          }}
        >
          {categories.map(
            (category, index) => (
              <section
                key={category.id}
                ref={(element) => {
                  categoryRefs.current[index] =
                    element;
                }}
                className="
                  w-full
                  shrink-0
                  px-3
                  pb-8
                  pt-6
                  sm:px-5
                  sm:pb-10
                  sm:pt-8
                  lg:px-8
                  lg:pb-12
                  lg:pt-10
                "
              >
                <div className="mx-auto max-w-6xl">
                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-3
                      sm:grid-cols-2
                      sm:gap-4
                      lg:grid-cols-3
                    "
                  >
                    {category.items.map(
                      (item) => {
                        const itemPrice =
                          formatPrice(
                            item.price,
                            item.price_range,
                            item.price_min,
                            item.price_max
                          );

                        const imageUrl =
                          getMediaUrl(
                            item.image
                          );

                        return (
                          <article
                            key={item.id}
                            className={`
                              group
                              overflow-hidden
                              rounded-[20px]
                              border
                              shadow-[0_4px_18px_rgba(0,0,0,0.07),0_0_12px_rgba(0,0,0,0.035)]
                              transition-all
                              duration-300
                              hover:-translate-y-[2px]
                              hover:shadow-[0_10px_28px_rgba(0,0,0,0.12),0_0_18px_rgba(0,0,0,0.06)]
                              ${styles.card}
                            `}
                          >
                            {imageUrl ? (
                              <div
                                className={`
                                  relative
                                  h-48
                                  w-full
                                  overflow-hidden
                                  sm:h-52
                                  lg:h-56
                                  ${styles.imageBackground}
                                `}
                              >
                                <img
                                  src={imageUrl}
                                  alt={item.name}
                                  draggable={false}
                                  className="
                                    block
                                    h-full
                                    w-full
                                    select-none
                                    object-cover
                                    transition-transform
                                    duration-500
                                    group-hover:scale-[1.035]
                                  "
                                />

                                {!item.available && (
                                  <div
                                    className="
                                      absolute
                                      inset-0
                                      flex
                                      items-center
                                      justify-center
                                      bg-black/35
                                    "
                                  >
                                    <span
                                      className="
                                        rounded-full
                                        bg-white/95
                                        px-3
                                        py-1.5
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-gray-800
                                      "
                                    >
                                      Unavailable
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div
                                className={`
                                  flex
                                  h-48
                                  w-full
                                  items-center
                                  justify-center
                                  text-xs
                                  sm:h-52
                                  lg:h-56
                                  ${styles.imageBackground}
                                  ${styles.imagePlaceholder}
                                `}
                              >
                                No image
                              </div>
                            )}

                            <div className="p-4 sm:p-5">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <h3
                                    className={`
                                      text-[16px]
                                      font-semibold
                                      leading-5
                                      tracking-[-0.015em]
                                      sm:text-[17px]
                                      ${styles.itemName}
                                    `}
                                  >
                                    {item.name}
                                  </h3>

                                  {item.description && (
                                    <p
                                      className={`
                                        mt-1.5
                                        line-clamp-2
                                        text-[12px]
                                        leading-5
                                        sm:text-[13px]
                                        ${styles.description}
                                      `}
                                    >
                                      {
                                        item.description
                                      }
                                    </p>
                                  )}
                                </div>

                                {item.vegetarian && (
                                  <span
                                    className={`
                                      mt-0.5
                                      flex
                                      h-5
                                      w-5
                                      shrink-0
                                      items-center
                                      justify-center
                                      rounded-[5px]
                                      border
                                      ${styles.vegetarianBorder}
                                    `}
                                    title="Vegetarian"
                                  >
                                    <span
                                      className={`
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        ${styles.vegetarianDot}
                                      `}
                                    />
                                  </span>
                                )}
                              </div>

                              {itemPrice && (
                                <div className="mt-3">
                                  <span
                                    className={`
                                      text-[17px]
                                      font-bold
                                      tracking-[-0.02em]
                                      ${styles.price}
                                    `}
                                  >
                                    {itemPrice}
                                  </span>
                                </div>
                              )}

                              {item.variants.length >
                                0 && (
                                <div className="mt-4 space-y-1.5">
                                  {item.variants.map(
                                    (
                                      variant
                                    ) => {
                                      const variantPrice =
                                        formatPrice(
                                          variant.price,
                                          variant.price_range,
                                          variant.price_min,
                                          variant.price_max
                                        );

                                      return (
                                        <div
                                          key={
                                            variant.id
                                          }
                                          className="
                                            flex
                                            min-h-9
                                            items-center
                                            justify-between
                                            gap-3
                                            rounded-xl
                                            px-3
                                            py-1.5
                                          "
                                        >
                                          <div className="flex min-w-0 items-center gap-2">
                                            <span
                                              className={`
                                                h-1
                                                w-1
                                                shrink-0
                                                rounded-full
                                                opacity-50
                                                ${styles.navUnderline}
                                              `}
                                            />

                                            <span
                                              className={`
                                                truncate
                                                text-[12px]
                                                font-medium
                                                ${styles.variantName}
                                              `}
                                            >
                                              {
                                                variant.name
                                              }
                                            </span>
                                          </div>

                                          {variantPrice && (
                                            <span
                                              className={`
                                                shrink-0
                                                text-[12px]
                                                font-semibold
                                                ${styles.variantPrice}
                                              `}
                                            >
                                              {
                                                variantPrice
                                              }
                                            </span>
                                          )}
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              )}
                            </div>
                          </article>
                        );
                      }
                    )}
                  </div>
                </div>
              </section>
            )
          )}
        </div>
      </div>
    </section>
  );
}