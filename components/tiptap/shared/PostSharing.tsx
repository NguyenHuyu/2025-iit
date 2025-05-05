'use client'

import React, { useEffect, useState } from 'react'
import { TbBrandFacebook, TbBrandLinkedin, TbBrandX } from 'react-icons/tb'

const PostSharing = () => {
    const [currentUrl, setCurrentUrl] = useState('')

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href)
        }
    }, [])

    return (
        <div className='order-3 hidden justify-center md:flex lg:order-1 lg:justify-end'>
            <div className='sticky top-40 flex gap-4 lg:h-[calc(100vh-120px)] lg:flex-col'>
                {/* Facebook Share */}
                <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <TbBrandFacebook
                        size={40}
                        className='cursor-pointer rounded-full border border-neutral-300 p-2 dark:border-neutral-600'
                    />
                </a>

                {/* LinkedIn Share */}
                <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <TbBrandLinkedin
                        size={40}
                        className='cursor-pointer rounded-full border border-neutral-300 p-2 dark:border-neutral-600'
                    />
                </a>

                {/* X (Twitter) Share */}
                <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <TbBrandX
                        size={40}
                        className='cursor-pointer rounded-full border border-neutral-300 p-2 dark:border-neutral-600'
                    />
                </a>
            </div>
        </div>
    )
}

export default PostSharing
