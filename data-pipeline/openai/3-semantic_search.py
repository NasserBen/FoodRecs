import os
import weaviate
import weaviate.classes as wvc
from dotenv import load_dotenv

load_dotenv()

WEAVIATE_CLUSTER_URL = os.getenv('WEAVIATE_CLUSTER_URL') or 'https://aeeos2xyr1ki5hjsu32quw.c0.us-west3.gcp.weaviate.cloud'
WEAVIATE_API_KEY = os.getenv('WEAVIATE_API_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

client = weaviate.connect_to_weaviate_cloud(
    cluster_url=WEAVIATE_CLUSTER_URL,
    auth_credentials=wvc.init.Auth.api_key(WEAVIATE_API_KEY),
    headers={"X-OpenAI-Api-Key": OPENAI_API_KEY}
)

print(client.is_ready())

restaurant_collection = client.collections.get("Restaurant")

# Semantic Search

response = restaurant_collection.query.near_text(
    query="italian food",
    limit=3
)

print()
for restaurant in response.objects:
    print(restaurant.properties['name'])
    print(restaurant.properties['category'])
    print(restaurant.properties['vicinity'])
    print(restaurant.properties['generated_review'])
    print('---')

client.close()
