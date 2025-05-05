'use client'
import { Fragment, ReactNode, Suspense, useMemo } from 'react'

import {
    DialogEntityLayout,
    useContextHooks,
    DeleteAction,
    BaseEntity,
    PageHeader,
} from '@/components/entry'
import { PageHeaderAction } from './page-header'

type Size = 'sm' | 'default' | 'md' | 'lg' | 'xl' | 'full'
interface EntityLayoutProps<T extends BaseEntity> {
    title: string
    breadcrumbs?: { label: string; href?: string }[]
    actions?: PageHeaderAction[]

    children: ReactNode
    addButtonLabel?: string

    searchOptions?: ReactNode

    size?: Size

    createRender?: {
        title?: string
        description?: string
        renderFormRenderer: () => ReactNode
        size?: Size
    }

    editRender?: {
        title?: string
        description?: string
        renderFormRenderer: (item: T) => ReactNode
        size?: Size
    }

    showRender?: {
        title?: string
        description?: string
        renderFormRenderer: (item: T) => ReactNode
        size?: Size
    }
}

export function EntityLayout<T extends BaseEntity>({
    children,
    title,
    actions,
    addButtonLabel,
    breadcrumbs,
    searchOptions,
    size = 'default',
    createRender,
    editRender,
    showRender,
}: EntityLayoutProps<T>) {
    const { isCreateDialogOpen, isDetailDialogOpen, renderName } = useContextHooks<T>()

    const detailSize = useMemo(() => {
        switch (renderName) {
            case 'UPDATE':
                return editRender?.size || size
            case 'SHOW':
                return showRender?.size || size
            default:
                return size
        }
    }, [renderName, showRender?.size, editRender?.size, size])

    const createFormSize = useMemo(() => {
        return createRender?.size || size
    }, [createRender, size])

    return (
        <Fragment>
            <PageHeader
                title={title}
                breadcrumbs={breadcrumbs}
                actions={actions}
                addButtonLabel={addButtonLabel}
            />
            <Suspense fallback={<div>Loading...</div>}>{searchOptions}</Suspense>
            {children}

            {/* Create Form */}
            <DialogEntityLayout title={title} variant='CREATE' size={createFormSize}>
                {isCreateDialogOpen ? createRender?.renderFormRenderer() : null}
            </DialogEntityLayout>

            <DialogEntityLayout title={title} variant='DETAIL' size={detailSize}>
                {isDetailDialogOpen ? (
                    <DetailEntity
                        editFormRenderer={editRender?.renderFormRenderer}
                        showFormRenderer={showRender?.renderFormRenderer}
                    />
                ) : null}
            </DialogEntityLayout>

            <DeleteAction />
        </Fragment>
    )
}

// Update DetailEntity to use renderer functions
export function DetailEntity<TDetail extends BaseEntity>({
    showFormRenderer,
    editFormRenderer,
}: {
    showFormRenderer?: (item: TDetail) => React.ReactNode
    editFormRenderer?: (item: TDetail) => React.ReactNode
}) {
    const { renderName, isLoading, data, error } = useContextHooks<TDetail>()

    const renderedContent = useMemo((): ReactNode => {
        if (!data) return null

        switch (renderName) {
            case 'SHOW':
                return showFormRenderer?.(data) ?? null
            case 'UPDATE':
                return editFormRenderer?.(data) ?? null
            default:
                return null
        }
    }, [renderName, data, showFormRenderer, editFormRenderer])

    if (isLoading) {
        return (
            <div className='flex h-40 items-center justify-center text-gray-500'>
                Đang tải dữ liệu...
            </div>
        )
    }

    if (!data && error) {
        return <div className='flex h-40 items-center justify-center text-gray-500'>{error}</div>
    }

    return <Fragment>{renderedContent}</Fragment>
}
