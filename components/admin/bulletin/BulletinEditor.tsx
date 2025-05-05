'use client'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Save, Trash2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useForm } from '@tanstack/react-form'
import { useRouter } from 'next/navigation'
import { Bulletin, BulletinSchema, Category } from '@/types/bulletin.type'
import { CustomFormField, SubmitButton } from '@/components/forms'
import { generateSlug } from '@/utils/slugify'
import SingleHandleImage from '@/components/forms/Image'
import { Switch } from '@/components/ui/switch'
import { processImageUrls } from '@/lib/process-update-image'
import {
    createBulletin,
    deleteBulletin,
    restoreBulletin,
    updateBulletin,
} from '@/actions/bulletin.action'
import { Status as StatusCode } from '@reflet/http'
import { toaster } from '@/components/shared/Toast'
import { Textarea } from '@/components/ui/textarea'
import { Language } from '@prisma/client'
import { RichTextEditor } from '@/components/tiptap-editor/rich-text-editor'

interface BulletinEditorProps {
    bulletin?: Bulletin
    header: string
}

export function BulletinEditor({ bulletin, header }: BulletinEditorProps) {
    const router = useRouter()
    const form = useForm({
        defaultValues:
            bulletin ||
            ({
                title: '',
                slug: '',
                description: '',
                thumbnails: '/image.jpg',
                status: 'Published',
                isDraft: false,
                isImportant: true,
                body: '',
            } as Bulletin),
        validators: {
            onSubmit: BulletinSchema,
        },
        onSubmit: async ({ value }) => {
            const processedValue = await processImageUrls(value, 'bulletin', 'thumbnails')
            if (!bulletin) {
                const result = await createBulletin(processedValue)
                if (result.statusCode !== StatusCode.Created) {
                    return toaster.error(result.message)
                }
                // router.push('/admin/bulletin')
                return toaster.success(result.message)
            } else if (bulletin.id) {
                const result = await updateBulletin(bulletin?.id, processedValue)
                if (result.statusCode !== StatusCode.Ok) {
                    return toaster.error(result.message)
                }
                return toaster.success(result.message)
            }
        },
    })

    async function handleDelete(id?: string) {
        if (!id) return
        const result = await restoreBulletin(id)
        if (result.statusCode !== StatusCode.Ok) {
            return toaster.error(result.message)
        }
        router.push('/admin/bulletin')
        return toaster.success(result.message)
    }

    async function handleRestore(id?: string) {
        if (!id) return
        const result = await deleteBulletin(id)
        if (result.statusCode !== StatusCode.Ok) {
            return toaster.error(result.message)
        }
        return toaster.success(result.message)
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
                                    {bulletin ? 'Update' : 'Create'}
                                </SubmitButton>
                                {bulletin && bulletin.status === 'Achieved' && (
                                    <SubmitButton
                                        type='button'
                                        disabled={!canSubmit}
                                        isSubmitting={isSubmitting}
                                        onClick={() => handleDelete(bulletin?.id)}
                                        variant='destructive'
                                    >
                                        <Trash2 className='mr-2 size-4' />
                                        Restore
                                    </SubmitButton>
                                )}
                                {bulletin && bulletin.status === 'Published' && (
                                    <SubmitButton
                                        type='button'
                                        disabled={!canSubmit}
                                        isSubmitting={isSubmitting}
                                        onClick={() => handleRestore(bulletin?.id)}
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
                    <form.Field
                        name='title'
                        listeners={{
                            onChange: ({ value }) => {
                                form.setFieldValue('slug', generateSlug(value))
                            },
                        }}
                    >
                        {(field) => (
                            <CustomFormField
                                meta={field.state.meta}
                                labelName='Title'
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

                    <form.Field name='slug'>
                        {(field) => (
                            <CustomFormField
                                meta={field.state.meta}
                                labelName='Slug'
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

                    <div className='grid md:grid-cols-2'>
                        <form.Field name='isImportant'>
                            {(field) => (
                                <CustomFormField
                                    meta={field.state.meta}
                                    labelName='Important'
                                    name={field.name}
                                >
                                    <Switch
                                        className='data-[state=checked]:bg-yellow-600'
                                        checked={field.state.value}
                                        onCheckedChange={field.handleChange}
                                    />
                                </CustomFormField>
                            )}
                        </form.Field>
                        <form.Field name='isDraft'>
                            {(field) => (
                                <CustomFormField
                                    meta={field.state.meta}
                                    labelName='Draft'
                                    name={field.name}
                                >
                                    <Switch
                                        className='data-[state=checked]:bg-red-600'
                                        checked={field.state.value}
                                        onCheckedChange={field.handleChange}
                                    />
                                </CustomFormField>
                            )}
                        </form.Field>
                    </div>

                    <form.Field name='thumbnails' defaultValue={bulletin?.thumbnails}>
                        {(field) => (
                            <CustomFormField
                                meta={field.state.meta}
                                labelName='Thumbnail'
                                name={field.name}
                            >
                                <SingleHandleImage
                                    type='IMAGE'
                                    initialUrl={field.state.value as string}
                                    onChange={(file) => {
                                        console.log('FIELD', File)
                                        field.setValue(file as File)
                                    }}
                                />
                            </CustomFormField>
                        )}
                    </form.Field>

                    <form.Field name='description'>
                        {(field) => (
                            <CustomFormField
                                meta={field.state.meta}
                                labelName='Description'
                                name={field.name}
                            >
                                <Textarea
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                            </CustomFormField>
                        )}
                    </form.Field>

                    <form.Field name='category'>
                        {(field) => (
                            <CustomFormField
                                meta={field.state.meta}
                                labelName='Category'
                                name={field.name}
                            >
                                <Select
                                    onValueChange={(value) => field.handleChange(value as Category)}
                                    defaultValue={field.state.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select category' />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {[
                                            'EVENTS',
                                            'BUSINESS',
                                            'ANNOUNCEMENTS',
                                            'PUBLICATIONS',
                                            'COURSES',
                                            'SEMINARS',
                                            'NEWS',
                                            'BULLETINS',
                                            'PRODUCTS',
                                            'PROJECTS',
                                            'OTHERS',
                                            'ACADEMICS',
                                        ].map((item) => (
                                            <SelectItem key={item} value={item}>
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CustomFormField>
                        )}
                    </form.Field>
                    <form.Field name='language'>
                        {(field) => (
                            <CustomFormField
                                meta={field.state.meta}
                                labelName='Category'
                                name={field.name}
                            >
                                <Select
                                    onValueChange={(value) => field.handleChange(value as Language)}
                                    defaultValue={field.state.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select language' />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {['VI', 'EN'].map((item) => (
                                            <SelectItem key={item} value={item}>
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CustomFormField>
                        )}
                    </form.Field>

                    <form.Field name='body'>
                        {(field) => (
                            <CustomFormField
                                meta={field.state.meta}
                                labelName='Description'
                                name={field.name}
                            >
                                {/* <TiptapEditor
                                    ref={editorRef}
                                    ssr={true}
                                    output='html'
                                    placeholder={{
                                        paragraph: 'Type your content here...',
                                        imageCaption: 'Type caption for image (optional)',
                                    }}
                                    contentMinHeight={256}
                                    contentMaxHeight={640}
                                    onContentChange={(value) => {
                                        field.handleChange(value as string)
                                    }}
                                    initialContent={field.state.value}
                                /> */}
                                <RichTextEditor
                                    value={field.state.value}
                                    onChangeValue={(html) => field.handleChange(html as string)}
                                    className='my-custom-class'
                                    enableAutoSave={false}
                                    storageKey='my-editor-content'
                                    showToolbar={true}
                                    showFloatingToolbar={true}
                                    showFloatingMenu={true}
                                    readOnly={false}
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
