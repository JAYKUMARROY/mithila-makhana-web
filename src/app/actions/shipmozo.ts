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
        pickup_pincode: 141211, // using a mock warehouse pincode or default
        delivery_pincode: Number(deliveryPincode)
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
      return { success: false, message: 'Not serviceable', serviceable: false };
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
