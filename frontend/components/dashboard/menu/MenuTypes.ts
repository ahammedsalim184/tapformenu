export interface MenuVariant {
  id: number;
  name: string;
  image: string | null;
  price_range: boolean;
  price: string | null;
  price_min: string | null;
  price_max: string | null;
  available: boolean;
  display_order: number;
}

export interface MenuItem {
  id: number;
  category: number;
  name: string;
  description: string;
  image: string | null;
  price_range: boolean;
  price: string | null;
  price_min: string | null;
  price_max: string | null;
  vegetarian: boolean;
  available: boolean;
  display_order: number;
  variants: MenuVariant[];
}

export interface MenuCategory {
  id: number;
  name: string;
  description: string;
  display_order: number;
  active: boolean;
  items: MenuItem[];
}

export interface Restaurant {
  id: number;
  name: string;
  slug: string;
  role: string;
  menu_layout: string;
}

export interface MenuResponse {
  restaurant: Restaurant;
  categories: MenuCategory[];
}