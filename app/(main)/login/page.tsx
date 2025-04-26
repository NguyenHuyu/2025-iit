import { LoginForm } from '@/components/LoginForm'

export default function LoginPage() {
    return (
        <div className='flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-b from-[#0a0d1a] via-[#0a0d1a] to-[#0a1a4d] p-6 text-white md:p-10'>
            <div className='w-full max-w-sm'>
                <LoginForm />
            </div>
        </div>
    )
}
