"use client";

import { useState } from "react";

import type {
  MenuCategory,
  Restaurant,
} from "@/types/menu";

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
  const [activeCategory, setActiveCategory] =
    useState(0);

  return (
    <main className="min-h-screen bg-white">
      <MenuHeader restaurant={restaurant} />

      <MenuCategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <MenuRenderer
        layout={restaurant.menu_layout}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
    </main>
  );
}