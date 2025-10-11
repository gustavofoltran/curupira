# --- Base Stage ---
FROM python:3.13-slim AS base
# Seta variáveis env para o Python
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=backend.settings
WORKDIR /app

# --- Builder Stage ---
FROM base AS builder
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- Runtime Stage ---
FROM builder AS runtime
COPY . .
RUN chmod +x /app/entrypoint.sh
EXPOSE 8000
ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]

# --- Development Stage
FROM runtime AS development

## --- Production
FROM runtime AS production
RUN addgroup --system app && adduser --system --group app
RUN chown -R app:app /app
USER app