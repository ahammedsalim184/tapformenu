import type { Restaurant } from "@/types/menu";

interface MenuHeaderProps {
  restaurant: Restaurant;
}

export default function MenuHeader({
  restaurant,
}: MenuHeaderProps) {
  return (
    <section className="border-b border-gray-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Menu
        </h1>

        {restaurant.description && (
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            {restaurant.description}
          </p>
        )}
      </div>
    </section>
  );
}