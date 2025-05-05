import { useMemo } from 'react'
import { useFetching } from '@/hooks/useFetching'
import { InterfaceResults } from '@/types/result.type'

interface Identifiable {
    id: string
}

export function useSelectableData<T extends Identifiable>({
    queryKey,
    fetchApis,
    initialId,
    initialData,
    filterOptions,
}: {
    queryKey: string
    fetchApis: ({
        page,
        filter,
        value,
    }: {
        page: number
        filter?: string
        value?: string
    }) => Promise<InterfaceResults<T>>
    initialId: string
    initialData: any
    filterOptions: { filter: string; label: string }[]
}) {
    const data = useFetching({
        queryKey,
        fetchApis,
        filterOptions,
    })
    // Get the selected item
    const selectedItem = useMemo(() => {
        return data.data?.find((item) => item.id === initialId) || initialData
    }, [data.data, initialId, initialData])

    // Combine the selected item with the data
    const combinedList = useMemo(() => {
        const existingIds = new Set(data.data?.map((item) => item.id) || [])
        return selectedItem && !existingIds.has(selectedItem.id)
            ? [selectedItem, ...(data.data || [])]
            : data.data || []
    }, [selectedItem, data.data])

    return {
        data,
        selectedItem,
        combinedList,
    }
}
