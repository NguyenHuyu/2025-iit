'use client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ImagePreview({
    image,
    onRemove,
    className,
    size = { width: 300, height: 300 },
}: {
    image: string | File
    onRemove?: () => void
    className?: string
    size?: {
        width: number
        height: number
    }
}) {
    const imageUrl = image instanceof File ? URL.createObjectURL(image) : image
    return (
        <div
            className={cn('relative m-1 flex items-center rounded-md border shadow-sm', className)}
        >
            <Image
                src={imageUrl}
                alt='Preview'
                width={size.width}
                height={size.height}
                className='rounded-md object-cover'
            />
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
