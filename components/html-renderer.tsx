'use client'

import { useEffect, useRef, useState } from 'react'
import DOMPurify from 'dompurify'

interface HtmlRendererProps {
    html: string
    className?: string
}

export function HtmlRenderer({ html, className }: HtmlRendererProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [sanitizedHtml, setSanitizedHtml] = useState('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Only run DOMPurify on the client side
        const sanitizeConfig = {
            ADD_TAGS: ['table', 'thead', 'tbody', 'tr', 'th', 'td'],
            ADD_ATTR: ['colspan', 'rowspan', 'align', 'width', 'height', 'style', 'class'],
            FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'meta'],
            FORBID_ATTR: ['onerror', 'onload', 'onclick'],
            ALLOW_DATA_ATTR: false,
        }

        try {
            // Ensure DOMPurify is only used on the client side
            const cleanHtml = DOMPurify.sanitize(html, sanitizeConfig)
            setSanitizedHtml(cleanHtml)
        } catch (err) {
            console.error(err)
            setError('Error sanitizing HTML')
        }
    }, [html])

    useEffect(() => {
        // Process tables after the sanitized HTML is set and rendered
        if (sanitizedHtml && containerRef.current) {
            const tables = containerRef.current.querySelectorAll('table')
            tables?.forEach((table) => {
                // Check if table is already wrapped
                if ((table.parentNode as HTMLElement)?.className !== 'tableWrapper') {
                    const wrapper = document.createElement('div')
                    wrapper.className = 'tableWrapper'
                    table.parentNode?.insertBefore(wrapper, table)
                    wrapper.appendChild(table)
                }
            })
        }
    }, [sanitizedHtml])

    return (
        <>
            {error && <div className='text-red-500'>{error}</div>}
            <div
                ref={containerRef}
                className={className}
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
        </>
    )
}
