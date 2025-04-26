import { useEffect, useState } from 'react'

interface TocItem {
    id: string
    text: string
    level: number
    node: Element
}

interface UseTocOptions {
    containerSelector: string
    headingSelector?: string
    observerOptions?: IntersectionObserverInit
}

export default function useToc(options: UseTocOptions) {
    const { containerSelector, headingSelector = 'h2, h3, h4', observerOptions } = options

    const [items, setItems] = useState<TocItem[]>([])
    const [activeId, setActiveId] = useState<string | null>(null)

    useEffect(() => {
        const container = document.querySelector(containerSelector)

        if (!container) return

        const updateToc = () => {
            const headings = container.querySelectorAll(headingSelector)

            const newItems = Array.from(headings).map((heading) => {
                // Lấy nội dung của thẻ <a> nếu có
                const anchor = heading.querySelector('a')
                const text = anchor
                    ? anchor.textContent?.trim() || ''
                    : heading.textContent?.trim() || ''

                return {
                    id: heading.id,
                    text: text,
                    level: parseInt(heading.tagName[1]),
                    node: heading,
                }
            })

            setItems(newItems)
        }

        updateToc() // Cập nhật ngay lập tức

        const mutationObserver = new MutationObserver(updateToc)
        mutationObserver.observe(container, {
            childList: true,
            subtree: true,
        })

        return () => mutationObserver.disconnect()
    }, [containerSelector, headingSelector])

    useEffect(() => {
        if (items.length === 0) return // Không có tiêu đề nào để theo dõi

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    console.log('Active heading:', entry.target.id)
                    setActiveId(entry.target.id)
                }
            })
        }, observerOptions)

        items.forEach((item) => observer.observe(item.node))

        return () => {
            items.forEach((item) => observer.unobserve(item.node))
        }
    }, [items, observerOptions])

    return { items, activeId }
}
