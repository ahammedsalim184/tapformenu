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

interface ClassicMenuProps {
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
  if (priceRange && priceMin && priceMax) {
    return `₹${parseFloat(priceMin)} - ₹${parseFloat(priceMax)}`;
  }

  if (price) {
    return `₹${parseFloat(price)}`;
  }

  return null;
}

export default function ClassicMenu({
  categories,
  activeCategory,
  onCategoryChange,
  theme,
}: ClassicMenuProps) {
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

    if (Math.abs(delta) >= threshold) {
      if (
        delta < 0 &&
        activeCategory <
          categories.length - 1
      ) {
        nextCategory =
          activeCategory + 1;
      }

      if (
        delta > 0 &&
        activeCategory > 0
      ) {
        nextCategory =
          activeCategory - 1;
      }
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
      className={`w-full overflow-hidden transition-colors duration-500 ${styles.page}`}
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
          className="flex w-full items-start"
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
                className="w-full shrink-0 px-4 py-8 sm:px-6 lg:px-8"
              >
                <div className="mx-auto max-w-4xl">
                  <div
                    className={`
                      mb-6
                      border-b
                      pb-3
                      ${styles.categoryBorder}
                    `}
                  >
                    <h2
                      className={`
                        text-2xl
                        font-bold
                        sm:text-3xl
                        ${styles.categoryTitle}
                      `}
                    >
                      {category.name}
                    </h2>

                    {category.description && (
                      <p
                        className={`
                          mt-2
                          text-sm
                          ${styles.categoryDescription}
                        `}
                      >
                        {category.description}
                      </p>
                    )}
                  </div>

                  <div
                    className={`
                      divide-y
                      ${styles.categoryBorder}
                    `}
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
                            className="flex gap-4 py-5"
                          >
                            {imageUrl && (
                              <div
                                className={`
                                  h-24
                                  w-24
                                  shrink-0
                                  overflow-hidden
                                  rounded-xl
                                  ${styles.imageBackground}
                                  sm:h-28
                                  sm:w-28
                                `}
                              >
                                <img
                                  src={imageUrl}
                                  alt={item.name}
                                  draggable={false}
                                  className="
                                    h-full
                                    w-full
                                    select-none
                                    object-cover
                                  "
                                />
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h3
                                      className={`
                                        font-semibold
                                        ${styles.itemName}
                                      `}
                                    >
                                      {item.name}
                                    </h3>

                                    {item.vegetarian && (
                                      <span
                                        className={`
                                          h-4
                                          w-4
                                          shrink-0
                                          rounded-sm
                                          border-2
                                          ${styles.vegetarianBorder}
                                        `}
                                        title="Vegetarian"
                                      >
                                        <span
                                          className={`
                                            mx-auto
                                            mt-[3px]
                                            block
                                            h-1.5
                                            w-1.5
                                            rounded-full
                                            ${styles.vegetarianDot}
                                          `}
                                        />
                                      </span>
                                    )}
                                  </div>

                                  {item.description && (
                                    <p
                                      className={`
                                        mt-1
                                        text-sm
                                        leading-6
                                        ${styles.description}
                                      `}
                                    >
                                      {
                                        item.description
                                      }
                                    </p>
                                  )}
                                </div>

                                {itemPrice && (
                                  <span
                                    className={`
                                      shrink-0
                                      font-semibold
                                      ${styles.price}
                                    `}
                                  >
                                    {
                                      itemPrice
                                    }
                                  </span>
                                )}
                              </div>

                              {item.variants.length >
                                0 && (
                                <div
                                  className={`
                                    mt-3
                                    space-y-1
                                    border-t
                                    pt-3
                                    ${styles.variantBorder}
                                  `}
                                >
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
                                          className="flex justify-between gap-4 text-sm"
                                        >
                                          <span
                                            className={
                                              styles.variantName
                                            }
                                          >
                                            {
                                              variant.name
                                            }
                                          </span>

                                          {variantPrice && (
                                            <span
                                              className={`
                                                font-medium
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