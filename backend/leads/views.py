from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Lead, Activity
from .serializers import (
    LeadSerializer, LeadCreateSerializer, LeadDetailSerializer,
    ActivitySerializer, ActivityCreateSerializer
)

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
    
    def destroy(self, request, *args, **kwargs):
        """Soft delete lead."""
        lead = self.get_object()
        lead.soft_delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['get', 'post'], url_path='activities')
    def activities(self, request, pk=None):
        """Nested activities endpoint: GET list, POST create for lead."""
        lead = self.get_object()
        if request.method.lower() == 'get':
            queryset = Activity.objects.filter(lead=lead, lead__is_deleted=False).order_by('-date', '-created_at')
            serializer = ActivitySerializer(queryset, many=True)
            return Response(serializer.data)
        
        data = request.data.copy()
        data['lead'] = lead.id
        create_serializer = ActivityCreateSerializer(data=data, context={'request': request})
        create_serializer.is_valid(raise_exception=True)
        activity = create_serializer.save()
        read_serializer = ActivitySerializer(activity)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """Get analytics data for dashboard"""
        from django.db.models import Count
        
        total_leads = Lead.objects.filter(is_deleted=False).count()
        
        leads_by_status = Lead.objects.filter(is_deleted=False).values('status').annotate(count=Count('id'))
        status_data = {item['status']: item['count'] for item in leads_by_status}
        
        recent_activities = Activity.objects.filter(
            lead__is_deleted=False
        ).select_related('lead', 'created_by').order_by('-created_at')[:10]
        
        qualified_leads = Lead.objects.filter(is_deleted=False, status='qualified').count()
        closed_leads = Lead.objects.filter(is_deleted=False, status='closed').count()
        lost_leads = Lead.objects.filter(is_deleted=False, status='lost').count()
        
        conversion_rate = (closed_leads / total_leads * 100) if total_leads > 0 else 0
        qualification_rate = (qualified_leads / total_leads * 100) if total_leads > 0 else 0
        lost_rate = (lost_leads / total_leads * 100) if total_leads > 0 else 0
        
        return Response({
            'total_leads': total_leads,
            'leads_by_status': status_data,
            'recent_activities': ActivitySerializer(recent_activities, many=True).data,
            'conversion_metrics': {
                'conversion_rate': round(conversion_rate, 1),
                'qualification_rate': round(qualification_rate, 1),
                'lost_rate': round(lost_rate, 1),
                'total_leads': total_leads,
                'qualified_leads': qualified_leads,
                'closed_leads': closed_leads,
                'lost_leads': lost_leads
            }
        })

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

    def create(self, request, *args, **kwargs):
        """Return Activity on create."""
        create_serializer = ActivityCreateSerializer(data=request.data, context={'request': request})
        create_serializer.is_valid(raise_exception=True)
        activity = create_serializer.save()
        read_serializer = ActivitySerializer(activity)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    """Dashboard metrics endpoint."""
    from django.db.models import Count

    total_leads = Lead.objects.filter(is_deleted=False).count()

    leads_by_status = (
        Lead.objects.filter(is_deleted=False)
        .values('status')
        .annotate(count=Count('id'))
    )
    status_data = {item['status']: item['count'] for item in leads_by_status}

    recent_activities = (
        Activity.objects.filter(lead__is_deleted=False)
        .select_related('lead', 'created_by')
        .order_by('-created_at')[:10]
    )

    qualified_leads = Lead.objects.filter(is_deleted=False, status='qualified').count()
    closed_leads = Lead.objects.filter(is_deleted=False, status='closed').count()
    lost_leads = Lead.objects.filter(is_deleted=False, status='lost').count()

    total_leads_safe = total_leads if total_leads > 0 else 0
    conversion_rate = (closed_leads / total_leads * 100) if total_leads > 0 else 0
    qualification_rate = (qualified_leads / total_leads * 100) if total_leads > 0 else 0
    lost_rate = (lost_leads / total_leads * 100) if total_leads > 0 else 0

    return Response({
        'total_leads': total_leads_safe,
        'leads_by_status': status_data,
        'recent_activities': ActivitySerializer(recent_activities, many=True).data,
        'conversion_metrics': {
            'conversion_rate': round(conversion_rate, 1),
            'qualification_rate': round(qualification_rate, 1),
            'lost_rate': round(lost_rate, 1),
            'total_leads': total_leads,
            'qualified_leads': qualified_leads,
            'closed_leads': closed_leads,
            'lost_leads': lost_leads
        }
    })
