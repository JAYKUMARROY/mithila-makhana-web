"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, Warehouse, LogOut, Users } from 'lucide-react'
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
    { name: 'Inventory', href: '/admin/inventory', icon: Warehouse },
  ];

  if (pathname === '/admin/login') {
    return <main className="min-h-screen bg-cream-bg">{children}</main>;
  }

  return (
    <div className="bg-cream-bg text-on-surface font-body-md antialiased min-h-screen flex">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 z-40 flex flex-col p-4 bg-surface-container-lowest shadow-md">
        <div className="mb-8 px-4">
          <h1 className="font-headline-md text-headline-md text-forest-deep">Admin Panel</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant opacity-70">Mithila Makhana CMS</p>
        </div>
        
        <nav className="flex-grow space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                  isActive 
                    ? 'bg-secondary-container text-on-secondary-container' 
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'active-nav-fill' : ''}`} />
                <span className="font-label-lg text-label-lg">{link.name}</span>
              </Link>
            )
          })}
        </nav>
        
        <div className="mt-auto border-t border-outline-variant pt-4 flex items-center gap-3 px-4">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold flex-shrink-0">
            {adminUser?.user_metadata?.full_name ? adminUser.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'AU'}
          </div>
          <div className="overflow-hidden">
            <p className="font-label-lg text-label-lg leading-none truncate">{adminUser?.user_metadata?.full_name || 'Admin User'}</p>
            <p className="text-[10px] text-on-surface-variant truncate" title={adminUser?.email}>{adminUser?.email || 'Super Admin'}</p>
          </div>
          <button onClick={handleLogout} className="ml-auto text-on-surface-variant hover:text-error transition-colors flex-shrink-0">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 p-8 min-h-screen flex flex-col w-full">
        {children}
      </main>
    </div>
  )
}
