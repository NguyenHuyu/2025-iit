'use client'

import { Home, List, Edit } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MobileNav() {
    const pathname = usePathname()

    return (
        <nav className='fixed inset-x-0 bottom-0 border-t bg-background py-2 md:hidden'>
            <div className='flex items-center justify-around'>
                <Link
                    href='/admin'
                    className={`flex flex-col items-center ${pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                    <Home size={24} />
                    <span className='mt-1 text-xs'>Home</span>
                </Link>
                <Link
                    href='/admin/bulletin'
                    className={`flex flex-col items-center ${pathname === '/posts' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                    <List size={24} />
                    <span className='mt-1 text-xs'>Posts</span>
                </Link>
                <Link
                    href='/admin/bulletin/new'
                    className={`flex flex-col items-center ${pathname === '/posts/new' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                    <Edit size={24} />
                    <span className='mt-1 text-xs'>New Post</span>
                </Link>
            </div>
        </nav>
    )
}
