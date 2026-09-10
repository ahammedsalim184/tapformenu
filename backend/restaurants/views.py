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
                {"detail": "You are not a member of any active restaurant."},
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
            "role": membership.role,
        })


class RestaurantDetailView(APIView):
    permission_classes = [IsAuthenticated]

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
                {"detail": "Restaurant not found."},
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
            return Response(
                {"detail": "You do not have access to this restaurant."},
                status=403,
            )

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
            "role": membership.role,
        })


class OwnerTestView(APIView):
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def get(self, request):
        return Response({
            "message": "Owner access granted."
        })