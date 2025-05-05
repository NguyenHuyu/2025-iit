'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function PostReadingProgress() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const updateReadingProgress = () => {
            const contentElement = document.querySelector('.blog-content')
            if (!contentElement) return

            const contentBox = contentElement.getBoundingClientRect()
            const totalHeight = contentBox.height
            const windowHeight = window.innerHeight
            const currentPosition = window.scrollY

            // Calcular cuánto se ha desplazado como porcentaje del contenido total
            // Teniendo en cuenta el tamaño de la ventana
            if (totalHeight <= windowHeight) {
                // Si el contenido cabe completamente en la ventana, mostrar 100%
                setProgress(100)
            } else {
                // Calcular el progreso basado en cuánto se ha desplazado
                const availableScroll = totalHeight - windowHeight
                const currentScroll = Math.min(currentPosition, availableScroll)
                const progressPercentage = (currentScroll / availableScroll) * 100
                setProgress(progressPercentage)
            }
        }

        // Actualizar el progreso inicial
        window.addEventListener('scroll', updateReadingProgress)
        window.addEventListener('resize', updateReadingProgress)

        // Pequeño retraso para asegurar que el contenido se ha renderizado
        const timer = setTimeout(updateReadingProgress, 200)

        return () => {
            window.removeEventListener('scroll', updateReadingProgress)
            window.removeEventListener('resize', updateReadingProgress)
            clearTimeout(timer)
        }
    }, [])

    return (
        <div className='fixed left-0 top-0 z-50 h-1 w-full bg-gray-200 dark:bg-gray-800'>
            <div
                className={cn(
                    'h-full bg-primary transition-all duration-150 ease-out',
                    progress > 0 ? 'opacity-100' : 'opacity-0'
                )}
                style={{ width: `${progress}%` }}
            />
        </div>
    )
}
