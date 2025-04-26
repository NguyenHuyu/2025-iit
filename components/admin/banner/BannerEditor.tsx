'use client'
import { Input } from '@/components/ui/input'
import { Save, Trash2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useForm } from '@tanstack/react-form'
import { useRouter } from 'next/navigation'
import { CustomFormField, SubmitButton } from '@/components/forms'
import SingleHandleImage from '@/components/forms/Image'
import { processImageUrls } from '@/lib/process-update-image'
import { Status as StatusCode } from '@reflet/http'
import { toaster } from '@/components/shared/Toast'
import { Banner, BannerSchema } from '@/types/banner.type'
import { createBanner, deleteBanner, restoreBanner, updateBanner } from '@/actions/banner.action'

interface BannerEditorProps {
    banner?: Banner
    header: string
}

export function BannerEditor({ banner, header }: BannerEditorProps) {
    const router = useRouter()
    const form = useForm({
        defaultValues:
            banner ||
            ({
                name: '',
                size: 1,
                status: 'Published',
            } as Omit<Banner, 'id'>),
        validators: {
            onSubmit: BannerSchema,
        },
        onSubmit: async ({ value }) => {
            const processedValue = await processImageUrls(value, 'banner', 'url')
            if (!banner) {
                const result = await createBanner(processedValue)
                if (result.statusCode !== StatusCode.Created) {
                    return toaster.error(result.message)
                }
                router.push('/admin/banner')
                return toaster.success(result.message)
            } else if (banner.id) {
                const result = await updateBanner(banner?.id, processedValue)
                if (result.statusCode !== StatusCode.Ok) {
                    return toaster.error(result.message)
                }
                return toaster.success(result.message)
            }
        },
    })

    async function handleDelete(id: string) {
        const result = await restoreBanner(id)
        if (result.statusCode !== StatusCode.Ok) {
            return toaster.error(result.message)
        }
        router.push('/admin/banner')
        return toaster.success(result.message)
    }

    async function handleRestore(id: string) {
        const result = await deleteBanner(id)
        if (result.statusCode !== StatusCode.Ok) {
            return toaster.error(result.message)
        }
        return toaster.success(result.message)
    }

    function getFileType(mimeType: string) {
        if (mimeType.startsWith('image/')) return 'IMAGE'
        if (mimeType.startsWith('video/')) return 'VIDEO'
        return 'Unknown'
    }
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}
            className='flex h-[calc(100vh-70px)] w-full flex-col p-2'
        >
            <div className='h-1/12 flex items-center justify-between p-4'>
                <h2 className='text-xl font-bold'>{header}</h2>
                <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                    {([canSubmit, isSubmitting]) => {
                        return (
                            <div className='flex gap-2'>
                                <SubmitButton
                                    type='submit'
                                    disabled={!canSubmit}
                                    isSubmitting={isSubmitting}
                                >
                                    <Save className='mr-2 size-4' />
                                    {banner ? 'Update' : 'Create'}
                                </SubmitButton>
                                {banner && banner.status === 'Achieved' && (
                                    <SubmitButton
                                        type='button'
                                        disabled={!canSubmit}
                                        isSubmitting={isSubmitting}
                                        onClick={() => handleDelete(banner?.id)}
                                        variant='destructive'
                                    >
                                        <Trash2 className='mr-2 size-4' />
                                        Restore
                                    </SubmitButton>
                                )}
                                {banner && banner.status === 'Published' && (
                                    <SubmitButton
                                        type='button'
                                        disabled={!canSubmit}
                                        isSubmitting={isSubmitting}
                                        onClick={() => handleRestore(banner?.id)}
                                        variant='destructive'
                                    >
                                        <Trash2 className='mr-2 size-4' />
                                        Delete
                                    </SubmitButton>
                                )}
                            </div>
                        )
                    }}
                </form.Subscribe>
            </div>

            <ScrollArea className='size-full rounded-md p-3'>
                <div className='grid grid-cols-1 gap-4 p-4'>
                    <form.Field name='name'>
                        {(field) => (
                            <CustomFormField
                                meta={field.state.meta}
                                labelName='Name'
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

                    <form.Field name='url' defaultValue={banner?.url}>
                        {(field) => (
                            <CustomFormField
                                meta={field.state.meta}
                                labelName='Media'
                                name={field.name}
                            >
                                <SingleHandleImage
                                    type={form.getFieldValue('type') as string}
                                    initialUrl={field.state.value as string}
                                    onChange={(file) => {
                                        if (!file) return
                                        const fStatus = getFileType(file.type)

                                        if (fStatus === 'Unknown') return

                                        form.setFieldValue('type', fStatus)
                                        form.setFieldValue('size', file.size)

                                        field.setValue(file as File)
                                    }}
                                />
                            </CustomFormField>
                        )}
                    </form.Field>
                </div>
                <Separator className='my-2' />
            </ScrollArea>
        </form>
    )
}
