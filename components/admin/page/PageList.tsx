import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import BulletinItem from '@/components/admin/bulletin/BulletinItem'
import Link from 'next/link'
import PaginationPattern from '@/components/patterns/pagination-pattern'
import type { InterfacePage } from '@/types/route.type'
import { ScrollArea } from '@/components/ui/scroll-area'
import { use } from 'react'
import { PageService } from '@/services/page.service'
import PageItem from './PageItem'

async function PageSuspense({ searchParams }: { searchParams: InterfacePage['searchParams'] }) {
    const searchParam = await searchParams

    const data = await PageService.getAllPages({
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
    const { pagination } = use(PageSuspense({ searchParams }))

    return <PaginationPattern totalPages={pagination.totalPages} searchParams={searchParams} />
}

export async function PageList({ searchParams }: { searchParams: InterfacePage['searchParams'] }) {
    return (
        <div className='flex w-full flex-col md:h-[calc(100vh-100px)]'>
            {/* Header */}
            <div className='h-1/12 w-full'>
                <div className='p-2'>
                    <Link href='/admin/page/create'>
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
                    <PageContent searchParams={searchParams} />
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

function PageContent({ searchParams }: { searchParams: InterfacePage['searchParams'] }) {
    const { content } = use(PageSuspense({ searchParams }))

    return (
        <div className='h-full'>
            {content.length === 0 ? (
                <div className='p-4 text-center text-muted-foreground'>No page found.</div>
            ) : (
                <div className='w-full space-y-3'>
                    {content.map((blog) => (
                        <PageItem key={blog.id} {...blog} />
                    ))}
                </div>
            )}
        </div>
    )
}
