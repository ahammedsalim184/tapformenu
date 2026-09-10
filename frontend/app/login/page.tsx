"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.41:8000";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      console.log("Attempting login...");
      console.log(
        "Login URL:",
        `${API_BASE_URL}/api/accounts/login/`
      );

      const response = await fetch(
        `${API_BASE_URL}/api/accounts/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            password,
          }),
        }
      );

      console.log("Login response status:", response.status);

      const contentType =
        response.headers.get("content-type") || "";

      let data: any = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);

        throw new Error(
          `Server returned an unexpected response (${response.status}).`
        );
      }

      console.log("Login response:", data);

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

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      console.log("Login successful. Redirecting...");

      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      if (error instanceof TypeError) {
        setError(
          "Unable to connect to the server. Make sure Django is running and your phone is connected to the same Wi-Fi."
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
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            TapForMenu
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Restaurant management
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-gray-700"
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}