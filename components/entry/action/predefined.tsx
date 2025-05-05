'use client'

import { PlusCircle, Pencil, Trash2, Eye, ExternalLink } from 'lucide-react'
import { type BaseEntity, useContextHooks } from '@/components/entry'
import type { ActionConfig, ActionConfigFactory } from './types'

export function createViewAction<T extends BaseEntity = BaseEntity>(
  options: Partial<ActionConfig<T>> = {}
): ActionConfigFactory<T> {
  return (item?: T) => {
    const { setSelectedId, setIsDetailDialogOpen, setRenderName, setShow } =
      useContextHooks()

    return {
      type: 'view',
      icon: <Eye className='h-4 w-4' />,
      tooltip: 'View details',
      variant: 'ghost',
      size: 'icon',
      onClick: async () => {
        if (!item?.id) return
        setShow(true)
        setSelectedId(item.id)
        setRenderName('SHOW')
        setIsDetailDialogOpen(true)
      },
      ...options
    }
  }
}

export function createEditAction<T extends BaseEntity = BaseEntity>(
  options: Partial<ActionConfig<T>> = {}
): ActionConfigFactory<T> {
  return (item?: T) => {
    const { setSelectedId, setIsDetailDialogOpen, setRenderName, setShow } =
      useContextHooks()

    return {
      type: 'update',
      icon: <Pencil className='h-4 w-4' />,
      tooltip: 'Edit',
      variant: 'ghost',
      size: 'icon',
      onClick: async () => {
        if (!item?.id) return
        setSelectedId(item.id)
        setShow(true)
        setIsDetailDialogOpen(true)
        setRenderName('UPDATE')
      },
      ...options
    }
  }
}

export function createDeleteAction<T extends BaseEntity = BaseEntity>(
  options: Partial<ActionConfig<T>> = {}
): ActionConfigFactory<T> {
  return (item?: T) => {
    const { setSelectedId, setIsDeleteDialogOpen } = useContextHooks()

    return {
      type: 'delete',
      icon: <Trash2 className='h-4 w-4' />,
      tooltip: 'Delete',
      variant: 'ghost',
      size: 'icon',
      onClick: () => {
        if (!item?.id) return
        setSelectedId(item.id)
        setIsDeleteDialogOpen(true)
      },
      ...options
    }
  }
}

export function createAddAction<T extends BaseEntity = BaseEntity>(
  options: Partial<ActionConfig<T>> = {}
): ActionConfig<T> {
  const { setIsCreateDialogOpen } = useContextHooks()

  return {
    type: 'create',
    icon: <PlusCircle className='h-4 w-4' />,
    label: 'Add New',
    variant: 'default',
    size: 'default',
    onClick: () => setIsCreateDialogOpen(true),
    ...options
  }
}

export function createNavigateAction<T extends BaseEntity = BaseEntity>(
  href: string | ((item?: T) => string),
  options: Partial<ActionConfig<T>> = {}
): ActionConfigFactory<T> {
  return (item?: T) => {
    return {
      type: 'navigate',
      icon: <ExternalLink className='h-4 w-4' />,
      tooltip: 'Navigate',
      variant: 'ghost',
      size: 'icon',
      href,
      onClick: () => {}, // No-op since this is a link action
      ...options
    }
  }
}

export function createCustomAction<T extends BaseEntity = BaseEntity>(
  handler: (item?: T) => void | Promise<void>,
  options: Partial<ActionConfig<T>>
): ActionConfigFactory<T> {
  return (item?: T) => {
    return {
      type: 'custom',
      onClick: handler,
      ...options
    }
  }
}
