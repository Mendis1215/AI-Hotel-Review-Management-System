import pandas as pd
import os

# =====================================================
# CREATE DIRECTORIES
# =====================================================

os.makedirs("data/processed", exist_ok=True)

# =====================================================
# LOAD DATASET
# =====================================================

df = pd.read_csv(
    "data/processed/nlp_reviews.csv"
)

# =====================================================
# REMOVE NULL VALUES
# =====================================================

df = df.dropna(subset=["clean_review"])

df = df[
    df["clean_review"].str.strip() != ""
]

# =====================================================
# CATEGORY LABEL FUNCTION
# =====================================================

def assign_category(text):

    text = str(text).lower()

    room_keywords = [
        "room", "bed", "bathroom",
        "toilet", "shower",
        "ac", "air condition"
    ]

    staff_keywords = [
        "staff", "service", "manager",
        "reception", "friendly",
        "helpful", "rude"
    ]

    food_keywords = [
        "food", "breakfast",
        "restaurant", "buffet",
        "dinner", "lunch"
    ]

    if any(word in text for word in room_keywords):
        return "Rooms"

    elif any(word in text for word in staff_keywords):
        return "Staff"

    elif any(word in text for word in food_keywords):
        return "Food"

    else:
        return "Other"

# =====================================================
# CREATE CATEGORY COLUMN
# =====================================================

print("Generating category labels...")

df["category"] = df["clean_review"].apply(
    assign_category
)

# =====================================================
# SHOW ORIGINAL DISTRIBUTION
# =====================================================

print("\nOriginal Distribution:\n")

print(df["category"].value_counts())

# =====================================================
# BALANCE DATASET
# =====================================================

print("\nBalancing dataset...")

food_df = df[
    df["category"] == "Food"
]

food_count = len(food_df)

rooms_df = df[
    df["category"] == "Rooms"
].sample(
    n=food_count,
    random_state=42
)

staff_df = df[
    df["category"] == "Staff"
].sample(
    n=food_count,
    random_state=42
)

other_df = df[
    df["category"] == "Other"
].sample(
    n=food_count,
    random_state=42
)

# =====================================================
# MERGE BALANCED DATA
# =====================================================

balanced_df = pd.concat([
    food_df,
    rooms_df,
    staff_df,
    other_df
])

# =====================================================
# SHUFFLE DATA
# =====================================================

balanced_df = balanced_df.sample(
    frac=1,
    random_state=42
).reset_index(drop=True)

# =====================================================
# SHOW FINAL DISTRIBUTION
# =====================================================

print("\nBalanced Distribution:\n")

print(
    balanced_df["category"].value_counts()
)

# =====================================================
# SAVE BALANCED DATASET
# =====================================================

balanced_df.to_csv(
    "data/processed/balanced_category_reviews.csv",
    index=False
)

print("\nBalanced dataset saved!")

print(
    "\nSaved File:"
)

print(
    "data/processed/balanced_category_reviews.csv"
)