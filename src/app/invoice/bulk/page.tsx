"use client"

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getOrderLabel } from '@/app/actions/shipmozo'
import { ArrowLeft, Printer } from 'lucide-react'

export default function BulkInvoicePage() {
  const searchParams = useSearchParams()
  const awbs = searchParams?.get('awbs')
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pdfUrl, setPdfUrl] = useState('')

  useEffect(() => {
    async function loadLabels() {
      if (!awbs) {
        setError('No AWBs provided for bulk printing.')
        setLoading(false)
        return
      }

      const res = await getOrderLabel(awbs);
      if (res.success && res.labelBase64) {
        try {
          const byteCharacters = atob(res.labelBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
        } catch (err) {
          setError('Failed to parse the bulk PDF label.');
        }
      } else {
        setError(res.message || 'Failed to generate bulk label.');
      }
      setLoading(false)
    }

    loadLabels()
  }, [awbs])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-bg flex items-center justify-center font-body-md">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-custom border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-forest-deep font-label-lg">Generating Bulk Labels from Shipmozo...</p>
          <p className="text-on-surface-variant text-sm mt-2">This may take a moment for multiple AWBs.</p>
        </div>
      </div>
    )
  }

  if (error || !pdfUrl) {
    return (
      <div className="min-h-screen bg-cream-bg flex items-center justify-center p-6 font-body-md">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-error/20 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-error text-2xl font-bold">!</span>
          </div>
          <h1 className="text-2xl font-headline-md text-forest-deep mb-2">Error Generating Bulk Labels</h1>
          <p className="text-on-surface-variant mb-6">{error}</p>
          <button onClick={() => window.close()} className="px-6 py-2 bg-surface-container-high rounded-lg text-forest-deep font-label-md hover:bg-surface-container-highest transition-colors">
            Close Window
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full flex flex-col bg-charcoal-text font-body-md">
      <div className="h-16 bg-white shrink-0 flex items-center justify-between px-6 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => window.close()} className="p-2 hover:bg-surface-container-low rounded-lg transition-colors text-on-surface-variant">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-headline-md text-forest-deep text-lg">Bulk Shipping Labels</h1>
            <p className="text-xs text-on-surface-variant">{awbs?.split(',').length} Orders</p>
          </div>
        </div>
        <button 
          onClick={() => {
            const iframe = document.getElementById('pdf-iframe') as HTMLIFrameElement;
            iframe?.contentWindow?.print();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-custom text-white rounded-lg hover:bg-primary-custom/90 transition-colors font-label-md shadow-sm"
        >
          <Printer className="w-4 h-4" /> Print All
        </button>
      </div>
      <div className="flex-1 w-full bg-surface-container-highest">
        <iframe 
          id="pdf-iframe"
          src={pdfUrl} 
          className="w-full h-full border-none"
          title="Bulk Shipping Labels"
        />
      </div>
    </div>
  )
}
