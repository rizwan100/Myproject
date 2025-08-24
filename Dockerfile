# Use Python 3.12 slim image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy dependency files and install
COPY backend/pyproject.toml backend/poetry.lock* ./
RUN pip install --no-cache-dir poetry && poetry install --no-root

# Copy backend source code
COPY backend/ ./backend/

# Expose the port Cloud Run expects
EXPOSE 8080

# Run FastAPI with PORT environment variable
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
