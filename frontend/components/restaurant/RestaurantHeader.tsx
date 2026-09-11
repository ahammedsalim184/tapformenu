import type { Restaurant } from "@/types/menu";
import { getMediaUrl } from "@/lib/api";

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

export default function RestaurantHeader({
  restaurant,
}: RestaurantHeaderProps) {
  const logoUrl = getMediaUrl(restaurant.logo);

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${restaurant.name} logo`}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-700">
              {restaurant.name.charAt(0)}
            </div>
          )}

          <div>
            <h1 className="text-[15px] font-medium tracking-wide text-gray-900">
              {restaurant.name}
            </h1>

            {restaurant.address && (
              <p className="text-sm text-gray-500">
                {restaurant.address}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}