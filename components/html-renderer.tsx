'use client'

import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import DOMPurify from 'dompurify'

interface HtmlRendererProps {
    html: string
    className?: string
}

export function HtmlRenderer({ html, className }: HtmlRendererProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [error, setError] = useState<string | null>(null)

    // Enhanced DOMPurify configuration
    const sanitizeConfig = {
        ADD_TAGS: ['table', 'thead', 'tbody', 'tr', 'th', 'td'],
        ADD_ATTR: ['colspan', 'rowspan', 'align', 'width', 'height', 'style', 'class'],
        FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'meta'],
        FORBID_ATTR: [
            'onerror',
            'onload',
            'onclick',
            'onmouseover',
            'onmouseout',
            'onkeydown',
            'onkeypress',
            'onkeyup',
        ],
        ALLOW_DATA_ATTR: false,
        RETURN_DOM_FRAGMENT: false,
        RETURN_DOM: false,
        SANITIZE_DOM: true,
    }

    // Process the HTML content after it's rendered to add any necessary event handlers or modifications
    useEffect(() => {
        if (!containerRef.current) return

        try {
            // Make tables responsive
            const tables = containerRef.current.querySelectorAll('table')
            tables.forEach((table) => {
                // Check if table is already wrapped
                if (table.parentElement?.className !== 'tableWrapper') {
                    const wrapper = document.createElement('div')
                    wrapper.className = 'tableWrapper'
                    table.parentNode?.insertBefore(wrapper, table)
                    wrapper.appendChild(table)
                }
            })

            // Add click handlers to images for lightbox effect if needed
            const images = containerRef.current.querySelectorAll('img')
            images.forEach((img) => {
                img.addEventListener('click', () => {
                    // Implement lightbox or image preview functionality here if needed
                    console.log('Image clicked:', img.src)
                })

                // Add loading="lazy" for better performance
                img.setAttribute('loading', 'lazy')

                // Add error handling for images
                img.onerror = () => {
                    img.style.display = 'none'
                    const errorText = document.createElement('span')
                    errorText.textContent = '[Image could not be loaded]'
                    errorText.className = 'text-red-500 text-sm'
                    img.parentNode?.insertBefore(errorText, img.nextSibling)
                }
            })

            // Process code blocks for syntax highlighting if needed
            const codeBlocks = containerRef.current.querySelectorAll('pre code')
            codeBlocks.forEach((codeBlock) => {
                // Add syntax highlighting or other code block enhancements here if needed
                codeBlock.classList.add('language-javascript') // Default to JavaScript
            })
        } catch (err) {
            setError('Error processing HTML content')
            console.error(err)
        }
    }, [html])

    // Validate HTML before sanitizing
    const validateHtml = (content: string): boolean => {
        // Check for potentially malicious patterns
        const dangerousPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /data:text\/html/gi,
            /on\w+=/gi,
        ]

        return !dangerousPatterns.some((pattern) => pattern.test(content))
    }

    // Sanitize HTML to prevent XSS attacks with enhanced security
    let sanitizedHtml = ''
    try {
        if (validateHtml(html)) {
            sanitizedHtml = DOMPurify.sanitize(html, sanitizeConfig)
        } else {
            setError('Content contains potentially unsafe code')
            sanitizedHtml = DOMPurify.sanitize(html, {
                ...sanitizeConfig,
                FORBID_TAGS: [...(sanitizeConfig.FORBID_TAGS || []), 'style', 'link'],
            })
        }
    } catch (err) {
        console.error(err)
        sanitizedHtml = '<p>Error rendering content</p>'
    }

    return (
        <>
            {error && (
                <div className='mb-4 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-600'>
                    {error}
                </div>
            )}
            <div
                ref={containerRef}
                className={cn('content-styles', className)}
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
        </>
    )
}
