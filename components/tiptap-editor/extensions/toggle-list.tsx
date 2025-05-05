// @ts-nocheck
// @ts-ignore
'use client'

import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { NodeViewWrapper } from '@tiptap/react'

export interface DetailsProps {
    node: {
        attrs: {
            open: boolean
        }
    }
    updateAttributes: (attrs: { open: boolean }) => void
    extension: any
    editor: any
}

const DetailsComponent = ({ node, updateAttributes }: DetailsProps) => {
    const [isOpen, setIsOpen] = useState(node.attrs.open)

    const toggleOpen = () => {
        const newState = !isOpen
        setIsOpen(newState)
        updateAttributes({ open: newState })
    }

    return (
        <NodeViewWrapper className='toggle-list my-3'>
            <div className='flex items-start gap-2'>
                <button
                    className={`mt-1 flex size-5 items-center justify-center rounded-sm transition-transform ${isOpen ? 'rotate-90' : ''}`}
                    onClick={toggleOpen}
                    type='button'
                >
                    <ChevronRight className='size-4' />
                </button>
                <div className='flex-1'>
                    <div
                        className='cursor-pointer font-medium'
                        onClick={toggleOpen}
                        data-toggle-summary
                        contentEditable='true'
                        suppressContentEditableWarning
                    />
                    <div
                        className={`toggle-content mt-1 pl-2 ${isOpen ? 'block' : 'hidden'}`}
                        data-toggle-content
                    />
                </div>
            </div>
        </NodeViewWrapper>
    )
}

export const DetailsExtension = Node.create({
    name: 'details',
    group: 'block',
    content: 'block+',
    defining: true,
    draggable: true,

    addAttributes() {
        return {
            open: {
                default: true,
                parseHTML: (element) => element.hasAttribute('open'),
                renderHTML: (attributes) => {
                    return attributes.open ? { open: 'true' } : {}
                },
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'details',
                contentElement: 'div[data-toggle-content]',
                getAttrs: (node) => {
                    if (typeof node === 'string') return {}
                    const element = node as HTMLElement
                    return { open: element.hasAttribute('open') }
                },
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['details', mergeAttributes(HTMLAttributes), 0]
    },

    addNodeView() {
        return ReactNodeViewRenderer(DetailsComponent)
    },

    addCommands() {
        return {
            toggleDetails:
                () =>
                ({ commands }) => {
                    return commands.toggleWrap(this.name)
                },
        }
    },
})
