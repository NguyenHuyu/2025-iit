import { useEffect, useState, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import { InterfaceResults } from '@/types/result.type'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useDebouncedCallback } from 'use-debounce'

interface UseFetchingProps<T> {
    fetchApis: ({
        page,
        filter,
        value,
    }: {
        page: number
        filter?: string
        value?: string
    }) => Promise<InterfaceResults<T>>
    initialInView?: boolean
    queryKey?: string
    enabledFetch?: boolean
    staleTime?: number
    refetchInterval?: number
    retry?: number
    filterOptions: { filter: string; label: string }[]
}

export function useFetching<T>({
    fetchApis,
    initialInView = false,
    queryKey,
    enabledFetch = true,
    staleTime = 360000, // 10m
    refetchInterval = 43200, // 12h
    retry = 3,
    filterOptions,
}: UseFetchingProps<T>) {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedFilter, setSelectedFilter] = useState(filterOptions[0].filter)

    const { ref, inView } = useInView({
        initialInView,
        threshold: 0.5,
    })

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error, refetch, isLoading } =
        useInfiniteQuery({
            retry,
            refetchInterval,
            staleTime,
            queryKey: [queryKey],
            queryFn: (data) => {
                return fetchApis({
                    page: data.pageParam,
                    filter: searchTerm ? selectedFilter : undefined,
                    value: searchTerm,
                })
            },
            initialPageParam: 1,
            getNextPageParam: (lastPage) => {
                const currentPage = lastPage?.data?.currentPage ?? 0
                const totalPages = lastPage?.data?.totalPages ?? 0
                return currentPage < totalPages ? currentPage + 1 : undefined
            },
            enabled: enabledFetch,
        })

    const debouncedSearch = useDebouncedCallback((term: string, filter: string) => {
        refetch()
        setSearchTerm(term)
        setSelectedFilter(filter)
    }, 600)

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, fetchNextPage])

    const handleSearch = useCallback(
        (term: string, filter: string) => {
            debouncedSearch(term, filter)
        },
        [debouncedSearch]
    )

    const handleInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value
            setSearchTerm(value)
            handleSearch(value, selectedFilter)
        },
        [selectedFilter, handleSearch]
    )

    const handleFilterChange = useCallback(
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            const newFilter = event.target.value
            setSelectedFilter(newFilter)
            handleSearch(searchTerm, newFilter)
        },
        [searchTerm, handleSearch]
    )
    const dataResult = data?.pages.flatMap((page) => page?.data.content).flat()

    const isError = error !== null

    return {
        data: dataResult,
        isFetchingNextPage,
        ref,
        refetch,
        isLoading,
        isError,
        handleInputChange,
        handleFilterChange,
        isSearchLoading: debouncedSearch.isPending(),
        searchTerm,
        selectedFilter,
        filterOptions,
    }
}
