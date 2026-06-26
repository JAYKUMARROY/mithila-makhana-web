"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, Warehouse, LogOut, Users, Truck } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getUser, logout } from '@/app/actions/auth'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    if (pathname !== '/admin/login') {
      getUser().then(user => {
        if (user) setAdminUser(user);
      });
    }
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
  };

  const navLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Shipments', href: '/admin/shipments', icon: Truck },
    { name: 'Inventory', href: '/admin/inventory', icon: Warehouse },
  ];

  if (pathname === '/admin/login') {
    return <main className="min-h-screen bg-cream-bg">{children}</main>;
  }

  return (
    <div className="bg-cream-bg text-on-surface font-body-md antialiased min-h-screen flex">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-20 hover:w-64 z-50 flex flex-col py-6 bg-surface-container-lowest shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group">
        <div className="mb-8 px-4 flex items-center h-10 overflow-hidden whitespace-nowrap">
          <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-forest-deep text-white rounded-xl font-headline-md font-bold text-xl shadow-sm">
            M
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-4 flex flex-col justify-center">
            <h1 className="font-headline-md text-headline-md text-forest-deep leading-none">Admin Panel</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant opacity-70 leading-none mt-1">Mithila Makhana</p>
          </div>
        </div>
        
        <nav className="flex-grow space-y-2 px-3 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center rounded-xl px-3 py-3 transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-secondary-container text-on-secondary-container shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
                title={link.name}
              >
                <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${isActive ? 'active-nav-fill' : ''}`} />
                </div>
                <span className="font-label-lg text-label-lg ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {link.name}
                </span>
              </Link>
            )
          })}
        </nav>
        
        <div className="mt-auto border-t border-outline-variant/30 pt-4 px-4 flex items-center overflow-hidden whitespace-nowrap">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold flex-shrink-0 shadow-sm border border-outline-variant/20">
            {adminUser?.user_metadata?.full_name ? adminUser.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'AU'}
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-3 flex-1 overflow-hidden">
            <p className="font-label-lg text-label-lg leading-none truncate">{adminUser?.user_metadata?.full_name || 'Admin User'}</p>
            <p className="text-[10px] text-on-surface-variant truncate mt-1" title={adminUser?.email}>{adminUser?.email || 'Super Admin'}</p>
          </div>
          {adminUser ? (
            <button onClick={handleLogout} title="Logout" className="opacity-0 group-hover:opacity-100 transition-all duration-300 ml-auto p-2 text-on-surface-variant hover:text-error hover:bg-error/10 hover:scale-110 hover:-translate-y-0.5 rounded-lg flex-shrink-0">
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <Link href="/admin/login" title="Login" className="opacity-0 group-hover:opacity-100 transition-all duration-300 ml-auto p-2 text-on-surface-variant hover:text-primary-custom hover:bg-primary-container/20 hover:scale-110 hover:-translate-y-0.5 rounded-lg flex-shrink-0">
              <LogOut className="w-5 h-5 rotate-180" />
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-20 p-4 md:p-8 min-h-screen flex flex-col w-full transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
