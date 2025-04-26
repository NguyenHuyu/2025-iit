'use client'

import useProgress from '../TiptapEditor/hooks/useProgress'
import React from 'react'

const PostReadingProgress = () => {
    const { progress, enable } = useProgress('.article-content')

    return enable ? (
        <div
            className='fixed inset-x-0 top-28 z-40 h-0.5 bg-blue-600 dark:bg-blue-500'
            style={{ width: `${progress}%` }}
        />
    ) : null
}

export default PostReadingProgress
