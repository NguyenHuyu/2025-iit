'use client'
import React from 'react'
import { Bulletin } from '@/types/bulletin.type'
import { Link } from 'next-view-transitions'
import { useParams } from 'next/navigation'
import Image from 'next/image'

export default function NewsItem({
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
            className='group flex items-start space-x-2 rounded-2xl border bg-white transition duration-200 hover:bg-sky-50 hover:shadow-xl'
        >
            <Image
                src={thumbnails as string}
                alt={title}
                width={300}
                height={300}
                className='size-36 flex-none rounded-md object-cover md:w-40'
            />
            <div className='relative p-1'>
                <h2 className='truncate text-wrap font-semibold text-slate-900'>{title}</h2>
                <dl className='mt-2 flex flex-wrap text-sm font-medium leading-6'>
                    <div>
                        <dt className='sr-only'>Date</dt>
                        <dd className='rounded px-1.5 ring-1 ring-slate-200'>
                            {createdAt?.toLocaleDateString('vi-VN')}
                        </dd>
                    </div>

                    <div className='mt-2 w-full font-normal'>
                        <dt className='sr-only'>Mô tả</dt>
                        <dd className='line-clamp-2 text-slate-400'>{description}</dd>
                    </div>
                </dl>
            </div>
        </Link>
    )
}
