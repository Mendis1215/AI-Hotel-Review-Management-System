import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import os

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

# =====================================================
# STEP 6 — K-MEANS CLUSTERING
# =====================================================

print("K-MEANS COMPLAINT CLUSTERING")

# =====================================================
# CREATE DIRECTORIES
# =====================================================

os.makedirs("Reports/figures", exist_ok=True)

os.makedirs("Reports/results", exist_ok=True)

os.makedirs("models", exist_ok=True)

# =====================================================
# LOAD DATASET
# =====================================================


df = pd.read_csv(
    "data/processed/balanced_category_reviews.csv"
)

print("Dataset loaded successfully!")

print("\nDataset Shape:")
print(df.shape)

# =====================================================
# FILTER ONLY NEGATIVE REVIEWS
# =====================================================

negative_df = df[
    df["sentiment"] == "Negative"
].copy()

print("\nNegative Review Shape:")
print(negative_df.shape)

# =====================================================
# CATEGORY LIST
# =====================================================

categories = [
    "Rooms",
    "Staff",
    "Food",
    "Other"
]

# =====================================================
# FINAL STORAGE
# =====================================================

all_clustered_reviews = []

cluster_summary = []

# =====================================================
# LOOP THROUGH CATEGORIES
# =====================================================

for category in categories:

    print(f"PROCESSING CATEGORY: {category}")

    # -------------------------------------------------
    # FILTER CATEGORY DATA
    # -------------------------------------------------

    category_df = negative_df[
        negative_df["category"] == category
    ].copy()

    print("\nCategory Shape:")
    print(category_df.shape)

    # -------------------------------------------------
    # CHECK MINIMUM SIZE
    # -------------------------------------------------

    if len(category_df) < 100:

        print("Not enough reviews. Skipping...")
        continue

    # -------------------------------------------------
    # TF-IDF FEATURES
    # -------------------------------------------------

    vectorizer = TfidfVectorizer(
        max_features=2000,
        stop_words="english"
    )

    X = vectorizer.fit_transform(
        category_df["clean_review"]
    )

    # -------------------------------------------------
    # K-MEANS MODEL
    # -------------------------------------------------

    n_clusters = 4

    print(f"\nTraining KMeans ({n_clusters} clusters)...")

    kmeans = KMeans(
        n_clusters=n_clusters,
        random_state=42,
        n_init=10
    )

    kmeans.fit(X)

    # -------------------------------------------------
    # ASSIGN CLUSTERS
    # -------------------------------------------------

    category_df["cluster"] = kmeans.labels_

    # -------------------------------------------------
    # SAVE MODEL AND VECTORIZER
    # -------------------------------------------------

    model_path = f"models/kmeans_{category.lower()}.pkl"
    vectorizer_path = f"models/kmeans_vectorizer_{category.lower()}.pkl"

    joblib.dump(
        kmeans,
        model_path
    )
    
    joblib.dump(
        vectorizer,
        vectorizer_path
    )

    # -------------------------------------------------
    # TOP KEYWORDS
    # -------------------------------------------------

    feature_names = vectorizer.get_feature_names_out()

    print("\nTop Keywords Per Cluster:\n")

    for cluster_num in range(n_clusters):

        center_words = kmeans.cluster_centers_[cluster_num]

        top_indices = center_words.argsort()[-10:][::-1]

        top_words = [
            feature_names[i]
            for i in top_indices
        ]

        print(f"Cluster {cluster_num}:")

        print(top_words)

        cluster_summary.append({
            "category": category,
            "cluster": cluster_num,
            "keywords": ", ".join(top_words)
        })

    # -------------------------------------------------
    # CLUSTER DISTRIBUTION FIGURE
    # -------------------------------------------------

    plt.figure(figsize=(6,4))

    sns.countplot(
        x="cluster",
        data=category_df
    )

    plt.title(
        f"{category} Cluster Distribution"
    )

    plt.xlabel("Cluster")

    plt.ylabel("Review Count")

    plt.tight_layout()

    plt.savefig(
        f"Reports/figures/{category.lower()}_clusters.png"
    )

    plt.close()

    # -------------------------------------------------
    # STORE RESULTS
    # -------------------------------------------------

    all_clustered_reviews.append(
        category_df
    )

# =====================================================
# MERGE ALL CLUSTERED DATA
# =====================================================

final_clustered_df = pd.concat(
    all_clustered_reviews,
    ignore_index=True
)

# =====================================================
# SAVE CLUSTERED REVIEWS
# =====================================================

final_clustered_df.to_csv(
    "data/processed/clustered_reviews.csv",
    index=False
)

# =====================================================
# SAVE CLUSTER SUMMARY
# =====================================================

summary_df = pd.DataFrame(
    cluster_summary
)

summary_df.to_csv(
    "Reports/results/cluster_keywords_summary.csv",
    index=False
)

# =====================================================
# FINAL MESSAGE
# =====================================================

print("STEP 6 COMPLETED SUCCESSFULLY")

print("\nSaved Files:")

print("1. data/processed/clustered_reviews.csv")

print("2. Reports/results/cluster_keywords_summary.csv")

print("\nSaved Models:")

print("1. models/kmeans_rooms.pkl")

print("2. models/kmeans_staff.pkl")

print("3. models/kmeans_food.pkl")

print("4. models/kmeans_other.pkl")

print("1. Reports/figures/rooms_clusters.png")

print("2. Reports/figures/staff_clusters.png")

print("3. Reports/figures/food_clusters.png")

print("4. Reports/figures/other_clusters.png")