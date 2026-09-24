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
    return `₹${cleanPrice(priceMin)} - ₹${cleanPrice(priceMax)}`;
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
                className="w-full shrink-0 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
              >
                <div className="mx-auto max-w-6xl">
                  <div className="mb-7 sm:mb-9">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-[0.22em] ${styles.categoryDescription}`}
                      >
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </span>

                      <span
                        className={`h-px w-8 ${styles.categoryBorder.replace(
                          "border-",
                          "bg-"
                        )}`}
                      />

                      <span
                        className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${styles.categoryDescription}`}
                      >
                        Menu
                      </span>
                    </div>

                    <div className="mt-3 flex items-end justify-between gap-4">
                      <h2
                        className={`
                          text-2xl
                          font-bold
                          tracking-tight
                          sm:text-3xl
                          md:text-4xl
                          ${styles.categoryTitle}
                        `}
                      >
                        {category.name}
                      </h2>

                      <span
                        className={`
                          hidden
                          shrink-0
                          text-[10px]
                          font-medium
                          uppercase
                          tracking-[0.18em]
                          sm:block
                          ${styles.categoryDescription}
                        `}
                      >
                        {category.items.length}{" "}
                        {category.items.length ===
                        1
                          ? "Item"
                          : "Items"}
                      </span>
                    </div>

                    {category.description && (
                      <p
                        className={`
                          mt-2
                          max-w-2xl
                          text-sm
                          leading-6
                          sm:mt-3
                          sm:text-base
                          ${styles.categoryDescription}
                        `}
                      >
                        {
                          category.description
                        }
                      </p>
                    )}

                    <div className="mt-5 flex items-center gap-2 sm:mt-6">
                      <span
                        className={`
                          h-1.5
                          w-1.5
                          rounded-full
                          ${styles.navUnderline}
                        `}
                      />

                      <span
                        className={`
                          h-px
                          flex-1
                          ${styles.categoryBorder.replace(
                            "border-",
                            "bg-"
                          )}
                        `}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
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
                              overflow-hidden
                              rounded-2xl
                              border
                              transition-all
                              duration-300
                              ${styles.card}
                            `}
                          >
                            {imageUrl ? (
                              <div
                                className={`
                                  aspect-[4/3]
                                  overflow-hidden
                                  ${styles.imageBackground}
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
                                    transition
                                    duration-300
                                    hover:scale-105
                                  "
                                />
                              </div>
                            ) : (
                              <div
                                className={`
                                  flex
                                  aspect-[4/3]
                                  items-center
                                  justify-center
                                  text-sm
                                  ${styles.imageBackground}
                                  ${styles.imagePlaceholder}
                                `}
                              >
                                No image
                              </div>
                            )}

                            <div className="p-5">
                              <div className="flex items-start justify-between gap-3">
                                <h3
                                  className={`text-lg font-semibold ${styles.itemName}`}
                                >
                                  {item.name}
                                </h3>

                                {item.vegetarian && (
                                  <span
                                    className={`
                                      mt-1
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
                                    mt-2
                                    line-clamp-2
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

                              {itemPrice && (
                                <div className="mt-4">
                                  <span
                                    className={`
                                      text-lg
                                      font-bold
                                      ${styles.price}
                                    `}
                                  >
                                    {
                                      itemPrice
                                    }
                                  </span>
                                </div>
                              )}

                              {item.variants
                                .length >
                                0 && (
                                <div
                                  className={`
                                    mt-4
                                    space-y-2
                                    border-t
                                    pt-4
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
                                          className="flex items-center justify-between gap-3 text-sm"
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