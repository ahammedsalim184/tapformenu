from rest_framework.permissions import BasePermission

from .models import RestaurantMembership


class IsRestaurantMember(BasePermission):
    """
    Allows access only to users who have an active
    restaurant membership.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        return RestaurantMembership.objects.filter(
            user=request.user,
            active=True,
        ).exists()


class IsRestaurantOwner(BasePermission):
    """
    Allows access only to active restaurant owners.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        return RestaurantMembership.objects.filter(
            user=request.user,
            role=RestaurantMembership.Role.OWNER,
            active=True,
        ).exists()


class IsRestaurantStaff(BasePermission):
    """
    Allows access only to active restaurant staff.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        return RestaurantMembership.objects.filter(
            user=request.user,
            role=RestaurantMembership.Role.STAFF,
            active=True,
        ).exists()