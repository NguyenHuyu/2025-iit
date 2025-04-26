import React, { Fragment, Suspense } from 'react'
import RenderItem from '@/components/pages/RenderItem'
import { RecommendedProducts, RecommendedProductsSkeleton } from '@/components/pages/Recommend'
import { BulletinService } from '@/services/bulletin.service'
import { InterfacePage } from '@/types/route.type'
import { verifySlug } from '@/utils/slugify'
import { Language } from '@prisma/client'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: InterfacePage): Promise<Metadata> {
    const param = await params

    const result = await BulletinService.getBulletinByIdAndLanguage(
        verifySlug(param.id as string),
        param.locale.toUpperCase() as Language
    )

    return {
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
            images: result.data?.thumbnails as string,
        },
        twitter: {
            title: result.data?.title,
            description: result.data?.description,
            images: result.data?.thumbnails as string,
        },
    }
}

export default async function Page({ params }: InterfacePage) {
    const { id, locale } = await params

    const bulletin = await BulletinService.getBulletinByIdAndLanguage(
        verifySlug(id as string),
        locale.toUpperCase() as Language
    )

    if (!bulletin.data) {
        return notFound()
    }

    return (
        <Fragment>
            <RenderItem bulletin={bulletin?.data} />

            <Suspense fallback={<RecommendedProductsSkeleton />}>
                <RecommendedProducts
                    args={{
                        categories: ['SEMINARS'],
                        isDraft: false,
                        language: locale.toUpperCase() as 'VI' | 'EN',
                        limit: 12,
                    }}
                    id={verifySlug(id as string)}
                    params={`${locale}/seminar-workshops`}
                />
            </Suspense>
        </Fragment>
    )
}
