import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/left-sidebar'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <main className='flex flex-1 flex-col'>{children}</main>
            </SidebarInset>
        </SidebarProvider>
    )
}
