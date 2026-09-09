-- ==============================================================================
-- Sound of Essentials (SOE) - Dropshipping & TikTok Shop CRM Schema Extension
-- ==============================================================================

-- 1. Products Catalog (Including "Just Add Headphones" Dropship Hardware)
CREATE TABLE IF NOT EXISTS shop_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    category VARCHAR(100) DEFAULT 'Audio & Sensory Electronics',
    cost_price NUMERIC(10,2) NOT NULL DEFAULT 5.50,
    selling_price NUMERIC(10,2) NOT NULL DEFAULT 24.99,
    compare_at_price NUMERIC(10,2) DEFAULT 34.99,
    supplier_name VARCHAR(100) DEFAULT 'CJ Dropshipping',
    supplier_sku VARCHAR(100),
    supplier_product_id VARCHAR(150),
    supplier_url VARCHAR(500),
    tiktok_product_id VARCHAR(100),
    tiktok_sync_status VARCHAR(50) DEFAULT 'not_synced' CHECK (tiktok_sync_status IN ('not_synced', 'pending_review', 'live', 'rejected')),
    inventory_count INT DEFAULT 100,
    is_dropship BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    specs_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_shop_products_slug ON shop_products(slug);
CREATE INDEX IF NOT EXISTS idx_shop_products_tiktok_sync ON shop_products(tiktok_sync_status);

-- 2. Multi-Channel Orders (Web Store + TikTok Shop)
CREATE TABLE IF NOT EXISTS shop_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    source VARCHAR(50) NOT NULL DEFAULT 'tiktok_shop' CHECK (source IN ('tiktok_shop', 'web_store', 'manual')),
    external_order_id VARCHAR(100),
    contact_id UUID REFERENCES crm_contacts(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    shipping_fee NUMERIC(10,2) DEFAULT 0.00,
    platform_fee NUMERIC(10,2) DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    payment_status VARCHAR(50) DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled' CHECK (fulfillment_status IN ('unfulfilled', 'processing', 'dispatched', 'in_transit', 'delivered', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_shop_orders_order_number ON shop_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_shop_orders_source ON shop_orders(source);
CREATE INDEX IF NOT EXISTS idx_shop_orders_fulfillment ON shop_orders(fulfillment_status);
CREATE INDEX IF NOT EXISTS idx_shop_orders_created_at ON shop_orders(created_at DESC);

-- 3. Dropship Sourcing & Carrier Fulfillment Sync
CREATE TABLE IF NOT EXISTS dropship_fulfillments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES shop_orders(id) ON DELETE CASCADE,
    supplier VARCHAR(50) NOT NULL DEFAULT 'cj_dropshipping' CHECK (supplier IN ('cj_dropshipping', 'autods', 'usadrop', 'manual')),
    supplier_order_id VARCHAR(100),
    tracking_number VARCHAR(100),
    carrier_code VARCHAR(50) DEFAULT 'USPS',
    carrier_name VARCHAR(100) DEFAULT 'United States Postal Service',
    tracking_url VARCHAR(500),
    fulfillment_status VARCHAR(50) DEFAULT 'pending' CHECK (fulfillment_status IN ('pending', 'ordered', 'shipped', 'delivered', 'failed')),
    synced_to_tiktok BOOLEAN DEFAULT FALSE,
    tiktok_package_id VARCHAR(100),
    synced_to_tiktok_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dropship_fulfillments_order ON dropship_fulfillments(order_id);
CREATE INDEX IF NOT EXISTS idx_dropship_fulfillments_tracking ON dropship_fulfillments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_dropship_fulfillments_tiktok_sync ON dropship_fulfillments(synced_to_tiktok);

-- 4. TikTok Creator Sample & Affiliate CRM Pipeline
CREATE TABLE IF NOT EXISTS creator_samples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES crm_contacts(id) ON DELETE SET NULL,
    creator_handle VARCHAR(100) NOT NULL,
    platform VARCHAR(50) DEFAULT 'tiktok' CHECK (platform IN ('tiktok', 'instagram', 'youtube')),
    follower_count INT DEFAULT 0,
    niche VARCHAR(100) DEFAULT 'Parenting / Early Learning',
    sample_product_id UUID REFERENCES shop_products(id) ON DELETE SET NULL,
    stage VARCHAR(50) DEFAULT 'sample_requested' CHECK (stage IN ('sample_requested', 'sample_approved', 'sample_shipped', 'sample_delivered', 'video_posted', 'top_affiliate', 'declined')),
    tracking_number VARCHAR(100),
    video_url VARCHAR(500),
    video_views INT DEFAULT 0,
    attributed_orders INT DEFAULT 0,
    attributed_gmv NUMERIC(10,2) DEFAULT 0.00,
    commission_rate NUMERIC(5,2) DEFAULT 15.00,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_creator_samples_handle ON creator_samples(creator_handle);
CREATE INDEX IF NOT EXISTS idx_creator_samples_stage ON creator_samples(stage);
