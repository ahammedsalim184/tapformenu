import { notFound } from "next/navigation";

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
    <MenuPageClient
      restaurant={data.restaurant}
      categories={data.categories}
    />
  );
}