import { getPageBySlugAndLanguage } from '@/actions/page.action'
import { InterfaceLayout, InterfacePage } from '@/types/route.type'
import { Language } from '@prisma/client'
import { Metadata } from 'next'

export async function generateMetadata({ params }: InterfacePage): Promise<Metadata> {
    const param = await params

    const result = await getPageBySlugAndLanguage(
        '/seminar-workshops',
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

export default function Layout({ children }: InterfaceLayout) {
    return children
}
