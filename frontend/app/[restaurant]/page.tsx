
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
    <main className="min-h-screen bg-white">

      {/* Restaurant Hero */}
      <RestaurantHero restaurant={data.restaurant} />

      {/* What makes the restaurant special */}
      <RestaurantSpeciality restaurant={data.restaurant} />

      {/* Signature Dishes */}
      <SignatureDishes dishes={data.signature_dishes} />
      

      {/* Guest Reviews */}
      <RestaurantReviews
        review={data.review_section}
      />

      <SocialMedia restaurant={data.restaurant} />

      {/* Location / Hours / Phone */}
      <RestaurantInfo restaurant={data.restaurant} />

      
    </main>
  );
}

