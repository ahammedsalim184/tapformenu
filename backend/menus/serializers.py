from rest_framework import serializers

from .models import MenuCategory, MenuItem, MenuItemVariant


class MenuItemVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItemVariant
        fields = (
            "id",
            "item",
            "name",
            "image",
            "price_range",
            "price",
            "price_min",
            "price_max",
            "available",
            "display_order",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "item",
            "created_at",
            "updated_at",
        )

    def validate(self, attrs):
        price_range = attrs.get(
            "price_range",
            getattr(self.instance, "price_range", False),
        )

        price = attrs.get(
            "price",
            getattr(self.instance, "price", None),
        )

        price_min = attrs.get(
            "price_min",
            getattr(self.instance, "price_min", None),
        )

        price_max = attrs.get(
            "price_max",
            getattr(self.instance, "price_max", None),
        )

        errors = {}

        if price_range:
            if price_min is None:
                errors["price_min"] = (
                    "Minimum price is required."
                )

            if price_max is None:
                errors["price_max"] = (
                    "Maximum price is required."
                )

            if (
                price_min is not None
                and price_max is not None
                and price_min > price_max
            ):
                errors["price_max"] = (
                    "Maximum price must be greater than "
                    "or equal to minimum price."
                )

            if price is not None:
                errors["price"] = (
                    "Leave fixed price empty when using "
                    "a price range."
                )

        else:
            if price is None:
                errors["price"] = (
                    "Price is required."
                )

            if price_min is not None:
                errors["price_min"] = (
                    "Leave minimum price empty when "
                    "using a fixed price."
                )

            if price_max is not None:
                errors["price_max"] = (
                    "Leave maximum price empty when "
                    "using a fixed price."
                )

        if errors:
            raise serializers.ValidationError(errors)

        return attrs


class MenuItemSerializer(serializers.ModelSerializer):
    variants = MenuItemVariantSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = MenuItem
        fields = (
            "id",
            "category",
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
            "variants",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )


class MenuCategorySerializer(serializers.ModelSerializer):
    items = MenuItemSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = MenuCategory
        fields = (
            "id",
            "restaurant",
            "name",
            "description",
            "display_order",
            "active",
            "items",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "restaurant",
            "created_at",
            "updated_at",
        )


# ---------------------------------------------------------
# PUBLIC MENU SERIALIZERS
# ---------------------------------------------------------

class PublicMenuItemVariantSerializer(
    serializers.ModelSerializer
):
    image = serializers.SerializerMethodField()

    class Meta:
        model = MenuItemVariant
        fields = (
            "id",
            "name",
            "image",
            "price_range",
            "price",
            "price_min",
            "price_max",
        )

    def get_image(self, obj):
        if not obj.image:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(
                obj.image.url
            )

        return obj.image.url


class PublicMenuItemSerializer(
    serializers.ModelSerializer
):
    image = serializers.SerializerMethodField()

    variants = PublicMenuItemVariantSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = MenuItem
        fields = (
            "id",
            "name",
            "description",
            "image",
            "price_range",
            "price",
            "price_min",
            "price_max",
            "vegetarian",
            "available",
            "variants",
        )

    def get_image(self, obj):
        if not obj.image:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(
                obj.image.url
            )

        return obj.image.url


class PublicMenuCategorySerializer(
    serializers.ModelSerializer
):
    items = PublicMenuItemSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = MenuCategory
        fields = (
            "id",
            "name",
            "description",
            "items",
        )