"use client"
import { useState, useEffect } from 'react'
import { Truck, Search, RefreshCw, Package, MapPin, Calculator, Printer, ChevronRight, CheckCircle2, CheckSquare } from 'lucide-react'
import { getAllOrders, markLabelsAsPrinted } from '@/app/actions/orders'
import { syncOrderAwb, checkPincodeServiceability, calculateShippingRate } from '@/app/actions/shipmozo'

export default function ShipmentsManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Utilities State
  const [pinInput, setPinInput] = useState('');
  const [pinResult, setPinResult] = useState<any>(null);
  const [pinLoading, setPinLoading] = useState(false);

  const [rateForm, setRateForm] = useState({ 
    pickup: '122001', 
    delivery: '', 
    weight: 0.5, 
    type: 'PREPAID',
    shipmentType: 'FORWARD',
    invoiceValue: '1000',
    length: 20,
    width: 15,
    height: 10
  });
  const [rateResult, setRateResult] = useState<any>(null);
  const [rateLoading, setRateLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getAllOrders();
    setOrders(data.filter((o: any) => o.shipmozo_order_id));
    setLoading(false);
  };

  const handleSync = async (dbOrderId: string, shipmozoOrderId: string) => {
    setSyncingId(dbOrderId);
    const res = await syncOrderAwb(dbOrderId, shipmozoOrderId);
    if (res.success) {
      // Refresh to update UI
      fetchOrders();
    } else {
      alert(`Error: ${res.message}`);
    }
    setSyncingId(null);
  };

  const handleBulkPrint = async () => {
    const unprintedOrders = filteredOrders
      .filter(o => o.awb_number && !o.label_printed)
      .slice(0, 25); // Shipmozo limit is 25

    if (unprintedOrders.length === 0) {
      alert("No unprinted AWBs available in the current list.");
      return;
    }
    
    const awbs = unprintedOrders.map(o => o.awb_number);
    const ids = unprintedOrders.map(o => o.id);

    // Auto mark as printed
    await markLabelsAsPrinted(ids);
    fetchOrders(); // Refresh UI to show checks
    
    window.open(`/invoice/bulk?awbs=${awbs.join(',')}`, '_blank');
  };

  const handleSinglePrint = async (orderId: string) => {
    await markLabelsAsPrinted([orderId]);
    fetchOrders();
  };

  const handleCheckPincode = async () => {
    if (!pinInput) return;
    setPinLoading(true);
    const res = await checkPincodeServiceability(pinInput);
    setPinResult(res);
    setPinLoading(false);
  };

  const handleCalculateRate = async () => {
    if (!rateForm.delivery) return;
    setRateLoading(true);
    const res = await calculateShippingRate({
      pickupPincode: rateForm.pickup,
      deliveryPincode: rateForm.delivery,
      weight: Number(rateForm.weight) * 1000, 
      paymentType: rateForm.type,
      shipmentType: rateForm.shipmentType,
      orderAmount: rateForm.invoiceValue,
      length: Number(rateForm.length),
      width: Number(rateForm.width),
      height: Number(rateForm.height)
    });
    setRateResult(res);
    setRateLoading(false);
  };

  const filteredOrders = orders.filter(order => {
    return searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.shipmozo_order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Area */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-deep via-[#1e3b2b] to-[#0f2418] p-8 md:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none transform translate-x-8 -translate-y-8">
          <Truck className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-display-lg mb-3 tracking-tight text-white flex items-center gap-3">
              Shipments & Logistics
            </h1>
            <p className="text-white/80 font-body-lg max-w-2xl text-lg">
              Manage your Shipmozo pushed orders, sync AWB tracking numbers, check delivery availability, and calculate exact rates in real-time.
            </p>
          </div>
          <button onClick={fetchOrders} className="group flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl backdrop-blur-md transition-all font-label-lg font-bold shadow-lg hover:shadow-xl hover:scale-[1.02]">
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Utilities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Pincode Checker */}
        <div className="lg:col-span-4 bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/30 p-8 flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary-container/30 text-primary-custom flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-headline-md text-forest-deep text-xl">Serviceability</h3>
              <p className="text-xs text-on-surface-variant">Check Pincode Delivery</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="relative flex items-center shadow-sm rounded-xl overflow-hidden border border-outline-variant/50 focus-within:border-primary-custom focus-within:ring-2 focus-within:ring-primary-custom/20 transition-all bg-white mb-6">
              <div className="pl-4 text-on-surface-variant">
                <MapPin className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Enter 6-digit Pincode" 
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-4 focus:outline-none bg-transparent font-body-md"
              />
              <button 
                onClick={handleCheckPincode} 
                disabled={pinLoading || !pinInput} 
                className="px-6 py-4 bg-gradient-to-r from-primary-container to-primary-fixed-dim text-on-primary-container font-bold hover:opacity-90 transition-opacity disabled:opacity-50 h-full flex items-center"
              >
                {pinLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Check'}
              </button>
            </div>

            {pinResult && (
              <div className={`p-5 rounded-2xl flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300 ${pinResult.serviceable ? 'bg-secondary-fixed/50 border border-secondary-fixed text-on-secondary-fixed' : 'bg-error-container/50 border border-error-container text-on-error-container'}`}>
                {pinResult.serviceable ? <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" /> : <MapPin className="w-6 h-6 shrink-0 mt-0.5" />}
                <div>
                  <p className="font-bold text-sm mb-1">{pinResult.serviceable ? 'Delivery Available' : 'Not Serviceable'}</p>
                  <p className="text-xs opacity-80">{pinResult.serviceable ? `Estimated Delivery: ${pinResult.estimatedDelivery || '3-5 Days'}` : pinResult.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rate Calculator */}
        <div className="lg:col-span-8 bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/30 p-8 flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-forest-deep/10 text-forest-deep flex items-center justify-center">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline-md text-forest-deep text-xl">Rate Calculator</h3>
                <p className="text-xs text-on-surface-variant">Estimate shipping cost before pushing</p>
              </div>
            </div>
            <button 
              onClick={handleCalculateRate} 
              disabled={rateLoading || !rateForm.delivery} 
              className="px-6 py-3 bg-forest-deep text-white rounded-xl font-bold hover:bg-forest-deep/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-2"
            >
              {rateLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Calculate Rate'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-3 border border-outline-variant/30 focus-within:border-primary-custom focus-within:ring-1 focus-within:ring-primary-custom shadow-sm transition-all">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">Shipment Type</label>
              <select value={rateForm.shipmentType} onChange={e => setRateForm({...rateForm, shipmentType: e.target.value})} className="w-full bg-transparent text-sm focus:outline-none font-bold text-forest-deep">
                <option value="FORWARD">Forward</option>
                <option value="RETURN">Return</option>
              </select>
            </div>
            
            <div className="bg-white rounded-xl p-3 border border-outline-variant/30 focus-within:border-primary-custom focus-within:ring-1 focus-within:ring-primary-custom shadow-sm transition-all">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">Payment Mode</label>
              <select value={rateForm.type} onChange={e => setRateForm({...rateForm, type: e.target.value})} className="w-full bg-transparent text-sm focus:outline-none font-bold text-forest-deep">
                <option value="PREPAID">Prepaid</option>
                <option value="COD">COD</option>
              </select>
            </div>

            <div className="bg-white rounded-xl p-3 border border-outline-variant/30 focus-within:border-primary-custom focus-within:ring-1 focus-within:ring-primary-custom shadow-sm transition-all">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">Origin Pincode</label>
              <input type="text" placeholder="122001" value={rateForm.pickup} onChange={e => setRateForm({...rateForm, pickup: e.target.value})} className="w-full bg-transparent text-sm focus:outline-none font-bold text-forest-deep" />
            </div>

            <div className="bg-white rounded-xl p-3 border border-outline-variant/30 focus-within:border-primary-custom focus-within:ring-1 focus-within:ring-primary-custom shadow-sm transition-all">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">Delivery Pincode</label>
              <input type="text" placeholder="e.g. 110001" value={rateForm.delivery} onChange={e => setRateForm({...rateForm, delivery: e.target.value})} className="w-full bg-transparent text-sm focus:outline-none font-bold text-forest-deep" />
            </div>

            <div className="bg-white rounded-xl p-3 border border-outline-variant/30 focus-within:border-primary-custom focus-within:ring-1 focus-within:ring-primary-custom shadow-sm transition-all flex items-center justify-between">
              <div className="flex-1">
                <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">Weight</label>
                <input type="number" step="0.1" value={rateForm.weight} onChange={e => setRateForm({...rateForm, weight: Number(e.target.value)})} className="w-full bg-transparent text-sm focus:outline-none font-bold text-forest-deep" />
              </div>
              <span className="text-xs font-bold text-on-surface-variant/50 bg-surface-container-low px-2 py-1 rounded">Kg</span>
            </div>

            <div className="bg-white rounded-xl p-3 border border-outline-variant/30 focus-within:border-primary-custom focus-within:ring-1 focus-within:ring-primary-custom shadow-sm transition-all flex items-center justify-between">
              <div className="flex-1">
                <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">Invoice Value</label>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-forest-deep">₹</span>
                  <input type="number" value={rateForm.invoiceValue} onChange={e => setRateForm({...rateForm, invoiceValue: e.target.value})} className="w-full bg-transparent text-sm focus:outline-none font-bold text-forest-deep" />
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 bg-white rounded-xl p-3 border border-outline-variant/30 shadow-sm">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">Dimensions (L × W × H)</label>
              <div className="flex gap-2 items-center">
                <div className="flex-1 flex bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant/20 focus-within:border-primary-custom transition-colors">
                  <input type="number" value={rateForm.length} onChange={e => setRateForm({...rateForm, length: Number(e.target.value)})} className="w-full min-w-0 bg-transparent px-2 py-1 text-sm focus:outline-none text-center font-bold text-forest-deep" />
                  <span className="px-2 py-1 bg-surface-container-highest text-[10px] text-on-surface-variant font-bold flex items-center">CM</span>
                </div>
                <span className="text-outline-variant font-bold">×</span>
                <div className="flex-1 flex bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant/20 focus-within:border-primary-custom transition-colors">
                  <input type="number" value={rateForm.width} onChange={e => setRateForm({...rateForm, width: Number(e.target.value)})} className="w-full min-w-0 bg-transparent px-2 py-1 text-sm focus:outline-none text-center font-bold text-forest-deep" />
                  <span className="px-2 py-1 bg-surface-container-highest text-[10px] text-on-surface-variant font-bold flex items-center">CM</span>
                </div>
                <span className="text-outline-variant font-bold">×</span>
                <div className="flex-1 flex bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant/20 focus-within:border-primary-custom transition-colors">
                  <input type="number" value={rateForm.height} onChange={e => setRateForm({...rateForm, height: Number(e.target.value)})} className="w-full min-w-0 bg-transparent px-2 py-1 text-sm focus:outline-none text-center font-bold text-forest-deep" />
                  <span className="px-2 py-1 bg-surface-container-highest text-[10px] text-on-surface-variant font-bold flex items-center">CM</span>
                </div>
              </div>
            </div>
          </div>

          {rateResult && (
            <div className={`p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300 ${rateResult.success ? 'bg-secondary-fixed/30 border border-secondary-fixed/50' : 'bg-error-container/30 border border-error-container/50'}`}>
              {rateResult.success ? (
                <div className="max-h-32 overflow-y-auto custom-scrollbar">
                  <pre className="text-[11px] font-mono text-on-surface-variant leading-relaxed">
                    {JSON.stringify(rateResult.rates, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-sm font-bold text-error">{rateResult.message}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/30 overflow-hidden flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
        
        {/* Table Toolbar */}
        <div className="p-6 border-b border-outline-variant/20 flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-container-lowest">
          <h2 className="text-xl font-headline-md text-forest-deep flex items-center gap-2">
            <Package className="w-5 h-5 text-primary-custom" /> Shipped Orders List
          </h2>
          <div className="flex items-center gap-3 w-full sm:w-auto flex-col sm:flex-row">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
              <input 
                type="text"
                placeholder="Search by Order ID, Ref, or Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none focus:border-primary-custom focus:ring-2 focus:ring-primary-custom/20 transition-all font-body-sm text-sm"
              />
            </div>
            <button onClick={handleBulkPrint} className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-primary-container to-primary-fixed-dim text-on-primary-container font-bold hover:opacity-90 rounded-xl transition-opacity w-full sm:w-auto shadow-sm">
              <Printer className="w-4 h-4" /> Bulk Print Labels
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm whitespace-nowrap">
            <thead className="bg-surface-container-low/30 text-on-surface-variant text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-8 py-5">Order Details</th>
                <th className="px-8 py-5">Customer Info</th>
                <th className="px-8 py-5">Shipmozo Ref</th>
                <th className="px-8 py-5">Tracking Details</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-on-surface-variant">
                      <RefreshCw className="w-8 h-8 animate-spin mb-4 text-primary-custom opacity-50" />
                      <p className="font-label-md">Loading shipments data...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-on-surface-variant opacity-60">
                      <Package className="w-16 h-16 mb-4 opacity-50 text-outline-variant" />
                      <p className="font-label-lg text-lg mb-1">No shipments found</p>
                      <p className="font-body-sm">Orders pushed to Shipmozo will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-lowest/80 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-forest-deep/5 flex items-center justify-center text-forest-deep">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-headline-md text-forest-deep text-base">#{order.id.split('-')[0].toUpperCase()}</p>
                          <div className={`mt-1 inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                            order.status === 'SHIPPED' ? 'bg-secondary-fixed/50 text-on-secondary-fixed border-secondary-fixed' :
                            'bg-surface-container text-on-surface-variant border-outline-variant/30'
                          }`}>
                            {order.status}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-forest-deep">{order.shipping_address?.name || order.profile?.name}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5 max-w-[200px] truncate" title={order.shipping_address?.address}>
                        {order.shipping_address?.city || 'Unknown City'}, {order.shipping_address?.state || ''}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="inline-flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/30">
                        <span className="w-2 h-2 rounded-full bg-primary-custom/50"></span>
                        <span className="font-mono text-xs font-semibold text-on-surface-variant">
                          {order.shipmozo_order_id}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {order.awb_number ? (
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-[10px] uppercase font-bold text-on-surface-variant/70 tracking-wider">AWB Number</p>
                            {order.label_printed && (
                              <span className="flex items-center gap-1 text-[9px] text-secondary-custom font-bold bg-secondary-container px-1.5 py-0.5 rounded-full">
                                <CheckSquare className="w-3 h-3" /> Printed
                              </span>
                            )}
                          </div>
                          <p className={`font-mono text-sm font-bold bg-primary-container/10 px-2 py-1 rounded inline-block ${order.label_printed ? 'text-on-surface-variant line-through opacity-60' : 'text-primary-custom'}`}>
                            {order.awb_number}
                          </p>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-error-container/30 border border-error-container/50 rounded-lg text-error text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
                          Pending AWB
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {order.awb_number && (
                          <a 
                            href={`/invoice/${order.id}`}
                            target="_blank"
                            onClick={() => handleSinglePrint(order.id)}
                            className={`flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-outline-variant/40 hover:bg-surface-container-low transition-all shadow-sm hover:shadow group-hover:border-outline-variant/80 ${order.label_printed ? 'text-on-surface-variant/50' : 'text-forest-deep hover:text-primary-custom'}`}
                            title={order.label_printed ? "Reprint Label" : "Print Label"}
                          >
                            <Printer className="w-4 h-4" />
                          </a>
                        )}
                        <button 
                          onClick={() => handleSync(order.id, order.shipmozo_order_id)}
                          disabled={syncingId === order.id}
                          className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-label-sm text-sm transition-all shadow-sm ${
                            order.awb_number 
                              ? 'bg-white border border-outline-variant/40 text-forest-deep hover:bg-surface-container-low group-hover:border-outline-variant/80' 
                              : 'bg-gradient-to-r from-forest-deep to-[#1e3b2b] text-white hover:shadow-md hover:scale-[1.02] border border-transparent'
                          }`}
                        >
                          <RefreshCw className={`w-4 h-4 ${syncingId === order.id ? 'animate-spin' : ''}`} /> 
                          {order.awb_number ? 'Re-Sync' : 'Sync AWB'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
