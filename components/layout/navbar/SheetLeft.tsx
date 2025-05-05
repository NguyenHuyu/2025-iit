'use client'
import { AlignLeftIcon } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetFooter, SheetTrigger } from '@/components/ui/sheet'
import SwitchLanguage from '@/components/layout/navbar/SwitchLanguage'
import Link from 'next/link'
import { useState } from 'react'
import { Logo } from '../Logo'
import { getDictionary } from '@/i18n/dictionaries'
import { useParams } from 'next/navigation'
import { DialogTitle } from '@/components/ui/dialog'

interface SheetLeftProps {
    items: { title: string; href: string; children?: { title: string; href: string }[] }[]
    dictionary: Awaited<ReturnType<typeof getDictionary>>['navigation']
}

export function SheetLeft({ items, dictionary }: SheetLeftProps) {
    const [open, setOpen] = useState(false)

    const locale = useParams().locale

    return (
        <Sheet modal open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant='ghost'
                    size='icon'
                    className='flex text-white hover:bg-transparent hover:text-black/20 md:hidden'
                >
                    <AlignLeftIcon />
                </Button>
            </SheetTrigger>
            <SheetContent className='flex flex-col gap-4 px-0' side='left'>
                <DialogTitle className='mx-auto'>{dictionary.categories.title}</DialogTitle>
                <div className='flex w-full items-center justify-center'>
                    <Logo />
                </div>
                <ScrollArea className='flex flex-col gap-4'>
                    <div className='mx-0 px-5'>
                        <ul className='flex flex-col gap-2'>
                            {items.map((item, index) => (
                                <Link
                                    key={index}
                                    href={`/${locale}/${item.href}`}
                                    onClick={() => setOpen(false)}
                                >
                                    <p className='line-clamp-1 rounded-lg px-1 py-0.5 text-base hover:bg-slate-100'>
                                        {item.title}
                                    </p>
                                </Link>
                            ))}
                        </ul>
                    </div>
                </ScrollArea>
                <SheetFooter className='mx-auto'>
                    <SwitchLanguage />
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
