import os

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
    class Settings(BaseSettings):
        PROJECT_NAME: str = "SOE Market Campaign Launch System"
        BASE_DOMAIN: str = "https://soelearn.com"
        
        # Meta API (Cooldown due to automation limits; kept paused)
        META_ACCESS_TOKEN: str = "mock_meta_token"
        META_AD_ACCOUNT_ID: str = "act_000000000"
        META_PIXEL_ID: str = "000000000000"
        META_PAGE_ID: str = "000000000000"
        META_API_VERSION: str = "v21.0"
        META_AUTOMATION_STATUS: str = "PAUSED_AUTOMATION_COOLDOWN"

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

        # Google Ads API
        GOOGLE_ADS_CUSTOMER_ID: str = "000-000-0000"
        GOOGLE_ADS_DEVELOPER_TOKEN: str = "mock_google_dev_token"
        GOOGLE_ADS_CONVERSION_ID: str = ""

        # X.com Ads & AT Protocol
        X_ADS_ACCOUNT_ID: str = "mock_x_ads_acct"
        X_BEARER_TOKEN: str = "mock_x_bearer_token"
        ATPROTO_HANDLE: str = ""
        ATPROTO_APP_PASSWORD: str = ""

        # Reddit Ads API v3
        REDDIT_AD_ACCOUNT_ID: str = "mock_reddit_acct"
        REDDIT_ACCESS_TOKEN: str = "mock_reddit_token"

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
        META_AUTOMATION_STATUS: str = os.getenv("META_AUTOMATION_STATUS", "PAUSED_AUTOMATION_COOLDOWN")
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
        GOOGLE_ADS_CUSTOMER_ID: str = os.getenv("GOOGLE_ADS_CUSTOMER_ID", "000-000-0000")
        GOOGLE_ADS_DEVELOPER_TOKEN: str = os.getenv("GOOGLE_ADS_DEVELOPER_TOKEN", "mock_google_dev_token")
        GOOGLE_ADS_CONVERSION_ID: str = os.getenv("GOOGLE_ADS_CONVERSION_ID", "")
        X_ADS_ACCOUNT_ID: str = os.getenv("X_ADS_ACCOUNT_ID", "mock_x_ads_acct")
        X_BEARER_TOKEN: str = os.getenv("X_BEARER_TOKEN", "mock_x_bearer_token")
        ATPROTO_HANDLE: str = os.getenv("ATPROTO_HANDLE", "")
        ATPROTO_APP_PASSWORD: str = os.getenv("ATPROTO_APP_PASSWORD", "")
        REDDIT_AD_ACCOUNT_ID: str = os.getenv("REDDIT_AD_ACCOUNT_ID", "mock_reddit_acct")
        REDDIT_ACCESS_TOKEN: str = os.getenv("REDDIT_ACCESS_TOKEN", "mock_reddit_token")

    settings = FallbackSettings()
