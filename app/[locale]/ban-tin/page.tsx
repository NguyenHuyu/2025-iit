import React, { Suspense } from 'react'
import Image from 'next/image'
import { Link } from 'next-view-transitions'
import PaginationSizePattern from '@/components/patterns/pagination-pattern'
import { InputPattern } from '@/components/patterns/input-pattern'
import { InterfacePage } from '@/types/route.type'
import { getDictionary } from '@/i18n/dictionaries'
import { BulletinWrapper } from '@/components/pages/home/Bulletin'
import { BulletinService } from '@/services/bulletin.service'
import { Metadata } from 'next'

export async function generateMetadata({ params }: InterfacePage): Promise<Metadata> {
    const { page, navigation } = await getDictionary((await params).locale)

    return {
        title: page.home_page.bulletin,
        description: navigation.description,
        openGraph: {
            title: page.home_page.bulletin,
            description: navigation.description,
            images: [
                {
                    url: 'https://iit.siu.edu.vn/opengraph-image.jpg',
                    width: 800,
                    height: 600,
                    alt: 'SIU IIT - Viện Công nghệ & Sáng tạo',
                },
            ],
        },
    }
}

export default async function Page({ searchParams, params }: InterfacePage) {
    const { locale } = await params
    const searchParam = await searchParams
    const { page } = await getDictionary(locale)

    const bulletins = await BulletinService.getAllBulletins({
        isDraft: false,
        keyword: searchParam?.keyword,
        // language: locale.toUpperCase() as 'VI' | 'EN',
        categories: ['NEWS', 'ANNOUNCEMENTS', 'EVENTS'],
        status: 'Published',
        limit: 12,
        page: searchParam?.page,
    })

    return (
        <div className='bg-gradient-to-b from-white to-neutral-100 py-4 dark:from-neutral-950 dark:to-neutral-800 md:min-h-svh md:py-10'>
            <BulletinWrapper>
                <h2 className='relative z-20 text-center font-sans text-2xl font-bold tracking-tight text-black dark:text-white md:text-4xl lg:text-7xl'>
                    <div className='relative top-1/2 mx-auto inline-block w-max'>
                        <div className='absolute left-0 top-[5px] bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text bg-no-repeat py-4 uppercase text-transparent [text-shadow:0_0_rgba(0,0,0,0.1)]'>
                            <span className=''>{page.home_page.bulletin}</span>
                        </div>
                        <div className='relative bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text bg-no-repeat py-4 uppercase text-transparent'>
                            <span className=''>{page.home_page.bulletin}</span>
                        </div>
                    </div>
                </h2>
            </BulletinWrapper>
            <div className='container mx-auto px-4 pb-10 md:px-10'>
                <Suspense>
                    <InputPattern
                        searchOptions={[
                            {
                                label: 'Tiêu đề',
                                value: 'title',
                            },
                        ]}
                    />
                </Suspense>
            </div>
            <div className='container mx-auto grid grid-cols-1 gap-4 md:grid-cols-4'>
                {bulletins?.data.content?.map((bulletin) => (
                    <div className='mx-auto w-80' key={bulletin.id}>
                        <div className='group relative h-full overflow-hidden rounded-2xl border border-zinc-100 bg-white transition duration-200 hover:shadow-xl'>
                            <div className='aspect-w-16 aspect-h-10 xl:aspect-w-16 xl:aspect-h-10 relative w-full overflow-hidden rounded-t-lg bg-gray-100'>
                                <Image
                                    src={bulletin?.thumbnails as string}
                                    alt='thumbnail'
                                    width={700}
                                    height={700}
                                    className={
                                        'h-40 object-cover transition duration-200 group-hover:scale-95 group-hover:rounded-2xl'
                                    }
                                />
                            </div>
                            <div className='p-4'>
                                <h2 className='my-4 line-clamp-2 text-lg font-bold text-zinc-700'>
                                    {bulletin?.title}
                                </h2>
                                <h2 className='my-4 line-clamp-4 text-justify text-sm font-normal text-zinc-500'>
                                    {bulletin?.description}
                                </h2>
                                <div className='mt-10 flex flex-row items-center justify-between'>
                                    <p className='text-sm text-gray-500'>
                                        {bulletin?.createdAt?.toLocaleDateString('vi-VN')}
                                    </p>
                                    <Link
                                        href={`/${locale}/ban-tin/${bulletin?.slug}__${bulletin?.id}`}
                                        className='relative z-10 block rounded-xl bg-black px-6 py-2 text-xs font-bold text-white'
                                    >
                                        {page.home_page.read_more}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='container mx-auto py-10'>
                <PaginationSizePattern
                    searchParams={searchParams}
                    totalPages={bulletins.data.totalPages}
                />
            </div>
        </div>
    )
}
