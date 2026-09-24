"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api";

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

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const loginUrl =
        `${API_BASE_URL}/accounts/login/`;

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const contentType =
        response.headers.get("content-type") || "";

      let data: any = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        await response.text();

        throw new Error(
          `Server returned an unexpected response (${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.non_field_errors?.[0] ||
            "Invalid username or password."
        );
      }

      if (!data.access || !data.refresh) {
        throw new Error(
          "Login succeeded, but the server did not return JWT tokens."
        );
      }

      const storage = rememberMe
        ? localStorage
        : sessionStorage;

      storage.setItem(
        "access_token",
        data.access
      );

      storage.setItem(
        "refresh_token",
        data.refresh
      );

      const meResponse = await fetch(
        `${API_BASE_URL}/accounts/me/`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${data.access}`,
          },
          cache: "no-store",
        }
      );

      const meContentType =
        meResponse.headers.get("content-type") || "";

      let meData: CurrentUser | null = null;

      if (meContentType.includes("application/json")) {
        meData = await meResponse.json();
      } else {
        await meResponse.text();
      }

      if (!meResponse.ok || !meData) {
        throw new Error(
          "Login succeeded, but your account information could not be loaded."
        );
      }

      const restaurants = Array.isArray(
        meData.restaurants
      )
        ? meData.restaurants
        : [];

      const staffRestaurant = restaurants.find(
        (restaurant) =>
          restaurant.role === "STAFF"
      );

      if (staffRestaurant) {
        router.push(
          `/dashboard/restaurants/${staffRestaurant.slug}`
        );
        return;
      }

      const ownerRestaurant = restaurants.find(
        (restaurant) =>
          restaurant.role === "OWNER"
      );

      if (ownerRestaurant) {
        router.push("/dashboard");
        return;
      }

      throw new Error(
        "Your account does not have access to a restaurant."
      );
    } catch (error) {
      console.error("Login error:", error);

      if (error instanceof TypeError) {
        setError(
          "Unable to connect to the server. Make sure Django is running."
        );
      } else {
        setError(
          error instanceof Error
            ? error.message
            : "Login failed."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f4ef]">
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-32
          -top-32
          h-80
          w-80
          rounded-full
          bg-orange-200/40
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-40
          -right-32
          h-96
          w-96
          rounded-full
          bg-amber-100/60
          blur-3xl
        "
      />

      <div
        className="
          relative
          flex
          min-h-screen
          items-center
          justify-center
          px-5
          py-10
          sm:px-6
        "
      >
        <div className="w-full max-w-[440px]">
          <div className="mb-8 text-center">
            <div
              className="
                mx-auto
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-[20px]
                bg-[#181512]
                shadow-xl
                shadow-black/10
              "
            >
              <span
                className="
                  text-3xl
                  leading-none
                  drop-shadow-sm
                "
                aria-hidden="true"
              >
                🍽
              </span>
            </div>

            <h1
              className="
                text-[32px]
                font-bold
                tracking-[-0.045em]
                text-[#181512]
                sm:text-[36px]
              "
            >
              TapForMenu
            </h1>

            <p
              className="
                mt-2
                text-[15px]
                text-[#77716a]
              "
            >
              Your restaurant, beautifully managed.
            </p>
          </div>

          <div
            className="
              rounded-[28px]
              border
              border-black/[0.06]
              bg-white/90
              p-6
              shadow-[0_24px_70px_rgba(0,0,0,0.08)]
              backdrop-blur-xl
              sm:p-8
            "
          >
            <div className="mb-7">
              <h2
                className="
                  text-xl
                  font-semibold
                  tracking-[-0.025em]
                  text-[#181512]
                "
              >
                Welcome back
              </h2>

              <p
                className="
                  mt-1.5
                  text-sm
                  leading-6
                  text-[#88827b]
                "
              >
                Sign in to manage your restaurant menu.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="username"
                  className="
                    mb-2
                    block
                    text-[13px]
                    font-semibold
                    text-[#403c37]
                  "
                >
                  Username
                </label>

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                  required
                  autoComplete="username"
                  placeholder="Enter your username"
                  className="
                    h-12
                    w-full
                    rounded-[14px]
                    border
                    border-[#e5e1dc]
                    bg-[#faf9f7]
                    px-4
                    text-[15px]
                    text-[#181512]
                    outline-none
                    placeholder:text-[#aaa49d]
                    transition-all
                    duration-200
                    focus:border-[#181512]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-black/[0.04]
                  "
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="
                    mb-2
                    block
                    text-[13px]
                    font-semibold
                    text-[#403c37]
                  "
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="
                    h-12
                    w-full
                    rounded-[14px]
                    border
                    border-[#e5e1dc]
                    bg-[#faf9f7]
                    px-4
                    text-[15px]
                    text-[#181512]
                    outline-none
                    placeholder:text-[#aaa49d]
                    transition-all
                    duration-200
                    focus:border-[#181512]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-black/[0.04]
                  "
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <label
                  htmlFor="remember-me"
                  className="
                    flex
                    cursor-pointer
                    select-none
                    items-center
                    gap-2.5
                  "
                >
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(
                        event.target.checked
                      )
                    }
                    className="
                      h-4
                      w-4
                      cursor-pointer
                      rounded
                      border-[#d8d3cd]
                      accent-[#181512]
                    "
                  />

                  <span
                    className="
                      text-[13px]
                      font-medium
                      text-[#6f6962]
                    "
                  >
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/forgot-password")
                  }
                  className="
                    text-[13px]
                    font-semibold
                    text-[#181512]
                    underline
                    decoration-[#181512]/20
                    underline-offset-4
                    transition-colors
                    hover:text-[#77716a]
                    hover:decoration-[#77716a]/30
                  "
                >
                  Forgot password?
                </button>
              </div>

              {error && (
                <div
                  className="
                    rounded-[14px]
                    border
                    border-red-100
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    leading-5
                    text-red-600
                  "
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  relative
                  h-12
                  w-full
                  overflow-hidden
                  rounded-[14px]
                  bg-[#181512]
                  px-4
                  text-[15px]
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-black/10
                  transition-all
                  duration-200
                  hover:-translate-y-[1px]
                  hover:bg-[#292521]
                  hover:shadow-xl
                  hover:shadow-black/15
                  active:translate-y-0
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  disabled:hover:translate-y-0
                "
              >
                <span
                  className="
                    relative
                    z-10
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  {loading ? (
                    <>
                      <span
                        className="
                          h-4
                          w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-white/30
                          border-t-white
                        "
                      />

                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in

                      <span
                        className="
                          text-white/60
                          transition-transform
                          duration-200
                          group-hover:translate-x-0.5
                        "
                      >
                        →
                      </span>
                    </>
                  )}
                </span>
              </button>
            </form>

            <div
              className="
                mt-7
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  h-px
                  flex-1
                  bg-[#eeeae5]
                "
              />

              <span
                className="
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.16em]
                  text-[#aaa49d]
                "
              >
                Restaurant management
              </span>

              <span
                className="
                  h-px
                  flex-1
                  bg-[#eeeae5]
                "
              />

            </div>
          </div>

          <p
            className="
              mt-6
              text-center
              text-xs
              text-[#9a948d]
            "
          >
            Manage your menu. Keep it simple.
          </p>
        </div>
      </div>
    </main>
  );
}