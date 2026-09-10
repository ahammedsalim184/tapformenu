"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import MenuCategoryModal from "@/components/dashboard/menu/MenuCategoryModal";
import DeleteCategoryModal from "@/components/dashboard/menu/DeleteCategoryModal";
import MenuItemForm from "@/components/dashboard/menu/MenuItemForm";
import MenuVariantForm from "@/components/dashboard/menu/MenuVariantForm";
import MenuCategorySection from "@/components/dashboard/menu/MenuCategorySection";

import {
  MenuCategory,
  MenuItem,
  MenuResponse,
  MenuVariant,
} from "@/components/dashboard/menu/MenuTypes";

const API_BASE_URL = "http://192.168.1.41:8000";

export default function RestaurantMenuPage() {
  const params = useParams();
  const router = useRouter();

  const restaurantSlug = params.restaurant as string;

  const [menu, setMenu] = useState<MenuResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // CATEGORY STATE
  // ==================================================

  const [showCategoryModal, setShowCategoryModal] =
    useState(false);

  const [categoryModalMode, setCategoryModalMode] =
    useState<"add" | "edit">("add");

  const [selectedCategory, setSelectedCategory] =
    useState<MenuCategory | null>(null);

  const [categoryName, setCategoryName] =
    useState("");

  const [categoryDescription, setCategoryDescription] =
    useState("");

  const [categoryDisplayOrder, setCategoryDisplayOrder] =
    useState("0");

  const [savingCategory, setSavingCategory] =
    useState(false);

  const [categoryError, setCategoryError] =
    useState("");

  // ==================================================
  // DELETE CATEGORY STATE
  // ==================================================

  const [
    showDeleteCategoryModal,
    setShowDeleteCategoryModal,
  ] = useState(false);

  const [categoryToDelete, setCategoryToDelete] =
    useState<MenuCategory | null>(null);

  const [deletingCategory, setDeletingCategory] =
    useState(false);

  // ==================================================
  // MENU ITEM STATE
  // ==================================================

  const [showItemModal, setShowItemModal] =
    useState(false);

  const [itemModalMode, setItemModalMode] =
    useState<"add" | "edit">("add");

  const [selectedItem, setSelectedItem] =
    useState<MenuItem | null>(null);

  const [itemName, setItemName] =
    useState("");

  const [itemDescription, setItemDescription] =
    useState("");

  const [itemCategory, setItemCategory] =
    useState("");

  const [itemPriceRange, setItemPriceRange] =
    useState(false);

  const [itemPrice, setItemPrice] =
    useState("");

  const [itemPriceMin, setItemPriceMin] =
    useState("");

  const [itemPriceMax, setItemPriceMax] =
    useState("");

  const [itemVegetarian, setItemVegetarian] =
    useState(false);

  const [itemAvailable, setItemAvailable] =
    useState(true);

  const [itemDisplayOrder, setItemDisplayOrder] =
    useState("0");

  const [itemImage, setItemImage] =
    useState<File | null>(null);

  const [savingItem, setSavingItem] =
    useState(false);

  const [itemError, setItemError] =
    useState("");

  // ==================================================
  // VARIANT STATE
  // ==================================================

  const [showVariantModal, setShowVariantModal] =
    useState(false);

  const [variantModalMode, setVariantModalMode] =
    useState<"add" | "edit">("add");

  const [
    selectedItemForVariant,
    setSelectedItemForVariant,
  ] = useState<MenuItem | null>(null);

  const [selectedVariant, setSelectedVariant] =
    useState<MenuVariant | null>(null);

  const [variantName, setVariantName] =
    useState("");

  const [variantPriceRange, setVariantPriceRange] =
    useState(false);

  const [variantPrice, setVariantPrice] =
    useState("");

  const [variantPriceMin, setVariantPriceMin] =
    useState("");

  const [variantPriceMax, setVariantPriceMax] =
    useState("");

  const [variantAvailable, setVariantAvailable] =
    useState(true);

  const [variantDisplayOrder, setVariantDisplayOrder] =
    useState("0");

  const [variantImage, setVariantImage] =
    useState<File | null>(null);

  const [savingVariant, setSavingVariant] =
    useState(false);

  const [variantError, setVariantError] =
    useState("");

  // ==================================================
  // AUTH HELPERS
  // ==================================================

  function handleUnauthorized() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    router.push("/login");
  }

  function getToken() {
    const token =
      localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return null;
    }

    return token;
  }

  // ==================================================
  // LOAD MENU
  // ==================================================

  async function loadMenu() {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/menus/manage/${restaurantSlug}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        setError(
          "You do not have access to this restaurant."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to load restaurant menu."
        );
      }

      const data: MenuResponse =
        await response.json();

      setMenu(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load menu."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (restaurantSlug) {
      loadMenu();
    }
  }, [restaurantSlug]);

  // ==================================================
  // CATEGORY
  // ==================================================

  function openAddCategory() {
    setCategoryModalMode("add");
    setSelectedCategory(null);

    setCategoryName("");
    setCategoryDescription("");
    setCategoryDisplayOrder("0");

    setCategoryError("");
    setShowCategoryModal(true);
  }

  function openEditCategory(
    category: MenuCategory
  ) {
    setCategoryModalMode("edit");
    setSelectedCategory(category);

    setCategoryName(category.name);

    setCategoryDescription(
      category.description || ""
    );

    setCategoryDisplayOrder(
      String(category.display_order)
    );

    setCategoryError("");
    setShowCategoryModal(true);
  }

  function closeCategoryModal() {
    if (savingCategory) {
      return;
    }

    setShowCategoryModal(false);
    setSelectedCategory(null);
    setCategoryError("");
  }

  async function handleCategorySubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!categoryName.trim()) {
      setCategoryError(
        "Category name is required."
      );
      return;
    }

    const token = getToken();

    if (!token) {
      return;
    }

    try {
      setSavingCategory(true);
      setCategoryError("");

      const payload = {
        name: categoryName.trim(),
        description:
          categoryDescription.trim(),
        display_order:
          Number(categoryDisplayOrder) || 0,
      };

      let response: Response;

      if (
        categoryModalMode === "edit" &&
        selectedCategory
      ) {
        response = await fetch(
          `${API_BASE_URL}/api/menus/manage/${restaurantSlug}/categories/${selectedCategory.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        response = await fetch(
          `${API_BASE_URL}/api/menus/manage/${restaurantSlug}/categories/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      }

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        if (
          typeof data === "object" &&
          data !== null
        ) {
          const messages =
            Object.entries(data)
              .map(([key, value]) => {
                if (Array.isArray(value)) {
                  return `${key}: ${value.join(
                    ", "
                  )}`;
                }

                return `${key}: ${String(
                  value
                )}`;
              })
              .join("\n");

          throw new Error(
            messages ||
              "Failed to save category."
          );
        }

        throw new Error(
          "Failed to save category."
        );
      }

      setShowCategoryModal(false);
      setSelectedCategory(null);

      await loadMenu();
    } catch (err) {
      console.error(err);

      setCategoryError(
        err instanceof Error
          ? err.message
          : "Failed to save category."
      );
    } finally {
      setSavingCategory(false);
    }
  }

  function openDeleteCategory(
    category: MenuCategory
  ) {
    setCategoryToDelete(category);
    setShowDeleteCategoryModal(true);
  }

  function closeDeleteCategory() {
    if (deletingCategory) {
      return;
    }

    setShowDeleteCategoryModal(false);
    setCategoryToDelete(null);
  }

  async function handleDeleteCategory() {
    if (!categoryToDelete) {
      return;
    }

    const token = getToken();

    if (!token) {
      return;
    }

    try {
      setDeletingCategory(true);

      const response = await fetch(
        `${API_BASE_URL}/api/menus/manage/${restaurantSlug}/categories/${categoryToDelete.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        let message =
          "Failed to delete category.";

        try {
          const data =
            await response.json();

          if (data?.detail) {
            message = data.detail;
          }
        } catch {
          // Ignore JSON parsing errors.
        }

        throw new Error(message);
      }

      setShowDeleteCategoryModal(false);
      setCategoryToDelete(null);

      await loadMenu();
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete category."
      );
    } finally {
      setDeletingCategory(false);
    }
  }

  // ==================================================
  // ITEM FORM RESET
  // ==================================================

  function resetItemForm(
    categoryId?: number
  ) {
    setItemName("");
    setItemDescription("");

    if (categoryId !== undefined) {
      setItemCategory(
        String(categoryId)
      );
    } else {
      setItemCategory(
        menu?.categories.length
          ? String(menu.categories[0].id)
          : ""
      );
    }

    setItemPriceRange(false);
    setItemPrice("");
    setItemPriceMin("");
    setItemPriceMax("");

    setItemVegetarian(false);
    setItemAvailable(true);
    setItemDisplayOrder("0");

    setItemImage(null);
    setItemError("");
  }

  // ==================================================
  // ADD ITEM
  // ==================================================

  function openAddItem(
    categoryId?: number
  ) {
    setItemModalMode("add");
    setSelectedItem(null);

    resetItemForm(categoryId);

    setShowItemModal(true);
  }

  // ==================================================
  // EDIT ITEM
  // ==================================================

  function openEditItem(
    item: MenuItem
  ) {
    setItemModalMode("edit");
    setSelectedItem(item);

    setItemName(item.name);

    setItemDescription(
      item.description || ""
    );

    setItemCategory(
      String(item.category)
    );

    setItemPriceRange(
      item.price_range
    );

    setItemPrice(
      item.price || ""
    );

    setItemPriceMin(
      item.price_min || ""
    );

    setItemPriceMax(
      item.price_max || ""
    );

    setItemVegetarian(
      item.vegetarian
    );

    setItemAvailable(
      item.available
    );

    setItemDisplayOrder(
      String(item.display_order)
    );

    // File inputs cannot be populated
    // programmatically by the browser.
    // Leave this empty so existing image
    // remains unchanged if no new image is selected.
    setItemImage(null);

    setItemError("");
    setShowItemModal(true);
  }

  function closeItemModal() {
    if (savingItem) {
      return;
    }

    setShowItemModal(false);
    setSelectedItem(null);
    setItemError("");
  }

  // ==================================================
  // ITEM VALIDATION
  // ==================================================

  function validateItemForm() {
    if (!itemName.trim()) {
      setItemError(
        "Item name is required."
      );
      return false;
    }

    if (!itemCategory) {
      setItemError(
        "Please select a category."
      );
      return false;
    }

    if (itemPriceRange) {
      if (!itemPriceMin.trim()) {
        setItemError(
          "Minimum price is required."
        );
        return false;
      }

      if (!itemPriceMax.trim()) {
        setItemError(
          "Maximum price is required."
        );
        return false;
      }

      const min = Number(
        itemPriceMin
      );

      const max = Number(
        itemPriceMax
      );

      if (
        Number.isNaN(min) ||
        Number.isNaN(max)
      ) {
        setItemError(
          "Please enter valid prices."
        );
        return false;
      }

      if (min < 0 || max < 0) {
        setItemError(
          "Price cannot be negative."
        );
        return false;
      }

      if (min > max) {
        setItemError(
          "Maximum price must be greater than or equal to minimum price."
        );
        return false;
      }
    } else {
      if (itemPrice.trim()) {
        const price = Number(
          itemPrice
        );

        if (Number.isNaN(price)) {
          setItemError(
            "Please enter a valid price."
          );
          return false;
        }

        if (price < 0) {
          setItemError(
            "Price cannot be negative."
          );
          return false;
        }
      }
    }

    return true;
  }

  // ==================================================
  // ADD ITEM
  // ==================================================

  async function handleAddItem(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setItemError("");

    if (!validateItemForm()) {
      return;
    }

    const token = getToken();

    if (!token) {
      return;
    }

    try {
      setSavingItem(true);

      const formData = new FormData();

      formData.append(
        "category",
        itemCategory
      );

      formData.append(
        "name",
        itemName.trim()
      );

      formData.append(
        "description",
        itemDescription.trim()
      );

      formData.append(
        "price_range",
        String(itemPriceRange)
      );

      if (itemPriceRange) {
        formData.append(
          "price_min",
          itemPriceMin
        );

        formData.append(
          "price_max",
          itemPriceMax
        );
      } else {
        if (itemPrice.trim()) {
          formData.append(
            "price",
            itemPrice
          );
        }
      }

      formData.append(
        "vegetarian",
        String(itemVegetarian)
      );

      formData.append(
        "available",
        String(itemAvailable)
      );

      formData.append(
        "display_order",
        String(
          Number(itemDisplayOrder) || 0
        )
      );

      if (itemImage) {
        formData.append(
          "image",
          itemImage
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/menus/items/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        if (
          typeof data === "object" &&
          data !== null
        ) {
          const messages =
            Object.entries(data)
              .map(([key, value]) => {
                if (
                  Array.isArray(value)
                ) {
                  return `${key}: ${value.join(
                    ", "
                  )}`;
                }

                if (
                  typeof value === "object" &&
                  value !== null
                ) {
                  return `${key}: ${JSON.stringify(
                    value
                  )}`;
                }

                return `${key}: ${String(
                  value
                )}`;
              })
              .join("\n");

          throw new Error(
            messages ||
              "Failed to add menu item."
          );
        }

        throw new Error(
          "Failed to add menu item."
        );
      }

      setShowItemModal(false);
      setSelectedItem(null);
      setItemError("");

      await loadMenu();
    } catch (err) {
      console.error(err);

      setItemError(
        err instanceof Error
          ? err.message
          : "Failed to add menu item."
      );
    } finally {
      setSavingItem(false);
    }
  }

  // ==================================================
  // UPDATE ITEM
  // ==================================================

  async function handleUpdateItem(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setItemError("");

    if (!selectedItem) {
      setItemError(
        "No menu item selected."
      );
      return;
    }

    if (!validateItemForm()) {
      return;
    }

    const token = getToken();

    if (!token) {
      return;
    }

    try {
      setSavingItem(true);

      const formData = new FormData();

      formData.append(
        "category",
        itemCategory
      );

      formData.append(
        "name",
        itemName.trim()
      );

      formData.append(
        "description",
        itemDescription.trim()
      );

      formData.append(
        "price_range",
        String(itemPriceRange)
      );

      if (itemPriceRange) {
        // Explicitly clear fixed price.
        formData.append(
          "price",
          ""
        );

        formData.append(
          "price_min",
          itemPriceMin
        );

        formData.append(
          "price_max",
          itemPriceMax
        );
      } else {
        formData.append(
          "price",
          itemPrice
        );

        // Explicitly clear range values.
        formData.append(
          "price_min",
          ""
        );

        formData.append(
          "price_max",
          ""
        );
      }

      formData.append(
        "vegetarian",
        String(itemVegetarian)
      );

      formData.append(
        "available",
        String(itemAvailable)
      );

      formData.append(
        "display_order",
        String(
          Number(itemDisplayOrder) || 0
        )
      );

      if (itemImage) {
        formData.append(
          "image",
          itemImage
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/menus/items/${selectedItem.id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        if (
          typeof data === "object" &&
          data !== null
        ) {
          const messages =
            Object.entries(data)
              .map(([key, value]) => {
                if (
                  Array.isArray(value)
                ) {
                  return `${key}: ${value.join(
                    ", "
                  )}`;
                }

                if (
                  typeof value === "object" &&
                  value !== null
                ) {
                  return `${key}: ${JSON.stringify(
                    value
                  )}`;
                }

                return `${key}: ${String(
                  value
                )}`;
              })
              .join("\n");

          throw new Error(
            messages ||
              "Failed to update menu item."
          );
        }

        throw new Error(
          "Failed to update menu item."
        );
      }

      setShowItemModal(false);
      setSelectedItem(null);
      setItemError("");

      await loadMenu();
    } catch (err) {
      console.error(err);

      setItemError(
        err instanceof Error
          ? err.message
          : "Failed to update menu item."
      );
    } finally {
      setSavingItem(false);
    }
  }

  // ==================================================
  // DELETE ITEM
  // ==================================================

  async function handleDeleteItem(
    item: MenuItem
  ) {
    const confirmed = window.confirm(
      `Delete "${item.name}"?\n\nThis will also delete all of its variants.\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    const token = getToken();

    if (!token) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/menus/items/${item.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        const data =
          await response
            .json()
            .catch(() => ({}));

        throw new Error(
          data.detail ||
            "Failed to delete menu item."
        );
      }

      setMenu((currentMenu) => {
        if (!currentMenu) {
          return currentMenu;
        }

        return {
          ...currentMenu,
          categories:
            currentMenu.categories.map(
              (category) => ({
                ...category,
                items:
                  category.items.filter(
                    (existingItem) =>
                      existingItem.id !==
                      item.id
                  ),
              })
            ),
        };
      });
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete menu item."
      );
    }
  }

  // ==================================================
  // VARIANT FORM RESET
  // ==================================================

  function resetVariantForm() {
    setVariantName("");
    setVariantPriceRange(false);
    setVariantPrice("");
    setVariantPriceMin("");
    setVariantPriceMax("");
    setVariantAvailable(true);
    setVariantDisplayOrder("0");
    setVariantImage(null);
    setVariantError("");
  }

  // ==================================================
  // ADD VARIANT
  // ==================================================

  function openAddVariant(
    item: MenuItem
  ) {
    setVariantModalMode("add");
    setSelectedVariant(null);

    resetVariantForm();

    setSelectedItemForVariant(item);
    setShowVariantModal(true);
  }

  // ==================================================
  // EDIT VARIANT
  // ==================================================

  function openEditVariant(
    item: MenuItem,
    variant: MenuVariant
  ) {
    setVariantModalMode("edit");

    setSelectedItemForVariant(item);
    setSelectedVariant(variant);

    setVariantName(
      variant.name
    );

    setVariantPriceRange(
      variant.price_range
    );

    setVariantPrice(
      variant.price || ""
    );

    setVariantPriceMin(
      variant.price_min || ""
    );

    setVariantPriceMax(
      variant.price_max || ""
    );

    setVariantAvailable(
      variant.available
    );

    setVariantDisplayOrder(
      String(variant.display_order)
    );

    // Existing image remains unchanged
    // unless the user selects a new file.
    setVariantImage(null);

    setVariantError("");
    setShowVariantModal(true);
  }

  function closeVariantModal() {
    if (savingVariant) {
      return;
    }

    setShowVariantModal(false);
    setSelectedItemForVariant(null);
    setSelectedVariant(null);
    setVariantError("");
  }

  // ==================================================
  // VARIANT VALIDATION
  // ==================================================

  function validateVariantForm() {
    if (!selectedItemForVariant) {
      setVariantError(
        "No menu item selected."
      );
      return false;
    }

    if (!variantName.trim()) {
      setVariantError(
        "Variant name is required."
      );
      return false;
    }

    if (variantPriceRange) {
      if (!variantPriceMin.trim()) {
        setVariantError(
          "Minimum price is required."
        );
        return false;
      }

      if (!variantPriceMax.trim()) {
        setVariantError(
          "Maximum price is required."
        );
        return false;
      }

      const min = Number(
        variantPriceMin
      );

      const max = Number(
        variantPriceMax
      );

      if (
        Number.isNaN(min) ||
        Number.isNaN(max)
      ) {
        setVariantError(
          "Please enter valid prices."
        );
        return false;
      }

      if (min < 0 || max < 0) {
        setVariantError(
          "Price cannot be negative."
        );
        return false;
      }

      if (min > max) {
        setVariantError(
          "Maximum price must be greater than or equal to minimum price."
        );
        return false;
      }
    } else {
      if (!variantPrice.trim()) {
        setVariantError(
          "Price is required."
        );
        return false;
      }

      const price = Number(
        variantPrice
      );

      if (Number.isNaN(price)) {
        setVariantError(
          "Please enter a valid price."
        );
        return false;
      }

      if (price < 0) {
        setVariantError(
          "Price cannot be negative."
        );
        return false;
      }
    }

    return true;
  }

  // ==================================================
  // ADD VARIANT
  // ==================================================

  async function handleAddVariant(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setVariantError("");

    if (!validateVariantForm()) {
      return;
    }

    if (!selectedItemForVariant) {
      return;
    }

    const token = getToken();

    if (!token) {
      return;
    }

    try {
      setSavingVariant(true);

      const formData = new FormData();

      formData.append(
        "name",
        variantName.trim()
      );

      formData.append(
        "price_range",
        String(variantPriceRange)
      );

      if (variantPriceRange) {
        formData.append(
          "price_min",
          variantPriceMin
        );

        formData.append(
          "price_max",
          variantPriceMax
        );
      } else {
        formData.append(
          "price",
          variantPrice
        );
      }

      formData.append(
        "available",
        String(variantAvailable)
      );

      formData.append(
        "display_order",
        String(
          Number(variantDisplayOrder) || 0
        )
      );

      if (variantImage) {
        formData.append(
          "image",
          variantImage
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/menus/manage/${restaurantSlug}/items/${selectedItemForVariant.id}/variants/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        if (
          typeof data === "object" &&
          data !== null
        ) {
          const messages =
            Object.entries(data)
              .map(([key, value]) => {
                if (
                  Array.isArray(value)
                ) {
                  return `${key}: ${value.join(
                    ", "
                  )}`;
                }

                if (
                  typeof value === "object" &&
                  value !== null
                ) {
                  return `${key}: ${JSON.stringify(
                    value
                  )}`;
                }

                return `${key}: ${String(
                  value
                )}`;
              })
              .join("\n");

          throw new Error(
            messages ||
              "Failed to add variant."
          );
        }

        throw new Error(
          "Failed to add variant."
        );
      }

      setShowVariantModal(false);
      setSelectedItemForVariant(null);
      setSelectedVariant(null);
      setVariantError("");

      await loadMenu();
    } catch (err) {
      console.error(err);

      setVariantError(
        err instanceof Error
          ? err.message
          : "Failed to add variant."
      );
    } finally {
      setSavingVariant(false);
    }
  }

  // ==================================================
  // UPDATE VARIANT
  // ==================================================

  async function handleUpdateVariant(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setVariantError("");

    if (
      !selectedItemForVariant ||
      !selectedVariant
    ) {
      setVariantError(
        "No variant selected."
      );
      return;
    }

    if (!validateVariantForm()) {
      return;
    }

    const token = getToken();

    if (!token) {
      return;
    }

    try {
      setSavingVariant(true);

      const formData = new FormData();

      formData.append(
        "name",
        variantName.trim()
      );

      formData.append(
        "price_range",
        String(variantPriceRange)
      );

      if (variantPriceRange) {
        // Explicitly clear fixed price.
        formData.append(
          "price",
          ""
        );

        formData.append(
          "price_min",
          variantPriceMin
        );

        formData.append(
          "price_max",
          variantPriceMax
        );
      } else {
        formData.append(
          "price",
          variantPrice
        );

        // Explicitly clear range values.
        formData.append(
          "price_min",
          ""
        );

        formData.append(
          "price_max",
          ""
        );
      }

      formData.append(
        "available",
        String(variantAvailable)
      );

      formData.append(
        "display_order",
        String(
          Number(variantDisplayOrder) || 0
        )
      );

      if (variantImage) {
        formData.append(
          "image",
          variantImage
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/menus/manage/${restaurantSlug}/items/${selectedItemForVariant.id}/variants/${selectedVariant.id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        if (
          typeof data === "object" &&
          data !== null
        ) {
          const messages =
            Object.entries(data)
              .map(([key, value]) => {
                if (
                  Array.isArray(value)
                ) {
                  return `${key}: ${value.join(
                    ", "
                  )}`;
                }

                if (
                  typeof value === "object" &&
                  value !== null
                ) {
                  return `${key}: ${JSON.stringify(
                    value
                  )}`;
                }

                return `${key}: ${String(
                  value
                )}`;
              })
              .join("\n");

          throw new Error(
            messages ||
              "Failed to update variant."
          );
        }

        throw new Error(
          "Failed to update variant."
        );
      }

      setShowVariantModal(false);
      setSelectedItemForVariant(null);
      setSelectedVariant(null);
      setVariantError("");

      await loadMenu();
    } catch (err) {
      console.error(err);

      setVariantError(
        err instanceof Error
          ? err.message
          : "Failed to update variant."
      );
    } finally {
      setSavingVariant(false);
    }
  }

  // ==================================================
  // DELETE VARIANT
  // ==================================================

  async function handleDeleteVariant(
    item: MenuItem,
    variant: MenuVariant
  ) {
    const confirmed = window.confirm(
      `Delete "${variant.name}" from "${item.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    const token = getToken();

    if (!token) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/menus/manage/${restaurantSlug}/items/${item.id}/variants/${variant.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        const data =
          await response
            .json()
            .catch(() => ({}));

        throw new Error(
          data.detail ||
            "Failed to delete variant."
        );
      }

      await loadMenu();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete variant."
      );
    }
  }

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <p className="text-sm text-gray-500">
              Loading menu...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-lg font-semibold text-red-800">
              Unable to load menu
            </h1>

            <p className="mt-2 whitespace-pre-line text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => loadMenu()}
              className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!menu) {
    return null;
  }

  // ==================================================
  // MAIN PAGE
  // ==================================================

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/restaurants/${restaurantSlug}`
                )
              }
              className="mb-3 text-sm text-gray-500 hover:text-gray-900"
            >
              ← Back to Restaurant
            </button>

            <h1 className="text-2xl font-semibold text-gray-900">
              Menu
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {menu.restaurant.name}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openAddCategory}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              + Add Category
            </button>

            <button
              type="button"
              onClick={() =>
                openAddItem()
              }
              disabled={
                menu.categories.length === 0
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              + Add Menu Item
            </button>
          </div>
        </div>

        {/* NO CATEGORIES */}

        {menu.categories.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No menu categories yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Create your first category before
              adding menu items.
            </p>

            <button
              type="button"
              onClick={openAddCategory}
              className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              + Add Category
            </button>
          </div>
        )}

        {/* CATEGORIES */}

        <div className="space-y-6">
          {menu.categories.map(
            (category) => (
              <MenuCategorySection
                key={category.id}
                category={category}
                onEditCategory={
                  openEditCategory
                }
                onDeleteCategory={
                  openDeleteCategory
                }
                onAddItem={
                  openAddItem
                }
                onAddVariant={
                  openAddVariant
                }
                onEditVariant={
                  openEditVariant
                }
                onDeleteVariant={
                  handleDeleteVariant
                }
                onEditItem={
                  openEditItem
                }
                onDeleteItem={
                  handleDeleteItem
                }
              />
            )
          )}
        </div>
      </div>

      {/* ================================================== */}
      {/* CATEGORY MODAL */}
      {/* ================================================== */}

      <MenuCategoryModal
        open={showCategoryModal}
        mode={categoryModalMode}
        name={categoryName}
        description={categoryDescription}
        displayOrder={categoryDisplayOrder}
        error={categoryError}
        saving={savingCategory}
        onNameChange={
          setCategoryName
        }
        onDescriptionChange={
          setCategoryDescription
        }
        onDisplayOrderChange={
          setCategoryDisplayOrder
        }
        onSubmit={
          handleCategorySubmit
        }
        onClose={
          closeCategoryModal
        }
      />

      {/* ================================================== */}
      {/* DELETE CATEGORY */}
      {/* ================================================== */}

      <DeleteCategoryModal
        open={
          showDeleteCategoryModal
        }
        category={categoryToDelete}
        deleting={deletingCategory}
        onConfirm={
          handleDeleteCategory
        }
        onClose={
          closeDeleteCategory
        }
      />

      {/* ================================================== */}
      {/* MENU ITEM MODAL */}
      {/* ================================================== */}

      <MenuItemForm
        open={showItemModal}
        categories={menu.categories}
        name={itemName}
        description={itemDescription}
        category={itemCategory}
        priceRange={itemPriceRange}
        price={itemPrice}
        priceMin={itemPriceMin}
        priceMax={itemPriceMax}
        vegetarian={itemVegetarian}
        available={itemAvailable}
        displayOrder={itemDisplayOrder}
        image={itemImage}
        error={itemError}
        saving={savingItem}
        onNameChange={
          setItemName
        }
        onDescriptionChange={
          setItemDescription
        }
        onCategoryChange={
          setItemCategory
        }
        onPriceRangeChange={(
          enabled
        ) => {
          setItemPriceRange(
            enabled
          );

          if (enabled) {
            setItemPrice("");
          } else {
            setItemPriceMin("");
            setItemPriceMax("");
          }
        }}
        onPriceChange={
          setItemPrice
        }
        onPriceMinChange={
          setItemPriceMin
        }
        onPriceMaxChange={
          setItemPriceMax
        }
        onVegetarianChange={
          setItemVegetarian
        }
        onAvailableChange={
          setItemAvailable
        }
        onDisplayOrderChange={
          setItemDisplayOrder
        }
        onImageChange={
          setItemImage
        }
        onSubmit={
          itemModalMode === "edit"
            ? handleUpdateItem
            : handleAddItem
        }
        onClose={
          closeItemModal
        }
        submitLabel={
          itemModalMode === "edit"
            ? "Save Changes"
            : "Add Item"
        }
      />

      {/* ================================================== */}
      {/* VARIANT MODAL */}
      {/* ================================================== */}

      <MenuVariantForm
        open={showVariantModal}
        itemName={
          selectedItemForVariant?.name ||
          ""
        }
        name={variantName}
        priceRange={
          variantPriceRange
        }
        price={variantPrice}
        priceMin={variantPriceMin}
        priceMax={variantPriceMax}
        available={
          variantAvailable
        }
        displayOrder={
          variantDisplayOrder
        }
        image={variantImage}
        error={variantError}
        saving={savingVariant}
        onNameChange={
          setVariantName
        }
        onPriceRangeChange={(
          enabled
        ) => {
          setVariantPriceRange(
            enabled
          );

          if (enabled) {
            setVariantPrice("");
          } else {
            setVariantPriceMin("");
            setVariantPriceMax("");
          }
        }}
        onPriceChange={
          setVariantPrice
        }
        onPriceMinChange={
          setVariantPriceMin
        }
        onPriceMaxChange={
          setVariantPriceMax
        }
        onAvailableChange={
          setVariantAvailable
        }
        onDisplayOrderChange={
          setVariantDisplayOrder
        }
        onImageChange={
          setVariantImage
        }
        onSubmit={
          variantModalMode === "edit"
            ? handleUpdateVariant
            : handleAddVariant
        }
        onClose={
          closeVariantModal
        }
        submitLabel={
          variantModalMode === "edit"
            ? "Save Changes"
            : "Add Variant"
        }
      />
    </main>
  );
}