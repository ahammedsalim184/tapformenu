import type { Restaurant } from "@/types/menu";

interface MenuHeaderProps {
  restaurant: Restaurant;
}

export default function MenuHeader({
  restaurant,
}: MenuHeaderProps) {
  return (
    <section className="bg-white px-5 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-12 lg:px-8 lg:pb-12 lg:pt-14">
      <div className="mx-auto max-w-4xl text-center">

        {/* Small label */}
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-gray-200 sm:w-14" />

          <div
            aria-hidden="true"
            className="flex items-center gap-2"
          >
            <span className="h-1 w-1 rounded-full bg-gray-300" />

            <span
              className="
                h-1.5
                w-1.5
                rotate-45
                bg-black
              "
            />

            <span className="h-1 w-1 rounded-full bg-gray-300" />
          </div>

          <span className="h-px w-10 bg-gray-200 sm:w-14" />
        </div>

        {/* Main heading */}
        <h1
          className="
            mt-4
            text-4xl
            font-semibold
            tracking-[-0.04em]
            text-gray-950
            sm:mt-5
            sm:text-5xl
            lg:text-6xl
          "
        >
          Menu
        </h1>

        {/* Description */}
        {restaurant.description && (
          <p
            className="
              mx-auto
              mt-4
              max-w-xl
              text-sm
              leading-6
              text-gray-500
              sm:mt-5
              sm:text-[15px]
              sm:leading-7
            "
          >
            {restaurant.description}
          </p>
        )}

        {/* Bottom accent */}
        <div className="mx-auto mt-6 flex items-center justify-center sm:mt-7">
          <span className="h-1 w-1 rounded-full bg-gray-300" />
          <span className="mx-2 h-px w-10 bg-gray-200" />
          <span className="h-1.5 w-1.5 rounded-full bg-black" />
          <span className="mx-2 h-px w-10 bg-gray-200" />
          <span className="h-1 w-1 rounded-full bg-gray-300" />
        </div>
      </div>
    </section>
  );
}