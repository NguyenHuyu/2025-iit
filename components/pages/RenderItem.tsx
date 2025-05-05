import React from 'react'
import PostHeader from '@/components/tiptap/shared/PostHeader'
import { Bulletin } from '@/types/bulletin.type'
import { PostReadingProgress } from '../blog/post-reading-progress'
import { HtmlRenderer } from '../html-renderer'

export default function RenderItem({ bulletin }: { bulletin: Bulletin }) {
    return (
        <div className='relative min-h-screen bg-background px-4 py-10 sm:px-6 md:px-10'>
            <PostReadingProgress />

            <div className='mx-auto max-w-3xl'>
                <PostHeader
                    title={bulletin.title}
                    updatedAt={bulletin?.updatedAt?.toLocaleDateString('vi-VN')}
                    createdAt={bulletin?.createdAt?.toLocaleDateString('vi-VN')}
                    imageUrl={bulletin?.thumbnails as string}
                />
                <article className='prose prose-lg mx-auto max-w-3xl dark:prose-invert'>
                    <HtmlRenderer html={bulletin.body} className='blog-content' />
                </article>
            </div>
        </div>
    )
}
