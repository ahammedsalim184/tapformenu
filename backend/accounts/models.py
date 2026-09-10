from django.contrib.auth.models import User
from django.db import models


class RestaurantMembership(models.Model):

    class Role(models.TextChoices):
        OWNER = "OWNER", "Restaurant Owner"
        STAFF = "STAFF", "Restaurant Staff"

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="restaurant_memberships",
    )

    restaurant = models.ForeignKey(
        "restaurants.Restaurant",
        on_delete=models.CASCADE,
        related_name="memberships",
    )

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
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
        constraints = [
            models.UniqueConstraint(
                fields=["user", "restaurant"],
                name="unique_user_restaurant_membership",
            )
        ]

    def __str__(self):
        return f"{self.user.username} - {self.restaurant.name} - {self.role}"


class RestaurantOwner(RestaurantMembership):
    class Meta:
        proxy = True
        verbose_name = "Restaurant Owner"
        verbose_name_plural = "Restaurant Owners"


class RestaurantStaff(RestaurantMembership):
    class Meta:
        proxy = True
        verbose_name = "Restaurant Staff"
        verbose_name_plural = "Restaurant Staff"