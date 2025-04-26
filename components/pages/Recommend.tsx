import { BulletinService } from '@/services/bulletin.service'
import { SearchType } from '@/types/utils.type'
import { Link } from 'next-view-transitions'
import Image from 'next/image'

export async function RecommendedProducts({
    id,
    params,
    args,
}: {
    id: string
    params: string
    args: SearchType
}) {
    const results = await BulletinService.getLatestBulletins(id, args)
    const items = results?.data?.content || []

    return (
        <div className='container mx-auto max-w-6xl space-y-6 py-8'>
            <h2 className='text-lg font-medium text-black'>Bài viết khác</h2>

            <div className='grid grid-cols-2 gap-6 md:grid-cols-3'>
                {items.map((product) => {
                    const href = `/${params}/${product.slug}__${product.id}`
                    return (
                        <Link
                            key={product.id}
                            href={href}
                            className='group block size-full space-y-2'
                        >
                            <div className='relative aspect-video overflow-hidden rounded-xl'>
                                {product.thumbnails && (
                                    <Image
                                        src={product.thumbnails as string}
                                        alt={product.title}
                                        fill
                                        className='object-cover transition-opacity duration-200 group-hover:opacity-80'
                                    />
                                )}

                                <div className='absolute left-2 top-2 z-10 line-clamp-2 max-w-[90%] rounded bg-black/50 px-2 py-1 text-xs font-medium text-white'>
                                    {product.title}
                                </div>
                            </div>

                            <div className='truncate text-sm font-medium text-black group-hover:text-green-600'>
                                {product.description}
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

const shimmer =
    'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent'

function ProductSkeleton() {
    return (
        <div className='col-span-4 space-y-4 lg:col-span-1'>
            <div className={`relative h-[167px] rounded-xl bg-gray-300 ${shimmer}`} />

            <div className='h-4 w-full rounded-lg bg-gray-300' />
            <div className='h-6 w-1/3 rounded-lg bg-gray-300' />
            <div className='h-4 w-full rounded-lg bg-gray-300' />
            <div className='h-4 w-4/6 rounded-lg bg-gray-300' />
        </div>
    )
}

export function RecommendedProductsSkeleton() {
    return (
        <div className='space-y-6 py-8 pb-[5px]'>
            <div className='space-y-2'>
                <div className={`h-6 w-1/3 rounded-lg bg-gray-300 ${shimmer}`} />
                <div className={`h-4 w-1/2 rounded-lg bg-gray-300 ${shimmer}`} />
            </div>

            <div className='grid grid-cols-4 gap-6'>
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
            </div>
        </div>
    )
}
