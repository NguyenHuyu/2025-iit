"use client"

import { BubbleMenu, type Editor } from "@tiptap/react"
import { BoldToolbar } from "../toolbars/bold"
import { ItalicToolbar } from "../toolbars/italic"
import { UnderlineToolbar } from "../toolbars/underline"
import { LinkToolbar } from "../toolbars/link"
import { ColorHighlightToolbar } from "../toolbars/color-and-highlight"
import { ToolbarProvider } from "../toolbars/toolbar-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useMediaQuery } from "@/hooks/use-media-querry"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { HeadingsToolbar } from "../toolbars/headings"
import { BulletListToolbar } from "../toolbars/bullet-list"
import { OrderedListToolbar } from "../toolbars/ordered-list"
import { ImagePlaceholderToolbar } from "../toolbars/image-placeholder-toolbar"
import { AlignmentTooolbar } from "../toolbars/alignment"
import { BlockquoteToolbar } from "../toolbars/blockquote"
import { TableFloatingMenu } from "./table-floating-menu"
import { useEffect } from "react"

export function FloatingToolbar({ editor }: { editor: Editor | null }) {
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Prevent default context menu on mobile
  useEffect(() => {
    if (!editor?.options.element || !isMobile) return

    const handleContextMenu = (e: Event) => {
      e.preventDefault()
    }

    const el = editor.options.element
    el.addEventListener("contextmenu", handleContextMenu)

    return () => el.removeEventListener("contextmenu", handleContextMenu)
  }, [editor, isMobile])

  if (!editor) return null

  if (isMobile) {
    return (
      <>
        <TableFloatingMenu editor={editor} />
        <TooltipProvider>
          <BubbleMenu
            tippyOptions={{
              duration: 100,
              placement: "bottom",
              offset: [0, 10],
              interactive: true,
              appendTo: () => document.body,
              hideOnClick: false,
              zIndex: 50,
            }}
            shouldShow={({ editor, view, state, oldState, from, to }) => {
              // Mostrar cuando hay texto seleccionado
              const hasSelection = !state.selection.empty

              // Siempre mostrar cuando hay texto seleccionado y el editor es editable
              if (hasSelection && editor.isEditable) {
                return true
              }

              // No mostrar cuando estamos en una tabla
              return editor.isEditable && editor.isFocused && !editor.isActive("table")
            }}
            editor={editor}
            className="w-full min-w-full mx-0 shadow-sm border rounded-sm bg-background"
          >
            <ToolbarProvider editor={editor}>
              <ScrollArea className="h-fit py-0.5 w-full">
                <div className="flex items-center px-2 gap-0.5">
                  <div className="flex items-center gap-0.5 p-1">
                    {/* Primary formatting */}
                    <BoldToolbar />
                    <ItalicToolbar />
                    <UnderlineToolbar />
                    <Separator orientation="vertical" className="h-6 mx-1" />

                    {/* Structure controls */}
                    <HeadingsToolbar />
                    <BulletListToolbar />
                    <OrderedListToolbar />
                    <Separator orientation="vertical" className="h-6 mx-1" />

                    {/* Rich formatting */}
                    <ColorHighlightToolbar />
                    <LinkToolbar />
                    <ImagePlaceholderToolbar />
                    <Separator orientation="vertical" className="h-6 mx-1" />

                    {/* Additional controls */}
                    <AlignmentTooolbar />
                    <BlockquoteToolbar />
                  </div>
                </div>
                <ScrollBar className="h-0.5" orientation="horizontal" />
              </ScrollArea>
            </ToolbarProvider>
          </BubbleMenu>
        </TooltipProvider>
      </>
    )
  }

  return (
    <>
      <TableFloatingMenu editor={editor} />
      <TooltipProvider>
        <BubbleMenu
          tippyOptions={{
            duration: 100,
            placement: "top",
            offset: [0, -10],
            interactive: true,
            appendTo: () => document.body,
            hideOnClick: false,
            zIndex: 50,
          }}
          shouldShow={({ editor, state }) => {
            // Mostrar cuando hay texto seleccionado
            const hasSelection = !state.selection.empty

            // No mostrar cuando estamos en una tabla
            if (editor.isActive("table")) {
              return false
            }

            // Siempre mostrar cuando hay texto seleccionado y el editor es editable
            return hasSelection && editor.isEditable && editor.isFocused
          }}
          editor={editor}
          className="rounded-md border bg-background p-1 shadow-md"
        >
          <ToolbarProvider editor={editor}>
            <div className="flex items-center gap-1">
              <BoldToolbar />
              <ItalicToolbar />
              <UnderlineToolbar />
              <Separator orientation="vertical" className="h-6 mx-1" />
              <LinkToolbar />
              <ColorHighlightToolbar />
              <Separator orientation="vertical" className="h-6 mx-1" />
              <HeadingsToolbar />
              <AlignmentTooolbar />
            </div>
          </ToolbarProvider>
        </BubbleMenu>
      </TooltipProvider>
    </>
  )
}
