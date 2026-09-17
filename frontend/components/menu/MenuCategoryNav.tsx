"use client";

import { useEffect, useRef } from "react";
import type { MenuCategory } from "@/types/menu";

interface MenuCategoryNavProps {
  categories: MenuCategory[];
  activeCategory: number;
  onCategoryChange: (index: number) => void;
}

export default function MenuCategoryNav({
  categories,
  activeCategory,
  onCategoryChange,
}: MenuCategoryNavProps) {
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = navRef.current;

    if (!container) return;

    // Do not move the navigation when the page
    // initially loads on the first category.
    if (activeCategory === 0) {
      return;
    }

    const activeElement = container.querySelector<HTMLElement>(
      `[data-category-index="${activeCategory}"]`
    );

    if (!activeElement) return;

    const containerRect = container.getBoundingClientRect();
    const elementRect = activeElement.getBoundingClientRect();

    /*
     * MOBILE
     *
     * Move the selected category toward
     * the centre of the phone screen.
     */
    const isMobile = window.innerWidth < 640;

    if (isMobile) {
      const containerCenter =
        containerRect.left + containerRect.width / 2;

      const elementCenter =
        elementRect.left + elementRect.width / 2;

      const distance = elementCenter - containerCenter;

      if (Math.abs(distance) > 4) {
        container.scrollBy({
          left: distance,
          behavior: "smooth",
        });
      }

      return;
    }

    /*
     * TABLET / DESKTOP
     *
     * Only scroll when the selected category
     * is outside the visible area.
     */
    const padding = 40;

    if (elementRect.right > containerRect.right - padding) {
      container.scrollBy({
        left:
          elementRect.right -
          containerRect.right +
          padding,
        behavior: "smooth",
      });

      return;
    }

    if (elementRect.left < containerRect.left + padding) {
      container.scrollBy({
        left:
          elementRect.left -
          containerRect.left -
          padding,
        behavior: "smooth",
      });
    }
  }, [activeCategory]);

  if (!categories.length) {
    return null;
  }

  return (
    <nav
      aria-label="Menu categories"
      className="
        sticky
        top-0
        z-40
        w-full
        border-b
        border-gray-100
        bg-white/95
        backdrop-blur-xl
      "
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="relative">

          {/* Category scrolling area */}
          <div
            ref={navRef}
            className="
              w-full
              overflow-x-auto
              scroll-smooth
              overscroll-x-contain
              touch-pan-x
              [&::-webkit-scrollbar]:hidden
            "
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {/* Category row */}
            <div
              className="
                flex
                w-max
                min-w-full
                items-center
                justify-start
                gap-7
                px-6
                py-4

                sm:gap-9
                sm:px-8
                sm:py-5

                lg:justify-center
                lg:gap-12
                lg:px-10
              "
            >
              {categories.map((category, index) => {
                const isActive = activeCategory === index;

                return (
                  <button
                    key={category.id}
                    type="button"
                    data-category-index={index}
                    aria-current={
                      isActive ? "true" : undefined
                    }
                    aria-label={`Show ${category.name}`}
                    onClick={() =>
                      onCategoryChange(index)
                    }
                    className="
                      group
                      relative
                      shrink-0
                      whitespace-nowrap
                      px-1
                      pb-3
                      pt-1
                      text-[15px]
                      font-medium
                      tracking-[-0.01em]
                      transition-all
                      duration-200
                      ease-out
                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-black/30
                      focus-visible:ring-offset-4
                      active:scale-[0.97]
                      sm:text-base
                    "
                  >
                    <span
                      className={`
                        transition-colors
                        duration-200
                        ${
                          isActive
                            ? "font-semibold text-black"
                            : "text-gray-400 group-hover:text-gray-700"
                        }
                      `}
                    >
                      {category.name}
                    </span>

                    {/* Black active underline */}
                    <span
                      aria-hidden="true"
                      className={`
                        absolute
                        bottom-0
                        left-1/2
                        h-[3px]
                        -translate-x-1/2
                        rounded-full
                        bg-black
                        transition-all
                        duration-300
                        ease-out
                        ${
                          isActive
                            ? "w-full opacity-100"
                            : "w-0 opacity-0"
                        }
                      `}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Left fade */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-y-0
              left-0
              z-10
              w-8
              bg-gradient-to-r
              from-white
              to-transparent
              sm:w-12
            "
          />

          {/* Right fade */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-y-0
              right-0
              z-10
              w-8
              bg-gradient-to-l
              from-white
              to-transparent
              sm:w-12
            "
          />
        </div>
      </div>
    </nav>
  );
}