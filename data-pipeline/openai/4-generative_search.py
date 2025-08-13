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

# Generative Search

response = restaurant_collection.generate.near_text(
    query="italian pasta, seafood, fine dining",
    limit=2,
    single_prompt="Explain why this restaurant might be perfect for someone who enjoys fine dining and is looking for a romantic dinner spot. The restaurant name is {name}, category: {category}, location: {vicinity}, and review: {generated_review}."
)


print(response.objects[0].generated)  # Inspect the first object

client.close()
