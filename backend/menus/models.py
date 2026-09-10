from django.core.exceptions import ValidationError
from django.db import models
import os


def menu_item_image_upload_path(instance, filename):
    return os.path.join(
        "menus",
        instance.category.restaurant.slug,
        "items",
        filename,
    )


def menu_variant_image_upload_path(instance, filename):
    return os.path.join(
        "menus",
        instance.item.category.restaurant.slug,
        "variants",
        filename,
    )


class MenuCategory(models.Model):
    restaurant = models.ForeignKey(
        "restaurants.Restaurant",
        on_delete=models.CASCADE,
        related_name="menu_categories",
    )

    name = models.CharField(
        max_length=100,
    )

    description = models.TextField(
        blank=True,
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
        ordering = ["display_order", "name"]

    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"


class MenuItem(models.Model):
    category = models.ForeignKey(
        MenuCategory,
        on_delete=models.CASCADE,
        related_name="items",
    )

    name = models.CharField(
        max_length=200,
    )

    description = models.TextField(
        blank=True,
    )

    image = models.ImageField(
        upload_to=menu_item_image_upload_path,
        blank=True,
        null=True,
    )

    # -----------------------------------------------------
    # PRICING
    # -----------------------------------------------------

    # False = one fixed price
    # True = price range
    price_range = models.BooleanField(
        default=False,
        help_text="Enable this if the price varies by size or weight.",
    )

    # Used when price_range = False
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Enter the fixed price.",
    )

    # Used when price_range = True
    price_min = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Enter the minimum price.",
    )

    price_max = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Enter the maximum price.",
    )

    # -----------------------------------------------------
    # OPTIONS
    # -----------------------------------------------------

    vegetarian = models.BooleanField(
        default=False,
    )

    available = models.BooleanField(
        default=True,
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["display_order", "name"]

    def clean(self):
        errors = {}

        if self.price_range:

            # Range pricing
            if self.price_min is None:
                errors["price_min"] = (
                    "Minimum price is required."
                )

            if self.price_max is None:
                errors["price_max"] = (
                    "Maximum price is required."
                )

            if (
                self.price_min is not None
                and self.price_max is not None
                and self.price_min > self.price_max
            ):
                errors["price_max"] = (
                    "Maximum price must be greater than or equal "
                    "to minimum price."
                )

            # Fixed price should be empty
            if self.price is not None:
                errors["price"] = (
                    "Leave fixed price empty when using a price range."
                )

        else:

            # Direct price is OPTIONAL.
            # The item may have variants that contain the prices.

            if self.price_min is not None:
                errors["price_min"] = (
                    "Leave minimum price empty when using a fixed price."
                )

            if self.price_max is not None:
                errors["price_max"] = (
                    "Leave maximum price empty when using a fixed price."
                )

        if errors:
            raise ValidationError(errors)

    def __str__(self):
        return self.name


class MenuItemVariant(models.Model):
    item = models.ForeignKey(
        MenuItem,
        on_delete=models.CASCADE,
        related_name="variants",
    )

    name = models.CharField(
        max_length=100,
        help_text=(
            "Example: Squid, Prawns, King Fish, "
            "Regular, Large"
        ),
    )

    # -----------------------------------------------------
    # IMAGE
    # -----------------------------------------------------

    image = models.ImageField(
        upload_to=menu_variant_image_upload_path,
        blank=True,
        null=True,
        help_text="Optional image for this variant.",
    )

    # -----------------------------------------------------
    # PRICING
    # -----------------------------------------------------

    # False = one fixed price
    # True = price range
    price_range = models.BooleanField(
        default=False,
        help_text="Enable this if the variant price varies by size or weight.",
    )

    # Used when price_range = False
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Enter the fixed price.",
    )

    # Used when price_range = True
    price_min = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Enter the minimum price.",
    )

    price_max = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Enter the maximum price.",
    )

    # -----------------------------------------------------
    # OPTIONS
    # -----------------------------------------------------

    available = models.BooleanField(
        default=True,
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["display_order", "name"]

    def clean(self):
        errors = {}

        if self.price_range:

            # Range pricing
            if self.price_min is None:
                errors["price_min"] = (
                    "Minimum price is required."
                )

            if self.price_max is None:
                errors["price_max"] = (
                    "Maximum price is required."
                )

            if (
                self.price_min is not None
                and self.price_max is not None
                and self.price_min > self.price_max
            ):
                errors["price_max"] = (
                    "Maximum price must be greater than or equal "
                    "to minimum price."
                )

            # Fixed price should be empty
            if self.price is not None:
                errors["price"] = (
                    "Leave fixed price empty when using a price range."
                )

        else:

            # Fixed pricing
            if self.price is None:
                errors["price"] = (
                    "Price is required."
                )

            # Range prices should be empty
            if self.price_min is not None:
                errors["price_min"] = (
                    "Leave minimum price empty when using a fixed price."
                )

            if self.price_max is not None:
                errors["price_max"] = (
                    "Leave maximum price empty when using a fixed price."
                )

        if errors:
            raise ValidationError(errors)

    def __str__(self):
        return f"{self.item.name} - {self.name}"