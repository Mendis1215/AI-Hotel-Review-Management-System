import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import os

from scipy import sparse
from sklearn.feature_extraction.text import TfidfVectorizer

# =====================================================
# STEP 3 — FEATURE ENGINEERING + EDA
# =====================================================

print("FEATURE ENGINEERING + EDA")

# =====================================================
# CREATE REQUIRED DIRECTORIES
# =====================================================

os.makedirs("models", exist_ok=True)

os.makedirs("Reports/figures", exist_ok=True)

os.makedirs("data/processed", exist_ok=True)

# =====================================================
# LOAD NLP DATASET
# =====================================================

file_path = "data/processed/nlp_reviews.csv"

df = pd.read_csv(file_path)

print("Dataset loaded successfully!")

print("\nOriginal Dataset Shape:")
print(df.shape)

# =====================================================
# DATA CLEANING BEFORE FEATURE ENGINEERING
# =====================================================

print("\nChecking missing values...\n")

print(df.isnull().sum())

# -----------------------------------------------------
# REMOVE NULL clean_review
# -----------------------------------------------------

df = df.dropna(subset=["clean_review"])

# -----------------------------------------------------
# REMOVE EMPTY clean_review
# -----------------------------------------------------

df = df[
    df["clean_review"].astype(str).str.strip() != ""
]

# -----------------------------------------------------
# RESET INDEX
# -----------------------------------------------------

df = df.reset_index(drop=True)

print("\nDataset Shape After Cleaning:")
print(df.shape)

# =====================================================
# ===================== EDA ===========================
# =====================================================

print("EDA ANALYSIS")

# -----------------------------------------------------
# SENTIMENT DISTRIBUTION
# -----------------------------------------------------

print("\nSentiment Distribution:\n")

print(df["sentiment"].value_counts())

plt.figure(figsize=(6, 4))

sns.countplot(
    x="sentiment",
    data=df
)

plt.title("Sentiment Distribution")

plt.xlabel("Sentiment")

plt.ylabel("Count")

plt.tight_layout()

plt.savefig(
    "Reports/figures/sentiment_distribution.png"
)

plt.close()

# -----------------------------------------------------
# REVIEW LENGTH ANALYSIS
# -----------------------------------------------------

df["review_length"] = df["clean_review"].apply(
    lambda x: len(str(x).split())
)

print("\nReview Length Statistics:\n")

print(df["review_length"].describe())

plt.figure(figsize=(8, 5))

sns.histplot(
    df["review_length"],
    bins=30
)

plt.title("Review Length Distribution")

plt.xlabel("Number of Words")

plt.ylabel("Frequency")

plt.tight_layout()

plt.savefig(
    "Reports/figures/review_length_distribution.png"
)

plt.close()

# -----------------------------------------------------
# TOP WORDS ANALYSIS
# -----------------------------------------------------

print("\nGenerating Top Words Analysis...")

all_words = " ".join(
    df["clean_review"].astype(str)
)

word_list = all_words.split()

word_freq = (
    pd.Series(word_list)
    .value_counts()
    .head(20)
)

plt.figure(figsize=(10, 6))

sns.barplot(
    x=word_freq.values,
    y=word_freq.index
)

plt.title("Top 20 Most Frequent Words")

plt.xlabel("Frequency")

plt.ylabel("Words")

plt.tight_layout()

plt.savefig(
    "Reports/figures/top_words.png"
)

plt.close()

# =====================================================
# FEATURE ENGINEERING
# =====================================================

print("\n====================================")
print("TF-IDF FEATURE ENGINEERING")
print("====================================")

# -----------------------------------------------------
# TF-IDF VECTORIZER
# -----------------------------------------------------

vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 2),
    dtype="float32"
)

# -----------------------------------------------------
# CREATE FEATURE MATRIX
# -----------------------------------------------------

print("\nCreating TF-IDF feature matrix...")

X_features = vectorizer.fit_transform(
    df["clean_review"]
)

print("\nFeature Matrix Shape:")

print(X_features.shape)

# =====================================================
# SAVE FEATURE MATRIX (SPARSE FORMAT)
# =====================================================

print("\nSaving sparse feature matrix...")

sparse.save_npz(
    "data/processed/features.npz",
    X_features
)

# =====================================================
# SAVE TF-IDF VECTORIZER
# =====================================================

print("\nSaving TF-IDF vectorizer...")

joblib.dump(
    vectorizer,
    "models/tfidf_vectorizer.pkl"
)

# =====================================================
# SAVE FINAL FEATURE DATASET
# =====================================================

print("\nSaving final feature dataset...")

final_df = df[
    [
        "review_id",
        "hotel_name",
        "review_date",
        "review",
        "clean_review",
        "sentiment",
        "score",
        "review_length"
    ]
]

final_df.to_csv(
    "data/processed/final_features.csv",
    index=False
)

# =====================================================
# SHOW SAMPLE FEATURES
# =====================================================

feature_names = vectorizer.get_feature_names_out()

print("\nSample TF-IDF Features:\n")

print(feature_names[:30])

# =====================================================
# FINAL SUMMARY
# =====================================================

print("FEATURE ENGINEERING COMPLETED")

print("\n1. Sparse Feature Matrix:")
print("   data/processed/features.npz")

print("\n2. TF-IDF Vectorizer:")
print("   models/tfidf_vectorizer.pkl")

print("\n3. Final Feature Dataset:")
print("   data/processed/final_features.csv")

print("\nSaved EDA Figures:")

print("\n1. Sentiment Distribution:")
print("   Reports/figures/sentiment_distribution.png")

print("\n2. Review Length Distribution:")
print("   Reports/figures/review_length_distribution.png")

print("\n3. Top Frequent Words:")
print("   Reports/figures/top_words.png")