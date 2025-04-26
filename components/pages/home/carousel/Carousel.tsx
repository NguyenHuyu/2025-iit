'use client'
import Image from 'next/image'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'

// Enum for banner types
enum BannerType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
}

// Enum for status
enum Status {
    Active = 'Active',
    Inactive = 'Inactive',
    Achieved = 'Achieved',
}

// Banner interface
interface Banner {
    id: string
    name: string
    url: string
    size: number
    type: BannerType
    status: Status
    createdAt: Date
    updatedAt: Date
}

export default function BannerCarousel({ banners }: { banners: Banner[] }) {
    return (
        <Carousel className='w-full'>
            <CarouselContent>
                {banners.map((banner) => (
                    <CarouselItem id={banner.type} key={banner.id} className='w-full'>
                        <div className='relative h-[200px] sm:h-[250px] lg:h-[600px]'>
                            {banner.type === BannerType.IMAGE ? (
                                <Image
                                    src={banner.url}
                                    alt={banner.name}
                                    fill
                                    loading='eager'
                                    className='object-fill md:object-cover'
                                />
                            ) : (
                                <video
                                    src={banner.url}
                                    autoPlay
                                    muted
                                    loop
                                    className='size-full object-cover'
                                />
                            )}
                            {/* <div className='absolute inset-0 flex flex-col justify-end bg-gradient-to-r from-black/0 to-transparent p-8 text-white'>
                                <h3 className='mb-2 text-3xl font-bold'>{banner.name}</h3>
                                <div className='flex justify-between text-sm'>
                                    <span>{banner.type}</span>
                                    <span>{formatFileSize(banner.size)}</span>
                                </div>
                                <div className='mt-2 text-xs'>
                                    Created: {format(banner.createdAt, 'PPP')}
                                </div>
                            </div> */}
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className='left-1' />
            <CarouselNext className='right-1' />
        </Carousel>
    )
}
