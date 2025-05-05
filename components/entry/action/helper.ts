import type { BaseEntity } from '@/components/entry'
import type { ActionConfig, ActionConfigFactory } from './types'

// Helper function để chuyển đổi hàm action không tương thích
export function adaptActionFunction<T extends BaseEntity>(
  fn: (item: T) => ActionConfig<T>
): ActionConfigFactory<T> {
  return (item?: T) => {
    if (!item) {
      // Trả về một config mặc định nếu item là undefined
      return {
        type: 'custom',
        onClick: () => {},
        disabled: true,
        hidden: true
      } as ActionConfig<T>
    }
    return fn(item)
  }
}

// Helper function để tạo một action tùy chỉnh
export function createAction<T extends BaseEntity = BaseEntity>(
  config: Partial<ActionConfig<T>> & {
    type: string
    onClick: (item?: T) => void | Promise<void>
  }
): ActionConfigFactory<T> {
  return (item?: T) =>
    ({
      ...config,
      onClick: () => config.onClick(item)
    }) as ActionConfig<T>
}
