'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TocItem {
    id: string
    text: string
    level: number
    element: HTMLElement
}

export function PostToc({ content }: { content: string }) {
    const [headings, setHeadings] = useState<TocItem[]>([])
    const [activeId, setActiveId] = useState<string>('')

    // Extraer los encabezados del contenido cuando se renderiza
    useEffect(() => {
        // Esperar a que el contenido se renderice
        setTimeout(() => {
            const article = document.querySelector('.blog-content')
            if (!article) return

            // Encontrar todos los encabezados h1, h2, h3
            const elements = article.querySelectorAll('h1, h2, h3')

            const items: TocItem[] = Array.from(elements).map((element, index) => {
                // Crear un ID único si no existe
                if (!element.id) {
                    element.id = `heading-${index}`
                }

                return {
                    id: element.id,
                    text: element.textContent || '',
                    level: Number.parseInt(element.tagName.substring(1), 10),
                    element: element as HTMLElement,
                }
            })

            setHeadings(items)
        }, 300)
    }, [content])

    // Actualizar el encabezado activo al desplazarse
    useEffect(() => {
        const handleScroll = () => {
            if (headings.length === 0) return

            // Encontrar el encabezado actualmente visible
            const scrollPosition = window.scrollY + 100 // Offset para mejor UX

            // Encontrar el último encabezado que está por encima de la posición de desplazamiento
            let currentHeading = headings[0]?.id

            for (const heading of headings) {
                if (heading.element.offsetTop <= scrollPosition) {
                    currentHeading = heading.id
                } else {
                    break
                }
            }

            setActiveId(currentHeading)
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll() // Inicializar

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [headings])

    // Desplazarse al encabezado al hacer clic
    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 80, // Offset para evitar que el encabezado quede debajo de elementos fijos
                behavior: 'smooth',
            })
        }
    }

    if (headings.length === 0) {
        return (
            <div className='rounded-lg border p-4'>
                <h3 className='mb-2 font-medium'>On this page</h3>
            </div>
        )
    }

    return (
        <div className='rounded-lg border p-4'>
            <h3 className='mb-4 font-medium'>Tabla de contenidos</h3>
            <nav className='toc-nav'>
                <ul className='space-y-2 text-sm'>
                    {headings.map((heading) => (
                        <li
                            key={heading.id}
                            style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                        >
                            <button
                                onClick={() => scrollToHeading(heading.id)}
                                className={cn(
                                    'w-full truncate py-1 text-left hover:text-primary',
                                    activeId === heading.id
                                        ? 'font-medium text-primary'
                                        : 'text-muted-foreground'
                                )}
                            >
                                {heading.text}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}
