"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api";

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

interface CurrentUser {
  id: number;
  username: string;
  email: string;
  restaurants: Restaurant[];
}

export default function RestaurantDashboardPage() {
  const params = useParams();
  const router = useRouter();

  const restaurantSlug = params.restaurant as string;

  const [restaurant, setRestaurant] =
    useState<Restaurant | null>(null);

  const [user, setUser] =
    useState<CurrentUser | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);

  const accountRef = useRef<HTMLDivElement>(null);

  // ==========================================
  // LOAD RESTAURANT + USER
  // ==========================================

  async function loadRestaurant() {
    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [restaurantResponse, currentUser] =
        await Promise.all([
          fetch(
            `${API_BASE_URL}/restaurants/${restaurantSlug}/`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              cache: "no-store",
            }
          ),
          getCurrentUser(),
        ]);

      const contentType =
        restaurantResponse.headers.get("content-type") || "";

      let data: any = {};

      if (
        contentType.includes("application/json")
      ) {
        data = await restaurantResponse.json();
      } else {
        throw new Error(
          `Server returned an unexpected response (${restaurantResponse.status}).`
        );
      }

      if (restaurantResponse.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");

        router.replace("/login");
        return;
      }

      if (!restaurantResponse.ok) {
        throw new Error(
          data?.detail ||
            "Unable to load restaurant."
        );
      }

      setUser(currentUser);
      setRestaurant(data as Restaurant);
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

  useEffect(() => {
    loadRestaurant();
  }, [restaurantSlug]);

  // ==========================================
  // ACCOUNT DROPDOWN
  // ==========================================

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

  // ==========================================
  // ACCOUNT ACTIONS
  // ==========================================

  function handleAccountSettings() {
    setAccountOpen(false);

    router.push(
      "/dashboard/account/settings"
    );
  }

  function handleAddStaff() {
    setAccountOpen(false);

    router.push(
      "/dashboard/account/settings/staff"
    );
  }

  function handleLogout() {
    setAccountOpen(false);

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");

    router.replace("/login");
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f7f5]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <header className="flex items-center justify-end py-5 sm:py-7">
            <div className="h-10 w-28 animate-pulse rounded-xl bg-white" />
          </header>

          <div className="py-20 text-center">
            <div
              className="
                mx-auto
                h-8
                w-8
                animate-spin
                rounded-full
                border-2
                border-gray-200
                border-t-gray-950
              "
            />

            <p className="mt-4 text-sm text-gray-500">
              Loading restaurant...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR / NO RESTAURANT
  // ==========================================

  if (!restaurant) {
    return (
      <main className="min-h-screen bg-[#f7f7f5]">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div
            className="
              rounded-[24px]
              border
              border-red-200
              bg-white
              p-6
            "
          >
            <h1 className="text-xl font-semibold text-gray-950">
              Unable to load restaurant
            </h1>

            <p className="mt-2 text-sm leading-6 text-red-600">
              {error ||
                "Restaurant information could not be loaded."}
            </p>

            {user?.restaurants?.some(
              (item) => item.role === "OWNER"
            ) && (
              <button
                type="button"
                onClick={() =>
                  router.replace("/dashboard")
                }
                className="
                  mt-6
                  rounded-xl
                  bg-gray-950
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-gray-800
                "
              >
                Back to Dashboard
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  const isStaff = restaurant.role === "STAFF";
  const isOwner = restaurant.role === "OWNER";

  return (
    <main className="min-h-screen bg-[#f7f7f5] pb-28 sm:pb-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* ==========================================
            TOP BAR
        ========================================== */}

        <header className="flex items-center justify-between py-5 sm:py-7">

          {/* OWNER: BACK TO DASHBOARD */}

          {isOwner ? (
            <button
              type="button"
              onClick={() =>
                router.push("/dashboard")
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                px-2
                py-2
                text-sm
                font-medium
                text-gray-500
                transition
                hover:bg-white
                hover:text-gray-950
              "
            >
              <span className="text-lg leading-none">
                ←
              </span>

              <span className="hidden sm:inline">
                Dashboard
              </span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">

            {/* ROLE */}

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
                {restaurant.role}
              </span>
            </div>

            {/* ACCOUNT */}

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
                  {user?.username
                    ?.charAt(0)
                    .toUpperCase() || "A"}
                </div>

                <span className="hidden max-w-[100px] truncate text-xs font-semibold text-gray-700 sm:block">
                  {user?.username || "Account"}
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
                      {user?.username || "Account"}
                    </p>

                    {user?.email && (
                      <p className="mt-0.5 truncate text-[11px] text-gray-400">
                        {user.email}
                      </p>
                    )}
                  </div>

                  <div className="my-1 h-px bg-black/[0.05]" />

                  {/* ACCOUNT SETTINGS */}

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

                  {/* ADD STAFF - OWNER ONLY */}

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

                  {/* LOGOUT */}

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
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
                    "
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ==========================================
            HERO
        ========================================== */}

        <section className="pt-6 sm:pt-10">
          <div
            className="
              relative
              overflow-hidden
              rounded-[28px]
              bg-[#181512]
              px-6
              py-8
              text-white
              shadow-[0_18px_50px_rgba(24,21,18,0.12)]
              sm:px-8
              sm:py-10
            "
          >
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-56
                w-56
                rounded-full
                border
                border-white/10
              "
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -bottom-24
                -left-20
                h-48
                w-48
                rounded-full
                bg-white/[0.03]
              "
            />

            <div className="relative">
              <p
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-white/45
                "
              >
                Restaurant dashboard
              </p>

              <h1
                className="
                  mt-3
                  text-3xl
                  font-bold
                  tracking-[-0.045em]
                  sm:text-4xl
                "
              >
                {restaurant.name}
              </h1>

              {restaurant.description && (
                <p
                  className="
                    mt-3
                    max-w-2xl
                    text-sm
                    leading-6
                    text-white/55
                    sm:text-[15px]
                  "
                >
                  {restaurant.description}
                </p>
              )}
            </div>
          </div>
        </section>

                {/* ==========================================
                    RESTAURANT ACTIONS
                ========================================== */}

                <section className="mt-8">
                  <div className="mb-4 px-1">
                    <p
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.16em]
                        text-[#aaa39b]
                      "
                    >
                      Manage
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">

                    {/* ======================================
                        MENU
                    ====================================== */}

                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/dashboard/restaurants/${restaurant.slug}/menu`
                        )
                      }
                      className="
                        group
                        relative
                        overflow-hidden
                        rounded-[22px]
                        border
                        border-black/[0.06]
                        bg-[#eeeeeb]
                        p-4
                        text-left
                        transition-all
                        duration-200
                        hover:-translate-y-0.5
                        hover:bg-[#e9e9e6]
                        hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]
                        active:scale-[0.98]
                        sm:p-5
                      "
                    >

                      <div className="mt-4">
                        <h3
                          className="
                            text-[15px]
                            font-bold
                            tracking-[-0.025em]
                            text-[#181512]
                            sm:text-base
                          "
                        >
                          Menu
                        </h3>

                        <p
                          className="
                            mt-1.5
                            text-[11px]
                            leading-4
                            text-[#88827b]
                            sm:text-xs
                          "
                        >
                          Items, categories & variants
                        </p>
                      </div>
                    </button>

                    {/* ======================================
                        SETTINGS
                    ====================================== */}

                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/dashboard/restaurants/${restaurant.slug}/settings`
                        )
                      }
                      className="
                        group
                        relative
                        overflow-hidden
                        rounded-[22px]
                        border
                        border-black/[0.06]
                        bg-[#eeeeeb]
                        p-4
                        text-left
                        transition-all
                        duration-200
                        hover:-translate-y-0.5
                        hover:bg-[#e9e9e6]
                        hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]
                        active:scale-[0.98]
                        sm:p-5
                      "
                    >


                      <div className="mt-4">
                        <h3
                          className="
                            text-[15px]
                            font-bold
                            tracking-[-0.025em]
                            text-[#181512]
                            sm:text-base
                          "
                        >
                          Settings
                        </h3>

                        <p
                          className="
                            mt-1.5
                            text-[11px]
                            leading-4
                            text-[#88827b]
                            sm:text-xs
                          "
                        >
                          Restaurant information & layout
                        </p>
                      </div>
                    </button>

                  </div>
                </section>
        
      </div>
    </main>
  );
}