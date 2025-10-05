from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class Lead(models.Model):
    """Lead model for managing real estate clients"""
    
    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('qualified', 'Qualified'),
        ('negotiation', 'Negotiation'),
        ('closed', 'Closed'),
        ('lost', 'Lost'),
    ]
    SOURCE_CHOICES = [
        ('website', 'Website'),
        ('referral', 'Referral'),
        ('zillow', 'Zillow'),
        ('other', 'Other'),
    ]
    
    first_name = models.CharField()
    last_name = models.CharField()
    email = models.EmailField()
    phone = models.CharField()
    
    budget_min = models.DecimalField(max_digits=12, decimal_places=2)
    budget_max = models.DecimalField(max_digits=12, decimal_places=2)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    source = models.CharField(max_length=50, choices=SOURCE_CHOICES, default='other')
    property_interest = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='leads')
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['is_deleted']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['email'],
                condition=models.Q(is_active=True),
                name='unique_active_lead_email',
            ),
        ]
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def budget_range(self):
        if self.budget_min is not None and self.budget_max is not None:
            return f"${self.budget_min:,.0f} - ${self.budget_max:,.0f}"
        return "Not specified"
    
    def soft_delete(self):
        """Soft delete the lead"""
        self.is_deleted = True
        self.is_active = False
        self.deleted_at = timezone.now()
        self.save()

class Activity(models.Model):
    """Activity model for tracking lead interactions"""
    
    ACTIVITY_TYPE_CHOICES = [
        ('call', 'Call'),
        ('email', 'Email'),
        ('meeting', 'Meeting'),
        ('note', 'Note'),
    ]
    
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(choices=ACTIVITY_TYPE_CHOICES)
    title = models.CharField()
    notes = models.TextField(blank=True)
    date = models.DateTimeField(default=timezone.now)
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['lead', '-date']),
        ]
    
    def __str__(self):
        return f"{self.get_activity_type_display()} - {self.title}"
    
    def clean(self):
        """Validate that duration is provided for calls"""
        from django.core.exceptions import ValidationError
        
        if self.activity_type == 'call' and not self.duration_minutes:
            raise ValidationError("Duration is required for call activities")
