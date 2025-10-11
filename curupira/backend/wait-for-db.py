import os
import socket
import time

host = os.environ.get("POSTGRES_HOST", "postgres")
port = int(os.environ.get("POSTGRES_PORT", 5432))

print(f"Aguardando Postgres em {host}:{port}...")

while True:
    try:
        with socket.create_connection((host, port), timeout=2):
            break
    except OSError:
        print(f"Postgres ainda não está pronto em {host}:{port}, aguardando...")
        time.sleep(2)
