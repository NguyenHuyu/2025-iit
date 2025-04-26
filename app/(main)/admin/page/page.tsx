import { Fragment } from 'react'
import { PageList } from '@/components/admin/page/PageList'
import { BreadcrumbHeader } from '@/components/breadcrumb'
import { InterfacePage } from '@/types/route.type'

export default async function PostsPage({ searchParams }: InterfacePage) {
    return (
        <Fragment>
            <BreadcrumbHeader
                breadcrumbItems={[{ label: 'Pages', href: '/admin/page', isActive: true }]}
            />

            <div className='md:flex md:flex-1'>
                <div className='overflow-hidden md:w-1/3'>
                    <PageList searchParams={searchParams} />
                </div>

                <div className='hidden w-full overflow-hidden md:block md:w-2/3'>
                    <div className='flex h-full items-center justify-center'>
                        <p className='text-muted-foreground'>
                            Select a bulletin or create a new one
                        </p>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
