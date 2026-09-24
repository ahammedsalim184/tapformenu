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

interface StaffMember {
  id: number;
  membership_id: number;
  username: string;
  email: string;
  active: boolean;
}

interface StaffForm {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  restaurant_slug: string;
}

export default function StaffSettingsPage() {
  const router = useRouter();

  const [user, setUser] =
    useState<CurrentUser | null>(null);

  const [staff, setStaff] =
    useState<StaffMember[]>([]);

  const [staffForm, setStaffForm] =
    useState<StaffForm>({
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      restaurant_slug: "",
    });

  const [editingStaff, setEditingStaff] =
    useState<StaffMember | null>(null);

  const [staffToRemove, setStaffToRemove] =
    useState<StaffMember | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [staffLoading, setStaffLoading] =
    useState(false);

  const [staffSaving, setStaffSaving] =
    useState(false);

  const [removingStaff, setRemovingStaff] =
    useState(false);

  const [staffModalOpen, setStaffModalOpen] =
    useState(false);

  const [removeModalOpen, setRemoveModalOpen] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser =
          await getCurrentUser();

        setUser(currentUser);

        const ownerRestaurants =
          currentUser.restaurants.filter(
            (restaurant: Restaurant) =>
              restaurant.role === "OWNER"
          );

        if (
          ownerRestaurants.length > 0
        ) {
          setStaffForm((current) => ({
            ...current,
            restaurant_slug:
              ownerRestaurants[0].slug,
          }));
        }
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const ownerRestaurants =
      user.restaurants.filter(
        (restaurant) =>
          restaurant.role === "OWNER"
      );

    if (
      ownerRestaurants.length === 0
    ) {
      return;
    }

    const restaurantSlug =
      staffForm.restaurant_slug ||
      ownerRestaurants[0].slug;

    if (!restaurantSlug) {
      return;
    }

    loadStaff(restaurantSlug);
  }, [
    user,
    staffForm.restaurant_slug,
  ]);

  async function loadStaff(
    restaurantSlug: string
  ) {
    const token = getAccessToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setStaffLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/accounts/staff/list/?restaurant_slug=${encodeURIComponent(
          restaurantSlug
        )}`,
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setStaff([]);
        setError(
          data.detail ||
            "Unable to load staff members."
        );
        return;
      }

      setStaff(data.staff || []);
    } catch {
      setStaff([]);
      setError(
        "Unable to load staff members."
      );
    } finally {
      setStaffLoading(false);
    }
  }

  function handleStaffChange(
    field: keyof StaffForm,
    value: string
  ) {
    setStaffForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  }

  function openAddStaff() {
    if (!user) {
      return;
    }

    const ownerRestaurants =
      user.restaurants.filter(
        (restaurant) =>
          restaurant.role === "OWNER"
      );

    setEditingStaff(null);

    setStaffForm({
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      restaurant_slug:
        staffForm.restaurant_slug ||
        ownerRestaurants[0]?.slug ||
        "",
    });

    setError("");
    setSuccess("");
    setStaffModalOpen(true);
  }

  function openEditStaff(
    member: StaffMember
  ) {
    setEditingStaff(member);

    setStaffForm({
      username: member.username,
      email: member.email,
      password: "",
      confirm_password: "",
      restaurant_slug:
        staffForm.restaurant_slug,
    });

    setError("");
    setSuccess("");
    setStaffModalOpen(true);
  }

  function closeStaffModal() {
    if (staffSaving) {
      return;
    }

    setStaffModalOpen(false);
    setEditingStaff(null);

    setStaffForm((current) => ({
      ...current,
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    }));

    setError("");
    setSuccess("");
  }

  async function handleSaveStaff(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const token = getAccessToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    if (
      !editingStaff &&
      !staffForm.restaurant_slug
    ) {
      setError(
        "Please select a restaurant."
      );
      return;
    }

    if (
      !staffForm.username.trim()
    ) {
      setError(
        "Please enter a username."
      );
      return;
    }

    if (!staffForm.email.trim()) {
      setError(
        "Please enter an email address."
      );
      return;
    }

    if (
      !editingStaff &&
      !staffForm.password
    ) {
      setError(
        "Please enter a password."
      );
      return;
    }

    if (
      staffForm.password !==
      staffForm.confirm_password
    ) {
      if (
        staffForm.password ||
        staffForm.confirm_password
      ) {
        setError(
          "Passwords do not match."
        );
        return;
      }
    }

    setStaffSaving(true);
    setError("");
    setSuccess("");

    try {
      const isEditing =
        Boolean(editingStaff);

      const payload: Record<
        string,
        string
      > = {
        username:
          staffForm.username.trim(),
        email:
          staffForm.email.trim(),
      };

      if (!isEditing) {
        payload.restaurant_slug =
          staffForm.restaurant_slug;
      }

      if (staffForm.password) {
        payload.password =
          staffForm.password;

        payload.confirm_password =
          staffForm.confirm_password;
      }

      const url = isEditing
        ? `/api/accounts/staff/${editingStaff?.id}/`
        : "/api/accounts/staff/";

      const response = await fetch(
        url,
        {
          method: isEditing
            ? "PATCH"
            : "POST",
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            payload
          ),
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
        } else if (data.password) {
          setError(
            Array.isArray(
              data.password
            )
              ? data.password[0]
              : data.password
          );
        } else if (
          data.confirm_password
        ) {
          setError(
            Array.isArray(
              data.confirm_password
            )
              ? data.confirm_password[0]
              : data.confirm_password
          );
        } else {
          setError(
            data.detail ||
              "Unable to save the staff account."
          );
        }

        return;
      }

      const updatedStaff =
        data.staff;

      if (isEditing) {
        setStaff((current) =>
          current.map((member) =>
            member.id ===
            updatedStaff.id
              ? updatedStaff
              : member
          )
        );

        setSuccess(
          "Staff account updated successfully."
        );
      } else {
        setStaff((current) => [
          ...current,
          updatedStaff,
        ]);

        setSuccess(
          "Staff account created successfully."
        );
      }

      setTimeout(() => {
        closeStaffModal();
      }, 600);
    } catch (error) {
      console.error(
        "Staff save error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setStaffSaving(false);
    }
  }

  function openRemoveStaff(
    member: StaffMember
  ) {
    setStaffToRemove(member);
    setError("");
    setRemoveModalOpen(true);
  }

  function closeRemoveStaff() {
    if (removingStaff) {
      return;
    }

    setRemoveModalOpen(false);
    setStaffToRemove(null);
  }

  async function handleRemoveStaff() {
    const token = getAccessToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    if (
      !staffToRemove ||
      !staffForm.restaurant_slug
    ) {
      return;
    }

    setRemovingStaff(true);
    setError("");

    try {
      const response = await fetch(
        `/api/accounts/staff/${staffToRemove.id}/?restaurant_slug=${encodeURIComponent(
          staffForm.restaurant_slug
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.detail ||
            "Unable to remove staff member."
        );

        return;
      }

      setStaff((current) =>
        current.filter(
          (member) =>
            member.id !==
            staffToRemove.id
        )
      );

      setSuccess(
        "Staff member removed successfully."
      );

      closeRemoveStaff();
    } catch {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setRemovingStaff(false);
    }
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

  const ownerRestaurants =
    user.restaurants.filter(
      (restaurant) =>
        restaurant.role === "OWNER"
    );

  if (ownerRestaurants.length === 0) {
    return (
      <main className="min-h-screen bg-[#f6f5f2] text-[#181512]">
        <div className="mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center px-5">
          <div className="w-full rounded-[24px] bg-white p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.035)] ring-1 ring-black/[0.04]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#f3f1ed] text-[18px]">
              !
            </div>

            <h1 className="mt-4 text-[18px] font-bold">
              Owner access required
            </h1>

            <p className="mt-2 text-[11px] leading-5 text-black/40">
              Only restaurant owners can
              manage staff accounts.
            </p>

            <button
              type="button"
              onClick={() =>
                router.back()
              }
              className="
                mt-5
                rounded-full
                bg-[#181512]
                px-5
                py-2.5
                text-[10px]
                font-bold
                text-white
                transition-all
                active:scale-95
              "
            >
              Go back
            </button>
          </div>
        </div>
      </main>
    );
  }

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
              Staff
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

            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                Team management
              </p>

              <h2 className="mt-2 text-[22px] font-bold tracking-[-0.04em]">
                Staff members
              </h2>

              <p className="mt-2 max-w-md text-[11px] leading-5 text-white/45">
                Add and manage the people
                who have access to your
                restaurant dashboard.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-7">
          <div className="mb-3 flex items-end justify-between gap-4 px-1">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/30">
                Restaurant
              </p>

              <h2 className="mt-1 text-[17px] font-bold tracking-[-0.03em]">
                Manage access
              </h2>
            </div>

            <button
              type="button"
              onClick={openAddStaff}
              className="
                shrink-0
                rounded-full
                bg-[#181512]
                px-3.5
                py-2.5
                text-[10px]
                font-bold
                text-white
                shadow-[0_6px_16px_rgba(24,21,18,0.12)]
                transition-all
                active:scale-95
              "
            >
              + Add staff
            </button>
          </div>

          {ownerRestaurants.length > 1 && (
            <select
              value={
                staffForm.restaurant_slug
              }
              onChange={(event) =>
                handleStaffChange(
                  "restaurant_slug",
                  event.target.value
                )
              }
              className="
                mb-3
                h-12
                w-full
                rounded-[14px]
                border-0
                bg-white
                px-4
                text-[16px]
                text-[#181512]
                outline-none
                ring-1
                ring-black/[0.05]
                shadow-[0_4px_20px_rgba(0,0,0,0.035)]
                focus:ring-black/15
              "
            >
              {ownerRestaurants.map(
                (restaurant) => (
                  <option
                    key={restaurant.id}
                    value={
                      restaurant.slug
                    }
                  >
                    {restaurant.name}
                  </option>
                )
              )}
            </select>
          )}

          {ownerRestaurants.length === 1 && (
            <div className="mb-3 rounded-[14px] bg-white px-4 py-3 ring-1 ring-black/[0.04]">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-black/25">
                Restaurant
              </p>

              <p className="mt-1 text-[12px] font-bold">
                {
                  ownerRestaurants[0]
                    .name
                }
              </p>
            </div>
          )}

          {success && !staffModalOpen && (
            <div className="mb-3 rounded-[14px] bg-emerald-50 px-4 py-3">
              <p className="text-[11px] font-medium leading-5 text-emerald-700">
                {success}
              </p>
            </div>
          )}

          {error &&
            !staffModalOpen &&
            !removeModalOpen && (
              <div className="mb-3 rounded-[14px] bg-red-50 px-4 py-3">
                <p className="text-[11px] font-medium leading-5 text-red-600">
                  {error}
                </p>
              </div>
            )}

          <div
            className="
              overflow-hidden
              rounded-[24px]
              bg-white
              shadow-[0_4px_20px_rgba(0,0,0,0.035)]
              ring-1
              ring-black/[0.04]
            "
          >
            {staffLoading ? (
              <div className="flex items-center justify-center px-5 py-10">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/10 border-t-[#181512]" />
              </div>
            ) : staff.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#f6f5f2] text-[20px] text-black/30">
                  +
                </div>

                <p className="mt-3 text-[13px] font-bold">
                  No staff members yet
                </p>

                <p className="mx-auto mt-1 max-w-xs text-[11px] leading-5 text-black/35">
                  Add a staff account to
                  give someone access to
                  this restaurant.
                </p>

                <button
                  type="button"
                  onClick={
                    openAddStaff
                  }
                  className="
                    mt-4
                    rounded-full
                    bg-[#181512]
                    px-4
                    py-2.5
                    text-[10px]
                    font-bold
                    text-white
                    transition-all
                    active:scale-95
                  "
                >
                  Add staff member
                </button>
              </div>
            ) : (
              <div className="divide-y divide-black/[0.05]">
                {staff.map(
                  (member) => (
                    <div
                      key={member.id}
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                        px-5
                        py-4
                      "
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#f3f1ed] text-[14px] font-bold text-[#181512]">
                        {member.username
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold">
                          {
                            member.username
                          }
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-black/35">
                          {
                            member.email
                          }
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          openEditStaff(
                            member
                          )
                        }
                        className="
                          shrink-0
                          rounded-full
                          bg-[#f3f1ed]
                          px-3
                          py-2
                          text-[10px]
                          font-bold
                          text-black/60
                          transition-all
                          active:scale-95
                        "
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openRemoveStaff(
                            member
                          )
                        }
                        className="
                          shrink-0
                          rounded-full
                          bg-red-50
                          px-3
                          py-2
                          text-[10px]
                          font-bold
                          text-red-500
                          transition-all
                          active:scale-95
                        "
                      >
                        Remove
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </section>

        <footer className="mt-10 text-center">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-black/20">
            TapForMenu
          </p>
        </footer>
      </div>

      {staffModalOpen && (
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
              closeStaffModal();
            }
          }}
        >
          <div
            className="
              max-h-[92vh]
              w-full
              max-w-md
              overflow-y-auto
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
                  Team
                </p>

                <h2 className="mt-1 text-[19px] font-bold tracking-[-0.04em]">
                  {editingStaff
                    ? "Edit staff member"
                    : "Add staff member"}
                </h2>

                <p className="mt-1 text-[11px] leading-5 text-black/35">
                  {editingStaff
                    ? "Update this staff account."
                    : "Create a new staff account."}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeStaffModal
                }
                disabled={
                  staffSaving
                }
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
              onSubmit={
                handleSaveStaff
              }
              className="mt-6"
            >
              {!editingStaff &&
                ownerRestaurants.length >
                  1 && (
                  <div className="mb-4">
                    <label
                      htmlFor="staff-restaurant"
                      className="text-[11px] font-bold text-black/55"
                    >
                      Restaurant
                    </label>

                    <select
                      id="staff-restaurant"
                      value={
                        staffForm.restaurant_slug
                      }
                      onChange={(event) =>
                        handleStaffChange(
                          "restaurant_slug",
                          event.target.value
                        )
                      }
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
                    >
                      {ownerRestaurants.map(
                        (
                          restaurant
                        ) => (
                          <option
                            key={
                              restaurant.id
                            }
                            value={
                              restaurant.slug
                            }
                          >
                            {
                              restaurant.name
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}

              {!editingStaff &&
                ownerRestaurants.length ===
                  1 && (
                  <div className="mb-4 rounded-[14px] bg-[#f6f5f2] px-4 py-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-black/25">
                      Restaurant
                    </p>

                    <p className="mt-1 text-[12px] font-bold text-[#181512]">
                      {
                        ownerRestaurants[0]
                          .name
                      }
                    </p>
                  </div>
                )}

              <div>
                <label
                  htmlFor="staff-username"
                  className="text-[11px] font-bold text-black/55"
                >
                  Username
                </label>

                <input
                  id="staff-username"
                  type="text"
                  value={
                    staffForm.username
                  }
                  onChange={(event) =>
                    handleStaffChange(
                      "username",
                      event.target.value
                    )
                  }
                  autoComplete="off"
                  spellCheck={false}
                  required
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
                  htmlFor="staff-email"
                  className="text-[11px] font-bold text-black/55"
                >
                  Email address
                </label>

                <input
                  id="staff-email"
                  type="email"
                  value={
                    staffForm.email
                  }
                  onChange={(event) =>
                    handleStaffChange(
                      "email",
                      event.target.value
                    )
                  }
                  autoComplete="off"
                  required
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
                  htmlFor="staff-password"
                  className="text-[11px] font-bold text-black/55"
                >
                  {editingStaff
                    ? "New password"
                    : "Password"}
                </label>

                {editingStaff && (
                  <p className="mt-1 text-[10px] text-black/30">
                    Leave blank to keep the
                    current password.
                  </p>
                )}

                <input
                  id="staff-password"
                  type="password"
                  value={
                    staffForm.password
                  }
                  onChange={(event) =>
                    handleStaffChange(
                      "password",
                      event.target.value
                    )
                  }
                  autoComplete="new-password"
                  required={
                    !editingStaff
                  }
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
                  htmlFor="staff-confirm-password"
                  className="text-[11px] font-bold text-black/55"
                >
                  Confirm password
                </label>

                <input
                  id="staff-confirm-password"
                  type="password"
                  value={
                    staffForm.confirm_password
                  }
                  onChange={(event) =>
                    handleStaffChange(
                      "confirm_password",
                      event.target.value
                    )
                  }
                  autoComplete="new-password"
                  required={
                    !editingStaff ||
                    Boolean(
                      staffForm.password
                    )
                  }
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

              {error && (
                <div className="mt-4 rounded-[14px] bg-red-50 px-4 py-3">
                  <p className="text-[11px] font-medium leading-5 text-red-600">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  staffSaving ||
                  (!editingStaff &&
                    !staffForm.restaurant_slug)
                }
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
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                {staffSaving
                  ? "Saving..."
                  : editingStaff
                    ? "Save changes"
                    : "Add staff member"}
              </button>
            </form>
          </div>
        </div>
      )}

      {removeModalOpen &&
        staffToRemove && (
          <div
            className="
              fixed
              inset-0
              z-[110]
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
                closeRemoveStaff();
              }
            }}
          >
            <div
              className="
                w-full
                max-w-sm
                rounded-t-[28px]
                bg-white
                px-5
                pb-6
                pt-6
                shadow-[0_-10px_45px_rgba(0,0,0,0.12)]
                sm:rounded-[28px]
                sm:shadow-[0_20px_60px_rgba(0,0,0,0.15)]
              "
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-red-50 text-[18px] font-bold text-red-500">
                !
              </div>

              <h2 className="mt-4 text-[19px] font-bold tracking-[-0.04em]">
                Remove staff member?
              </h2>

              <p className="mt-2 text-[12px] leading-5 text-black/40">
                <span className="font-bold text-black/65">
                  {
                    staffToRemove.username
                  }
                </span>{" "}
                will lose access to
                this restaurant.
                Their account will not
                be permanently deleted.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={
                    closeRemoveStaff
                  }
                  disabled={
                    removingStaff
                  }
                  className="
                    flex
                    h-12
                    flex-1
                    items-center
                    justify-center
                    rounded-[14px]
                    bg-[#f3f1ed]
                    text-[12px]
                    font-bold
                    text-black/60
                    transition-all
                    active:scale-[0.985]
                    disabled:opacity-40
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleRemoveStaff
                  }
                  disabled={
                    removingStaff
                  }
                  className="
                    flex
                    h-12
                    flex-1
                    items-center
                    justify-center
                    rounded-[14px]
                    bg-red-500
                    text-[12px]
                    font-bold
                    text-white
                    shadow-[0_8px_20px_rgba(239,68,68,0.16)]
                    transition-all
                    active:scale-[0.985]
                    disabled:opacity-40
                  "
                >
                  {removingStaff
                    ? "Removing..."
                    : "Remove"}
                </button>
              </div>
            </div>
          </div>
        )}
    </main>
  );
}