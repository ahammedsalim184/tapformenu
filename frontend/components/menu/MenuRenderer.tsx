
import type { MenuCategory } from "@/types/menu";

import ClassicMenu from "@/components/menu/layouts/ClassicMenu";
import CardMenu from "@/components/menu/layouts/CardMenu";
import ShowcaseMenu from "@/components/menu/layouts/ShowcaseMenu";

interface MenuRendererProps {
  layout: "classic" | "cards" | "showcase";
  categories: MenuCategory[];
  activeCategory: number;
  onCategoryChange: (index: number) => void;
}

export default function MenuRenderer({
  layout,
  categories,
  activeCategory,
  onCategoryChange,
}: MenuRendererProps) {
  switch (layout) {
    case "classic":
      return (
        <ClassicMenu
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
        />
      );

    case "showcase":
      return (
        <ShowcaseMenu
          categories={categories}
        />
      );

    case "cards":
    default:
      return (
        <CardMenu
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
        />
      );
  }
}
