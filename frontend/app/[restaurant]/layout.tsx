import RestaurantHeader from "@/components/restaurant/RestaurantHeader";
import RestaurantNav from "@/components/restaurant/RestaurantNav";
import { getRestaurantMenu } from "@/lib/api";

interface RestaurantLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    restaurant: string;
  }>;
}

export default async function RestaurantLayout({
  children,
  params,
}: RestaurantLayoutProps) {
  const { restaurant } = await params;

  const data = await getRestaurantMenu(restaurant);

  return (
    <>
      <RestaurantHeader restaurant={data.restaurant} />

      <RestaurantNav restaurantSlug={restaurant} />

      {children}
    </>
  );
}