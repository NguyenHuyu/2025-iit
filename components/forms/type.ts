import { RefObject } from 'react'
import { TiptapEditorRef } from '@/components/tiptap/TiptapEditor'
import { ValidationError } from '@tanstack/react-form'

export type FieldType = 'string' | 'number' | 'textarea' | 'date-picker' | 'rich-text'

export type FieldValue = string | number | { from: Date }

export type BuilderField = {
  key: {
    type: FieldType
    label: string
    value: FieldValue
  }
}

export type DynamicFieldProps = {
  subField: {
    state: { value: BuilderField['key'] }
    handleChange: (value: BuilderField['key']) => void
  }
  onRemove: () => void

  onMoveUp: () => void
  onMoveDown: () => void

  disableMoveUp: boolean
  disableMoveDown: boolean

  editorRef?: RefObject<TiptapEditorRef | null>
}

export type StateProps = {
  meta: {
    errors:
      | {
          message: string
        }[]
      | ValidationError[]
    isValidating?: boolean
    isTouched?: boolean
  }
}
