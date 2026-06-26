"use client"
import { Printer } from 'lucide-react'
import { useEffect } from 'react'

export function InvoicePrintButton() {
  useEffect(() => {
    // Small delay to ensure images load
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <button 
      onClick={() => window.print()} 
      className="bg-forest-deep text-white px-6 py-2.5 rounded-lg font-bold shadow-sm hover:opacity-90 transition flex items-center gap-2"
    >
      <Printer className="w-4 h-4" /> Print Label / Invoice
    </button>
  )
}
