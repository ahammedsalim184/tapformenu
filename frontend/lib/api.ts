
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

  if (image.startsWith("/media/")) {
    return image;
  }

  if (image.startsWith("/")) {
    return image;
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    try {
      const url = new URL(image);

      if (url.pathname.startsWith("/media/")) {
        return `${url.pathname}${url.search}`;
      }

      return image;
    } catch {
      return image;
    }
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

  const response = await fetch(
    endpoint,
    {
      cache: "no-store",
    }
  );

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
