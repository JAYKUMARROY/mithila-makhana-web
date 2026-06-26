'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not logged in', supabase, user: null }
  const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim()) : [];
  if (!adminEmails.includes(user.email || '')) return { error: 'Unauthorized', supabase, user }
  return { error: null, supabase, user }
}

export async function createOrder(orderData: {
  total_amount: number,
  shipping_address: any,
  items: { product_id: string, quantity: number, price_at_time: number, size?: string }[],
  payment_method?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not logged in' }

  if (!orderData.items || orderData.items.length === 0) return { error: 'No items in order' }
  if (orderData.total_amount <= 0) return { error: 'Invalid order total' }

  // Prepare enriched items for Shipmozo
  const enrichedItems = [];
  
  // Validate stock before proceeding
  for (const item of orderData.items) {
    if (!item.size) continue;
    const { data: product } = await supabase.from('products').select('description, name').eq('id', item.product_id).single();
    if (product?.description) {
      try {
        const meta = JSON.parse(product.description);
        if (meta.sizes) {
          const sizeObj = meta.sizes.find((s: any) => s.size === item.size);
          if (sizeObj) {
            const currentStock = Number(sizeObj.stock) || 0;
            if (item.quantity > currentStock) {
              return { error: `Sorry, we only have ${currentStock} left in stock for ${product.name} (${item.size}).` };
            }
          }
        }
      } catch(e) {}
      
      enrichedItems.push({
        ...item,
        name: product.name,
        size: item.size
      });
    }
  }

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
      payment_status: isCOD ? 'PENDING' : 'COMPLETED'
    }])
    .select()
    .single()

  if (orderError) return { error: orderError.message }

  // Deduct stock per size
  for (const item of orderData.items) {
    if (!item.size) continue;
    const { data: product } = await supabase.from('products').select('description').eq('id', item.product_id).single();
    if (product?.description) {
      try {
        const meta = JSON.parse(product.description);
        if (meta.sizes) {
          const sizeObj = meta.sizes.find((s: any) => s.size === item.size);
          if (sizeObj) {
            sizeObj.stock = Math.max(0, (Number(sizeObj.stock) || 0) - item.quantity);
            await supabase.from('products').update({ description: JSON.stringify(meta) }).eq('id', item.product_id);
          }
        }
      } catch(e) {}
    }
  }

  const itemsToInsert = orderData.items.map(item => ({
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

  // Create payment record
  const { error: paymentError } = await supabase.from('payments').insert({
    order_id: order.id,
    user_id: user.id,
    amount: orderData.total_amount,
    status: isCOD ? 'PENDING' : 'SUCCESS',
    transaction_id: isCOD ? '' : `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    payment_method: isCOD ? 'COD' : 'SIMULATED'
  })
  
  if (paymentError) {
    console.error('Failed to create payment record:', paymentError.message)
  }

  // Push to Shipmozo API only if Prepaid
  if (!isCOD) {
    try {
      let totalWeight = 0;
      const shipmozoItems = enrichedItems.map(item => {
        let weight = 300; // default
        if (item.size === '50g') weight = 100;
        if (item.size === '100g') weight = 150;
        if (item.size === '200g' || item.size === '250g') weight = 300;
        if (item.size === '500g') weight = 600;
        totalWeight += (weight * item.quantity);
        
        return {
          name: item.name,
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
        order_date: new Date().toISOString().split('T')[0],
        order_type: "ESSENTIALS",
        consignee_name: orderData.shipping_address.name,
        consignee_phone: Number(orderData.shipping_address.phone.replace(/\D/g,'')) || 9999999999,
        consignee_alternate_phone: "",
        consignee_email: user.email || "",
        consignee_address_line_one: orderData.shipping_address.address,
        consignee_address_line_two: "",
        consignee_pin_code: Number(orderData.shipping_address.zip || orderData.shipping_address.pincode),
        consignee_city: orderData.shipping_address.city,
        consignee_state: orderData.shipping_address.state || "Delhi",
        product_detail: shipmozoItems,
        payment_type: "PREPAID",
        cod_amount: "",
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
      } else {
        console.error("Shipmozo Push Error:", smData.message);
      }
    } catch (err) {
      console.error("Shipmozo Exception:", err);
    }
  }

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
  if (status === 'SHIPPED') updateData.shipped_at = now
  if (status === 'DELIVERED') updateData.delivered_at = now

  const { error: updateError } = await supabase.from('orders').update(updateData).eq('id', id)
  if (updateError) return { error: updateError.message }
  
  revalidatePath('/admin/orders')
  revalidatePath('/order-history')
  return { success: true }
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
      return { success: true };
    } else {
      return { error: smData.message || 'Failed to push to Shipmozo' };
    }
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function markLabelsAsPrinted(orderIds: string[]) {
  if (!orderIds || orderIds.length === 0) return { success: true };
  const { error, supabase } = await requireAdmin();
  if (error) return { success: false, message: error };
  
  const { error: updateError } = await supabase
    .from('orders')
    .update({ label_printed: true })
    .in('id', orderIds);
    
  if (updateError) return { success: false, message: updateError.message };
  
  revalidatePath('/admin/shipments');
  return { success: true };
}
