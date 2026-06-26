"use client"
import { AlertTriangle, X } from 'lucide-react'

type ConfirmationDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = true
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDestructive ? 'bg-error/10 text-error' : 'bg-primary-custom/10 text-primary-custom'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-forest-deep mb-2">{title}</h3>
              <p className="text-on-surface-variant font-body-md text-sm leading-relaxed">{message}</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 flex justify-end gap-3 border-t border-outline-variant/20">
          <button 
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-forest-deep font-label-md hover:bg-surface-container-low transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl font-label-md transition-colors shadow-sm ${isDestructive ? 'bg-error text-white hover:bg-error/90' : 'bg-forest-deep text-white hover:bg-primary-custom'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
