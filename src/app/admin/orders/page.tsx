"use client"
import { useState, useEffect } from 'react'
import { Download, Search, FilterX, MoreVertical, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react'
import { getAllOrders, updateOrderStatus } from '@/app/actions/orders'

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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (order.profile?.name && order.profile.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All Statuses' || order.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPayment = paymentFilter === 'All Payments' || order.payment_status.toLowerCase() === paymentFilter.toLowerCase();

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

  return (
    <div className="relative z-10 max-w-[1280px] mx-auto w-full">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-forest-deep mb-2">Order Management</h2>
          <p className="text-on-surface-variant font-body-md max-w-2xl">
            Monitor, filter, and manage all customer orders coming from the Mithila Makhana marketplace. Ensure timely fulfillment and track payment status.
          </p>
        </div>
        <div className="flex gap-4">
          <button onClick={exportCSV} className="bg-forest-deep text-white px-6 py-2.5 rounded-lg font-label-lg flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-md">
            <Download className="w-5 h-5" /> Export CSV
          </button>
        </div>
      </header>

      {/* Filters & Search Bento Card */}
      <div className="bg-surface-container-lowest rounded-xl p-6 mb-8 shadow-sm border border-outline-variant/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Search */}
          <div className="md:col-span-5 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-5 h-5" />
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-gold-accent outline-none transition-all font-body-md" placeholder="Search by Order ID or Customer Name..." type="text" />
          </div>
          {/* Filter Status */}
          <div className="md:col-span-3 flex items-center gap-3">
            <span className="font-label-lg text-on-surface-variant">Status:</span>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="flex-1 py-3 px-4 bg-surface-container-low border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-gold-accent outline-none font-body-md appearance-none">
              <option value="All Statuses">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          {/* Filter Date Range */}
          <div className="md:col-span-3 flex items-center gap-3">
            <span className="font-label-lg text-on-surface-variant">Payment:</span>
            <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="flex-1 py-3 px-4 bg-surface-container-low border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-gold-accent outline-none font-body-md appearance-none">
              <option value="All Payments">All Payments</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
          {/* Clear */}
          <div className="md:col-span-1 flex justify-end">
            <button onClick={clearFilters} className="p-3 text-on-surface-variant hover:text-tertiary transition-colors" title="Clear Filters">
              <FilterX className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/20">
                <th className="px-6 py-5 font-label-lg text-forest-deep">Order ID</th>
                <th className="px-6 py-5 font-label-lg text-forest-deep">Customer</th>
                <th className="px-6 py-5 font-label-lg text-forest-deep">Date</th>
                <th className="px-6 py-5 font-label-lg text-forest-deep">Payment</th>
                <th className="px-6 py-5 font-label-lg text-forest-deep">Shipping Status</th>
                <th className="px-6 py-5 font-label-lg text-forest-deep">Total</th>
                <th className="px-6 py-5 font-label-lg text-forest-deep text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-on-surface-variant">No orders found.</td>
                </tr>
              )}
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-cream-bg transition-colors group cursor-pointer">
                  <td className="px-6 py-4 font-label-lg text-forest-deep">#{order.id.split('-')[0].toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">
                        {order.profile?.name ? order.profile.name.substring(0, 2).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="font-label-lg leading-tight">{order.profile?.name || 'Unknown User'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-body-md text-on-surface-variant">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className="bg-secondary-container/50 text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> {order.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-surface-container-low border border-outline-variant/30 text-forest-deep px-3 py-1 rounded-full text-xs font-bold outline-none"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 font-label-lg text-forest-deep">₹{order.total_amount}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <a href={`/invoice/${order.id}`} target="_blank" title="Download Invoice" className="text-on-surface-variant hover:text-primary-custom transition-colors">
                      <Download className="w-5 h-5" />
                    </a>
                    <button className="text-on-surface-variant hover:text-forest-deep transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
      {/* Footer Stats Anchor */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-gold-accent">
          <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Total Revenue</p>
          <p className="font-headline-md text-forest-deep">
            ₹{orders.filter(o => o.status !== 'CANCELLED').reduce((acc, o) => acc + o.total_amount, 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-secondary mt-2 flex items-center gap-1 font-bold">
            <TrendingUp className="w-4 h-4" /> Based on all successful orders
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-secondary">
          <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Active Orders</p>
          <p className="font-headline-md text-forest-deep">
            {orders.filter(o => ['PENDING', 'PROCESSING'].includes(o.status)).length}
          </p>
          <p className="text-[11px] text-on-surface-variant mt-2 font-medium">Pending or Processing</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-tertiary">
          <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Pending Payments</p>
          <p className="font-headline-md text-forest-deep">
            {orders.filter(o => o.payment_status === 'PENDING').length}
          </p>
          <p className="text-[11px] text-tertiary mt-2 font-bold">Follow up required</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-forest-deep">
          <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Success Rate</p>
          <p className="font-headline-md text-forest-deep">
            {orders.length > 0 ? ((orders.filter(o => o.status === 'DELIVERED').length / orders.length) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-[11px] text-on-surface-variant mt-2 font-medium">Delivery success rate</p>
        </div>
      </div>
    </div>
  )
}
