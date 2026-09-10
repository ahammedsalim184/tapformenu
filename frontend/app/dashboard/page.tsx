"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

interface Restaurant {
  id: number;
  name: string;
  slug: string;
  role: string;
}

interface CurrentUser {
  id: number;
  username: string;
  email: string;
  restaurants: Restaurant[];
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Loading dashboard...
        </p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user.username}
          </h1>

          <p className="mt-2 text-gray-500">
            Select a restaurant to manage.
          </p>
        </div>

        {user.restaurants.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No restaurants
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Your account is not currently associated with
              any restaurants.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {user.restaurants.map((restaurant) => (
              <button
                key={restaurant.id}
                onClick={() =>
                  router.push(
                    `/dashboard/restaurants/${restaurant.slug}`
                  )
                }
                className="rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  {restaurant.name}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {restaurant.role}
                </p>

                <div className="mt-6 text-sm font-semibold text-gray-900">
                  Manage restaurant →
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}