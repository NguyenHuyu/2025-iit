import React, { JSX } from 'react'
import ActiveLink from './active-link'
import { InterfacePage, SearchType } from '@/types/route.type'

type OptionItem = string | { icon: () => JSX.Element; title: string }

interface Option {
    name: string
    value: keyof SearchType
    items: OptionItem[]
}

const VISIBLE_RANGE = 1

function getPageItems(
    currentPage: number,
    totalPages: number,
    VISIBLE_RANGE: number
): (string | '...')[] {
    const pages: (string | '...')[] = []

    if (totalPages <= VISIBLE_RANGE * 2 + 3) {
        // if totalPages is less than 2 * VISIBLE_RANGE + 3, show all pages
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i.toString())
        }
    } else if (currentPage <= VISIBLE_RANGE + 1) {
        // if currentPage is at the beginning, show the first pages and "..." after the last page
        for (let i = 1; i <= VISIBLE_RANGE * 2 + 1; i++) {
            pages.push(i.toString())
        }
        pages.push('...', totalPages.toString())
    } else if (currentPage >= totalPages - VISIBLE_RANGE) {
        // if currentPage is at the end, show the last pages and "..." before the first page
        pages.push('1', '...')
        for (let i = totalPages - VISIBLE_RANGE * 2; i <= totalPages; i++) {
            pages.push(i.toString())
        }
    } else {
        // if currentPage is in the middle, show the first and last pages and "..." before and after the current page
        pages.push('1', '...')
        for (let i = currentPage - VISIBLE_RANGE; i <= currentPage + VISIBLE_RANGE; i++) {
            pages.push(i.toString())
        }
        pages.push('...', totalPages.toString())
    }

    return pages
}

export default async function PaginationPattern(props: {
    searchParams: InterfacePage['searchParams']
    totalPages?: number
}) {
    const searchParams = await props.searchParams
    const currentPage = Number(searchParams.page) || 1
    const totalPages = props.totalPages ? props.totalPages || 1 : 0

    const pageItems = getPageItems(currentPage, totalPages, VISIBLE_RANGE)

    const options: Option[] = [
        {
            name: 'Page',
            value: 'page',
            items: pageItems,
        },
        // {
        //     name: 'Sort',
        //     value: 'size',
        //     items: [
        //         {
        //             icon: () => <ArrowUpNarrowWide className='size-5' color='#32a5b9' />,
        //             title: 'asc',
        //         },
        //         {
        //             icon: () => <ArrowDownNarrowWide className='size-5' color='#32a5b9' />,
        //             title: 'desc',
        //         },
        //     ],
        // },
    ]

    return (
        <div className='flex items-center justify-between gap-6 py-4'>
            <div className='flex items-center gap-6'>
                {totalPages > 0 &&
                    options
                        .filter((option) => option.name === 'Page')
                        .map((option) => (
                            <div key={option.name}>
                                <div className='mt-1 flex gap-2'>
                                    {option.items.map((item, i) => {
                                        const itemTitle =
                                            typeof item === 'string' ? item : item.title
                                        const isActive = itemTitle === `${currentPage}`

                                        if (item === '...') {
                                            return (
                                                <span key={`ellipsis-${i}`} className='px-2'>
                                                    ...
                                                </span>
                                            )
                                        }

                                        const params = new URLSearchParams(
                                            Object.entries(searchParams).map(
                                                ([key, value]) =>
                                                    [key, String(value)] as [string, string]
                                            )
                                        )
                                        params.set(option.value, itemTitle)

                                        return (
                                            <ActiveLink
                                                key={i}
                                                isActive={isActive}
                                                searchParams={params.toString()}
                                            >
                                                {itemTitle}
                                            </ActiveLink>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
            </div>

            {/* <div className='flex items-center gap-6'>
                {options
                    .filter((option) => option.name === 'Sort')
                    .map((option) => (
                        <div key={option.name}>
                            <div className='mt-1 flex gap-2'>
                                {option.items.map((item) => {
                                    const itemTitle = typeof item === 'string' ? item : item.title
                                    const isActive = itemTitle === searchParams[option.value]

                                    const params = new URLSearchParams(Object.entries(searchParams))
                                    params.set(option.value, itemTitle)

                                    return (
                                        <ActiveLink
                                            key={itemTitle}
                                            isActive={isActive}
                                            searchParams={params.toString()}
                                        >
                                            {typeof item === 'string' ? item : <item.icon />}
                                        </ActiveLink>
                                    )
                                })}
                            </div>
                        </div>
                    ))}

                {options
                    .filter((option) => option.name === 'Items Per Page')
                    .map((option) => (
                        <div key={option.name}>
                            <div className='mt-1 flex gap-2'>
                                {option.items.map((item, i) => {
                                    const itemTitle = typeof item === 'string' ? item : item.title
                                    const isActive =
                                        (!searchParams[option.value] && i === 0) ||
                                        itemTitle === searchParams[option.value]

                                    const params = new URLSearchParams(Object.entries(searchParams))
                                    params.set(option.value, itemTitle)

                                    return (
                                        <ActiveLink
                                            key={itemTitle}
                                            isActive={isActive}
                                            searchParams={params.toString()}
                                        >
                                            {itemTitle}
                                        </ActiveLink>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
            </div> */}
        </div>
    )
}
