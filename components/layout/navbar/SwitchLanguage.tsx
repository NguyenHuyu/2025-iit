'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { i18n } from '@/i18n/i18n-config'

export default function Switchlanguage() {
    const pathName = usePathname()

    const redirectedPathName = (locale: string) => {
        if (!pathName) return '/'
        const segments = pathName.split('/')
        segments[1] = locale
        return segments.join('/')
    }

    return (
        <div className='flex gap-x-3'>
            {i18n.locales.map((locale) => {
                return (
                    <Link href={redirectedPathName(locale)} key={locale}>
                        {locale === 'vi' ? (
                            <Image
                                src='/assets/vi.png'
                                alt={locale}
                                width={10}
                                loading='eager'
                                height={10}
                                className='size-5 object-contain md:w-full'
                            />
                        ) : (
                            <Image
                                src='/assets/en.png'
                                alt={locale}
                                height={10}
                                priority={true}
                                quality={100}
                                width={10}
                                className='size-5 object-contain md:w-full'
                            />
                        )}
                    </Link>
                )
            })}
        </div>
    )
}
