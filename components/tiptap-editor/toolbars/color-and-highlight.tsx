"use client"
/* eslint-disable */
import type React from "react"

// @ts-nocheck
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useToolbar } from "./toolbar-provider"
import type { Extension } from "@tiptap/core"
import type { ColorOptions } from "@tiptap/extension-color"
import type { HighlightOptions } from "@tiptap/extension-highlight"
import { CheckIcon, ChevronDownIcon, Palette } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-querry"
import { MobileToolbarGroup, MobileToolbarItem } from "./mobile-toolbar-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type TextStylingExtensions = Extension<ColorOptions, any> | Extension<HighlightOptions, any>

const TEXT_COLORS = [
  { name: "Default", color: "var(--editor-text-default)" },
  { name: "Gray", color: "var(--editor-text-gray)" },
  { name: "Brown", color: "var(--editor-text-brown)" },
  { name: "Orange", color: "var(--editor-text-orange)" },
  { name: "Yellow", color: "var(--editor-text-yellow)" },
  { name: "Green", color: "var(--editor-text-green)" },
  { name: "Blue", color: "var(--editor-text-blue)" },
  { name: "Purple", color: "var(--editor-text-purple)" },
  { name: "Pink", color: "var(--editor-text-pink)" },
  { name: "Red", color: "var(--editor-text-red)" },
]

const HIGHLIGHT_COLORS = [
  { name: "Default", color: "var(--editor-highlight-default)" },
  { name: "Gray", color: "var(--editor-highlight-gray)" },
  { name: "Brown", color: "var(--editor-highlight-brown)" },
  { name: "Orange", color: "var(--editor-highlight-orange)" },
  { name: "Yellow", color: "var(--editor-highlight-yellow)" },
  { name: "Green", color: "var(--editor-highlight-green)" },
  { name: "Blue", color: "var(--editor-highlight-blue)" },
  { name: "Purple", color: "var(--editor-highlight-purple)" },
  { name: "Pink", color: "var(--editor-highlight-pink)" },
  { name: "Red", color: "var(--editor-highlight-red)" },
]

// Extended color palette with more options
const EXTENDED_TEXT_COLORS = [
  ...TEXT_COLORS,
  { name: "Teal", color: "#14b8a6" },
  { name: "Cyan", color: "#06b6d4" },
  { name: "Sky", color: "#0ea5e9" },
  { name: "Indigo", color: "#6366f1" },
  { name: "Violet", color: "#8b5cf6" },
  { name: "Fuchsia", color: "#d946ef" },
  { name: "Rose", color: "#f43f5e" },
  { name: "Lime", color: "#84cc16" },
  { name: "Emerald", color: "#10b981" },
  { name: "Amber", color: "#f59e0b" },
]

const EXTENDED_HIGHLIGHT_COLORS = [
  ...HIGHLIGHT_COLORS,
  { name: "Teal", color: "#ccfbf1" },
  { name: "Cyan", color: "#cffafe" },
  { name: "Sky", color: "#e0f2fe" },
  { name: "Indigo", color: "#e0e7ff" },
  { name: "Violet", color: "#ede9fe" },
  { name: "Fuchsia", color: "#fae8ff" },
  { name: "Rose", color: "#ffe4e6" },
  { name: "Lime", color: "#ecfccb" },
  { name: "Emerald", color: "#d1fae5" },
  { name: "Amber", color: "#fef3c7" },
]

interface ColorHighlightButtonProps {
  name: string
  color: string
  isActive: boolean
  onClick: () => void
  isHighlight?: boolean
}

const ColorHighlightButton = ({ name, color, isActive, onClick, isHighlight }: ColorHighlightButtonProps) => (
  <button
    onClick={onClick}
    className="flex w-full items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-gray-3"
    type="button"
  >
    <div className="flex items-center space-x-2">
      <div
        className="rounded-sm border px-1 py-px font-medium"
        style={isHighlight ? { backgroundColor: color } : { color }}
      >
        A
      </div>
      <span>{name}</span>
    </div>
    {isActive && <CheckIcon className="h-4 w-4" />}
  </button>
)

const ColorPaletteGrid = ({
  colors,
  currentColor,
  onColorSelect,
  isHighlight = false,
}: {
  colors: Array<{ name: string; color: string }>
  currentColor: string
  onColorSelect: (color: string) => void
  isHighlight?: boolean
}) => (
  <div className="grid grid-cols-5 gap-1 p-1">
    {colors.map((colorObj, index) => (
      <Tooltip key={index}>
        <TooltipTrigger asChild>
          <button
            onClick={() => onColorSelect(colorObj.color)}
            className={cn(
              "h-8 w-8 rounded-md border transition-all hover:scale-110",
              currentColor === colorObj.color && "ring-2 ring-primary ring-offset-2",
            )}
            style={isHighlight ? { backgroundColor: colorObj.color } : { backgroundColor: colorObj.color }}
            aria-label={colorObj.name}
          />
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{colorObj.name}</p>
        </TooltipContent>
      </Tooltip>
    ))}
  </div>
)

export const ColorHighlightToolbar = () => {
  const { editor } = useToolbar()
  const isMobile = useMediaQuery("(max-width: 640px)")
  const [customColor, setCustomColor] = useState("")
  const [customHighlight, setCustomHighlight] = useState("")

  const currentColor = editor?.getAttributes("textStyle").color
  const currentHighlight = editor?.getAttributes("highlight").color

  const handleSetColor = (color: string) => {
    editor
      ?.chain()
      .focus()
      .setColor(color === currentColor ? "" : color)
      .run()
  }

  const handleSetHighlight = (color: string) => {
    editor
      ?.chain()
      .focus()
      .setHighlight(color === currentHighlight ? { color: "" } : { color })
      .run()
  }

  const handleCustomColorSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customColor) {
      handleSetColor(customColor)
    }
  }

  const handleCustomHighlightSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customHighlight) {
      handleSetHighlight(customHighlight)
    }
  }

  const isDisabled = !editor?.can().chain().setHighlight().run() || !editor?.can().chain().setColor("").run()

  if (isMobile) {
    return (
      <div className="flex gap-1">
        <MobileToolbarGroup label="Color">
          {TEXT_COLORS.map(({ name, color }) => (
            <MobileToolbarItem key={name} onClick={() => handleSetColor(color)} active={currentColor === color}>
              <div className="flex items-center gap-2">
                <div className="rounded-sm border px-2" style={{ color }}>
                  A
                </div>
                <span>{name}</span>
              </div>
            </MobileToolbarItem>
          ))}
        </MobileToolbarGroup>

        <MobileToolbarGroup label="Highlight">
          {HIGHLIGHT_COLORS.map(({ name, color }) => (
            <MobileToolbarItem key={name} onClick={() => handleSetHighlight(color)} active={currentHighlight === color}>
              <div className="flex items-center gap-2">
                <div className="rounded-sm border px-2" style={{ backgroundColor: color }}>
                  A
                </div>
                <span>{name}</span>
              </div>
            </MobileToolbarItem>
          ))}
        </MobileToolbarGroup>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <Popover>
        <div className="relative h-full">
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger disabled={isDisabled} asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  style={{
                    color: currentColor,
                  }}
                  className={cn("h-8 w-14 p-0 font-normal")}
                >
                  <Palette className="h-4 w-4" />
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>Text Color & Highlight</TooltipContent>
          </Tooltip>

          <PopoverContent align="start" className="w-[320px] p-2 dark:bg-gray-2">
            <Tabs defaultValue="text-color" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="text-color">Text Color</TabsTrigger>
                <TabsTrigger value="highlight">Highlight</TabsTrigger>
              </TabsList>

              <TabsContent value="text-color" className="space-y-4">
                <div>
                  <h3 className="text-xs font-medium mb-2">Basic Colors</h3>
                  <ColorPaletteGrid colors={TEXT_COLORS} currentColor={currentColor} onColorSelect={handleSetColor} />
                </div>

                <Separator />

                <div>
                  <h3 className="text-xs font-medium mb-2">Extended Palette</h3>
                  <ColorPaletteGrid
                    colors={EXTENDED_TEXT_COLORS.slice(10)}
                    currentColor={currentColor}
                    onColorSelect={handleSetColor}
                  />
                </div>

                <Separator />

                <div>
                  <h3 className="text-xs font-medium mb-2">Custom Color</h3>
                  <form onSubmit={handleCustomColorSubmit} className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="custom-color" className="sr-only">
                        Custom Color
                      </Label>
                      <Input
                        id="custom-color"
                        type="text"
                        placeholder="#HEX or color name"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                      />
                    </div>
                    <Button type="submit" size="sm" disabled={!customColor}>
                      Apply
                    </Button>
                  </form>
                </div>

                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleSetColor("")}>
                    Reset to Default
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="highlight" className="space-y-4">
                <div>
                  <h3 className="text-xs font-medium mb-2">Basic Highlights</h3>
                  <ColorPaletteGrid
                    colors={HIGHLIGHT_COLORS}
                    currentColor={currentHighlight}
                    onColorSelect={handleSetHighlight}
                    isHighlight
                  />
                </div>

                <Separator />

                <div>
                  <h3 className="text-xs font-medium mb-2">Extended Highlights</h3>
                  <ColorPaletteGrid
                    colors={EXTENDED_HIGHLIGHT_COLORS.slice(10)}
                    currentColor={currentHighlight}
                    onColorSelect={handleSetHighlight}
                    isHighlight
                  />
                </div>

                <Separator />

                <div>
                  <h3 className="text-xs font-medium mb-2">Custom Highlight</h3>
                  <form onSubmit={handleCustomHighlightSubmit} className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="custom-highlight" className="sr-only">
                        Custom Highlight
                      </Label>
                      <Input
                        id="custom-highlight"
                        type="text"
                        placeholder="#HEX or color name"
                        value={customHighlight}
                        onChange={(e) => setCustomHighlight(e.target.value)}
                      />
                    </div>
                    <Button type="submit" size="sm" disabled={!customHighlight}>
                      Apply
                    </Button>
                  </form>
                </div>

                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleSetHighlight("")}>
                    Remove Highlight
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </div>
      </Popover>
    </TooltipProvider>
  )
}
