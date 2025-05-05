'use client'

import type { BaseEntity } from '@/components/entry'
import { ActionButton } from './ActionButton'
import type { ActionConfig, ActionConfigFactory } from './types'

export type ActionItem<T extends BaseEntity = BaseEntity> =
  | ActionConfig<T>
  | ActionConfigFactory<T>
  | ((item: T) => ActionConfig<T>)

interface ActionGroupProps<T extends BaseEntity = BaseEntity> {
  actions: ActionItem<T>[]
  item?: T
  className?: string
}

export function ActionGroup<T extends BaseEntity = BaseEntity>({
  actions,
  item,
  className = 'flex justify-center gap-2'
}: ActionGroupProps<T>) {
  return (
    <div className={className}>
      {actions.map((actionOrFactory, index) => {
        let config: ActionConfig<T>

        if (typeof actionOrFactory === 'function') {
          if (item || actionOrFactory.length === 0) {
            config = actionOrFactory(item as T)
          } else {
            config = {
              type: 'custom',
              onClick: () => {},
              hidden: true
            } as ActionConfig<T>
          }
        } else {
          config = actionOrFactory
        }

        return (
          <ActionButton key={`${config.type}-${index}`} config={config} item={item} />
        )
      })}
    </div>
  )
}
