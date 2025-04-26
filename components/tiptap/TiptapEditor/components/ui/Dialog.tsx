import React from 'react'
import { createPortal } from 'react-dom'

interface DialogProps {
    children: React.ReactNode
    open: boolean
    onOpenChange?: (open: boolean) => void
}

const Dialog = ({ children, open, onOpenChange }: DialogProps) => {
    const onDismiss = () => {
        onOpenChange?.(false)
    }

    if (!open) return

    return createPortal(
        <div
            role='dialog'
            className='fixed inset-0 z-50 items-center bg-slate-900/70'
            onClick={onDismiss}
        >
            <div className='rte-dialog__content' onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        document.querySelector('body')!
    )
}

export default Dialog
