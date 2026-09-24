"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

type MenuLayout = "classic" | "cards";
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

const MENU_LAYOUTS: {
  id: MenuLayout;
  name: string;
  description: string;
}[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Simple and easy to read",
  },
  {
    id: "cards",
    name: "Cards",
    description: "Modern item cards",
  },
];

const MENU_THEMES: {
  id: MenuTheme;
  name: string;
  description: string;
}[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Clean and bright",
  },
  {
    id: "dark",
    name: "Dark",
    description: "Modern and premium",
  },
];

function MiniPhone({
  children,
  dark = false,
}: {
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto w-[108px]">
      <div
        className={`relative rounded-[22px] border-[3px] border-neutral-900 bg-neutral-950 p-[3px] shadow-[0_8px_20px_rgba(0,0,0,0.15)] ${
          dark ? "shadow-black/30" : ""
        }`}
      >
        <div className="relative h-[172px] overflow-hidden rounded-[17px]">
          <div className="absolute left-1/2 top-1.5 z-20 h-[9px] w-[38px] -translate-x-1/2 rounded-full bg-neutral-900" />
          {children}
        </div>
      </div>
    </div>
  );
}

function ClassicLayoutPreview() {
  return (
    <MiniPhone>
      <div className="h-full bg-white px-2.5 pb-2 pt-5">
        <div className="mb-2">
          <div className="h-1.5 w-12 rounded-full bg-neutral-900" />
          <div className="mt-1 h-1 w-7 rounded-full bg-neutral-200" />
        </div>

        <div className="mb-2 flex gap-1 overflow-hidden">
          <div className="rounded-full bg-neutral-900 px-2 py-1">
            <div className="h-1 w-5 rounded-full bg-white" />
          </div>

          <div className="rounded-full bg-neutral-100 px-2 py-1">
            <div className="h-1 w-5 rounded-full bg-neutral-400" />
          </div>

          <div className="rounded-full bg-neutral-100 px-2 py-1">
            <div className="h-1 w-5 rounded-full bg-neutral-400" />
          </div>
        </div>

        <div className="space-y-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex items-center gap-1.5 border-b border-neutral-100 pb-1.5"
            >
              <div className="h-7 w-7 shrink-0 rounded-md bg-neutral-200" />

              <div className="min-w-0 flex-1">
                <div className="h-1.5 w-12 rounded-full bg-neutral-800" />
                <div className="mt-1 h-1 w-8 rounded-full bg-neutral-300" />
              </div>

              <div className="h-1.5 w-5 rounded-full bg-neutral-800" />
            </div>
          ))}
        </div>
      </div>
    </MiniPhone>
  );
}

function CardsLayoutPreview() {
  return (
    <MiniPhone>
      <div className="h-full bg-neutral-50 px-2.5 pb-2 pt-5">
        <div className="mb-2">
          <div className="h-1.5 w-12 rounded-full bg-neutral-900" />
          <div className="mt-1 h-1 w-8 rounded-full bg-neutral-300" />
        </div>

        <div className="mb-2 flex gap-1 overflow-hidden">
          <div className="rounded-full bg-neutral-900 px-2 py-1">
            <div className="h-1 w-5 rounded-full bg-white" />
          </div>

          <div className="rounded-full bg-white px-2 py-1">
            <div className="h-1 w-5 rounded-full bg-neutral-300" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="h-14 bg-gradient-to-br from-neutral-300 via-neutral-200 to-neutral-100" />

            <div className="p-1.5">
              <div className="h-1.5 w-14 rounded-full bg-neutral-800" />
              <div className="mt-1 h-1 w-8 rounded-full bg-neutral-300" />
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="h-12 bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-100" />

            <div className="p-1.5">
              <div className="h-1.5 w-11 rounded-full bg-neutral-800" />
              <div className="mt-1 h-1 w-7 rounded-full bg-neutral-300" />
            </div>
          </div>
        </div>
      </div>
    </MiniPhone>
  );
}

function MenuLayoutPreview({
  layout,
}: {
  layout: MenuLayout;
}) {
  if (layout === "cards") {
    return <CardsLayoutPreview />;
  }

  return <ClassicLayoutPreview />;
}

function ClassicThemePreview() {
  return (
    <MiniPhone>
      <div className="h-full bg-white px-2.5 pb-2 pt-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="h-1.5 w-12 rounded-full bg-neutral-900" />
            <div className="mt-1 h-1 w-7 rounded-full bg-neutral-200" />
          </div>

          <div className="h-5 w-5 rounded-full bg-neutral-100" />
        </div>

        <div className="mb-3 h-8 rounded-lg bg-neutral-100 px-2 py-2">
          <div className="h-1 w-10 rounded-full bg-neutral-300" />
          <div className="mt-1.5 h-1.5 w-14 rounded-full bg-neutral-800" />
        </div>

        <div className="space-y-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-100 p-1.5"
            >
              <div className="h-8 w-8 rounded-md bg-neutral-200" />

              <div className="flex-1">
                <div className="h-1.5 w-10 rounded-full bg-neutral-800" />
                <div className="mt-1 h-1 w-7 rounded-full bg-neutral-300" />
              </div>

              <div className="h-1.5 w-5 rounded-full bg-neutral-700" />
            </div>
          ))}
        </div>
      </div>
    </MiniPhone>
  );
}

function DarkThemePreview() {
  return (
    <MiniPhone dark>
      <div className="h-full bg-neutral-950 px-2.5 pb-2 pt-5 text-white">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="h-1.5 w-12 rounded-full bg-white" />
            <div className="mt-1 h-1 w-7 rounded-full bg-white/30" />
          </div>

          <div className="h-5 w-5 rounded-full bg-white/10" />
        </div>

        <div className="mb-3 h-8 rounded-lg bg-white/10 px-2 py-2">
          <div className="h-1 w-9 rounded-full bg-white/30" />
          <div className="mt-1.5 h-1.5 w-13 rounded-full bg-white" />
        </div>

        <div className="space-y-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-1.5"
            >
              <div className="h-8 w-8 rounded-md bg-white/10" />

              <div className="flex-1">
                <div className="h-1.5 w-10 rounded-full bg-white/80" />
                <div className="mt-1 h-1 w-7 rounded-full bg-white/20" />
              </div>

              <div className="h-1.5 w-5 rounded-full bg-white/60" />
            </div>
          ))}
        </div>
      </div>
    </MiniPhone>
  );
}

function MenuThemePreview({
  theme,
}: {
  theme: MenuTheme;
}) {
  return theme === "dark" ? (
    <DarkThemePreview />
  ) : (
    <ClassicThemePreview />
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-3.5 w-3.5"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path
        d="M5 10.5 8.2 14 15 6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M19 12H5M12 19l-7-7 7-7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M5 4h11l3 3v13H5V4Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M8 4v5h8V4M8 20v-7h8v7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <h2 className="text-[15px] font-semibold text-neutral-950">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs leading-5 text-neutral-500">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-neutral-600">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white"
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-neutral-600">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white"
      />
    </label>
  );
}

export default function RestaurantSettingsPage() {
  const params = useParams();
  const router = useRouter();

  const restaurantSlug = Array.isArray(params.restaurant)
    ? params.restaurant[0]
    : params.restaurant;

  const [restaurant, setRestaurant] =
    useState<Restaurant | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [openingHours, setOpeningHours] = useState("");

  const [menuLayout, setMenuLayout] =
    useState<MenuLayout>("classic");

  const [menuTheme, setMenuTheme] =
    useState<MenuTheme>("classic");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
  };

  const loadRestaurant = async () => {
    if (!restaurantSlug) {
      return;
    }

    try {
      setError("");

      const token =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/restaurants/${restaurantSlug}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        clearTokens();
        router.replace("/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Unable to load restaurant settings."
        );
      }

      setRestaurant(data);

      setName(data.name || "");
      setDescription(data.description || "");
      setPhone(data.phone || "");
      setEmail(data.email || "");
      setAddress(data.address || "");
      setOpeningHours(data.opening_hours || "");

      setMenuLayout(
        data.menu_layout === "cards"
          ? "cards"
          : "classic"
      );

      setMenuTheme(
        data.menu_theme === "dark"
          ? "dark"
          : "classic"
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load restaurant settings."
      );
    }
  };

  useEffect(() => {
    if (!restaurantSlug) {
      return;
    }

    const initialLoad = async () => {
      try {
        setLoading(true);
        await loadRestaurant();
      } finally {
        setLoading(false);
      }
    };

    initialLoad();
  }, [restaurantSlug]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Restaurant name is required.");
      setSuccess("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

      if (!token) {
        router.replace("/login");
        return;
      }

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

      if (response.status === 401) {
        clearTokens();
        router.replace("/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Unable to save restaurant settings."
        );
      }

      setRestaurant(data);
      setSuccess("Settings saved successfully.");

      await loadRestaurant();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save restaurant settings."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!restaurant) {
      return;
    }

    setName(restaurant.name || "");
    setDescription(restaurant.description || "");
    setPhone(restaurant.phone || "");
    setEmail(restaurant.email || "");
    setAddress(restaurant.address || "");
    setOpeningHours(restaurant.opening_hours || "");

    setMenuLayout(
      restaurant.menu_layout === "cards"
        ? "cards"
        : "classic"
    );

    setMenuTheme(
      restaurant.menu_theme === "dark"
        ? "dark"
        : "classic"
    );

    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-3xl px-4 py-5">
          <div className="mb-6 h-8 w-32 animate-pulse rounded-lg bg-neutral-200" />

          <div className="space-y-4">
            <div className="h-48 animate-pulse rounded-2xl bg-white" />
            <div className="h-48 animate-pulse rounded-2xl bg-white" />
            <div className="h-48 animate-pulse rounded-2xl bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-base font-semibold text-neutral-950">
            Restaurant not found
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            We could not load this restaurant.
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-5 h-10 rounded-xl bg-neutral-950 px-5 text-sm font-medium text-white"
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 pb-28">
      <div className="mx-auto w-full max-w-3xl">

        <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-neutral-50/95 backdrop-blur">
          <div className="flex h-14 items-center gap-3 px-4">

            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-800 transition active:scale-95"
            >
              <ArrowLeftIcon />
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-950">
                Settings
              </p>

              <p className="truncate text-[11px] text-neutral-500">
                {restaurant.name}
              </p>
            </div>

            <div className="rounded-full bg-neutral-900 px-2.5 py-1 text-[10px] font-semibold text-white">
              {restaurant.role}
            </div>

          </div>
        </header>

        <div className="space-y-4 px-4 py-5">

          <div>
            <h1 className="text-xl font-semibold tracking-tight text-neutral-950">
              Restaurant settings
            </h1>

            <p className="mt-1 text-sm text-neutral-500">
              Manage your restaurant information and menu appearance.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <SettingsSection
            title="Menu layout"
            description="Choose how your menu items are presented."
          >
            <div className="grid grid-cols-2 gap-2.5">

              {MENU_LAYOUTS.map((layout) => {
                const selected =
                  menuLayout === layout.id;

                return (
                  <button
                    key={layout.id}
                    type="button"
                    onClick={() =>
                      setMenuLayout(layout.id)
                    }
                    className={`relative min-w-0 rounded-2xl border p-2.5 text-left transition ${
                      selected
                        ? "border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950"
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    }`}
                  >
                    {selected && (
                      <div className="absolute right-2 top-2 z-30 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-950 text-white shadow-sm">
                        <CheckIcon />
                      </div>
                    )}

                    <MenuLayoutPreview
                      layout={layout.id}
                    />

                    <div className="mt-2.5 px-0.5">

                      <h3 className="truncate text-xs font-semibold text-neutral-950">
                        {layout.name}
                      </h3>

                      <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-neutral-500">
                        {layout.description}
                      </p>

                    </div>
                  </button>
                );
              })}

            </div>
          </SettingsSection>

          <SettingsSection
            title="Menu theme"
            description="Choose the visual style of your public menu."
          >
            <div className="grid grid-cols-2 gap-2.5">

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
                    className={`relative min-w-0 rounded-2xl border p-2.5 text-left transition ${
                      selected
                        ? "border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950"
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    }`}
                  >
                    {selected && (
                      <div className="absolute right-2 top-2 z-30 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-950 text-white shadow-sm">
                        <CheckIcon />
                      </div>
                    )}

                    <MenuThemePreview
                      theme={theme.id}
                    />

                    <div className="mt-2.5 px-0.5">

                      <h3 className="text-xs font-semibold text-neutral-950">
                        {theme.name}
                      </h3>

                      <p className="mt-0.5 text-[10px] leading-4 text-neutral-500">
                        {theme.description}
                      </p>

                    </div>
                  </button>
                );
              })}

            </div>
          </SettingsSection>

          <SettingsSection title="Restaurant">
            <div className="space-y-4">

              <InputField
                label="Restaurant name"
                value={name}
                onChange={setName}
                placeholder="Restaurant name"
              />

              <TextareaField
                label="Description"
                value={description}
                onChange={setDescription}
                placeholder="Tell customers about your restaurant"
              />

            </div>
          </SettingsSection>

          <SettingsSection title="Contact">
            <div className="grid gap-4 sm:grid-cols-2">

              <InputField
                label="Phone"
                value={phone}
                onChange={setPhone}
                placeholder="+91..."
                type="tel"
              />

              <InputField
                label="Email"
                value={email}
                onChange={setEmail}
                placeholder="restaurant@example.com"
                type="email"
              />

            </div>
          </SettingsSection>

          <SettingsSection title="Location">
            <InputField
              label="Address"
              value={address}
              onChange={setAddress}
              placeholder="Restaurant address"
            />
          </SettingsSection>

          <SettingsSection title="Opening hours">
            <TextareaField
              label="Hours"
              value={openingHours}
              onChange={setOpeningHours}
              placeholder={`Mon - Sun
10:00 AM - 11:00 PM`}
            />
          </SettingsSection>

        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl gap-2">

          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="h-11 flex-1 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-700 transition active:scale-[0.98] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex h-11 flex-[1.4] items-center justify-center gap-2 rounded-xl bg-neutral-950 text-sm font-medium text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SaveIcon />

            {saving ? "Saving..." : "Save changes"}
          </button>

        </div>
      </div>
    </main>
  );
}