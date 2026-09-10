from django import forms
from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

from .models import (
    RestaurantMembership,
    RestaurantOwner,
    RestaurantStaff,
)


class RestaurantMembershipForm(forms.ModelForm):
    username = forms.CharField(max_length=150)
    email = forms.EmailField(required=False)

    password1 = forms.CharField(
        label="Password",
        widget=forms.PasswordInput,
        min_length=8,
    )

    password2 = forms.CharField(
        label="Confirm password",
        widget=forms.PasswordInput,
    )

    class Meta:
        model = RestaurantMembership
        fields = (
            "username",
            "email",
            "restaurant",
            "active",
        )

    def clean_username(self):
        username = self.cleaned_data["username"]

        if User.objects.filter(username=username).exists():
            raise forms.ValidationError(
                "A user with this username already exists."
            )

        return username

    def clean(self):
        cleaned_data = super().clean()

        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")

        if password1 and password2 and password1 != password2:
            self.add_error(
                "password2",
                "Passwords do not match.",
            )

        return cleaned_data


class RestaurantMembershipAdminBase(admin.ModelAdmin):
    form = RestaurantMembershipForm

    list_display = (
        "user",
        "restaurant",
        "role",
        "active",
        "created_at",
    )

    list_filter = (
        "active",
        "restaurant",
    )

    search_fields = (
        "user__username",
        "user__email",
        "restaurant__name",
        "restaurant__slug",
    )

    readonly_fields = (
        "user",
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "User Account",
            {
                "fields": (
                    "username",
                    "email",
                    "password1",
                    "password2",
                )
            },
        ),
        (
            "Restaurant",
            {
                "fields": (
                    "restaurant",
                )
            },
        ),
        (
            "Access",
            {
                "fields": (
                    "active",
                )
            },
        ),
    )

    def save_model(self, request, obj, form, change):
        if not change:
            user = User.objects.create_user(
                username=form.cleaned_data["username"],
                email=form.cleaned_data["email"],
                password=form.cleaned_data["password1"],
            )

            obj.user = user

        super().save_model(request, obj, form, change)


@admin.register(RestaurantOwner)
class RestaurantOwnerAdmin(RestaurantMembershipAdminBase):

    def get_queryset(self, request):
        return super().get_queryset(request).filter(
            role=RestaurantMembership.Role.OWNER
        )

    def save_model(self, request, obj, form, change):
        obj.role = RestaurantMembership.Role.OWNER
        super().save_model(request, obj, form, change)


@admin.register(RestaurantStaff)
class RestaurantStaffAdmin(RestaurantMembershipAdminBase):

    def get_queryset(self, request):
        return super().get_queryset(request).filter(
            role=RestaurantMembership.Role.STAFF
        )

    def save_model(self, request, obj, form, change):
        obj.role = RestaurantMembership.Role.STAFF
        super().save_model(request, obj, form, change)


@admin.register(RestaurantMembership)
class RestaurantMembershipAdmin(admin.ModelAdmin):

    list_display = (
        "user",
        "restaurant",
        "role",
        "active",
        "created_at",
    )

    list_filter = (
        "role",
        "active",
        "restaurant",
    )

    search_fields = (
        "user__username",
        "user__email",
        "restaurant__name",
        "restaurant__slug",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )