"use client";

import { MenuCategory } from "./MenuTypes";

interface DeleteCategoryModalProps {
  open: boolean;
  category: MenuCategory | null;
  deleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteCategoryModal({
  open,
  category,
  deleting,
  onConfirm,
  onClose,
}: DeleteCategoryModalProps) {
  if (!open || !category) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Delete Category
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-900">
              {category.name}
            </span>
            ?
          </p>

          {category.items.length > 0 && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">
                This category contains {category.items.length} menu item
                {category.items.length !== 1 ? "s" : ""}. Deleting the
                category will also delete its items and variants.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete Category"}
          </button>
        </div>
      </div>
    </div>
  );
}