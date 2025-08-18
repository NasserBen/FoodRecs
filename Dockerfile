FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy and install minimal requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy code
COPY data-pipeline/ ./data-pipeline/
COPY data/ ./data/

# Default command
CMD ["python", "data-pipeline/openai/1-create_collection.py"] 