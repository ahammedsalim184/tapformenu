
import type { Restaurant } from "@/types/menu";

interface RestaurantSpecialityProps {
  restaurant: Restaurant;
}

function SparkleIcon() {
  return (
    <span className="relative flex h-[22px] w-[22px] shrink-0 items-center justify-center">
      {/* Golden main star */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="sparkle-main text-[#D4AF37]"
      >
        <path
          d="M12 2L13.8 9.2L21 11L13.8 12.8L12 20L10.2 12.8L3 11L10.2 9.2L12 2Z"
          fill="currentColor"
        />

        <path
          d="M19 16L19.8 19.2L23 20L19.8 20.8L19 24L18.2 20.8L15 20L18.2 19.2L19 16Z"
          fill="currentColor"
        />
      </svg>

      {/* Golden tiny sparkle */}
      <span
        className="
          pointer-events-none
          absolute
          -right-1
          -top-1
          h-1.5
          w-1.5
          rounded-full
          bg-[#D4AF37]
          shadow-[0_0_6px_rgba(212,175,55,0.7)]
          sparkle-small
        "
      />
    </span>
  );
}

export default function RestaurantSpeciality({
  restaurant,
}: RestaurantSpecialityProps) {
  const hasSpeciality =
    restaurant.speciality_title ||
    restaurant.speciality_description;

  if (!hasSpeciality) {
    return null;
  }

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div
          className="
            relative
            overflow-hidden
            rounded-[24px]
            border
            border-gray-200/80
            bg-[#f6f6f3]
            px-6
            py-8
            shadow-sm
            sm:rounded-[28px]
            sm:px-10
            sm:py-10
            lg:px-14
            lg:py-12
          "
        >
          {/* Soft background decoration */}
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-48
              w-48
              rounded-full
              bg-white/70
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              -left-20
              h-56
              w-56
              rounded-full
              bg-white/60
              blur-3xl
            "
          />

          <div className="relative">

            {/* Label */}
            <div className="flex items-center gap-2 text-gray-500">
              <SparkleIcon />

              <span
                className="
                  relative
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  sm:text-xs
                "
              >
                Our Speciality

                {/* Small sparkle beside text */}
                <span
                  className="
                    pointer-events-none
                    absolute
                    -right-3
                    -top-1
                    h-1
                    w-1
                    rounded-full
                    bg-[#D4AF37]
                    shadow-[0_0_5px_rgba(212,175,55,0.7)]
                    sparkle-text
                  "
                />
              </span>
            </div>

            {/* Title */}
            {restaurant.speciality_title && (
              <h2
                className="
                  mt-5
                  max-w-3xl
                  text-2xl
                  font-bold
                  tracking-tight
                  text-gray-950
                  sm:text-3xl
                  lg:text-4xl
                "
              >
                {restaurant.speciality_title}
              </h2>
            )}

            {/* Description */}
            {restaurant.speciality_description && (
              <p
                className="
                  mt-5
                  max-w-3xl
                  whitespace-pre-line
                  text-sm
                  leading-7
                  text-gray-600
                  sm:text-base
                  sm:leading-8
                "
              >
                {restaurant.speciality_description}
              </p>
            )}

            {/* Bottom accent */}
            <div className="mt-7 h-px w-16 bg-gray-300" />
          </div>
        </div>
      </div>
    </section>
  );
}

