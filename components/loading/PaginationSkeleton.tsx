import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export function PaginationSkeleton() {
    return (
        <div className='flex items-center justify-center space-x-2 py-2'>
            <Skeleton className='size-8' />
            <Skeleton className='size-8' />
            <Skeleton className='size-8' />
        </div>
    )
}
