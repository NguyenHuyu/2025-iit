'use client'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useParams, useSearchParams } from 'next/navigation'
import type { Bulletin } from '@/types/bulletin.type'

export default function BulletinItem({
    id,
    title,
    status,
    createdAt,
    description,
    isDraft,
    isImportant,
    updatedAt,
}: Bulletin) {
    const params = useParams()
    const searchParams = useSearchParams()

    const searchQuery = searchParams.toString()

    const url = `/admin/bulletin/${id}${searchQuery ? `?${searchQuery}` : ''}`

    return (
        <Link
            scroll={false}
            href={url}
            key={id}
            className={cn(
                'block cursor-pointer rounded-lg border p-2 shadow-md hover:bg-muted',
                'transition-colors duration-200 ease-in-out',
                params.slug === id ? 'bg-accent' : 'bg-transparent'
            )}
        >
            <div className='flex w-full items-start justify-between'>
                <h3 className='line-clamp-2 text-balance font-medium'>{title}</h3>
            </div>
            <p className='mt-1 line-clamp-3 text-sm text-muted-foreground'>{description}</p>
            <div className='flex items-center justify-between'>
                <p className='mt-2 text-xs text-muted-foreground'>
                    Created At:{createdAt?.toLocaleDateString('vi-VN')}
                </p>
                <p className='mt-2 text-xs text-muted-foreground'>
                    Updated At:{updatedAt?.toLocaleDateString('vi-VN')}
                </p>
            </div>
            <div className='ml-2 mt-2 flex shrink-0 gap-2'>
                {isImportant && <Badge variant='highlight'>Highlight</Badge>}
                {isDraft && (
                    <Badge variant='destructive' className='border-dashed'>
                        Draft
                    </Badge>
                )}
                <Badge variant={status === 'Published' ? 'green' : 'default'}>{status}</Badge>
            </div>
        </Link>
    )
}
