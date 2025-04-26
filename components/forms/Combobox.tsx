'use client'
import React, { useState, ReactNode, ReactElement } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandGroup, CommandList } from '@/components/ui/command'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ChevronsUpDown, FilterIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import Loadmore from '@/components/loading/LoadMore'
import { cn } from '@/lib/utils'

function SelectFilter({
    selectedFilter,
    handleFilterChange,
    filterOptions,
}: {
    selectedFilter?: string
    handleFilterChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
    filterOptions?: { filter: string; label: string }[]
}) {
    return (
        <Select
            value={selectedFilter}
            onValueChange={(value) =>
                handleFilterChange?.({
                    target: { value },
                } as React.ChangeEvent<HTMLSelectElement>)
            }
        >
            <SelectTrigger className='w-16 truncate'>
                <SelectValue placeholder={<FilterIcon className='size-6 pr-1' />} />
            </SelectTrigger>
            <SelectContent side='top'>
                {filterOptions?.map((option) => (
                    <SelectItem key={option.filter} value={option.filter}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export function Combobox({
    searchTerm,
    handleInputChange,
    filterOptions,
    selectedFilter,
    handleFilterChange,
    children,
    reder,
    ref,
    isFetchingNextPage,
    hanleAction,
    disabled,
    isInputSearch = true,
    isSearchLoading,
    className,
}: {
    searchTerm?: string
    handleInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    filterOptions?: { filter: string; label: string }[]
    selectedFilter?: string
    handleFilterChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
    children?: ReactNode
    reder: () => ReactNode | string | undefined
    ref?: (node?: Element | null) => void
    isFetchingNextPage?: boolean
    hanleAction?: () => void
    disabled?: boolean
    isInputSearch?: boolean
    isSearchLoading?: boolean
    className?: string
}) {
    const [openPopover, setOpenPopover] = useState(false)

    return (
        <Popover modal open={openPopover} onOpenChange={setOpenPopover}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    disabled={disabled}
                    className={cn('h-9 w-full justify-between', className)}
                    onClick={() => {
                        hanleAction?.()
                        if (disabled) return
                        setOpenPopover((prev) => !prev)
                    }}
                >
                    {reder()}
                    <ChevronsUpDown className='opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className='w-[306px] p-1'
                align='start'
                side='bottom'
                onCloseAutoFocus={(e) => e.preventDefault()}
                sideOffset={6}
            >
                <Command className='rounded-lg'>
                    <div className='flex items-center gap-1'>
                        {isInputSearch && (
                            <div className='relative flex w-full flex-1 shrink-0'>
                                <Label htmlFor='search' className='sr-only'>
                                    Search
                                </Label>
                                <Input
                                    id='search'
                                    type='search'
                                    value={searchTerm}
                                    placeholder={'Tìm kiếm'}
                                    className='peer block w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-xs'
                                    onChange={handleInputChange}
                                />
                                <MagnifyingGlassIcon className='absolute left-3 top-2 size-5 text-gray-400' />
                            </div>
                        )}
                        {filterOptions && (
                            <SelectFilter
                                selectedFilter={selectedFilter}
                                handleFilterChange={handleFilterChange}
                                filterOptions={filterOptions}
                            />
                        )}
                    </div>

                    <CommandList>
                        <CommandGroup>
                            {React.Children.map(children, (child) => {
                                if (
                                    React.isValidElement<{ onClick: (value: string) => void }>(
                                        child
                                    ) &&
                                    child.props.onClick
                                ) {
                                    // Clone element and pass onSelect function
                                    return React.cloneElement(
                                        child as ReactElement<{ onClick: (value: string) => void }>,
                                        {
                                            onClick: (value: string) => {
                                                setOpenPopover(false) // Close Popover
                                                child?.props?.onClick(value) // Call onSelect function
                                            },
                                        }
                                    )
                                }
                                return child
                            })}
                        </CommandGroup>
                        {ref && (
                            <div
                                ref={ref}
                                className='my-2 flex w-full items-center justify-center'
                                style={{ height: '20px', background: 'transparent' }}
                            >
                                {!isSearchLoading && isFetchingNextPage && <Loadmore />}
                            </div>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
