'use client'

import Image from 'next/image'
import { format } from 'date-fns'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { Badge } from '@/components/ui/badge'
import { formatFileSize, getStatusColor } from './Banner'

export enum BannerType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
}

// Enum for status
export enum Status {
    Active = 'Active',
    Inactive = 'Inactive',
    Achieved = 'Achieved',
}

// Banner interface
export interface Banner {
    id: string
    name: string
    url: string
    size: number
    type: BannerType
    status: Status
    createdAt: Date
    updatedAt: Date
}

// The Client Component now receives banners as props instead of managing state
export default function BannerCarousel({ banners }: { banners: Banner[] }) {
    return (
        <div className='w-full'>
            <h2 className='container mx-auto mb-6 px-4 text-2xl font-bold'>Banner Carousel</h2>

            <Carousel className='w-full'>
                <CarouselContent>
                    {banners.map((banner) => (
                        <CarouselItem key={banner.id} className='w-full'>
                            <div className='relative h-[600px] w-full'>
                                {banner.type === BannerType.IMAGE ? (
                                    <Image
                                        src={banner.url || '/placeholder.svg'}
                                        alt={banner.name}
                                        fill
                                        className='object-cover'
                                    />
                                ) : (
                                    <video
                                        src={banner.url}
                                        controls
                                        className='size-full object-cover'
                                    />
                                )}
                                <div className='absolute inset-0 flex flex-col justify-end bg-gradient-to-r from-black/70 to-transparent p-8 text-white'>
                                    <Badge className={`mb-4 ${getStatusColor(banner.status)}`}>
                                        {banner.status}
                                    </Badge>
                                    <h3 className='mb-2 text-3xl font-bold'>{banner.name}</h3>
                                    <div className='flex justify-between text-sm'>
                                        <span>{banner.type}</span>
                                        <span>{formatFileSize(banner.size)}</span>
                                    </div>
                                    <div className='mt-2 text-xs'>
                                        Created: {format(banner.createdAt, 'PPP')}
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className='left-4' />
                <CarouselNext className='right-4' />
            </Carousel>
        </div>
    )
}
