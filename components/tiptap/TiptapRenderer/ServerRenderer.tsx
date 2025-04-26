import { components } from './components/custom'
import { createProcessor } from './utils/processor'

interface TiptapRendererProps {
    children: string
}

export const TiptapRenderer = ({ children }: TiptapRendererProps) => {
    const processor = createProcessor({ components })

    if (!processor) {
        console.error('Processor is undefined')
        return null
    }

    if (typeof children !== 'string') {
        console.error('Children should be a string', children)
        return children
    }

    const sanitizeHtml = (html: string): string => {
        let fixed = html.replace(/style="(rgb\([^"]+\))"/g, 'style="color: $1"')

        fixed = fixed.replace(/\s+rgb\([^)]*\)/g, '')

        return fixed
    }

    try {
        // Fix invalid style attributes before processing
        const fixedChildren = sanitizeHtml(children)
        const processed = processor.processSync(fixedChildren)

        return processed.result
    } catch (error) {
        console.error('Error processing content:', error)
        return null
    }
}
