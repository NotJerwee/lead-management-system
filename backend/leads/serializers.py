from rest_framework import serializers
from .models import Lead

class LeadSerializer(serializers.ModelSerializer):
    """Serializer for Lead model"""
    full_name = serializers.ReadOnlyField()
    budget_range = serializers.ReadOnlyField()
    
    class Meta:
        model = Lead
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'email', 'phone',
            'budget_min', 'budget_max', 'budget_range', 'status',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
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
