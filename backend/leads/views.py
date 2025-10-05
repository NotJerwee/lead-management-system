from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .models import Lead, Activity
from .serializers import (
    LeadSerializer, LeadCreateSerializer, LeadDetailSerializer,
    ActivitySerializer, ActivityCreateSerializer
)

User = get_user_model()

class LeadViewSet(viewsets.ModelViewSet):
    """ViewSet for Lead CRUD operations"""
    queryset = Lead.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status']
    search_fields = ['first_name', 'last_name', 'email']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Return non-deleted leads"""
        return Lead.objects.filter(is_deleted=False)
    
    def get_serializer_class(self):
        """Return serializer based on action"""
        if self.action == 'retrieve':
            return LeadDetailSerializer
        elif self.action == 'create':
            return LeadCreateSerializer
        return LeadSerializer
    
    @action(detail=True, methods=['delete'])
    def soft_delete(self, request, pk=None):
        """Soft delete a lead"""
        lead = self.get_object()
        lead.soft_delete()
        return Response({'message': 'Lead deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        """Restore a soft deleted lead"""
        lead = get_object_or_404(Lead, pk=pk, is_deleted=True)
        lead.restore()
        serializer = self.get_serializer(lead)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ActivityViewSet(viewsets.ModelViewSet):
    """ViewSet for Activity CRUD operations"""
    queryset = Activity.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['activity_type', 'lead']
    ordering = ['-date', '-created_at']
    
    def get_queryset(self):
        """Return activities for non-deleted leads"""
        return Activity.objects.filter(lead__is_deleted=False)
    
    def get_serializer_class(self):
        """Return serializer based on action"""
        if self.action == 'create':
            return ActivityCreateSerializer
        return ActivitySerializer
    
    def perform_create(self, serializer):
        """Create activity with current user"""
        serializer.save(created_by=self.request.user)
