from rest_framework import serializers
from .models import Lead, Activity

class LeadSerializer(serializers.ModelSerializer):
    """Serializer for Lead model"""
    full_name = serializers.ReadOnlyField()
    budget_range = serializers.ReadOnlyField()
    
    class Meta:
        model = Lead
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'email', 'phone',
            'budget_min', 'budget_max', 'budget_range', 'status',
            'created_at', 'updated_at', 'is_deleted', 'deleted_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_deleted', 'deleted_at']
    
    def validate(self, data):
        """Validate budget range"""
        budget_min = data.get('budget_min')
        budget_max = data.get('budget_max')
        
        if budget_min and budget_max and budget_min > budget_max:
            raise serializers.ValidationError(
                "Minimum budget cannot be greater than maximum budget"
            )
        
        return data

class LeadCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new leads"""
    
    class Meta:
        model = Lead
        fields = [
            'first_name', 'last_name', 'email', 'phone',
            'budget_min', 'budget_max', 'status'
        ]

class LeadListSerializer(serializers.ModelSerializer):
    """Serializer for lead list view"""
    full_name = serializers.ReadOnlyField()
    budget_range = serializers.ReadOnlyField()
    
    class Meta:
        model = Lead
        fields = [
            'id', 'full_name', 'email', 'phone', 'budget_range', 
            'status', 'created_at'
        ]


class ActivitySerializer(serializers.ModelSerializer):
    """Serializer for Activity model"""
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    activity_type_display = serializers.CharField(source='get_activity_type_display', read_only=True)
    
    class Meta:
        model = Activity
        fields = [
            'id', 'lead', 'activity_type', 'activity_type_display', 'title', 'notes',
            'date', 'duration_minutes', 'created_by', 'created_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
    
    def validate(self, data):
        """Validate activity data"""
        activity_type = data.get('activity_type')
        duration_minutes = data.get('duration_minutes')
        date = data.get('date')
        
        if activity_type == 'call' and not date:
            raise serializers.ValidationError(
                f"Date is required for {activity_type} activities"
            )
        
        if activity_type == 'call' and not duration_minutes:
            raise serializers.ValidationError(
                f"Duration is required for {activity_type} activities"
            )
        
        return data
    
    def create(self, validated_data):
        """Create activity with current user as creator"""
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class ActivityCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new activities"""
    
    class Meta:
        model = Activity
        fields = [
            'lead', 'activity_type', 'title', 'notes', 'date', 'duration_minutes'
        ]
    
    def validate(self, data):
        """Validate activity data"""
        activity_type = data.get('activity_type')
        duration_minutes = data.get('duration_minutes')
        date = data.get('date')
        
        if activity_type == 'call' and not date:
            raise serializers.ValidationError(
                f"Date is required for {activity_type} activities"
            )
        
        if activity_type == 'call' and not duration_minutes:
            raise serializers.ValidationError(
                f"Duration is required for {activity_type} activities"
            )
        
        return data
    
    def create(self, validated_data):
        """Create activity with current user as creator"""
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class LeadDetailSerializer(serializers.ModelSerializer):
    """Serializer for Lead detail view with activities"""
    full_name = serializers.ReadOnlyField()
    budget_range = serializers.ReadOnlyField()
    activities = ActivitySerializer(many=True, read_only=True)
    
    class Meta:
        model = Lead
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'email', 'phone',
            'budget_min', 'budget_max', 'budget_range', 'status',
            'created_at', 'updated_at', 'activities'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
