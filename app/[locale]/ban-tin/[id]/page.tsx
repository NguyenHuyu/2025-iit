import React, { Fragment, Suspense } from 'react'
import RenderItem from '@/components/pages/RenderItem'
import { notFound } from 'next/navigation'
import { RecommendedProducts, RecommendedProductsSkeleton } from '@/components/pages/Recommend'
import { BulletinService } from '@/services/bulletin.service'
import { InterfacePage } from '@/types/route.type'
import { verifySlug } from '@/utils/slugify'
import { getPageBySlugAndLanguage } from '@/actions/page.action'
import { Language } from '@prisma/client'
import { Metadata } from 'next'

// export async function generateMetadata({ params }: InterfacePage): Promise<Metadata> {
//     const param = await params

//     const result = await getPageBySlugAndLanguage(
//         '/gioi-thieu-iit',
//         param.locale.toUpperCase() as Language
//     )

//     return {
//         title: result.data?.metadata[0]?.title,
//         description: result.data?.metadata[0]?.description,
//         metadataBase: result.data?.metadataBase ? new URL(result.data?.metadataBase) : null,
//         alternates: {
//             canonical: result.data?.slug,
//             languages: {
//                 [result.data?.metadata[0]?.language as string]:
//                     `/${result.data?.metadata[0]?.language}`,
//                 [result.data?.metadata[1]?.language as string]:
//                     `/${result.data?.metadata[1]?.language}`,
//             },
//         },
//         icons: {
//             apple: result.data?.appleIcon as string,
//             shortcut: result.data?.shortcutIcon as string,
//             icon: result.data?.favicon as string,
//         },
//         openGraph: {
//             title: result.data?.openGraph[0]?.title,
//             description: result.data?.openGraph[0]?.title,
//             images: result.data?.openGraph[0]?.images as string,
//         },
//         twitter: {
//             title: result.data?.twitter[0]?.title,
//             description: result.data?.twitter[0]?.title,
//             images: result.data?.twitter[0]?.images as string,
//         },
//     }
// }

export default async function Page({ params }: InterfacePage) {
    const { id, locale } = await params

    const bulletin = await BulletinService.getBulletinByIdAndLanguage(
        verifySlug(id as string)
        // locale.toUpperCase() as Language
    )

    if (!bulletin.data) {
        return <div>Ban tin khong ton tai</div>
    }

    return (
        <Fragment>
            <RenderItem bulletin={bulletin?.data} />

            <Suspense fallback={<RecommendedProductsSkeleton />}>
                <RecommendedProducts
                    args={{
                        categories: ['NEWS', 'ANNOUNCEMENTS', 'EVENTS'],
                        status: 'Published',
                        limit: 9,
                    }}
                    id={id as string}
                    params={`${locale}/ban-tin`}
                />
            </Suspense>
        </Fragment>
    )
}
