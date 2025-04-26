import { Fragment, Suspense } from 'react'
import { BreadcrumbHeader } from '@/components/breadcrumb'
import { BulletinList } from '@/components/admin/bulletin/BulletinList'
import BulletinStatic from '@/components/admin/bulletin/BulletinStatic'
import { InterfacePage } from '@/types/route.type'
import { Separator } from '@/components/ui/separator'

export default async function BulletinCreatePage({ searchParams }: InterfacePage) {
    return (
        <Fragment>
            <BreadcrumbHeader
                breadcrumbItems={[
                    {
                        label: 'Bulletin',
                        href: '/admin/bulletin',
                    },
                    {
                        label: 'Create',
                        href: '/admin/bulletin/create',
                        isActive: true,
                    },
                ]}
            />

            <div className='flex flex-1 overflow-hidden'>
                <div className='hidden overflow-hidden md:block md:w-1/3'>
                    <BulletinList searchParams={searchParams} />
                </div>

                <Separator className='mx-2' orientation='vertical' />

                <div className='w-full overflow-hidden md:w-2/3'>
                    <div className='flex size-full items-center justify-center'>
                        <Suspense fallback={<p>Loading....</p>}>
                            <BulletinStatic />
                        </Suspense>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
