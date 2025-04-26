import 'server-only'
import { SignJWT, jwtVerify, JWTPayload } from 'jose'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'

const key = new TextEncoder().encode(process.env.AUTH_SECRET_KEY)

export const COOKIE: {
    name: string
    options: Partial<ResponseCookie>
    duration: number
} = {
    name: 'session',
    options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
    },
    duration: 24 * 60 * 60 * 1000,
}

export async function encrypt(payload: JWTPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1day')
        .sign(key)
}

export async function decrypt(session: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        console.error('❌ Error in decrypt:', error)
        return null
    }
}

export async function createSession(payload: string) {
    const cookieStore = await cookies()
    const expires = new Date(Date.now() + COOKIE.duration)
    const session = await encrypt({
        payload,
        expires,
    })
    cookieStore.set(COOKIE.name, session, { ...COOKIE.options, expires })
}

export async function verifySession() {
    const cookieStore = await cookies()

    const cookieValue = cookieStore.get(COOKIE.name)?.value as string
    const session = await decrypt(cookieValue)

    if (!session) {
        return null
    }

    return session
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}
