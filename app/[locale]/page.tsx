import { Fragment } from 'react'
import BannerPage from '@/components/pages/home/carousel/Banner'
import Center from '@/components/pages/home/Center'
import { getDictionary } from '@/i18n/dictionaries'
import { InterfacePage } from '@/types/route.type'
import { Metadata } from 'next'
import { getPageBySlugAndLanguage } from '@/actions/page.action'
import { Language } from '@prisma/client'
import ContentLayout from '@/components/pages/home/ContentLayout'

export async function generateMetadata({ params }: InterfacePage): Promise<Metadata> {
    const param = await params

    const result = await getPageBySlugAndLanguage('/', param.locale.toUpperCase() as Language)

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

    const { page } = await getDictionary(param.locale)

    const units = [
        {
            urlImage: '/assets/che.png',
            altImage: 'trung-tam-suc-khoe-moi-truong',
            name: page.home_page.title_center_health,
            ref: 'https://che.siu.edu.vn',
        },
        {
            urlImage: '/assets/cebc.png',
            altImage: 'trung-tam-khoi-nghiep',
            name: page.home_page.title_center_entrepreneurship,
            ref: 'https://siu.edu.vn',
        },
        {
            urlImage: '/assets/celss.png',
            altImage: 'trung-tam-ki-nang-mem',
            name: page.home_page.title_center_leaning,
            ref: 'https://celss.siu.edu.vn',
        },
    ]

    return (
        <Fragment>
            <BannerPage />

            <Center units={units} title={page.home_page.title_center} />

            <ContentLayout locale={param.locale} page={page} />
        </Fragment>
    )
}
