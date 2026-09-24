"use client";

import { useEffect, useRef } from "react";
import type { MenuCategory, MenuTheme } from "@/types/menu";
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
  const styles = getMenuThemeStyles(theme);

  useEffect(() => {
    const activeButton = buttonRefs.current[activeCategory];

    if (!activeButton || !scrollRef.current) {
      return;
    }

    activeButton.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeCategory]);

  return (
    <nav
      className={`sticky top-0 z-40 border-b transition-colors duration-500 ${styles.nav} ${styles.navBorder}`}
    >
      <div className="relative mx-auto max-w-6xl">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-none"
        >
          {categories.map((category, index) => {
            const active = index === activeCategory;

            return (
              <button
                key={category.id}
                ref={(element) => {
                  buttonRefs.current[index] = element;
                }}
                type="button"
                onClick={() => onCategoryChange(index)}
                className={`group relative shrink-0 px-5 py-4 text-sm font-medium transition-colors duration-300 sm:px-7 ${
                  active
                    ? styles.navActive
                    : styles.navInactive
                }`}
              >
                {category.name}

                <span
                  className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 transition-all duration-300 ${
                    active
                      ? `w-8 ${styles.navUnderline}`
                      : "w-0"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div
          className={`pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r ${styles.navFadeFrom} to-transparent`}
        />

        <div
          className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l ${styles.navFadeFrom} to-transparent`}
        />
      </div>
    </nav>
  );
}