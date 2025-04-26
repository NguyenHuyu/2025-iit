import React from 'react'
import { InterfaceModePage } from '@/types/route.type'
import { redirect } from 'next/navigation'
import { PageEditor } from './PageEditor'
import { PageService } from '@/services/page.service'

export default async function PageDynamic({ params }: { params: InterfaceModePage['params'] }) {
    const { slug } = await params

    const data = await PageService.getPageById(slug)

    if (!data.data) redirect('/admin/bulletin')

    return <PageEditor page={data.data} header='Edit' />
}
