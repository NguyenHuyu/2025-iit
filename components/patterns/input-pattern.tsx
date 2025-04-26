'use client'

import type React from 'react'
import { useState, useEffect, useTransition, Suspense } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Search, Loader2 } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface SearchOption {
    value: string
    label: string
    icon?: React.ReactNode
}

interface InputPatternProps {
    placeholder?: string
    className?: string
    searchOptions: SearchOption[]
    size?: boolean
}

export function SearchPattern({
    placeholder = 'Search',
    className = '',
    searchOptions,
}: InputPatternProps) {
    return (
        <Suspense fallback={<p>...</p>}>
            <InputPattern
                searchOptions={searchOptions}
                placeholder={placeholder}
                className={className}
            />
        </Suspense>
    )
}

export function InputPattern({
    placeholder = 'Search',
    className = '',
    searchOptions,
}: InputPatternProps) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const [isPending, startTransition] = useTransition()

    const [inputValue, setInputValue] = useState(searchParams.get('value') || '')
    const [selectedFilter, setSelectedFilter] = useState(
        searchParams.get('filter') || searchOptions[0]?.value || ''
    )

    useEffect(() => {
        setInputValue(searchParams.get('value') || '')
        setSelectedFilter(searchParams.get('filter') || searchOptions[0]?.value || '')
    }, [searchParams, searchOptions])

    const updateSearchParams = (params: URLSearchParams) => {
        startTransition(() => {
            replace(`${pathname}?${params.toString()}`)
        })
    }

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete('page')

        if (term) {
            params.set('filter', selectedFilter)
            params.set('value', term)
        } else {
            params.delete('filter')
            params.delete('value')
        }

        updateSearchParams(params)
    }, 500) // Increased debounce time for better UX

    const handleFilterChange = (newFilter: string) => {
        setSelectedFilter(newFilter)

        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString())
            params.set('filter', newFilter)

            if (inputValue) {
                params.set('value', inputValue)
                updateSearchParams(params)
            }
        })
    }

    return (
        <div className={`flex w-full items-center justify-between gap-4 pb-4 ${className}`}>
            <div className='relative flex w-full items-center gap-2'>
                <Label htmlFor='search' className='sr-only'>
                    Search
                </Label>
                <Input
                    id='search'
                    type='search'
                    placeholder={placeholder}
                    value={inputValue}
                    className='peer block w-full rounded-md border py-2 pl-8 text-xs'
                    onChange={(e) => {
                        setInputValue(e.target.value)
                        handleSearch(e.target.value)
                    }}
                />
                {isPending && (
                    <Loader2 className='absolute right-1.5 top-0.5 size-8 animate-spin text-muted-foreground' />
                )}
                <Search className='absolute left-3 top-2.5 size-4 hover:cursor-pointer' />
            </div>

            <Select value={selectedFilter} onValueChange={handleFilterChange} disabled={isPending}>
                <SelectTrigger className='flex w-28 items-center gap-2' aria-label='Select filter'>
                    <SelectValue>
                        <p className='truncate'>
                            {searchOptions.find((option) => option.value === selectedFilter)?.label}
                        </p>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {searchOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            <div className='flex items-center gap-3'>
                                {option.icon}
                                {option.label}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
