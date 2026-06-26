"use client"
import { ShieldCheck } from 'lucide-react'

export function PaymentModal({ 
  isOpen, 
  onClose, 
  onSimulateSuccess, 
  onSimulateFailure, 
  isProcessing 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSimulateSuccess: () => void, 
  onSimulateFailure: () => void,
  isProcessing: boolean
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-[400px] w-full shadow-2xl text-center">
        <ShieldCheck className="w-16 h-16 text-gold-accent mx-auto mb-4" />
        <h3 className="font-headline-md text-forest-deep text-2xl mb-2">Payment Gateway Simulation</h3>
        <p className="text-on-surface-variant font-body-sm mb-8">
          This is a testing environment. Choose whether the payment should succeed or fail to test the checkout flow.
        </p>
        <div className="space-y-3">
          <button 
            onClick={onSimulateSuccess} 
            disabled={isProcessing}
            className="w-full py-3 bg-forest-deep text-white font-label-lg rounded-xl hover:bg-primary-custom transition-colors shadow-md disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Simulate Success'}
          </button>
          <button 
            onClick={onSimulateFailure} 
            disabled={isProcessing}
            className="w-full py-3 bg-error-container text-error font-label-lg rounded-xl hover:bg-error-container/80 transition-colors"
          >
            Simulate Failure
          </button>
          <button 
            onClick={onClose} 
            disabled={isProcessing}
            className="w-full py-2 text-on-surface-variant hover:text-forest-deep font-label-sm underline mt-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
