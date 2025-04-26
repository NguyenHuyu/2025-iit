import { Fragment, Suspense } from 'react'
import { BreadcrumbHeader } from '@/components/breadcrumb'
import BannerStatic from '@/components/admin/banner/BannerStatic'
import { InterfacePage } from '@/types/route.type'
import { CheckBoxSearchParams } from '@/components/patterns/check-box'
import { Separator } from '@/components/ui/separator'
import { BannerList } from '@/components/admin/banner/BannerList'

export default async function BannerCreatePage({ searchParams }: InterfacePage) {
    return (
        <Fragment>
            <BreadcrumbHeader
                breadcrumbItems={[
                    {
                        label: 'Banner',
                        href: '/admin/banner',
                    },
                    {
                        label: 'Create',
                        href: '/admin/banner/create',
                        isActive: true,
                    },
                ]}
            />

            <div className='flex flex-1 overflow-hidden'>
                <div className='hidden overflow-hidden md:block md:w-1/3'>
                    <CheckBoxSearchParams
                        options={[
                            {
                                value: 'status',
                                items: ['Default', 'Achieved', 'Published'],
                            },
                        ]}
                    />
                    <BannerList searchParams={searchParams} />
                </div>

                <Separator className='mx-2' orientation='vertical' />

                <div className='w-full overflow-hidden md:w-2/3'>
                    <div className='flex size-full items-center justify-center'>
                        <Suspense fallback={<p>Loading....</p>}>
                            <BannerStatic />
                        </Suspense>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
