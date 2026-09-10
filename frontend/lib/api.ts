import type { PublicMenuResponse } from "@/types/menu";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.41:8000";

export function getMediaUrl(
  image: string | null
): string | null {
  if (!image) {
    return null;
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${API_BASE_URL}${image}`;
  }

  return `${API_BASE_URL}/${image}`;
}

export async function getRestaurantMenu(
  restaurantSlug: string
): Promise<PublicMenuResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/menus/public/${restaurantSlug}/`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Restaurant not found.");
    }

    throw new Error("Failed to fetch restaurant menu.");
  }

  return response.json();
}