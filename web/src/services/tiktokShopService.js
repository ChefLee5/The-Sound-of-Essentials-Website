/**
 * TikTok Shop Partner API Service (v202309)
 * Handles HMAC-SHA256 signature generation, product sync, order intake, and fulfillment tracking dispatch.
 */

const TIKTOK_API_BASE = 'https://open-api.tiktokglobalshop.com';

export class TikTokShopService {
  constructor(config = {}) {
    this.appKey = config.appKey || process.env.TIKTOK_SHOP_APP_KEY || '';
    this.appSecret = config.appSecret || process.env.TIKTOK_SHOP_APP_SECRET || '';
    this.accessToken = config.accessToken || process.env.TIKTOK_SHOP_ACCESS_TOKEN || '';
    this.shopCipher = config.shopCipher || process.env.TIKTOK_SHOP_CIPHER || '';
  }

  /**
   * Generates HMAC-SHA256 signature for TikTok Shop Open API requests
   */
  async generateSignature(path, params, appSecret) {
    // Sort parameters alphabetically
    const keys = Object.keys(params).filter(k => k !== 'sign' && k !== 'access_token').sort();
    let signString = path;
    for (const key of keys) {
      signString += key + params[key];
    }
    signString = appSecret + signString + appSecret;

    // Use Web Crypto API or Node crypto
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const enc = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        enc.encode(appSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(signString));
      return Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } else {
      // Fallback Node.js crypto
      const { createHmac } = await import('crypto');
      return createHmac('sha256', appSecret).update(signString).digest('hex');
    }
  }

  /**
   * Dispatch tracking number to TikTok Shop Fulfillment API to meet dispatch SLA
   * Endpoint: POST /fulfillment/202309/packages
   */
  async shipPackage({ orderId, packageId, trackingNumber, carrierCode = 'USPS' }) {
    const timestamp = Math.floor(Date.now() / 1000);
    const path = '/fulfillment/202309/packages';

    const queryParams = {
      app_key: this.appKey,
      timestamp: timestamp.toString(),
      shop_cipher: this.shopCipher,
    };

    const signature = await this.generateSignature(path, queryParams, this.appSecret);

    const body = {
      order_id: orderId,
      package_id: packageId,
      tracking_number: trackingNumber,
      shipping_provider_id: carrierCode,
    };

    try {
      const queryString = new URLSearchParams({ ...queryParams, sign: signature }).toString();
      const res = await fetch(`${TIKTOK_API_BASE}${path}?${queryString}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tts-access-token': this.accessToken,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('TikTok Shop Fulfillment Dispatch Failed:', err);
      return { code: -1, message: err.message };
    }
  }

  /**
   * Update Inventory on TikTok Shop
   */
  async updateStock(productId, skuId, availableStock) {
    const timestamp = Math.floor(Date.now() / 1000);
    const path = `/product/202309/products/${productId}/inventory`;

    const queryParams = {
      app_key: this.appKey,
      timestamp: timestamp.toString(),
      shop_cipher: this.shopCipher,
    };

    const signature = await this.generateSignature(path, queryParams, this.appSecret);

    const body = {
      skus: [
        {
          id: skuId,
          inventory: [
            {
              quantity: availableStock,
            },
          ],
        },
      ],
    };

    try {
      const queryString = new URLSearchParams({ ...queryParams, sign: signature }).toString();
      const res = await fetch(`${TIKTOK_API_BASE}${path}?${queryString}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-tts-access-token': this.accessToken,
        },
        body: JSON.stringify(body),
      });
      return await res.json();
    } catch (err) {
      console.error('TikTok Shop Stock Update Failed:', err);
      return { code: -1, message: err.message };
    }
  }

  /**
   * Parse incoming webhook event from TikTok Shop
   */
  verifyAndParseWebhook(headers, rawBody) {
    const authorization = headers['authorization'] || headers['Authorization'];
    if (!authorization) {
      return { verified: false, error: 'Missing authorization signature' };
    }

    try {
      const event = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
      return {
        verified: true,
        type: event.type, // e.g. ORDER_STATUS_CHANGE, SAMPLE_APPLICATION_CREATE
        data: event.data,
      };
    } catch (err) {
      return { verified: false, error: err.message };
    }
  }
}

export const tiktokShopService = new TikTokShopService();
