"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getAccessToken,
  getCurrentUser,
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

interface AccountForm {
  username: string;
  email: string;
}

interface PasswordForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export default function AccountSettingsPage() {
  const router = useRouter();

  const [user, setUser] =
    useState<CurrentUser | null>(null);

  const [form, setForm] =
    useState<AccountForm>({
      username: "",
      email: "",
    });

  const [passwordForm, setPasswordForm] =
    useState<PasswordForm>({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [passwordModalOpen, setPasswordModalOpen] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  const [passwordSuccess, setPasswordSuccess] =
    useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser =
          await getCurrentUser();

        setUser(currentUser);

        setForm({
          username:
            currentUser.username || "",
          email:
            currentUser.email || "",
        });
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  function handleFormChange(
    field: keyof AccountForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  }

  function handlePasswordChange(
    field: keyof PasswordForm,
    value: string
  ) {
    setPasswordForm((current) => ({
      ...current,
      [field]: value,
    }));

    setPasswordError("");
    setPasswordSuccess("");
  }

  async function handleSaveProfile(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const token = getAccessToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "/api/accounts/me/",
        {
          method: "PATCH",
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            username:
              form.username.trim(),
            email:
              form.email.trim(),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        if (data.username) {
          setError(
            Array.isArray(
              data.username
            )
              ? data.username[0]
              : data.username
          );
        } else if (data.email) {
          setError(
            Array.isArray(
              data.email
            )
              ? data.email[0]
              : data.email
          );
        } else {
          setError(
            data.detail ||
              "Unable to update your account."
          );
        }

        return;
      }

      setUser((current) =>
        current
          ? {
              ...current,
              username:
                data.username,
              email:
                data.email,
            }
          : current
      );

      setForm({
        username:
          data.username,
        email:
          data.email,
      });

      setSuccess(
        "Account details updated successfully."
      );
    } catch (error) {
      console.error(
        "Account update error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const token = getAccessToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setChangingPassword(true);
    setPasswordError("");
    setPasswordSuccess("");

    try {
      const response = await fetch(
        "/api/accounts/change-password/",
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            passwordForm
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        if (
          data.current_password
        ) {
          setPasswordError(
            Array.isArray(
              data.current_password
            )
              ? data.current_password[0]
              : data.current_password
          );
        } else if (
          data.new_password
        ) {
          setPasswordError(
            Array.isArray(
              data.new_password
            )
              ? data.new_password[0]
              : data.new_password
          );
        } else if (
          data.confirm_password
        ) {
          setPasswordError(
            Array.isArray(
              data.confirm_password
            )
              ? data.confirm_password[0]
              : data.confirm_password
          );
        } else {
          setPasswordError(
            data.detail ||
              "Unable to change password."
          );
        }

        return;
      }

      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      setPasswordSuccess(
        "Password changed successfully."
      );
    } catch {
      setPasswordError(
        "Something went wrong. Please try again."
      );
    } finally {
      setChangingPassword(false);
    }
  }

  function closePasswordModal() {
    if (changingPassword) {
      return;
    }

    setPasswordModalOpen(false);

    setPasswordForm({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });

    setPasswordError("");
    setPasswordSuccess("");
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

  const isOwner =
    user.restaurants.some(
      (restaurant) =>
        restaurant.role === "OWNER"
    );

  const role = isOwner
    ? "OWNER"
    : user.restaurants[0]?.role ||
      "ACCOUNT";

  return (
    <main className="min-h-screen bg-[#f6f5f2] text-[#181512]">
      <div className="mx-auto min-h-screen w-full max-w-2xl px-4 pb-12 pt-5 sm:px-6 sm:pt-7">

        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white
              text-[17px]
              text-black/60
              shadow-[0_3px_14px_rgba(0,0,0,0.05)]
              ring-1
              ring-black/[0.04]
              transition-all
              active:scale-90
            "
          >
            ←
          </button>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/30">
              Account
            </p>

            <h1 className="mt-1 text-[21px] font-bold tracking-[-0.04em] sm:text-2xl">
              Account Settings
            </h1>
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

            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-white text-[20px] font-bold text-[#181512]">
                {user.username
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-[18px] font-bold tracking-[-0.03em]">
                  {user.username}
                </h2>

                <p className="mt-1 truncate text-[11px] text-white/40">
                  {user.email}
                </p>

                <div className="mt-2 inline-flex rounded-full bg-white/[0.08] px-2.5 py-1">
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/55">
                    {role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-7">
          <div className="mb-3 px-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/30">
              Profile
            </p>

            <h2 className="mt-1 text-[17px] font-bold tracking-[-0.03em]">
              Personal details
            </h2>
          </div>

          <form
            onSubmit={handleSaveProfile}
            className="
              rounded-[24px]
              bg-white
              p-5
              shadow-[0_4px_20px_rgba(0,0,0,0.035)]
              ring-1
              ring-black/[0.04]
              sm:p-6
            "
          >
            <div>
              <label
                htmlFor="username"
                className="text-[11px] font-bold text-black/55"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                value={form.username}
                onChange={(event) =>
                  handleFormChange(
                    "username",
                    event.target.value
                  )
                }
                autoComplete="username"
                spellCheck={false}
                className="
                  mt-2
                  h-12
                  w-full
                  rounded-[14px]
                  border-0
                  bg-[#f6f5f2]
                  px-4
                  text-[16px]
                  text-[#181512]
                  outline-none
                  ring-1
                  ring-black/[0.05]
                  transition
                  focus:bg-white
                  focus:ring-black/15
                "
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="email"
                className="text-[11px] font-bold text-black/55"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  handleFormChange(
                    "email",
                    event.target.value
                  )
                }
                autoComplete="email"
                className="
                  mt-2
                  h-12
                  w-full
                  rounded-[14px]
                  border-0
                  bg-[#f6f5f2]
                  px-4
                  text-[16px]
                  text-[#181512]
                  outline-none
                  ring-1
                  ring-black/[0.05]
                  transition
                  focus:bg-white
                  focus:ring-black/15
                "
              />
            </div>

            {error && (
              <div className="mt-4 rounded-[14px] bg-red-50 px-4 py-3">
                <p className="text-[11px] font-medium leading-5 text-red-600">
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="mt-4 rounded-[14px] bg-emerald-50 px-4 py-3">
                <p className="text-[11px] font-medium leading-5 text-emerald-700">
                  {success}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="
                mt-5
                flex
                h-12
                w-full
                items-center
                justify-center
                rounded-[14px]
                bg-[#181512]
                text-[12px]
                font-bold
                text-white
                shadow-[0_8px_20px_rgba(24,21,18,0.12)]
                transition-all
                active:scale-[0.985]
                disabled:opacity-40
              "
            >
              {saving
                ? "Saving..."
                : "Save changes"}
            </button>
          </form>
        </section>

        <section className="mt-7">
          <div className="mb-3 px-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/30">
              Security
            </p>

            <h2 className="mt-1 text-[17px] font-bold tracking-[-0.03em]">
              Password
            </h2>
          </div>

          <div
            className="
              rounded-[24px]
              bg-white
              p-5
              shadow-[0_4px_20px_rgba(0,0,0,0.035)]
              ring-1
              ring-black/[0.04]
              sm:p-6
            "
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[13px] font-bold">
                  Account password
                </p>

                <p className="mt-1 text-[11px] leading-5 text-black/35">
                  Change the password you
                  use to sign in.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPasswordModalOpen(true);
                  setPasswordError("");
                  setPasswordSuccess("");
                }}
                className="
                  shrink-0
                  rounded-full
                  bg-[#f3f1ed]
                  px-3.5
                  py-2.5
                  text-[10px]
                  font-bold
                  text-black/65
                  transition-all
                  active:scale-95
                "
              >
                Change
              </button>
            </div>
          </div>
        </section>

        <footer className="mt-10 text-center">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-black/20">
            TapForMenu
          </p>
        </footer>
      </div>

      {passwordModalOpen && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-end
            justify-center
            bg-black/30
            p-0
            backdrop-blur-[2px]
            sm:items-center
            sm:p-4
          "
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closePasswordModal();
            }
          }}
        >
          <div
            className="
              w-full
              max-w-md
              rounded-t-[28px]
              bg-white
              px-5
              pb-6
              pt-5
              shadow-[0_-10px_45px_rgba(0,0,0,0.12)]
              sm:rounded-[28px]
              sm:shadow-[0_20px_60px_rgba(0,0,0,0.15)]
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/30">
                  Security
                </p>

                <h2 className="mt-1 text-[19px] font-bold tracking-[-0.04em]">
                  Change password
                </h2>

                <p className="mt-1 text-[11px] leading-5 text-black/35">
                  Choose a new password
                  for your account.
                </p>
              </div>

              <button
                type="button"
                onClick={closePasswordModal}
                disabled={changingPassword}
                aria-label="Close"
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#f6f5f2]
                  text-[15px]
                  text-black/50
                  transition-all
                  active:scale-90
                  disabled:opacity-40
                "
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleChangePassword}
              className="mt-6"
            >
              <div>
                <label
                  htmlFor="current-password"
                  className="text-[11px] font-bold text-black/55"
                >
                  Current password
                </label>

                <input
                  id="current-password"
                  type="password"
                  value={
                    passwordForm.current_password
                  }
                  onChange={(event) =>
                    handlePasswordChange(
                      "current_password",
                      event.target.value
                    )
                  }
                  autoComplete="current-password"
                  className="
                    mt-2
                    h-12
                    w-full
                    rounded-[14px]
                    border-0
                    bg-[#f6f5f2]
                    px-4
                    text-[16px]
                    text-[#181512]
                    outline-none
                    ring-1
                    ring-black/[0.05]
                    focus:bg-white
                    focus:ring-black/15
                  "
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="new-password"
                  className="text-[11px] font-bold text-black/55"
                >
                  New password
                </label>

                <input
                  id="new-password"
                  type="password"
                  value={
                    passwordForm.new_password
                  }
                  onChange={(event) =>
                    handlePasswordChange(
                      "new_password",
                      event.target.value
                    )
                  }
                  autoComplete="new-password"
                  className="
                    mt-2
                    h-12
                    w-full
                    rounded-[14px]
                    border-0
                    bg-[#f6f5f2]
                    px-4
                    text-[16px]
                    text-[#181512]
                    outline-none
                    ring-1
                    ring-black/[0.05]
                    focus:bg-white
                    focus:ring-black/15
                  "
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="confirm-password"
                  className="text-[11px] font-bold text-black/55"
                >
                  Confirm new password
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  value={
                    passwordForm.confirm_password
                  }
                  onChange={(event) =>
                    handlePasswordChange(
                      "confirm_password",
                      event.target.value
                    )
                  }
                  autoComplete="new-password"
                  className="
                    mt-2
                    h-12
                    w-full
                    rounded-[14px]
                    border-0
                    bg-[#f6f5f2]
                    px-4
                    text-[16px]
                    text-[#181512]
                    outline-none
                    ring-1
                    ring-black/[0.05]
                    focus:bg-white
                    focus:ring-black/15
                  "
                />
              </div>

              {passwordError && (
                <div className="mt-4 rounded-[14px] bg-red-50 px-4 py-3">
                  <p className="text-[11px] font-medium leading-5 text-red-600">
                    {passwordError}
                  </p>
                </div>
              )}

              {passwordSuccess && (
                <div className="mt-4 rounded-[14px] bg-emerald-50 px-4 py-3">
                  <p className="text-[11px] font-medium leading-5 text-emerald-700">
                    {passwordSuccess}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={changingPassword}
                className="
                  mt-5
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  rounded-[14px]
                  bg-[#181512]
                  text-[12px]
                  font-bold
                  text-white
                  shadow-[0_8px_20px_rgba(24,21,18,0.12)]
                  transition-all
                  active:scale-[0.985]
                  disabled:opacity-40
                "
              >
                {changingPassword
                  ? "Changing password..."
                  : "Change password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}