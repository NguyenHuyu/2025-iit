'use client'
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function DialogWrapper({
    children,
    label,
    className,
    variant = 'default',
    description,
    interactOutside = true,
}: {
    children: React.ReactNode
    label?: string
    className?: string
    variant?: 'default' | 'large' | 'small'
    description?: string
    interactOutside?: boolean
}) {
    const router = useRouter()

    const handleOpenChange = () => {
        router.back()
    }

    const variantSizes: Record<typeof variant, string> = {
        small: 'max-w-xs md:max-w-md lg:max-w-xl xl:max-w-3xl',
        default: 'max-w-xs md:max-w-xl lg:max-w-3xl xl:max-w-5xl',
        large: 'max-w-sm md:max-w-2xl lg:max-w-5xl xl:max-w-7xl',
    }

    return (
        <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
            <DialogContent
                onInteractOutside={!interactOutside ? (e) => e.preventDefault() : undefined}
                className={cn(className, variantSizes[variant])}
            >
                {label && (
                    <DialogHeader>
                        <DialogTitle>{label}</DialogTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>
                )}
                <ScrollArea className='h-auto max-h-96 w-full p-2 md:min-h-[70vh]'>
                    {children}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
