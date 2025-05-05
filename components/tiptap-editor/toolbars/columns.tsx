"use client"

import { Columns3 } from "lucide-react"
import React from "react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useToolbar } from "./toolbar-provider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TooltipProvider } from "@/components/ui/tooltip"

const ColumnsToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar()
    const [open, setOpen] = React.useState(false)
    const [columnCount, setColumnCount] = React.useState<string>("2")

    const insertColumns = () => {
      editor?.chain().focus().setColumns(Number.parseInt(columnCount, 10)).run()
      setOpen(false)
    }

    return (
      <TooltipProvider>
        <Popover open={open} onOpenChange={setOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8 p-0 sm:h-9 sm:w-9", editor?.isActive("columns") && "bg-accent", className)}
                  ref={ref}
                  {...props}
                >
                  {children ?? <Columns3 className="h-4 w-4" />}
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <span>Insert Columns</span>
            </TooltipContent>
          </Tooltip>

          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Insert Columns</h4>
                <p className="text-sm text-muted-foreground">Choose the number of columns for your layout.</p>
              </div>
              <div className="grid gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="columns">Number of Columns</Label>
                  <RadioGroup
                    defaultValue="2"
                    value={columnCount}
                    onValueChange={setColumnCount}
                    className="grid grid-cols-3 gap-2"
                  >
                    <div>
                      <RadioGroupItem value="2" id="columns-2" className="peer sr-only" />
                      <Label
                        htmlFor="columns-2"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="grid w-full grid-cols-2 gap-1">
                          <div className="rounded bg-muted h-8"></div>
                          <div className="rounded bg-muted h-8"></div>
                        </div>
                        <span className="mt-2">2 Columns</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="3" id="columns-3" className="peer sr-only" />
                      <Label
                        htmlFor="columns-3"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="grid w-full grid-cols-3 gap-1">
                          <div className="rounded bg-muted h-8"></div>
                          <div className="rounded bg-muted h-8"></div>
                          <div className="rounded bg-muted h-8"></div>
                        </div>
                        <span className="mt-2">3 Columns</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="4" id="columns-4" className="peer sr-only" />
                      <Label
                        htmlFor="columns-4"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="grid w-full grid-cols-4 gap-1">
                          <div className="rounded bg-muted h-8"></div>
                          <div className="rounded bg-muted h-8"></div>
                          <div className="rounded bg-muted h-8"></div>
                          <div className="rounded bg-muted h-8"></div>
                        </div>
                        <span className="mt-2">4 Columns</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex justify-end">
                  <Button onClick={insertColumns}>Insert Columns</Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </TooltipProvider>
    )
  },
)

ColumnsToolbar.displayName = "ColumnsToolbar"

export { ColumnsToolbar }
