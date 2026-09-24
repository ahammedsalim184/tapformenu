from django.conf import settings
from django.contrib.auth import password_validation
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils.encoding import force_bytes
from django.utils.http import (
    urlsafe_base64_decode,
    urlsafe_base64_encode,
)

import resend

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import RestaurantMembership
from django.db import transaction

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

    def patch(self, request):
        user = request.user

        username = request.data.get("username")
        email = request.data.get("email")

        if username is None and email is None:
            return Response(
                {"detail": "No account details were provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if username is not None:
            username = username.strip()

            if not username:
                return Response(
                    {"username": "Username cannot be empty."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if len(username) > 150:
                return Response(
                    {"username": "Username is too long."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            username_exists = (
                User.objects
                .filter(username__iexact=username)
                .exclude(id=user.id)
                .exists()
            )

            if username_exists:
                return Response(
                    {"username": "This username is already in use."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user.username = username

        if email is not None:
            email = email.strip()

            if len(email) > 254:
                return Response(
                    {"email": "Email address is too long."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            email_exists = (
                User.objects
                .filter(email__iexact=email)
                .exclude(id=user.id)
                .exists()
            )

            if email and email_exists:
                return Response(
                    {"email": "This email address is already in use."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user.email = email

        user.save(update_fields=["username", "email"])

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
        })


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        current_password = request.data.get("current_password", "")
        new_password = request.data.get("new_password", "")
        confirm_password = request.data.get("confirm_password", "")

        if not current_password:
            return Response(
                {"current_password": "Enter your current password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not new_password:
            return Response(
                {"new_password": "Enter a new password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not confirm_password:
            return Response(
                {"confirm_password": "Please confirm your new password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_password != confirm_password:
            return Response(
                {"confirm_password": "Passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.check_password(current_password):
            return Response(
                {
                    "current_password":
                    "Your current password is incorrect."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            password_validation.validate_password(
                new_password,
                user,
            )
        except ValidationError as error:
            return Response(
                {"new_password": error.messages},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save(update_fields=["password"])

        return Response({
            "detail": "Password changed successfully."
        })


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data.get("email", "").strip().lower()

        users = User.objects.filter(
            email__iexact=email,
            is_active=True,
        )

        for user in users:
            if not user.has_usable_password():
                continue

            uid = urlsafe_base64_encode(
                force_bytes(user.pk)
            )

            token = default_token_generator.make_token(user)

            reset_url = (
                f"{settings.FRONTEND_URL}/reset-password/"
                f"{uid}/{token}"
            )

            resend.api_key = settings.RESEND_API_KEY

            resend.Emails.send({
                "from": "TapForMenu <no-reply@tapformenu.in>",
                "to": [user.email],
                "subject": "Reset your TapForMenu password",
                "html": f"""
                    <h2>Reset your TapForMenu password</h2>

                    <p>You requested a password reset for your TapForMenu account.</p>

                    <p>
                        <a href="{reset_url}">
                            Reset your password
                        </a>
                    </p>

                    <p>If you did not request this password reset, you can safely ignore this email.</p>
                """,
            })

        return Response({
            "detail": (
                "If an account exists with that email, "
                "a password reset link has been sent."
            )
        })


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        uid = request.data.get("uid", "")
        token = request.data.get("token", "")
        new_password = request.data.get("new_password", "")
        confirm_password = request.data.get("confirm_password", "")

        if not uid or not token:
            return Response(
                {"detail": "Invalid password reset link."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not new_password:
            return Response(
                {"new_password": "Enter a new password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not confirm_password:
            return Response(
                {
                    "confirm_password":
                    "Please confirm your new password."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_password != confirm_password:
            return Response(
                {"confirm_password": "Passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_id = urlsafe_base64_decode(uid).decode()

            user = User.objects.get(
                pk=user_id,
                is_active=True,
            )

        except (
            ValueError,
            TypeError,
            OverflowError,
            User.DoesNotExist,
        ):
            return Response(
                {"detail": "Invalid password reset link."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not default_token_generator.check_token(
            user,
            token,
        ):
            return Response(
                {
                    "detail":
                    "This password reset link is invalid or expired."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            password_validation.validate_password(
                new_password,
                user,
            )
        except ValidationError as error:
            return Response(
                {"new_password": error.messages},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save(update_fields=["password"])

        return Response({
            "detail": "Password has been reset successfully."
        })

    def get(self, request):
        uid = request.query_params.get("uid", "")
        token = request.query_params.get("token", "")

        if not uid or not token:
            return Response(
                {"detail": "Invalid password reset link."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_id = urlsafe_base64_decode(uid).decode()

            user = User.objects.get(
                pk=user_id,
                is_active=True,
            )

        except (
            ValueError,
            TypeError,
            OverflowError,
            User.DoesNotExist,
        ):
            return Response(
                {"detail": "Invalid password reset link."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {
                    "detail":
                    "This password reset link is invalid or expired."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({
            "username": user.username,
        })


class AddStaffView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        restaurant_slug = (
            request.data.get("restaurant_slug", "").strip()
        )

        username = request.data.get("username", "").strip()
        email = request.data.get("email", "").strip().lower()
        password = request.data.get("password", "")
        confirm_password = request.data.get(
            "confirm_password",
            "",
        )

        if not restaurant_slug:
            return Response(
                {"detail": "Restaurant is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        owner_membership = (
            RestaurantMembership.objects
            .select_related("restaurant")
            .filter(
                user=request.user,
                restaurant__slug=restaurant_slug,
                restaurant__active=True,
                role=RestaurantMembership.Role.OWNER,
                active=True,
            )
            .first()
        )

        if not owner_membership:
            return Response(
                {
                    "detail":
                    "You do not have permission to add staff to this restaurant."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if not username:
            return Response(
                {"username": "Username is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(username) > 150:
            return Response(
                {"username": "Username is too long."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not email:
            return Response(
                {"email": "Email address is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(email) > 254:
            return Response(
                {"email": "Email address is too long."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not password:
            return Response(
                {"password": "Password is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not confirm_password:
            return Response(
                {
                    "confirm_password":
                    "Please confirm the password."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if password != confirm_password:
            return Response(
                {
                    "confirm_password":
                    "Passwords do not match."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(
            username__iexact=username
        ).exists():
            return Response(
                {
                    "username":
                    "This username is already in use."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(
            email__iexact=email
        ).exists():
            return Response(
                {
                    "email":
                    "This email address is already in use."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            password_validation.validate_password(
                password
            )
        except ValidationError as error:
            return Response(
                {
                    "password": error.messages
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with transaction.atomic():
                staff_user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                )

                RestaurantMembership.objects.create(
                    user=staff_user,
                    restaurant=owner_membership.restaurant,
                    role=RestaurantMembership.Role.STAFF,
                    active=True,
                )

        except Exception:
            return Response(
                {
                    "detail":
                    "Unable to create the staff account."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "detail": "Staff account created successfully.",
                "staff": {
                    "id": staff_user.id,
                    "username": staff_user.username,
                    "email": staff_user.email,
                    "role": RestaurantMembership.Role.STAFF,
                    "restaurant": {
                        "id": owner_membership.restaurant.id,
                        "name": owner_membership.restaurant.name,
                        "slug": owner_membership.restaurant.slug,
                    },
                },
            },
            status=status.HTTP_201_CREATED,
        )

class StaffListView(APIView):
    permission_classes = [IsAuthenticated]

    def get_owner_membership(self, request, restaurant_slug):
        return (
            RestaurantMembership.objects
            .select_related("restaurant")
            .filter(
                user=request.user,
                restaurant__slug=restaurant_slug,
                restaurant__active=True,
                role=RestaurantMembership.Role.OWNER,
                active=True,
            )
            .first()
        )

    def get(self, request):
        restaurant_slug = (
            request.query_params.get("restaurant_slug", "").strip()
        )

        if not restaurant_slug:
            return Response(
                {"detail": "Restaurant is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        owner_membership = self.get_owner_membership(
            request,
            restaurant_slug,
        )

        if not owner_membership:
            return Response(
                {
                    "detail":
                    "You do not have permission to manage staff."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        staff_memberships = (
            RestaurantMembership.objects
            .select_related("user")
            .filter(
                restaurant=owner_membership.restaurant,
                role=RestaurantMembership.Role.STAFF,
                active=True,
            )
            .order_by("user__username")
        )

        staff = [
            {
                "id": membership.user.id,
                "membership_id": membership.id,
                "username": membership.user.username,
                "email": membership.user.email,
                "active": membership.active,
            }
            for membership in staff_memberships
        ]

        return Response({
            "restaurant": {
                "id": owner_membership.restaurant.id,
                "name": owner_membership.restaurant.name,
                "slug": owner_membership.restaurant.slug,
            },
            "staff": staff,
        })


class StaffDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_owner_membership(
        self,
        request,
        restaurant_slug,
    ):
        return (
            RestaurantMembership.objects
            .select_related("restaurant")
            .filter(
                user=request.user,
                restaurant__slug=restaurant_slug,
                restaurant__active=True,
                role=RestaurantMembership.Role.OWNER,
                active=True,
            )
            .first()
        )

    def get_staff_membership(
        self,
        restaurant,
        staff_id,
    ):
        return (
            RestaurantMembership.objects
            .select_related("user")
            .filter(
                restaurant=restaurant,
                user_id=staff_id,
                role=RestaurantMembership.Role.STAFF,
                active=True,
            )
            .first()
        )

    def patch(self, request, staff_id):
        restaurant_slug = (
            request.data.get(
                "restaurant_slug",
                "",
            ).strip()
        )

        if not restaurant_slug:
            return Response(
                {"detail": "Restaurant is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        owner_membership = self.get_owner_membership(
            request,
            restaurant_slug,
        )

        if not owner_membership:
            return Response(
                {
                    "detail":
                    "You do not have permission to manage staff."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        staff_membership = self.get_staff_membership(
            owner_membership.restaurant,
            staff_id,
        )

        if not staff_membership:
            return Response(
                {"detail": "Staff member not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        staff_user = staff_membership.user

        username_provided = "username" in request.data
        email_provided = "email" in request.data
        password_provided = "password" in request.data

        if (
            not username_provided
            and not email_provided
            and not password_provided
        ):
            return Response(
                {
                    "detail":
                    "No staff details were provided."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if username_provided:
            username = request.data.get(
                "username",
                "",
            ).strip()

            if not username:
                return Response(
                    {
                        "username":
                        "Username cannot be empty."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if len(username) > 150:
                return Response(
                    {
                        "username":
                        "Username is too long."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            username_exists = (
                User.objects
                .filter(username__iexact=username)
                .exclude(id=staff_user.id)
                .exists()
            )

            if username_exists:
                return Response(
                    {
                        "username":
                        "This username is already in use."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            staff_user.username = username

        if email_provided:
            email = request.data.get(
                "email",
                "",
            ).strip().lower()

            if len(email) > 254:
                return Response(
                    {
                        "email":
                        "Email address is too long."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            email_exists = (
                User.objects
                .filter(email__iexact=email)
                .exclude(id=staff_user.id)
                .exists()
            )

            if email and email_exists:
                return Response(
                    {
                        "email":
                        "This email address is already in use."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            staff_user.email = email

        if password_provided:
            password = request.data.get(
                "password",
                "",
            )

            if not password:
                return Response(
                    {
                        "password":
                        "Password cannot be empty."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                password_validation.validate_password(
                    password,
                    staff_user,
                )
            except ValidationError as error:
                return Response(
                    {
                        "password":
                        error.messages
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            staff_user.set_password(password)

        update_fields = []

        if username_provided:
            update_fields.append("username")

        if email_provided:
            update_fields.append("email")

        if password_provided:
            update_fields.append("password")

        staff_user.save(
            update_fields=update_fields,
        )

        return Response({
            "detail": "Staff account updated successfully.",
            "staff": {
                "id": staff_user.id,
                "membership_id": staff_membership.id,
                "username": staff_user.username,
                "email": staff_user.email,
                "active": staff_membership.active,
            },
        })

    def delete(self, request, staff_id):
        restaurant_slug = (
            request.data.get(
                "restaurant_slug",
                "",
            ).strip()
            or request.query_params.get(
                "restaurant_slug",
                "",
            ).strip()
        )

        if not restaurant_slug:
            return Response(
                {"detail": "Restaurant is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        owner_membership = self.get_owner_membership(
            request,
            restaurant_slug,
        )

        if not owner_membership:
            return Response(
                {
                    "detail":
                    "You do not have permission to manage staff."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        staff_membership = self.get_staff_membership(
            owner_membership.restaurant,
            staff_id,
        )

        if not staff_membership:
            return Response(
                {"detail": "Staff member not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        staff_membership.active = False
        staff_membership.save(
            update_fields=["active", "updated_at"]
        )

        return Response({
            "detail":
            "Staff member removed successfully."
        })