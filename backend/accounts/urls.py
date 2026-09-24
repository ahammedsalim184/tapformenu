from django.urls import path

from .views import (
    AddStaffView,
    ChangePasswordView,
    MeView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    StaffDetailView,
    StaffListView,
)

urlpatterns = [
    path("me/", MeView.as_view(), name="me"),
    path("me", MeView.as_view(), name="me-no-slash"),

    path(
        "change-password/",
        ChangePasswordView.as_view(),
        name="change-password",
    ),
    path(
        "change-password",
        ChangePasswordView.as_view(),
        name="change-password-no-slash",
    ),

    path(
        "password-reset/",
        PasswordResetRequestView.as_view(),
        name="password-reset",
    ),
    path(
        "password-reset",
        PasswordResetRequestView.as_view(),
        name="password-reset-no-slash",
    ),

    path(
        "password-reset-confirm/",
        PasswordResetConfirmView.as_view(),
        name="password-reset-confirm",
    ),
    path(
        "password-reset-confirm",
        PasswordResetConfirmView.as_view(),
        name="password-reset-confirm-no-slash",
    ),

    path(
        "staff/",
        AddStaffView.as_view(),
        name="add-staff",
    ),
    path(
        "staff",
        AddStaffView.as_view(),
        name="add-staff-no-slash",
    ),

    path(
        "staff/list/",
        StaffListView.as_view(),
        name="staff-list",
    ),
    path(
        "staff/list",
        StaffListView.as_view(),
        name="staff-list-no-slash",
    ),

    path(
        "staff/<int:staff_id>/",
        StaffDetailView.as_view(),
        name="staff-detail",
    ),
    path(
        "staff/<int:staff_id>",
        StaffDetailView.as_view(),
        name="staff-detail-no-slash",
    ),
]