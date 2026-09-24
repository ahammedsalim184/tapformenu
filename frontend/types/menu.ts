export type MenuTheme =
  | "classic"
  | "dark";

export interface MenuItemVariant {
  id: number;
  name: string;
  image: string | null;
  price_range: boolean;
  price: string | null;
  price_min: string | null;
  price_max: string | null;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  image: string | null;
  price_range: boolean;
  price: string | null;
  price_min: string | null;
  price_max: string | null;
  vegetarian: boolean;
  available: boolean;
  variants: MenuItemVariant[];
}

export interface MenuCategory {
  id: number;
  name: string;
  description: string;
  items: MenuItem[];
}

export interface Restaurant {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  cover_image: string | null;
  phone: string;
  email: string;
  address: string;
  google_maps_url: string;
  opening_hours: string;
  google_url: string;
  instagram_url: string;
  whatsapp_url: string;
  facebook_url: string;
  speciality_title: string;
  speciality_description: string;
  menu_layout: "classic" | "cards" | "showcase";
  menu_theme: MenuTheme;
}

export interface SignatureDish {
  id: number;
  name: string;
  description: string;
  image: string | null;
}

export interface ReviewSection {
  description: string;
  video_1: string | null;
  video_2: string | null;
  video_3: string | null;
  video_4: string | null;
}

export interface RestaurantGalleryImage {
  id: number;
  image: string;
}

export interface PublicMenuResponse {
  restaurant: Restaurant;
  signature_dishes: SignatureDish[];
  review_section: ReviewSection | null;
  gallery_images: RestaurantGalleryImage[];
  categories: MenuCategory[];
}