import RestaurantHeader from "@/components/restaurant/RestaurantHeader";
import RestaurantNav from "@/components/restaurant/RestaurantNav";
import RestaurantHero from "@/components/restaurant/RestaurantHero";
import SignatureDishes from "@/components/restaurant/SignatureDishes";
import RestaurantSpeciality from "@/components/restaurant/RestaurantSpeciality";
import RestaurantInfo from "@/components/restaurant/RestaurantInfo";
import RestaurantReviews from "@/components/restaurant/RestaurantReviews";
import SocialMedia from "@/components/restaurant/SocialMedia";

import { getRestaurantMenu } from "@/lib/api";

interface RestaurantPageProps {
  params: Promise<{
    restaurant: string;
  }>;
}

export default async function RestaurantPage({
  params,
}: RestaurantPageProps) {
  const { restaurant } = await params;

  const data = await getRestaurantMenu(restaurant);

  return (
    <>
      <RestaurantHeader restaurant={data.restaurant} />

      <RestaurantNav restaurantSlug={restaurant} />

      <main className="min-h-screen bg-white">
        <RestaurantHero restaurant={data.restaurant} />

        <RestaurantSpeciality restaurant={data.restaurant} />

        <SignatureDishes dishes={data.signature_dishes} />

        <RestaurantReviews
          review={data.review_section}
        />

        <SocialMedia restaurant={data.restaurant} />

        <RestaurantInfo restaurant={data.restaurant} />
      </main>
    </>
  );
}