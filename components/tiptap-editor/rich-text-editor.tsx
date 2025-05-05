'use client'

import { cn } from '@/lib/utils'
import { ImageExtension } from '@/components/tiptap-editor/extensions/image'
import { ImagePlaceholder } from '@/components/tiptap-editor/extensions/image-placeholder'
import SearchAndReplace from '@/components/tiptap-editor/extensions/search-and-replace'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import { EditorContent, type Extension, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TipTapFloatingMenu } from '@/components/tiptap-editor/extensions/floating-menu'
import { FloatingToolbar } from '@/components/tiptap-editor/extensions/floating-toolbar'
import { EditorToolbar } from './toolbars/editor-toolbar'
import Placeholder from '@tiptap/extension-placeholder'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { TableExtension } from './extensions/table'
import { useEffect, useCallback, useRef } from 'react'
import { CustomTaskList, CustomTaskItem } from './extensions/task-list'
import { DetailsExtension } from './extensions/toggle-list'
import { ListStyle } from './extensions/list-styles'
import { useBlocksMenu } from './extensions/blocks-menu'
import { BlockConversion } from './extensions/block-conversion'
import { ColumnsExtension } from './extensions/columns'
import { TableCellAttributes } from './extensions/table-cell-attributes'
import PDFUpload from './extensions/pdf-upload'
import { EmojiExtension } from './extensions/emoji'
// import "../styles/content-styles.css";
import './tiptap.css'

// Define the extensions outside the component to avoid recreating them on each render
const getExtensions = () => [
    StarterKit.configure({
        orderedList: {
            HTMLAttributes: {
                class: 'list-decimal',
            },
        },
        bulletList: {
            HTMLAttributes: {
                class: 'list-disc',
            },
        },
        heading: {
            levels: [1, 2, 3, 4],
        },
    }),
    Placeholder.configure({
        emptyNodeClass: 'is-editor-empty',
        placeholder: ({ node }) => {
            switch (node.type.name) {
                case 'heading':
                    return `Heading ${node.attrs.level}`
                case 'detailsSummary':
                    return 'Section title'
                case 'codeBlock':
                    // never show the placeholder when editing code
                    return ''
                default:
                    return 'Write something...'
            }
        },
        includeChildren: false,
    }),
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    TextStyle,
    Subscript,
    Superscript,
    Underline,
    Link,
    Color,
    Highlight.configure({
        multicolor: true,
    }),
    ImageExtension,
    ImagePlaceholder,
    SearchAndReplace,
    Typography,
    // Table extensions
    Table.configure({
        resizable: true,
        HTMLAttributes: {
            class: 'tiptap-table',
        },
    }),
    TableRow,
    TableHeader,
    TableCell,
    TableExtension,
    TableCellAttributes,
    // New extensions
    CustomTaskList,
    CustomTaskItem,
    DetailsExtension,
    ListStyle.configure({
        types: ['bulletList', 'orderedList'],
    }),
    ColumnsExtension,
    PDFUpload,
    EmojiExtension,
]

export interface RichTextEditorProps {
    /** The HTML content to display in the editor */
    value?: string
    /** Callback function that is called when the editor content changes */
    onChangeValue?: (html: string) => void
    /** Additional class names to apply to the editor container */
    className?: string
    /** Whether to enable auto-saving to localStorage */
    enableAutoSave?: boolean
    /** The key to use for localStorage when auto-saving is enabled */
    storageKey?: string
    /** Placeholder text to display when the editor is empty */
    placeholder?: string
    /** Whether to show the toolbar */
    showToolbar?: boolean
    /** Whether to show the floating toolbar */
    showFloatingToolbar?: boolean
    /** Whether to show the floating menu */
    showFloatingMenu?: boolean
    /** Whether the editor is read-only */
    readOnly?: boolean
}

export function RichTextEditor({
    value,
    onChangeValue,
    className,
    enableAutoSave = false,
    storageKey = 'tiptap-content',
    showToolbar = true,
    showFloatingToolbar = true,
    showFloatingMenu = true,
    readOnly = false,
}: RichTextEditorProps) {
    const editorContainerRef = useRef<HTMLDivElement>(null)
    const extensions = useRef(getExtensions()).current

    // Initialize the editor with the provided value or load from localStorage if enabled
    const initialContent = useCallback(() => {
        if (value !== undefined) return value
        if (enableAutoSave && typeof window !== 'undefined') {
            return localStorage.getItem(storageKey) || ''
        }
        return ''
    }, [value, enableAutoSave, storageKey])

    const editor = useEditor({
        immediatelyRender: false,
        extensions: extensions as Extension[],
        content: initialContent(),
        editorProps: {
            attributes: {
                class: 'content-styles max-w-full focus:outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()

            // Call the onChange callback if provided
            if (onChangeValue) {
                onChangeValue(html)
            }

            // Save to localStorage if auto-save is enabled
            if (enableAutoSave && typeof window !== 'undefined') {
                try {
                    localStorage.setItem(storageKey, html)
                } catch (err) {
                    console.error('Failed to save to localStorage:', err)
                }
            }
        },
        editable: !readOnly,
    })

    // Update editor content when value prop changes
    useEffect(() => {
        if (editor && value !== undefined && editor.getHTML() !== value) {
            editor.commands.setContent(value)
        }
    }, [editor, value])

    // Manual save function with feedback
    const handleManualSave = useCallback(() => {
        if (!editor) return

        try {
            const html = editor.getHTML()

            // Call the onChange callback if provided
            if (onChangeValue) {
                onChangeValue(html)
            }
        } catch (err) {
            console.error(err)
        }
    }, [editor, onChangeValue])

    // Keyboard shortcuts
    useEffect(() => {
        if (!enableAutoSave) return

        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+S or Cmd+S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault()
                handleManualSave()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleManualSave, enableAutoSave])

    // Ensure bubble menu works properly
    useEffect(() => {
        if (!editor) return

        // Ensure editor responds to selection events
        const handleSelectionUpdate = () => {
            // This is intentionally empty - the event helps trigger the bubble menu
        }

        editor.on('selectionUpdate', handleSelectionUpdate)

        return () => {
            editor.off('selectionUpdate', handleSelectionUpdate)
        }
    }, [editor])

    // Blocks menu (slash commands)
    const { menuRef, blocksMenuContent } = useBlocksMenu(editor!)

    if (!editor) return null

    return (
        <div
            ref={editorContainerRef}
            className={cn(
                'relative max-h-[calc(100dvh-6rem)] w-full overflow-hidden overflow-y-scroll border bg-card pb-[60px] sm:pb-0',
                className
            )}
        >
            {showToolbar && <EditorToolbar editor={editor} />}
            {showFloatingToolbar && <FloatingToolbar editor={editor} />}
            {showFloatingMenu && <TipTapFloatingMenu editor={editor} />}
            <BlockConversion editor={editor} />
            <EditorContent
                editor={editor}
                className='min-h-[600px] w-full min-w-full border-none focus:outline-none sm:p-6'
            />

            {/* Blocks menu (slash commands) */}
            <div ref={menuRef} className='hidden'>
                {blocksMenuContent}
            </div>
        </div>
    )
}
