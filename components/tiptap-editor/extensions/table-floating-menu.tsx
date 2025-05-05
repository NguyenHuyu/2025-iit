"use client"

import { BubbleMenu, type Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import {
  CornerDownLeft,
  CornerDownRight,
  CornerUpLeft,
  CornerUpRight,
  Trash,
  MoveHorizontal,
  MoveVertical,
  Merge,
  Split,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Settings2,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Color palette for table cells
const CELL_COLORS = [
  { name: "Default", color: "transparent" },
  { name: "Gray", color: "#f3f4f6" },
  { name: "Red", color: "#fee2e2" },
  { name: "Orange", color: "#ffedd5" },
  { name: "Yellow", color: "#fef9c3" },
  { name: "Green", color: "#dcfce7" },
  { name: "Blue", color: "#dbeafe" },
  { name: "Purple", color: "#f3e8ff" },
  { name: "Pink", color: "#fce7f3" },
]

// Text colors for table cells
const TEXT_COLORS = [
  { name: "Default", color: "inherit" },
  { name: "Gray", color: "#6b7280" },
  { name: "Red", color: "#ef4444" },
  { name: "Orange", color: "#f97316" },
  { name: "Yellow", color: "#eab308" },
  { name: "Green", color: "#22c55e" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Purple", color: "#a855f7" },
  { name: "Pink", color: "#ec4899" },
]

export function TableFloatingMenu({ editor }: { editor: Editor | null }) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [customBgColor, setCustomBgColor] = useState("")
  const [customTextColor, setCustomTextColor] = useState("")

  if (!editor) return null

  const isTableActive = editor.isActive("table")
  const isTableHeaderActive = editor.isActive("tableHeader")
  const isTableCellActive = editor.isActive("tableCell")

  const addColumnBefore = () => editor.chain().focus().addColumnBefore().run()
  const addColumnAfter = () => editor.chain().focus().addColumnAfter().run()
  const deleteColumn = () => editor.chain().focus().deleteColumn().run()
  const addRowBefore = () => editor.chain().focus().addRowBefore().run()
  const addRowAfter = () => editor.chain().focus().addRowAfter().run()
  const deleteRow = () => editor.chain().focus().deleteRow().run()
  const deleteTable = () => editor.chain().focus().deleteTable().run()
  const mergeCells = () => editor.chain().focus().mergeCells().run()
  const splitCell = () => editor.chain().focus().splitCell().run()
  const toggleHeaderColumn = () => editor.chain().focus().toggleHeaderColumn().run()
  const toggleHeaderRow = () => editor.chain().focus().toggleHeaderRow().run()
  const toggleHeaderCell = () => editor.chain().focus().toggleHeaderCell().run()

  const mergeOrSplit = () => {
    if (editor.can().mergeCells()) {
      mergeCells()
    } else if (editor.can().splitCell()) {
      splitCell()
    }
  }

  const setCellBackground = (color: string) => {
    // This is a simplified implementation
    // In a real implementation, you would need to set the background color on the selected cells
    const element = document.querySelector(".is-selected")
    if (element) {
      element.setAttribute("style", `background-color: ${color};`)
    }
  }

  const setCellTextColor = (color: string) => {
    // This is a simplified implementation
    // In a real implementation, you would need to set the text color on the selected cells
    const element = document.querySelector(".is-selected")
    if (element) {
      element.setAttribute("style", `color: ${color};`)
    }
  }

  const applyCustomBgColor = () => {
    if (customBgColor) {
      setCellBackground(customBgColor)
      setCustomBgColor("")
    }
  }

  const applyCustomTextColor = () => {
    if (customTextColor) {
      setCellTextColor(customTextColor)
      setCustomTextColor("")
    }
  }

  return (
    <TooltipProvider>
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor }) => editor.isActive("table")}
        tippyOptions={{
          placement: "top",
          offset: [0, 10],
          zIndex: 50,
          interactive: true,
        }}
        className="flex items-center rounded-md border bg-background p-1 shadow-md"
      >
        <div className="flex items-center space-x-1">
          {/* Row operations */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={addRowBefore}>
                <CornerUpLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add row before</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={addRowAfter}>
                <CornerDownLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add row after</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={deleteRow}>
                <MoveHorizontal className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete row</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Column operations */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={addColumnBefore}>
                <CornerUpRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add column before</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={addColumnAfter}>
                <CornerDownRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add column after</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={deleteColumn}>
                <MoveVertical className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete column</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Cell operations */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={mergeOrSplit}>
                {editor.can().mergeCells() ? <Merge className="h-4 w-4" /> : <Split className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{editor.can().mergeCells() ? "Merge cells" : "Split cell"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleHeaderCell}
                data-active={isTableHeaderActive}
              >
                <span className={`font-bold ${isTableHeaderActive ? "text-primary" : ""}`}>TH</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle header cell</TooltipContent>
          </Tooltip>

          {/* Alignment */}
          <Separator orientation="vertical" className="mx-1 h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {}}>
                <AlignLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align left</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {}}>
                <AlignCenter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align center</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {}}>
                <AlignRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align right</TooltipContent>
          </Tooltip>

          {/* Color picker */}
          <Separator orientation="vertical" className="mx-1 h-6" />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Palette className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="center">
              <Tabs defaultValue="background">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="background">Background</TabsTrigger>
                  <TabsTrigger value="text">Text Color</TabsTrigger>
                </TabsList>

                <TabsContent value="background" className="p-4">
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {CELL_COLORS.map((color) => (
                      <button
                        key={color.name}
                        className={cn(
                          "h-8 w-full rounded-md border transition-all hover:scale-105",
                          color.color === "transparent" && "bg-transparent",
                        )}
                        style={{ backgroundColor: color.color !== "transparent" ? color.color : undefined }}
                        onClick={() => setCellBackground(color.color)}
                        title={color.name}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Input
                      value={customBgColor}
                      onChange={(e) => setCustomBgColor(e.target.value)}
                      placeholder="#HEX or color name"
                      className="h-8 text-xs"
                    />
                    <Button size="sm" className="h-8" onClick={applyCustomBgColor}>
                      Apply
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="text" className="p-4">
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {TEXT_COLORS.map((color) => (
                      <button
                        key={color.name}
                        className="h-8 w-full rounded-md border transition-all hover:scale-105 flex items-center justify-center"
                        style={{ color: color.color !== "inherit" ? color.color : undefined }}
                        onClick={() => setCellTextColor(color.color)}
                        title={color.name}
                      >
                        <span className="font-bold">A</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Input
                      value={customTextColor}
                      onChange={(e) => setCustomTextColor(e.target.value)}
                      placeholder="#HEX or color name"
                      className="h-8 text-xs"
                    />
                    <Button size="sm" className="h-8" onClick={applyCustomTextColor}>
                      Apply
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>

          {/* Table operations */}
          <Separator orientation="vertical" className="mx-1 h-6" />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings2 className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="grid gap-2">
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={toggleHeaderRow}>
                  Toggle header row
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={toggleHeaderColumn}>
                  Toggle header column
                </Button>
                <Separator className="my-1" />
                <Button variant="destructive" size="sm" className="w-full justify-start" onClick={deleteTable}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete table
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </BubbleMenu>
    </TooltipProvider>
  )
}
