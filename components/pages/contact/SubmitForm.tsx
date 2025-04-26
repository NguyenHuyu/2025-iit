'use client'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface SubmitFormProps {
    name: string
    email: string
    phone: string
    body: string
    submit: string
}

export default function SubmitForm({ body, email, name, phone, submit }: SubmitFormProps) {
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = event.currentTarget
        const formData = new FormData(form)
        // const response = await createContact(formData)
        // if (response.status === Status.Created) {
        //     form.reset()
        //     toast.success(response.message, {
        //         duration: 2000,
        //         position: 'top-right',
        //     })
        // } else {
        //     toast.error(response.message, {
        //         duration: 2000,
        //         position: 'top-right',
        //     })
        // }
    }

    return (
        <Card className='relative mx-auto rounded-lg bg-white p-4 shadow-lg'>
            <CardContent>
                <form onSubmit={handleSubmit} className='grid gap-4'>
                    <div className='grid gap-2'>
                        <Label htmlFor='name'>{name}</Label>
                        <Input id='name' type='name' name='name' required />
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='email'>{email}</Label>
                        <Input id='email' type='email' name='email' required />
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='phone'>{phone}</Label>
                        <Input id='phone' type='phone' name='phone' required />
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='body'>{body}</Label>
                        <Textarea id='body' rows={6} name='body' placeholder={body} required />
                    </div>

                    <Button type='submit' className='w-full'>
                        {submit}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
