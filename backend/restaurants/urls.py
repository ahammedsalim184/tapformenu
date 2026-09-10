from django.urls import path

from .views import (
    MyRestaurantView,
    OwnerTestView,
    RestaurantDetailView,
)


urlpatterns = [

    path("me/", MyRestaurantView.as_view(), name="my-restaurant"),

    path(
        "<slug:restaurant_slug>/",
        RestaurantDetailView.as_view(),
        name="restaurant-detail",
    ),

    path("owner-test/", OwnerTestView.as_view(), name="owner-test"),

]