'use client'

import Image from 'next/image'
import { Link } from 'next-view-transitions'
import { i18n } from '@/i18n/i18n-config'
import { useParams } from 'next/navigation'
import { Suspense } from 'react'

export function Logo() {
    const language = useParams().locale || i18n.defaultLocale

    return (
        <Suspense>
            <Link href={`/${language}`} className='focus:outline-none'>
                <div className='flex items-center justify-center gap-1'>
                    <div className='relative h-20 w-full lg:h-32 lg:w-28'>
                        <Image
                            src='/assets/logosiu.png'
                            alt='LogoSiu'
                            fill
                            className='object-contain'
                            priority
                        />
                    </div>

                    <div className='relative h-20 w-32 lg:h-20 lg:w-36'>
                        <Image
                            src='/assets/logoiit.png'
                            alt='LogoIIT'
                            fill
                            className='object-contain'
                            priority
                        />
                    </div>
                </div>
            </Link>
        </Suspense>
    )
}
