import React from 'react'
import { LuCheck } from 'react-icons/lu'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface MediaGalleryProps {
    data: {
        url: string
        size: number
        isDirectory: boolean
        lastModified: string
    }[]
    selected: any | null
    onSelect: (image: any) => void
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ data, selected, onSelect }) => {
    return (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {data.map((image, index) => (
                <div key={image.url || index} onClick={() => onSelect(image)}>
                    {image?.url && (
                        <div className='absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-white'>
                            {selected?.url === image.url && <LuCheck aria-hidden='true' />}
                        </div>
                    )}
                    <div className='h-40 overflow-hidden'>
                        <Image
                            src={`${image?.url}`}
                            alt={image?.url}
                            width={200}
                            height={200}
                            className={cn('size-full rounded-md object-cover', {
                                'opacity-50': selected?.url !== image.url,
                            })}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default MediaGallery
