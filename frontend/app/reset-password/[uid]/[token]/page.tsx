"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();

  const uid = params.uid as string;
  const token = params.token as string;

  const [username, setUsername] = useState("");
  const [checkingLink, setCheckingLink] = useState(true);
  const [linkValid, setLinkValid] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const [fieldErrors, setFieldErrors] = useState<{
    new_password?: string;
    confirm_password?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function verifyResetLink() {
      setCheckingLink(true);
      setError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/accounts/password-reset-confirm/?uid=${encodeURIComponent(
            uid
          )}&token=${encodeURIComponent(token)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setLinkValid(false);
          setError(
            data.detail ||
              "This password reset link is invalid or expired."
          );
          return;
        }

        setUsername(data.username || "");
        setLinkValid(true);
      } catch {
        setLinkValid(false);
        setError(
          "Unable to verify this password reset link. Please try again."
        );
      } finally {
        setCheckingLink(false);
      }
    }

    if (uid && token) {
      verifyResetLink();
    } else {
      setCheckingLink(false);
      setLinkValid(false);
      setError("This password reset link is invalid.");
    }
  }, [uid, token]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setFieldErrors({});

    if (!newPassword) {
      setFieldErrors({
        new_password: "Enter a new password.",
      });
      return;
    }

    if (!confirmPassword) {
      setFieldErrors({
        confirm_password:
          "Please confirm your new password.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFieldErrors({
        confirm_password: "Passwords do not match.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/accounts/password-reset-confirm/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid,
            token,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.new_password || data.confirm_password) {
          setFieldErrors({
            new_password: Array.isArray(
              data.new_password
            )
              ? data.new_password[0]
              : data.new_password,
            confirm_password: Array.isArray(
              data.confirm_password
            )
              ? data.confirm_password[0]
              : data.confirm_password,
          });
        }

        setError(
          data.detail ||
            "Unable to reset your password. Please try again."
        );

        return;
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setError(
        "Something went wrong. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (checkingLink) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 text-center shadow-2xl">
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="animate-spin"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  className="opacity-20"
                />
                <path d="M21 12a9 9 0 0 1-9 9" />
              </svg>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Verifying reset link
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/50">
              Please wait while we verify your password reset
              link.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!linkValid) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 text-center shadow-2xl">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="text-red-400"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M15 9l-6 6" />
                <path d="M9 9l6 6" />
              </svg>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Reset link expired
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/50">
              {error ||
                "This password reset link is invalid or has expired."}
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/forgot-password")
              }
              className="mt-7 w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Request a new link
            </button>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="mt-5 w-full text-center text-sm text-white/40 transition hover:text-white/70"
            >
              Back to login
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 text-center shadow-2xl">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-emerald-400"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Password changed
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/50">
              Your password has been reset successfully.
              You will be redirected to the login page.
            </p>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="mt-7 w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Continue to login
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-5 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
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
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">
            Reset your password
          </h1>

          <p className="mt-3 text-sm text-white/50">
            Choose a new password for your TapForMenu account.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
          <div className="mb-6 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <p className="text-xs text-white/40">
              Account
            </p>

            <p className="mt-1 text-sm font-medium text-white">
              {username}
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-medium text-white/80"
              >
                New password
              </label>

              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                autoComplete="new-password"
                placeholder="Enter your new password"
                className={`w-full rounded-xl border bg-black/30 px-4 py-3 text-base text-white outline-none transition placeholder:text-white/25 ${
                  fieldErrors.new_password
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/10 focus:border-white/30"
                }`}
              />

              {fieldErrors.new_password && (
                <p className="mt-2 text-xs text-red-400">
                  {fieldErrors.new_password}
                </p>
              )}
            </div>

            <div className="mt-5">
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium text-white/80"
              >
                Confirm password
              </label>

              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                autoComplete="new-password"
                placeholder="Enter your new password again"
                className={`w-full rounded-xl border bg-black/30 px-4 py-3 text-base text-white outline-none transition placeholder:text-white/25 ${
                  fieldErrors.confirm_password
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/10 focus:border-white/30"
                }`}
              />

              {fieldErrors.confirm_password && (
                <p className="mt-2 text-xs text-red-400">
                  {fieldErrors.confirm_password}
                </p>
              )}
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Resetting password..."
                : "Reset password"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-5 w-full text-center text-sm text-white/40 transition hover:text-white/70"
          >
            Back to login
          </button>
        </div>
      </div>
    </main>
  );
}