"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api";

type MenuLayout = "classic" | "cards" | "showcase";
type MenuTheme = "classic" | "dark";

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
  menu_layout: MenuLayout;
  menu_theme: MenuTheme;
  role: "OWNER" | "STAFF";
}

const MENU_THEMES: {
  id: MenuTheme;
  name: string;
  description: string;
}[] = [
  {
    id: "classic",
    name: "Classic",
    description:
      "Clean, bright and timeless for an easy-to-read menu.",
  },
  {
    id: "dark",
    name: "Dark",
    description:
      "Modern, bold and premium with a dark presentation.",
  },
];

function ThemePreview({
  theme,
}: {
  theme: MenuTheme;
}) {
  if (theme === "dark") {
    return (
      <div className="overflow-hidden rounded-[20px] bg-[#0b0b0b] p-3 sm:p-4">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-5 bg-zinc-800" />
          <span className="h-1 w-1 rounded-full bg-zinc-700" />
          <span className="h-1.5 w-1.5 rotate-45 bg-white" />
          <span className="h-1 w-1 rounded-full bg-zinc-700" />
          <span className="h-px w-5 bg-zinc-800" />
        </div>

        <div className="mt-3 text-center">
          <div className="mx-auto h-1.5 w-20 rounded-full bg-zinc-500" />
          <div className="mx-auto mt-2 h-3 w-10 rounded-full bg-white/90" />
        </div>

        <div className="mt-4 flex gap-2 border-b border-zinc-800 pb-2">
          <div className="h-1.5 w-12 rounded-full bg-white" />
          <div className="h-1.5 w-10 rounded-full bg-zinc-700" />
          <div className="h-1.5 w-10 rounded-full bg-zinc-700" />
        </div>

        <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="h-2 w-20 rounded-full bg-white/90" />
              <div className="mt-2 h-1.5 w-28 rounded-full bg-zinc-700" />
              <div className="mt-1 h-1.5 w-20 rounded-full bg-zinc-800" />
            </div>

            <div className="h-2 w-10 rounded-full bg-white/80" />
          </div>
        </div>

        <div className="mt-2 rounded-xl border border-zinc-800 bg-zinc-900 p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="h-2 w-24 rounded-full bg-white/90" />
              <div className="mt-2 h-1.5 w-24 rounded-full bg-zinc-700" />
            </div>

            <div className="h-2 w-10 rounded-full bg-white/80" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] bg-[#f7f7f5] p-3 sm:p-4">
      <div className="flex items-center justify-center gap-2">
        <span className="h-px w-5 bg-gray-200" />
        <span className="h-1 w-1 rounded-full bg-gray-300" />
        <span className="h-1.5 w-1.5 rotate-45 bg-gray-900" />
        <span className="h-1 w-1 rounded-full bg-gray-300" />
        <span className="h-px w-5 bg-gray-200" />
      </div>

      <div className="mt-3 text-center">
        <div className="mx-auto h-1.5 w-20 rounded-full bg-gray-400" />
        <div className="mx-auto mt-2 h-3 w-10 rounded-full bg-gray-950" />
      </div>

      <div className="mt-4 flex gap-2 border-b border-gray-200 pb-2">
        <div className="h-1.5 w-12 rounded-full bg-gray-950" />
        <div className="h-1.5 w-10 rounded-full bg-gray-300" />
        <div className="h-1.5 w-10 rounded-full bg-gray-300" />
      </div>

      <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="h-2 w-20 rounded-full bg-gray-900" />
            <div className="mt-2 h-1.5 w-28 rounded-full bg-gray-300" />
            <div className="mt-1 h-1.5 w-20 rounded-full bg-gray-200" />
          </div>

          <div className="h-2 w-10 rounded-full bg-gray-900" />
        </div>
      </div>

      <div className="mt-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="h-2 w-24 rounded-full bg-gray-900" />
            <div className="mt-2 h-1.5 w-24 rounded-full bg-gray-300" />
          </div>

          <div className="h-2 w-10 rounded-full bg-gray-900" />
        </div>
      </div>
    </div>
  );
}

export default function RestaurantSettingsPage() {
  const params = useParams();
  const router = useRouter();

  const restaurantSlug = params.restaurant as string;

  const [restaurant, setRestaurant] =
    useState<Restaurant | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [openingHours, setOpeningHours] = useState("");

  const [menuLayout, setMenuLayout] =
    useState<MenuLayout>("cards");

  const [menuTheme, setMenuTheme] =
    useState<MenuTheme>("classic");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      const response = await fetch(
        `${API_BASE_URL}/restaurants/${restaurantSlug}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data: any = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error(
          `Server returned an unexpected response (${response.status}).`
        );
      }

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");

        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Unable to load restaurant settings."
        );
      }

      const restaurantData =
        data as Restaurant;

      setRestaurant(restaurantData);

      setName(restaurantData.name || "");
      setDescription(
        restaurantData.description || ""
      );
      setPhone(restaurantData.phone || "");
      setEmail(restaurantData.email || "");
      setAddress(restaurantData.address || "");
      setOpeningHours(
        restaurantData.opening_hours || ""
      );

      setMenuLayout(
        restaurantData.menu_layout || "cards"
      );

      setMenuTheme(
        restaurantData.menu_theme === "dark"
          ? "dark"
          : "classic"
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load restaurant settings."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRestaurant();
  }, [restaurantSlug]);

  async function handleSave(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (!name.trim()) {
      setError("Restaurant name is required.");
      setSuccess("");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/restaurants/${restaurantSlug}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
            phone: phone.trim(),
            email: email.trim(),
            address: address.trim(),
            opening_hours: openingHours.trim(),
            menu_layout: menuLayout,
            menu_theme: menuTheme,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data: any = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      }

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");

        router.replace("/login");
        return;
      }

      if (!response.ok) {
        if (
          data &&
          typeof data === "object" &&
          data.detail
        ) {
          throw new Error(data.detail);
        }

        if (
          data &&
          typeof data === "object" &&
          data.menu_layout
        ) {
          const layoutError =
            Array.isArray(data.menu_layout)
              ? data.menu_layout[0]
              : data.menu_layout;

          throw new Error(String(layoutError));
        }

        if (
          data &&
          typeof data === "object" &&
          data.menu_theme
        ) {
          const themeError =
            Array.isArray(data.menu_theme)
              ? data.menu_theme[0]
              : data.menu_theme;

          throw new Error(String(themeError));
        }

        throw new Error(
          "Unable to save restaurant settings."
        );
      }

      const updatedRestaurant =
        data as Restaurant;

      setRestaurant(updatedRestaurant);

      setName(updatedRestaurant.name || "");
      setDescription(
        updatedRestaurant.description || ""
      );
      setPhone(updatedRestaurant.phone || "");
      setEmail(updatedRestaurant.email || "");
      setAddress(updatedRestaurant.address || "");
      setOpeningHours(
        updatedRestaurant.opening_hours || ""
      );

      setMenuLayout(
        updatedRestaurant.menu_layout || "cards"
      );

      setMenuTheme(
        updatedRestaurant.menu_theme === "dark"
          ? "dark"
          : "classic"
      );

      setSuccess("Settings saved successfully.");

      await loadRestaurant();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save restaurant settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f7f5]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <header className="flex items-center py-5 sm:py-7">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/restaurants/${restaurantSlug}`
                )
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
                Restaurant
              </span>
            </button>
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
              Loading settings...
            </p>
          </div>
        </div>
      </main>
    );
  }

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
              Unable to load settings
            </h1>

            <p className="mt-2 text-sm leading-6 text-red-600">
              {error ||
                "Restaurant information could not be loaded."}
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/restaurants/${restaurantSlug}`
                )
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
              Back to Restaurant
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] pb-28 sm:pb-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between py-5 sm:py-7">
          <button
            type="button"
            onClick={() =>
              router.push(
                `/dashboard/restaurants/${restaurantSlug}`
              )
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
              Restaurant
            </span>
          </button>

          <div
            className="
              flex
              h-9
              items-center
              rounded-xl
              bg-white
              px-3
              shadow-sm
              ring-1
              ring-black/[0.04]
              sm:h-10
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

            <span className="text-[11px] font-semibold text-gray-700 sm:text-xs">
              {restaurant.role}
            </span>
          </div>
        </header>

        <section className="pt-4 sm:pt-10">
          <div
            className="
              relative
              overflow-hidden
              rounded-[26px]
              bg-[#181512]
              px-5
              py-7
              text-white
              shadow-[0_18px_50px_rgba(24,21,18,0.12)]
              sm:rounded-[28px]
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
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-white/45
                  sm:text-[11px]
                "
              >
                Restaurant configuration
              </p>

              <h1
                className="
                  mt-2
                  text-[30px]
                  font-bold
                  tracking-[-0.045em]
                  sm:mt-3
                  sm:text-4xl
                "
              >
                Settings
              </h1>

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-[13px]
                  leading-5
                  text-white/55
                  sm:text-[15px]
                  sm:leading-6
                "
              >
                Update your restaurant information and
                customize how your public menu looks.
              </p>
            </div>
          </div>
        </section>

        <form onSubmit={handleSave} className="mt-8 sm:mt-10">
          <section>
            <div className="mb-4">
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[#aaa39b]
                  sm:text-[11px]
                "
              >
                Public menu
              </p>

              <h2
                className="
                  mt-1
                  text-lg
                  font-semibold
                  tracking-[-0.025em]
                  text-[#181512]
                "
              >
                Menu layout
              </h2>

              <p className="mt-1 text-[13px] leading-5 text-[#88827b] sm:text-sm">
                Choose how your restaurant menu appears
                to customers.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
              {[
                {
                  id: "classic" as MenuLayout,
                  icon: "☰",
                  name: "Classic",
                  description:
                    "A simple traditional menu with clear categories and items.",
                },
                {
                  id: "cards" as MenuLayout,
                  icon: "▦",
                  name: "Cards",
                  description:
                    "Visual cards that give menu items a modern presentation.",
                },
                {
                  id: "showcase" as MenuLayout,
                  icon: "✦",
                  name: "Showcase",
                  description:
                    "A more visual layout designed to highlight menu items.",
                },
              ].map((layout) => {
                const selected =
                  menuLayout === layout.id;

                return (
                  <button
                    key={layout.id}
                    type="button"
                    onClick={() =>
                      setMenuLayout(layout.id)
                    }
                    disabled={saving}
                    className={`
                      relative
                      rounded-[22px]
                      border
                      p-4
                      text-left
                      transition-all
                      duration-200
                      sm:p-5
                      ${
                        selected
                          ? "border-gray-950 bg-gray-950 text-white shadow-[0_14px_40px_rgba(0,0,0,0.12)]"
                          : "border-black/[0.06] bg-white text-gray-950 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
                      }
                      disabled:cursor-not-allowed
                      disabled:opacity-70
                    `}
                  >
                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        text-base
                        ${
                          selected
                            ? "bg-white/10"
                            : "bg-[#f5f2ee]"
                        }
                      `}
                    >
                      {layout.icon}
                    </div>

                    <h3 className="mt-4 text-[15px] font-semibold">
                      {layout.name}
                    </h3>

                    <p
                      className={`
                        mt-1.5
                        text-[13px]
                        leading-5
                        ${
                          selected
                            ? "text-white/55"
                            : "text-[#88827b]"
                        }
                      `}
                    >
                      {layout.description}
                    </p>

                    {selected && (
                      <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-950">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-9 sm:mt-10">
            <div className="mb-4">
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[#aaa39b]
                  sm:text-[11px]
                "
              >
                Public menu
              </p>

              <h2
                className="
                  mt-1
                  text-lg
                  font-semibold
                  tracking-[-0.025em]
                  text-[#181512]
                "
              >
                Menu theme
              </h2>

              <p className="mt-1 text-[13px] leading-5 text-[#88827b] sm:text-sm">
                Choose the visual style customers will
                see when they open your menu.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {MENU_THEMES.map((theme) => {
                const selected =
                  menuTheme === theme.id;

                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() =>
                      setMenuTheme(theme.id)
                    }
                    disabled={saving}
                    className={`
                      group
                      relative
                      overflow-hidden
                      rounded-[24px]
                      border
                      bg-white
                      p-2.5
                      text-left
                      transition-all
                      duration-200
                      sm:p-3
                      ${
                        selected
                          ? "border-gray-950 shadow-[0_14px_40px_rgba(0,0,0,0.10)] ring-2 ring-gray-950/10"
                          : "border-black/[0.06] hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
                      }
                      disabled:cursor-not-allowed
                      disabled:opacity-70
                    `}
                  >
                    <ThemePreview theme={theme.id} />

                    <div className="px-2 pb-2 pt-3.5 sm:pt-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-[15px] font-semibold text-[#181512] sm:text-base">
                            {theme.name}
                          </h3>

                          <p className="mt-1 text-[12px] leading-5 text-[#88827b] sm:text-sm">
                            {theme.description}
                          </p>
                        </div>

                        {selected && (
                          <span
                            className="
                              flex
                              h-6
                              w-6
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-gray-950
                              text-xs
                              font-bold
                              text-white
                            "
                          >
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-9 sm:mt-10">
            <div className="mb-4">
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[#aaa39b]
                  sm:text-[11px]
                "
              >
                Restaurant
              </p>

              <h2
                className="
                  mt-1
                  text-lg
                  font-semibold
                  tracking-[-0.025em]
                  text-[#181512]
                "
              >
                Details
              </h2>
            </div>

            <div
              className="
                overflow-hidden
                rounded-[22px]
                border
                border-black/[0.05]
                bg-white
                sm:rounded-[24px]
              "
            >
              <div className="p-4 sm:p-6">
                <label
                  htmlFor="restaurant-name"
                  className="
                    block
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-[#aaa39b]
                    sm:text-[11px]
                  "
                >
                  Restaurant name
                </label>

                <input
                  id="restaurant-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  disabled={saving}
                  required
                  maxLength={200}
                  className="
                    mt-2
                    w-full
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-4
                    py-3.5
                    text-[15px]
                    font-medium
                    text-gray-950
                    outline-none
                    transition
                    focus:border-gray-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-gray-950/5
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                />
              </div>

              <div className="h-px bg-black/[0.05]" />

              <div className="p-4 sm:p-6">
                <label
                  htmlFor="restaurant-description"
                  className="
                    block
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-[#aaa39b]
                    sm:text-[11px]
                  "
                >
                  Description
                </label>

                <textarea
                  id="restaurant-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  disabled={saving}
                  rows={4}
                  className="
                    mt-2
                    w-full
                    resize-y
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-4
                    py-3.5
                    text-[15px]
                    leading-6
                    text-gray-950
                    outline-none
                    transition
                    focus:border-gray-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-gray-950/5
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                  placeholder="Tell customers a little about your restaurant..."
                />
              </div>
            </div>
          </section>

          <section className="mt-9 sm:mt-10">
            <div className="mb-4">
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[#aaa39b]
                  sm:text-[11px]
                "
              >
                Contact
              </p>

              <h2
                className="
                  mt-1
                  text-lg
                  font-semibold
                  tracking-[-0.025em]
                  text-[#181512]
                "
              >
                Contact information
              </h2>
            </div>

            <div
              className="
                overflow-hidden
                rounded-[22px]
                border
                border-black/[0.05]
                bg-white
                sm:rounded-[24px]
              "
            >
              <div className="grid sm:grid-cols-2">
                <div className="p-4 sm:p-6">
                  <label
                    htmlFor="restaurant-phone"
                    className="
                      block
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.14em]
                      text-[#aaa39b]
                      sm:text-[11px]
                    "
                  >
                    Phone
                  </label>

                  <input
                    id="restaurant-phone"
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    disabled={saving}
                    maxLength={30}
                    className="
                      mt-2
                      w-full
                      rounded-2xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      py-3.5
                      text-[15px]
                      text-gray-950
                      outline-none
                      transition
                      focus:border-gray-400
                      focus:bg-white
                      focus:ring-4
                      focus:ring-gray-950/5
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div
                  className="
                    border-t
                    border-black/[0.05]
                    p-4
                    sm:border-l
                    sm:border-t-0
                    sm:p-6
                  "
                >
                  <label
                    htmlFor="restaurant-email"
                    className="
                      block
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.14em]
                      text-[#aaa39b]
                      sm:text-[11px]
                    "
                  >
                    Email
                  </label>

                  <input
                    id="restaurant-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    disabled={saving}
                    className="
                      mt-2
                      w-full
                      rounded-2xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      py-3.5
                      text-[15px]
                      text-gray-950
                      outline-none
                      transition
                      focus:border-gray-400
                      focus:bg-white
                      focus:ring-4
                      focus:ring-gray-950/5
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                    placeholder="restaurant@example.com"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-9 sm:mt-10">
            <div className="mb-4">
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[#aaa39b]
                  sm:text-[11px]
                "
              >
                Restaurant information
              </p>

              <h2
                className="
                  mt-1
                  text-lg
                  font-semibold
                  tracking-[-0.025em]
                  text-[#181512]
                "
              >
                Location & hours
              </h2>
            </div>

            <div
              className="
                overflow-hidden
                rounded-[22px]
                border
                border-black/[0.05]
                bg-white
                sm:rounded-[24px]
              "
            >
              <div className="p-4 sm:p-6">
                <label
                  htmlFor="restaurant-address"
                  className="
                    block
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-[#aaa39b]
                    sm:text-[11px]
                  "
                >
                  Address
                </label>

                <textarea
                  id="restaurant-address"
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  disabled={saving}
                  rows={3}
                  className="
                    mt-2
                    w-full
                    resize-y
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-4
                    py-3.5
                    text-[15px]
                    leading-6
                    text-gray-950
                    outline-none
                    transition
                    focus:border-gray-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-gray-950/5
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                  placeholder="Restaurant address"
                />
              </div>

              <div className="h-px bg-black/[0.05]" />

              <div className="p-4 sm:p-6">
                <label
                  htmlFor="restaurant-opening-hours"
                  className="
                    block
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-[#aaa39b]
                    sm:text-[11px]
                  "
                >
                  Opening hours
                </label>

                <textarea
                  id="restaurant-opening-hours"
                  value={openingHours}
                  onChange={(event) =>
                    setOpeningHours(event.target.value)
                  }
                  disabled={saving}
                  rows={3}
                  className="
                    mt-2
                    w-full
                    resize-y
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-4
                    py-3.5
                    text-[15px]
                    leading-6
                    text-gray-950
                    outline-none
                    transition
                    focus:border-gray-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-gray-950/5
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                  placeholder={"Monday - Sunday\n11:00 AM - 11:00 PM"}
                />
              </div>
            </div>
          </section>

          <div className="mt-7 sm:mt-8">
            {error && (
              <div
                className="
                  rounded-2xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  leading-6
                  text-red-700
                "
              >
                {error}
              </div>
            )}

            {success && !error && (
              <div
                className="
                  rounded-2xl
                  border
                  border-emerald-200
                  bg-emerald-50
                  px-4
                  py-3
                  text-sm
                  leading-6
                  text-emerald-700
                "
              >
                {success}
              </div>
            )}
          </div>

          <div
            className="
              mt-5
              flex
              flex-col-reverse
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-end
            "
          >
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/restaurants/${restaurantSlug}`
                )
              }
              disabled={saving}
              className="
                w-full
                rounded-2xl
                border
                border-black/[0.08]
                bg-white
                px-5
                py-3.5
                text-sm
                font-semibold
                text-gray-700
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:w-auto
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="
                w-full
                rounded-2xl
                bg-gray-950
                px-6
                py-3.5
                text-sm
                font-semibold
                text-white
                shadow-[0_10px_30px_rgba(0,0,0,0.12)]
                transition
                hover:bg-gray-800
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-60
                sm:w-auto
              "
            >
              {saving
                ? "Saving..."
                : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}