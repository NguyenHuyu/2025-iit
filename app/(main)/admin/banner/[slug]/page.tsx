import { Fragment, Suspense } from 'react'
import { InterfaceModePage } from '@/types/route.type'
import { BreadcrumbHeader } from '@/components/breadcrumb'
import BannerDynamic from '@/components/admin/banner/BannerDynamic'
import { CheckBoxSearchParams } from '@/components/patterns/check-box'
import { BannerList } from '@/components/admin/banner/BannerList'

export default async function BannerSlugPage({ params, searchParams }: InterfaceModePage) {
    return (
        <Fragment>
            <BreadcrumbHeader
                breadcrumbItems={[
                    {
                        label: 'Banner',
                        href: '/admin/banner',
                    },
                    {
                        label: 'Detail',
                        href: `/admin/banner/${(await params).slug}`,
                        isActive: true,
                    },
                ]}
            />

            <div className='flex overflow-hidden md:flex-1'>
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

                <div className='w-full overflow-hidden md:block md:w-2/3'>
                    <div className='flex size-full items-center justify-center'>
                        <Suspense fallback={<p>Loading....</p>}>
                            <BannerDynamic params={params} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
