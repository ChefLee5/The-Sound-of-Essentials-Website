/**
 * CJ Dropshipping Integration Service
 * Handles sourcing verification, order creation, inventory lookup, and tracking synchronization.
 */

const CJ_API_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';

export class CJDropshipService {
  constructor(apiKey = process.env.CJ_API_KEY || '') {
    this.apiKey = apiKey;
    this.accessToken = null;
  }

  /**
   * Get or refresh CJ Access Token
   */
  async getAccessToken(email, password) {
    try {
      const res = await fetch(`${CJ_API_BASE}/authentication/getAccessToken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.result && data.data) {
        this.accessToken = data.data.accessToken;
        return this.accessToken;
      }
      throw new Error(data.message || 'Failed to authenticate with CJ Dropshipping');
    } catch (err) {
      console.error('CJ Auth Error:', err);
      throw err;
    }
  }

  /**
   * Search for products in CJ US Warehouse
   */
  async searchUSWarehouseProducts(keyword = 'kids headphones 85dB') {
    try {
      const res = await fetch(`${CJ_API_BASE}/product/list?keyWord=${encodeURIComponent(keyword)}&countryCode=US&pageNum=1&pageSize=20`, {
        headers: {
          'CJ-Access-Token': this.accessToken || this.apiKey,
        },
      });
      return await res.json();
    } catch (err) {
      console.error('CJ Search Error:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Create an automated Dropshipping Purchase Order on CJ
   */
  async createDropshipOrder(orderData) {
    const {
      orderNumber,
      customerName,
      phone,
      shippingAddress,
      items, // [{ sku: 'CJ-HEADPHONE-85DB-01', quantity: 1 }]
    } = orderData;

    const payload = {
      orderNumber: orderNumber,
      shippingCountryCode: 'US',
      shippingCountry: 'United States',
      shippingProvince: shippingAddress.state,
      shippingCity: shippingAddress.city,
      shippingAddress: shippingAddress.street,
      shippingCustomerName: customerName,
      shippingZip: shippingAddress.zip,
      shippingPhone: phone || '000-000-0000',
      products: items.map(item => ({
        vid: item.variantId || item.sku,
        quantity: item.quantity || 1,
      })),
      remark: 'The Sound of Essentials - Just Add Headphones Sourcing Order',
    };

    try {
      const res = await fetch(`${CJ_API_BASE}/shopping/order/createOrderV2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CJ-Access-Token': this.accessToken || this.apiKey,
        },
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch (err) {
      console.error('CJ Order Creation Failed:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Query tracking details for an existing supplier order
   */
  async getOrderTracking(cjOrderId) {
    try {
      const res = await fetch(`${CJ_API_BASE}/shopping/order/getOrderDetail?orderId=${encodeURIComponent(cjOrderId)}`, {
        headers: {
          'CJ-Access-Token': this.accessToken || this.apiKey,
        },
      });
      const data = await res.json();
      if (data.result && data.data && data.data.trackNumber) {
        return {
          trackingNumber: data.data.trackNumber,
          carrier: data.data.logisticName || 'USPS',
          status: data.data.orderStatus,
        };
      }
      return null;
    } catch (err) {
      console.error('CJ Tracking Query Error:', err);
      return null;
    }
  }
}

export const cjDropshipService = new CJDropshipService();
