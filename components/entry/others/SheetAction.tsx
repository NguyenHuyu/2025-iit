'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface SheetActionMenuItemProps {
    label: string
    icon?: React.ReactNode
    renderSheet: () => React.ReactNode
}

export function SheetActionMenuItem({ label, icon, renderSheet }: SheetActionMenuItemProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size={'sm'}
                    variant='ghost'
                    className='flex w-full items-center justify-start gap-2 px-2'
                >
                    {icon}
                    <span>{label}</span>
                </Button>
            </SheetTrigger>

            <SheetContent side='right'>
                <SheetHeader>
                    <SheetTitle>{label}</SheetTitle>
                </SheetHeader>
                <div className='mt-4'>{renderSheet()}</div>
            </SheetContent>
        </Sheet>
    )
}
