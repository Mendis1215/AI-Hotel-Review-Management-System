import pandas as pd

# STEP 1 — CREATE MASTER DATASET

print("HOTEL REVIEW AI SYSTEM - STEP 1")
print("Creating Master Dataset")

# LOAD ORIGINAL KAGGLE DATASET

file_path = "data/raw/Hotel_Reviews.csv"

df = pd.read_csv(file_path)

print("Dataset loaded successfully!")

# SHOW ORIGINAL DATASET INFO

print("\nOriginal Dataset Shape:")
print(df.shape)

# KEEP ONLY REQUIRED COLUMNS

required_columns = [
    "Positive_Review",
    "Negative_Review",
    "Reviewer_Score",
    "Review_Date",
    "Hotel_Name"
]

df = df[required_columns]

print("\nSelected Required Columns:")
print(required_columns)

# CREATE NEGATIVE REVIEW DATAFRAME

negative_df = pd.DataFrame()

negative_df["review"] = df["Negative_Review"]
negative_df["sentiment"] = "Negative"
negative_df["score"] = df["Reviewer_Score"]
negative_df["review_date"] = df["Review_Date"]
negative_df["hotel_name"] = df["Hotel_Name"]

# CREATE POSITIVE REVIEW DATAFRAME

positive_df = pd.DataFrame()

positive_df["review"] = df["Positive_Review"]
positive_df["sentiment"] = "Positive"
positive_df["score"] = df["Reviewer_Score"]
positive_df["review_date"] = df["Review_Date"]
positive_df["hotel_name"] = df["Hotel_Name"]

# MERGE BOTH DATAFRAMES

master_df = pd.concat(
    [negative_df, positive_df],
    ignore_index=True
)

print("\nPositive and Negative reviews.")

# REMOVE NULL VALUES

master_df = master_df.dropna()

# REMOVE EMPTY REVIEWS

master_df = master_df[
    master_df["review"].str.strip() != ""]

# REMOVE PLACEHOLDER REVIEWS

master_df = master_df[
    master_df["review"] != "No Negative"]

master_df = master_df[
    master_df["review"] != "No Positive"]

# REMOVE DUPLICATES

master_df = master_df.drop_duplicates()

# RESET INDEX

master_df = master_df.reset_index(drop=True)

# CREATE REVIEW ID

master_df["review_id"] = range(1, len(master_df) + 1)

# REORDER COLUMNS

master_df = master_df[
    [
        "review_id",
        "hotel_name",
        "review_date",
        "review",
        "sentiment",
        "score"
    ]
]

# SHOW FINAL DATASET INFO

print("\nFinal Dataset Shape:")
print(master_df.shape)

print("\nSentiment Distribution:")
print(master_df["sentiment"].value_counts())

print("\nSample Data:")
print(master_df.head())

# SAVE MASTER DATASET

output_path = "data/processed/master_reviews.csv"

master_df.to_csv(output_path, index=False)

# FINISH MESSAGE

print("MASTER DATASET CREATED SUCCESSFULLY")

print(f"\nSaved Location:")
print(output_path)