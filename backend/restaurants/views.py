from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import RestaurantMembership
from accounts.permissions import IsRestaurantMember, IsRestaurantOwner
from .models import Restaurant


class MyRestaurantView(APIView):
    permission_classes = [IsAuthenticated, IsRestaurantMember]

    def get(self, request):
        membership = (
            RestaurantMembership.objects
            .select_related("restaurant")
            .filter(
                user=request.user,
                active=True,
                restaurant__active=True,
            )
            .first()
        )

        if not membership:
            return Response(
                {
                    "detail": (
                        "You are not a member of any active restaurant."
                    )
                },
                status=403,
            )

        restaurant = membership.restaurant

        return Response({
            "id": restaurant.id,
            "name": restaurant.name,
            "slug": restaurant.slug,
            "description": restaurant.description,
            "phone": restaurant.phone,
            "email": restaurant.email,
            "address": restaurant.address,
            "opening_hours": restaurant.opening_hours,
            "active": restaurant.active,
            "menu_layout": restaurant.menu_layout,
            "menu_theme": restaurant.menu_theme,
            "role": membership.role,
        })


class RestaurantDetailView(APIView):
    permission_classes = [IsAuthenticated]

    ALLOWED_UPDATE_FIELDS = {
        "name",
        "description",
        "phone",
        "email",
        "address",
        "opening_hours",
        "menu_layout",
        "menu_theme",
    }

    def get_restaurant(self, request, restaurant_slug):
        """
        Return the restaurant and membership only if the
        authenticated user has an active membership.
        """

        restaurant = (
            Restaurant.objects
            .filter(
                slug=restaurant_slug,
                active=True,
            )
            .first()
        )

        if not restaurant:
            return None, Response(
                {
                    "detail": "Restaurant not found."
                },
                status=404,
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
            return None, Response(
                {
                    "detail": (
                        "You do not have access to this restaurant."
                    )
                },
                status=403,
            )

        return (restaurant, membership), None

    def serialize_restaurant(self, restaurant, membership):
        return {
            "id": restaurant.id,
            "name": restaurant.name,
            "slug": restaurant.slug,
            "description": restaurant.description,
            "phone": restaurant.phone,
            "email": restaurant.email,
            "address": restaurant.address,
            "opening_hours": restaurant.opening_hours,
            "active": restaurant.active,
            "menu_layout": restaurant.menu_layout,
            "menu_theme": restaurant.menu_theme,
            "role": membership.role,
        }

    def get(self, request, restaurant_slug):
        result, error_response = self.get_restaurant(
            request,
            restaurant_slug,
        )

        if error_response:
            return error_response

        restaurant, membership = result

        return Response(
            self.serialize_restaurant(
                restaurant,
                membership,
            )
        )

    def patch(self, request, restaurant_slug):
        result, error_response = self.get_restaurant(
            request,
            restaurant_slug,
        )

        if error_response:
            return error_response

        restaurant, membership = result

        received_fields = set(request.data.keys())

        invalid_fields = (
            received_fields
            - self.ALLOWED_UPDATE_FIELDS
        )

        if invalid_fields:
            return Response(
                {
                    "detail": (
                        "The following fields cannot be updated: "
                        + ", ".join(sorted(invalid_fields))
                    )
                },
                status=400,
            )

        if "menu_layout" in request.data:
            menu_layout = request.data["menu_layout"]

            valid_layouts = {
                choice[0]
                for choice in Restaurant.MenuLayout.choices
            }

            if menu_layout not in valid_layouts:
                return Response(
                    {
                        "menu_layout": [
                            (
                                "Invalid menu layout. "
                                "Choose one of: "
                                + ", ".join(
                                    sorted(valid_layouts)
                                )
                            )
                        ]
                    },
                    status=400,
                )

        if "menu_theme" in request.data:
            menu_theme = request.data["menu_theme"]

            valid_themes = {
                choice[0]
                for choice in Restaurant.MenuTheme.choices
            }

            if menu_theme not in valid_themes:
                return Response(
                    {
                        "menu_theme": [
                            (
                                "Invalid menu theme. "
                                "Choose one of: "
                                + ", ".join(
                                    sorted(valid_themes)
                                )
                            )
                        ]
                    },
                    status=400,
                )

        for field in self.ALLOWED_UPDATE_FIELDS:
            if field in request.data:
                setattr(
                    restaurant,
                    field,
                    request.data[field],
                )

        restaurant.save()

        return Response(
            self.serialize_restaurant(
                restaurant,
                membership,
            )
        )


class OwnerTestView(APIView):
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def get(self, request):
        return Response({
            "message": "Owner access granted."
        })