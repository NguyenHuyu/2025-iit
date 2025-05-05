'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export function BlogHeader() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={cn(
                'sticky top-0 z-40 w-full transition-all duration-200',
                scrolled ? 'bg-background/80 shadow-sm backdrop-blur-sm' : 'bg-transparent'
            )}
        >
            <div className='container flex h-16 items-center justify-between px-4'>
                <div className='flex items-center gap-2'>
                    <Link href='/text-editor'>
                        <Button variant='ghost' size='icon'>
                            <ArrowLeft className='size-4' />
                        </Button>
                    </Link>
                    <span className='font-medium'>Blog Post</span>
                </div>
            </div>
        </header>
    )
}
