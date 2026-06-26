'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

import { requireAdmin } from '@/lib/auth'
import { useWalletBalance } from './wallet'
import { creditReferrerReward } from './referral'

export async function validateCheckout(items: any[]) {
  const supabase = await createClient()
  for (const item of items) {
    const { data: product } = await supabase.from('products').select('name, description').eq('id', item.product_id).single();
    if (!product) return { error: `Product not found` };

    if (item.size) {
      // First try the separate table
      const { data: variant } = await supabase.from('product_variants').select('stock').eq('product_id', item.product_id).eq('size', item.size).single();
      
      let stock = -1;
      
      if (variant) {
        stock = variant.stock;
      } else {
        // Fallback to description JSON meta.sizes
        let meta: any = {};
        try { meta = JSON.parse(product.description || '{}') } catch (e) {}
        const jsonVariant = (meta.sizes || []).find((s: any) => s.size === item.size);
        if (jsonVariant) stock = Number(jsonVariant.stock) || 0;
      }

      if (stock === -1) return { error: `Variant ${item.size} not found for ${product.name}` };
      if (item.quantity > stock) {
        return { error: `Sorry, we only have ${stock} left in stock for ${product.name} (${item.size}).` };
      }
    }
  }
  return { success: true };
}

export async function createOrder(orderData: {
  total_amount: number,
  shipping_address: any,
  items: { product_id: string, quantity: number, price_at_time: number, size?: string }[],
  payment_method?: string,
  wallet_amount?: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not logged in' }

  if (!orderData.items || orderData.items.length === 0) return { error: 'No items in order' }
  if (orderData.total_amount <= 0) return { error: 'Invalid order total' }

  // Prepare enriched items and calculate server-side total
  const enrichedItems = [];
  let calculatedTotal = 0;
  
  for (const item of orderData.items) {
    const { data: product } = await supabase.from('products').select('name, price, description').eq('id', item.product_id).single();
    if (!product) return { error: `Product not found` };

    if (item.size) {
      const { data: variant } = await supabase.from('product_variants').select('stock, price').eq('product_id', item.product_id).eq('size', item.size).single();
      
      let stock = -1;
      let price = 0;
      let isJsonVariant = false;

      if (variant) {
        stock = variant.stock;
        price = Number(variant.price);
      } else {
        let meta: any = {};
        try { meta = JSON.parse(product.description || '{}') } catch (e) {}
        const jsonVariant = (meta.sizes || []).find((s: any) => s.size === item.size);
        if (jsonVariant) {
          stock = Number(jsonVariant.stock) || 0;
          price = Number(jsonVariant.discountedPrice || jsonVariant.price);
          isJsonVariant = true;
        }
      }

      if (stock === -1) return { error: `Variant ${item.size} not found for ${product.name}` };
      if (item.quantity > stock) {
        return { error: `Sorry, we only have ${stock} left in stock for ${product.name} (${item.size}).` };
      }
      calculatedTotal += (price * item.quantity);
      enrichedItems.push({ ...item, name: product.name, price_at_time: price, isJsonVariant });
    } else {
      calculatedTotal += (Number(product.price) * item.quantity);
      enrichedItems.push({ ...item, name: product.name, price_at_time: Number(product.price), isJsonVariant: false });
    }
  }
  // Handle Wallet Discount
  let discountAmount = 0;
  if (orderData.wallet_amount && orderData.wallet_amount > 0 && calculatedTotal >= 349) {
    const maxWallet = Math.floor(calculatedTotal * 0.7);
    const requestedWallet = Math.min(orderData.wallet_amount, maxWallet);
    
    // STRICT VERIFICATION: Fetch actual wallet balance before proceeding
    const { data: profile } = await supabase.from('profiles').select('wallet_balance').eq('id', user.id).single();
    const actualBalance = profile?.wallet_balance || 0;
    
    discountAmount = Math.min(requestedWallet, actualBalance);
    calculatedTotal -= discountAmount;
  }

  orderData.total_amount = calculatedTotal;

  // Sync profile data
  await supabase.from('profiles').update({
    email: user.email,
    phone: orderData.shipping_address.phone,
    city: orderData.shipping_address.city
  }).eq('id', user.id)

  const isCOD = orderData.payment_method === 'COD';

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      user_id: user.id,
      total_amount: orderData.total_amount,
      shipping_address: orderData.shipping_address,
      status: 'PENDING',
      payment_status: isCOD ? 'PENDING' : 'COMPLETED',
      discount_amount: discountAmount,
      wallet_used: discountAmount > 0
    }])
    .select()
    .single()

  if (orderError) return { error: orderError.message }

  const itemsToInsert = enrichedItems.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price_at_time,
    price_at_time: item.price_at_time,
    size: item.size || null
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert)
  if (itemsError) {
    await supabase.from('orders').delete().eq('id', order.id)
    return { error: itemsError.message }
  }

  // Deduct stock per size after successful insert
  for (const item of enrichedItems) {
    if (!item.size) continue;
    
    if (item.isJsonVariant) {
      const { data: product } = await supabase.from('products').select('description').eq('id', item.product_id).single();
      if (product) {
        let meta: any = {};
        try { meta = JSON.parse(product.description || '{}') } catch (e) {}
        if (meta.sizes) {
          const sizeIndex = meta.sizes.findIndex((s: any) => s.size === item.size);
          if (sizeIndex !== -1) {
            meta.sizes[sizeIndex].stock = Math.max(0, (Number(meta.sizes[sizeIndex].stock) || 0) - item.quantity);
            await supabase.from('products').update({ description: JSON.stringify(meta) }).eq('id', item.product_id);
          }
        }
      }
    } else {
      const { data: variant } = await supabase.from('product_variants').select('stock').eq('product_id', item.product_id).eq('size', item.size).single();
      if (variant) {
        await supabase.from('product_variants').update({ stock: Math.max(0, variant.stock - item.quantity) }).eq('product_id', item.product_id).eq('size', item.size);
      }
    }
  }

  // Create payment record
  const { error: paymentError } = await supabase.from('payments').insert({
    order_id: order.id,
    user_id: user.id,
    amount: orderData.total_amount,
    status: isCOD ? 'PENDING' : 'SUCCESS',
    transaction_id: isCOD ? '' : `TXN-${crypto.randomUUID()}`,
    payment_method: isCOD ? 'COD' : 'SIMULATED'
  })
  
  if (paymentError) {
    console.error('Failed to create payment record:', paymentError.message)
  }

  // Deduct wallet balance if used
  if (discountAmount > 0) {
    await useWalletBalance(discountAmount, order.id, calculatedTotal + discountAmount);
  }

  // Removed auto-push to Shipmozo; this is now handled during Order Confirmation.

  revalidatePath('/order-history')
  revalidatePath('/admin/orders')
  return { data: order }
}

export async function getUserOrders() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('orders')
    .select(`*, order_items (*, product:products (name, image_url))`)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return []
  return data
}

export async function getOrderById(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('orders')
    .select(`*, order_items (*, product:products (name, image_url))`)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) return null
  return data
}

export async function getAllOrders() {
  const { error, supabase } = await requireAdmin()
  if (error) return []

  const { data } = await supabase
    .from('orders')
    .select(`*, profile:profiles (name, email)`)
    .order('created_at', { ascending: false })

  return data || []
}

export async function updateOrderStatus(id: string, status: string) {
  const { error, supabase } = await requireAdmin()
  if (error) return { error }

  const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
  if (!validStatuses.includes(status)) return { error: 'Invalid status' }

  const updateData: any = { status }
  const now = new Date().toISOString()
  if (status === 'CONFIRMED') updateData.confirmed_at = now
  if (status === 'SHIPPED') {
    updateData.shipped_at = now
    updateData.awb_number = 'TEST-AWB-123456' // Temporary mock AWB for testing
  }
  if (status === 'DELIVERED') updateData.delivered_at = now

  const { error: updateError } = await supabase.from('orders').update(updateData).eq('id', id)
  if (updateError) return { error: updateError.message }
  
  if (status === 'DELIVERED') {
    try {
      await creditReferrerReward(id)
    } catch (e) {
      console.error('Failed to credit referral reward:', e)
    }
  }

  if (status === 'CONFIRMED') {
    try {
      await pushOrderToShipmozo(id);
    } catch (e) {
      console.error('Failed to auto-push to Shipmozo:', e);
    }
  }

  revalidatePath('/admin/orders')
  revalidatePath('/order-history')
  return { data: true }
}

export async function pushOrderToShipmozo(orderId: string) {
  const { error, supabase, user } = await requireAdmin()
  if (error) return { error }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(`*, order_items (*, product:products (name, id)), profile:profiles (email)`)
    .eq('id', orderId)
    .single()

  if (orderError || !order) return { error: 'Order not found' }
  if (order.shipmozo_order_id) return { error: 'Already pushed to Shipmozo' }

  // Check payment method from payments table
  const { data: payment } = await supabase.from('payments').select('payment_method').eq('order_id', orderId).single();
  const isCOD = payment?.payment_method === 'COD';

  try {
    let totalWeight = 0;
    const shipmozoItems = order.order_items.map((item: any) => {
      let weight = 300; // default
      if (item.size === '50g') weight = 100;
      if (item.size === '100g') weight = 150;
      if (item.size === '200g' || item.size === '250g') weight = 300;
      if (item.size === '500g') weight = 600;
      totalWeight += (weight * item.quantity);
      
      return {
        name: item.product?.name || 'Makhana Product',
        sku_number: item.product_id.substring(0, 8),
        quantity: item.quantity,
        discount: "",
        hsn: "",
        unit_price: item.price_at_time,
        product_category: "Food"
      };
    });

    const shipmozoData = {
      order_id: order.id.toString(),
      order_date: new Date(order.created_at).toISOString().split('T')[0],
      order_type: "ESSENTIALS",
      consignee_name: order.shipping_address.name,
      consignee_phone: Number(order.shipping_address.phone.replace(/\D/g,'')) || 9999999999,
      consignee_alternate_phone: "",
      consignee_email: order.profile?.email || "",
      consignee_address_line_one: order.shipping_address.address,
      consignee_address_line_two: "",
      consignee_pin_code: Number(order.shipping_address.zip || order.shipping_address.pincode),
      consignee_city: order.shipping_address.city,
      consignee_state: order.shipping_address.state || "Delhi",
      product_detail: shipmozoItems,
      payment_type: isCOD ? "COD" : "PREPAID",
      cod_amount: isCOD ? order.total_amount.toString() : "",
      weight: totalWeight || 500,
      length: 20,
      width: 15,
      height: 10,
      warehouse_id: "",
      gst_ewaybill_number: "",
      gstin_number: ""
    };

    const smRes = await fetch('https://shipping-api.com/app/api/v1/push-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'public-key': process.env.SHIPMOZO_PUBLIC_KEY || '',
        'private-key': process.env.SHIPMOZO_PRIVATE_KEY || ''
      },
      body: JSON.stringify(shipmozoData)
    });

    const smData = await smRes.json();
    if (smData.result === "1") {
      await supabase.from('orders').update({
        shipmozo_order_id: smData.data?.reference_id
      }).eq('id', order.id);
      revalidatePath('/admin/orders');
      return { data: true };
    } else {
      return { error: smData.message || 'Failed to push to Shipmozo' };
    }
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function markLabelsAsPrinted(orderIds: string[]) {
  if (!orderIds || orderIds.length === 0) return { data: true };
  const { error, supabase } = await requireAdmin();
  if (error) return { error };
  
  const { error: updateError } = await supabase
    .from('orders')
    .update({ label_printed: true })
    .in('id', orderIds);
    
  if (updateError) return { error: updateError.message };
  
  revalidatePath('/admin/shipments');
  return { data: true };
}
