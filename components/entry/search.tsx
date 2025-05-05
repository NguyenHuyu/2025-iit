'use client'

import type React from 'react'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface SearchComponentProps {
    placeholder?: string
    className?: string
}

export function SearchComponent({ placeholder = 'Search...', className }: SearchComponentProps) {
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchTerm(value)
    }

    return (
        <div className={`relative ${className}`}>
            <Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />
            <Input
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleSearch}
                className='w-full pl-8 md:max-w-xs'
            />
        </div>
    )
}
