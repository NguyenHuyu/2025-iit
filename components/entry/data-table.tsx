import type React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { BaseEntity } from '@/components/entry'

export type ColumnDef<T extends BaseEntity> = {
  header: string
  accessorKey?: keyof T
  cell?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T extends BaseEntity> {
  data: T[]
  columns: ColumnDef<T>[]
  actions?: (item: T) => React.ReactNode
  maxHeight?: string
}

function TableBodyComponent<T extends BaseEntity>({
  data,
  columns,
  actions
}: {
  data: T[]
  columns: ColumnDef<T>[]
  actions?: (item: T) => React.ReactNode
}) {
  return (
    <TableBody>
      {data.map((item) => (
        <TableRow key={item.id}>
          {columns.map((column, index) => (
            <TableCell key={index} className={cn('text-center', column.className)}>
              {column.cell
                ? column.cell(item)
                : column.accessorKey
                  ? String(item[column.accessorKey])
                  : null}
            </TableCell>
          ))}
          {actions && <TableCell className='text-right'>{actions(item)}</TableCell>}
        </TableRow>
      ))}
    </TableBody>
  )
}

export function DataTable<T extends BaseEntity>({
  data,
  columns,
  actions,
  maxHeight = '569px'
}: DataTableProps<T>) {
  return (
    <div className='w-full rounded border'>
      <div className='w-full overflow-auto' style={{ maxHeight, overflowY: 'auto' }}>
        <Table>
          <TableHeader className='sticky top-0 z-20 w-full'>
            <TableRow className='bg-muted '>
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className='bg-muted text-muted-foreground h-10 font-medium'
                >
                  {column.header}
                </TableHead>
              ))}
              {actions && (
                <TableHead className='bg-muted text-center'>Tùy chọn</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBodyComponent data={data} columns={columns} actions={actions} />
        </Table>
      </div>
    </div>
  )
}
