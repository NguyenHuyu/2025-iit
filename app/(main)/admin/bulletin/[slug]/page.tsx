import { Fragment, Suspense } from 'react'
import { InterfaceModePage } from '@/types/route.type'
import { BreadcrumbHeader } from '@/components/breadcrumb'
import { BulletinList } from '@/components/admin/bulletin/BulletinList'
import BulletinDynamic from '@/components/admin/bulletin/BulletinDynamic'

export default async function BulletinSlugPage({ params, searchParams }: InterfaceModePage) {
    return (
        <Fragment>
            <BreadcrumbHeader
                breadcrumbItems={[
                    {
                        label: 'Bulletin',
                        href: '/admin/bulletin',
                    },
                    {
                        label: 'Detail',
                        href: `/admin/bulletin/${(await params).slug}`,
                        isActive: true,
                    },
                ]}
            />

            <div className='flex overflow-hidden md:flex-1'>
                <div className='hidden overflow-hidden md:block md:w-1/3'>
                    <BulletinList searchParams={searchParams} />
                </div>

                <div className='w-full overflow-hidden md:block md:w-2/3'>
                    <div className='flex size-full items-center justify-center'>
                        <Suspense fallback={<p>Loading....</p>}>
                            <BulletinDynamic params={params} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
