import type { MenuTheme } from "@/types/menu";

export interface MenuThemeStyles {
  page: string;

  header: string;
  headerTitle: string;
  headerRestaurant: string;
  headerLine: string;
  headerDot: string;
  headerDiamond: string;

  nav: string;
  navBorder: string;
  navActive: string;
  navInactive: string;
  navUnderline: string;
  navFadeFrom: string;

  categoryTitle: string;
  categoryDescription: string;
  categoryBorder: string;

  card: string;
  imageBackground: string;
  imagePlaceholder: string;

  itemName: string;
  description: string;
  price: string;

  variantBorder: string;
  variantName: string;
  variantPrice: string;

  vegetarianBorder: string;
  vegetarianDot: string;

  showcaseCard: string;
}

export const MENU_THEME_STYLES: Record<MenuTheme, MenuThemeStyles> = {
  classic: {
    page: "bg-white text-gray-900",

    header: "bg-white",
    headerTitle: "text-gray-950",
    headerRestaurant: "text-gray-500",
    headerLine: "bg-gray-200",
    headerDot: "bg-gray-300",
    headerDiamond: "bg-gray-900",

    nav: "bg-white/95 backdrop-blur-md",
    navBorder: "border-gray-100",
    navActive: "text-gray-950",
    navInactive: "text-gray-400 group-hover:text-gray-700",
    navUnderline: "bg-gray-950",
    navFadeFrom: "from-white",

    categoryTitle: "text-gray-900",
    categoryDescription: "text-gray-500",
    categoryBorder: "border-gray-200",

    card: "border-gray-200 bg-white shadow-sm hover:shadow-md",
    imageBackground: "bg-gray-100",
    imagePlaceholder: "text-gray-400",

    itemName: "text-gray-900",
    description: "text-gray-500",
    price: "text-gray-900",

    variantBorder: "border-gray-100",
    variantName: "text-gray-700",
    variantPrice: "text-gray-900",

    vegetarianBorder: "border-green-600",
    vegetarianDot: "bg-green-600",

    showcaseCard: "bg-gray-50 border-gray-100",
  },

  dark: {
    page: "bg-[#0b0b0b] text-zinc-100",

    header: "bg-[#0b0b0b]",
    headerTitle: "text-white",
    headerRestaurant: "text-zinc-500",
    headerLine: "bg-zinc-800",
    headerDot: "bg-zinc-700",
    headerDiamond: "bg-white",

    nav: "bg-[#0b0b0b]/95 backdrop-blur-md",
    navBorder: "border-zinc-800",
    navActive: "text-white",
    navInactive: "text-zinc-500 group-hover:text-zinc-300",
    navUnderline: "bg-white",
    navFadeFrom: "from-[#0b0b0b]",

    categoryTitle: "text-white",
    categoryDescription: "text-zinc-400",
    categoryBorder: "border-zinc-800",

    card: "border-zinc-800 bg-zinc-900/80 shadow-black/20 hover:border-zinc-700 hover:shadow-xl",
    imageBackground: "bg-zinc-800",
    imagePlaceholder: "text-zinc-500",

    itemName: "text-white",
    description: "text-zinc-400",
    price: "text-white",

    variantBorder: "border-zinc-800",
    variantName: "text-zinc-300",
    variantPrice: "text-zinc-100",

    vegetarianBorder: "border-emerald-400",
    vegetarianDot: "bg-emerald-400",

    showcaseCard: "bg-zinc-900/80 border-zinc-800",
  },
};

export function getMenuThemeStyles(
  theme?: MenuTheme | string | null,
): MenuThemeStyles {
  if (theme === "dark") {
    return MENU_THEME_STYLES.dark;
  }

  return MENU_THEME_STYLES.classic;
}