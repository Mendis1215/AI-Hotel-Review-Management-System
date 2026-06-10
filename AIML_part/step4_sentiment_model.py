import pandas as pd
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
import os

from scipy import sparse

from sklearn.model_selection import (
    train_test_split,
    GridSearchCV,
    cross_val_score
)

from sklearn.linear_model import LogisticRegression

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

# =====================================================
# STEP 4 — SENTIMENT MODEL TRAINING
# =====================================================

print("SENTIMENT MODEL TRAINING")

# =====================================================
# CREATE DIRECTORIES
# =====================================================

os.makedirs("models", exist_ok=True)

os.makedirs("Reports/figures", exist_ok=True)

os.makedirs("Reports/results", exist_ok=True)

# =====================================================
# LOAD FEATURE DATASET
# =====================================================

print("\nLoading datasets...")

df = pd.read_csv(
    "data/processed/final_features.csv"
)

X = sparse.load_npz(
    "data/processed/features.npz"
)

print("Datasets loaded successfully!")

print("\nFeature Matrix Shape:")
print(X.shape)

# =====================================================
# CREATE TARGET LABELS
# =====================================================

print("\nEncoding sentiment labels...")

y = df["sentiment"].map({
    "Positive": 1,
    "Negative": 0
})

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
# MODEL 1 — DEFAULT LOGISTIC REGRESSION
# =====================================================

print("MODEL 1 — DEFAULT LOGISTIC REGRESSION")

model_1 = LogisticRegression(
    max_iter=1000
)

model_1.fit(X_train, y_train)

y_pred_1 = model_1.predict(X_test)

# =====================================================
# EVALUATION FUNCTION
# =====================================================

def evaluate_model(model_name, y_true, y_pred):

    accuracy = accuracy_score(y_true, y_pred)

    precision = precision_score(y_true, y_pred)

    recall = recall_score(y_true, y_pred)

    f1 = f1_score(y_true, y_pred)

    roc_auc = roc_auc_score(y_true, y_pred)

    print(f"\n{model_name} Results")

    print("--------------------------------")

    print(f"Accuracy  : {accuracy:.4f}")

    print(f"Precision : {precision:.4f}")

    print(f"Recall    : {recall:.4f}")

    print(f"F1 Score  : {f1:.4f}")

    print(f"ROC-AUC   : {roc_auc:.4f}")

    print("\nClassification Report:\n")

    print(classification_report(y_true, y_pred))

    return {
        "Model": model_name,
        "Accuracy": accuracy,
        "Precision": precision,
        "Recall": recall,
        "F1 Score": f1,
        "ROC-AUC": roc_auc
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
# MODEL 2 — MANUAL TUNING
# =====================================================

print("MODEL 2 — MANUAL TUNING")

model_2 = LogisticRegression(
    C=0.5,
    solver="liblinear",
    max_iter=1500
)

model_2.fit(X_train, y_train)

y_pred_2 = model_2.predict(X_test)

results.append(
    evaluate_model(
        "Manual Tuned Logistic Regression",
        y_test,
        y_pred_2
    )
)

# =====================================================
# MODEL 3 — GRID SEARCH CV
# =====================================================

print("MODEL 3 — GRID SEARCH CV")

param_grid = {
    "C": [0.1, 0.5, 1.0],
    "solver": ["liblinear", "lbfgs"],
    "max_iter": [1000, 1500]
}

grid_model = GridSearchCV(
    LogisticRegression(),
    param_grid,
    cv=5,
    scoring="f1",
    verbose=1,
    n_jobs=-1
)

grid_model.fit(X_train, y_train)

best_model = grid_model.best_estimator_

print("\nBest Parameters:")

print(grid_model.best_params_)

y_pred_3 = best_model.predict(X_test)

results.append(
    evaluate_model(
        "GridSearchCV Logistic Regression",
        y_test,
        y_pred_3
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
    scoring="f1"
)

print("\nCross Validation Scores:")

print(cv_scores)

print("\nAverage CV Score:")

print(cv_scores.mean())

# =====================================================
# CONFUSION MATRIX
# =====================================================

cm = confusion_matrix(y_test, y_pred_3)

plt.figure(figsize=(6,5))

sns.heatmap(
    cm,
    annot=True,
    fmt="d",
    cmap="Blues"
)

plt.title("Confusion Matrix")

plt.xlabel("Predicted")

plt.ylabel("Actual")

plt.tight_layout()

plt.savefig(
    "Reports/figures/confusion_matrix.png"
)

plt.close()

# =====================================================
# SAVE BEST MODEL
# =====================================================

joblib.dump(
    best_model,
    "models/sentiment_model.pkl"
)

print("\nBest model saved successfully!")

# =====================================================
# SAVE RESULTS TABLE
# =====================================================

results_df = pd.DataFrame(results)

results_df.to_csv(
    "Reports/results/model_comparison.csv",
    index=False
)

# =====================================================
# SHOW MODEL COMPARISON
# =====================================================

print("MODEL COMPARISON")

print(results_df)

# =====================================================
# FINAL SUMMARY
# =====================================================

print("STEP 4 COMPLETED SUCCESSFULLY")

print("\n1. Best Sentiment Model:")
print("   models/sentiment_model.pkl")

print("\n2. Model Comparison Report:")
print("   Reports/results/model_comparison.csv")

print("\n3. Confusion Matrix Figure:")
print("   Reports/figures/confusion_matrix.png")