from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import RestaurantMembership


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        memberships = (
            RestaurantMembership.objects
            .select_related("restaurant")
            .filter(
                user=user,
                active=True,
                restaurant__active=True,
            )
            .order_by("restaurant__name")
        )

        restaurants = [
            {
                "id": membership.restaurant.id,
                "name": membership.restaurant.name,
                "slug": membership.restaurant.slug,
                "role": membership.role,
            }
            for membership in memberships
        ]

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "restaurants": restaurants,
        })