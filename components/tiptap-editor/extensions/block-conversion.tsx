"use client"

import type React from "react"

import { BubbleMenu, type Editor } from "@tiptap/react"
import { useState } from "react"
import {
  NotepadTextIcon as Paragraph,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  ChevronRight,
  Code2,
  Quote,
  Columns3,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface BlockConversionProps {
  editor: Editor
}

interface BlockOption {
  title: string
  icon: React.ReactNode
  command: (editor: Editor) => void
  isActive: (editor: Editor) => boolean
}

export function BlockConversion({ editor }: BlockConversionProps) {
  const [isOpen, setIsOpen] = useState(false)

  const blockOptions: BlockOption[] = [
    {
      title: "Text",
      icon: <Paragraph className="h-4 w-4" />,
      command: (editor) => editor.chain().focus().setParagraph().run(),
      isActive: (editor) => editor.isActive("paragraph"),
    },
    {
      title: "Heading 1",
      icon: <Heading1 className="h-4 w-4" />,
      command: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: (editor) => editor.isActive("heading", { level: 1 }),
    },
    {
      title: "Heading 2",
      icon: <Heading2 className="h-4 w-4" />,
      command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: (editor) => editor.isActive("heading", { level: 2 }),
    },
    {
      title: "Heading 3",
      icon: <Heading3 className="h-4 w-4" />,
      command: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: (editor) => editor.isActive("heading", { level: 3 }),
    },
    {
      title: "Bulleted list",
      icon: <List className="h-4 w-4" />,
      command: (editor) => editor.chain().focus().toggleBulletList().run(),
      isActive: (editor) => editor.isActive("bulletList"),
    },
    {
      title: "Numbered list",
      icon: <ListOrdered className="h-4 w-4" />,
      command: (editor) => editor.chain().focus().toggleOrderedList().run(),
      isActive: (editor) => editor.isActive("orderedList"),
    },
    {
      title: "To-do list",
      icon: <CheckSquare className="h-4 w-4" />,
      command: (editor) => editor.chain().focus().toggleTaskList().run(),
      isActive: (editor) => editor.isActive("taskList"),
    },
    {
      title: "Toggle list",
      icon: <ChevronRight className="h-4 w-4" />,
      command: (editor) => editor.chain().focus().toggleDetails().run(),
      isActive: (editor) => editor.isActive("details"),
    },
    {
      title: "Code",
      icon: <Code2 className="h-4 w-4" />,
      command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
      isActive: (editor) => editor.isActive("codeBlock"),
    },
    {
      title: "Quote",
      icon: <Quote className="h-4 w-4" />,
      command: (editor) => editor.chain().focus().toggleBlockquote().run(),
      isActive: (editor) => editor.isActive("blockquote"),
    },
    {
      title: "3 columns",
      icon: <Columns3 className="h-4 w-4" />,
      command: (editor) => {
        // Implement 3-column layout
        console.log("Convert to 3-column layout")
      },
      isActive: (editor) => false, // Implement proper check
    },
  ]

  // Get the current active block type
  const getActiveBlock = () => {
    const active = blockOptions.find((option) => option.isActive(editor))
    return active || blockOptions[0] // Default to paragraph
  }

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        placement: "left",
        trigger: "manual",
        interactive: true,
        hideOnClick: false,
        appendTo: () => document.body,
        onHide: () => setIsOpen(false),
        showOnCreate: true,
      }}
      shouldShow={({ editor, view, state }) => {
        // Hiển thị khi:
        // 1. Selection rỗng (chỉ có cursor)
        // 2. Cursor ở đầu block
        // 3. Editor có thể chỉnh sửa và đang được focus

        const { empty, anchor } = state.selection
        const $anchor = state.selection.$anchor
        const isAtBlockStart = anchor === $anchor.start()

        return editor.isEditable && editor.isFocused && empty && isAtBlockStart
      }}
      className="block-conversion-menu"
    >
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900"
        >
          <span className="flex items-center gap-2">
            {getActiveBlock().icon}
            {getActiveBlock().title}
          </span>
        </button>

        {isOpen && (
          <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-md border border-gray-200 bg-white p-1 shadow-md dark:border-gray-800 dark:bg-gray-950">
            <div className="py-1 text-sm text-gray-500">Turn into</div>
            {blockOptions.map((option) => (
              <button
                key={option.title}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800",
                  option.isActive(editor) && "bg-gray-100 dark:bg-gray-800",
                )}
                onClick={() => {
                  option.command(editor)
                  setIsOpen(false)
                }}
              >
                <span className="flex items-center gap-2">
                  {option.icon}
                  {option.title}
                </span>
                {option.isActive(editor) && <Check className="ml-auto h-4 w-4" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </BubbleMenu>
  )
}
