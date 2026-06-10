import os
import json
from dotenv import load_dotenv

# Load environment variables from .env file
# We get the absolute path to the .env file in the project root
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=env_path)

# Get API key and Database URI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MONGODB_URI = os.getenv("MONGODB_URI")

# Load cluster mapping JSON
CLUSTER_MAPPING_PATH = os.path.join(os.path.dirname(__file__), "cluster_mapping.json")

def get_cluster_mapping():
    with open(CLUSTER_MAPPING_PATH, "r") as f:
        return json.load(f)

CLUSTER_MAPPING = get_cluster_mapping()
