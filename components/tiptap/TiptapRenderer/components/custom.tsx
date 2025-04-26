import { Components } from 'rehype-react'
import HeadingWithAnchor from './HeadingWithAnchor'
import CopyButton from './CopyButton'
import SyntaxHighlighter from './SyntaxHighlighter'

export const components: Partial<Components> = {
    // h1: (props) => <HeadingWithAnchor level={1} {...props} />,
    h2: (props) => <HeadingWithAnchor level={2} {...props} />,
    h3: (props) => <HeadingWithAnchor level={3} {...props} />,
    h4: (props) => <HeadingWithAnchor level={4} {...props} />,
    img: ({ src, alt, ...props }: any) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={`${src}`}
            alt={alt || ''}
            width={props['data-width']}
            height={props['data-height']}
            className='mx-auto rounded-lg'
        />
    ),
    iframe: ({ ...props }) => (
        <div>
            <iframe
                {...props}
                allowFullScreen={true}
                className='mx-auto aspect-video size-full rounded-lg'
            />
        </div>
    ),
    pre: ({ children, ...props }) => {
        const code = children.props.children
        return (
            <div className='not-prose group relative overflow-hidden rounded-lg border border-[#d1d9e0] dark:border-[#3d444d]'>
                <CopyButton code={String(code)} />
                <pre {...props}>{children}</pre>
            </div>
        )
    },
    code: ({ children, ...props }) => {
        const match = /language-(\w+)/.exec(props.className || '')
        const code = String(children).replace(/\n$/, '')
        return match ? (
            <SyntaxHighlighter language={match[1]} content={code} />
        ) : (
            <code {...props}>{children}</code>
        )
    },
    table: (props) => (
        <table className='not-prose mx-auto w-full table-auto border-collapse text-sm' {...props} />
    ),
    tr: (props) => (
        <tr
            className='rounded-sm border-b border-b-[#d1d9e0] last:border-b-0 dark:border-b-[#3d444d]'
            {...props}
        />
    ),
    td: (props) => <td className='rounded-sm border px-2.5 py-3.5' {...props} />,
    th: (props) => <td className='rounded-sm px-2.5 py-3.5 font-bold' {...props} />,
}
