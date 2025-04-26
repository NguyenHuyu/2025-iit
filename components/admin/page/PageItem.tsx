'use client'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useParams, useSearchParams } from 'next/navigation'
import { Pages } from '@/types/page.type'

export default function PageItem({ id, slug, title }: Pages) {
    const params = useParams()
    const searchParams = useSearchParams()

    const searchQuery = searchParams.toString()

    const url = `/admin/page/${id}${searchQuery ? `?${searchQuery}` : ''}`

    return (
        <Link
            href={url}
            key={id}
            className={cn(
                'block cursor-pointer rounded-lg border p-2 shadow-md hover:bg-muted',
                'transition-colors duration-200 ease-in-out',
                params.slug === id ? 'bg-accent' : 'bg-transparent'
            )}
        >
            <div className='flex w-full items-start justify-between'>
                <h3 className='line-clamp-2 text-balance font-medium'>Trang: {title}</h3>
            </div>
            <p className='mt-1 line-clamp-3 text-sm text-muted-foreground'>Slug: {slug}</p>
        </Link>
    )
}
