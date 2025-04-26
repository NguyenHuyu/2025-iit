import * as prod from 'react/jsx-runtime'
import rehypeParse from 'rehype-parse'
import rehypeReact, { type Components } from 'rehype-react'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import slugify from 'slugify'

interface ProcessorOptions {
    components?: Partial<Components>
}

const addHeadingIds = () => {
    return (tree: any) => {
        visit(tree, 'element', (node) => {
            if (['h2', 'h3', 'h4'].includes(node.tagName)) {
                const text = node.children[0]?.type === 'text' ? node.children[0].value : ''
                node.properties = { ...node.properties, id: slugifyCustom(text) }
            }
        })
        return tree
    }
}

function slugifyCustom(text: string): string {
    return slugify(text, { lower: true, strict: true, locale: 'vi' })
}

export function createProcessor({ components }: ProcessorOptions = {}) {
    return unified().use(rehypeParse, { fragment: true }).use(addHeadingIds).use(rehypeReact, {
        Fragment: prod.Fragment,
        jsx: prod.jsx,
        jsxs: prod.jsxs,
        components,
    })
}
