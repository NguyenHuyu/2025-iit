'use client'

import { ChevronRight, MoreHorizontal, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useContextHooks } from './entity-context'
import { Link } from 'next-view-transitions'
import { SheetActionMenuItem } from './others/SheetAction'

interface BreadcrumbItem {
    label: string
    href?: string
}

export interface PageHeaderAction {
    label: string
    icon?: React.ReactNode
    type?: 'dropdown' | 'sheet' // default: 'dropdown'
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    onClick?: () => void // dùng nếu là dropdown
    renderSheet?: () => React.ReactNode // dùng nếu là sheet
}

interface PageHeaderProps {
    title: string
    breadcrumbs?: BreadcrumbItem[]
    actions?: PageHeaderAction[]
    showAddButton?: boolean
    addButtonLabel?: string
}

export function PageHeader({
    title,
    breadcrumbs = [],
    actions = [],
    showAddButton = true,
    addButtonLabel = 'Add New',
}: PageHeaderProps) {
    const { setIsCreateDialogOpen } = useContextHooks()

    return (
        <div className='flex flex-col px-1 pb-1 md:flex-row md:items-center md:justify-between'>
            <div>
                {breadcrumbs.length > 0 && (
                    <div className='mb-1 flex items-center text-sm text-muted-foreground'>
                        {breadcrumbs.map((item, index) => (
                            <div key={index} className='flex items-center'>
                                {index > 0 && <ChevronRight className='mx-1 size-4' />}
                                {item.href ? (
                                    <Link
                                        href={item.href}
                                        className='transition-colors hover:text-foreground'
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span>{item.label}</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <h1 className='text-lg font-semibold tracking-tight'>{title}</h1>
            </div>

            <div className='flex items-center space-x-2'>
                {showAddButton && (
                    <Button size='sm' onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className='size-4' />
                        <span className='sr-only md:not-sr-only'>{addButtonLabel}</span>
                    </Button>
                )}

                {actions.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='outline' size='sm' className='p-2'>
                                <MoreHorizontal className='size-3' />
                                <span className='sr-only'>More options</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-full'>
                            {actions.map((action, index) => {
                                if (action.type === 'sheet' && action.renderSheet) {
                                    return (
                                        <SheetActionMenuItem
                                            key={index}
                                            label={action.label}
                                            icon={action.icon}
                                            renderSheet={action.renderSheet}
                                        />
                                    )
                                }

                                return (
                                    <DropdownMenuItem
                                        key={index}
                                        onClick={action.onClick}
                                        className={
                                            action.variant === 'destructive' ? 'text-red-600' : ''
                                        }
                                    >
                                        {action.icon && <span>{action.icon}</span>}
                                        {action.label}
                                    </DropdownMenuItem>
                                )
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    )
}
