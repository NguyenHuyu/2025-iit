import React, { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { ValidationError } from '@tanstack/react-form'
import { cn } from '@/lib/utils'
import { StateInfo } from '@/components/forms/StateInfo'
import { StateError } from '@/components/forms/StateError'

type CustomFormFieldProps = {
    labelName: string
    children: ReactNode
    state?: 'error' | 'info'
    className?: string
    name: string
    meta: {
        errors: ValidationError[]
        isValidating?: boolean
        isTouched?: boolean
    }
    description?: string
}

export function CustomFormField({
    labelName,
    children,
    state = 'error',
    className,
    name,
    meta,
    description,
}: CustomFormFieldProps) {
    return (
        <div className={cn('flex w-full flex-col gap-2', className)}>
            <Label
                htmlFor={name}
                className={cn({
                    'text-red-500': meta?.errors?.length && state === 'error',
                    'text-yellow-500': meta?.errors?.length && state === 'info',
                })}
            >
                {labelName}
            </Label>
            {children}
            {state === 'error' && <StateError meta={meta} />}
            {state === 'info' && <StateInfo meta={meta} />}
            {description && <p className='text-xs text-yellow-800'>{description}</p>}
        </div>
    )
}
