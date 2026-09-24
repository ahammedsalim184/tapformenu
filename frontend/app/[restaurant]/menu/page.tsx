import { notFound } from "next/navigation";

import RestaurantNav from "@/components/restaurant/RestaurantNav";
import { getRestaurantMenu } from "@/lib/api";
import MenuPageClient from "@/components/menu/MenuPageClient";

interface MenuPageProps {
  params: Promise<{
    restaurant: string;
  }>;
}

export default async function MenuPage({
  params,
}: MenuPageProps) {
  const { restaurant } = await params;

  let data;

  try {
    data = await getRestaurantMenu(restaurant);
  } catch {
    notFound();
  }

  return (
    <>
      <RestaurantNav
        restaurantSlug={restaurant}
        theme={data.restaurant.menu_theme}
      />

      <MenuPageClient
        restaurant={data.restaurant}
        categories={data.categories}
      />
    </>
  );
}