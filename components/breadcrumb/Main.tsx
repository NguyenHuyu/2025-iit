'use client'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Breadcrumbs } from './BreadcrumbList'

interface BreadcrumbItem {
    label: string
    href: string
    isActive?: boolean
}

export const BreadcrumbHeader = ({ breadcrumbItems }: { breadcrumbItems: BreadcrumbItem[] }) => {
    return (
        <header className='sticky top-0 z-40 block h-auto shrink-0 items-center gap-2 border-b bg-background bg-white p-3'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2 px-4'>
                    <SidebarTrigger className='-ml-1' />
                    <Separator orientation='vertical' className='mr-2 h-4' />
                    <Breadcrumbs items={breadcrumbItems} />
                </div>
            </div>
        </header>
    )
}

export const BreadcrumbOption = ({
    breadcrumbItems,
    children,
}: {
    breadcrumbItems: BreadcrumbItem[]
    children: React.ReactNode
}) => {
    return (
        <header className='sticky top-0 z-40 flex h-auto shrink-0 items-center justify-between gap-2 border-b bg-background bg-white p-3'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2 px-4'>
                    <SidebarTrigger className='-ml-1' />
                    <Separator orientation='vertical' className='mr-2 h-4' />
                    <Breadcrumbs items={breadcrumbItems} />
                </div>
            </div>
            {children}
        </header>
    )
}
