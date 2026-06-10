import subprocess
import sys
import time

# HOTEL REVIEW AI SYSTEM — FULL PIPELINE RUNNER

print("HOTEL REVIEW AI SYSTEM")
print("FULL PIPELINE RUNNER")

# DEFINE PIPELINE STEPS

steps = [
    ("Step 1", "step1_master_dataset.py"),
    ("Step 2", "step2_preprocessing.py"),
    ("Step 3", "step3_feature_engineering.py"),
    ("Step 4", "step4_sentiment_model.py"),
    ("Step 5a", "step5_balanced_dataset.py"),
    ("Step 5b", "step5_train_category_model.py"),
    ("Step 6", "step6_kmeans_clustering.py"),
]

# RUN EACH STEP

for step_name, script_name in steps:

    print(f"\n{'='*50}")
    print(f"RUNNING {step_name}: {script_name}")
    print(f"{'='*50}\n")

    start_time = time.time()

    result = subprocess.run(
        [sys.executable, script_name],
        capture_output=False
    )

    elapsed = time.time() - start_time

    # CHECK IF STEP FAILED

    if result.returncode != 0:

        print(f"\n*** ERROR: {step_name} FAILED ***")
        print(f"Script: {script_name}")
        print("Pipeline stopped.")
        sys.exit(1)

    print(f"\n{step_name} completed in {elapsed:.1f} seconds")

# PIPELINE COMPLETE

print(f"\n{'='*50}")
print("ALL STEPS COMPLETED SUCCESSFULLY")
print(f"{'='*50}")
