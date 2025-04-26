import React from 'react'
import PostHeader from '@/components/tiptap/shared/PostHeader'
import PostToc from '@/components/tiptap/shared/PostToc'
import PostContent from '@/components/tiptap/shared/PostContent'
import PostSharing from '@/components/tiptap/shared/PostSharing'
import { TiptapRenderer } from '@/components/tiptap/TiptapRenderer/ServerRenderer'
import { Bulletin } from '@/types/bulletin.type'

export default function RenderItem({ bulletin }: { bulletin: Bulletin }) {
    return (
        <article className='mx-auto flex max-w-screen-xl flex-col items-center px-4 py-10 sm:px-6 md:px-10'>
            <PostHeader
                title={bulletin.title}
                updatedAt={bulletin?.updatedAt?.toLocaleDateString('vi-VN')}
                createdAt={bulletin?.createdAt?.toLocaleDateString('vi-VN')}
                imageUrl={bulletin?.thumbnails as string}
            />
            <div className='grid w-full grid-cols-1 gap-6 lg:grid-cols-[1fr_minmax(700px,860px)_1fr] lg:gap-12'>
                <PostSharing />
                <PostContent>
                    <TiptapRenderer>{bulletin.body}</TiptapRenderer>
                </PostContent>
                <PostToc />
            </div>
        </article>
    )
}
