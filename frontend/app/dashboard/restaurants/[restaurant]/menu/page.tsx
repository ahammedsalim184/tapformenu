"use client";

import {
  FormEvent,
  TouchEvent,
  useEffect,
  useRef,
  useState,
} from "react";
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

import { apiFetch } from "@/lib/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api";

export default function RestaurantMenuPage() {
  const params = useParams();
  const router = useRouter();

  const restaurantSlug = params.restaurant as string;

  const [menu, setMenu] =
    useState<MenuResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [activeCategoryId, setActiveCategoryId] =
    useState<number | null>(null);

  const [slideDirection, setSlideDirection] =
    useState<"left" | "right">("left");

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isSwiping = useRef(false);

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

  const [
    showDeleteCategoryModal,
    setShowDeleteCategoryModal,
  ] = useState(false);

  const [categoryToDelete, setCategoryToDelete] =
    useState<MenuCategory | null>(null);

  const [deletingCategory, setDeletingCategory] =
    useState(false);

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

  const [itemDisplayOrder, setItemDisplayOrder] =
    useState("0");

  const [itemImage, setItemImage] =
    useState<File | null>(null);

  const [savingItem, setSavingItem] =
    useState(false);

  const [itemError, setItemError] =
    useState("");

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

  const [variantDisplayOrder, setVariantDisplayOrder] =
    useState("0");

  const [variantImage, setVariantImage] =
    useState<File | null>(null);

  const [savingVariant, setSavingVariant] =
    useState(false);

  const [variantError, setVariantError] =
    useState("");

  async function getResponseData(
    response: Response
  ) {
    const contentType =
      response.headers.get("content-type") || "";

    if (
      !contentType.includes("application/json")
    ) {
      await response.text();

      throw new Error(
        `Server returned an unexpected response (${response.status}).`
      );
    }

    return response.json();
  }

  async function loadMenu() {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch(
        `${API_BASE_URL}/menus/manage/${restaurantSlug}/`,
        {
          method: "GET",
        }
      );

      if (response.status === 403) {
        setError(
          "You do not have access to this restaurant."
        );
        return;
      }

      if (!response.ok) {
        let message =
          "Failed to load restaurant menu.";

        try {
          const data =
            await getResponseData(response);

          if (data?.detail) {
            message = data.detail;
          }
        } catch {
        }

        throw new Error(message);
      }

      const data: MenuResponse =
        await getResponseData(response);

      setMenu(data);
    } catch (err) {
      console.error(err);

      if (
        err instanceof Error &&
        (
          err.message ===
            "Not authenticated." ||
          err.message ===
            "Authentication failed."
        )
      ) {
        router.replace("/login");
        return;
      }

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

  useEffect(() => {
    if (
      menu?.categories.length &&
      activeCategoryId === null
    ) {
      setActiveCategoryId(
        menu.categories[0].id
      );
    }
  }, [menu, activeCategoryId]);

  function changeCategory(
    categoryId: number,
    direction: "left" | "right"
  ) {
    if (
      activeCategoryId === categoryId
    ) {
      return;
    }

    setSlideDirection(direction);
    setActiveCategoryId(categoryId);
  }

  function goToNextCategory() {
    if (!menu || !menu.categories.length) {
      return;
    }

    const currentIndex =
      menu.categories.findIndex(
        (category) =>
          category.id === activeCategoryId
      );

    if (currentIndex === -1) {
      setActiveCategoryId(
        menu.categories[0].id
      );
      return;
    }

    if (
      currentIndex <
      menu.categories.length - 1
    ) {
      changeCategory(
        menu.categories[currentIndex + 1].id,
        "left"
      );
    }
  }

  function goToPreviousCategory() {
    if (!menu || !menu.categories.length) {
      return;
    }

    const currentIndex =
      menu.categories.findIndex(
        (category) =>
          category.id === activeCategoryId
      );

    if (currentIndex === -1) {
      setActiveCategoryId(
        menu.categories[0].id
      );
      return;
    }

    if (currentIndex > 0) {
      changeCategory(
        menu.categories[currentIndex - 1].id,
        "right"
      );
    }
  }

  function handleCategoryTouchStart(
    event: TouchEvent<HTMLDivElement>
  ) {
    if (event.touches.length !== 1) {
      touchStartX.current = null;
      touchStartY.current = null;
      isSwiping.current = false;
      return;
    }

    touchStartX.current =
      event.touches[0].clientX;

    touchStartY.current =
      event.touches[0].clientY;

    isSwiping.current = false;
  }

  function handleCategoryTouchMove(
    event: TouchEvent<HTMLDivElement>
  ) {
    if (
      touchStartX.current === null ||
      touchStartY.current === null ||
      event.touches.length !== 1
    ) {
      return;
    }

    const currentX =
      event.touches[0].clientX;

    const currentY =
      event.touches[0].clientY;

    const deltaX =
      currentX - touchStartX.current;

    const deltaY =
      currentY - touchStartY.current;

    if (
      Math.abs(deltaX) > 12 &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {
      isSwiping.current = true;
    }
  }

  function handleCategoryTouchEnd(
    event: TouchEvent<HTMLDivElement>
  ) {
    if (
      touchStartX.current === null ||
      touchStartY.current === null
    ) {
      return;
    }

    const endX =
      event.changedTouches[0]?.clientX;

    const endY =
      event.changedTouches[0]?.clientY;

    if (
      endX === undefined ||
      endY === undefined
    ) {
      touchStartX.current = null;
      touchStartY.current = null;
      isSwiping.current = false;
      return;
    }

    const deltaX =
      endX - touchStartX.current;

    const deltaY =
      endY - touchStartY.current;

    const minimumSwipeDistance = 55;

    const isHorizontalSwipe =
      Math.abs(deltaX) >=
        minimumSwipeDistance &&
      Math.abs(deltaX) > Math.abs(deltaY);

    if (
      isHorizontalSwipe &&
      isSwiping.current
    ) {
      if (deltaX < 0) {
        goToNextCategory();
      } else {
        goToPreviousCategory();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    isSwiping.current = false;
  }

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
        response = await apiFetch(
          `${API_BASE_URL}/menus/manage/${restaurantSlug}/categories/${selectedCategory.id}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        response = await apiFetch(
          `${API_BASE_URL}/menus/manage/${restaurantSlug}/categories/`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      }

      const data =
        await getResponseData(response);

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

      if (
        err instanceof Error &&
        (
          err.message ===
            "Not authenticated." ||
          err.message ===
            "Authentication failed."
        )
      ) {
        router.replace("/login");
        return;
      }

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

    try {
      setDeletingCategory(true);

      const response = await apiFetch(
        `${API_BASE_URL}/menus/manage/${restaurantSlug}/categories/${categoryToDelete.id}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        let message =
          "Failed to delete category.";

        try {
          const data =
            await getResponseData(response);

          if (data?.detail) {
            message = data.detail;
          }
        } catch {
        }

        throw new Error(message);
      }

      setShowDeleteCategoryModal(false);

      if (
        activeCategoryId ===
        categoryToDelete.id
      ) {
        setActiveCategoryId(null);
      }

      setCategoryToDelete(null);

      await loadMenu();
    } catch (err) {
      console.error(err);

      if (
        err instanceof Error &&
        (
          err.message ===
            "Not authenticated." ||
          err.message ===
            "Authentication failed."
        )
      ) {
        router.replace("/login");
        return;
      }

      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete category."
      );
    } finally {
      setDeletingCategory(false);
    }
  }

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
    setItemDisplayOrder("0");

    setItemImage(null);
    setItemError("");
  }

  function openAddItem(
    categoryId?: number
  ) {
    setItemModalMode("add");
    setSelectedItem(null);

    resetItemForm(categoryId);

    setShowItemModal(true);
  }

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

    setItemDisplayOrder(
      String(item.display_order)
    );

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

  async function handleAddItem(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setItemError("");

    if (!validateItemForm()) {
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
      } else if (itemPrice.trim()) {
        formData.append(
          "price",
          itemPrice
        );
      }

      formData.append(
        "vegetarian",
        String(itemVegetarian)
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

      const response = await apiFetch(
        `${API_BASE_URL}/menus/items/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await getResponseData(response);

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

      if (
        err instanceof Error &&
        (
          err.message ===
            "Not authenticated." ||
          err.message ===
            "Authentication failed."
        )
      ) {
        router.replace("/login");
        return;
      }

      setItemError(
        err instanceof Error
          ? err.message
          : "Failed to add menu item."
      );
    } finally {
      setSavingItem(false);
    }
  }

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

      const response = await apiFetch(
        `${API_BASE_URL}/menus/items/${selectedItem.id}/`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const data =
        await getResponseData(response);

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

      if (
        err instanceof Error &&
        (
          err.message ===
            "Not authenticated." ||
          err.message ===
            "Authentication failed."
        )
      ) {
        router.replace("/login");
        return;
      }

      setItemError(
        err instanceof Error
          ? err.message
          : "Failed to update menu item."
      );
    } finally {
      setSavingItem(false);
    }
  }

  async function handleDeleteItem(
    item: MenuItem
  ) {
    const confirmed = window.confirm(
      `Delete "${item.name}"?\n\nThis will also delete all of its variants.\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await apiFetch(
        `${API_BASE_URL}/menus/items/${item.id}/`,
        {
          method: "DELETE",
        }
      );

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

      if (
        err instanceof Error &&
        (
          err.message ===
            "Not authenticated." ||
          err.message ===
            "Authentication failed."
        )
      ) {
        router.replace("/login");
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete menu item."
      );
    }
  }

  function resetVariantForm() {
    setVariantName("");
    setVariantPriceRange(false);
    setVariantPrice("");
    setVariantPriceMin("");
    setVariantPriceMax("");
    setVariantDisplayOrder("0");
    setVariantImage(null);
    setVariantError("");
  }

  function openAddVariant(
    item: MenuItem
  ) {
    setVariantModalMode("add");
    setSelectedVariant(null);

    resetVariantForm();

    setSelectedItemForVariant(item);
    setShowVariantModal(true);
  }

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

    setVariantDisplayOrder(
      String(variant.display_order)
    );

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

      const response = await apiFetch(
        `${API_BASE_URL}/menus/manage/${restaurantSlug}/items/${selectedItemForVariant.id}/variants/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await getResponseData(response);

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

      if (
        err instanceof Error &&
        (
          err.message ===
            "Not authenticated." ||
          err.message ===
            "Authentication failed."
        )
      ) {
        router.replace("/login");
        return;
      }

      setVariantError(
        err instanceof Error
          ? err.message
          : "Failed to add variant."
      );
    } finally {
      setSavingVariant(false);
    }
  }

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

      const response = await apiFetch(
        `${API_BASE_URL}/menus/manage/${restaurantSlug}/items/${selectedItemForVariant.id}/variants/${selectedVariant.id}/`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const data =
        await getResponseData(response);

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

      if (
        err instanceof Error &&
        (
          err.message ===
            "Not authenticated." ||
          err.message ===
            "Authentication failed."
        )
      ) {
        router.replace("/login");
        return;
      }

      setVariantError(
        err instanceof Error
          ? err.message
          : "Failed to update variant."
      );
    } finally {
      setSavingVariant(false);
    }
  }

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

    try {
      setError("");

      const response = await apiFetch(
        `${API_BASE_URL}/menus/manage/${restaurantSlug}/items/${item.id}/variants/${variant.id}/`,
        {
          method: "DELETE",
        }
      );

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

      if (
        err instanceof Error &&
        (
          err.message ===
            "Not authenticated." ||
          err.message ===
            "Authentication failed."
        )
      ) {
        router.replace("/login");
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete variant."
      );
    }
  }

  async function handleToggleItem(
    item: MenuItem
  ) {
    const newAvailable =
      !item.available;

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
                category.items.map(
                  (existingItem) => {
                    if (
                      existingItem.id !==
                      item.id
                    ) {
                      return existingItem;
                    }

                    return {
                      ...existingItem,
                      available:
                        newAvailable,
                    };
                  }
                ),
            })
          ),
      };
    });

    try {
      setError("");

      const response = await apiFetch(
        `${API_BASE_URL}/menus/items/${item.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            available:
              newAvailable,
          }),
        }
      );

      if (!response.ok) {
        const data =
          await response
            .json()
            .catch(() => ({}));

        throw new Error(
          data.detail ||
            "Failed to update item status."
        );
      }
    } catch (err) {
      console.error(err);

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
                  category.items.map(
                    (existingItem) => {
                      if (
                        existingItem.id !==
                        item.id
                      ) {
                        return existingItem;
                      }

                      return {
                        ...existingItem,
                        available:
                          item.available,
                      };
                    }
                  ),
              })
            ),
        };
      });

      if (
        err instanceof Error &&
        (
          err.message ===
            "Not authenticated." ||
          err.message ===
            "Authentication failed."
        )
      ) {
        router.replace("/login");
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update item status."
      );
    }
  }

  async function handleToggleVariant(
    item: MenuItem,
    variant: MenuVariant
  ) {
    const newAvailable =
      !variant.available;

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
                category.items.map(
                  (existingItem) => {
                    if (
                      existingItem.id !==
                      item.id
                    ) {
                      return existingItem;
                    }

                    return {
                      ...existingItem,
                      variants:
                        existingItem.variants.map(
                          (
                            existingVariant
                          ) => {
                            if (
                              existingVariant.id !==
                              variant.id
                            ) {
                              return existingVariant;
                            }

                            return {
                              ...existingVariant,
                              available:
                                newAvailable,
                            };
                          }
                        ),
                    };
                  }
                ),
            })
          ),
      };
    });

    try {
      setError("");

      const response = await apiFetch(
        `${API_BASE_URL}/menus/manage/${restaurantSlug}/items/${item.id}/variants/${variant.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            available:
              newAvailable,
          }),
        }
      );

      if (!response.ok) {
        const data =
          await response
            .json()
            .catch(() => ({}));

        throw new Error(
          data.detail ||
            "Failed to update variant status."
        );
      }
    } catch (err) {
      console.error(err);

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
                  category.items.map(
                    (existingItem) => {
                      if (
                        existingItem.id !==
                        item.id
                      ) {
                        return existingItem;
                      }

                      return {
                        ...existingItem,
                        variants:
                          existingItem.variants.map(
                            (
                              existingVariant
                            ) => {
                              if (
                                existingVariant.id !==
                                variant.id
                              ) {
                                return existingVariant;
                              }

                              return {
                                ...existingVariant,
                                available:
                                  variant.available,
                              };
                            }
                          ),
                      };
                    }
                  ),
              })
            ),
        };
      });

      if (
        err instanceof Error &&
        (
          err.message ===
            "Not authenticated." ||
          err.message ===
            "Authentication failed."
        )
      ) {
        router.replace("/login");
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update variant status."
      );
    }
  }

  if (loading) {
    return (
      <main className="min-h-[100dvh] overflow-x-hidden bg-[#f6f6f3]">
        <div className="mx-auto w-full max-w-xl px-3 pb-8 pt-3 sm:max-w-5xl sm:px-6 sm:pb-10 sm:pt-7">
          <div className="animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gray-200" />

              <div className="h-5 w-20 rounded-lg bg-gray-200" />
            </div>

            <div className="mt-7 h-8 w-36 rounded-lg bg-gray-200" />

            <div className="mt-2 h-4 w-60 rounded bg-gray-200" />

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <div className="h-20 rounded-2xl bg-white" />
              <div className="h-20 rounded-2xl bg-white" />
            </div>

            <div className="mt-3 h-24 rounded-2xl bg-white" />

            <div className="mt-4 h-11 rounded-2xl bg-white" />

            <div className="mt-4 h-64 rounded-3xl bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[100dvh] overflow-x-hidden bg-[#f6f6f3]">
        <div className="mx-auto flex min-h-[100dvh] w-full max-w-xl items-center px-3">
          <div className="w-full rounded-[26px] border border-red-100 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.05)] sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-lg font-semibold text-red-500">
              !
            </div>

            <h1 className="mt-4 text-lg font-semibold tracking-tight text-gray-950 sm:text-xl">
              Something went wrong
            </h1>

            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={loadMenu}
              className="
                mt-5
                flex
                min-h-12
                w-full
                items-center
                justify-center
                rounded-2xl
                bg-gray-950
                px-5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-gray-800
                active:scale-[0.98]
              "
            >
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!menu) {
    return null;
  }

  const totalItems =
    menu.categories.reduce(
      (total, category) =>
        total + category.items.length,
      0
    );

  const activeCategory =
    menu.categories.find(
      (category) =>
        category.id === activeCategoryId
    );

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-[#f6f6f3] pb-24 sm:pb-10">
      <div className="mx-auto w-full max-w-xl min-w-0 px-3 sm:max-w-5xl sm:px-6 lg:px-8">

        {/* APP HEADER */}
        <header className="sticky top-0 z-40 -mx-3 border-b border-gray-200/70 bg-[#f6f6f3]/95 px-3 py-2.5 backdrop-blur-xl sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-7 sm:backdrop-blur-none">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/restaurants/${restaurantSlug}`
                )
              }
              aria-label="Back to restaurant"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-2xl
                text-lg
                text-gray-600
                transition
                hover:bg-white
                hover:text-gray-950
                active:scale-[0.95]
              "
            >
              ←
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                Restaurant
              </p>

              <h1 className="truncate text-[16px] font-semibold tracking-tight text-gray-950 sm:text-2xl">
                Menu
              </h1>
            </div>

            <div className="hidden shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1.5 sm:block">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                Manage
              </span>
            </div>
          </div>
        </header>

        {/* STATS */}
        <section className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-6 sm:max-w-xl sm:gap-3">
          <div className="rounded-[20px] border border-gray-200/80 bg-white p-3.5 shadow-[0_3px_18px_rgba(0,0,0,0.03)] sm:rounded-[22px] sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400">
                Categories
              </p>
            </div>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">
              {menu.categories.length}
            </p>
          </div>

          <div className="rounded-[20px] border border-gray-200/80 bg-white p-3.5 shadow-[0_3px_18px_rgba(0,0,0,0.03)] sm:rounded-[22px] sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400">
                Items
              </p>
            </div>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">
              {totalItems}
            </p>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="mt-3 rounded-[22px] border border-gray-200/80 bg-white p-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] sm:mt-6 sm:rounded-[26px] sm:p-5">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-[14px] font-semibold text-gray-950 sm:text-[15px]">
                Manage menu
              </h2>

              <p className="mt-0.5 text-[11px] leading-5 text-gray-500 sm:mt-1 sm:text-sm">
                Add and organize your menu.
              </p>
            </div>

            <div className="hidden shrink-0 gap-2 sm:flex">
              <button
                type="button"
                onClick={openAddCategory}
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  text-sm
                  font-semibold
                  text-gray-900
                  transition
                  hover:bg-gray-100
                  active:scale-[0.97]
                "
              >
                <span className="mr-1 text-base">
                  +
                </span>

                Category
              </button>

              <button
                type="button"
                onClick={() =>
                  openAddItem()
                }
                disabled={
                  menu.categories.length === 0
                }
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gray-950
                  px-4
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-gray-800
                  active:scale-[0.97]
                  disabled:cursor-not-allowed
                  disabled:bg-gray-200
                  disabled:text-gray-400
                "
              >
                <span className="mr-1 text-base">
                  +
                </span>

                Item
              </button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
            <button
              type="button"
              onClick={openAddCategory}
              className="
                flex
                h-11
                items-center
                justify-center
                rounded-2xl
                border
                border-gray-200
                bg-gray-50
                text-xs
                font-semibold
                text-gray-800
                transition
                active:scale-[0.97]
              "
            >
              <span className="mr-1 text-base">
                +
              </span>

              Category
            </button>

            <button
              type="button"
              onClick={() =>
                openAddItem()
              }
              disabled={
                menu.categories.length === 0
              }
              className="
                flex
                h-11
                items-center
                justify-center
                rounded-2xl
                bg-gray-950
                text-xs
                font-semibold
                text-white
                transition
                active:scale-[0.97]
                disabled:cursor-not-allowed
                disabled:bg-gray-200
                disabled:text-gray-400
              "
            >
              <span className="mr-1 text-base">
                +
              </span>

              Item
            </button>
          </div>
        </section>

        {/* EMPTY STATE */}
        {menu.categories.length === 0 && (
          <section className="mt-3 overflow-hidden rounded-[24px] border border-dashed border-gray-300 bg-white sm:mt-5 sm:rounded-[28px]">
            <div className="px-4 py-10 text-center sm:px-10 sm:py-16">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[18px] bg-gray-950 text-lg text-white shadow-lg sm:h-14 sm:w-14 sm:rounded-[20px]">
                +
              </div>

              <h2 className="mt-4 text-lg font-semibold tracking-tight text-gray-950 sm:mt-5 sm:text-xl">
                Start your menu
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">
                Create your first category, such as
                Starters, Main Course or Drinks.
              </p>

              <button
                type="button"
                onClick={openAddCategory}
                className="
                  mt-5
                  w-full
                  max-w-xs
                  rounded-2xl
                  bg-gray-950
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-gray-800
                  active:scale-[0.98]
                "
              >
                Create first category
              </button>
            </div>
          </section>
        )}

        {/* MENU */}
        {menu.categories.length > 0 && (
          <section className="mt-4 min-w-0 sm:mt-7">

            {/* CATEGORY NAV */}
            <div
              className="
                sticky
                top-[61px]
                z-30
                -mx-3
                border-y
                border-gray-200/70
                bg-[#f6f6f3]/95
                backdrop-blur-xl
                sm:static
                sm:mx-0
                sm:border-y-0
                sm:bg-transparent
                sm:backdrop-blur-none
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  gap-1.5
                  overflow-x-auto
                  overscroll-x-contain
                  px-3
                  py-2
                  scrollbar-none
                  sm:gap-3
                  sm:px-0
                  sm:py-2
                "
              >
                {menu.categories.map(
                  (category) => {
                    const isActive =
                      activeCategoryId ===
                      category.id;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() =>
                          changeCategory(
                            category.id,
                            "left"
                          )
                        }
                        className={`
                          flex
                          shrink-0
                          items-center
                          rounded-full
                          px-3
                          py-2
                          text-[11px]
                          font-semibold
                          transition
                          active:scale-[0.97]
                          sm:px-4
                          sm:py-2.5
                          sm:text-sm
                          ${
                            isActive
                              ? "bg-gray-950 text-white shadow-sm"
                              : "bg-white text-gray-500 ring-1 ring-gray-200/80 hover:text-gray-900"
                          }
                        `}
                      >
                        <span className="max-w-[150px] truncate sm:max-w-none">
                          {category.name}
                        </span>

                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* ACTIVE CATEGORY HEADER */}
            {activeCategory && (
              <div className="mt-4 flex min-w-0 items-end justify-between gap-3 sm:mt-7">
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <h2 className="min-w-0 truncate text-[19px] font-semibold tracking-[-0.03em] text-gray-950 sm:text-2xl">
                      {activeCategory.name}
                    </h2>
                  </div>

                  {activeCategory.description && (
                    <p className="mt-1 max-w-xl truncate text-[11px] leading-5 text-gray-500 sm:mt-1.5 sm:text-sm">
                      {activeCategory.description}
                    </p>
                  )}
                </div>

                <div className="hidden shrink-0 sm:block">
                  <button
                    type="button"
                    onClick={() =>
                      openAddItem(
                        activeCategory.id
                      )
                    }
                    className="
                      rounded-2xl
                      bg-gray-950
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-gray-800
                      active:scale-[0.98]
                    "
                  >
                    + Add item
                  </button>
                </div>
              </div>
            )}

            {/* CATEGORY CONTENT */}
            <div
              className="
                relative
                mt-3
                min-w-0
                overflow-hidden
                touch-pan-y
                sm:mt-5
              "
              onTouchStart={
                handleCategoryTouchStart
              }
              onTouchMove={
                handleCategoryTouchMove
              }
              onTouchEnd={
                handleCategoryTouchEnd
              }
            >
              <div
                key={activeCategoryId}
                className={
                  slideDirection === "left"
                    ? "animate-[categorySlideInLeft_280ms_ease-out]"
                    : "animate-[categorySlideInRight_280ms_ease-out]"
                }
              >
                {menu.categories
                  .filter(
                    (category) =>
                      activeCategoryId ===
                      category.id
                  )
                  .map((category) => (
                    <div
                      key={category.id}
                      className="min-w-0 rounded-[24px] sm:rounded-[30px]"
                    >
                      <MenuCategorySection
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
                        onToggleVariant={
                          handleToggleVariant
                        }
                        onEditItem={
                          openEditItem
                        }
                        onDeleteItem={
                          handleDeleteItem
                        }
                        onToggleItem={
                          handleToggleItem
                        }
                      />
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <div className="mt-8 hidden border-t border-gray-200 py-6 sm:block">
          <p className="text-center text-xs text-gray-400">
            Changes are saved directly to your restaurant menu.
          </p>
        </div>
      </div>

      {/* MOBILE BOTTOM ACTION BAR */}
      {menu.categories.length > 0 && (
        <div
          className="
            fixed
            inset-x-0
            bottom-0
            z-40
            border-t
            border-gray-200/80
            bg-white/95
            px-3
            pt-2
            shadow-[0_-8px_30px_rgba(0,0,0,0.06)]
            backdrop-blur-xl
            sm:hidden
          "
          style={{
            paddingBottom:
              "max(0.6rem, env(safe-area-inset-bottom))",
          }}
        >
          <div className="mx-auto flex w-full max-w-xl gap-2">
            <button
              type="button"
              onClick={openAddCategory}
              className="
                flex
                h-11
                flex-1
                items-center
                justify-center
                rounded-2xl
                border
                border-gray-200
                bg-gray-50
                text-xs
                font-semibold
                text-gray-800
                transition
                active:scale-[0.97]
              "
            >
              <span className="mr-1 text-base">
                +
              </span>

              Category
            </button>

            <button
              type="button"
              onClick={() =>
                openAddItem(
                  activeCategory?.id
                )
              }
              disabled={!activeCategory}
              className="
                flex
                h-11
                flex-[1.25]
                items-center
                justify-center
                rounded-2xl
                bg-gray-950
                text-xs
                font-semibold
                text-white
                transition
                active:scale-[0.97]
                disabled:cursor-not-allowed
                disabled:bg-gray-200
                disabled:text-gray-400
              "
            >
              <span className="mr-1 text-base">
                +
              </span>

              Add item
            </button>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
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

      {/* DELETE CATEGORY MODAL */}
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

      {/* ITEM FORM */}
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

      {/* VARIANT FORM */}
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