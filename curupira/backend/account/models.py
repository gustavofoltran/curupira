from django.db import models
from django.core.validators import EmailValidator, MinLengthValidator
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone

class User(models.Model):
    """A simple user model storing credentials and timestamps."""
    username = models.CharField(max_length=150, unique=True, validators=[MinLengthValidator(3)])
    password = models.CharField(max_length=128)
    email = models.EmailField(max_length=254, validators=[EmailValidator()])
    created_at = models.DateTimeField(default=timezone.now)
    last_access = models.DateTimeField(null=True, blank=True)

    def set_password(self, raw_password: str):
        self.password = make_password(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password(raw_password, self.password)

    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith('pbkdf2_') and not self.password.startswith('argon2'):
            self.password = make_password(self.password)
        if not self.created_at:
            self.created_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username

class SearchHistory(models.Model):
    """Stores searches performed by users."""
    user = models.ForeignKey(User, related_name='search_history', on_delete=models.CASCADE)
    search_time = models.DateTimeField(default=timezone.now)
    activity_id = models.PositiveIntegerField()
    value1 = models.FloatField(null=True, blank=True)
    value2 = models.FloatField(null=True, blank=True)
    response = models.JSONField(null=True, blank=True)

    class Meta:
        ordering = ['-search_time']

    def __str__(self):
        return f"Search by {self.user_id} on {self.search_time.isoformat()} for activity {int(self.activity_id)}"
