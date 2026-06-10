import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import os
import numpy as np

from scipy import sparse

from sklearn.feature_extraction.text import TfidfVectorizer

from sklearn.model_selection import (
    train_test_split,
    GridSearchCV,
    cross_val_score
)

from sklearn.linear_model import LogisticRegression

from sklearn.preprocessing import LabelEncoder

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)

# =====================================================
# STEP 5 — TRAIN CATEGORY MODEL
# =====================================================

print("BALANCED CATEGORY MODEL TRAINING")

# =====================================================
# CREATE DIRECTORIES
# =====================================================

os.makedirs("models", exist_ok=True)

os.makedirs("Reports/figures", exist_ok=True)

os.makedirs("Reports/results", exist_ok=True)

os.makedirs("data/processed", exist_ok=True)

# =====================================================
# LOAD BALANCED DATASET
# =====================================================


df = pd.read_csv(
    "data/processed/balanced_category_reviews.csv"
)

print("Dataset loaded successfully!")

print("\nDataset Shape:")
print(df.shape)

# =====================================================
# REMOVE NULL VALUES
# =====================================================

df = df.dropna(subset=["clean_review"])

df = df[
    df["clean_review"].str.strip() != ""
]

df = df.reset_index(drop=True)

# =====================================================
# CATEGORY DISTRIBUTION
# =====================================================

print("\nCategory Distribution:\n")

print(df["category"].value_counts())

# =====================================================
# CATEGORY DISTRIBUTION FIGURE
# =====================================================

plt.figure(figsize=(7,5))

sns.countplot(
    x="category",
    data=df
)

plt.title("Balanced Category Distribution")

plt.xlabel("Category")

plt.ylabel("Count")

plt.tight_layout()

plt.savefig(
    "Reports/figures/balanced_category_distribution.png"
)

plt.close()

# =====================================================
# TF-IDF FEATURE ENGINEERING
# =====================================================

print("\nCreating TF-IDF features...")

vectorizer = TfidfVectorizer(
    max_features=4000,
    ngram_range=(1,2),
    dtype=np.float64
)

X = vectorizer.fit_transform(
    df["clean_review"]
)

print("\nFeature Matrix Shape:")
print(X.shape)

# =====================================================
# SAVE CATEGORY FEATURES
# =====================================================

sparse.save_npz(
    "data/processed/category_features.npz",
    X
)

joblib.dump(
    vectorizer,
    "models/category_vectorizer.pkl"
)

# =====================================================
# LABEL ENCODING
# =====================================================

label_encoder = LabelEncoder()

y = label_encoder.fit_transform(
    df["category"]
)

# =====================================================
# TRAIN TEST SPLIT
# =====================================================

print("\nSplitting dataset...")

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\nTraining Shape:")
print(X_train.shape)

print("\nTesting Shape:")
print(X_test.shape)

# =====================================================
# MODEL 1 — DEFAULT MODEL
# =====================================================

print("MODEL 1 — DEFAULT LOGISTIC REGRESSION")

model_1 = LogisticRegression(
    max_iter=1500,
    class_weight="balanced"
)

model_1.fit(X_train, y_train)

y_pred_1 = model_1.predict(X_test)

# =====================================================
# EVALUATION FUNCTION
# =====================================================

def evaluate_model(model_name, y_true, y_pred):

    accuracy = accuracy_score(
        y_true,
        y_pred
    )

    precision = precision_score(
        y_true,
        y_pred,
        average="weighted"
    )

    recall = recall_score(
        y_true,
        y_pred,
        average="weighted"
    )

    f1 = f1_score(
        y_true,
        y_pred,
        average="weighted"
    )

    print(f"\n{model_name}")

    print("--------------------------------")

    print(f"Accuracy  : {accuracy:.4f}")

    print(f"Precision : {precision:.4f}")

    print(f"Recall    : {recall:.4f}")

    print(f"F1 Score  : {f1:.4f}")

    print("\nClassification Report:\n")

    report = classification_report(
        y_true,
        y_pred,
        target_names=label_encoder.classes_
    )

    print(report)

    return {
        "Model": model_name,
        "Accuracy": accuracy,
        "Precision": precision,
        "Recall": recall,
        "F1 Score": f1
    }

# =====================================================
# EVALUATE MODEL 1
# =====================================================

results = []

results.append(
    evaluate_model(
        "Default Logistic Regression",
        y_test,
        y_pred_1
    )
)

# =====================================================
# MODEL 2 — GRID SEARCH
# =====================================================

print("\n====================================")
print("MODEL 2 — GRID SEARCH CV")
print("====================================")

param_grid = {
    "C": [0.1, 0.5, 1.0],
    "solver": ["lbfgs", "saga"]
}

grid_model = GridSearchCV(
    LogisticRegression(
        max_iter=1500,
        class_weight="balanced"
    ),
    param_grid,
    cv=5,
    scoring="f1_weighted",
    verbose=1,
    n_jobs=-1
)

grid_model.fit(X_train, y_train)

best_model = grid_model.best_estimator_

print("\nBest Parameters:")

print(grid_model.best_params_)

y_pred_2 = best_model.predict(X_test)

results.append(
    evaluate_model(
        "GridSearchCV Logistic Regression",
        y_test,
        y_pred_2
    )
)

# =====================================================
# CROSS VALIDATION
# =====================================================

print("5-FOLD CROSS VALIDATION")

cv_scores = cross_val_score(
    best_model,
    X,
    y,
    cv=5,
    scoring="f1_weighted"
)

print("\nCross Validation Scores:")

print(cv_scores)

print("\nAverage CV Score:")

print(cv_scores.mean())

# =====================================================
# CONFUSION MATRIX
# =====================================================

cm = confusion_matrix(
    y_test,
    y_pred_2
)

plt.figure(figsize=(8,6))

sns.heatmap(
    cm,
    annot=True,
    fmt="d",
    cmap="Blues",
    xticklabels=label_encoder.classes_,
    yticklabels=label_encoder.classes_
)

plt.title("Category Classification Confusion Matrix")

plt.xlabel("Predicted")

plt.ylabel("Actual")

plt.tight_layout()

plt.savefig(
    "Reports/figures/category_confusion_matrix.png"
)

plt.close()

# =====================================================
# SAVE MODEL
# =====================================================

joblib.dump(
    best_model,
    "models/category_model.pkl"
)

joblib.dump(
    label_encoder,
    "models/category_label_encoder.pkl"
)

print("\nBest model saved successfully!")

# =====================================================
# SAVE RESULTS CSV
# =====================================================

results_df = pd.DataFrame(results)

results_df.to_csv(
    "Reports/results/category_model_comparison.csv",
    index=False
)

# =====================================================
# FINAL SUMMARY
# =====================================================

print("STEP 5 COMPLETED SUCCESSFULLY")


print("1. models/category_model.pkl")

print("2. models/category_label_encoder.pkl")

print("3. models/category_vectorizer.pkl")


print("1. data/processed/category_features.npz")


print("1. Reports/results/category_model_comparison.csv")


print("1. Reports/figures/balanced_category_distribution.png")

print("2. Reports/figures/category_confusion_matrix.png")