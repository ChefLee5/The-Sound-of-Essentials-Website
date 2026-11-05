import os

class HaystackConfig:
    PROJECT_NAME: str = "SOE Haystack Enterprise RAG Engine"
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    DEFAULT_MODEL: str = os.getenv("HAYSTACK_MODEL", "google/gemini-2.5-flash")
    DOC_STORE_TYPE: str = "in_memory" # in_memory or sqlite
    TOP_K_RETRIEVAL: int = 4
    MIN_SIMILARITY_SCORE: float = 0.55
    DATA_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "web", "src", "data"))

haystack_config = HaystackConfig()
