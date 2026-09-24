import type { MenuCategory, MenuTheme } from "@/types/menu";
import ClassicMenu from "@/components/menu/layouts/ClassicMenu";
import CardMenu from "@/components/menu/layouts/CardMenu";

interface MenuRendererProps {
  layout: "classic" | "cards" | "showcase";
  theme: MenuTheme;
  categories: MenuCategory[];
  activeCategory: number;
  onCategoryChange: (index: number) => void;
}

export default function MenuRenderer({
  layout,
  theme,
  categories,
  activeCategory,
  onCategoryChange,
}: MenuRendererProps) {
  switch (layout) {
    case "classic":
      return (
        <ClassicMenu
          theme={theme}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
        />
      );

    case "cards":
    default:
      return (
        <CardMenu
          theme={theme}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
        />
      );
  }
}