'use server'

const SHIPMOZO_PUBLIC_KEY = 'CyL9fkjPZGwxhSQBEZng';
const SHIPMOZO_PRIVATE_KEY = 'GnpuEJKC9S73eWMUPTsY';
const BASE_URL = 'https://shipping-api.com/app/api/v1';

export async function checkPincodeServiceability(deliveryPincode: string) {
  try {
    const res = await fetch(`${BASE_URL}/pincode-serviceability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'public-key': SHIPMOZO_PUBLIC_KEY,
        'private-key': SHIPMOZO_PRIVATE_KEY
      },
      body: JSON.stringify({
        pickup_pincode: "141211", // using a mock warehouse pincode or default
        delivery_pincode: String(deliveryPincode)
      })
    });

    if (!res.ok) return { success: false, message: 'Failed to connect to API' };
    
    const data = await res.json();
    if (data.result === "1" && data.data?.serviceable) {
      // Simulate estimated delivery date logic
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + 4);
      return { 
        success: true, 
        serviceable: true,
        estimatedDelivery: estimatedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      };
    } else {
      return { success: false, message: data.message || 'Not serviceable', serviceable: false };
    }
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function getOrderLabel(awbNumber: string) {
  if (!awbNumber) return { success: false, message: 'No AWB Number assigned' };
  try {
    const res = await fetch(`${BASE_URL}/get-order-label/${awbNumber}`, {
      method: 'GET',
      headers: {
        'public-key': SHIPMOZO_PUBLIC_KEY,
        'private-key': SHIPMOZO_PRIVATE_KEY
      }
    });

    if (!res.ok) return { success: false, message: 'Failed to fetch label' };
    
    const data = await res.json();
    if (data.result === "1" && data.data?.[0]?.label) {
      return { success: true, labelBase64: data.data[0].label };
    } else {
    return { success: false, message: data.message || 'Label not generated yet' };
    }
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function syncOrderAwb(dbOrderId: string, shipmozoOrderId: string) {
  try {
    const res = await fetch(`${BASE_URL}/get-order-detail/${shipmozoOrderId}`, {
      method: 'GET',
      headers: {
        'public-key': SHIPMOZO_PUBLIC_KEY,
        'private-key': SHIPMOZO_PRIVATE_KEY
      }
    });

    if (!res.ok) return { success: false, message: 'Failed to connect to Shipmozo' };

    const data = await res.json();
    if (data.result === "1" && data.data) {
      // The API response shape for get-order-detail varies, but AWB is typically at data.awb_number or data[0].awb_number
      const orderData = Array.isArray(data.data) ? data.data[0] : data.data;
      const awbNumber = orderData?.awb_number || orderData?.awb_code || orderData?.tracking_number;
      
      if (awbNumber) {
        // We need to update our DB! We use the admin client or import createClient here
        const { createClient } = require('@/utils/supabase/server');
        const supabase = await createClient();
        
        await supabase.from('orders').update({
          awb_number: awbNumber,
          status: 'SHIPPED',
          shipped_at: new Date().toISOString()
        }).eq('id', dbOrderId);
        
        return { success: true, awb_number: awbNumber, message: 'AWB Synced Successfully!' };
      } else {
        return { success: false, message: 'Courier not assigned yet or AWB missing in Shipmozo.' };
      }
    } else {
      return { success: false, message: data.message || 'Error fetching order details' };
    }
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function calculateShippingRate(params: {
  pickupPincode: string;
  deliveryPincode: string;
  paymentType: string;
  weight: number;
  shipmentType?: string;
  orderAmount?: string;
  length?: number;
  width?: number;
  height?: number;
}) {
  try {
    const res = await fetch(`${BASE_URL}/rate-calculator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'public-key': SHIPMOZO_PUBLIC_KEY,
        'private-key': SHIPMOZO_PRIVATE_KEY
      },
      body: JSON.stringify({
        pickup_pincode: params.pickupPincode || "122001",
        delivery_pincode: params.deliveryPincode,
        payment_type: params.paymentType || "PREPAID",
        shipment_type: params.shipmentType || "FORWARD",
        order_amount: params.orderAmount || "1000",
        weight: params.weight || 500,
        length: params.length || 20,
        width: params.width || 15,
        height: params.height || 10
      })
    });

    if (!res.ok) return { success: false, message: 'Failed to connect to API' };
    
    const data = await res.json();
    if (data.result === "1" && data.data) {
      return { success: true, rates: data.data };
    } else {
      return { success: false, message: data.message || 'Error calculating rate' };
    }
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
