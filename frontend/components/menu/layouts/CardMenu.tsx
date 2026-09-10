"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { MenuCategory } from "@/types/menu";
import { getMediaUrl } from "@/lib/api";

interface CardMenuProps {
  categories: MenuCategory[];
  activeCategory: number;
  onCategoryChange: (index: number) => void;
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
}: CardMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const categoryRefs = useRef<
    Array<HTMLElement | null>
  >([]);

  const startX = useRef(0);
  const currentX = useRef(0);
  const isSwiping = useRef(false);

  const [dragOffset, setDragOffset] = useState(0);
  const [activeHeight, setActiveHeight] = useState<
    number | null
  >(null);

  /*
   * Measure the currently active category.
   */
  useEffect(() => {
    const activeElement =
      categoryRefs.current[activeCategory];

    if (!activeElement) return;

    const updateHeight = () => {
      setActiveHeight(activeElement.offsetHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(
      updateHeight
    );

    resizeObserver.observe(activeElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [activeCategory, categories]);

  /*
   * Recalculate category height when browser width changes.
   */
  useEffect(() => {
    const handleResize = () => {
      const activeElement =
        categoryRefs.current[activeCategory];

      if (activeElement) {
        setActiveHeight(activeElement.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);

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

  /*
   * Touch start
   */
  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    startX.current =
      event.touches[0].clientX;

    currentX.current =
      event.touches[0].clientX;

    isSwiping.current = true;
  };

  /*
   * Finger-following movement
   */
  const handleTouchMove = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    if (!isSwiping.current) return;

    currentX.current =
      event.touches[0].clientX;

    const delta =
      currentX.current - startX.current;

    let offset = delta;

    /*
     * Resistance at first/last category.
     */
    if (
      (activeCategory === 0 && delta > 0) ||
      (activeCategory === categories.length - 1 &&
        delta < 0)
    ) {
      offset = delta * 0.25;
    }

    setDragOffset(offset);
  };

  /*
   * Finish swipe
   */
  const handleTouchEnd = () => {
    if (!isSwiping.current) return;

    isSwiping.current = false;

    const delta =
      currentX.current - startX.current;

    const threshold = 60;

    let nextCategory = activeCategory;

    /*
     * Swipe left
     */
    if (
      Math.abs(delta) >= threshold &&
      delta < 0 &&
      activeCategory < categories.length - 1
    ) {
      nextCategory = activeCategory + 1;
    }

    /*
     * Swipe right
     */
    if (
      Math.abs(delta) >= threshold &&
      delta > 0 &&
      activeCategory > 0
    ) {
      nextCategory = activeCategory - 1;
    }

    setDragOffset(0);

    if (nextCategory !== activeCategory) {
      onCategoryChange(nextCategory);
    }
  };

  /*
   * Cancelled touch
   */
  const handleTouchCancel = () => {
    isSwiping.current = false;
    setDragOffset(0);
  };

  /*
   * Calculate horizontal movement relative to
   * actual menu viewport width.
   */
  const containerWidth =
    containerRef.current?.clientWidth || 1;

  const translate =
    -(activeCategory * 100) +
    (dragOffset / containerWidth) * 100;

  return (
    <section className="w-full overflow-hidden">
      {/* Dynamic-height viewport */}
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
        {/* Horizontal slider */}
        <div
          className="flex w-full items-start"
          style={{
            transform: `translate3d(${translate}%, 0, 0)`,
            transition:
              isSwiping.current || dragOffset !== 0
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
                <div className="mx-auto max-w-6xl">
                  {/* Category heading */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                      {category.name}
                    </h2>

                    {category.description && (
                      <p className="mt-2 max-w-2xl text-sm text-gray-500 sm:text-base">
                        {category.description}
                      </p>
                    )}
                  </div>

                  {/* Menu items */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                          getMediaUrl(item.image);

                        return (
                          <article
                            key={item.id}
                            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                          >
                            {/* Image */}
                            {imageUrl ? (
                              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                                <img
                                  src={imageUrl}
                                  alt={item.name}
                                  draggable={false}
                                  className="h-full w-full select-none object-cover transition duration-300 hover:scale-105"
                                />
                              </div>
                            ) : (
                              <div className="flex aspect-[4/3] items-center justify-center bg-gray-100 text-sm text-gray-400">
                                No image
                              </div>
                            )}

                            {/* Content */}
                            <div className="p-5">
                              <div className="flex items-start justify-between gap-3">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {item.name}
                                </h3>

                                {/* Vegetarian */}
                                {item.vegetarian && (
                                  <span
                                    className="mt-1 h-4 w-4 shrink-0 rounded-sm border-2 border-green-600"
                                    title="Vegetarian"
                                  >
                                    <span className="mx-auto mt-[3px] block h-1.5 w-1.5 rounded-full bg-green-600" />
                                  </span>
                                )}
                              </div>

                              {/* Description */}
                              {item.description && (
                                <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                                  {item.description}
                                </p>
                              )}

                              {/* Price */}
                              {itemPrice && (
                                <div className="mt-4">
                                  <span className="text-lg font-bold text-gray-900">
                                    {itemPrice}
                                  </span>
                                </div>
                              )}

                              {/* Variants */}
                              {item.variants.length >
                                0 && (
                                <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
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
                                          <span className="text-gray-700">
                                            {
                                              variant.name
                                            }
                                          </span>

                                          {variantPrice && (
                                            <span className="font-semibold text-gray-900">
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