import React from 'react'
import { InterfaceModePage } from '@/types/route.type'
import { redirect } from 'next/navigation'
import { BulletinEditor } from './BulletinEditor'
import { BulletinService } from '@/services/bulletin.service'
import { Bulletin } from '@/types/bulletin.type'

export default async function BulletinDynamic({ params }: { params: InterfaceModePage['params'] }) {
    const { slug } = await params

    const data = await BulletinService.getBulletinById(slug)

    console.log('BulletinDynamic -> data', data)

    if (!data.data) redirect('/admin/bulletin')

    return <BulletinEditor bulletin={data.data as Bulletin} header='Edit' />
}
