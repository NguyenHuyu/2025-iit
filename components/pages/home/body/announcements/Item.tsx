'use client'
import React from 'react'
import { Bulletin } from '@/types/bulletin.type'
import { Link } from 'next-view-transitions'
import { useParams } from 'next/navigation'
import Image from 'next/image'

export default function AnnouncementsItem({
    description,
    title,
    createdAt,
    slug,
    thumbnails,
    id,
}: Bulletin) {
    const locale = useParams().locale

    return (
        <Link
            href={`/${locale}/ban-tin/${slug}__${id}`}
            className='w-full space-x-2 bg-white transition duration-200 hover:bg-sky-50 hover:shadow-xl'
        >
            <div className='my-2 flex h-full gap-2 rounded-lg border'>
                {/* Thumbnail */}
                <div className='relative size-32 flex-none overflow-hidden rounded-md'>
                    <Image
                        src={thumbnails as string}
                        alt={title}
                        fill
                        className='rounded-md object-cover'
                        sizes='128px'
                    />
                </div>

                {/* Nội dung */}
                <div className='flex-auto py-2'>
                    <h2 className='line-clamp-2 text-base font-semibold text-slate-900'>{title}</h2>

                    <p className='mt-2 line-clamp-2 text-sm font-medium text-slate-400'>
                        {description}
                    </p>

                    <p className='mt-1 text-sm text-slate-700'>
                        {createdAt?.toLocaleDateString('vi-VN')}
                    </p>
                </div>
            </div>
        </Link>
    )
}
