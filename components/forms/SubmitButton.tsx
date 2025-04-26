'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { VariantProps } from 'class-variance-authority'

export function SubmitButton({
    children,
    disabled,
    type = 'button',
    isSubmitting,
    onClick,
    variant = 'default',
    ...props
}: {
    children: React.ReactNode
    disabled?: boolean
    type?: 'submit' | 'reset' | 'button'
    onClick?: () => void
    isSubmitting?: boolean
    variant?: VariantProps<typeof Button>['variant']
}) {
    return (
        <Button
            variant={variant}
            onClick={onClick}
            type={type}
            disabled={disabled}
            {...props}
            className='w-32'
        >
            {isSubmitting ? (
                <>
                    <Loader2 className='animate-spin' />
                    Please wait
                </>
            ) : (
                children
            )}
        </Button>
    )
}
