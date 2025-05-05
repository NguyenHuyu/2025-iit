import type { ReactNode } from 'react'
import type { BaseEntity } from '@/components/entry'

export type ActionType = 'create' | 'view' | 'update' | 'delete' | 'navigate' | 'custom'

export interface ActionConfig<T extends BaseEntity = BaseEntity> {
  type: ActionType
  icon?: ReactNode
  label?: string
  tooltip?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean | ((item?: T) => boolean)
  hidden?: boolean | ((item?: T) => boolean)
  onClick: (item?: T) => void | Promise<void>
  href?: string | ((item?: T) => string)
  permission?: string
  confirmationMessage?: string
  className?: string
}

export type ActionConfigFactory<T extends BaseEntity = BaseEntity> = (
  item?: T
) => ActionConfig<T>
