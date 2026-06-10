import pandas as pd
import re
import string

from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# =====================================================
# STEP 2 — NLP PREPROCESSING PIPELINE
# =====================================================

print("NLP PREPROCESSING PIPELINE")

# =====================================================
# LOAD MASTER DATASET
# =====================================================

file_path = "data/processed/master_reviews.csv"

df = pd.read_csv(file_path)

print("Dataset loaded successfully!")

print("\nDataset Shape:")
print(df.shape)

# =====================================================
# INITIALIZE NLP TOOLS
# =====================================================

print("\nInitializing NLP tools")

stop_words = set(stopwords.words("english"))

lemmatizer = WordNetLemmatizer()

# =====================================================
# TEXT CLEANING FUNCTION
# =====================================================

def clean_text(text):

    # Convert to string
    text = str(text)

    # Convert to lowercase
    text = text.lower()

    # Remove URLs
    text = re.sub(r"http\S+", "", text)

    # Remove numbers
    text = re.sub(r"\d+", "", text)

    # Remove punctuation
    text = text.translate(
        str.maketrans("", "", string.punctuation)
    )

    # Remove extra spaces
    text = text.strip()

    # Tokenization
    words = text.split()

    # Remove stopwords
    words = [
        word for word in words
        if word not in stop_words
    ]

    # Lemmatization
    words = [
        lemmatizer.lemmatize(word)
        for word in words
    ]

    # Join words again

    cleaned_text = " ".join(words)

    return cleaned_text

# =====================================================
# APPLY TEXT CLEANING
# =====================================================

df["clean_review"] = df["review"].apply(clean_text)

print("Text preprocessing completed!")

# =====================================================
# REMOVE EMPTY CLEANED REVIEWS
# =====================================================

df = df[
    df["clean_review"].str.strip() != ""
    ]

# =====================================================
# REMOVE DUPLICATES AGAIN
# =====================================================

df = df.drop_duplicates(subset=["clean_review"])

# =====================================================
# RESET INDEX
# =====================================================

df = df.reset_index(drop=True)

# =====================================================
# SHOW SAMPLE OUTPUT
# =====================================================

print("\nSample Cleaned Reviews:\n")

sample_df = df[
    [
        "review",
        "clean_review",
        "sentiment"
    ]
]

print(sample_df.head())

# =====================================================
# SHOW FINAL DATASET INFO
# =====================================================

print("\nFinal Dataset Shape:")
print(df.shape)

# =====================================================
# SAVE NLP DATASET
# =====================================================

output_path = "data/processed/nlp_reviews.csv"

df.to_csv(output_path, index=False)

# =====================================================
# FINISH MESSAGE
# =====================================================

print("NLP DATASET CREATED SUCCESSFULLY")

print(f"\nSaved Location:")
print(output_path)