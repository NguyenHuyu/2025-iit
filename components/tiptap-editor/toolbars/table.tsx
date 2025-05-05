"use client"

import { Table } from "lucide-react"
import React, { useState } from "react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useToolbar } from "./toolbar-provider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const TableToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar()
    const [rows, setRows] = useState(3)
    const [cols, setCols] = useState(3)
    const [open, setOpen] = useState(false)

    const insertTable = () => {
      editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
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
                  className={cn("h-8 w-8 p-0 sm:h-9 sm:w-9", editor?.isActive("table") && "bg-accent", className)}
                  ref={ref}
                  {...props}
                >
                  {children ?? <Table className="h-4 w-4" />}
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <span>Insert Table</span>
            </TooltipContent>
          </Tooltip>

          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Insert Table</h4>
                <p className="text-sm text-muted-foreground">Set the dimensions for your table.</p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rows">Rows</Label>
                    <Input
                      id="rows"
                      type="number"
                      min={1}
                      max={10}
                      value={rows}
                      onChange={(e) => setRows(Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cols">Columns</Label>
                    <Input
                      id="cols"
                      type="number"
                      min={1}
                      max={10}
                      value={cols}
                      onChange={(e) => setCols(Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={insertTable}>Insert Table</Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </TooltipProvider>
    )
  },
)

TableToolbar.displayName = "TableToolbar"

export { TableToolbar }
