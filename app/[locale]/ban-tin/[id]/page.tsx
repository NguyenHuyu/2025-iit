import React, { Fragment, Suspense } from 'react'
import RenderItem from '@/components/pages/RenderItem'
import { RecommendedProducts, RecommendedProductsSkeleton } from '@/components/pages/Recommend'
import { BulletinService } from '@/services/bulletin.service'
import { InterfacePage } from '@/types/route.type'
import { verifySlug } from '@/utils/slugify'
import { Language } from '@prisma/client'
import { Metadata } from 'next'

export async function generateMetadata({ params }: InterfacePage): Promise<Metadata> {
    const param = await params

    const result = await BulletinService.getBulletinByIdAndLanguage(
        verifySlug(param.id as string),
        param.locale.toUpperCase() as Language
    )

    const metadataBase = 'https://iit.siu.edu.vn'

    return {
        metadataBase: new URL(metadataBase),
        title: result.data?.title,
        description: result.data?.description,
        alternates: {
            canonical: result.data?.slug,
            languages: {
                [result.data?.language as string]: `/${result.data?.language}`,
            },
        },
        keywords: result.data?.tags,
        openGraph: {
            title: result.data?.title,
            description: result.data?.description,
            images: `${metadataBase}${result.data?.thumbnails}`,
        },
        twitter: {
            title: result.data?.title,
            description: result.data?.description,
            images: `${metadataBase}${result.data?.thumbnails}`,
        },
    }
}

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
                        limit: 8,
                    }}
                    id={id as string}
                    params={`${locale}/ban-tin`}
                />
            </Suspense>
        </Fragment>
    )
}
