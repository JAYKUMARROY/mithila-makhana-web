import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Calendar, IndianRupee, TrendingUp, ShoppingCart, Users, AlertTriangle, Eye, MoreHorizontal, PackageOpen, ChevronRight, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { AdminDatePicker } from '@/components/admin-date-picker'
import { requireAdmin } from '@/lib/auth'

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ filter?: string, start?: string, end?: string, month?: string, year?: string }> }) {
  const supabase = await createClient();
  const admin = await requireAdmin();
  if (!admin) redirect('/admin/login');
  const params = await searchParams;
  const filter = params?.filter || 'all';
  
  // Date boundaries
  const now = new Date();
  let startDate = new Date();
  let endDate = new Date();
  if (filter === 'today') {
    startDate.setHours(0,0,0,0);
  } else if (filter === 'weekly') {
    startDate.setDate(now.getDate() - 7);
  } else if (filter === 'monthly') {
    startDate.setDate(now.getDate() - 30);
  } else if (filter === 'range' && params?.start && params?.end) {
    startDate = new Date(params.start);
    startDate.setHours(0,0,0,0);
    endDate = new Date(params.end);
    endDate.setHours(23,59,59,999);
  } else if (filter === 'month' && params?.month) {
    const [y, m] = params.month.split('-');
    startDate = new Date(Number(y), Number(m)-1, 1);
    endDate = new Date(Number(y), Number(m), 0, 23, 59, 59, 999);
  } else if (filter === 'year' && params?.year) {
    startDate = new Date(Number(params.year), 0, 1);
    endDate = new Date(Number(params.year), 11, 31, 23, 59, 59, 999);
  } else {
    // default to beginning of time
    startDate = new Date(0);
  }

  // Calculate previous period boundaries for revenue % change
  let prevStartDate = new Date(0);
  let prevEndDate = new Date(0);
  let hasPrevPeriod = false;

  if (filter === 'today') {
    prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - 1);
    prevEndDate = new Date(prevStartDate);
    prevEndDate.setHours(23,59,59,999);
    hasPrevPeriod = true;
  } else if (filter === 'weekly') {
    prevEndDate = new Date(startDate);
    prevEndDate.setMilliseconds(-1);
    prevStartDate = new Date(prevEndDate);
    prevStartDate.setDate(prevStartDate.getDate() - 7);
    hasPrevPeriod = true;
  } else if (filter === 'monthly') {
    prevEndDate = new Date(startDate);
    prevEndDate.setMilliseconds(-1);
    prevStartDate = new Date(prevEndDate);
    prevStartDate.setDate(prevStartDate.getDate() - 30);
    hasPrevPeriod = true;
  } else if (filter === 'range' && params?.start && params?.end) {
    const duration = endDate.getTime() - startDate.getTime();
    prevEndDate = new Date(startDate.getTime() - 1);
    prevStartDate = new Date(prevEndDate.getTime() - duration);
    hasPrevPeriod = true;
  } else if (filter === 'month' && params?.month) {
    const [y, m] = params.month.split('-');
    let py = Number(y);
    let pm = Number(m) - 1;
    if (pm === 0) { py -= 1; pm = 12; }
    prevStartDate = new Date(py, pm - 1, 1);
    prevEndDate = new Date(py, pm, 0, 23, 59, 59, 999);
    hasPrevPeriod = true;
  } else if (filter === 'year' && params?.year) {
    prevStartDate = new Date(Number(params.year) - 1, 0, 1);
    prevEndDate = new Date(Number(params.year) - 1, 11, 31, 23, 59, 59, 999);
    hasPrevPeriod = true;
  }
  
  // Fetch real data
  const { data: allOrders } = await supabase.from('orders').select('*, profile:profiles(name, email), order_items(*)').order('created_at', { ascending: false });
  const { data: products } = await supabase.from('products').select('*, product_variants(*)');
  
  // Filter orders by date
  const orders = allOrders?.filter(o => {
    const oDate = new Date(o.created_at);
    if (filter === 'range' || filter === 'month' || filter === 'year') {
      return oDate >= startDate && oDate <= endDate;
    }
    return oDate >= startDate;
  }) || [];
  
  // 1. Total Revenue
  const totalRevenue = orders?.reduce((acc, order) => {
    if (order.status !== 'CANCELLED') return acc + order.total_amount;
    return acc;
  }, 0) || 0;
  
  // 2. Orders
  const ordersCount = orders?.length || 0;
  
  // Previous Period Revenue
  let revenueChangePercent = 0;
  let revenueChangeIsPositive = true;
  
  if (hasPrevPeriod) {
    const prevOrders = allOrders?.filter(o => {
      const oDate = new Date(o.created_at);
      return oDate >= prevStartDate && oDate <= prevEndDate;
    }) || [];
    
    const prevRevenue = prevOrders.reduce((acc, order) => {
      if (order.status !== 'CANCELLED') return acc + order.total_amount;
      return acc;
    }, 0);
    
    if (prevRevenue === 0) {
      revenueChangePercent = totalRevenue > 0 ? 100 : 0;
    } else {
      revenueChangePercent = Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100);
    }
    revenueChangeIsPositive = revenueChangePercent >= 0;
  }
  
  // 3. Total Registered Customers (All Time)
  const { count: totalProfilesCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const newCustomers = totalProfilesCount || 0;

  // 4. Low Stock
  let lowStockCount = 0;
  const productsWithSales: Record<string, { product: any, quantitySold: number, revenue: number }> = {};
  
  products?.forEach(p => {
    productsWithSales[p.id] = { product: p, quantitySold: 0, revenue: 0 };
    if (p.product_variants && p.product_variants.length > 0) {
      const hasLowStock = p.product_variants.some((v: any) => v.stock_quantity < 10);
      if (hasLowStock) lowStockCount++;
    }
  });

  // Calculate top selling
  orders?.forEach(o => {
    if (o.status !== 'CANCELLED') {
      o.order_items?.forEach((item: any) => {
        if (!productsWithSales[item.product_id]) {
          productsWithSales[item.product_id] = { 
            product: { id: item.product_id, name: 'Unknown Product', image_url: null }, 
            quantitySold: 0, 
            revenue: 0 
          };
        }
        productsWithSales[item.product_id].quantitySold += (item.quantity || 1);
        productsWithSales[item.product_id].revenue += ((item.quantity || 1) * (item.price_at_time || item.price || 0));
      });
    }
  });

  const topSelling = Object.values(productsWithSales)
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, 3)
    .filter(p => p.quantitySold > 0);

  const recentOrders = orders?.slice(0, 10) || [];
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Premium Header Section */}
      <div className="relative z-40 rounded-3xl bg-gradient-to-br from-primary-custom via-[#5a4800] to-[#2c2400] p-8 md:p-10 text-white shadow-xl">
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-8 -translate-y-8">
            <TrendingUp className="w-64 h-64 text-white" />
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-display-lg mb-3 tracking-tight text-white flex items-center gap-3">
              Dashboard Overview
            </h1>
            <p className="text-white/80 font-body-lg max-w-2xl text-lg">
              Welcome back! Here's a summary of your performance and operations for the selected timeframe.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-lg">
            <Link href="/admin?filter=today" className={`px-5 py-2.5 font-bold text-sm rounded-xl transition-all ${filter === 'today' ? 'bg-white text-forest-deep shadow-md scale-105' : 'text-white/80 hover:bg-white/10'}`}>Today</Link>
            <Link href="/admin?filter=weekly" className={`px-5 py-2.5 font-bold text-sm rounded-xl transition-all ${filter === 'weekly' ? 'bg-white text-forest-deep shadow-md scale-105' : 'text-white/80 hover:bg-white/10'}`}>Weekly</Link>
            <Link href="/admin?filter=monthly" className={`px-5 py-2.5 font-bold text-sm rounded-xl transition-all ${filter === 'monthly' ? 'bg-white text-forest-deep shadow-md scale-105' : 'text-white/80 hover:bg-white/10'}`}>Monthly</Link>
            <Link href="/admin?filter=all" className={`px-5 py-2.5 font-bold text-sm rounded-xl transition-all ${filter === 'all' ? 'bg-white text-forest-deep shadow-md scale-105' : 'text-white/80 hover:bg-white/10'}`}>All Time</Link>
            <div className="h-8 w-px bg-white/20 mx-1 hidden sm:block"></div>
            <div className="pl-1">
              <AdminDatePicker />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none transform group-hover:scale-110 transition-transform duration-500">
            <IndianRupee className="w-24 h-24 text-primary-custom" />
          </div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="p-3 bg-gradient-to-br from-secondary-container to-secondary-container/50 rounded-2xl shadow-inner">
              <IndianRupee className="text-forest-deep w-6 h-6" />
            </div>
            {hasPrevPeriod && (
              <span className={`${revenueChangeIsPositive ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-error bg-error-container/30 border-error/10'} px-2 py-1 rounded-lg font-bold text-xs flex items-center gap-1 border`}>
                <TrendingUp className={`w-3 h-3 ${!revenueChangeIsPositive && 'rotate-180'}`} /> {revenueChangeIsPositive ? '+' : ''}{revenueChangePercent}%
              </span>
            )}
          </div>
          <h3 className="text-on-surface-variant font-bold text-xs mb-2 uppercase tracking-widest relative z-10">Total Revenue</h3>
          <p className="font-display-lg text-4xl text-forest-deep relative z-10">₹{totalRevenue.toLocaleString()}</p>
        </div>

        {/* Orders */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none transform group-hover:scale-110 transition-transform duration-500">
            <ShoppingCart className="w-24 h-24 text-primary-custom" />
          </div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="p-3 bg-gradient-to-br from-primary-container to-primary-container/50 rounded-2xl shadow-inner">
              <ShoppingCart className="text-primary-custom w-6 h-6" />
            </div>
          </div>
          <h3 className="text-on-surface-variant font-bold text-xs mb-2 uppercase tracking-widest relative z-10">Total Orders</h3>
          <p className="font-display-lg text-4xl text-forest-deep relative z-10">{ordersCount}</p>
        </div>

        {/* New Customers */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none transform group-hover:scale-110 transition-transform duration-500">
            <Users className="w-24 h-24 text-tertiary" />
          </div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="p-3 bg-gradient-to-br from-tertiary-container/50 to-tertiary-container/30 rounded-2xl shadow-inner">
              <Users className="text-tertiary w-6 h-6" />
            </div>
            <span className="text-tertiary bg-tertiary-container/30 px-2 py-1 rounded-lg font-bold text-xs border border-tertiary/10">All Time</span>
          </div>
          <h3 className="text-on-surface-variant font-bold text-xs mb-2 uppercase tracking-widest relative z-10">Total Customers</h3>
          <p className="font-display-lg text-4xl text-forest-deep relative z-10">{newCustomers}</p>
        </div>

        {/* Low Stock */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none transform group-hover:scale-110 transition-transform duration-500">
            <AlertTriangle className="w-24 h-24 text-error" />
          </div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="p-3 bg-gradient-to-br from-error-container to-error-container/50 rounded-2xl shadow-inner">
              <AlertTriangle className="text-error w-6 h-6" />
            </div>
            {lowStockCount > 0 && <span className="text-error bg-error-container px-2 py-1 rounded-lg font-bold text-xs flex items-center gap-1 border border-error/20 animate-pulse"><div className="w-1.5 h-1.5 rounded-full bg-error"></div> Action Needed</span>}
          </div>
          <h3 className="text-on-surface-variant font-bold text-xs mb-2 uppercase tracking-widest relative z-10">Low Stock Items</h3>
          <p className="font-display-lg text-4xl text-forest-deep relative z-10">{lowStockCount}</p>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Recent Orders Table */}
        <section className="lg:col-span-2 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20 overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-lowest/50">
            <h3 className="font-headline-md text-2xl text-forest-deep flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-primary-custom" /> Recent Orders
            </h3>
            <Link className="flex items-center gap-2 text-primary-custom font-bold text-sm bg-primary-container/20 px-4 py-2 rounded-xl hover:bg-primary-container/40 transition-colors" href="/admin/orders">
              View All Orders <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-surface-container-lowest/80 text-on-surface-variant/70 text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-8 py-5">Order Details</th>
                  <th className="px-8 py-5">Customer</th>
                  <th className="px-8 py-5 text-right">Amount</th>
                  <th className="px-8 py-5 text-center">Status</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-sm">
                {recentOrders.map((order: any) => {
                  const initial = order.profile?.name ? order.profile.name.charAt(0).toUpperCase() : 'U';
                  const date = new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
                  let statusColor = 'bg-surface-container text-on-surface-variant border-outline-variant/30';
                  let dotColor = 'bg-outline-variant';
                  if (order.status === 'CONFIRMED') { statusColor = 'bg-primary-container/50 text-primary-custom border-primary-custom/20'; dotColor = 'bg-primary-custom'; }
                  if (order.status === 'SHIPPED') { statusColor = 'bg-secondary-container/50 text-secondary-fixed border-secondary-fixed/20'; dotColor = 'bg-secondary-fixed'; }
                  if (order.status === 'DELIVERED') { statusColor = 'bg-emerald-50 text-emerald-700 border-emerald-200'; dotColor = 'bg-emerald-500'; }
                  if (order.status === 'CANCELLED') { statusColor = 'bg-error-container/50 text-error border-error/20'; dotColor = 'bg-error'; }

                  return (
                    <tr key={order.id} className="hover:bg-surface-container-lowest transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-forest-deep text-base">#{order.id.toString().slice(-4)}</span>
                          <span className="text-xs text-on-surface-variant/70">{date}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-sm font-bold text-forest-deep shadow-inner border border-white">
                            {initial}
                          </div>
                          <span className="font-bold text-on-surface">{order.profile?.name || 'Guest User'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="font-bold text-forest-deep text-base">₹{order.total_amount}</span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${statusColor}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span> {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <Link href="/admin/orders" className="inline-flex items-center justify-center w-10 h-10 bg-white border border-outline-variant/40 rounded-xl text-forest-deep hover:text-primary-custom hover:border-primary-custom/40 hover:bg-primary-container/10 transition-all shadow-sm" title="View in Order Management">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-on-surface-variant/60">
                        <ShoppingCart className="w-16 h-16 mb-4 opacity-30" />
                        <p className="font-headline-md text-lg text-forest-deep mb-1">No Orders Found</p>
                        <p className="text-sm">Try adjusting your date filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Top Selling Products */}
          <section className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20 p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-headline-md text-2xl text-forest-deep flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-custom" /> Top Selling
              </h3>
            </div>
            
            <div className="space-y-6">
              {topSelling.length > 0 ? topSelling.map((ts: any, idx: number) => {
                const maxSold = topSelling[0].quantitySold;
                const percentage = Math.max(10, (ts.quantitySold / maxSold) * 100);
                return (
                  <div key={ts.product.id} className="flex gap-4 items-center group">
                    <div className="w-16 h-16 rounded-2xl bg-surface-container overflow-hidden shrink-0 border border-outline-variant/20 shadow-sm relative">
                      <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={ts.product.name} src={ts.product.image_url || '/product-placeholder.svg'} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-sm text-forest-deep line-clamp-1 group-hover:text-primary-custom transition-colors">{ts.product.name}</h4>
                      <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mt-0.5">{ts.quantitySold} units sold</p>
                      <div className="w-full bg-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-primary-custom to-gold-accent h-full rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-forest-deep">₹{ts.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-8 text-on-surface-variant flex flex-col items-center">
                  <PackageOpen className="w-10 h-10 opacity-30 mb-3" />
                  <p className="font-bold">No sales yet</p>
                  <p className="text-xs">Adjust filters to view data</p>
                </div>
              )}
            </div>
          </section>

          {/* Inventory Alert Banner */}
          <section className={`relative overflow-hidden rounded-3xl p-8 text-white shadow-xl group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${lowStockCount > 0 ? 'bg-gradient-to-br from-vermillion-clay to-[#8a1c1c]' : 'bg-gradient-to-br from-emerald-600 to-emerald-800'}`}>
            <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
              {lowStockCount > 0 ? <AlertTriangle className="w-32 h-32 text-white" /> : <CheckCircle2 className="w-32 h-32 text-white" />}
            </div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 shadow-inner border border-white/30">
                {lowStockCount > 0 ? <AlertTriangle className="w-8 h-8 text-white" /> : <CheckCircle2 className="w-8 h-8 text-white" />}
              </div>
              <h3 className="font-display-sm text-2xl font-bold mb-2">{lowStockCount > 0 ? 'Inventory Alert' : 'Stock Healthy'}</h3>
              <p className="text-white/90 text-sm mb-6 max-w-[250px]">
                {lowStockCount > 0 
                  ? `You have ${lowStockCount} items running below optimal stock levels.` 
                  : 'All inventory levels are completely healthy.'}
              </p>
              <Link 
                href="/admin/inventory" 
                className={`w-full block text-center py-3 bg-white rounded-xl font-bold transition-colors shadow-lg active:scale-95 ${lowStockCount > 0 ? 'text-vermillion-clay hover:bg-cream-bg' : 'text-emerald-700 hover:bg-emerald-50'}`}
              >
                Manage Stock Levels
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
