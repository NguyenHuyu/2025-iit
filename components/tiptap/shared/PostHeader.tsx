import React from 'react'
import Image from 'next/image'
import { LuCalendarDays } from 'react-icons/lu'

interface PostHeaderProps {
    title: string
    imageUrl?: string
    updatedAt?: string
    createdAt?: string
}

const PostHeader = ({ title, updatedAt, imageUrl, createdAt }: PostHeaderProps) => {
    return (
        <>
            <h1 className='text-3xl font-bold leading-snug md:text-4xl md:leading-normal'>
                {title}
            </h1>

            <div className='mt-6 flex items-center gap-4'>
                <div className='flex items-center'>
                    <div className='flex items-center gap-2 text-sm'>
                        <LuCalendarDays size={18} />
                        <span>{createdAt}</span>
                    </div>
                </div>
            </div>

            {imageUrl && (
                <Image
                    src={imageUrl}
                    alt={title}
                    width={1932}
                    height={1087}
                    className='my-10 rounded-lg'
                    priority
                />
            )}
        </>
    )
}

export default PostHeader
