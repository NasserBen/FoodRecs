# Running the Data Pipeline with Docker

## Quick Start

### 1. Create `.env` file
```bash
WEAVIATE_CLUSTER_URL=https://your-cluster-url.weaviate.cloud
WEAVIATE_API_KEY=your_weaviate_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Run the pipeline
```bash
# Build and run
docker-compose up --build

# Or run individual steps
docker-compose run --rm data-pipeline python data-pipeline/openai/1-create_collection.py
docker-compose run --rm data-pipeline python data-pipeline/openai/2-populate.py
docker-compose run --rm data-pipeline python data-pipeline/openai/3-semantic_search.py
docker-compose run --rm data-pipeline python data-pipeline/openai/4-generative_search.py
```

### 3. Cleanup
```bash
docker-compose down
``` 