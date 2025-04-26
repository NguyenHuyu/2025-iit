'use client'

import { updatePost, Post } from '@/lib/action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PostEditor({ post }: { post: Post }) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function handleUpdatePost(formData: FormData) {
        setIsLoading(true)

        const title = formData.get('title') as string
        const slug = formData.get('slug') as string
        const authorId = formData.get('authorId') as string

        try {
            await updatePost({
                id: post.id,
                title,
                slug,
                authorId,
            })
            router.refresh()
        } catch (error) {
            console.error('Failed to update post:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='flex-1 p-6'>
            <div className='mx-auto max-w-2xl'>
                <div className='mb-8'>
                    <h1 className='mb-6 text-2xl font-bold'>{post.title}</h1>

                    <form action={handleUpdatePost} className='space-y-6'>
                        <div>
                            <label className='mb-2 block text-sm'>Title</label>
                            <Input name='title' defaultValue={post.title} />
                        </div>

                        <div>
                            <label className='mb-2 block text-sm'>Slug</label>
                            <div className='flex space-x-2'>
                                <Input name='slug' defaultValue={post.slug} />
                                <Button type='button' variant='secondary'>
                                    Generate
                                </Button>
                            </div>
                        </div>

                        <div>
                            <label className='mb-2 block text-sm'>Author</label>
                            <div className='flex space-x-2'>
                                <Select name='authorId' defaultValue={post.authorId}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select author' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='1'>Author 1</SelectItem>
                                        <SelectItem value='2'>Author 2</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button type='button' variant='secondary'>
                                    <Plus className='mr-1 size-4' />
                                    Create...
                                </Button>
                            </div>
                        </div>

                        <div>
                            <label className='mb-2 block text-sm'>Main image</label>
                            <div className='rounded-lg border-2 border-dashed p-4 text-center'>
                                <div className='relative aspect-video overflow-hidden rounded-md bg-accent'>
                                    {post.mainImage ? (
                                        <img
                                            src={post.mainImage || '/placeholder.svg'}
                                            alt='Main blog image'
                                            className='size-full object-cover'
                                        />
                                    ) : (
                                        <div className='flex h-full items-center justify-center text-muted-foreground'>
                                            No image uploaded
                                        </div>
                                    )}
                                    <div className='absolute right-2 top-2 flex space-x-1'>
                                        <Button size='icon' variant='secondary' className='size-8'>
                                            <Plus className='size-4' />
                                        </Button>
                                        <Button size='icon' variant='secondary' className='size-8'>
                                            <MoreHorizontal className='size-4' />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button type='submit' disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
