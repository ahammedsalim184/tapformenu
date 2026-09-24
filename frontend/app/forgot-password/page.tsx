"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/accounts/password-reset/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const text = await response.text();

      let data: {
        detail?: string;
        [key: string]: unknown;
      } = {};

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("The server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Something went wrong. Please try again."
        );
      }

      setMessage(
        data.detail ||
          "If an account exists with that email, a password reset link has been sent."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
            >
              <span>←</span>
              Back to login
            </Link>
          </div>

          <div className="mb-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect
                  x="3"
                  y="11"
                  width="18"
                  height="10"
                  rx="2"
                />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Forgot your password?
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/50">
              Enter the email address associated with your account and
              we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {message ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>

              <p className="text-sm leading-6 text-white/70">
                {message}
              </p>

              <button
                type="button"
                onClick={() => {
                  setMessage("");
                  setEmail("");
                }}
                className="mt-5 text-sm font-medium text-white transition hover:text-white/70"
              >
                Try another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-white/70"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 text-base text-white outline-none placeholder:text-white/25 transition focus:border-white/30 focus:bg-white/[0.07]"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3">
                  <p className="text-sm leading-5 text-red-300">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-white text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          )}

          {!message && (
            <p className="mt-8 text-center text-sm text-white/40">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-medium text-white/70 transition hover:text-white"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-white/25">
          TapForMenu
        </p>
      </div>
    </main>
  );
}