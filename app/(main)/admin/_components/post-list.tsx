'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Post } from '@/lib/action'

export default function PostsList({ initialPosts }: { initialPosts: Post[] }) {
    const [posts, setPosts] = useState(initialPosts)
    const [search, setSearch] = useState('')
    const pathname = usePathname()

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className='md:w-96 md:shrink-0 md:border-r'>
            <div className='p-4'>
                <div className='mb-4 flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                        <Button variant='ghost' size='sm'>
                            Post
                        </Button>
                        <Plus className='size-4 text-muted-foreground' />
                    </div>
                    <Button variant='ghost' size='icon'>
                        <MoreHorizontal className='size-4' />
                    </Button>
                </div>

                <div className='relative mb-4'>
                    <Search className='absolute left-3 top-2.5 size-4 text-muted-foreground' />
                    <Input
                        placeholder='Search list'
                        className='pl-9'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className='space-y-2'>
                    {filteredPosts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/admin/bulletin/${post.slug}`}
                            className={`flex cursor-pointer items-center space-x-3 rounded-md p-3 hover:bg-accent/50 ${
                                pathname === `/posts/${post.slug}` ? 'bg-accent/50' : ''
                            }`}
                        >
                            <div className='flex size-8 items-center justify-center rounded bg-background'>
                                <span className='text-xs'>
                                    {post.title.substring(0, 2).toUpperCase()}
                                </span>
                            </div>
                            <span>{post.title}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
