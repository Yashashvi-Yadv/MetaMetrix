from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('reports/', include('reports_service.urls')),  # ✅ include reports routes
]
