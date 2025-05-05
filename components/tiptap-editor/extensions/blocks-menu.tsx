// @ts-nocheck
// @ts-ignore
'use client'

import type React from 'react'

import { useState, useEffect, useRef } from 'react'
import type { Editor, Range } from '@tiptap/react'
import tippy from 'tippy.js'
import {
    NotepadTextIcon as Paragraph,
    Heading1,
    Heading2,
    Heading3,
    Table2,
    Code2,
    Quote,
    Minus,
    ListOrdered,
    List,
    CheckSquare,
    ChevronRight,
    ImageIcon,
    FileVideo,
    FileSpreadsheet,
    BookOpen,
    Columns3,
    Calculator,
    Link,
    Calendar,
    Sigma,
    FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BlocksMenuProps {
    editor: Editor
}

interface BlockOption {
    title: string
    description?: string
    icon: React.ReactNode
    command: (editor: Editor) => void
    section: string
    keywords: string[]
}

const BlocksMenu = ({ editor }: BlocksMenuProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const blockOptions: BlockOption[] = [
        // Basic blocks
        {
            title: 'Paragraph',
            description: 'Just start writing with plain text',
            icon: <Paragraph className='size-5' />,
            command: (editor) => editor.chain().focus().setParagraph().run(),
            section: 'Basic blocks',
            keywords: ['paragraph', 'text', 'plain'],
        },
        {
            title: 'Heading 1',
            description: 'Large section heading',
            icon: <Heading1 className='size-5' />,
            command: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            section: 'Basic blocks',
            keywords: ['h1', 'header', 'title', 'large'],
        },
        {
            title: 'Heading 2',
            description: 'Medium section heading',
            icon: <Heading2 className='size-5' />,
            command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            section: 'Basic blocks',
            keywords: ['h2', 'header', 'subtitle', 'medium'],
        },
        {
            title: 'Heading 3',
            description: 'Small section heading',
            icon: <Heading3 className='size-5' />,
            command: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            section: 'Basic blocks',
            keywords: ['h3', 'header', 'subtitle', 'small'],
        },
        {
            title: 'Table',
            description: 'Add a table to display data',
            icon: <Table2 className='size-5' />,
            command: (editor) =>
                editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
            section: 'Basic blocks',
            keywords: ['table', 'grid', 'data', 'spreadsheet'],
        },
        {
            title: 'Code',
            description: 'Add a code block',
            icon: <Code2 className='size-5' />,
            command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
            section: 'Basic blocks',
            keywords: ['code', 'codeblock', 'snippet', 'programming'],
        },
        {
            title: 'Quote',
            description: 'Insert a quote or citation',
            icon: <Quote className='size-5' />,
            command: (editor) => editor.chain().focus().toggleBlockquote().run(),
            section: 'Basic blocks',
            keywords: ['quote', 'blockquote', 'citation'],
        },
        {
            title: 'Divider',
            description: 'Visual divider between content',
            icon: <Minus className='size-5' />,
            command: (editor) => editor.chain().focus().setHorizontalRule().run(),
            section: 'Basic blocks',
            keywords: ['divider', 'separator', 'hr', 'horizontal rule'],
        },

        // Lists
        {
            title: 'Bulleted list',
            description: 'Create a simple bullet list',
            icon: <List className='size-5' />,
            command: (editor) => editor.chain().focus().toggleBulletList().run(),
            section: 'Lists',
            keywords: ['bullet', 'list', 'unordered', 'ul'],
        },
        {
            title: 'Numbered list',
            description: 'Create a numbered list',
            icon: <ListOrdered className='size-5' />,
            command: (editor) => editor.chain().focus().toggleOrderedList().run(),
            section: 'Lists',
            keywords: ['numbered', 'list', 'ordered', 'ol'],
        },
        {
            title: 'To-do list',
            description: 'Track tasks with a to-do list',
            icon: <CheckSquare className='size-5' />,
            command: (editor) => editor.chain().focus().toggleTaskList().run(),
            section: 'Lists',
            keywords: ['todo', 'task', 'checklist', 'checkbox'],
        },
        {
            title: 'Toggle list',
            description: 'Collapsible content section',
            icon: <ChevronRight className='size-5' />,
            command: (editor) => editor.chain().focus().toggleDetails().run(),
            section: 'Lists',
            keywords: ['toggle', 'collapse', 'accordion', 'dropdown'],
        },

        // Media
        {
            title: 'Image',
            description: 'Upload or embed an image',
            icon: <ImageIcon className='size-5' />,
            command: (editor) => editor.chain().focus().insertImagePlaceholder().run(),
            section: 'Media',
            keywords: ['image', 'picture', 'photo', 'upload'],
        },
        {
            title: 'Embed',
            description: 'Embed external content',
            icon: <FileVideo className='size-5' />,
            command: (editor) => {
                const url = prompt('Enter the URL to embed:')
                if (url) {
                    // Implement embed functionality
                    console.log('Embedding URL:', url)
                }
            },
            section: 'Media',
            keywords: ['embed', 'video', 'iframe', 'external'],
        },
        {
            title: 'Excalidraw',
            description: 'Create a drawing canvas',
            icon: <FileSpreadsheet className='size-5' />,
            command: (editor) => {
                // Implement Excalidraw functionality
                console.log('Insert Excalidraw canvas')
            },
            section: 'Media',
            keywords: ['draw', 'sketch', 'diagram', 'whiteboard'],
        },
        {
            title: 'PDF Document',
            description: 'Upload or embed a PDF file',
            icon: <FileText className='size-5' />,
            command: (editor) => editor.chain().focus().insertPDF().run(),
            section: 'Media',
            keywords: ['pdf', 'document', 'file', 'upload'],
        },

        // Advanced blocks
        {
            title: 'Table of contents',
            description: 'Auto-generated table of contents',
            icon: <BookOpen className='size-5' />,
            command: (editor) => {
                // Implement table of contents functionality
                console.log('Insert table of contents')
            },
            section: 'Advanced blocks',
            keywords: ['toc', 'contents', 'index', 'navigation'],
        },
        {
            title: '3 columns',
            description: 'Create a 3-column layout',
            icon: <Columns3 className='size-5' />,
            command: (editor) => {
                // Implement 3-column layout
                console.log('Insert 3-column layout')
            },
            section: 'Advanced blocks',
            keywords: ['columns', 'layout', 'grid', 'multi-column'],
        },
        {
            title: 'Equation',
            description: 'Insert a mathematical equation',
            icon: <Calculator className='size-5' />,
            command: (editor) => {
                // Implement equation functionality
                console.log('Insert equation')
            },
            section: 'Advanced blocks',
            keywords: ['equation', 'math', 'formula', 'latex'],
        },

        // Inline
        {
            title: 'Link',
            description: 'Create a hyperlink',
            icon: <Link className='size-5' />,
            command: (editor) => editor.chain().focus().toggleLink({ href: '' }).run(),
            section: 'Inline',
            keywords: ['link', 'url', 'hyperlink', 'href'],
        },
        {
            title: 'Date',
            description: 'Insert a date picker',
            icon: <Calendar className='size-5' />,
            command: (editor) => {
                // Implement date picker
                const date = new Date().toLocaleDateString()
                editor.chain().focus().insertContent(date).run()
            },
            section: 'Inline',
            keywords: ['date', 'calendar', 'time', 'datetime'],
        },
        {
            title: 'Inline Equation',
            description: 'Insert an inline mathematical equation',
            icon: <Sigma className='size-5' />,
            command: (editor) => {
                // Implement inline equation
                console.log('Insert inline equation')
            },
            section: 'Inline',
            keywords: ['equation', 'math', 'formula', 'inline', 'latex'],
        },
    ]

    const renderItems = () => {
        const sections = Array.from(new Set(blockOptions.map((item) => item.section)))

        return (
            <div className='max-h-[65vh] overflow-y-auto p-2'>
                {sections.map((section) => (
                    <div key={section} className='mb-4'>
                        <h3 className='mb-2 px-2 text-sm font-medium text-gray-500'>{section}</h3>
                        <div className='space-y-1'>
                            {blockOptions
                                .filter((item) => item.section === section)
                                .map((item, index) => {
                                    const itemIndex = blockOptions.findIndex(
                                        (option) => option.title === item.title
                                    )
                                    return (
                                        <button
                                            key={item.title}
                                            className={cn(
                                                'flex w-full items-center rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800',
                                                selectedIndex === itemIndex &&
                                                    'bg-gray-100 dark:bg-gray-800'
                                            )}
                                            onClick={() => {
                                                item.command(editor)
                                                hideMenu()
                                            }}
                                            onMouseEnter={() => setSelectedIndex(itemIndex)}
                                        >
                                            <div className='mr-2 flex size-10 items-center justify-center rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'>
                                                {item.icon}
                                            </div>
                                            <div className='text-left'>
                                                <p className='font-medium'>{item.title}</p>
                                                {item.description && (
                                                    <p className='text-xs text-gray-500'>
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        </button>
                                    )
                                })}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const hideMenu = () => {
        editor
            .chain()
            .focus()
            .deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from })
            .run()
    }

    return (
        <div className='blocks-menu w-80 rounded-md border border-gray-200 bg-white p-2 shadow-md dark:border-gray-800 dark:bg-gray-950'>
            {renderItems()}
        </div>
    )
}

export const useBlocksMenu = (editor: Editor) => {
    const [isActive, setIsActive] = useState(false)
    const [range, setRange] = useState<Range | null>(null)
    const menuRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!editor) return

        const updateMenu = () => {
            const { state, view } = editor
            const { selection } = state
            const { $from, empty } = selection
            const currentLine = $from.nodeBefore?.textContent || ''

            // Check if the cursor is at the start of a line and the user typed "/"
            if (empty && currentLine === '/') {
                const end = $from.pos
                const start = end - 1 // The position of the "/"
                const range = { from: start, to: end }

                setRange(range)
                setIsActive(true)
                return
            }

            setIsActive(false)
        }

        editor.on('selectionUpdate', updateMenu)
        editor.on('update', updateMenu)

        return () => {
            editor.off('selectionUpdate', updateMenu)
            editor.off('update', updateMenu)
        }
    }, [editor])

    useEffect(() => {
        if (!editor || !isActive || !range) return

        const { view } = editor
        const { state } = view
        const { from } = range
        const domRect = view.coordsAtPos(from)
        const tippyInstance = tippy('body', {
            getReferenceClientRect: () => domRect,
            appendTo: () => document.body,
            content: menuRef.current,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
            arrow: false,
            onHidden: () => {
                setIsActive(false)
            },
        })

        tippyInstance[0].show()

        return () => {
            tippyInstance[0].destroy()
        }
    }, [editor, isActive, range])

    const blocksMenuContent = <BlocksMenu editor={editor} />

    return {
        isActive,
        menuRef,
        blocksMenuContent,
    }
}

export default BlocksMenu
