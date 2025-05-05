'use client'
import React from 'react'
import { useContextHooks } from './entity-context'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'

import { cn } from '@/lib/utils'
import { ScrollArea } from '../ui/scroll-area'

export function DialogEntityLayout({
    title,
    description,
    children,
    size,
    variant,
    interactOutside = true,
}: {
    title: string
    description?: string
    children: React.ReactNode
    size?: 'sm' | 'default' | 'md' | 'lg' | 'xl' | 'full'
    variant?: 'CREATE' | 'DETAIL' | 'OPTIONAL'
    interactOutside?: boolean
}) {
    const {
        isCreateDialogOpen,
        setIsCreateDialogOpen,
        isDetailDialogOpen,
        setIsDetailDialogOpen,
        isOptionalDialogOpen,
        setIsOptionalDialogOpen,
        setShow,
    } = useContextHooks()

    const dialogStateMap = {
        CREATE: {
            open: isCreateDialogOpen,
            setOpen: setIsCreateDialogOpen,
        },
        DETAIL: {
            open: isDetailDialogOpen,
            setOpen: setIsDetailDialogOpen,
        },
        OPTIONAL: {
            open: isOptionalDialogOpen,
            setOpen: setIsOptionalDialogOpen,
        },
    }

    const { open, setOpen } = dialogStateMap[variant ?? 'OPTIONAL']

    return (
        <Dialog
            open={open}
            onOpenChange={() => {
                setOpen(false)
                setShow(false)
            }}
        >
            <DialogContent
                onInteractOutside={
                    !interactOutside
                        ? (e) => {
                              e.preventDefault()
                              setShow(false)
                          }
                        : undefined
                }
                className={cn(
                    size === 'sm' && 'max-w-[400px]',
                    size === 'default' && 'max-w-[500px]',
                    size === 'md' && 'max-w-[700px]',
                    size === 'lg' && 'max-w-[1000px]',
                    size === 'xl' && 'max-w-[1200px]',
                    size === 'full' && 'max-w-[90vw]'
                )}
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <ScrollArea className='flex max-h-[80vh] w-full flex-col items-center justify-center p-1 md:h-auto'>
                    {children}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
