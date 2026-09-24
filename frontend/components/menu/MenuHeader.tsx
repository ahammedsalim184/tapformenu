import type { MenuTheme, Restaurant } from "@/types/menu";
import { getMenuThemeStyles } from "@/components/menu/menuThemes";

interface MenuHeaderProps {
  restaurant: Restaurant;
  theme: MenuTheme;
}

export default function MenuHeader({
  restaurant,
  theme,
}: MenuHeaderProps) {
  const styles = getMenuThemeStyles(theme);

  return (
    <header
      className={`px-6 pb-8 pt-10 transition-colors duration-500 ${styles.header}`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-center gap-3">
          <span className={`h-px w-10 ${styles.headerLine}`} />
          <span
            className={`h-1.5 w-1.5 rounded-full ${styles.headerDot}`}
          />
          <span
            className={`h-2.5 w-2.5 rotate-45 ${styles.headerDiamond}`}
          />
          <span
            className={`h-1.5 w-1.5 rounded-full ${styles.headerDot}`}
          />
          <span className={`h-px w-10 ${styles.headerLine}`} />
        </div>

        <h1
          className={`mt-2 text-center text-3xl font-semibold tracking-tight sm:text-4xl ${styles.headerTitle}`}
        >
          Menu
        </h1>
      </div>
    </header>
  );
}