from django.urls import path
from . import views

urlpatterns = [
    path('analyze/<str:filename>/', views.analyze_dataset, name='analyze_dataset'),
]
