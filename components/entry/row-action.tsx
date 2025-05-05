'use client'

import { Button } from '@/components/ui/button'
import { PlusCircle, Pencil, Trash2, Eye } from 'lucide-react'
import { useContextHooks, BaseEntity } from '@/components/entry'

interface CrudActionsProps<T extends BaseEntity> {
    item?: T
}

export function CreateButton() {
    const { setIsCreateDialogOpen } = useContextHooks()

    return (
        <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className='mr-2 size-4' />
            Add New
        </Button>
    )
}

export function RowActions<TListItem extends BaseEntity>({ item }: CrudActionsProps<TListItem>) {
    const { setSelectedId, setIsDetailDialogOpen, setIsDeleteDialogOpen, setRenderName } =
        useContextHooks()

    if (!item) return null

    return (
        <div className='flex justify-end gap-2'>
            <Button
                variant='ghost'
                size='icon'
                onClick={() => {
                    if (!item.id) return
                    setSelectedId(item.id)
                    setRenderName('SHOW')
                    setIsDetailDialogOpen(true)
                }}
            >
                <Eye className='size-4' />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                onClick={async () => {
                    if (!item.id) return
                    setSelectedId(item.id)
                    setRenderName('UPDATE')
                    setIsDetailDialogOpen(true)
                }}
            >
                <Pencil className='size-4' />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                onClick={() => {
                    if (!item.id) return
                    setSelectedId(item.id)
                    setIsDeleteDialogOpen(true)
                }}
            >
                <Trash2 className='size-4' />
            </Button>
        </div>
    )
}
