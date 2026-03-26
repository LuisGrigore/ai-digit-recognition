FROM python:3.12-slim

# Crear y usar el directorio de trabajo
WORKDIR /app

# Copiar y instalar dependencias
COPY back/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código backend y frontend
COPY back/ ./back
COPY front/dist ./front/dist

# Exponer el puerto que usa Flask
EXPOSE 5000

# Ejecutar Gunicorn apuntando al módulo backend
# Asume que back/__init__.py existe y back.controller importa correctamente Model y Service
ENV PYTHONPATH=/app/back
CMD ["gunicorn", "back.controller:app", "--bind", "0.0.0.0:5000"]