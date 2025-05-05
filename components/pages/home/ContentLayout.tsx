import React from 'react'
import { getAllBulletins } from '@/actions/bulletin.action'
import { Locale } from '@/i18n/i18n-config'
import Link from 'next/link'
import Image from 'next/image'
import { Bell, ChevronRight, Clock } from 'lucide-react'
import { getDictionary } from '@/i18n/dictionaries'

interface ContentLayoutProps {
    locale: Locale
    page: Awaited<ReturnType<typeof getDictionary>>['page']
}

export default async function ContentLayout({ locale, page }: ContentLayoutProps) {
    const newsResults = await getAllBulletins({
        isDraft: false,
        isImportant: true,
        limit: 7,
        categories: ['NEWS'],
        // language: locale?.toUpperCase() as 'VI' | 'EN',
        status: 'Published',
    })

    const news = newsResults?.data?.content || []

    const announcementsResults = await getAllBulletins({
        isDraft: false,
        isImportant: true,
        limit: 12,
        categories: ['ANNOUNCEMENTS'],
        // language: locale?.toUpperCase() as 'VI' | 'EN',
        status: 'Published',
    })
    const announcements = announcementsResults?.data?.content || []

    const eventResults = await getAllBulletins({
        isImportant: true,
        isDraft: false,
        limit: 9,
        categories: ['EVENTS'],
        // language: locale.toUpperCase() as 'VI' | 'EN',
    })
    const upcomingEvents = eventResults?.data?.content || []

    return (
        <div className='container mx-auto px-4 py-2 md:py-8'>
            {/* Grid chính cho Tin tức và Thông báo */}
            <div className='mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3'>
                {/* Phần tin tức */}
                <div className='lg:col-span-2'>
                    <div className='mb-6 flex items-center justify-between'>
                        <h2 className='text-2xl text-gray-800 md:text-xl lg:text-3xl'>
                            {page.home_page.news}
                            <div className='mt-1 h-1 w-20 bg-yellow-500'></div>
                        </h2>
                    </div>

                    <div className='mb-6 overflow-hidden rounded-xl bg-gray-100'>
                        <div className='relative h-64 w-full sm:h-80'>
                            <Image
                                src={news[0]?.thumbnails as string}
                                alt={news[0]?.title}
                                fill
                                className='object-cover'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent'></div>
                            <div className='absolute bottom-0 left-0 p-4'>
                                <span className='mb-2 inline-block rounded-full bg-yellow-500 px-3 py-1 text-xs text-white'>
                                    {news[0]?.category}
                                </span>

                                <Link href={`/${locale}/ban-tin/${news[0].slug}__${news[0].id}`}>
                                    <h3 className='mb-2 text-xl font-bold text-white hover:text-yellow-500 sm:text-2xl'>
                                        {news[0]?.title}
                                    </h3>
                                </Link>
                                <div className='flex items-center text-sm text-gray-200'>
                                    <Clock className='mr-1 size-4' />
                                    <span>{news[0]?.createdAt?.toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                        {news.slice(1).map((news) => (
                            <div
                                key={news.id}
                                className='group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md'
                            >
                                <div className='relative h-48'>
                                    <Image
                                        src={(news.thumbnails as string) || '/placeholder.svg'}
                                        alt={news.title}
                                        fill
                                        className='object-cover transition-transform duration-300 group-hover:scale-105'
                                    />
                                    <div className='absolute left-2 top-2 rounded-full bg-yellow-500 px-2 py-1 text-xs text-white'>
                                        {news.category}
                                    </div>
                                </div>
                                <div className='p-4'>
                                    <Link href={`/${locale}/ban-tin/${news.slug}__${news.id}`}>
                                        <h3 className='mb-2 line-clamp-2 text-lg text-gray-800 hover:text-yellow-500'>
                                            {news.title}
                                        </h3>
                                    </Link>
                                    <div className='flex items-center justify-between text-sm text-gray-500'>
                                        <div className='flex items-center'>
                                            <Clock className='mr-1 size-4' />
                                            <span>
                                                {news.createdAt?.toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='mt-6 text-center'>
                        <Link
                            href={`/${locale}/ban-tin`}
                            className='inline-flex items-center rounded-full border border-yellow-500 px-6 py-2 text-sm text-yellow-500 transition-colors hover:bg-yellow-500 hover:text-white'
                        >
                            {page.home_page.read_more}
                            <ChevronRight className='ml-1 size-4' />
                        </Link>
                    </div>
                </div>

                {/* Phần thông báo */}
                <div>
                    <div className='mb-6'>
                        <h2 className='text-2xl text-gray-800 md:text-xl lg:text-3xl'>
                            {page.home_page.notify}
                            <div className='mt-1 h-1 w-20 bg-yellow-500'></div>
                        </h2>
                    </div>

                    <div className='mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
                        <div className='space-y-4'>
                            {announcements.map((notification) => (
                                <div
                                    key={notification.id}
                                    className='group flex items-start rounded-lg border-b border-gray-100 pb-4 last:border-0 last:pb-0'
                                >
                                    <div className='mr-3 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-500'>
                                        <Bell className='size-4' />
                                    </div>
                                    <div className='flex-1'>
                                        <div className='flex items-center'>
                                            <Link
                                                href={`/${locale}/ban-tin/${notification.slug}__${notification.id}`}
                                            >
                                                <h3 className='flex-1 font-medium text-gray-800 group-hover:text-yellow-500'>
                                                    {notification.title}
                                                </h3>
                                            </Link>
                                        </div>
                                        <p className='mt-1 text-sm text-gray-500'>
                                            {notification.createdAt?.toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='mt-4 text-center'>
                            <Link
                                href={`/${locale}/ban-tin`}
                                className='inline-flex items-center text-sm text-yellow-500 hover:text-yellow-600'
                            >
                                {page.home_page.read_more}
                                <ChevronRight className='ml-1 size-4' />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Phần sự kiện sắp đến - đặt ở dưới cùng */}
            <div className='border-t border-gray-200 pt-8'>
                <div className='mb-6'>
                    <h2 className='text-2xl text-gray-800 md:text-xl lg:text-3xl'>
                        {page.home_page.upcoming}
                        <div className='mt-1 h-1 w-20 bg-yellow-500'></div>
                    </h2>
                </div>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {upcomingEvents.map((event) => (
                        <div
                            key={event.id}
                            className='group overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md'
                        >
                            <div className='relative h-48'>
                                <Image
                                    src={(event.thumbnails as string) || '/placeholder.svg'}
                                    alt={event.title}
                                    fill
                                    className='object-cover transition-transform duration-300 group-hover:scale-95'
                                />
                                <div className='absolute left-2 top-2 rounded-full bg-yellow-500 px-2 py-1 text-xs text-white'>
                                    {event.category}
                                </div>
                            </div>
                            <Link href={`/${locale}/ban-tin/${event.slug}__${event.id}`}>
                                <h3 className='my-2 text-lg text-gray-800 group-hover:text-yellow-500'>
                                    {event.title}
                                </h3>
                            </Link>
                            <div className='mb-1 flex items-center text-sm text-gray-600'>
                                <Clock className='mr-2 size-4 text-gray-400' />
                                <span>{event.createdAt?.toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className='mb-4 flex items-center text-sm text-gray-600'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='16'
                                    height='16'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    className='mr-2 size-4 text-gray-400'
                                >
                                    <path d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' />
                                    <circle cx='12' cy='10' r='3' />
                                </svg>
                                <span>{event.description}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='mt-6 text-center'>
                    <Link
                        href={`/${locale}/ban-tin`}
                        className='inline-flex items-center rounded-full border border-yellow-500 px-6 py-2 text-sm text-yellow-500 transition-colors hover:bg-yellow-500 hover:text-white'
                    >
                        {page.home_page.read_more} <ChevronRight className='ml-1 size-4' />
                    </Link>
                </div>
            </div>
        </div>
    )
}
