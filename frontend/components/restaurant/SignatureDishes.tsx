import type { SignatureDish } from "@/types/menu";
import { getMediaUrl } from "@/lib/api";

interface SignatureDishesProps {
  dishes: SignatureDish[];
}

export default function SignatureDishes({
  dishes,
}: SignatureDishesProps) {
  if (!dishes.length) {
    return null;
  }

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Section heading */}
        <div className="mb-6 sm:mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400 sm:text-xs">
            Crowd Favourites
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            Signature Dishes
          </h2>
        </div>

        {/* Swipeable Dishes */}
        <div
          className="
            flex
            gap-5
            overflow-x-auto
            snap-x
            snap-mandatory
            pb-3
            -mx-5
            px-5
            sm:-mx-6
            sm:px-6
            lg:-mx-8
            lg:px-8
            [scrollbar-width:none]
            [-ms-overflow-style:none]
          "
        >
          {dishes.map((dish) => {
            const imageUrl = getMediaUrl(dish.image);

            return (
              <article
                key={dish.id}
                className="
                  group
                  relative
                  w-[82vw]
                  max-w-[340px]
                  shrink-0
                  snap-start
                  overflow-visible
                  rounded-[24px]
                  bg-white
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-lg
                  sm:w-[calc((100%_-_20px)/2)]
                  lg:w-[calc((100%_-_40px)/3)]
                "
              >
                {/* Glowing gold border */}
                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    rounded-[24px]
                    border
                    border-[#F4C542]/70
                    shadow-[0_0_6px_rgba(244,197,66,0.35)]
                    transition-all
                    duration-500
                    group-hover:border-[#F4C542]
                    group-hover:shadow-[0_0_8px_rgba(244,197,66,0.55),0_0_20px_rgba(244,197,66,0.20)]
                  "
                />

                {/* Card content */}
                <div className="relative overflow-hidden rounded-[24px] bg-white">
                  {/* Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={dish.name}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-sm text-gray-400">
                          No image
                        </span>
                      </div>
                    )}

                    {/* Image overlay */}
                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/20
                        via-transparent
                        to-transparent
                        opacity-70
                      "
                    />
                  </div>

                  {/* Content */}
                  <div className="px-5 py-5">
                    <h3 className="text-lg font-semibold tracking-tight text-gray-950">
                      {dish.name}
                    </h3>

                    {dish.description && (
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {dish.description}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Swipe hint */}
        {dishes.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2 text-gray-300">
            <span className="h-px w-6 bg-gray-200" />

            <span className="text-[9px] font-medium uppercase tracking-[0.18em]">
              Swipe
            </span>

            <span className="h-px w-6 bg-gray-200" />
          </div>
        )}
      </div>
    </section>
  );
}