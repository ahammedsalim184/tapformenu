from django.db.models import Prefetch

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import RestaurantMembership
from accounts.permissions import IsRestaurantMember

from restaurants.models import Restaurant

from .models import (
    MenuCategory,
    MenuItem,
    MenuItemVariant,
)
from .serializers import (
    MenuCategorySerializer,
    MenuItemSerializer,
    MenuItemVariantSerializer,
    PublicMenuCategorySerializer,
)


def get_restaurant_membership(user, restaurant_slug):
    return (
        RestaurantMembership.objects
        .select_related("restaurant")
        .filter(
            user=user,
            restaurant__slug=restaurant_slug,
            restaurant__active=True,
            active=True,
        )
        .first()
    )


class MenuCategoryListCreateView(APIView):
    """
    GET  /api/menus/manage/<restaurant_slug>/categories/
    POST /api/menus/manage/<restaurant_slug>/categories/

    OWNER and STAFF can view/create categories
    for a specific restaurant.
    """

    permission_classes = [
        IsAuthenticated,
        IsRestaurantMember,
    ]

    def get(self, request, restaurant_slug):

        membership = get_restaurant_membership(
            request.user,
            restaurant_slug,
        )

        if not membership:
            return Response(
                {
                    "detail": "You do not have access to this restaurant."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        categories = (
            MenuCategory.objects
            .filter(
                restaurant=membership.restaurant,
            )
            .prefetch_related(
                "items",
                "items__variants",
            )
        )

        serializer = MenuCategorySerializer(
            categories,
            many=True,
        )

        return Response(serializer.data)

    def post(self, request, restaurant_slug):

        membership = get_restaurant_membership(
            request.user,
            restaurant_slug,
        )

        if not membership:
            return Response(
                {
                    "detail": "You do not have access to this restaurant."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = MenuCategorySerializer(
            data=request.data,
        )

        if serializer.is_valid():
            serializer.save(
                restaurant=membership.restaurant,
            )

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class MenuCategoryDetailView(APIView):
    """
    GET    /api/menus/manage/<restaurant_slug>/categories/<id>/
    PATCH  /api/menus/manage/<restaurant_slug>/categories/<id>/
    DELETE /api/menus/manage/<restaurant_slug>/categories/<id>/

    OWNER and STAFF can view/update/delete categories
    for a specific restaurant.
    """

    permission_classes = [
        IsAuthenticated,
        IsRestaurantMember,
    ]

    def get_category(
        self,
        request,
        restaurant_slug,
        category_id,
    ):

        membership = get_restaurant_membership(
            request.user,
            restaurant_slug,
        )

        if not membership:
            return None

        return (
            MenuCategory.objects
            .filter(
                id=category_id,
                restaurant=membership.restaurant,
            )
            .prefetch_related(
                "items",
                "items__variants",
            )
            .first()
        )

    def get(
        self,
        request,
        restaurant_slug,
        category_id,
    ):

        category = self.get_category(
            request,
            restaurant_slug,
            category_id,
        )

        if not category:
            return Response(
                {
                    "detail": "Menu category not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = MenuCategorySerializer(
            category,
        )

        return Response(serializer.data)

    def patch(
        self,
        request,
        restaurant_slug,
        category_id,
    ):

        category = self.get_category(
            request,
            restaurant_slug,
            category_id,
        )

        if not category:
            return Response(
                {
                    "detail": "Menu category not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = MenuCategorySerializer(
            category,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(
        self,
        request,
        restaurant_slug,
        category_id,
    ):

        category = self.get_category(
            request,
            restaurant_slug,
            category_id,
        )

        if not category:
            return Response(
                {
                    "detail": "Menu category not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        category.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )


class MenuItemListCreateView(APIView):
    """
    GET  /api/menus/items/
    POST /api/menus/items/

    OWNER and STAFF can view/create menu items.
    """

    permission_classes = [
        IsAuthenticated,
        IsRestaurantMember,
    ]

    def get(self, request):
        membership = (
            RestaurantMembership.objects
            .select_related("restaurant")
            .filter(
                user=request.user,
                active=True,
            )
            .first()
        )

        if not membership:
            return Response(
                {
                    "detail": (
                        "You are not a member of any restaurant."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        items = (
            MenuItem.objects
            .select_related("category")
            .prefetch_related("variants")
            .filter(
                category__restaurant=membership.restaurant,
            )
        )

        serializer = MenuItemSerializer(
            items,
            many=True,
        )

        return Response(serializer.data)

    def post(self, request):
        membership = (
            RestaurantMembership.objects
            .select_related("restaurant")
            .filter(
                user=request.user,
                active=True,
            )
            .first()
        )

        if not membership:
            return Response(
                {
                    "detail": (
                        "You are not a member of any restaurant."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        category_id = request.data.get("category")

        category = (
            MenuCategory.objects
            .filter(
                id=category_id,
                restaurant=membership.restaurant,
            )
            .first()
        )

        if not category:
            return Response(
                {
                    "category": (
                        "Invalid category for your restaurant."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = MenuItemSerializer(
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class MenuItemDetailView(APIView):
    """
    GET    /api/menus/items/<id>/
    PATCH  /api/menus/items/<id>/
    DELETE /api/menus/items/<id>/
    """

    permission_classes = [
        IsAuthenticated,
        IsRestaurantMember,
    ]

    def get_item(self, request, item_id):

        membership = (
            RestaurantMembership.objects
            .select_related("restaurant")
            .filter(
                user=request.user,
                active=True,
            )
            .first()
        )

        if not membership:
            return None

        return (
            MenuItem.objects
            .select_related("category")
            .prefetch_related("variants")
            .filter(
                id=item_id,
                category__restaurant=membership.restaurant,
            )
            .first()
        )

    def get(self, request, item_id):

        item = self.get_item(
            request,
            item_id,
        )

        if not item:
            return Response(
                {
                    "detail": "Menu item not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = MenuItemSerializer(
            item,
        )

        return Response(serializer.data)

    def patch(self, request, item_id):

        item = self.get_item(
            request,
            item_id,
        )

        if not item:
            return Response(
                {
                    "detail": "Menu item not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = MenuItemSerializer(
            item,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, item_id):

        item = self.get_item(
            request,
            item_id,
        )

        if not item:
            return Response(
                {
                    "detail": "Menu item not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        item.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )


class RestaurantMenuManagementView(APIView):
    """
    GET /api/menus/manage/<restaurant_slug>/

    Returns the complete menu for a restaurant that the
    authenticated user belongs to.

    Includes:
        Restaurant
        └── Categories
              └── Items
                    └── Variants
    """

    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request, restaurant_slug):

        restaurant = (
            Restaurant.objects
            .filter(
                slug=restaurant_slug,
                active=True,
            )
            .first()
        )

        if not restaurant:
            return Response(
                {
                    "detail": "Restaurant not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        membership = (
            RestaurantMembership.objects
            .filter(
                user=request.user,
                restaurant=restaurant,
                active=True,
            )
            .first()
        )

        if not membership:
            return Response(
                {
                    "detail": (
                        "You do not have access to this restaurant."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        categories = (
            MenuCategory.objects
            .filter(
                restaurant=restaurant,
            )
            .prefetch_related(
                Prefetch(
                    "items",
                    queryset=(
                        MenuItem.objects
                        .prefetch_related("variants")
                    ),
                )
            )
        )

        serializer = MenuCategorySerializer(
            categories,
            many=True,
        )

        return Response(
            {
                "restaurant": {
                    "id": restaurant.id,
                    "name": restaurant.name,
                    "slug": restaurant.slug,
                    "role": membership.role,
                    "menu_layout": restaurant.menu_layout,
                },
                "categories": serializer.data,
            }
        )


class MenuItemVariantListCreateView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsRestaurantMember,
    ]

    def get_item(
        self,
        request,
        restaurant_slug,
        item_id,
    ):
        membership = get_restaurant_membership(
            request.user,
            restaurant_slug,
        )

        if not membership:
            return None

        return (
            MenuItem.objects
            .select_related("category")
            .filter(
                id=item_id,
                category__restaurant=membership.restaurant,
            )
            .first()
        )

    def get(
        self,
        request,
        restaurant_slug,
        item_id,
    ):
        item = self.get_item(
            request,
            restaurant_slug,
            item_id,
        )

        if not item:
            return Response(
                {
                    "detail": (
                        "Menu item not found."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        variants = item.variants.all()

        serializer = MenuItemVariantSerializer(
            variants,
            many=True,
        )

        return Response(serializer.data)

    def post(
        self,
        request,
        restaurant_slug,
        item_id,
    ):
        item = self.get_item(
            request,
            restaurant_slug,
            item_id,
        )

        if not item:
            return Response(
                {
                    "detail": (
                        "Menu item not found."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = MenuItemVariantSerializer(
            data=request.data
        )

        if serializer.is_valid():
            variant = serializer.save(
                item=item
            )

            return Response(
                MenuItemVariantSerializer(
                    variant
                ).data,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )



class MenuItemVariantDetailView(APIView):
    """
    GET    /api/menus/manage/<restaurant_slug>/items/<item_id>/variants/<variant_id>/
    PATCH  /api/menus/manage/<restaurant_slug>/items/<item_id>/variants/<variant_id>/
    DELETE /api/menus/manage/<restaurant_slug>/items/<item_id>/variants/<variant_id>/

    OWNER and STAFF can view/update/delete variants
    belonging to a menu item in their restaurant.
    """

    permission_classes = [
        IsAuthenticated,
        IsRestaurantMember,
    ]

    def get_variant(
        self,
        request,
        restaurant_slug,
        item_id,
        variant_id,
    ):
        membership = get_restaurant_membership(
            request.user,
            restaurant_slug,
        )

        if not membership:
            return None

        return (
            MenuItemVariant.objects
            .select_related(
                "item",
                "item__category",
            )
            .filter(
                id=variant_id,
                item_id=item_id,
                item__category__restaurant=membership.restaurant,
            )
            .first()
        )

    def get(
        self,
        request,
        restaurant_slug,
        item_id,
        variant_id,
    ):
        variant = self.get_variant(
            request,
            restaurant_slug,
            item_id,
            variant_id,
        )

        if not variant:
            return Response(
                {
                    "detail": "Menu variant not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = MenuItemVariantSerializer(
            variant,
        )

        return Response(serializer.data)

    def patch(
        self,
        request,
        restaurant_slug,
        item_id,
        variant_id,
    ):
        variant = self.get_variant(
            request,
            restaurant_slug,
            item_id,
            variant_id,
        )

        if not variant:
            return Response(
                {
                    "detail": "Menu variant not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = MenuItemVariantSerializer(
            variant,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(
        self,
        request,
        restaurant_slug,
        item_id,
        variant_id,
    ):
        variant = self.get_variant(
            request,
            restaurant_slug,
            item_id,
            variant_id,
        )

        if not variant:
            return Response(
                {
                    "detail": "Menu variant not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        variant.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )


class PublicRestaurantMenuView(APIView):
    permission_classes = []

    def get(self, request, restaurant_slug):

        restaurant = (
            Restaurant.objects
            .filter(
                slug=restaurant_slug,
                active=True,
            )
            .first()
        )

        if not restaurant:
            return Response(
                {
                    "detail": "Restaurant not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        categories = (
            MenuCategory.objects
            .filter(
                restaurant=restaurant,
                active=True,
            )
            .prefetch_related(
                Prefetch(
                    "items",
                    queryset=(
                        MenuItem.objects
                        .filter(
                            available=True,
                        )
                        .prefetch_related(
                            Prefetch(
                                "variants",
                                queryset=(
                                    MenuItemVariant.objects
                                    .filter(
                                        available=True,
                                    )
                                ),
                            )
                        )
                    ),
                )
            )
        )

        signature_dishes = (
            restaurant.signature_dishes
            .filter(
                active=True,
            )
        )

        review_section = (
            getattr(
                restaurant,
                "review_section",
                None,
            )
        )

        review_data = None

        if review_section and review_section.active:
            review_data = {
                "description": review_section.description,

                "video_1": (
                    request.build_absolute_uri(
                        review_section.video_1.url
                    )
                    if review_section.video_1
                    else None
                ),

                "video_2": (
                    request.build_absolute_uri(
                        review_section.video_2.url
                    )
                    if review_section.video_2
                    else None
                ),

                "video_3": (
                    request.build_absolute_uri(
                        review_section.video_3.url
                    )
                    if review_section.video_3
                    else None
                ),

                "video_4": (
                    request.build_absolute_uri(
                        review_section.video_4.url
                    )
                    if review_section.video_4
                    else None
                ),
            }

        gallery_images = (
            restaurant.gallery_images
            .filter(
                active=True,
            )[:6]
        )

        menu_serializer = PublicMenuCategorySerializer(
            categories,
            many=True,
        )

        signature_dishes_data = [
            {
                "id": dish.id,
                "name": dish.name,
                "description": dish.description,
                "image": (
                    request.build_absolute_uri(
                        dish.image.url
                    )
                    if dish.image
                    else None
                ),
            }
            for dish in signature_dishes
        ]

        gallery_images_data = [
            {
                "id": gallery.id,
                "image": (
                    request.build_absolute_uri(
                        gallery.image.url
                    )
                    if gallery.image
                    else None
                ),
            }
            for gallery in gallery_images
        ]

        return Response(
            {
                "restaurant": {
                    "id": restaurant.id,
                    "name": restaurant.name,
                    "slug": restaurant.slug,
                    "description": restaurant.description,

                    "logo": (
                        request.build_absolute_uri(
                            restaurant.logo.url
                        )
                        if restaurant.logo
                        else None
                    ),

                    "cover_image": (
                        request.build_absolute_uri(
                            restaurant.cover_image.url
                        )
                        if restaurant.cover_image
                        else None
                    ),

                    "phone": restaurant.phone,
                    "email": restaurant.email,
                    "address": restaurant.address,
                    "google_maps_url": restaurant.google_maps_url,
                    "opening_hours": restaurant.opening_hours,
                    "google_url": restaurant.google_url,
                    "instagram_url": restaurant.instagram_url,
                    "whatsapp_url": restaurant.whatsapp_url,
                    "facebook_url": restaurant.facebook_url,

                    "speciality_title": (
                        restaurant.speciality_title
                    ),

                    "speciality_description": (
                        restaurant.speciality_description
                    ),

                    "menu_layout": restaurant.menu_layout,
                },

                "signature_dishes": signature_dishes_data,

                "review_section": review_data,

                "gallery_images": gallery_images_data,

                "categories": menu_serializer.data,
            }
        )