import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import re
import string
import joblib
import pandas as pd
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer

from config.settings import CLUSTER_MAPPING
from database.mongodb import MongoDBManager
from ai_engine.prompt_builder import build_review_analysis_prompt
from ai_engine.gemini_service import get_ai_recommendation

# Ensure NLTK resources are available silently
try:
    nltk.data.find('corpora/stopwords')
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('stopwords', quiet=True)
    nltk.download('wordnet', quiet=True)

class ReviewPipeline:
    def __init__(self):
        print("Initializing Review Pipeline...")
        
        # 1. Initialize NLP tools
        self.stop_words = set(stopwords.words("english"))
        self.lemmatizer = WordNetLemmatizer()
        
        # 2. Initialize Database connection
        self.db_manager = MongoDBManager()
        
        # 3. Load Models
        print("Loading ML Models...")
        self.base_dir = os.path.dirname(os.path.dirname(__file__))
        self.models_dir = os.path.join(self.base_dir, 'models')
        
        # Sentiment Models
        self.sentiment_model = joblib.load(os.path.join(self.models_dir, 'sentiment_model.pkl'))
        self.tfidf_vectorizer = joblib.load(os.path.join(self.models_dir, 'tfidf_vectorizer.pkl'))
        
        # Category Models
        self.category_model = joblib.load(os.path.join(self.models_dir, 'category_model.pkl'))
        self.category_vectorizer = joblib.load(os.path.join(self.models_dir, 'category_vectorizer.pkl'))
        self.category_encoder = joblib.load(os.path.join(self.models_dir, 'category_label_encoder.pkl'))
        
        # KMeans Models
        self.kmeans_models = {
            "Rooms": joblib.load(os.path.join(self.models_dir, 'kmeans_rooms.pkl')),
            "Staff": joblib.load(os.path.join(self.models_dir, 'kmeans_staff.pkl')),
            "Food": joblib.load(os.path.join(self.models_dir, 'kmeans_food.pkl')),
            "Other": joblib.load(os.path.join(self.models_dir, 'kmeans_other.pkl'))
        }
        
        # Load the KMeans Vectorizers that were saved in Step 6
        self.kmeans_vectorizers = {
            "Rooms": joblib.load(os.path.join(self.models_dir, 'kmeans_vectorizer_rooms.pkl')),
            "Staff": joblib.load(os.path.join(self.models_dir, 'kmeans_vectorizer_staff.pkl')),
            "Food": joblib.load(os.path.join(self.models_dir, 'kmeans_vectorizer_food.pkl')),
            "Other": joblib.load(os.path.join(self.models_dir, 'kmeans_vectorizer_other.pkl'))
        }
            
        print("Pipeline initialization complete!\n")

    def clean_text(self, text):
        text = str(text).lower()
        text = re.sub(r"http\S+", "", text)
        text = re.sub(r"\d+", "", text)
        text = text.translate(str.maketrans("", "", string.punctuation))
        text = text.strip()
        words = text.split()
        words = [word for word in words if word not in self.stop_words]
        words = [self.lemmatizer.lemmatize(word) for word in words]
        return " ".join(words)

    def process_review(self, review_text, review_id=None):
        print(f"{'='*50}")
        print(f"PROCESSING NEW REVIEW")
        print(f"Review: '{review_text}'")
        print(f"{'='*50}")
        
        # Step 1: Clean text
        clean_review = self.clean_text(review_text)
        
        # Step 2: Predict Sentiment
        sentiment_features = self.tfidf_vectorizer.transform([clean_review])
        sentiment_pred = self.sentiment_model.predict(sentiment_features)[0]
        sentiment_label = "Positive" if sentiment_pred == 1 else "Negative"
        print(f"-> Sentiment: {sentiment_label}")
        
        if sentiment_label == "Positive":
            print("-> Review is positive. Skipping cluster and AI analysis.")
            if review_id:
                self.db_manager.update_analysis(review_id, sentiment_label, "N/A", -1, "N/A", "Great review! Keep up the good work.")
            return
            
        # Step 3: Predict Category
        category_features = self.category_vectorizer.transform([clean_review])
        category_pred = self.category_model.predict(category_features)[0]
        category_label = self.category_encoder.inverse_transform([category_pred])[0]
        print(f"-> Category:  {category_label}")
        
        # Step 4: Predict Cluster
        cluster_vec = self.kmeans_vectorizers[category_label]
        cluster_features = cluster_vec.transform([clean_review])
        kmeans_model = self.kmeans_models[category_label]
        cluster_id = kmeans_model.predict(cluster_features)[0]
        print(f"-> Cluster:   {cluster_id}")
        
        # Step 5: Map to Human Meaning
        cluster_meaning = CLUSTER_MAPPING[category_label][str(cluster_id)]
        print(f"-> Problem:   {cluster_meaning}")
        
        # Step 6: Call AI for Solutions
        prompt = build_review_analysis_prompt(review_text, sentiment_label, category_label, cluster_meaning)
        ai_solution = get_ai_recommendation(prompt)
        print(f"\n-> AI Recommendation generated.")
        
        # Step 7: Update existing document in MongoDB
        if review_id:
            self.db_manager.update_analysis(
                review_id=review_id,
                sentiment=sentiment_label,
                category=category_label,
                cluster_id=cluster_id,
                cluster_meaning=cluster_meaning,
                ai_solution=ai_solution
            )
        
        print("Processing finished successfully.")

# Example usage when running this file directly
if __name__ == "__main__":
    pipeline = ReviewPipeline()
    # Check if arguments are passed from Node.js
    if len(sys.argv) > 2:
        review_text = sys.argv[1]
        review_id = sys.argv[2]
        pipeline.process_review(review_text, review_id)
    else:
        # Fallback test
        pipeline.process_review("The room was very dirty, the bed was uncomfortable and the ac didn't work at all.", None)
