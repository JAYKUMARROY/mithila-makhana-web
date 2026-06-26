"use client"
import { useState, useEffect } from 'react'
import { Download, Search, FilterX, MoreVertical, ChevronLeft, ChevronRight, TrendingUp, FileText, Package, Send, CheckCircle2, Clock, AlertCircle, ShoppingBag, Banknote, ShieldAlert } from 'lucide-react'
import { getAllOrders, updateOrderStatus, pushOrderToShipmozo } from '@/app/actions/orders'

export default function OrderManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [paymentFilter, setPaymentFilter] = useState('All Payments');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const data = await getAllOrders();
    setOrders(data);
    setLoading(false);
  }

  const handleStatusChange = async (id: string, status: string) => {
    await updateOrderStatus(id, status);
    fetchOrders();
  };

  const handlePushShipmozo = async (id: string) => {
    const res = await pushOrderToShipmozo(id);
    if (res.error) {
      alert(`Error: ${res.error}`);
    } else {
      alert('Successfully pushed to Shipmozo!');
      fetchOrders();
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (order.profile?.name && order.profile.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All Statuses' || order.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPayment = paymentFilter === 'All Payments' || 
      (paymentFilter === 'PAID' && ['PAID', 'COMPLETED', 'SUCCESS'].includes(order.payment_status?.toUpperCase())) ||
      (paymentFilter === 'PENDING' && order.payment_status?.toUpperCase() === 'PENDING');

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All Statuses');
    setPaymentFilter('All Payments');
  };

  const exportCSV = () => {
    if (filteredOrders.length === 0) return;
    
    const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Date', 'Payment Status', 'Shipping Status', 'Total Amount', 'Shipmozo ID', 'AWB Number'];
    
    const rows = filteredOrders.map(order => [
      order.id,
      order.profile?.name || 'Guest User',
      order.profile?.email || '',
      new Date(order.created_at).toLocaleDateString(),
      order.payment_status,
      order.status,
      order.total_amount,
      order.shipmozo_order_id || '',
      order.awb_number || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'DELIVERED': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'SHIPPED': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase tracking-wider"><Package className="w-3 h-3" /> Shipped</span>;
      case 'PROCESSING': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-wider"><Clock className="w-3 h-3" /> Processing</span>;
      case 'PENDING': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant border border-outline-variant/30 text-[10px] font-bold uppercase tracking-wider"><Clock className="w-3 h-3" /> Pending</span>;
      case 'CANCELLED': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold uppercase tracking-wider"><AlertCircle className="w-3 h-3" /> Cancelled</span>;
      default: return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">{status}</span>;
    }
  }

  const activeOrdersCount = orders.filter(o => ['PENDING', 'PROCESSING', 'SHIPPED'].includes(o.status)).length;
  const pendingPaymentCount = orders.filter(o => o.payment_status === 'PENDING').length;
  const totalRevenue = orders.filter(o => o.status !== 'CANCELLED').reduce((acc, o) => acc + o.total_amount, 0);
  const completedOrdersCount = orders.filter(o => o.status === 'DELIVERED').length;

  const getStatusWeight = (status: string) => {
    if (status === 'CANCELLED') return 99;
    if (status === 'DELIVERED') return 3;
    if (status === 'SHIPPED') return 2;
    if (status === 'PROCESSING') return 1;
    return 0; // PENDING
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Premium Header Area */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#042f2e] via-[#064e3b] to-[#022c22] p-8 md:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none transform translate-x-8 -translate-y-8">
          <ShoppingBag className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-display-lg mb-3 tracking-tight text-white flex items-center gap-3">
              Order Management
            </h1>
            <p className="text-white/80 font-body-lg max-w-2xl text-lg">
              Monitor, filter, and manage all customer orders. Ensure timely fulfillment and track payment status efficiently.
            </p>
          </div>
          
          <div className="flex flex-col sm:items-end gap-4 w-full sm:w-auto mt-6 md:mt-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
               <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-300">
                 <CheckCircle2 className="w-6 h-6" />
               </div>
               <div className="text-right">
                 <p className="text-white/80 text-xs uppercase tracking-wider font-bold mb-0.5">Completed Orders</p>
                 <p className="text-2xl font-display-md text-white leading-none">{completedOrdersCount}</p>
               </div>
            </div>
            <button onClick={exportCSV} className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-2xl font-label-lg font-bold border border-white/20 transition-all hover:scale-[1.02] shadow-lg w-full sm:w-auto">
              <Download className="w-5 h-5" /> Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/30 overflow-hidden flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
        
        {/* Filters Toolbar */}
        <div className="p-6 border-b border-outline-variant/20 bg-surface-container-lowest flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-96 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-5 h-5" />
            <input 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary-custom/30 focus:border-primary-custom outline-none transition-all font-body-sm text-sm" 
              placeholder="Search by Order ID or Customer Name..." 
              type="text" 
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="flex-1 sm:flex-none relative">
              <select 
                value={statusFilter} 
                onChange={e => setStatusFilter(e.target.value)} 
                className="w-full sm:w-48 py-3 pl-4 pr-10 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary-custom/30 outline-none font-body-sm text-sm appearance-none cursor-pointer"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-on-surface-variant/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            <div className="flex-1 sm:flex-none relative">
              <select 
                value={paymentFilter} 
                onChange={e => setPaymentFilter(e.target.value)} 
                className="w-full sm:w-40 py-3 pl-4 pr-10 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary-custom/30 outline-none font-body-sm text-sm appearance-none cursor-pointer"
              >
                <option value="All Payments">All Payments</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-on-surface-variant/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            <button 
              onClick={clearFilters} 
              className="p-3 text-on-surface-variant hover:text-primary-custom hover:bg-primary-container/20 rounded-xl transition-all border border-outline-variant/30 sm:border-transparent shrink-0 flex justify-center items-center" 
              title="Clear Filters"
            >
              <FilterX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm whitespace-nowrap">
            <thead className="bg-surface-container-low/30 text-on-surface-variant text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-8 py-5">Order Identifiers</th>
                <th className="px-8 py-5">Date & Amount</th>
                <th className="px-8 py-5 text-center">Payment</th>
                <th className="px-8 py-5 text-center">Fulfillment Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-on-surface-variant">
                      <div className="w-8 h-8 border-4 border-primary-custom border-t-transparent rounded-full animate-spin mb-4 opacity-70"></div>
                      <p className="font-label-md">Loading orders database...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-on-surface-variant opacity-60">
                      <ShoppingBag className="w-16 h-16 mb-4 opacity-50 text-outline-variant" />
                      <p className="font-label-lg text-lg mb-1">No orders found</p>
                      <p className="font-body-sm">We couldn't find any orders matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const initials = order.profile?.name ? (order.profile.name.split(' ').length > 1 ? order.profile.name.split(' ')[0][0] + order.profile.name.split(' ')[order.profile.name.split(' ').length - 1][0] : order.profile.name[0]).toUpperCase() : 'U';
                  
                  return (
                  <tr key={order.id} className="hover:bg-surface-container-lowest/80 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm border bg-surface-container text-on-surface-variant border-outline-variant/20">
                          {initials}
                        </div>
                        <div>
                          <p className="font-headline-md text-base text-forest-deep mb-0.5">{order.profile?.name || 'Guest User'}</p>
                          <p className="text-[10px] font-mono text-on-surface-variant/70 bg-surface-container-low px-1.5 py-0.5 rounded inline-block border border-outline-variant/20">
                            #{order.id.split('-')[0].toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-forest-deep mb-0.5">₹{order.total_amount.toLocaleString()}</p>
                      <p className="text-xs text-on-surface-variant">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                        order.payment_status === 'PAID' || order.payment_status === 'COMPLETED' || order.payment_status === 'SUCCESS'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${order.payment_status === 'PENDING' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="inline-flex relative group/select">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`appearance-none bg-transparent cursor-pointer relative z-10 w-full pl-3 pr-8 py-1.5 outline-none font-bold text-[10px] uppercase tracking-wider rounded-lg border transition-colors ${
                            order.status === 'DELIVERED' ? 'text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100' :
                            order.status === 'SHIPPED' ? 'text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100' :
                            order.status === 'PROCESSING' ? 'text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100' :
                            order.status === 'CANCELLED' ? 'text-rose-700 border-rose-200 bg-rose-50 hover:bg-rose-100' :
                            'text-on-surface-variant border-outline-variant/30 bg-surface-container hover:bg-surface-container-high'
                          }`}
                        >
                          <option value="PENDING" disabled={getStatusWeight(order.status) > 0}>PENDING</option>
                          <option value="PROCESSING" disabled={getStatusWeight(order.status) > 1}>PROCESSING</option>
                          <option value="SHIPPED" disabled={getStatusWeight(order.status) > 2}>SHIPPED</option>
                          <option value="DELIVERED" disabled={getStatusWeight(order.status) > 3}>DELIVERED</option>
                          <option value="CANCELLED" disabled={getStatusWeight(order.status) >= 3}>CANCELLED</option>
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none z-20">
                          <svg className={`w-3 h-3 ${
                            order.status === 'DELIVERED' ? 'text-emerald-700' :
                            order.status === 'SHIPPED' ? 'text-blue-700' :
                            order.status === 'PROCESSING' ? 'text-amber-700' :
                            order.status === 'CANCELLED' ? 'text-rose-700' :
                            'text-on-surface-variant'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {!order.shipmozo_order_id && order.payment_status === 'PENDING' && (
                          <button 
                            onClick={() => handlePushShipmozo(order.id)} 
                            title="Push to Shipmozo" 
                            className="flex items-center justify-center w-10 h-10 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-primary-custom hover:border-primary-custom/40 hover:bg-primary-container/10 transition-all shadow-sm"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        <a 
                          href={`/invoice/${order.id}`} 
                          target="_blank" 
                          title="Download Shipping Label" 
                          className="flex items-center justify-center w-10 h-10 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-forest-deep hover:text-primary-custom hover:border-primary-custom/40 hover:bg-primary-container/10 transition-all shadow-sm"
                        >
                          <Package className="w-4 h-4" />
                        </a>
                        <a 
                          href={`/tax-invoice/${order.id}`} 
                          target="_blank" 
                          title="Download Tax Invoice" 
                          className="flex items-center justify-center w-10 h-10 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-forest-deep hover:text-primary-custom hover:border-primary-custom/40 hover:bg-primary-container/10 transition-all shadow-sm"
                        >
                          <FileText className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Stats Anchors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {/* Stat 1 */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary-container to-transparent opacity-50 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-primary-container text-primary-custom flex items-center justify-center mb-4">
              <Banknote className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="text-3xl font-display-md text-forest-deep">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100 to-transparent opacity-50 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Active Orders</p>
            <p className="text-3xl font-display-md text-forest-deep">{activeOrdersCount}</p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-100 to-transparent opacity-50 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Pending Payments</p>
            <p className="text-3xl font-display-md text-forest-deep">{pendingPaymentCount}</p>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-100 to-transparent opacity-50 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Success Rate</p>
            <p className="text-3xl font-display-md text-forest-deep">
              {orders.length > 0 ? ((orders.filter(o => o.status === 'DELIVERED').length / orders.length) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
