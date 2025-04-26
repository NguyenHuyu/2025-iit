'use client'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useParams, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Banner } from '@/types/banner.type'

export default function BannerItem({ id, name, status, createdAt, updatedAt, type, url }: Banner) {
    const params = useParams()
    const searchParams = useSearchParams()

    const searchQuery = searchParams.toString()

    const linkUrl = `/admin/banner/${id}${searchQuery ? `?${searchQuery}` : ''}`

    return (
        <Link
            scroll={false}
            href={linkUrl}
            key={id}
            prefetch={false}
            className={cn(
                'block cursor-pointer rounded-lg border p-2 shadow-md hover:shadow-xl',
                'transition-colors duration-200 ease-in-out',
                params.slug === id ? 'bg-accent' : 'bg-transparent'
            )}
        >
            <div className='flex w-full items-start justify-between py-3'>
                <h3 className='line-clamp-2 text-balance font-medium'>{name}</h3>
            </div>
            {type === 'VIDEO' && (
                <video aria-label='Video player' controls className='rounded-md'>
                    <source src={url as string} type='video/mp4' />
                </video>
            )}
            {type === 'IMAGE' && (
                <Image
                    src={url as string}
                    alt={name}
                    layout='responsive'
                    width={500}
                    height={300}
                    className='w-full rounded-md object-contain'
                />
            )}
            <div className='flex items-center justify-between'>
                <p className='mt-2 text-xs text-muted-foreground'>
                    Created At:{createdAt?.toLocaleDateString('vi-VN')}
                </p>
                <p className='mt-2 text-xs text-muted-foreground'>
                    Updated At:{updatedAt?.toLocaleDateString('vi-VN')}
                </p>
            </div>
            <Badge variant={status === 'Published' ? 'green' : 'default'}>{status}</Badge>
        </Link>
    )
}
