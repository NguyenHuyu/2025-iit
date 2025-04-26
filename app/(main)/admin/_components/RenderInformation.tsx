import Image from 'next/image'
import type React from 'react'
import { useMemo } from 'react'

type DisplayConfig<T> = {
    [K in keyof T]: string | DisplayConfig<T[K] | { label: string }>
}

type MetadataDisplayProps<T> = {
    data: T
    displayConfig: Partial<DisplayConfig<T>>
}

export default function RenderDisplayInformation<T extends Record<string, any>>({
    data,
    displayConfig,
}: MetadataDisplayProps<T>) {
    const getDisplayName = useMemo(() => {
        return <K extends keyof T>(key: K, value: T[K], config: DisplayConfig<T>): string => {
            if (typeof value === 'object' && value !== null && 'label' in value) {
                return value.label as string
            }

            const configValue = config[key]
            if (typeof configValue === 'string') return configValue
            if (typeof configValue === 'object' && 'label' in configValue)
                return configValue.label as string

            return String(key)
        }
    }, [])

    const renderValue = <K extends keyof T>(
        key: K,
        value: T[K],
        config: DisplayConfig<T>
    ): React.ReactNode => {
        if (value === null) {
            return 'null'
        }

        // Nếu key là "images", xử lý hiển thị hình ảnh
        if (key === 'images') {
            if (Array.isArray(value)) {
                return (
                    <div className='mt-2 flex flex-wrap gap-4'>
                        <Image
                            src={value[0]}
                            alt={'Image'}
                            width={400}
                            height={400}
                            className='w-full rounded-md object-cover shadow-sm'
                        />
                    </div>
                )
            }
        }

        if (typeof value === 'object' && value !== null) {
            return (
                <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
                    <dl className='space-y-2'>
                        {(Object.keys(config[key] || {}) as Array<keyof T[K]>).map(
                            (subKey) =>
                                subKey !== 'label' &&
                                subKey in value && (
                                    <div key={String(subKey)} className='mb-3'>
                                        <dt className='text-sm font-semibold text-gray-700'>
                                            {getDisplayName(
                                                subKey as string,
                                                value[subKey as keyof T[K] as keyof T],
                                                config[key] as DisplayConfig<T[K]>
                                            )}
                                        </dt>
                                        <div className='mt-1 text-sm text-gray-900'>
                                            {renderValue(
                                                subKey as string,
                                                value[
                                                    subKey as keyof T[K]
                                                ] as unknown as T[keyof T],
                                                config[key] as DisplayConfig<T[K]>
                                            )}
                                        </div>
                                    </div>
                                )
                        )}
                    </dl>
                </div>
            )
        }
        return <span className='text-gray-800'>{value}</span>
    }

    return (
        <div className='container mx-auto p-4 md:max-w-5xl'>
            <h1 className='mb-6 text-2xl font-bold text-gray-900'>Thông tin chi tiết</h1>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                {(Object.keys(displayConfig) as Array<keyof T>).map((key) => {
                    if (!(key in data)) return null

                    const isImageField = key === 'images'
                    return (
                        <div
                            key={String(key)}
                            className={isImageField ? 'sm:col-span-2' : 'sm:col-span-1'}
                        >
                            <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-md'>
                                <dt className='text-lg font-semibold text-gray-800'>
                                    {getDisplayName(
                                        key,
                                        data[key],
                                        displayConfig as DisplayConfig<T>
                                    )}
                                </dt>
                                <div className='mt-2 text-sm text-gray-700'>
                                    {renderValue(key, data[key], displayConfig as DisplayConfig<T>)}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
