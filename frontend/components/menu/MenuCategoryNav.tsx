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
import { getMenuThemeStyles } from "@/components/menu/menuThemes";

interface MenuCategoryNavProps {
  categories: MenuCategory[];
  activeCategory: number;
  onCategoryChange: (index: number) => void;
  theme: MenuTheme;
}

export default function MenuCategoryNav({
  categories,
  activeCategory,
  onCategoryChange,
  theme,
}: MenuCategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [canScrollLeft, setCanScrollLeft] =
    useState(false);
  const [canScrollRight, setCanScrollRight] =
    useState(false);

  const styles = getMenuThemeStyles(theme);

  const updateScrollState = () => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const maxScroll =
      container.scrollWidth - container.clientWidth;

    setCanScrollLeft(container.scrollLeft > 4);
    setCanScrollRight(
      maxScroll > 4 &&
        container.scrollLeft < maxScroll - 4
    );
  };

  useEffect(() => {
    updateScrollState();

    const container = scrollRef.current;

    if (!container) {
      return;
    }

    container.addEventListener(
      "scroll",
      updateScrollState,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateScrollState
    );

    return () => {
      container.removeEventListener(
        "scroll",
        updateScrollState
      );

      window.removeEventListener(
        "resize",
        updateScrollState
      );
    };
  }, [categories.length]);

  useEffect(() => {
    const activeButton =
      buttonRefs.current[activeCategory];

    const container = scrollRef.current;

    if (!activeButton || !container) {
      return;
    }

    const buttonLeft = activeButton.offsetLeft;
    const buttonWidth = activeButton.offsetWidth;

    const containerWidth =
      container.clientWidth;

    const targetScroll =
      buttonLeft -
      containerWidth / 2 +
      buttonWidth / 2;

    container.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: "smooth",
    });

    window.setTimeout(
      updateScrollState,
      350
    );
  }, [activeCategory]);

  return (
    <nav
      className={`
        sticky
        top-0
        z-40
        border-b
        transition-colors
        duration-500
        ${styles.nav}
        ${styles.navBorder}
      `}
    >
      <div className="relative mx-auto max-w-6xl">
        <div
          ref={scrollRef}
          className="
            scrollbar-none
            flex
            w-full
            overflow-x-auto
            overscroll-x-contain
            scroll-smooth
          "
        >
          <div
            className="
              mx-auto
              flex
              min-w-max
              items-center
              px-2
              sm:px-4
            "
          >
            {categories.map(
              (category, index) => {
                const active =
                  index === activeCategory;

                return (
                  <button
                    key={category.id}
                    ref={(element) => {
                      buttonRefs.current[index] =
                        element;
                    }}
                    type="button"
                    onClick={() =>
                      onCategoryChange(index)
                    }
                    className={`
                      group
                      relative
                      flex
                      h-14
                      shrink-0
                      items-center
                      justify-center
                      px-4
                      text-sm
                      font-medium
                      whitespace-nowrap
                      transition-colors
                      duration-300
                      sm:h-15
                      sm:px-6
                      ${
                        active
                          ? styles.navActive
                          : styles.navInactive
                      }
                    `}
                  >
                    <span className="relative">
                      {category.name}

                      <span
                        className={`
                          absolute
                          -bottom-[17px]
                          left-1/2
                          h-0.5
                          -translate-x-1/2
                          rounded-full
                          transition-all
                          duration-300
                          ${
                            active
                              ? `w-8 ${styles.navUnderline}`
                              : "w-0"
                          }
                        `}
                      />
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {canScrollLeft && (
          <div
            className={`
              pointer-events-none
              absolute
              inset-y-0
              left-0
              w-8
              bg-gradient-to-r
              ${styles.navFadeFrom}
              to-transparent
            `}
          />
        )}

        {canScrollRight && (
          <div
            className={`
              pointer-events-none
              absolute
              inset-y-0
              right-0
              w-8
              bg-gradient-to-l
              ${styles.navFadeFrom}
              to-transparent
            `}
          />
        )}
      </div>
    </nav>
  );
}