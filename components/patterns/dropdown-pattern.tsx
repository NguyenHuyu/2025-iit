'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Calendar, Edit } from 'lucide-react'
import Link from 'next/link'
import Confirm from '@/components/patterns/confirm'

interface LinkKey {
    linkUrl: string
    linkLabel: string
    icon: React.ReactNode
}

interface DropDownProps {
    children: React.ReactNode
    align?: 'start' | 'end' | 'center'
    labelOption?: string
    links?: LinkKey[]
    editUrl?: string
    handleDelete?: any
    deleteId?: number | string
    readUrl?: string
    components?: React.ReactNode
}

export default function DropdownPattern({
    children,
    align = 'center',
    labelOption = 'Actions',
    editUrl,
    deleteId,
    readUrl,
    links,
    handleDelete,
    components,
}: DropDownProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    size='sm'
                    variant='ghost'
                    className='z-50 bg-transparent text-black hover:bg-transparent'
                >
                    {children}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} side='bottom'>
                <DropdownMenuLabel>{labelOption}</DropdownMenuLabel>
                <DropdownMenuGroup>
                    {components}
                    {links &&
                        links.map((link, index) => (
                            <DropdownMenuItem key={index}>
                                <Link
                                    href={link.linkUrl}
                                    onClick={() => setOpen(false)}
                                    className='mx-0.5 flex w-full cursor-pointer items-center rounded-sm text-primary'
                                >
                                    {link.icon}
                                    <div className='w-full max-w-20 truncate'>{link.linkLabel}</div>
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    {readUrl && (
                        <DropdownMenuItem>
                            <Link
                                href={readUrl}
                                onClick={() => setOpen(false)}
                                className='mx-0.5 flex w-full cursor-pointer items-center rounded-sm text-primary'
                            >
                                <Calendar className='mr-2 size-4' />
                                Read
                            </Link>
                        </DropdownMenuItem>
                    )}
                    {editUrl && (
                        <DropdownMenuItem>
                            <Link
                                href={editUrl}
                                onClick={() => setOpen(false)}
                                className='mx-0.5 flex h-4 w-full cursor-pointer items-center rounded-sm text-primary'
                            >
                                <Edit className='mr-2 size-4' />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                    )}

                    {deleteId && handleDelete && (
                        <>
                            <DropdownMenuSeparator />

                            <Confirm
                                deleteId={deleteId}
                                handleDelete={handleDelete}
                                setOpen={setOpen}
                            />
                        </>
                    )}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
