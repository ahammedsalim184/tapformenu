"use client";

import { FormEvent } from "react";

interface MenuCategoryModalProps {
  open: boolean;
  mode: "add" | "edit";
  name: string;
  description: string;
  displayOrder: string;
  error: string;
  saving: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDisplayOrderChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export default function MenuCategoryModal({
  open,
  mode,
  name,
  description,
  displayOrder,
  error,
  saving,
  onNameChange,
  onDescriptionChange,
  onDisplayOrderChange,
  onSubmit,
  onClose,
}: MenuCategoryModalProps) {
  if (!open) {
    return null;
  }

  const isAdd = mode === "add";

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-end
        justify-center
        bg-black/45
        p-0
        backdrop-blur-[3px]
        sm:items-center
        sm:p-4
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-modal-title"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !saving
        ) {
          onClose();
        }
      }}
    >
      <div
        className="
          flex
          max-h-[90dvh]
          w-full
          flex-col
          overflow-hidden
          rounded-t-[26px]
          bg-white
          text-gray-950
          shadow-[0_-10px_40px_rgba(0,0,0,0.16)]
          sm:max-w-lg
          sm:rounded-[26px]
          sm:shadow-[0_20px_60px_rgba(0,0,0,0.15)]
        "
      >
        <div className="flex shrink-0 justify-center pt-2.5 sm:hidden">
          <div className="h-1.5 w-9 rounded-full bg-gray-200" />
        </div>

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            gap-3
            border-b
            border-gray-100
            px-4
            pb-4
            pt-3
            sm:px-6
            sm:pb-5
            sm:pt-5
          "
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2
                id="category-modal-title"
                className="
                  truncate
                  text-[18px]
                  font-semibold
                  tracking-[-0.025em]
                  text-gray-950
                  sm:text-[19px]
                "
              >
                {isAdd ? "Add category" : "Edit category"}
              </h2>

              <span
                className="
                  shrink-0
                  rounded-full
                  bg-gray-100
                  px-2
                  py-1
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-gray-500
                "
              >
                Menu
              </span>
            </div>

            <p
              className="
                mt-1
                line-clamp-2
                text-xs
                leading-5
                text-gray-500
                sm:text-sm
              "
            >
              {isAdd
                ? "Create a category to organize your menu."
                : "Update the category information below."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-gray-100
              text-gray-500
              transition
              hover:bg-gray-200
              hover:text-gray-900
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              overscroll-contain
              px-4
              py-4
              sm:px-6
              sm:py-5
            "
          >
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label
                  htmlFor="category-name"
                  className="
                    mb-1.5
                    block
                    text-[13px]
                    font-semibold
                    text-gray-800
                  "
                >
                  Category name
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="category-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    onNameChange(event.target.value)
                  }
                  placeholder="e.g. Starters"
                  disabled={saving}
                  autoComplete="off"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-3.5
                    text-[16px]
                    font-medium
                    text-gray-950
                    caret-gray-950
                    outline-none
                    placeholder:text-gray-400
                    transition
                    focus:border-gray-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-gray-100
                    disabled:cursor-not-allowed
                    disabled:bg-gray-100
                    disabled:text-gray-500
                  "
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label
                    htmlFor="category-description"
                    className="
                      block
                      text-[13px]
                      font-semibold
                      text-gray-800
                    "
                  >
                    Description
                  </label>

                  <span className="shrink-0 text-[10px] font-medium text-gray-400">
                    Optional
                  </span>
                </div>

                <textarea
                  id="category-description"
                  value={description}
                  onChange={(event) =>
                    onDescriptionChange(event.target.value)
                  }
                  placeholder="A short description for this category"
                  rows={3}
                  disabled={saving}
                  className="
                    min-h-[96px]
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-3.5
                    py-3
                    text-[16px]
                    leading-5
                    text-gray-950
                    caret-gray-950
                    outline-none
                    placeholder:text-gray-400
                    transition
                    focus:border-gray-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-gray-100
                    disabled:cursor-not-allowed
                    disabled:bg-gray-100
                    disabled:text-gray-500
                  "
                />
              </div>

              <div>
                <label
                  htmlFor="category-display-order"
                  className="
                    mb-1.5
                    block
                    text-[13px]
                    font-semibold
                    text-gray-800
                  "
                >
                  Display order
                </label>

                <input
                  id="category-display-order"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={displayOrder}
                  onChange={(event) =>
                    onDisplayOrderChange(
                      event.target.value
                    )
                  }
                  placeholder="0"
                  disabled={saving}
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-3.5
                    text-[16px]
                    font-medium
                    text-gray-950
                    caret-gray-950
                    outline-none
                    placeholder:text-gray-400
                    transition
                    focus:border-gray-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-gray-100
                    disabled:cursor-not-allowed
                    disabled:bg-gray-100
                    disabled:text-gray-500
                  "
                />

                <div
                  className="
                    mt-2
                    flex
                    items-center
                    gap-1.5
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-3.5 w-3.5 shrink-0 text-gray-400"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l2.5 2.5"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                    />
                  </svg>

                  <p className="text-[11px] text-gray-400">
                    Lower numbers appear first.
                  </p>
                </div>
              </div>

              {error && (
                <div
                  className="
                    flex
                    gap-2.5
                    rounded-xl
                    border
                    border-red-100
                    bg-red-50
                    px-3
                    py-3
                  "
                  role="alert"
                >
                  <div
                    className="
                      flex
                      h-6
                      w-6
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-red-100
                      text-red-600
                    "
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4M12 16h.01"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                      />
                    </svg>
                  </div>

                  <p
                    className="
                      min-w-0
                      whitespace-pre-line
                      pt-0.5
                      text-xs
                      leading-5
                      text-red-700
                    "
                  >
                    {error}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div
            className="
              shrink-0
              border-t
              border-gray-100
              bg-white
              px-4
              pb-[calc(0.75rem+env(safe-area-inset-bottom))]
              pt-3
              sm:px-6
              sm:py-4
            "
          >
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="
                  h-11
                  flex-1
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  text-[13px]
                  font-semibold
                  text-gray-700
                  transition
                  hover:bg-gray-50
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:h-12
                  sm:flex-none
                  sm:px-6
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="
                  h-11
                  flex-1
                  rounded-xl
                  bg-gray-950
                  px-4
                  text-[13px]
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-gray-800
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:h-12
                  sm:flex-none
                  sm:min-w-[140px]
                "
              >
                {saving ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="opacity-30"
                      />

                      <path
                        d="M21 12a9 9 0 0 0-9-9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>

                    Saving...
                  </span>
                ) : isAdd ? (
                  "Add category"
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}