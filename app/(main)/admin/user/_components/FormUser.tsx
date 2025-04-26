'use client'
import React from 'react'
import { useForm } from '@tanstack/react-form'
import { CustomFormField, SubmitButton } from '@/components/forms'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { User, UserSchema } from '@/types/user.type'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { createUser, updateUser } from '@/actions/user.action'
import { Status } from '@reflet/http'
import { toaster } from '@/components/shared/Toast'

export default function FormUser({ initialValues }: { initialValues?: User }) {
    const router = useRouter()
    const form = useForm({
        defaultValues: initialValues || ({} as User),
        validators: {
            onSubmit: UserSchema,
        },
        onSubmit: async ({ value }) => {
            if (!initialValues) {
                const result = await createUser(value)
                if (result?.statusCode !== Status.Created) {
                    return toaster.error('Có lỗi xảy ra')
                }
                router.push('/admin/user')

                return toaster.success(result?.message)
            }
            if (initialValues?.id) {
                const result = await updateUser(initialValues.id, value)
                if (result?.statusCode !== Status.Ok) {
                    return toaster.error('Có lỗi xảy ra')
                }
                return toaster.success(result?.message)
            }
        },
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}
            className='p-1'
        >
            <div className='grid grid-cols-1 gap-2 p-4 md:grid-cols-2'>
                <form.Field name='name'>
                    {(field) => (
                        <CustomFormField
                            meta={field.state.meta}
                            labelName='Tên người dùng'
                            name={field.name}
                        >
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        </CustomFormField>
                    )}
                </form.Field>
                <form.Field name='email'>
                    {(field) => (
                        <CustomFormField
                            meta={field.state.meta}
                            labelName='Mail người dùng'
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
                            labelName='Mật khẩu'
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

                <form.Field name='role'>
                    {(field) => (
                        <CustomFormField meta={field.state.meta} labelName='Role' name={field.name}>
                            <Select
                                onValueChange={(value) =>
                                    field.handleChange(value as 'ADMIN' | 'USER')
                                }
                                defaultValue={field.state.value}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Select role' />
                                </SelectTrigger>

                                <SelectContent>
                                    {['ADMIN', 'USER'].map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                disabled={!canSubmit}
                                isSubmitting={isSubmitting}
                            >
                                {initialValues ? 'Update' : 'Create'}
                            </SubmitButton>
                        </div>
                    )
                }}
            </form.Subscribe>
        </form>
    )
}
