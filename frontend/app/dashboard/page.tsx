"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getCurrentUser,
  logout,
} from "@/lib/auth";

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
  const [loggingOut, setLoggingOut] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();

        const staffRestaurant =
          currentUser.restaurants?.find(
            (restaurant: Restaurant) =>
              restaurant.role === "STAFF"
          );

        if (staffRestaurant) {
          router.replace(
            `/dashboard/restaurants/${staffRestaurant.slug}`
          );
          return;
        }

        setUser(currentUser);
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        accountRef.current &&
        !accountRef.current.contains(
          event.target as Node
        )
      ) {
        setAccountOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAccountOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

function handleLogout() {
  setLoggingOut(true);

  logout();

  router.replace("/login");
}

  function handleAccountSettings() {
    setAccountOpen(false);
    router.push("/dashboard/account/settings");
  }

  function handleAddStaff() {
    setAccountOpen(false);
    router.push("/dashboard/account/settings/staff");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f5f2]">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-black/10 border-t-[#181512]" />
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const restaurantCount = user.restaurants.length;

  const isOwner = user.restaurants.some(
    (restaurant) => restaurant.role === "OWNER"
  );

  const accountRole = isOwner
    ? "OWNER"
    : user.restaurants[0]?.role || "ACCOUNT";

  return (
    <main className="min-h-screen bg-[#f6f5f2] text-[#181512]">
      <div className="mx-auto min-h-screen w-full max-w-2xl px-4 pb-10 pt-5 sm:px-6 sm:pt-7">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/30">
              TapForMenu
            </p>

            <h1 className="mt-1 text-[21px] font-bold tracking-[-0.04em] sm:text-2xl">
              Hello, {user.username}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                items-center
                rounded-xl
                bg-white
                px-3
                shadow-sm
                ring-1
                ring-black/[0.04]
              "
            >
              <span
                className="
                  mr-2
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-emerald-500
                "
              />

              <span className="text-xs font-semibold text-gray-700">
                {accountRole}
              </span>
            </div>

            <div
              ref={accountRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setAccountOpen((open) => !open)
                }
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                className="
                  flex
                  h-10
                  items-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-3
                  shadow-sm
                  ring-1
                  ring-black/[0.04]
                  transition
                  hover:bg-gray-50
                  active:scale-[0.98]
                "
              >
                <div
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-lg
                    bg-[#181512]
                    text-[11px]
                    font-bold
                    text-white
                  "
                >
                  {user.username
                    ?.charAt(0)
                    .toUpperCase() || "A"}
                </div>

                <span className="hidden max-w-[100px] truncate text-xs font-semibold text-gray-700 sm:block">
                  {user.username || "Account"}
                </span>

                <span
                  className="
                    ml-0.5
                    text-[10px]
                    text-gray-400
                  "
                >
                  {accountOpen ? "▲" : "▼"}
                </span>
              </button>

              {accountOpen && (
                <div
                  role="menu"
                  className="
                    absolute
                    right-0
                    top-12
                    z-50
                    w-56
                    overflow-hidden
                    rounded-2xl
                    border
                    border-black/[0.06]
                    bg-white
                    p-1.5
                    shadow-[0_18px_50px_rgba(0,0,0,0.12)]
                  "
                >
                  <div className="px-3 py-2.5">
                    <p className="text-xs font-semibold text-gray-950">
                      {user.username || "Account"}
                    </p>

                    {user.email && (
                      <p className="mt-0.5 truncate text-[11px] text-gray-400">
                        {user.email}
                      </p>
                    )}
                  </div>

                  <div className="my-1 h-px bg-black/[0.05]" />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleAccountSettings}
                    className="
                      flex
                      w-full
                      items-center
                      rounded-xl
                      px-3
                      py-2.5
                      text-left
                      text-sm
                      font-medium
                      text-gray-700
                      transition
                      hover:bg-[#f7f7f5]
                      hover:text-gray-950
                    "
                  >

                    Account Settings
                  </button>

                  {isOwner && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleAddStaff}
                      className="
                        flex
                        w-full
                        items-center
                        rounded-xl
                        px-3
                        py-2.5
                        text-left
                        text-sm
                        font-medium
                        text-gray-700
                        transition
                        hover:bg-[#f7f7f5]
                        hover:text-gray-950
                      "
                    >

                      Add Staff
                    </button>
                  )}

                  <div className="my-1 h-px bg-black/[0.05]" />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="
                      flex
                      w-full
                      items-center
                      rounded-xl
                      px-3
                      py-2.5
                      text-left
                      text-sm
                      font-medium
                      text-red-600
                      transition
                      hover:bg-red-50
                      disabled:opacity-40
                    "
                  >

                    {loggingOut
                      ? "Logging out..."
                      : "Logout"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="mt-7">
          <div className="relative overflow-hidden rounded-[28px] bg-[#181512] px-5 py-6 text-white shadow-[0_18px_45px_rgba(24,21,18,0.14)] sm:px-6 sm:py-7">
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -right-16
                -top-20
                h-48
                w-48
                rounded-full
                border
                border-white/[0.07]
              "
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -bottom-20
                -left-16
                h-40
                w-40
                rounded-full
                bg-white/[0.025]
              "
            />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
                    Dashboard
                  </span>
                </div>

                <div className="rounded-full bg-white/[0.08] px-2.5 py-1">
                  <span className="text-[10px] font-semibold text-white/60">
                    {restaurantCount}{" "}
                    {restaurantCount === 1
                      ? "restaurant"
                      : "restaurants"}
                  </span>
                </div>
              </div>

              <h2 className="mt-5 text-[27px] font-bold leading-[1.05] tracking-[-0.05em] sm:text-3xl">
                Manage everything
                <br />
                in one place.
              </h2>

              <p className="mt-3 max-w-sm text-[13px] leading-5 text-white/45">
                Select a restaurant to manage your menu and
                restaurant settings.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between px-1">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/30">
                Your workspace
              </p>

              <h2 className="mt-1 text-[17px] font-bold tracking-[-0.03em]">
                Restaurants
              </h2>
            </div>

            {restaurantCount > 0 && (
              <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#e9e7e2] px-2 text-[11px] font-bold text-black/50">
                {restaurantCount}
              </span>
            )}
          </div>

          {restaurantCount === 0 ? (
            <div className="rounded-[24px] bg-white px-6 py-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.035)] ring-1 ring-black/[0.04]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#f3f1ed] text-xl text-black/30">
                +
              </div>

              <h2 className="mt-4 text-[15px] font-bold">
                No restaurants yet
              </h2>

              <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-black/40">
                Your account is not currently connected to
                any restaurants.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {user.restaurants.map((restaurant) => (
                <button
                  key={restaurant.id}
                  type="button"
                  onClick={() =>
                    router.push(
                      `/dashboard/restaurants/${restaurant.slug}`
                    )
                  }
                  className="
                    group
                    flex
                    min-h-[82px]
                    w-full
                    items-center
                    gap-3.5
                    rounded-[22px]
                    bg-white
                    px-4
                    text-left
                    shadow-[0_4px_20px_rgba(0,0,0,0.035)]
                    ring-1
                    ring-black/[0.045]
                    transition-all
                    duration-200
                    active:scale-[0.985]
                    sm:px-5
                  "
                >
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#181512] text-[17px] font-bold text-white shadow-sm">
                    {restaurant.name.charAt(0).toUpperCase()}

                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[14px] font-bold tracking-[-0.02em] text-[#181512]">
                      {restaurant.name}
                    </h3>

                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/35">
                        {restaurant.role}
                      </span>

                      <span className="h-0.5 w-0.5 rounded-full bg-black/20" />

                      <span className="text-[10px] font-medium text-emerald-600">
                        Active
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-10 text-center">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-black/20">
            TapForMenu
          </p>
        </footer>
      </div>
    </main>
  );
}