import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { ClassValue } from 'clsx'

type TableColumn<R> = {
    title: string
    // key?: keyof R // Direct key of R
    path?: string // Nested path as a string
    render?: (record: R, value?: any) => React.ReactNode
    headerClassName?: ClassValue
    cellClassName?: ClassValue
}

type TableProps<R> = {
    columns: TableColumn<R>[]
    data: R[]
}

function getNestedValue<R>(obj: R, path: string) {
    return path.split('.').reduce((acc: any, key: string) => acc && acc[key], obj)
}

type TableHeaderItemProps = {
    title: string
    className?: ClassValue
}

type TableBodyItemProps<R> = {
    record: R
    columns: TableColumn<R>[]
}

function TableHeaderItem({ title, className }: TableHeaderItemProps) {
    return (
        <TableHead className={cn('text-nowrap text-center font-bold text-black', className)}>
            {title}
        </TableHead>
    )
}

function TableBodyItem<R>({ record, columns }: TableBodyItemProps<R>) {
    return (
        <TableRow>
            {columns.map((column, colIndex) => {
                let value
                if (column.title) {
                    value = record[column.title as keyof R]
                } else if (column.path) {
                    value = getNestedValue(record, column.path)
                }
                return (
                    <TableCell key={colIndex} className={cn('text-center', column.cellClassName)}>
                        {column.render ? column.render(record, value) : value}
                    </TableCell>
                )
            })}
        </TableRow>
    )
}

export default async function TablePattern<R>({ columns, data }: TableProps<R>) {
    return (
        <Table className='table-auto rounded-md'>
            <TableHeader>
                <TableRow>
                    {columns.map((column, index) => (
                        <TableHeaderItem
                            key={index}
                            title={column.title}
                            className={column.headerClassName}
                        />
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody className='w-full'>
                {data && data?.length > 0 ? (
                    data?.map((record, rowIndex) => (
                        <TableBodyItem key={rowIndex} record={record} columns={columns} />
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={columns.length}>
                            <div className='text-center'>No data</div>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}
