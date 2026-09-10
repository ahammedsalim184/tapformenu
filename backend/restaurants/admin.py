from django.contrib import admin

from .models import (
    Restaurant,
    SignatureDish,
    RestaurantGallery,
    ReviewSection,
)


class SignatureDishInline(admin.TabularInline):
    model = SignatureDish

    extra = 1

    fields = (
        "name",
        "description",
        "image",
        "display_order",
        "active",
    )

    ordering = (
        "display_order",
        "id",
    )


class RestaurantGalleryInline(admin.TabularInline):
    model = RestaurantGallery

    extra = 1

    fields = (
        "image",
        "display_order",
        "active",
    )

    ordering = (
        "display_order",
        "id",
    )


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "slug",
        "menu_layout",
        "active",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "menu_layout",
        "active",
        "created_at",
    )

    search_fields = (
        "name",
        "slug",
        "email",
        "phone",
        "address",
    )

    prepopulated_fields = {
        "slug": ("name",),
    }

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Restaurant Information",
            {
                "fields": (
                    "name",
                    "slug",
                    "description",
                    "logo",
                    "cover_image",
                )
            },
        ),
        (
            "Contact & Location",
            {
                "fields": (
                    "phone",
                    "email",
                    "address",
                    "google_maps_url",
                    "opening_hours",
                )
            },
        ),
        (
            "Social Media",
            {
                "fields": (
                    "google_url",
                    "instagram_url",
                    "whatsapp_url",
                    "facebook_url",
                )
            },
        ),
        (
            "Home Page",
            {
                "fields": (
                    "speciality_title",
                    "speciality_description",
                ),
                "description": (
                    "Content displayed in the restaurant "
                    "home page speciality section."
                ),
            },
        ),
        (
            "Menu",
            {
                "fields": (
                    "menu_layout",
                )
            },
        ),
        (
            "Status",
            {
                "fields": (
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
        SignatureDishInline,
        RestaurantGalleryInline,
    ]


@admin.register(SignatureDish)
class SignatureDishAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "restaurant",
        "display_order",
        "active",
        "created_at",
    )

    list_filter = (
        "active",
        "restaurant",
    )

    search_fields = (
        "name",
        "description",
        "restaurant__name",
    )

    ordering = (
        "restaurant",
        "display_order",
        "id",
    )


@admin.register(RestaurantGallery)
class RestaurantGalleryAdmin(admin.ModelAdmin):

    list_display = (
        "restaurant",
        "display_order",
        "active",
    )

    list_filter = (
        "active",
        "restaurant",
    )

    search_fields = (
        "restaurant__name",
    )

    ordering = (
        "restaurant",
        "display_order",
        "id",
    )


@admin.register(ReviewSection)
class ReviewSectionAdmin(admin.ModelAdmin):

    list_display = (
        "restaurant",
        "active",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "active",
        "restaurant",
    )

    search_fields = (
        "restaurant__name",
        "description",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Review Section",
            {
                "fields": (
                    "restaurant",
                    "description",
                    "video_1",
                    "video_2",
                    "video_3",
                    "video_4",
                    "active",
                ),
            },
        ),
        (
            "Timestamps",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                ),
            },
        ),
    )