'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FileInput({
    onFileChange,
    onRemove,
    className,
}: {
    onFileChange: (file: File) => void
    onRemove?: () => void
    className?: string
}) {
    return (
        <div
            className={cn(
                'flex h-full flex-col items-center justify-center rounded-l-lg border border-dashed',
                className
            )}
        >
            <Label className='inline-flex cursor-pointer items-center justify-center rounded-md border border-transparent p-2 text-xs font-semibold uppercase tracking-widest text-black shadow-md transition duration-150 ease-in-out hover:opacity-80 focus:outline-none focus:ring active:bg-gray-900 disabled:opacity-25'>
                + Add
                <Input
                    type='file'
                    accept='image/png, image/jpeg, image/webp, image/svg+xml, image/gif, image/bmp'
                    // className='hidden'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const selectedFiles = e.target.files
                        if (selectedFiles) onFileChange(selectedFiles[0])
                    }}
                />
                <div className='relative order-first m-2 flex h-full items-center justify-center rounded-lg bg-cover bg-center bg-no-repeat bg-origin-padding md:order-last md:h-auto'>
                    <span className='text-gray-400 opacity-75'>
                        <svg
                            className='size-[5.4rem]'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='0.7'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
                            />
                        </svg>
                    </span>
                </div>
            </Label>

            {onRemove && (
                <Button
                    className='absolute right-0 top-0 h-5 w-2 hover:bg-slate-700'
                    onClick={onRemove}
                    type='button'
                    variant='default'
                >
                    <X className='size-1' />
                </Button>
            )}
        </div>
    )
}
