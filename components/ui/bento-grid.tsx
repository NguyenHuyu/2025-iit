import { cn } from '@/lib/utils'
import { Link } from 'next-view-transitions'
import Image from 'next/image'

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string
    children?: React.ReactNode
}) => {
    return (
        <div
            className={cn(
                'grid grid-cols-2 gap-4 md:min-h-[20rem] md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
                className
            )}
        >
            {children}
        </div>
    )
}

export const BentoGridItem = ({
    title,
    description,
    url,
    image,
    createdAt,
}: {
    title: string
    description?: string | React.ReactNode
    url: string
    image: string
    createdAt?: Date
}) => {
    return (
        <div className={cn('rounded-xl border px-1 transition duration-200 md:w-64')}>
            <div className='text-justify transition duration-200'>
                <Image
                    src={image}
                    alt={title}
                    width={300}
                    height={300}
                    className='w-full flex-none rounded-md bg-slate-100 object-cover md:h-48'
                />
                <div className='p-2'>
                    <Link href={url}>
                        <p className='line-clamp-1 font-bold'>{title}</p>
                    </Link>
                    <p className='line-clamp-2 text-base font-normal text-neutral-600'>
                        {description}
                    </p>
                    {createdAt && (
                        <p className='mx-auto text-sm font-normal text-muted-foreground'>
                            {createdAt.toLocaleDateString('vi-VN')}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
