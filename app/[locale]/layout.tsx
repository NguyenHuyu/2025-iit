import { Poppins } from 'next/font/google'
import { ThemeProvider } from '@/provider/theme'
import { i18n } from '@/i18n/i18n-config'
import { ViewTransitions } from 'next-view-transitions'
import { Navbar } from '@/components/layout/navbar'
import { InterfaceLayout } from '@/types/route.type'
import Footer from '@/components/layout/Footer'
import '@/styles/globals.css'

const poppins = Poppins({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
    weight: ['300', '400', '500', '600', '700'],
})

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({
        locale: locale,
    }))
}

export default async function RootLayout(props: Readonly<InterfaceLayout>) {
    const params = await props.params

    return (
        <ViewTransitions>
            <html lang={params.locale} suppressHydrationWarning>
                <body className={poppins.className}>
                    <ThemeProvider
                        attribute='class'
                        defaultTheme='system'
                        enableSystem
                        disableTransitionOnChange
                    >
                        <div className='min-h-svh bg-white text-black'>
                            <Navbar params={props?.params} />
                            {props.children}
                            <Footer params={props.params} />
                        </div>
                    </ThemeProvider>
                </body>
            </html>
        </ViewTransitions>
    )
}
