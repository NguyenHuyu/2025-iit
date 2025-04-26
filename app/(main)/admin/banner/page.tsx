import { Fragment } from 'react'
import { BannerList } from '@/components/admin/banner/BannerList'
import { BreadcrumbHeader } from '@/components/breadcrumb'
import { CheckBoxSearchParams } from '@/components/patterns/check-box'
import { InterfacePage } from '@/types/route.type'

export default async function PostsPage({ searchParams }: InterfacePage) {
    return (
        <Fragment>
            <BreadcrumbHeader
                breadcrumbItems={[{ label: 'Banner', href: '/admin/banner', isActive: true }]}
            />

            <div className='md:flex md:flex-1'>
                <div className='overflow-hidden md:w-1/3'>
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

                <div className='hidden w-full overflow-hidden md:block md:w-2/3'>
                    <div className='flex h-full items-center justify-center'>
                        <p className='text-muted-foreground'>Select a banner or create a new one</p>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
