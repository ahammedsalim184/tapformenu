import os

from django.db import models


def restaurant_logo_upload_path(instance, filename):
    return os.path.join(
        "restaurants",
        instance.slug,
        "logo",
        filename,
    )


def restaurant_cover_upload_path(instance, filename):
    return os.path.join(
        "restaurants",
        instance.slug,
        "cover",
        filename,
    )


def signature_dish_upload_path(instance, filename):
    return os.path.join(
        "restaurants",
        instance.restaurant.slug,
        "signature-dishes",
        filename,
    )


def restaurant_gallery_upload_path(instance, filename):
    return os.path.join(
        "restaurants",
        instance.restaurant.slug,
        "gallery",
        filename,
    )


def review_video_upload_path(instance, filename):
    return os.path.join(
        "restaurants",
        instance.restaurant.slug,
        "reviews",
        filename,
    )


class Restaurant(models.Model):

    class MenuLayout(models.TextChoices):
        CLASSIC = "classic", "Classic"
        CARDS = "cards", "Cards"
        SHOWCASE = "showcase", "Showcase"

    class MenuTheme(models.TextChoices):
        CLASSIC = "classic", "Classic"
        DARK = "dark", "Dark"
        ELEGANT = "elegant", "Elegant"
        FRESH = "fresh", "Fresh"
        OCEAN = "ocean", "Ocean"
        MINIMAL = "minimal", "Minimal"

    name = models.CharField(
        max_length=200,
    )

    slug = models.SlugField(
        max_length=200,
        unique=True,
    )

    description = models.TextField(
        blank=True,
    )

    logo = models.ImageField(
        upload_to=restaurant_logo_upload_path,
        blank=True,
        null=True,
    )

    cover_image = models.ImageField(
        upload_to=restaurant_cover_upload_path,
        blank=True,
        null=True,
    )

    phone = models.CharField(
        max_length=30,
        blank=True,
    )

    email = models.EmailField(
        blank=True,
    )

    address = models.TextField(
        blank=True,
    )

    google_maps_url = models.URLField(
        blank=True,
    )

    google_url = models.URLField(
        blank=True,
    )

    instagram_url = models.URLField(
        blank=True,
    )

    whatsapp_url = models.URLField(
        blank=True,
    )

    facebook_url = models.URLField(
        blank=True,
    )

    opening_hours = models.TextField(
        blank=True,
    )

    speciality_title = models.CharField(
        max_length=200,
        blank=True,
    )

    speciality_description = models.TextField(
        blank=True,
    )

    menu_layout = models.CharField(
        max_length=20,
        choices=MenuLayout.choices,
        default=MenuLayout.CARDS,
    )

    menu_theme = models.CharField(
        max_length=20,
        choices=MenuTheme.choices,
        default=MenuTheme.CLASSIC,
    )

    active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.name


class SignatureDish(models.Model):
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        related_name="signature_dishes",
    )

    name = models.CharField(
        max_length=200,
    )

    description = models.TextField(
        blank=True,
    )

    image = models.ImageField(
        upload_to=signature_dish_upload_path,
        blank=True,
        null=True,
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = [
            "display_order",
            "id",
        ]

    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"


class RestaurantGallery(models.Model):
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        related_name="gallery_images",
    )

    image = models.ImageField(
        upload_to=restaurant_gallery_upload_path,
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    active = models.BooleanField(
        default=True,
    )

    class Meta:
        ordering = [
            "display_order",
            "id",
        ]

    def __str__(self):
        return f"{self.restaurant.name} - Gallery {self.display_order}"


class ReviewSection(models.Model):
    restaurant = models.OneToOneField(
        Restaurant,
        on_delete=models.CASCADE,
        related_name="review_section",
    )

    description = models.TextField(
        blank=True,
    )

    video_1 = models.FileField(
        upload_to=review_video_upload_path,
        blank=True,
        null=True,
    )

    video_2 = models.FileField(
        upload_to=review_video_upload_path,
        blank=True,
        null=True,
    )

    video_3 = models.FileField(
        upload_to=review_video_upload_path,
        blank=True,
        null=True,
    )

    video_4 = models.FileField(
        upload_to=review_video_upload_path,
        blank=True,
        null=True,
    )

    active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return f"{self.restaurant.name} - Review Section"