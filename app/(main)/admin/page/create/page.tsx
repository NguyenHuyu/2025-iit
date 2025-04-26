import { Fragment, Suspense } from 'react'
import { BreadcrumbHeader } from '@/components/breadcrumb'
import { PageList } from '@/components/admin/page/PageList'
import PageStatic from '@/components/admin/page/PageStatic'
import { InterfacePage } from '@/types/route.type'
import { Separator } from '@/components/ui/separator'

export default async function BulletinCreatePage({ searchParams }: InterfacePage) {
    return (
        <Fragment>
            <BreadcrumbHeader
                breadcrumbItems={[
                    {
                        label: 'Pages',
                        href: '/admin/page',
                    },
                    {
                        label: 'Create',
                        href: '/admin/page/create',
                        isActive: true,
                    },
                ]}
            />

            <div className='flex flex-1 overflow-hidden'>
                <div className='hidden overflow-hidden md:block md:w-1/3'>
                    <PageList searchParams={searchParams} />
                </div>

                <Separator className='mx-2' orientation='vertical' />

                <div className='w-full overflow-hidden md:w-2/3'>
                    <div className='flex size-full items-center justify-center'>
                        <Suspense fallback={<p>Loading....</p>}>
                            <PageStatic />
                        </Suspense>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
