import type { Restaurant } from "@/types/menu";
import { getMediaUrl } from "@/lib/api";

interface RestaurantHeroProps {
  restaurant: Restaurant;
}

export default function RestaurantHero({
  restaurant,
}: RestaurantHeroProps) {
  const coverImage = getMediaUrl(restaurant.cover_image);

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        {/* Cover */}
        <div className="relative h-[46vh] min-h-[360px] max-h-[620px] overflow-hidden rounded-b-[28px] sm:rounded-b-[32px]">
          {coverImage ? (
            <img
              src={coverImage}
              alt={restaurant.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
          )}
        </div>
      </div>
    </section>
  );
}