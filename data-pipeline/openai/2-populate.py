import os
import csv
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

restaurant_collection = client.collections.get("Restaurant")

f = open("../../data/sf_restaurants.csv", "r")
current_restaurant = None
try:
    reader = csv.reader(f)
    next(reader)  # Skip header row
    # Iterate through each row of data
    for restaurant in reader:
      current_restaurant = restaurant
      # 0 - name
      # 1 - rating
      # 2 - user_ratings_total
      # 3 - price_level
      # 4 - vicinity
      # 5 - formatted_address
      # 6 - place_id
      # 7 - types
      # 8 - business_status
      # 9 - formatted_phone_number
      # 10 - website
      # 11 - opening_hours
      # 12 - reviews_count
      # 13 - category
      # 14 - generated_review

      properties = {
          "name": restaurant[0],
          "rating": restaurant[1],
          "user_ratings_total": restaurant[2],
          "price_level": restaurant[3],
          "vicinity": restaurant[4],
          "formatted_address": restaurant[5],
          "place_id": restaurant[6],
          "types": restaurant[7],
          "business_status": restaurant[8],
          "formatted_phone_number": restaurant[9],
          "website": restaurant[10],
          "opening_hours": restaurant[11],
          "reviews_count": restaurant[12],
          "category": restaurant[13],
          "generated_review": restaurant[14],
      }

      uuid = restaurant_collection.data.insert(properties)      

      print(f"{restaurant[0]}: {uuid}", end='\n')
except Exception as e:
  print(f"Exception: {e}.")

f.close()
client.close()