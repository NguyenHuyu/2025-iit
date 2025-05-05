'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/breadcrumb'
import { Locale } from '@/i18n/i18n-config'

interface BreadcrumbContainerProps {
    locale: Locale
    items?: BreadcrumbItem[]
    homeLabel?: string
    className?: string
    dictionary?: any
}

export function BreadcrumbContainer({
    locale,
    items,
    homeLabel,
    className,
    dictionary,
}: BreadcrumbContainerProps) {
    const pathname = usePathname()

    const breadcrumbItems = useMemo(() => {
        if (items) return items

        // Default breadcrumb generation based on path
        const pathWithoutLocale = pathname.startsWith(`/${locale}`)
            ? pathname.substring(locale.length + 1)
            : pathname

        const segments = pathWithoutLocale.split('/').filter(Boolean)
        const generatedItems: BreadcrumbItem[] = []
        let currentPath = ''

        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i]
            currentPath += `/${segment}`

            // Skip dynamic segments
            if (segment.includes('[') && segment.includes(']')) continue

            generatedItems.push({
                label: formatSegment(segment),
                href: `/${locale}${currentPath}`,
                isCurrentPage: i === segments.length - 1,
            })
        }

        return generatedItems
    }, [items, pathname, locale])

    // Don't render if no items or only home
    if (!breadcrumbItems.length) return null

    return (
        <Breadcrumb
            items={breadcrumbItems}
            homeHref={`/${locale}`}
            homeLabel={homeLabel || dictionary?.navigation?.home || 'Home'}
            className={className}
        />
    )
}

function formatSegment(segment: string): string {
    return segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}
