import { Toaster } from '@/components/ui/sonner'
import { Fragment } from 'react'
import '@/styles/globals.css'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <Fragment>
            {children}
            <Toaster richColors />
        </Fragment>
    )
}
