import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Link } from 'next-view-transitions'
import { Button } from '@/components/ui/button'
import { getDictionary } from '@/i18n/dictionaries'
import { ExternalLinkIcon } from 'lucide-react'
import AnnouncementsItem from './Item'
import { getAllBulletins } from '@/actions/bulletin.action'
import { Locale } from '@/i18n/i18n-config'

interface Props {
    page: Awaited<ReturnType<typeof getDictionary>>['page']
    locale: Locale
}

export default async function Announcements({ locale, page }: Props) {
    const results = await getAllBulletins({
        isDraft: false,
        isImportant: true,
        limit: 12,
        categories: ['ANNOUNCEMENTS'],
        language: locale?.toUpperCase() as 'VI' | 'EN',
        status: 'Published',
    })

    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle className='text-2xl'>{page.home_page.notify}</CardTitle>
                <Link href={`/${locale}/ban-tin`}>
                    <Button variant='outline' className='inline-flex items-center gap-1'>
                        {page.home_page.read_more} <ExternalLinkIcon size={20} />
                    </Button>
                </Link>
            </CardHeader>

            <ScrollArea className='h-[80vh] w-full md:h-[70vh]'>
                <CardContent className='space-y-2'>
                    {results?.data?.content?.map((item) => (
                        <AnnouncementsItem key={item.slug} {...item} />
                    ))}
                </CardContent>
            </ScrollArea>
        </Card>
    )
}
