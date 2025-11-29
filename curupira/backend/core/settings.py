import os
from pathlib import Path
from dotenv import load_dotenv

# -----------------------------------------
# Load environment variables
# -----------------------------------------
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# -----------------------------------------
# Security
# -----------------------------------------
SECRET_KEY = os.getenv("SECRET_KEY", "unsafe-secret-key")
DEBUG = os.getenv("DEBUG", "0").lower() in ("1", "true", "yes")
ALLOWED_HOSTS = os.getenv("DJANGO_ALLOWED_HOSTS", "localhost").split(",")

# -----------------------------------------
# Application definition
# -----------------------------------------
INSTALLED_APPS = [
    "activities",
    "account",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "drf_spectacular",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"

# -----------------------------------------
# Database (PostgreSQL)
# -----------------------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("POSTGRES_DB", "django_db"),
        "USER": os.getenv("POSTGRES_USER", "django_user"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD", "django_password"),
        "HOST": os.getenv("POSTGRES_HOST", "db"),
        "PORT": os.getenv("POSTGRES_PORT", "5432"),
    }
}

# -----------------------------------------
# Password validation
# -----------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# -----------------------------------------
# Internationalization
# -----------------------------------------
LANGUAGE_CODE = os.getenv("DJANGO_LANGUAGE_CODE", "pt-br")
TIME_ZONE = os.getenv("DJANGO_TIME_ZONE", "America/Sao_Paulo")
USE_I18N = True
USE_TZ = True

# -----------------------------------------
# Static & Media Files
# -----------------------------------------
STATIC_URL = os.getenv("STATIC_URL", "/static/")
MEDIA_URL = os.getenv("MEDIA_URL", "/media/")
STATIC_ROOT = os.getenv("STATIC_ROOT", BASE_DIR / "staticfiles")
MEDIA_ROOT = os.getenv("MEDIA_ROOT", BASE_DIR / "media")
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# -----------------------------------------
# Django REST Framework & drf-spectacular
# -----------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

SPECTACULAR_SETTINGS = {
    "TITLE": "Curupira API",
    "DESCRIPTION": "Documentação da API do projeto Curupira.",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "CONTACT": {"name": "Equipe Curupira", "email": "admin@example.com"},
    "LICENSE": {"name": "MIT License"},
}

# -----------------------------------------
# CORS
# -----------------------------------------
CORS_ALLOW_ALL_ORIGINS = True

# -----------------------------------------
# Default primary key field type
# -----------------------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
