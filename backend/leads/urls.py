from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeadViewSet, ActivityViewSet, dashboard

router = DefaultRouter()
router.register(r'leads', LeadViewSet)
router.register(r'activities', ActivityViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', dashboard, name='dashboard'),
]
