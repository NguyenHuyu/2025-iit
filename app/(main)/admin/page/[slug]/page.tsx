import { Fragment, Suspense } from 'react'
import { InterfaceModePage } from '@/types/route.type'
import { BreadcrumbHeader } from '@/components/breadcrumb'
import { PageList } from '@/components/admin/page/PageList'
import PageDynamic from '@/components/admin/page/PageDynamic'

export default async function PageSlugPage({ params, searchParams }: InterfaceModePage) {
    return (
        <Fragment>
            <BreadcrumbHeader
                breadcrumbItems={[
                    {
                        label: 'Page',
                        href: '/admin/page',
                    },
                    {
                        label: 'Detail',
                        href: `/admin/page/${(await params).slug}`,
                        isActive: true,
                    },
                ]}
            />

            <div className='flex overflow-hidden md:flex-1'>
                <div className='hidden overflow-hidden md:block md:w-1/3'>
                    <PageList searchParams={searchParams} />
                </div>

                <div className='w-full overflow-hidden md:block md:w-2/3'>
                    <div className='flex size-full items-center justify-center'>
                        <Suspense fallback={<p>Loading....</p>}>
                            <PageDynamic params={params} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
