import React, { useState, useMemo, useCallback } from 'react'
import { PopoverClose } from '@radix-ui/react-popover'
import clsx from 'clsx'

const COLUMNS = 7
const ROWS = 5

const DEFAULT_ACCENT_COLOR = 'bg-gray-100' // Màu nền mặc định nếu không có biến
const DEFAULT_BORDER_COLOR = 'border border-gray-100'
const DEFAULT_PRIMARY_COLOR = 'border border-blue-800'

type GridSize = { cols: number; rows: number }

interface TableBuilderProps {
    onCreate?: (value: GridSize) => void
}

const TableBuilder = ({ onCreate }: TableBuilderProps) => {
    const [gridSize, setGridSize] = useState<GridSize>({ cols: 1, rows: 1 })

    const isActiveCell = useCallback(
        (rowIndex: number, colIndex: number) =>
            rowIndex < gridSize.rows && colIndex < gridSize.cols,
        [gridSize]
    )

    const grid = useMemo(
        () =>
            Array.from({ length: ROWS }, (_, rowIndex) => (
                <div key={`row-${rowIndex}`} className='flex gap-2'>
                    {Array.from({ length: COLUMNS }, (_, colIndex) => (
                        <div
                            key={`col-${colIndex}`}
                            className={clsx(
                                'size-4',
                                DEFAULT_ACCENT_COLOR,
                                'shadow-[0_0_0_1.5px]',
                                isActiveCell(rowIndex, colIndex)
                                    ? DEFAULT_PRIMARY_COLOR
                                    : DEFAULT_BORDER_COLOR
                            )}
                            onMouseMove={() =>
                                setGridSize({ cols: colIndex + 1, rows: rowIndex + 1 })
                            }
                            onClick={() => onCreate?.(gridSize)}
                        />
                    ))}
                </div>
            )),
        [gridSize, isActiveCell, onCreate]
    )

    return (
        <div className='p-2 text-[90%]'>
            <PopoverClose asChild>
                <div className='flex flex-col gap-1.5 p-2'>{grid}</div>
            </PopoverClose>
            <div className='mt-1 text-center'>
                {gridSize.rows} x {gridSize.cols}
            </div>
        </div>
    )
}

export default TableBuilder
