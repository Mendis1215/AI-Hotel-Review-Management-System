from pymongo import MongoClient
from pymongo.server_api import ServerApi
import datetime
from config.settings import MONGODB_URI

class MongoDBManager:
    def __init__(self):
        try:
            # Connect to MongoDB Atlas
            self.client = MongoClient(MONGODB_URI, server_api=ServerApi('1'))
            # Send a ping to confirm a successful connection
            self.client.admin.command('ping')
            
            self.db = self.client["hotel_review_db"]
            # Change to 'reviews' to match the MERN stack collection!
            self.collection = self.db["reviews"]
            print("Connected to MongoDB Atlas successfully.")
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            self.collection = None

    def update_analysis(self, review_id, sentiment, category, cluster_id, cluster_meaning, ai_solution):
        from bson.objectid import ObjectId
        if self.collection is None or not review_id:
            print("Warning: Could not update MongoDB because connection failed or no ID provided.")
            return None
            
        update_fields = {
            "sentiment": sentiment,
            "category": category,
            "cluster": int(cluster_id),
            "clusterMeaning": cluster_meaning,
            "aiRecommendation": ai_solution
        }
        
        try:
            result = self.collection.update_one(
                {"_id": ObjectId(review_id)},
                {"$set": update_fields}
            )
            print(f"Analysis updated successfully for ID: {review_id}")
            return True
        except Exception as e:
            print(f"Failed to update document in MongoDB: {e}")
            return False
