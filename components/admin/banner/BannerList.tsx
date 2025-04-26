import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { SearchPattern } from '@/components/patterns/input-pattern'
import PaginationPattern from '@/components/patterns/pagination-pattern'
import type { InterfacePage } from '@/types/route.type'
import { ScrollArea } from '@/components/ui/scroll-area'
import { use } from 'react'
// import { ListSkeleton } from '@/components/loading/ListSkeleton'
// import { PaginationSkeleton } from '@/components/loading/PaginationSkeleton'
import BannerItem from '@/components/admin/banner/BannerItem'
import { BannerService } from '@/services/banner.service'

async function BannerSuspense({ searchParams }: { searchParams: InterfacePage['searchParams'] }) {
    const searchParam = await searchParams

    const data = await BannerService.getAllBanners({
        filters: [
            {
                filter: searchParam?.filter,
                value: searchParam?.value,
            },
            {
                filter: 'status',
                value: searchParam?.status,
            },
        ],
        page: searchParam?.page,
        limit: searchParam?.size,
    })

    return {
        content: data.data.content,
        pagination: {
            totalPages: data.data.totalPages,
            currentPage: data.data.currentPage + 1,
            totalItems: data.data.totalElements,
        },
    }
}

function PaginationSuspense({ searchParams }: { searchParams: InterfacePage['searchParams'] }) {
    const { pagination } = use(BannerSuspense({ searchParams }))

    return <PaginationPattern totalPages={pagination.totalPages} searchParams={searchParams} />
}

export async function BannerList({
    searchParams,
}: {
    searchParams: InterfacePage['searchParams']
}) {
    return (
        <div className='flex flex-col md:h-[calc(100vh-100px)]'>
            {/* Header */}
            <div className='h-1/12'>
                <div className='p-2'>
                    <SearchPattern
                        searchOptions={[
                            {
                                label: 'Name',
                                value: 'name',
                            },
                            {
                                label: 'Type',
                                value: 'type',
                            },
                        ]}
                    />
                    <Link href='/admin/banner/create'>
                        <Button className='w-full'>
                            <Plus className='size-4' />
                            New
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Content */}
            <ScrollArea className='h-10/12 w-full rounded-md border p-0'>
                <main className='grow overflow-auto p-2'>
                    {/* <Suspense fallback={<ListSkeleton count={6} />}> */}
                    <BannerContent searchParams={searchParams} />
                    {/* </Suspense> */}
                </main>
            </ScrollArea>

            {/* Footer */}
            <div className='h-1/12 flex items-center justify-center'>
                {/* <Suspense fallback={<PaginationSkeleton />}> */}
                <PaginationSuspense searchParams={searchParams} />
                {/* </Suspense> */}
            </div>
        </div>
    )
}

function BannerContent({ searchParams }: { searchParams: InterfacePage['searchParams'] }) {
    const { content } = use(BannerSuspense({ searchParams }))
    return (
        <div className='h-full'>
            {content.length === 0 ? (
                <div className='p-4 text-center text-muted-foreground'>No banner found.</div>
            ) : (
                <div className='w-full space-y-3'>
                    {content.map((blog) => (
                        <BannerItem key={blog.id} {...blog} />
                    ))}
                </div>
            )}
        </div>
    )
}
