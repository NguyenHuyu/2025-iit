// @ts-nocheck
// @ts-ignore
'use client'

import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useState } from 'react'
import { Columns2, Columns3, Columns, Settings2, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface ColumnsProps {
    node: {
        attrs: {
            count: number
        }
    }
    updateAttributes: (attrs: { count: number }) => void
    deleteNode: () => void
}

const ColumnsComponent = ({ node, updateAttributes, deleteNode }: ColumnsProps) => {
    const [showControls, setShowControls] = useState(false)
    const columnCount = node.attrs.count || 2

    return (
        <NodeViewWrapper
            className='columns-container relative my-4 rounded-md border border-dashed border-gray-300 p-4 hover:border-gray-400'
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            {showControls && (
                <div className='absolute -top-3 right-2 flex items-center gap-2 rounded-md border bg-background p-1 shadow-sm'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon' className='size-7'>
                                <Settings2 className='size-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuItem onClick={() => updateAttributes({ count: 2 })}>
                                <Columns2 className='mr-2 size-4' />
                                <span>2 Columns</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateAttributes({ count: 3 })}>
                                <Columns3 className='mr-2 size-4' />
                                <span>3 Columns</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateAttributes({ count: 4 })}>
                                <Columns className='mr-2 size-4' />
                                <span>4 Columns</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant='ghost' size='icon' className='size-7' onClick={deleteNode}>
                        <Trash className='size-4' />
                    </Button>
                </div>
            )}

            <div
                className={cn(
                    'grid gap-4',
                    columnCount === 2 && 'grid-cols-2',
                    columnCount === 3 && 'grid-cols-3',
                    columnCount === 4 && 'grid-cols-4'
                )}
            >
                {Array.from({ length: columnCount }).map((_, index) => (
                    <div key={index} className='column' data-column-index={index}>
                        <div className='column-content' data-type='column-content'></div>
                    </div>
                ))}
            </div>
        </NodeViewWrapper>
    )
}

export const ColumnsExtension = Node.create({
    name: 'columns',
    group: 'block',
    content: 'block+',
    defining: true,
    draggable: true,

    addAttributes() {
        return {
            count: {
                default: 2,
                parseHTML: (element) => {
                    const count = element.getAttribute('data-column-count')
                    return count ? Number.parseInt(count, 10) : 2
                },
                renderHTML: (attributes) => {
                    return {
                        'data-column-count': attributes.count,
                    }
                },
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: "div[data-type='columns']",
                getAttrs: (node) => {
                    if (typeof node === 'string') return {}
                    const element = node as HTMLElement
                    return { count: element.getAttribute('data-column-count') || 2 }
                },
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'columns' }), 0]
    },

    addNodeView() {
        return ReactNodeViewRenderer(ColumnsComponent)
    },

    addCommands() {
        return {
            setColumns:
                (count = 2) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: { count },
                        content: [
                            {
                                type: 'paragraph',
                                content: [{ type: 'text', text: 'Column content...' }],
                            },
                        ],
                    })
                },
        }
    },
})
