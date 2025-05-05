'use client'

import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { mergeAttributes } from '@tiptap/core'

export const CustomTaskList = TaskList.configure({
    HTMLAttributes: {
        class: 'not-prose pl-2',
    },
})

export const CustomTaskItem = TaskItem.extend({
    content: 'paragraph+',
    renderHTML({ node, HTMLAttributes }) {
        const { checked } = node.attrs

        return [
            'li',
            mergeAttributes(HTMLAttributes, {
                class: 'flex items-start my-2 gap-2',
                'data-checked': checked ? 'true' : 'false',
            }),
            [
                'label',
                {
                    class: 'flex items-center gap-2 text-sm',
                },
                [
                    'input',
                    {
                        type: 'checkbox',
                        checked: checked ? 'checked' : null,
                        class: 'rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 focus:ring-offset-0',
                    },
                ],
                ['span', { class: 'flex-grow' }, 0],
            ],
        ]
    },
})
