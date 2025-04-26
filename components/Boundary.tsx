import clsx from 'clsx'
import React from 'react'

const Label = ({
    children,
    animateRerendering,
    color,
}: {
    children: React.ReactNode
    animateRerendering?: boolean
    color?: 'default' | 'pink' | 'blue' | 'violet' | 'cyan' | 'orange' | 'slate' | 'none'
}) => {
    return (
        <div
            className={clsx('rounded-full px-1.5 shadow-[0_0_1px_3px_black]', {
                'bg-gray-800 text-gray-300': color === 'default',
                'bg-pink-700 text-white': color === 'pink',
                'bg-blue-bg-pink-700 text-white': color === 'blue',
                'bg-cyan-bg-pink-700 text-white': color === 'cyan',
                'bg-violet-bg-pink-700 text-violet-100': color === 'violet',
                'bg-orange-bg-pink-700 text-white': color === 'orange',
                'bg-none text-white': color === 'orange',
                'animate-[highlight_1s_ease-in-out_1]': animateRerendering,
            })}
        >
            {children}
        </div>
    )
}
export const Boundary = ({
    children,
    labels,
    size = 'default',
    color = 'default',
    animateRerendering = true,
    className,
}: {
    children: React.ReactNode
    labels?: string[]
    size?: 'small' | 'default'
    color?: 'default' | 'pink' | 'blue' | 'violet' | 'cyan' | 'orange' | 'slate' | 'none'
    animateRerendering?: boolean
    className?: string
}) => {
    return (
        <div
            className={clsx('relative rounded-lg border border-dashed', {
                'px-1 py-2 lg:p-2': size === 'small',
                'p-2 py-3 lg:p-4': size === 'default',
                'border-slate-300': color === 'slate',
                'border-gray-700': color === 'default',
                'border-pink-700': color === 'pink',
                'border-blue-700': color === 'blue',
                'border-cyan-700': color === 'cyan',
                'border-violet-700': color === 'violet',
                'border-orange-700': color === 'orange',
                'border-none': color === 'none',
                'animate-[rerender_1s_ease-in-out_1] text-primary': animateRerendering,
                className,
            })}
        >
            <div
                className={clsx(
                    'absolute -top-2.5 flex gap-x-1 text-[9px] uppercase leading-4 tracking-widest',
                    {
                        'left-2 lg:left-4': size === 'small',
                        'left-4 lg:left-9': size === 'default',
                    }
                )}
            >
                {labels?.map((label) => {
                    return (
                        <Label key={label} color={color} animateRerendering={animateRerendering}>
                            {label}
                        </Label>
                    )
                })}
            </div>

            {children}
        </div>
    )
}
