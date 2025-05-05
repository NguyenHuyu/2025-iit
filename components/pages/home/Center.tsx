'use client'
import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Link } from 'next-view-transitions'

interface CenterProps {
    units: {
        urlImage: string
        name: string
        altImage: string
        ref: string
    }[]
    title: string
}

export default function Center({ units, title }: CenterProps) {
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view')
                    }
                })
            },
            { threshold: 0.1 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => {
            if (sectionRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(sectionRef.current)
            }
        }
    }, [])
    return (
        <section ref={sectionRef} className='bg-gradient-to-b from-white to-gray-50 py-6 md:py-10'>
            <div className='container mx-auto px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className='mb-10 text-center'
                >
                    <h3 className='relative inline-block text-2xl text-gray-800 md:text-4xl lg:text-5xl'>
                        {title}
                        <span className='absolute -bottom-3 left-1/2 h-1 w-40 -translate-x-1/2 bg-[#D4AF37]'></span>
                    </h3>
                </motion.div>

                <div className='grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12'>
                    {units.map((unit, index) => (
                        <motion.div
                            key={unit.name}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <Link
                                href={unit.ref}
                                className='group block h-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl'
                            >
                                <div className='p-6'>
                                    <div className='relative aspect-[4/3] h-20 w-full overflow-hidden rounded-md'>
                                        <Image
                                            src={unit?.urlImage}
                                            alt={unit?.altImage || unit.name}
                                            fill
                                            className='object-contain'
                                            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px'
                                            priority={index < 3}
                                        />
                                    </div>
                                    <h4 className='mb-2 text-base text-gray-800'>{unit.name}</h4>

                                    <div className='mt-auto flex items-center justify-between border-t border-gray-100 pt-2'>
                                        <span className='text-sm font-medium text-gray-600'>
                                            Xem chi tiết
                                        </span>
                                        <motion.div
                                            whileHover={{ x: 5 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 400,
                                                damping: 10,
                                            }}
                                        >
                                            <div className='ml-2 rounded-full bg-gray-100 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    width='20'
                                                    height='20'
                                                    viewBox='0 0 24 24'
                                                    fill='none'
                                                    stroke='currentColor'
                                                    strokeWidth='2'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    className='text-gray-600'
                                                >
                                                    <path d='M7 7h10v10' />
                                                    <path d='M7 17 17 7' />
                                                </svg>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
