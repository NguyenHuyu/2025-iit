import React from 'react'
import { Item } from '@/components/shared/Item'
import { InterfacePage } from '@/types/route.type'
import { getAllBulletins } from '@/actions/bulletin.action'
import { getDictionary } from '@/i18n/dictionaries'
import PaginationPattern from '@/components/patterns/pagination-pattern'

export default async function Page({ params, searchParams }: InterfacePage) {
    const searchParam = await searchParams
    const param = await params

    const { header, page } = await getDictionary(param.locale)

    const bulletins = await getAllBulletins({
        categories: ['PRODUCTS'],
        page: searchParam.page,
        limit: 9,
        isDraft: false,
        language: param.locale.toUpperCase() as 'VI' | 'EN',
    })

    return (
        <div className='min-h-screen'>
            <div className='relative flex w-full overflow-hidden rounded-md antialiased md:h-60 md:items-center md:justify-center'>
                <div className='relative z-10 mx-auto w-full max-w-7xl p-4'>
                    <h1 className='py-4 text-center text-4xl font-bold uppercase text-[#E6C067] md:text-7xl'>
                        {header.product}
                    </h1>
                </div>
            </div>
            <div className='-m-4 mx-auto flex flex-wrap pt-10 md:max-w-4xl lg:max-w-6xl'>
                {bulletins.data.content.map((item, i) => (
                    <Item
                        item={item}
                        key={i}
                        page={page}
                        url='san-pham-nghien-cuu-chuyen-giao-cong-nghe'
                    />
                ))}
            </div>
            <div className='container mx-auto max-w-5xl py-10'>
                <PaginationPattern
                    searchParams={searchParams}
                    totalPages={bulletins.data.totalPages}
                />
            </div>
        </div>
    )
}
