'use client'
import { Fragment } from 'react'
import { cn } from '@/lib/utils'
import { Link } from 'next-view-transitions'
import { useParams } from 'next/navigation'

interface Props {
    title: string
    href: string
}

interface NavMenuProps extends Props {
    children?: { title: string; href: string }[]
}

interface ItemProps extends Props {
    className?: string
}

function Item({ title, href, className }: ItemProps) {
    return (
        <Link
            href={href}
            className={cn(
                'relative text-nowrap text-[#E6C067] after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:bg-[#E6C067] after:transition-all after:duration-300 after:ease-out hover:text-[#E6C067] hover:after:left-0 hover:after:w-full',
                className
            )}
        >
            {title}
        </Link>
    )
}

export default function NavMenu({ data }: { data: NavMenuProps[] }) {
    const locale = useParams().locale

    return (
        <div className='mx-auto flex h-20 items-center'>
            <div className='flex h-full items-center justify-between'>
                <div className='flex items-center gap-1 uppercase md:gap-3'>
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className='group relative font-medium md:text-base lg:text-lg xl:text-xl'
                        >
                            {item.children ? (
                                <Fragment>
                                    <div className='flex cursor-pointer items-center text-nowrap text-white focus:outline-none'>
                                        {item.title}
                                        <svg
                                            className='ml-1 size-4 transition-transform group-hover:rotate-180'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                            xmlns='http://www.w3.org/2000/svg'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M19 9l-7 7-7-7'
                                            ></path>
                                        </svg>
                                    </div>
                                    <div className='absolute mt-1 max-h-0 min-h-20 w-60 scale-95 overflow-hidden rounded-md bg-slate-100 opacity-0 shadow-lg transition-all duration-300 group-hover:max-h-96 group-hover:scale-100 group-hover:opacity-100 md:-left-20 lg:-left-10'>
                                        {item.children.map((child, childIndex) => (
                                            <Item
                                                className='block truncate px-4 py-2 text-black hover:text-[#E6C067] md:text-base lg:text-lg xl:text-xl'
                                                key={childIndex}
                                                title={child.title}
                                                href={`/${locale}/${child.href}`}
                                            />
                                        ))}
                                    </div>
                                </Fragment>
                            ) : (
                                <Item
                                    className={'text-white hover:rounded-lg hover:text-[#E6C067]'}
                                    title={item.title}
                                    href={`/${locale}/${item.href}`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
