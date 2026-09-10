
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

interface RestaurantNavProps {
  restaurantSlug: string;
}

const MOBILE_HANDLE = 48;
const DESKTOP_HANDLE = 52;
const PADDING = 4;

export default function RestaurantNav({
  restaurantSlug,
}: RestaurantNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isMenuPage = pathname.includes("/menu");

  const trackRef = useRef<HTMLDivElement>(null);

  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startPositionRef = useRef(0);

  const [position, setPosition] = useState(0);
  const [maxPosition, setMaxPosition] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [navigating, setNavigating] = useState(false);

  /*
   * Get the actual slider dimensions.
   */
  const updateDimensions = useCallback(() => {
    const track = trackRef.current;

    if (!track) return;

    const handleSize =
      window.innerWidth >= 640
        ? DESKTOP_HANDLE
        : MOBILE_HANDLE;

    const max =
      track.clientWidth -
      handleSize -
      PADDING * 2;

    setMaxPosition(Math.max(0, max));
  }, []);

  /*
   * Measure when component loads
   * and whenever screen size changes.
   */
  useEffect(() => {
    updateDimensions();

    window.addEventListener(
      "resize",
      updateDimensions
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateDimensions
      );
    };
  }, [updateDimensions]);

  /*
   * Reset slider whenever we navigate.
   */
  useEffect(() => {
    setPosition(0);
    setDragging(false);
    setNavigating(false);
    draggingRef.current = false;

    requestAnimationFrame(() => {
      updateDimensions();
    });
  }, [pathname, updateDimensions]);

  /*
   * Start dragging.
   */
  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (navigating) return;
    if (maxPosition <= 0) return;

    draggingRef.current = true;

    startXRef.current = event.clientX;
    startPositionRef.current = position;

    setDragging(true);

    event.currentTarget.setPointerCapture(
      event.pointerId
    );
  };

  /*
   * Move with the finger/mouse.
   */
  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!draggingRef.current) return;

    const rawDelta =
      event.clientX -
      startXRef.current;

    /*
     * Home:
     *   drag left → right
     *
     * Menu:
     *   drag right → left
     */
    const delta = isMenuPage
      ? -rawDelta
      : rawDelta;

    let nextPosition =
      startPositionRef.current +
      delta;

    /*
     * Resistance outside boundaries.
     */
    if (nextPosition < 0) {
      nextPosition =
        nextPosition * 0.2;
    }

    if (nextPosition > maxPosition) {
      const excess =
        nextPosition -
        maxPosition;

      nextPosition =
        maxPosition +
        excess * 0.2;
    }

    /*
     * Prevent excessive movement.
     */
    nextPosition = Math.max(
      -35,
      Math.min(
        maxPosition + 35,
        nextPosition
      )
    );

    setPosition(nextPosition);
  };

  /*
   * Finish dragging.
   */
  const finishDrag = () => {
    if (!draggingRef.current) return;

    draggingRef.current = false;
    setDragging(false);

    /*
     * Keep calculation inside
     * the actual track.
     */
    const safePosition = Math.max(
      0,
      Math.min(
        maxPosition,
        position
      )
    );

    const completion =
      maxPosition > 0
        ? safePosition / maxPosition
        : 0;

    /*
     * 75% = successful slide.
     */
    if (completion >= 0.75) {
      setPosition(maxPosition);
      setNavigating(true);

      window.setTimeout(() => {
        if (isMenuPage) {
          router.push(
            `/${restaurantSlug}/`
          );
        } else {
          router.push(
            `/${restaurantSlug}/menu/`
          );
        }
      }, 180);

      return;
    }

    /*
     * Not enough → return to start.
     */
    setPosition(0);
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    try {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    } catch {
      // Pointer capture may already be released.
    }

    finishDrag();
  };

  const handlePointerCancel = () => {
    draggingRef.current = false;
    setDragging(false);
    setPosition(0);
  };

  /*
   * Percentage used for visual effects.
   */
  const progress =
    maxPosition > 0
      ? Math.max(
          0,
          Math.min(
            1,
            position / maxPosition
          )
        )
      : 0;

  /*
   * Visual position:
   *
   * Home:
   *   handle starts LEFT
   *   handle moves RIGHT
   *
   * Menu:
   *   handle starts RIGHT
   *   handle moves LEFT
   */
  const visualPosition = isMenuPage
    ? maxPosition - position
    : position;

  return (
    <nav className="w-full bg-white">
      {/* Same alignment as Hero and other sections */}
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-center py-3 sm:py-4">

          {/* Slider */}
          <div
            ref={trackRef}
            className="
              relative
              h-14
              w-full
              max-w-[360px]
              overflow-hidden
              rounded-full
              border
              border-gray-200
              bg-gray-100
              shadow-sm
              sm:h-16
              sm:max-w-md
            "
            style={{
              touchAction: "none",
            }}
          >
            {/* Inner surface */}
            <div
              className="
                pointer-events-none
                absolute
                inset-1
                rounded-full
                bg-white/50
              "
            />

            {/* Progress area */}
            <div
              className="
                pointer-events-none
                absolute
                top-1
                bottom-1
                rounded-full
                bg-white
                shadow-sm
              "
              style={{
                width:
                  maxPosition > 0
                    ? `${progress * 100}%`
                    : "0%",
                left: isMenuPage
                  ? "auto"
                  : "4px",
                right: isMenuPage
                  ? "4px"
                  : "auto",
                opacity:
                  progress > 0
                    ? 1
                    : 0,
              }}
            />

            {/* Center instruction */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                flex
                items-center
                justify-center
              "
            >
              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-gray-400
                  sm:text-[11px]
                "
                style={{
                  opacity:
                    progress >= 0.7
                      ? 0
                      : 1 -
                        progress * 0.9,
                }}
              >
                {isMenuPage
                  ? "Slide to Home"
                  : "Slide to Menu"}
              </span>
            </div>

            {/* Direction arrows */}
            <div
              className={`
                pointer-events-none
                absolute
                inset-y-0
                flex
                items-center
                ${
                  isMenuPage
                    ? "left-5"
                    : "right-5"
                }
              `}
              style={{
                opacity:
                  0.7 *
                  (1 - progress),
              }}
            >
              {isMenuPage ? (
                <div className="flex items-center">
                  <span className="-mr-1 text-lg text-gray-300">
                    ‹
                  </span>

                  <span className="-mr-1 text-xl text-gray-400">
                    ‹
                  </span>

                  <span className="text-2xl text-gray-500">
                    ‹
                  </span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="text-2xl text-gray-500">
                    ›
                  </span>

                  <span className="-ml-1 text-xl text-gray-400">
                    ›
                  </span>

                  <span className="-ml-1 text-lg text-gray-300">
                    ›
                  </span>
                </div>
              )}
            </div>

            {/* Release text */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                flex
                items-center
                justify-center
              "
              style={{
                opacity:
                  progress >= 0.7
                    ? Math.min(
                        1,
                        (progress - 0.7) /
                          0.2
                      )
                    : 0,
              }}
            >
              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-gray-500
                  sm:text-[11px]
                "
              >
                Release
              </span>
            </div>

            {/* Slider handle */}
            <div
              className="
                absolute
                top-1
                z-10
                flex
                h-12
                w-12
                touch-none
                select-none
                items-center
                justify-center
                rounded-full
                bg-white
                text-gray-950
                shadow-md
                sm:top-1.5
                sm:h-[52px]
                sm:w-[52px]
              "
              style={{
                left: `${PADDING}px`,

                transform: `translateX(${visualPosition}px)`,

                transition: dragging
                  ? "none"
                  : "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)",

                scale: dragging
                  ? "1.06"
                  : "1",

                cursor: dragging
                  ? "grabbing"
                  : "grab",
              }}
              onPointerDown={
                handlePointerDown
              }
              onPointerMove={
                handlePointerMove
              }
              onPointerUp={
                handlePointerUp
              }
              onPointerCancel={
                handlePointerCancel
              }
            >
              {isMenuPage ? (
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
