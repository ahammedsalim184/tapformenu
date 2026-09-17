import type { PublicMenuResponse } from "@/types/menu";

const PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api";

const INTERNAL_API_BASE_URL =
  process.env.INTERNAL_API_URL || "http://backend:8000";

function getApiBaseUrl() {
  if (typeof window === "undefined") {
    return INTERNAL_API_BASE_URL;
  }

  return PUBLIC_API_BASE_URL;
}

export function getMediaUrl(
  image: string | null
): string | null {
  if (!image) {
    return null;
  }

  /*
   * If the API already returned a complete URL,
   * preserve the media path but use the public API host
   * when running locally.
   */
  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    try {
      const url = new URL(image);

      if (url.pathname.startsWith("/media/")) {
        const publicBase = PUBLIC_API_BASE_URL;

        /*
         * Local development:
         * NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
         *
         * Production:
         * NEXT_PUBLIC_API_URL=/api
         */
        if (
          publicBase.startsWith("http://") ||
          publicBase.startsWith("https://")
        ) {
          return `${publicBase}${url.pathname}${url.search}`;
        }

        return `${url.pathname}${url.search}`;
      }

      return image;
    } catch {
      return image;
    }
  }

  /*
   * Relative media path such as:
   * /media/menus/...
   */
  if (image.startsWith("/media/")) {
    const publicBase = PUBLIC_API_BASE_URL;

    if (
      publicBase.startsWith("http://") ||
      publicBase.startsWith("https://")
    ) {
      return `${publicBase}${image}`;
    }

    return image;
  }

  /*
   * Other absolute paths.
   */
  if (image.startsWith("/")) {
    return image;
  }

  /*
   * Filename/path without /media/.
   */
  const publicBase = PUBLIC_API_BASE_URL;

  if (
    publicBase.startsWith("http://") ||
    publicBase.startsWith("https://")
  ) {
    return `${publicBase}/media/${image}`;
  }

  return `/media/${image}`;
}

export async function getRestaurantMenu(
  restaurantSlug: string
): Promise<PublicMenuResponse> {
  const API_BASE_URL = getApiBaseUrl();

  const endpoint =
    typeof window === "undefined"
      ? `${API_BASE_URL}/api/menus/public/${restaurantSlug}/`
      : `${API_BASE_URL}/menus/public/${restaurantSlug}/`;

  const response = await fetch(endpoint, {
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Restaurant not found.");
    }

    throw new Error(
      "Failed to fetch restaurant menu."
    );
  }

  return response.json();
}