// @ts-nocheck
// @ts-ignore
'use client'

import { FileIcon as FilePdf } from 'lucide-react'
import React from 'react'

import { Button, type ButtonProps } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useToolbar } from './toolbar-provider'

const PDFUploadToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, onClick, children, ...props }, ref) => {
        const { editor } = useToolbar()
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant='ghost'
                            size='icon'
                            className={cn(
                                'h-8 w-8 p-0 sm:h-9 sm:w-9',
                                editor?.isActive('pdfUpload') && 'bg-accent',
                                className
                            )}
                            onClick={(e) => {
                                editor?.chain().focus().insertPDF().run()
                                onClick?.(e)
                            }}
                            ref={ref}
                            {...props}
                        >
                            {children ?? <FilePdf className='size-4' />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <span>Insertar plantilla PDF</span>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }
)

PDFUploadToolbar.displayName = 'PDFUploadToolbar'

export { PDFUploadToolbar }
