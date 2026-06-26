'use client'

import { useState, useEffect } from 'react'
import { Gift, Users, Copy, Share2, CheckCircle, Clock, Wallet, ExternalLink, ArrowUpRight } from 'lucide-react'
import { getReferralStats } from '@/app/actions/referral'
import Link from 'next/link'
import { useToast } from '@/components/toast'

export default function ReferralDashboard() {
  const { showToast } = useToast()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const data = await getReferralStats()
      setStats(data)
      setLoading(false)
    }
    loadStats()
  }, [])

  const handleCopyCode = () => {
    if (!stats?.code) return
    navigator.clipboard.writeText(stats.code)
    showToast('Referral code copied to clipboard!', 'success')
  }

  const handleCopyLink = () => {
    if (!stats?.code) return
    const link = `${window.location.origin}/refer?code=${stats.code}`
    navigator.clipboard.writeText(link)
    showToast('Referral link copied to clipboard!', 'success')
  }

  const handleWhatsApp = () => {
    if (!stats?.code) return
    const link = `${window.location.origin}/refer?code=${stats.code}`
    const text = `Hey! I love Mithila Makhana. Sign up using my link and when you place your first order (≥₹349), we both get rewarded! ${link}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleShare = async () => {
    if (!stats?.code) return
    const link = `${window.location.origin}/refer?code=${stats.code}`
    try {
      await navigator.share({
        title: 'Join Mithila Makhana',
        text: 'Sign up using my link to get premium Makhana!',
        url: link
      })
    } catch (e) {
      console.log('Share error', e)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-custom border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#1a1400] via-[#3a2e00] to-[#1a1400] rounded-3xl p-8 sm:p-12 text-white shadow-xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Gift className="w-48 h-48 transform rotate-12" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h1 className="font-headline-lg text-4xl sm:text-5xl font-bold mb-4">Refer & Earn ₹50</h1>
            <p className="text-white/80 text-lg mb-8">
              Share your love for premium Makhana. When your friend places their first order (≥₹349) and it gets delivered, you earn ₹50 in your wallet!
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8 max-w-sm mx-auto">
              <p className="text-primary-custom font-bold uppercase tracking-widest text-xs mb-2">Your Referral Code</p>
              <div className="font-headline-lg text-4xl font-bold tracking-widest bg-gradient-to-r from-primary-custom to-white text-transparent bg-clip-text select-all">
                {stats?.code}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={handleCopyCode} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors flex items-center gap-2">
                <Copy className="w-4 h-4" /> Copy Code
              </button>
              <button onClick={handleCopyLink} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> Copy Link
              </button>
              <button onClick={handleWhatsApp} className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-lg shadow-green-900/50">
                <Share2 className="w-4 h-4" /> WhatsApp
              </button>
              <button onClick={handleShare} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30 text-center">
            <div className="w-12 h-12 bg-primary-custom/10 text-primary-custom rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-forest-deep mb-2">1. Share Your Code</h3>
            <p className="text-sm text-on-surface-variant">Send your unique code or link to your friends and family.</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30 text-center">
            <div className="w-12 h-12 bg-primary-custom/10 text-primary-custom rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-forest-deep mb-2">2. Friend Orders</h3>
            <p className="text-sm text-on-surface-variant">They sign up and place their first order worth ₹349 or more.</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30 text-center">
            <div className="w-12 h-12 bg-primary-custom/10 text-primary-custom rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-forest-deep mb-2">3. You Earn ₹50</h3>
            <p className="text-sm text-on-surface-variant">Once their order is delivered, ₹50 is added to your wallet!</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/30">
            <Users className="w-6 h-6 text-blue-500 mb-3" />
            <p className="text-sm text-on-surface-variant font-bold uppercase tracking-wider mb-1">Signups</p>
            <p className="font-headline-lg text-3xl text-forest-deep">{stats?.total || 0}</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/30">
            <CheckCircle className="w-6 h-6 text-emerald-500 mb-3" />
            <p className="text-sm text-on-surface-variant font-bold uppercase tracking-wider mb-1">Successful</p>
            <p className="font-headline-lg text-3xl text-forest-deep">{stats?.successful || 0}</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/30">
            <Clock className="w-6 h-6 text-amber-500 mb-3" />
            <p className="text-sm text-on-surface-variant font-bold uppercase tracking-wider mb-1">Pending</p>
            <p className="font-headline-lg text-3xl text-forest-deep">{stats?.pending || 0}</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/30 group hover:border-primary-custom/50 transition-colors">
            <Link href="/wallet" className="block">
              <Wallet className="w-6 h-6 text-primary-custom mb-3" />
              <p className="text-sm text-on-surface-variant font-bold uppercase tracking-wider mb-1">Wallet</p>
              <div className="flex items-end justify-between">
                <p className="font-headline-lg text-3xl text-forest-deep">₹{stats?.walletBalance || 0}</p>
                <ArrowUpRight className="w-5 h-5 text-on-surface-variant opacity-50 group-hover:opacity-100 group-hover:text-primary-custom transition-all" />
              </div>
            </Link>
          </div>
        </div>

        {/* History */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-outline-variant/30">
          <div className="p-6 sm:p-8 border-b border-outline-variant/20">
            <h2 className="font-headline-md text-forest-deep text-xl">Referral History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm whitespace-nowrap">
              <thead className="bg-surface-container-low/30 text-on-surface-variant text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-8 py-5">Friend</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Reward</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-sm">
                {!stats?.history || stats.history.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-16 text-center text-on-surface-variant">
                      <Gift className="w-10 h-10 mx-auto mb-3 opacity-50" />
                      <p>You haven't referred anyone yet.</p>
                      <p className="text-xs mt-1 opacity-70">Share your code above to get started!</p>
                    </td>
                  </tr>
                ) : (
                  stats.history.map((item: any) => (
                    <tr key={item.id} className="hover:bg-surface-container-lowest/80 transition-colors">
                      <td className="px-8 py-5 font-bold text-forest-deep">{item.friendName}</td>
                      <td className="px-8 py-5 text-on-surface-variant">
                        {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-5">
                        {item.status === 'COMPLETED' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700">
                            <CheckCircle className="w-3.5 h-3.5" /> Successful
                          </span>
                        ) : item.status === 'EXPIRED' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-surface-container-high text-on-surface-variant">
                            <Clock className="w-3.5 h-3.5" /> Expired
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700">
                            <Clock className="w-3.5 h-3.5" /> Pending Order
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right font-headline-md">
                        {item.reward > 0 ? (
                          <span className="text-emerald-600">+₹{item.reward}</span>
                        ) : (
                          <span className="text-on-surface-variant/50">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  )
}
