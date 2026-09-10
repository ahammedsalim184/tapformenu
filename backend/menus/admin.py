from django.contrib import admin

from .models import MenuCategory, MenuItem, MenuItemVariant


# =========================================================
# MENU ITEM VARIANT INLINE
# =========================================================

class MenuItemVariantInline(admin.TabularInline):
    model = MenuItemVariant
    extra = 1

    fields = (
        "name",
        "image",
        "price_range",
        "price",
        "price_min",
        "price_max",
        "available",
        "display_order",
    )

    ordering = (
        "display_order",
        "name",
    )

    show_change_link = True


# =========================================================
# MENU ITEM INLINE
# =========================================================

class MenuItemInline(admin.StackedInline):
    model = MenuItem
    extra = 0

    fields = (
        "name",
        "description",
        "image",
        "price_range",
        "price",
        "price_min",
        "price_max",
        "vegetarian",
        "available",
        "display_order",
    )

    ordering = (
        "display_order",
        "name",
    )

    show_change_link = True


# =========================================================
# MENU CATEGORY ADMIN
# =========================================================

@admin.register(MenuCategory)
class MenuCategoryAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "restaurant",
        "display_order",
        "active",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "restaurant",
        "active",
        "created_at",
    )

    search_fields = (
        "name",
        "description",
        "restaurant__name",
        "restaurant__slug",
    )

    ordering = (
        "restaurant",
        "display_order",
        "name",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Category",
            {
                "fields": (
                    "restaurant",
                    "name",
                    "description",
                )
            },
        ),
        (
            "Display",
            {
                "fields": (
                    "display_order",
                    "active",
                )
            },
        ),
        (
            "Timestamps",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    inlines = [
        MenuItemInline,
    ]


# =========================================================
# MENU ITEM ADMIN
# =========================================================

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "category",
        "get_restaurant",
        "get_price_display",
        "vegetarian",
        "available",
        "display_order",
    )

    list_filter = (
        "category__restaurant",
        "category",
        "price_range",
        "vegetarian",
        "available",
    )

    search_fields = (
        "name",
        "description",
        "category__name",
        "category__restaurant__name",
    )

    ordering = (
        "category",
        "display_order",
        "name",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Menu Item",
            {
                "fields": (
                    "category",
                    "name",
                    "description",
                    "image",
                )
            },
        ),
        (
            "Pricing",
            {
                "fields": (
                    "price_range",
                    "price",
                    "price_min",
                    "price_max",
                )
            },
        ),
        (
            "Options",
            {
                "fields": (
                    "vegetarian",
                    "available",
                    "display_order",
                )
            },
        ),
        (
            "Timestamps",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    inlines = [
        MenuItemVariantInline,
    ]

    @admin.display(
        description="Restaurant",
        ordering="category__restaurant__name",
    )
    def get_restaurant(self, obj):
        return obj.category.restaurant

    @admin.display(
        description="Price",
    )
    def get_price_display(self, obj):

        if obj.price_range:

            if (
                obj.price_min is not None
                and obj.price_max is not None
            ):
                return f"₹{obj.price_min} - ₹{obj.price_max}"

            return "Range not set"

        if obj.price is not None:
            return f"₹{obj.price}"

        return "Price not set"


# =========================================================
# MENU ITEM VARIANT ADMIN
# =========================================================

@admin.register(MenuItemVariant)
class MenuItemVariantAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "item",
        "get_category",
        "get_restaurant",
        "get_price_display",
        "available",
        "display_order",
    )

    list_filter = (
        "price_range",
        "available",
        "item__category__restaurant",
        "item__category",
    )

    search_fields = (
        "name",
        "item__name",
        "item__category__name",
        "item__category__restaurant__name",
    )

    ordering = (
        "item",
        "display_order",
        "name",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Variant",
            {
                "fields": (
                    "item",
                    "name",
                    "image",
                )
            },
        ),
        (
            "Pricing",
            {
                "fields": (
                    "price_range",
                    "price",
                    "price_min",
                    "price_max",
                )
            },
        ),
        (
            "Options",
            {
                "fields": (
                    "available",
                    "display_order",
                )
            },
        ),
        (
            "Timestamps",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    @admin.display(
        description="Category",
        ordering="item__category__name",
    )
    def get_category(self, obj):
        return obj.item.category

    @admin.display(
        description="Restaurant",
        ordering="item__category__restaurant__name",
    )
    def get_restaurant(self, obj):
        return obj.item.category.restaurant

    @admin.display(
        description="Price",
    )
    def get_price_display(self, obj):

        if obj.price_range:

            if (
                obj.price_min is not None
                and obj.price_max is not None
            ):
                return f"₹{obj.price_min} - ₹{obj.price_max}"

            return "Range not set"

        if obj.price is not None:
            return f"₹{obj.price}"

        return "Price not set"