import os

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
    class Settings(BaseSettings):
        PROJECT_NAME: str = "SOE Market Campaign Launch System"
        BASE_DOMAIN: str = "https://soelearn.com"
        
        # Meta API
        META_ACCESS_TOKEN: str = "mock_meta_token"
        META_AD_ACCOUNT_ID: str = "act_000000000"
        META_PIXEL_ID: str = "000000000000"
        META_PAGE_ID: str = "000000000000"
        META_API_VERSION: str = "v21.0"
        
        # Stripe
        STRIPE_SECRET_KEY: str = "sk_test_mock"
        STRIPE_WEBHOOK_SECRET: str = "whsec_mock"
        
        # Brevo CRM
        BREVO_API_KEY: str = "xkeysib-mock"
        BREVO_SENDER_EMAIL: str = "info@soelearn.com"
        BREVO_SENDER_NAME: str = "The Sound of Essentials"
        
        # AI Creative Providers
        GEMINI_API_KEY: str = "mock_gemini_key"
        FAL_KEY: str = "mock_fal_key"

        # Pinterest API v5
        PINTEREST_ACCESS_TOKEN: str = "mock_pinterest_token"
        PINTEREST_AD_ACCOUNT_ID: str = "000000000000"
        PINTEREST_TAG_ID: str = "000000000000"
        PINTEREST_API_VERSION: str = "v5"

        model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    settings = Settings()

except ImportError:
    class FallbackSettings:
        PROJECT_NAME: str = os.getenv("PROJECT_NAME", "SOE Market Campaign Launch System")
        BASE_DOMAIN: str = os.getenv("BASE_DOMAIN", "https://soelearn.com")
        META_ACCESS_TOKEN: str = os.getenv("META_ACCESS_TOKEN", "mock_meta_token")
        META_AD_ACCOUNT_ID: str = os.getenv("META_AD_ACCOUNT_ID", "act_000000000")
        META_PIXEL_ID: str = os.getenv("META_PIXEL_ID", "000000000000")
        META_PAGE_ID: str = os.getenv("META_PAGE_ID", "000000000000")
        META_API_VERSION: str = os.getenv("META_API_VERSION", "v21.0")
        STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "sk_test_mock")
        STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_mock")
        BREVO_API_KEY: str = os.getenv("BREVO_API_KEY", "xkeysib-mock")
        BREVO_SENDER_EMAIL: str = os.getenv("BREVO_SENDER_EMAIL", "info@soelearn.com")
        BREVO_SENDER_NAME: str = os.getenv("BREVO_SENDER_NAME", "The Sound of Essentials")
        GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "mock_gemini_key")
        FAL_KEY: str = os.getenv("FAL_KEY", "mock_fal_key")
        PINTEREST_ACCESS_TOKEN: str = os.getenv("PINTEREST_ACCESS_TOKEN", "mock_pinterest_token")
        PINTEREST_AD_ACCOUNT_ID: str = os.getenv("PINTEREST_AD_ACCOUNT_ID", "000000000000")
        PINTEREST_TAG_ID: str = os.getenv("PINTEREST_TAG_ID", "000000000000")
        PINTEREST_API_VERSION: str = os.getenv("PINTEREST_API_VERSION", "v5")

    settings = FallbackSettings()
