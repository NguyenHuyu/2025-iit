'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FileUploadProps {
    onChange: (file: File | null) => void
    className?: string
    acceptedFileTypes?: string
    maxFileSizeInBytes?: number
    initialUrl?: string
    type?: string
}

function FileUpload({
    initialUrl,
    onChange,
    className = '',
    acceptedFileTypes = 'image/*,video/*',
    maxFileSizeInBytes = 100 * 1024 * 1024, // 100MB
    type = 'Image',
}: FileUploadProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null)
    // const [fileType, setFileType] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (file.size > maxFileSizeInBytes) {
            setError(`File size should not exceed ${maxFileSizeInBytes / (1024 * 1024)}MB`)
            return
        }

        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            setError('Please upload an image or video file')
            return
        }

        setError(null)
        // setFileType(file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO')

        const reader = new FileReader()
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(file)
        onChange(file)
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleRemove = () => {
        setPreviewUrl(null)
        // setFileType(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        onChange(null)
    }
    return (
        <div className={`relative ${className}`}>
            <input
                type='file'
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={acceptedFileTypes}
                className='hidden'
            />
            <div
                className='cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-1 text-center transition-colors hover:border-gray-400'
                onClick={handleClick}
            >
                {previewUrl ? (
                    <div className='relative aspect-video w-full'>
                        {type === 'IMAGE' && (
                            <Image
                                src={previewUrl}
                                alt='Preview'
                                fill
                                className='rounded-lg object-contain'
                            />
                        )}
                        {type === 'VIDEO' && (
                            <video aria-label='Video player' controls className='w-full rounded-md'>
                                <source src={previewUrl} type='video/mp4' />
                            </video>
                        )}

                        <Button
                            variant='destructive'
                            size='icon'
                            className='absolute right-0 top-0'
                            onClick={(e) => {
                                e.stopPropagation()
                                handleRemove()
                            }}
                        >
                            <X className='size-4' />
                        </Button>
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center py-4'>
                        <Upload className='size-12 text-gray-400' />
                        <p className='mt-2 text-sm text-gray-500'>
                            Click or drag file to this area to upload
                        </p>
                    </div>
                )}
            </div>
            {error && <p className='mt-2 text-sm text-red-500'>{error}</p>}
        </div>
    )
}

interface SingleFileUploadProps {
    initialUrl?: string
    onChange: (file: File | null) => void
    type?: string
    className?: string
}

export default function SingleFileUpload({
    onChange,
    initialUrl,
    type = 'IMAGE',
    className,
}: SingleFileUploadProps) {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)

    const handleFileChange = (file: File | null) => {
        setUploadedFile(file)
        onChange(file)
    }

    return (
        <div className='container mx-auto py-2'>
            <FileUpload
                type={type}
                onChange={handleFileChange}
                initialUrl={initialUrl}
                className={cn('mx-auto max-w-lg', className)}
                maxFileSizeInBytes={100 * 1024 * 1024} // 100MB
            />
            {uploadedFile && (
                <p className='mt-2 text-center text-xs'>
                    Uploaded: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(2)} KB)
                </p>
            )}
        </div>
    )
}
