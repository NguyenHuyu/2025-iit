import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getDictionary } from '@/i18n/dictionaries'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { Link } from 'next-view-transitions'
import { Button } from '@/components/ui/button'
import { ExternalLinkIcon } from 'lucide-react'
import { getAllBulletins } from '@/actions/bulletin.action'
import { Locale } from '@/i18n/i18n-config'

interface Props {
    page: Awaited<ReturnType<typeof getDictionary>>['page']
    locale: Locale
}

export default async function Events({ locale, page }: Props) {
    const results = await getAllBulletins({
        isImportant: true,
        isDraft: false,
        limit: 9,
        categories: ['EVENTS'],
        language: locale.toUpperCase() as 'VI' | 'EN',
    })

    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle className='text-2xl'>{page.home_page.upcoming}</CardTitle>
                <Link href={`/${locale}/ban-tin`}>
                    <Button variant='outline' className='inline-flex items-center gap-1'>
                        {page.home_page.read_more} <ExternalLinkIcon size={20} />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                <BentoGrid className='mx-auto w-full'>
                    {results?.data?.content.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.title}
                            description={item.description}
                            url={`/${locale}/ban-tin/${item.slug}__${item.id}`}
                            image={item.thumbnails as string}
                            createdAt={item.createdAt}
                        />
                    ))}
                </BentoGrid>
            </CardContent>
        </Card>
    )
}
