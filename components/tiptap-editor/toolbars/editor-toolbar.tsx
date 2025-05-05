"use client"

import { Separator } from "@/components/ui/separator"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ToolbarProvider } from "./toolbar-provider"
import type { Editor } from "@tiptap/core"
import { UndoToolbar } from "./undo"
import { RedoToolbar } from "./redo"
import { HeadingsToolbar } from "./headings"
import { BlockquoteToolbar } from "./blockquote"
import { CodeToolbar } from "./code"
import { BoldToolbar } from "./bold"
import { ItalicToolbar } from "./italic"
import { UnderlineToolbar } from "./underline"
import { StrikeThroughToolbar } from "./strikethrough"
import { LinkToolbar } from "./link"
import { HorizontalRuleToolbar } from "./horizontal-rule"
import { AlignmentTooolbar } from "./alignment"
import { ImagePlaceholderToolbar } from "./image-placeholder-toolbar"
import { ColorHighlightToolbar } from "./color-and-highlight"
import { SearchAndReplaceToolbar } from "./search-and-replace-toolbar"
import { CodeBlockToolbar } from "./code-block"
import { TableToolbar } from "./table"
import { ColumnsToolbar } from "./columns"
import { EmojiToolbar } from "./emoji-toolbar"
import { CheckSquare, Circle, Disc, ListOrdered, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PDFUploadToolbar } from "./pdf-upload-toolbar"

export const EditorToolbar = ({ editor }: { editor: Editor }) => {
  // Hàm để áp dụng kiểu danh sách không thứ tự
  const setBulletListStyle = (style: string) => {
    if (!editor.isActive("bulletList")) {
      editor.chain().focus().toggleBulletList().run()
    }
    editor.chain().focus().setBulletListStyle(style).run()
  }

  // Hàm để áp dụng kiểu danh sách có thứ tự
  const setOrderedListStyle = (style: string) => {
    if (!editor.isActive("orderedList")) {
      editor.chain().focus().toggleOrderedList().run()
    }
    editor.chain().focus().setOrderedListStyle(style).run()
  }

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      <ToolbarProvider editor={editor}>
        <TooltipProvider>
          <ScrollArea className="h-fit py-0.5">
            <div>
              <div className="flex items-center gap-1 px-2">
                {/* History Group */}
                <UndoToolbar />
                <RedoToolbar />
                <Separator orientation="vertical" className="mx-1 h-7" />

                {/* Text Structure Group */}
                <HeadingsToolbar />
                <BlockquoteToolbar />
                <CodeToolbar />
                <CodeBlockToolbar />
                <Separator orientation="vertical" className="mx-1 h-7" />

                {/* Basic Formatting Group */}
                <BoldToolbar />
                <ItalicToolbar />
                <UnderlineToolbar />
                <StrikeThroughToolbar />
                <LinkToolbar />
                <ColorHighlightToolbar />
                <EmojiToolbar />
                <Separator orientation="vertical" className="mx-1 h-7" />

                {/* Lists & Structure Group */}
                <div className="flex items-center gap-1">
                  {/* Bullet List Dropdown */}
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8 p-0 sm:h-9 sm:w-9", editor.isActive("bulletList") && "bg-accent")}
                          >
                            <Disc className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>Bullet List Styles</span>
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent side="top" align="center" alignOffset={0} sideOffset={5}>
                      <DropdownMenuItem
                        onClick={() => setBulletListStyle("disc")}
                        className={cn(
                          editor.isActive("bulletList") &&
                            editor.getAttributes("bulletList").listStyleType === "disc" &&
                            "bg-accent",
                        )}
                      >
                        <Disc className="mr-2 h-4 w-4" />
                        <span>Disc (Default)</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setBulletListStyle("circle")}
                        className={cn(
                          editor.isActive("bulletList") &&
                            editor.getAttributes("bulletList").listStyleType === "circle" &&
                            "bg-accent",
                        )}
                      >
                        <Circle className="mr-2 h-4 w-4" />
                        <span>Circle</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setBulletListStyle("square")}
                        className={cn(
                          editor.isActive("bulletList") &&
                            editor.getAttributes("bulletList").listStyleType === "square" &&
                            "bg-accent",
                        )}
                      >
                        <Square className="mr-2 h-4 w-4" />
                        <span>Square</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Ordered List Dropdown */}
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8 p-0 sm:h-9 sm:w-9", editor.isActive("orderedList") && "bg-accent")}
                          >
                            <ListOrdered className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>Ordered List Styles</span>
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent side="top" align="center" alignOffset={0} sideOffset={5}>
                      <DropdownMenuItem
                        onClick={() => setOrderedListStyle("decimal")}
                        className={cn(
                          editor.isActive("orderedList") &&
                            editor.getAttributes("orderedList").listStyleType === "decimal" &&
                            "bg-accent",
                        )}
                      >
                        <span className="mr-2 text-xs font-mono">1, 2, 3</span>
                        <span>Decimal (Default)</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setOrderedListStyle("lower-alpha")}
                        className={cn(
                          editor.isActive("orderedList") &&
                            editor.getAttributes("orderedList").listStyleType === "lower-alpha" &&
                            "bg-accent",
                        )}
                      >
                        <span className="mr-2 text-xs font-mono">a, b, c</span>
                        <span>Lower Alpha</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setOrderedListStyle("upper-alpha")}
                        className={cn(
                          editor.isActive("orderedList") &&
                            editor.getAttributes("orderedList").listStyleType === "upper-alpha" &&
                            "bg-accent",
                        )}
                      >
                        <span className="mr-2 text-xs font-mono">A, B, C</span>
                        <span>Upper Alpha</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setOrderedListStyle("lower-roman")}
                        className={cn(
                          editor.isActive("orderedList") &&
                            editor.getAttributes("orderedList").listStyleType === "lower-roman" &&
                            "bg-accent",
                        )}
                      >
                        <span className="mr-2 text-xs font-mono">i, ii, iii</span>
                        <span>Lower Roman</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setOrderedListStyle("upper-roman")}
                        className={cn(
                          editor.isActive("orderedList") &&
                            editor.getAttributes("orderedList").listStyleType === "upper-roman" &&
                            "bg-accent",
                        )}
                      >
                        <span className="mr-2 text-xs font-mono">I, II, III</span>
                        <span>Upper Roman</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8 p-0 sm:h-9 sm:w-9", editor.isActive("taskList") && "bg-accent")}
                        onClick={() => editor.chain().focus().toggleTaskList().run()}
                      >
                        <CheckSquare className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>To-do list</span>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <HorizontalRuleToolbar />
                <TableToolbar />
                <ColumnsToolbar />
                <Separator orientation="vertical" className="mx-1 h-7" />

                {/* Alignment Group */}
                <AlignmentTooolbar />
                <Separator orientation="vertical" className="mx-1 h-7" />

                {/* Media & Styling Group */}
                <ImagePlaceholderToolbar />
                <PDFUploadToolbar />
                <Separator orientation="vertical" className="mx-1 h-7" />

                <div className="flex-1" />

                {/* Utility Group */}
                <SearchAndReplaceToolbar />
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TooltipProvider>
      </ToolbarProvider>
    </div>
  )
}
