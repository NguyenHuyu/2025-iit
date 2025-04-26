'use client'

import { getDictionary } from '@/i18n/dictionaries'
import { Bulletin } from '@/types/bulletin.type'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Link } from 'next-view-transitions'

interface ItemProps {
    item: Bulletin
    page: Awaited<ReturnType<typeof getDictionary>>['page']
    url: string
}

export const Item = ({ item, page, url }: ItemProps) => {
    const { locale } = useParams()
    const formattedDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : ''

    return (
        <div className='w-full p-4 md:w-1/3'>
            <div className='h-full overflow-hidden rounded-lg border border-gray-200 shadow-sm transition hover:shadow-md'>
                <div className='relative aspect-video'>
                    <Image
                        src={item.thumbnails as string}
                        alt={item.title}
                        fill
                        className='object-cover object-center'
                    />
                </div>

                <div className='p-4'>
                    <h1 className='mb-1 line-clamp-2 text-clip text-lg font-bold text-primary'>
                        {item.title}
                    </h1>
                    <p className='mb-3 line-clamp-1 text-sm text-gray-700'>{item.description}</p>

                    <div className='flex items-center justify-between text-sm'>
                        <Link
                            href={`/${locale}/${url}/${item.slug}__${item.id}`}
                            className='text-primary hover:text-[#E6C067] hover:underline dark:text-primary'
                        >
                            <span className='inline-flex items-center'>
                                {page.home_page.read_more}
                                <svg
                                    className='ml-1 size-4'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    fill='none'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                >
                                    <path d='M5 12h14' />
                                    <path d='M12 5l7 7-7 7' />
                                </svg>
                            </span>
                        </Link>
                        <span className='text-gray-500'>{formattedDate}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
