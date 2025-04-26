import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from '@/i18n/i18n-config'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { verifySession } from './lib/session'

const PUBLIC_ROUTES = ['/']
const AUTH_ROUTES = '/login'
const ADMIN_ROUTES = '/admin'
const SPECIAL_ROUTES = '/404'

function getLocale(request: NextRequest): string {
    const negotiatorHeaders: Record<string, string> = {}
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

    const languages = new Negotiator({ headers: negotiatorHeaders }).languages(i18n.locales.slice())
    return matchLocale(languages, i18n.locales, i18n.defaultLocale)
}

function removeTwoPathSegments(url: string) {
    const parts = url.split('/')
    const firstTwoParts = parts.slice(2, 3)
    return `/${firstTwoParts.join('/')}`
}

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const isStartWithAdmin = pathname.startsWith(ADMIN_ROUTES)
    const isStartWithLogin = pathname.startsWith(AUTH_ROUTES)
    const isStartWithNoLocale = pathname.startsWith('/')

    const isPublicRoute = PUBLIC_ROUTES.includes(removeTwoPathSegments(pathname))

    const isMediaRoute = pathname.startsWith('/media')

    if (isMediaRoute) {
        return NextResponse.next()
    }

    // Check session
    const session = isStartWithAdmin || isStartWithLogin ? await verifySession() : null

    // if not session and start with admin, redirect to login
    if (isStartWithAdmin && !session) {
        return NextResponse.redirect(new URL(AUTH_ROUTES, request.url))
    }

    // if session and start with login, redirect to admin
    if (isStartWithLogin && session) {
        return NextResponse.redirect(new URL(ADMIN_ROUTES, request.url))
    }
    // If public route and missing locale, redirect to locale
    if (isPublicRoute && !isStartWithAdmin && !isStartWithLogin) {
        const pathnameIsMissingLocale = i18n.locales.every(
            (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
        )

        if (pathnameIsMissingLocale) {
            const locale = getLocale(request)
            return NextResponse.redirect(new URL(`/${locale}`, request.url))
        }
    }

    // If not public route and not start with admin and not start with login, redirect to 404
    if (!isPublicRoute && !isStartWithAdmin && !isStartWithLogin && !isStartWithNoLocale) {
        return NextResponse.redirect(new URL(SPECIAL_ROUTES, request.url))
    }

    const response = NextResponse.next()
    response.cookies.set('language', getLocale(request))
    return response
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|assets|images/).*)',
        '/(vi|en)/:path*',
        '/admin/:path*',
    ],
}
