"use client";

import type { ReviewSection } from "@/types/menu";

interface RestaurantReviewsProps {
  review: ReviewSection | null;
}

export default function RestaurantReviews({
  review,
}: RestaurantReviewsProps) {
  if (!review) {
    return null;
  }

  const videos = [
    review.video_1,
    review.video_2,
    review.video_3,
    review.video_4,
  ].filter((video): video is string => Boolean(video));

  if (!review.description && videos.length === 0) {
    return null;
  }

  const hearts = [
    { left: "5%", size: 14, delay: "0s" },
    { left: "15%", size: 18, delay: "1s" },
    { left: "27%", size: 13, delay: "2s" },
    { left: "39%", size: 20, delay: "0.5s" },
    { left: "51%", size: 15, delay: "1.5s" },
    { left: "63%", size: 21, delay: "2.5s" },
    { left: "75%", size: 14, delay: "0.8s" },
    { left: "87%", size: 19, delay: "1.8s" },
  ];

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <div className="relative inline-flex flex-col">
            <div className="pointer-events-none absolute -inset-x-8 -top-10 h-12 overflow-visible">
              {hearts.map((heart, index) => (
                <span
                  key={index}
                  className="absolute select-none text-red-500 opacity-0 animate-pulse"
                  style={{
                    left: heart.left,
                    bottom: 0,
                    fontSize: `${heart.size}px`,
                    animationDelay: heart.delay,
                  }}
                >
                  ♥
                </span>
              ))}
            </div>

            <p className="relative z-10 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400 sm:text-xs">
              What Guests Say
            </p>

            <h2 className="relative z-10 mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Reviews
            </h2>

            {review.description && (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                {review.description}
              </p>
            )}
          </div>
        </div>

        {videos.length > 0 && (
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
            {videos.map((video) => (
              <article
                key={video}
                className="
                  group
                  relative
                  w-[78vw]
                  max-w-[330px]
                  shrink-0
                  snap-start
                  overflow-hidden
                  rounded-[24px]
                  bg-black
                  shadow-sm
                  sm:w-[calc((100%_-_20px)/2)]
                  lg:w-[calc((100%_-_40px)/3)]
                "
              >
                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-10
                    rounded-[24px]
                    border
                    border-[#F4C542]/60
                    shadow-[0_0_6px_rgba(244,197,66,0.30)]
                    transition-all
                    duration-500
                    group-hover:border-[#F4C542]
                    group-hover:shadow-[0_0_8px_rgba(244,197,66,0.50),0_0_18px_rgba(244,197,66,0.15)]
                  "
                />

                <video
                  src={video}
                  className="aspect-[9/16] h-auto w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              </article>
            ))}
          </div>
        )}

        {videos.length > 1 && (
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

