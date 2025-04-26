import React from 'react'
import { cn } from '@/lib/utils'

type BoxRenderProps<T> = {
    item: T
    onClick: (value: string) => void
    children?: React.ReactNode
    className?: string
}

export function BoxRender<T extends { id: string }>({
    item,
    onClick,
    children,
    className,
}: BoxRenderProps<T>) {
    return (
        <div
            onClick={() => onClick(item.id)}
            className={cn(
                'group flex w-full cursor-pointer items-center justify-between rounded-md p-1.5 text-sm leading-normal text-primary hover:bg-primary-foreground hover:bg-zinc-100',
                className
            )}
        >
            {children}
        </div>
    )
}
