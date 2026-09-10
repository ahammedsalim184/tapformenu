from django.urls import path

from .views import (
    MenuCategoryListCreateView,
    MenuCategoryDetailView,
    MenuItemListCreateView,
    MenuItemDetailView,
    MenuItemVariantListCreateView,
    MenuItemVariantDetailView,
    RestaurantMenuManagementView,
    PublicRestaurantMenuView,
)


urlpatterns = [
    path(
        "manage/<slug:restaurant_slug>/",
        RestaurantMenuManagementView.as_view(),
        name="restaurant-menu-management",
    ),

    path(
        "manage/<slug:restaurant_slug>/categories/",
        MenuCategoryListCreateView.as_view(),
        name="restaurant-category-list-create",
    ),

    path(
        "manage/<slug:restaurant_slug>/categories/<int:category_id>/",
        MenuCategoryDetailView.as_view(),
        name="restaurant-category-detail",
    ),

    # List/Create variants
    path(
        "manage/<slug:restaurant_slug>/items/<int:item_id>/variants/",
        MenuItemVariantListCreateView.as_view(),
        name="restaurant-item-variant-list-create",
    ),

    # Get/Edit/Delete individual variant
    path(
        "manage/<slug:restaurant_slug>/items/<int:item_id>/variants/<int:variant_id>/",
        MenuItemVariantDetailView.as_view(),
        name="restaurant-item-variant-detail",
    ),

    # List/Create items
    path(
        "items/",
        MenuItemListCreateView.as_view(),
        name="menu-item-list-create",
    ),

    # Get/Edit/Delete individual item
    path(
        "items/<int:item_id>/",
        MenuItemDetailView.as_view(),
        name="menu-item-detail",
    ),

    # Public menu
    path(
        "public/<slug:restaurant_slug>/",
        PublicRestaurantMenuView.as_view(),
        name="public-restaurant-menu",
    ),
]