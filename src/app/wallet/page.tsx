'use client'

import { useState, useEffect } from 'react'
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, Gift, ShoppingBag } from 'lucide-react'
import { getWalletBalance, getWalletTransactions } from '@/app/actions/wallet'
import Link from 'next/link'

export default function WalletPage() {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadWallet() {
      const bal = await getWalletBalance()
      const txs = await getWalletTransactions()
      setBalance(bal)
      setTransactions(txs)
      setLoading(false)
    }
    loadWallet()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-custom border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Hero / Balance Card */}
        <div className="bg-gradient-to-br from-[#1a1400] via-[#3a2e00] to-[#1a1400] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="w-48 h-48 transform rotate-12" />
          </div>
          
          <div className="relative z-10">
            <h1 className="font-headline-md text-primary-custom/80 mb-2">My Wallet</h1>
            <div className="font-headline-lg text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight">
              ₹{balance.toLocaleString()}
            </div>
            
            <p className="text-white/60 text-sm max-w-md mb-8">
              Available balance. You can use up to 70% of your order total from your wallet. Credits expire 30 days after earning.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/referral" className="inline-flex items-center justify-center px-6 py-3 bg-primary-custom text-[#1a1400] rounded-xl font-bold hover:bg-white transition-colors">
                <Gift className="w-4 h-4 mr-2" /> Refer & Earn More
              </Link>
              <Link href="/shop" className="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors">
                <ShoppingBag className="w-4 h-4 mr-2" /> Shop Now
              </Link>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-outline-variant/30">
          <div className="p-6 sm:p-8 border-b border-outline-variant/20">
            <h2 className="font-headline-md text-forest-deep text-xl">Transaction History</h2>
          </div>
          
          <div className="divide-y divide-outline-variant/10">
            {transactions.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
                  <Wallet className="w-8 h-8 text-on-surface-variant/50" />
                </div>
                <h3 className="font-label-lg text-lg text-forest-deep mb-2">Your wallet is empty</h3>
                <p className="text-on-surface-variant max-w-sm mx-auto mb-6">
                  Refer friends to Mithila Makhana and earn ₹50 for every successful referral!
                </p>
                <Link href="/referral" className="text-primary-custom font-bold hover:underline">
                  Start referring now →
                </Link>
              </div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="p-6 sm:p-8 flex items-center justify-between hover:bg-surface-container-lowest/80 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      tx.type === 'CREDIT' ? 'bg-emerald-50 text-emerald-600' :
                      tx.type === 'DEBIT' ? 'bg-rose-50 text-rose-600' :
                      'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {tx.type === 'CREDIT' ? <ArrowDownRight className="w-5 h-5" /> : 
                       tx.type === 'DEBIT' ? <ArrowUpRight className="w-5 h-5" /> : 
                       <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className={`font-bold ${tx.type === 'EXPIRED' ? 'text-on-surface-variant/70 line-through' : 'text-forest-deep'}`}>
                        {tx.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-on-surface-variant">
                          {new Date(tx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {new Date(tx.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {tx.type === 'CREDIT' && tx.remaining_amount > 0 && tx.expires_at && (
                          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            Expires {new Date(tx.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-headline-md text-lg ${
                      tx.type === 'CREDIT' ? 'text-emerald-600' :
                      tx.type === 'DEBIT' ? 'text-forest-deep' :
                      'text-on-surface-variant/50'
                    }`}>
                      {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">Balance: ₹{tx.balance_after}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>
    </div>
  )
}
