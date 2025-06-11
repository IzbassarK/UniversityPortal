from django.urls import path
from . import views

urlpatterns = [
    path('recommendations/<str:user_id>/', views.user_recommendations, name='user_recommendations'),
]