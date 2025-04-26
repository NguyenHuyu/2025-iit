'use client'
import { MoonIcon, SunIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(
        typeof window !== 'undefined' ? window.localStorage.getItem('theme') === 'dark' : false
    )

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        window.localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
        document.documentElement.classList.toggle('dark', isDarkMode)
    }, [isDarkMode])

    if (!mounted) return

    return (
        <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className='inline-flex w-full items-center gap-1'
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDarkMode ? <SunIcon width={17} /> : <MoonIcon width={17} />} Theme
        </button>
    )
}

export default ThemeSwitcher
