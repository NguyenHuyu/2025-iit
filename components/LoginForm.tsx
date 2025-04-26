'use client'
import { GalleryVerticalEnd } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { toaster } from './shared/Toast'
import { useRouter } from 'next/navigation'
import { useForm } from '@tanstack/react-form'
import { LoginUser, LoginUserSchema } from '@/types/user.type'
import { loginUser } from '@/actions/auth.action'
import { Status } from '@reflet/http'
import { CustomFormField, SubmitButton } from '@/components/forms'

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    const router = useRouter()
    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        } as LoginUser,
        validators: {
            onSubmit: LoginUserSchema,
        },
        onSubmit: async ({ value }) => {
            const result = await loginUser(value)
            if (result?.statusCode !== Status.Ok) {
                return toaster.error(result.message)
            }
            router.refresh()
            return toaster.success(result.message)
        },
    })

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
                className='p-1'
            >
                <div className='flex flex-col gap-6'>
                    <div className='flex flex-col items-center gap-2'>
                        <a href='#' className='flex flex-col items-center gap-2 font-medium'>
                            <div className='flex size-8 items-center justify-center rounded-md'>
                                <GalleryVerticalEnd className='size-6' />
                            </div>
                            <span className='sr-only'>Admin IIT.</span>
                        </a>
                        <h1 className='text-2xl font-bold uppercase'>Welcome to Admin IIT.</h1>
                    </div>

                    <div className='grid grid-cols-1 gap-6 p-1'>
                        <form.Field name='email'>
                            {(field) => (
                                <CustomFormField
                                    meta={field.state.meta}
                                    labelName='Mail'
                                    name={field.name}
                                >
                                    <Input
                                        id={field.name}
                                        type='email'
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </CustomFormField>
                            )}
                        </form.Field>

                        <form.Field name='password'>
                            {(field) => (
                                <CustomFormField
                                    meta={field.state.meta}
                                    labelName='Password'
                                    name={field.name}
                                >
                                    <Input
                                        id={field.name}
                                        type='password'
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </CustomFormField>
                            )}
                        </form.Field>
                    </div>
                    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                        {([canSubmit, isSubmitting]) => {
                            return (
                                <div className='flex justify-center gap-2 py-4'>
                                    <SubmitButton
                                        type='submit'
                                        variant='secondary'
                                        disabled={!canSubmit}
                                        isSubmitting={isSubmitting}
                                    >
                                        Login
                                    </SubmitButton>
                                </div>
                            )
                        }}
                    </form.Subscribe>
                </div>
            </form>
            <div className='text-balance text-center text-xs [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary'>
                By clicking continue, you agree to our <a href='#'>Terms of Service</a> and{' '}
                <a href='#'>Privacy Policy</a>.
            </div>
        </div>
    )
}
