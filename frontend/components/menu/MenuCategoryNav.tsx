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
    if (!navRef.current) return;

    const container = navRef.current;

    const categoryElements = Array.from(
      container.querySelectorAll<HTMLElement>(
        "[data-category-index]"
      )
    );

    const activeElement = categoryElements[activeCategory];

    if (!activeElement) return;

    const containerRect = container.getBoundingClientRect();
    const elementRect = activeElement.getBoundingClientRect();

    const leftLimit = containerRect.left + 16;
    const rightLimit = containerRect.right - 40;

    if (
      elementRect.right >= rightLimit - 20 &&
      activeCategory < categoryElements.length - 1
    ) {
      const nextElement = categoryElements[activeCategory + 1];
      const nextRect = nextElement.getBoundingClientRect();

      const amount = nextRect.right - rightLimit + 24;

      if (amount > 0) {
        container.scrollBy({
          left: amount,
          behavior: "smooth",
        });
      }

      return;
    }

    if (
      elementRect.left <= leftLimit + 20 &&
      activeCategory > 0
    ) {
      const previousElement = categoryElements[activeCategory - 1];
      const previousRect = previousElement.getBoundingClientRect();

      const amount = previousRect.left - leftLimit - 24;

      if (amount < 0) {
        container.scrollBy({
          left: amount,
          behavior: "smooth",
        });
      }

      return;
    }

    if (elementRect.right > containerRect.right) {
      container.scrollBy({
        left:
          elementRect.right -
          containerRect.right +
          24,
        behavior: "smooth",
      });
    }

    if (elementRect.left < containerRect.left) {
      container.scrollBy({
        left:
          elementRect.left -
          containerRect.left -
          24,
        behavior: "smooth",
      });
    }
  }, [activeCategory]);

  if (!categories.length) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-30 w-full bg-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div
          className="
            relative
            overflow-hidden
            rounded-b-2xl
            border
            border-t-0
            border-gray-100
            bg-white/95
            shadow-sm
            backdrop-blur-md
            sm:rounded-b-[20px]
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              left-0
              top-0
              z-20
              h-full
              w-6
              bg-gradient-to-r
              from-white
              to-transparent
              sm:hidden
            "
          />

          <div
            ref={navRef}
            className="
              flex
              w-full
              items-center
              justify-start
              gap-2
              overflow-x-auto
              px-0
              py-2
              sm:justify-center
              sm:gap-2.5
              sm:py-2.5
              [&::-webkit-scrollbar]:hidden
            "
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {categories.map((category, index) => {
              const isActive = activeCategory === index;

              return (
                <button
                  key={category.id}
                  type="button"
                  data-category-index={index}
                  onClick={() => onCategoryChange(index)}
                  className={`
                    relative
                    shrink-0
                    rounded-full
                    border
                    px-3.5
                    py-2
                    text-[11px]
                    font-semibold
                    tracking-wide
                    whitespace-nowrap
                    transition-all
                    duration-300
                    active:scale-95
                    sm:px-4
                    sm:py-2
                    sm:text-[12px]
                    lg:px-5
                    ${
                      isActive
                        ? `
                          border-sky-200
                          bg-sky-50
                          text-gray-900
                          shadow-sm
                          shadow-sky-100
                        `
                        : `
                          border-gray-200
                          bg-white
                          text-gray-500
                          hover:border-sky-200
                          hover:bg-sky-50
                          hover:text-gray-900
                        `
                    }
                  `}
                >
                  {category.name}
                </button>
              );
            })}
          </div>

          <div
            className="
              pointer-events-none
              absolute
              right-0
              top-0
              z-20
              h-full
              w-6
              bg-gradient-to-l
              from-white
              to-transparent
              sm:hidden
            "
          />
        </div>
      </div>
    </nav>
  );
}