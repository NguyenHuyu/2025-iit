'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'

interface OptionsProps {
    options: { name?: string; value: string; items: string[] }[]
}

function CheckBox({ options }: OptionsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const paramsObject = useMemo(() => {
        const params: Record<string, string> = {}
        searchParams.forEach((value, key) => {
            params[key] = value
        })
        return params
    }, [searchParams])

    // Local state to store selected values
    const [selectedValues, setSelectedValues] = useState(paramsObject)

    useEffect(() => {
        // Update local state when searchParams change
        setSelectedValues(paramsObject)
    }, [paramsObject, searchParams])

    const handleValueChange = (optionKey: string, newValue: string) => {
        const updatedParams = new URLSearchParams(searchParams.toString())

        const validValues = options.find((opt) => opt.value === optionKey)?.items || []
        if (!validValues.includes(newValue)) {
            updatedParams.delete(optionKey)
        } else {
            updatedParams.set(optionKey, newValue) // Cập nhật giá trị hợp lệ
        }

        router.push(`${pathname}?${updatedParams.toString()}`)
    }

    return (
        <div className='flex items-center gap-6 px-4'>
            {options.map((option, index) => (
                <div key={index}>
                    <div className='text-gray-400'>{option?.name}</div>

                    <div className='mt-1 flex gap-2'>
                        <RadioGroup
                            defaultValue={selectedValues[option.value] || option.items[0]} // Set default from URL or first item
                            value={selectedValues[option.value] || option.items[0]} // Set default from URL or first item
                            onValueChange={(e) => handleValueChange(option.value, e)}
                            className='flex items-center gap-2 p-2'
                        >
                            {option.items.map((item) => (
                                <div key={item} className='flex items-center space-x-2'>
                                    <RadioGroupItem value={item} id={item} />
                                    <Label htmlFor={item}>{item}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </div>
            ))}
        </div>
    )
}

export function CheckBoxSearchParams({ options }: OptionsProps) {
    return (
        <Suspense fallback={<p>...</p>}>
            <CheckBox options={options} />
        </Suspense>
    )
}
