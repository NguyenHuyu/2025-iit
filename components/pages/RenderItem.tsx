'use client'
import dynamic from 'next/dynamic'
import PostHeader from '@/components/tiptap/shared/PostHeader'
import type { Bulletin } from '@/types/bulletin.type'
import { PostReadingProgress } from '../blog/post-reading-progress'

// Import HtmlRenderer with no SSR to ensure it only runs on the client
const HtmlRenderer = dynamic(
    () => import('../html-renderer').then((mod) => ({ default: mod.HtmlRenderer })),
    {
        ssr: false,
        loading: () => (
            <div className='h-96 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800'></div>
        ),
    }
)

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
