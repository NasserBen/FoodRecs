import os
import weaviate
import weaviate.classes as wvc
import weaviate.classes.config as wc
from dotenv import load_dotenv

load_dotenv()

WEAVIATE_CLUSTER_URL = os.getenv('WEAVIATE_CLUSTER_URL') or 'https://aeeos2xyr1ki5hjsu32quw.c0.us-west3.gcp.weaviate.cloud'
WEAVIATE_API_KEY = os.getenv('WEAVIATE_API_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

print(f"WEAVIATE_API_KEY: {'***' if WEAVIATE_API_KEY else 'None'}")
print(f"OPENAI_API_KEY: {'***' if OPENAI_API_KEY else 'None'}")
print(f"WEAVIATE_CLUSTER_URL: {WEAVIATE_CLUSTER_URL}")

client = weaviate.connect_to_weaviate_cloud(
    cluster_url=WEAVIATE_CLUSTER_URL,
    auth_credentials=wvc.init.Auth.api_key(WEAVIATE_API_KEY),
    headers={"X-OpenAI-Api-Key": OPENAI_API_KEY}
)

try:
    client.collections.delete("Restaurant")
except:
    pass
print(client.is_ready())

restaurants = client.collections.create(
    name="Restaurant",
    
    vectorizer_config=wvc.config.Configure.Vectorizer.text2vec_openai(model="text-embedding-3-small"),
    generative_config=wvc.config.Configure.Generative.openai(model="gpt-3.5-turbo"),
    properties=[
        wc.Property(name="name", data_type=wc.DataType.TEXT),
        wc.Property(name="rating", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="user_ratings_total", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="price_level", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="vicinity", data_type=wc.DataType.TEXT),
        wc.Property(name="formatted_address", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="place_id", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="types", data_type=wc.DataType.TEXT),
        wc.Property(name="business_status", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="formatted_phone_number", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="website", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="opening_hours", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="reviews_count", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="category", data_type=wc.DataType.TEXT),
        wc.Property(name="generated_review", data_type=wc.DataType.TEXT),
    ],
)

client.close()