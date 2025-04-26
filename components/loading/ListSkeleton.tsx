import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function ListSkeleton({ count = 5, className }: { count?: number; className?: string }) {
    return (
        <div className={cn('space-x-2', className)}>
            {Array(count)
                .fill(0)
                .map((_, i) => (
                    <div key={i} className='rounded-lg border p-2'>
                        <div className='flex w-full items-start justify-between'>
                            <Skeleton className='h-5 w-3/4' />
                            <Skeleton className='ml-2 h-5 w-20' />
                        </div>
                        <Skeleton className='mt-1 h-10 w-full' />
                        <Skeleton className='mt-2 h-4 w-32' />
                    </div>
                ))}
        </div>
    )
}
