import Link from 'next/link'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Fragment } from 'react'

interface BreadcrumbItem {
    label: string
    href: string
    isActive?: boolean
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
}

export const Breadcrumbs: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {items.map((item, index) => (
                    <Fragment key={index}>
                        <BreadcrumbItem>
                            {item.isActive ? (
                                <BreadcrumbLink asChild href={item.href}>
                                    <Link href={item.href}>
                                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                    </Link>
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbLink asChild href={item.href}>
                                    <Link href={item.href}>{item.label}</Link>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                        {index < items.length - 1 && <BreadcrumbSeparator />}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
