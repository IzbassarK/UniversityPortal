from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("login/", login_view, name="login"),
    path("signup/", signup_view, name="signup"),
    path("user-details/", get_user_details, name="user-details"),
    path("user-details/<str:username>/", update_user_details, name="user-details"),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('courses/', get_courses, name='get-courses'),
    path('courses/<str:course_id>/', get_course_details, name="course-details"),
    path('modules/<str:module_id>/', get_module_details, name='module-details'),
    path('modules/<str:module_id>/register/', register_module, name ='register-module'),
    path('instructors/', get_instructors, name='get_instructors'),
    path('my_enrollments/', get_enrolls, name='get-enrollments'),
]
