import React from 'react'
import PostContent from '@/components/tiptap/shared/PostContent'
import { TiptapRenderer } from '@/components/tiptap/TiptapRenderer/ServerRenderer'
import { getPageBySlugAndLanguage } from '@/actions/page.action'
import { PageService } from '@/services/page.service'
import { InterfacePage } from '@/types/route.type'
import { Language } from '@prisma/client'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PostToc from '@/components/tiptap/shared/PostToc'
import PostSharing from '@/components/tiptap/shared/PostSharing'

async function validatePage({ slug }: { slug: string }) {
    const result = await PageService.getPageBySlug(slug)

    if (result.statusCode !== 200) return false

    return true
}

export async function generateMetadata({ params }: InterfacePage): Promise<Metadata> {
    const param = await params

    const result = await getPageBySlugAndLanguage(
        `/${param.slug[0]}`,
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
    const param = await params

    const isValid = await validatePage({ slug: `/${(await params).slug[0]}` })

    if (!isValid) return notFound()

    const result = await getPageBySlugAndLanguage(
        `/${param.slug[0]}`,
        param.locale.toUpperCase() as Language
    )

    return (
        <article className='flex flex-col items-center px-6 py-10'>
            {/* <PostReadingProgress /> */}
            <div className='grid w-full grid-cols-1 gap-6 lg:w-auto lg:grid-cols-[minmax(auto,256px)_minmax(800px,1fr)_minmax(auto,256px)] lg:gap-12'>
                <PostSharing />

                {result.data?.pageContent ? (
                    <PostContent>
                        <TiptapRenderer>
                            {result.data?.pageContent[0]?.content as string}
                        </TiptapRenderer>
                    </PostContent>
                ) : null}
                <PostToc />
            </div>
        </article>
    )
}
