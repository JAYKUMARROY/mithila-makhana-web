import Link from 'next/link'
import { Calendar, IndianRupee, TrendingUp, ShoppingCart, Users, AlertTriangle, Eye, MoreHorizontal, PackageOpen } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const supabase = await createClient();
  const params = await searchParams;
  const filter = params?.filter || 'today';
  
  // Date boundaries
  const now = new Date();
  let startDate = new Date();
  if (filter === 'today') {
    startDate.setHours(0,0,0,0);
  } else if (filter === 'weekly') {
    startDate.setDate(now.getDate() - 7);
  } else if (filter === 'monthly') {
    startDate.setDate(now.getDate() - 30);
  } else {
    // default to beginning of time
    startDate = new Date(0);
  }
  
  // Fetch real data
  const { data: allOrders } = await supabase.from('orders').select('*, profile:profiles(name, email), order_items(*)').order('created_at', { ascending: false });
  const { data: products } = await supabase.from('products').select('*');
  
  // Filter orders by date
  const orders = allOrders?.filter(o => new Date(o.created_at) >= startDate) || [];
  
  // 1. Total Revenue
  const totalRevenue = orders?.reduce((acc, order) => {
    if (order.status !== 'CANCELLED') return acc + order.total_amount;
    return acc;
  }, 0) || 0;
  
  // 2. Orders Today
  const today = new Date().toISOString().split('T')[0];
  const ordersToday = orders?.filter(o => o.created_at.startsWith(today)).length || 0;
  
  // 3. New Customers (unique users)
  const uniqueUsers = new Set(orders?.map(o => o.user_id));
  const newCustomers = uniqueUsers.size;

  // 4. Low Stock
  let lowStockCount = 0;
  const productsWithSales: Record<string, { product: any, quantitySold: number, revenue: number }> = {};
  
  products?.forEach(p => {
    productsWithSales[p.id] = { product: p, quantitySold: 0, revenue: 0 };
    if (p.description) {
      try {
        const meta = JSON.parse(p.description);
        if (meta.sizes) {
          const hasLowStock = meta.sizes.some((s: any) => Number(s.stock) < 10);
          if (hasLowStock) lowStockCount++;
        }
      } catch(e) {}
    }
  });

  // Calculate top selling
  orders?.forEach(o => {
    if (o.status !== 'CANCELLED') {
      o.order_items?.forEach((item: any) => {
        if (productsWithSales[item.product_id]) {
          productsWithSales[item.product_id].quantitySold += item.quantity;
          productsWithSales[item.product_id].revenue += (item.quantity * item.price_at_time);
        }
      });
    }
  });

  const topSelling = Object.values(productsWithSales)
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, 3)
    .filter(p => p.quantitySold > 0);

  const recentOrders = orders?.slice(0, 4) || [];
  return (
    <>
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-forest-deep">Dashboard Overview</h2>
          <p className="text-on-surface-variant font-body-md">Welcome back! Here's what's happening {filter}.</p>
        </div>
        <div className="flex items-center gap-3 bg-surface-container-low p-1 rounded-lg border border-outline-variant/30">
          <Link href="/admin?filter=today" className={`px-4 py-2 font-label-lg text-label-lg rounded-md transition-all ${filter === 'today' ? 'bg-surface-container-lowest shadow-sm text-forest-deep' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>Today</Link>
          <Link href="/admin?filter=weekly" className={`px-4 py-2 font-label-lg text-label-lg rounded-md transition-all ${filter === 'weekly' ? 'bg-surface-container-lowest shadow-sm text-forest-deep' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>Weekly</Link>
          <Link href="/admin?filter=monthly" className={`px-4 py-2 font-label-lg text-label-lg rounded-md transition-all ${filter === 'monthly' ? 'bg-surface-container-lowest shadow-sm text-forest-deep' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>Monthly</Link>
          <Link href="/admin?filter=all" className={`px-4 py-2 font-label-lg text-label-lg rounded-md transition-all ${filter === 'all' ? 'bg-surface-container-lowest shadow-sm text-forest-deep' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>All Time</Link>
          <div className="h-6 w-[1px] bg-outline-variant mx-1"></div>
          <button className="p-2 flex items-center text-on-surface-variant hover:text-primary-custom transition-colors">
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* KPI Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(44,76,59,0.05)] border border-outline-variant/20 hover:scale-[1.02] transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary-container rounded-lg">
              <IndianRupee className="text-forest-deep w-6 h-6" />
            </div>
            <span className="text-forest-deep font-bold text-sm flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <h3 className="text-on-surface-variant font-label-lg text-label-lg mb-1 uppercase tracking-wider">Total Revenue</h3>
          <p className="font-headline-md text-headline-md text-charcoal-text">₹{totalRevenue.toLocaleString()}</p>
        </div>

        {/* Orders Today */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(44,76,59,0.05)] border border-outline-variant/20 hover:scale-[1.02] transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary-container rounded-lg">
              <ShoppingCart className="text-on-primary-container w-6 h-6" />
            </div>
          </div>
          <h3 className="text-on-surface-variant font-label-lg text-label-lg mb-1 uppercase tracking-wider">Orders Today</h3>
          <p className="font-headline-md text-headline-md text-charcoal-text">{ordersToday}</p>
        </div>

        {/* New Customers */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(44,76,59,0.05)] border border-outline-variant/20 hover:scale-[1.02] transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-tertiary-container/30 rounded-lg">
              <Users className="text-tertiary w-6 h-6" />
            </div>
            <span className="text-tertiary font-bold text-sm">All Time</span>
          </div>
          <h3 className="text-on-surface-variant font-label-lg text-label-lg mb-1 uppercase tracking-wider">Customers</h3>
          <p className="font-headline-md text-headline-md text-charcoal-text">{newCustomers}</p>
        </div>

        {/* Low Stock */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(44,76,59,0.05)] border border-outline-variant/20 hover:scale-[1.02] transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-error-container rounded-lg">
              <AlertTriangle className="text-error w-6 h-6" />
            </div>
            {lowStockCount > 0 && <span className="text-error font-bold text-sm">Urgent</span>}
          </div>
          <h3 className="text-on-surface-variant font-label-lg text-label-lg mb-1 uppercase tracking-wider">Low Stock</h3>
          <p className="font-headline-md text-headline-md text-charcoal-text">{lowStockCount} items</p>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Recent Orders Table */}
        <section className="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(44,76,59,0.05)] border border-outline-variant/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center">
            <h3 className="font-headline-md text-headline-md text-forest-deep">Recent Orders</h3>
            <Link className="text-primary-custom font-label-lg text-label-lg hover:underline transition-all" href="/admin/orders">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-on-surface-variant font-label-lg text-label-lg">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {recentOrders.map((order: any) => {
                  const initial = order.profile?.name ? order.profile.name.charAt(0).toUpperCase() : 'U';
                  const date = new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
                  let statusColor = 'bg-surface-container-high text-on-surface-variant';
                  if (order.status === 'CONFIRMED') statusColor = 'bg-primary-container text-on-primary-container';
                  if (order.status === 'SHIPPED') statusColor = 'bg-secondary-fixed text-on-secondary-fixed';
                  if (order.status === 'DELIVERED') statusColor = 'bg-primary-fixed text-on-primary-fixed';
                  if (order.status === 'CANCELLED') statusColor = 'bg-error-container text-error';

                  return (
                    <tr key={order.id} className="hover:bg-cream-bg transition-colors">
                      <td className="px-6 py-4 font-label-lg">#{order.id.toString().slice(-4)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-xs font-bold text-forest-deep">{initial}</div>
                          <span>{order.profile?.name || 'Guest User'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant">{date}</td>
                      <td className="px-6 py-4 font-semibold">₹{order.total_amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusColor}`}>{order.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/admin/orders/${order.id}`} className="p-1 hover:bg-surface-container-high rounded transition-all block w-fit">
                          <Eye className="w-5 h-5 text-on-surface-variant" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">No orders yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sidebar: Top Selling Products */}
        <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(44,76,59,0.05)] border border-outline-variant/20 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-headline-md text-forest-deep">Top Selling</h3>
            <MoreHorizontal className="w-5 h-5 text-on-surface-variant cursor-pointer" />
          </div>
          <div className="space-y-6">
            {topSelling.length > 0 ? topSelling.map((ts: any, idx: number) => {
              const maxSold = topSelling[0].quantitySold;
              const percentage = Math.max(10, (ts.quantitySold / maxSold) * 100);
              return (
                <div key={ts.product.id} className="flex gap-4 items-center group">
                  <div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden shrink-0 border border-outline-variant/20">
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={ts.product.name} src={ts.product.image_url || 'https://via.placeholder.com/150'} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-label-lg text-label-lg text-forest-deep">{ts.product.name}</h4>
                    <p className="text-xs text-on-surface-variant">{ts.quantitySold} units sold</p>
                    <div className="w-full bg-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-gold-accent h-full rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-forest-deep">₹{ts.revenue.toLocaleString()}</p>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-8 text-on-surface-variant flex flex-col items-center">
                <PackageOpen className="w-8 h-8 opacity-50 mb-2" />
                <p>No sales yet</p>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-forest-deep rounded-lg text-primary-fixed relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="w-full h-full fill-current" viewBox="0 0 100 100">
                <path d="M0 0 L100 100 M100 0 L0 100 M50 0 L50 100 M0 50 L100 50" stroke="white" strokeWidth="0.5"></path>
              </svg>
            </div>
            <p className="font-label-lg text-label-lg mb-2 relative z-10">Inventory Alert</p>
            <p className="text-sm opacity-80 mb-4 relative z-10">{lowStockCount > 0 ? `${lowStockCount} items are running below threshold. Restock recommended.` : 'All inventory levels are healthy.'}</p>
            <Link href="/admin/products" className="block text-center w-full bg-gold-accent text-forest-deep font-bold py-2 rounded-md hover:bg-primary-fixed transition-colors relative z-10">Manage Stock</Link>
          </div>
        </section>
      </div>
      
      {/* Footer */}
      <footer className="mt-auto pt-12 pb-4 flex flex-col md:flex-row justify-between items-center text-on-surface-variant font-body-md opacity-60">
        <p>© 2024 Mithila Makhana. Preserving Heritage, Promoting Health.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link className="hover:text-primary-custom transition-colors" href="#">Privacy Policy</Link>
          <Link className="hover:text-primary-custom transition-colors" href="#">Terms of Service</Link>
          <Link className="hover:text-primary-custom transition-colors" href="#">Contact Us</Link>
        </div>
      </footer>
    </>
  )
}
