#!/bin/bash

echo "🚀 Running Food Recommendations Data Pipeline..."

echo "📋 Step 1: Creating Weaviate collection..."
docker-compose run --rm data-pipeline python data-pipeline/openai/1-create_collection.py

echo "📊 Step 2: Populating data..."
docker-compose run --rm data-pipeline python data-pipeline/openai/2-populate.py

echo "🔍 Step 3: Testing semantic search..."
docker-compose run --rm data-pipeline python data-pipeline/openai/3-semantic_search.py

echo "🤖 Step 4: Testing generative search..."
docker-compose run --rm data-pipeline python data-pipeline/openai/4-generative_search.py

echo "🎉 Pipeline completed!"
