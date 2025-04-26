'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ActiveLink({
    isActive,
    searchParams,
    children,
}: {
    isActive: boolean
    searchParams: string
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <Link
            className={clsx(
                'rounded-lg px-3 py-1 text-sm font-medium no-underline',
                isActive
                    ? 'bg-secondary-foreground text-primary-foreground'
                    : 'bg-secondary text-primary hover:bg-secondary-foreground hover:text-primary-foreground hover:transition-all hover:duration-200'
            )}
            href={`${pathname}?${searchParams}`}
        >
            {children}
        </Link>
    )
}
