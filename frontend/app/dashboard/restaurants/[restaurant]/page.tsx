"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE_URL = "http://192.168.1.41:8000";

interface Restaurant {
  id: number;
  name: string;
  slug: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  opening_hours: string;
  active: boolean;
  menu_layout: "classic" | "cards" | "showcase";
  role: "OWNER" | "STAFF";
}

export default function RestaurantDashboardPage() {
  const params = useParams();
  const router = useRouter();

  const restaurantSlug = params.restaurant as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRestaurant() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/restaurants/${restaurantSlug}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          router.replace("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.detail || "Unable to load restaurant."
          );
        }

        setRestaurant(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load restaurant."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRestaurant();
  }, [restaurantSlug, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-gray-500">Loading restaurant...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-white p-6">
            <h1 className="text-xl font-semibold text-gray-900">
              Unable to load restaurant
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              onClick={() => router.push("/dashboard")}
              className="mt-6 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!restaurant) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="mb-4 text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← Back to Dashboard
          </button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {restaurant.name}
              </h1>

              <p className="mt-2 text-gray-500">
                Manage your restaurant
              </p>
            </div>

            <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
              {restaurant.role}
            </span>
          </div>
        </div>

        {/* Restaurant Information */}
        <div className="grid gap-6 md:grid-cols-2">

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Restaurant Information
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Name
                </p>
                <p className="mt-1 text-sm text-gray-900">
                  {restaurant.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Slug
                </p>
                <p className="mt-1 text-sm text-gray-900">
                  {restaurant.slug}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Description
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {restaurant.description || "No description added."}
                </p>
              </div>
            </div>
          </section>

          {/* Restaurant Settings */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Restaurant Settings
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Menu Layout
                </p>

                <p className="mt-1 text-sm capitalize text-gray-900">
                  {restaurant.menu_layout}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Status
                </p>

                <p className="mt-1 text-sm text-gray-900">
                  {restaurant.active ? "Active" : "Inactive"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Your Role
                </p>

                <p className="mt-1 text-sm text-gray-900">
                  {restaurant.role}
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Management Sections */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <button
            onClick={() =>
              router.push(
                `/dashboard/restaurants/${restaurant.slug}/menu`
              )
            }
            className="rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              Menu
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Manage categories, items, prices and variants.
            </p>

            <p className="mt-5 text-sm font-semibold text-gray-900">
              Manage menu →
            </p>
          </button>

          <button
            onClick={() =>
              router.push(
                `/dashboard/restaurants/${restaurant.slug}/settings`
              )
            }
            className="rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              Settings
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Manage restaurant information and configuration.
            </p>

            <p className="mt-5 text-sm font-semibold text-gray-900">
              Open settings →
            </p>
          </button>

        </div>

      </div>
    </main>
  );
}