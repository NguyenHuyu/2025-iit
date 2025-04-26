import React from 'react'
import { InterfaceModePage } from '@/types/route.type'
import { redirect } from 'next/navigation'
import { BannerEditor } from './BannerEditor'
import { BannerService } from '@/services/banner.service'

export default async function BannerDynamic({ params }: { params: InterfaceModePage['params'] }) {
    const { slug } = await params

    const data = await BannerService.getBannerById(slug)

    if (!data.data) redirect('/admin/banner')

    return <BannerEditor banner={data.data} header='Edit' />
}
