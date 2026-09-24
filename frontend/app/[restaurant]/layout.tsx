import RestaurantNav from "@/components/restaurant/RestaurantNav";

interface RestaurantLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    restaurant: string;
  }>;
}

export default async function RestaurantLayout({
  children,
}: RestaurantLayoutProps) {
  return <>{children}</>;
}