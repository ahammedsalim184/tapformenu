"use client";

import { useState } from "react";
import type { MenuCategory, Restaurant } from "@/types/menu";
import { getMenuThemeStyles } from "@/components/menu/menuThemes";
import MenuHeader from "@/components/menu/MenuHeader";
import MenuCategoryNav from "@/components/menu/MenuCategoryNav";
import MenuRenderer from "@/components/menu/MenuRenderer";

interface MenuPageClientProps {
  restaurant: Restaurant;
  categories: MenuCategory[];
}

export default function MenuPageClient({
  restaurant,
  categories,
}: MenuPageClientProps) {
  const [activeCategory, setActiveCategory] = useState(0);

  const theme = restaurant.menu_theme || "classic";
  const styles = getMenuThemeStyles(theme);

  return (
    <main
      className={`min-h-screen transition-colors duration-500 ${styles.page}`}
    >
      <MenuHeader
        restaurant={restaurant}
        theme={theme}
      />

      <MenuCategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        theme={theme}
      />

      <MenuRenderer
        layout={restaurant.menu_layout}
        theme={theme}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
    </main>
  );
}