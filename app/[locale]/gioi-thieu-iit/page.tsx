import React from 'react'
import { Metadata } from 'next'
import { InterfacePage } from '@/types/route.type'
import PostContent from '@/components/tiptap/shared/PostContent'
import { TiptapRenderer } from '@/components/tiptap/TiptapRenderer/ServerRenderer'
import { Language } from '@prisma/client'
import { getPageBySlugAndLanguage } from '@/actions/page.action'

export async function generateMetadata({ params }: InterfacePage): Promise<Metadata> {
    const param = await params

    const result = await getPageBySlugAndLanguage(
        '/gioi-thieu-iit',
        param.locale.toUpperCase() as Language
    )

    return {
        title: result.data?.metadata[0]?.title,
        description: result.data?.metadata[0]?.description,
        metadataBase: result.data?.metadataBase ? new URL(result.data?.metadataBase) : null,
        alternates: {
            canonical: result.data?.slug,
            languages: {
                [result.data?.metadata[0]?.language as string]:
                    `/${result.data?.metadata[0]?.language}`,
                [result.data?.metadata[1]?.language as string]:
                    `/${result.data?.metadata[1]?.language}`,
            },
        },
        icons: {
            apple: result.data?.appleIcon as string,
            shortcut: result.data?.shortcutIcon as string,
            icon: result.data?.favicon as string,
        },
        openGraph: {
            title: result.data?.openGraph[0]?.title,
            description: result.data?.openGraph[0]?.title,
            images: result.data?.openGraph[0]?.images as string,
        },
        twitter: {
            title: result.data?.twitter[0]?.title,
            description: result.data?.twitter[0]?.title,
            images: result.data?.twitter[0]?.images as string,
        },
    }
}

export default async function Page({ params }: InterfacePage) {
    const { locale } = await params

    const result = await getPageBySlugAndLanguage(
        '/gioi-thieu-iit',
        locale.toUpperCase() as Language
    )

    return (
        <div className='container mx-auto px-2 py-6 md:min-h-screen md:max-w-5xl'>
            {result.data?.pageContent && (
                <PostContent>
                    <TiptapRenderer>
                        {result.data?.pageContent[0]?.content as string}
                    </TiptapRenderer>
                </PostContent>
            )}
        </div>
    )
}
