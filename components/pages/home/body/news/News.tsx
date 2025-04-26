import React, { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ExternalLinkIcon } from 'lucide-react'
import NewsItem from './Item'
import { getAllBulletins } from '@/actions/bulletin.action'
import { Locale } from '@/i18n/i18n-config'
import { Link } from 'next-view-transitions'
import { getDictionary } from '@/i18n/dictionaries'
import { Button } from '@/components/ui/button'



async function Content({ locale }: { locale?: Locale }) {
    const results = await getAllBulletins({
        isDraft: false,
        isImportant: true,
        limit: 12,
        categories: ['NEWS'],
        language: locale?.toUpperCase() as 'VI' | 'EN',
        status: 'Published',
    })

    return (
        <div className='h-full'>
            {results?.data?.content?.length === 0 ? (
                <div className='p-4 text-center text-muted-foreground'>No content found.</div>
            ) : (
                <div className='w-full space-y-3'>
                    {results.data.content.map((item) => (
                        <NewsItem key={item.slug} {...item} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default function News({
    locale,
    page,
}: {
    locale?: Locale
    page?: Awaited<ReturnType<typeof getDictionary>>['page']
}) {
    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle className='text-2xl'>{page?.home_page.news}</CardTitle>
                <Link href={`/${locale}/ban-tin`}>
                    <Button variant='outline' className='inline-flex items-center gap-1'>
                        {page?.home_page.read_more} <ExternalLinkIcon size={20} />
                    </Button>
                </Link>
            </CardHeader>
            <ScrollArea className='h-[80vh] w-full md:h-[70vh]'>
                <CardContent className='space-y-2'>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Content locale={locale} />
                    </Suspense>
                </CardContent>
            </ScrollArea>
        </Card>
    )
}
