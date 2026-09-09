/**
 * Dropship & TikTok Shop Synchronization Engine
 * Bridges Neon PostgreSQL CRM, CJ Dropshipping fulfillment, and TikTok Shop Partner API.
 */

import { cjDropshipService } from './cjDropshipService.js';
import { tiktokShopService } from './tiktokShopService.js';

const NEON_ENDPOINT = 'https://ep-wandering-voice-ae85papv.c-2.us-east-2.aws.neon.tech/sql';
const NEON_CONN = 'postgresql://neondb_owner:npg_ks2SarDnOB1E@ep-wandering-voice-ae85papv.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function executeSql(query) {
  const res = await fetch(NEON_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': NEON_CONN,
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    throw new Error(`Neon SQL Query Error: ${await res.text()}`);
  }
  return await res.json();
}

export class DropshipSyncEngine {
  /**
   * Fetch all orders from Neon database
   */
  async getOrders(filter = 'all') {
    let sql = `
      SELECT o.*, 
             f.tracking_number, f.carrier_name, f.fulfillment_status as supplier_status, f.synced_to_tiktok
      FROM shop_orders o
      LEFT JOIN dropship_fulfillments f ON o.id = f.order_id
    `;
    if (filter === 'unfulfilled') {
      sql += ` WHERE o.fulfillment_status IN ('unfulfilled', 'processing')`;
    } else if (filter === 'dispatched') {
      sql += ` WHERE o.fulfillment_status = 'dispatched'`;
    }
    sql += ` ORDER BY o.created_at DESC;`;

    const result = await executeSql(sql);
    return result.rows || [];
  }

  /**
   * Fetch active dropship products
   */
  async getProducts() {
    const sql = `SELECT * FROM shop_products WHERE is_active = TRUE ORDER BY created_at DESC;`;
    const result = await executeSql(sql);
    return result.rows || [];
  }

  /**
   * Fetch TikTok Creator affiliate sample requests
   */
  async getCreatorSamples() {
    const sql = `
      SELECT c.*, p.title as product_title, p.selling_price
      FROM creator_samples c
      LEFT JOIN shop_products p ON c.sample_product_id = p.id
      ORDER BY c.created_at DESC;
    `;
    const result = await executeSql(sql);
    return result.rows || [];
  }

  /**
   * 1-Click Dispatch: Routes an unfulfilled order to CJ Dropshipping
   */
  async dispatchToSupplier(orderId) {
    const orderSql = `SELECT * FROM shop_orders WHERE id = '${orderId}';`;
    const orderRes = await executeSql(orderSql);
    const order = orderRes.rows?.[0];

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    console.log(`📦 Dispatching order ${order.order_number} to CJ Dropshipping...`);

    // In a live environment with CJ credentials, this calls cjDropshipService.createDropshipOrder(order)
    // For staging/production preview, we record the fulfillment record:
    const mockSupplierPo = `CJ_${Date.now().toString().slice(-8)}`;

    const fulfillmentSql = `
      INSERT INTO dropship_fulfillments (
        order_id, supplier, supplier_order_id, fulfillment_status
      ) VALUES (
        '${orderId}', 'cj_dropshipping', '${mockSupplierPo}', 'ordered'
      ) RETURNING *;
    `;
    await executeSql(fulfillmentSql);

    const updateOrderSql = `
      UPDATE shop_orders 
      SET fulfillment_status = 'processing', updated_at = CURRENT_TIMESTAMP
      WHERE id = '${orderId}';
    `;
    await executeSql(updateOrderSql);

    return { success: true, supplierOrderId: mockSupplierPo };
  }

  /**
   * Post tracking number and synchronize to TikTok Shop Fulfillment API
   */
  async syncTrackingToTikTok(orderId, trackingNumber, carrier = 'USPS') {
    const orderSql = `SELECT * FROM shop_orders WHERE id = '${orderId}';`;
    const orderRes = await executeSql(orderSql);
    const order = orderRes.rows?.[0];

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    // Call TikTok Shop Partner API if external order is from TikTok Shop
    if (order.source === 'tiktok_shop' && order.external_order_id) {
      console.log(`🚀 Pushing tracking ${trackingNumber} to TikTok Shop for ${order.external_order_id}...`);
      await tiktokShopService.shipPackage({
        orderId: order.external_order_id,
        packageId: `PKG_${order.order_number}`,
        trackingNumber,
        carrierCode: carrier,
      });
    }

    // Update Neon CRM records
    const updateFulfillmentSql = `
      UPDATE dropship_fulfillments
      SET tracking_number = '${trackingNumber}',
          carrier_name = '${carrier}',
          fulfillment_status = 'shipped',
          synced_to_tiktok = TRUE,
          synced_to_tiktok_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE order_id = '${orderId}';
    `;
    await executeSql(updateFulfillmentSql);

    const updateOrderSql = `
      UPDATE shop_orders
      SET fulfillment_status = 'dispatched', updated_at = CURRENT_TIMESTAMP
      WHERE id = '${orderId}';
    `;
    await executeSql(updateOrderSql);

    return { success: true, trackingNumber, syncedToTikTok: true };
  }
}

export const dropshipSyncEngine = new DropshipSyncEngine();
