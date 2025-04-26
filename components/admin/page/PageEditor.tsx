'use client'
import { useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Save } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useForm } from '@tanstack/react-form'
import { useRouter } from 'next/navigation'
import { CustomFormField, SubmitButton } from '@/components/forms'
import SingleHandleImage from '@/components/forms/Image'
import TiptapEditor, { TiptapEditorRef } from '@/components/tiptap/TiptapEditor'
import { processImageUrls } from '@/lib/process-update-image'
import { Status as StatusCode } from '@reflet/http'
import { toaster } from '@/components/shared/Toast'
import { Textarea } from '@/components/ui/textarea'
import { createPage, updatePage } from '@/actions/page.action'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Pages, PagesSchema } from '@/types/page.type'

interface BulletinEditorProps {
    page?: Pages
    header: string
}

export function PageEditor({ page, header }: BulletinEditorProps) {
    const editorRef = useRef<TiptapEditorRef>(null)
    const router = useRouter()
    const form = useForm({
        defaultValues:
            page ||
            ({
                title: 'Giới thiệu IIT',
                slug: '/gioi-thieu-iit',
                metadataBase: 'https://iit.siu.edu.vn',
                applicationName: 'IIT',
                author: 'IIT',
                keywords: 'IIT',
                metadata: [
                    {
                        language: 'VI',
                        title: 'Giới thiệu IIT',
                        description: 'Giới thiệu IIT',
                    },
                    {
                        language: 'EN',
                        title: 'About IIT',
                        description: 'About IIT',
                    },
                ],
                openGraph: [
                    {
                        language: 'VI',
                        title: 'Giới thiệu IIT',
                        description: 'Giới thiệu IIT',
                        images: '/image.jpg',
                    },
                    {
                        language: 'EN',
                        title: 'About IIT',
                        description: 'About IIT',
                        images: '/image.jpg',
                    },
                ],
                twitter: [
                    {
                        language: 'VI',
                        title: 'Giới thiệu IIT',
                        description: 'Giới thiệu IIT',
                        images: '/image.jpg',
                    },
                    {
                        language: 'EN',
                        title: 'About IIT',
                        description: 'About IIT',
                        images: '/image.jpg',
                    },
                ],
                pageContent: [
                    {
                        language: 'VI',
                        content:
                            '<h1 style="text-align: center"><strong>VIỆN CÔNG NGHỆ &amp; SÁNG TẠO</strong></h1><p>Tên chính thức: VIỆN CÔNG NGHỆ &amp; SÁNG TẠO</p><p>Tên viết tắt: IIT</p><p>Địa chỉ: 18 Tống Hữu Định, Phường Thảo Điền, <a target="_blank" rel="noopener noreferrer nofollow" href="http://Tp.Th">Tp.Th</a>ủ Đức, TP. Hồ Chí Minh</p><p>Cơ quan chủ quản: Trường Đại học Quốc tế Sài Gòn (The Saigon International University - SIU)</p><p>Đặc tính: Viện Công nghệ &amp; Sáng tạo Châu Á kế thừa lịch sử thành lập và quá trình phát triển của Viện Nghiên cứu Châu Á (IAS) thuộc Tập đoàn Giáo dục Quốc Tế Á Châu (GAIE) - mà Trường Đại học Quốc tế Sài Gòn (SIU) và Viện Nghiên cứu Châu Á là thành viên</p><h2><strong>VIỆN CÔNG NGHỆ &amp; SÁNG TẠO</strong></h2><h3><strong>Vai trò</strong></h3><p>Là đơn vị đảm trách kết nối các nguồn lực quan trọng đáp ứng mục tiêu của SIU và GAIE về lĩnh vực đào tạo, nghiên cứu khoa học và thực tiễn trên cơ sở phát huy bản sắc và thế mạnh của văn hoá phương Đông; Là đơn vị đầu mối thúc đẩy và triển khai các đề án đổi mới sáng tạo đáp ứng sự phát triển của SIU và GAIE; Gia tăng cơ hội và nguồn thu tăng trưởng của SIU và GAIE.</p><h3><strong>Chức năng</strong></h3><p style="text-align: justify">Nghiên cứu khoa học về kinh tế, văn hóa, giáo dục, đô thị, môi trường và những vấn đề phát triển xã hội các nước Châu Á.</p><p style="text-align: justify">Nghiên cứu ứng dụng công nghệ đặc biệt sử dụng công nghệ thông tin và trí tuệ nhân tạo để triển khai các hoạt động đổi mới sáng tạo trong mọi lĩnh vực kinh tế, xã hội trên cơ sở phát huy bản sắc và thế mạnh của văn hoá phương Đông.</p><p style="text-align: justify">Dịch vụ khoa học và công nghệ: Thông tin, tư vấn, đào tạo nâng cao trình độ chuyên môn, chuyển giao công nghệ và tổ chức hội nghị - hội thảo khoa học trong các lĩnh vực nêu trên.</p><h3><strong>Nhiệm vụ</strong></h3><p>Căn cứ trên chức năng, Viện thực hiện 4 nhóm nhiệm vụ chính về nghiên cứu, đào tạo, ứng dụng chuyển giao công nghệ tiên tiến và triển khai các dịch vụ khoa học - công nghệ và đổi mới - sáng tạo nhằm thúc đẩy phát triển và đổi mới sáng tạo của nhà trường tại các khoa, ngành đào tạo để tham gia triển khai các hoạt động đổi mới sáng tạo trong mọi lĩnh vực kinh tế, xã hội trên cơ sở phát huy bản sắc và thế mạnh của văn hoá phương Đông. Cụ thể như sau:</p><p>- Trí tuệ nhân tạo, dữ liệu lớn;</p><p>- Khoa học quản lý xã hội và cộng đồng doanh nghiệp;</p><p>- Khoa học giáo dục &amp; chuyển đổi số;</p><p>- Tài nguyên, môi trường và kinh tế biển;</p><p>- Sức khoẻ và y tế.</p><p>- Đào tạo chuyên đề kỹ năng cho sinh viên và học sinh;</p><p>- Giảng dạy các chương trình kỹ năng suốt đời đáp ứng CMCN 4.0 cho giảng viên và sinh viên;</p><p>- Kết nối giữa Viện Sau đại học (SĐH) với Viện IIT qua các chuyên đề hàn lâm thông quan hợp tác quốc tế trên cơ sở phát huy bản sắc và thế mạnh của văn hoá phương Đông;</p><p>- Chuyển giao Công nghệ</p><p>- Đề xuất các giải pháp các hệ thống thông minh: y tế, giáo dục, giao thông dành đô thị, quốc gia thông minh;</p><p>- Nghiên cứu công nghệ mới, sáng tạo để ứng dụng công nghệ Blockchain, Fintech;</p><p>- Chuyển giao hệ thống hoàn chỉnh cho các đối tác trong nước và quốc tế (elearning, đào tạo từ xa) 03 mảng của các dịch vụ Khoa học - Công nghệ được triển khai - Tổ chức các hội thảo khoa học, trường hè;</p><p>- Xuất bản các công trình, ấn phẩm khoa học, tạp chí trong nước và quốc tế;</p><p>- Tổ chức các giải thưởng khoa học; - Hợp đồng nghiên cứu và đào tạo, chuyển giao công nghệ.</p>',
                    },
                    {
                        language: 'EN',
                        content:
                            '<h1 style="text-align: center"><strong>INSTITUTE OF TECHNOLOGY &amp; INNOVATION</strong></h1><p>Official Name: INSTITUTE OF TECHNOLOGY &amp; INNOVATION</p><p>Abbreviation: IIT</p><p>Address: 18 Tong Huu Dinh Street, Thao Dien Ward, Thu Duc City, Ho Chi Minh City</p><p>Parent Institution: The Saigon International University (SIU)</p><p>Characteristics: The Institute of Technology &amp; Innovation in Asia inherits the history and development process of the Institute of Asian Studies (IAS) under the Greater Asia International Education Group (GAIE), of which The Saigon International University (SIU) and the Institute of Asian Studies are members.</p><h2><strong>INSTITUTE OF TECHNOLOGY &amp; INNOVATION</strong></h2><h3><strong>Role</strong></h3><p>As a unit responsible for connecting crucial resources to meet the goals of SIU and GAIE in the fields of education, scientific research, and practical application while leveraging the uniqueness and strengths of Eastern culture. It serves as a focal point for promoting and implementing innovative projects to meet the development of SIU and GAIE, enhancing opportunities and revenue growth for SIU and GAIE.</p><h3><strong>Function</strong></h3><p style="text-align: justify">Conduct scientific research on economics, culture, education, urban development, environment, and social development issues in Asian countries.</p><p style="text-align: justify">Undertake applied research with special technology applications using information technology and artificial intelligence to implement innovative activities in all economic and social sectors based on the uniqueness and strengths of Eastern culture.</p><p style="text-align: justify">Science and technology services: Information, consulting, advanced training, technology transfer, and organizing scientific conferences and workshops in the above-mentioned fields.</p><h3><strong>Duty</strong></h3><p>Based on its function, the Institute carries out four main missions related to research, training, advanced technology transfer, and the provision of scientific and technological services, as well as innovation and creativity to promote the development and innovative transformation of the university in training faculties to participate in innovative activities in all economic and social fields based on the uniqueness and strengths of Eastern culture. Specifically, these missions include:</p><p>- Artificial intelligence and big data;</p><p>- Social and corporate community management sciences;</p><p>- Education and digital transformation sciences;</p><p>- Resources, environment, and the blue economy;</p><p>- Health and healthcare.</p><p>- Providing specialized skills training for students and learners;</p><p>- Offering lifelong skills programs to meet the demands of Industry 4.0 for lecturers and students;</p><p>- Connecting the Postgraduate Institute (PGI) with IIT through interdisciplinary international cooperation on the basis of enhancing the uniqueness and strengths of Eastern culture.</p><p>- Technology transfer;</p><p>- Proposing smart system solutions in healthcare, education, urban transportation, and national smart systems;</p><p>- Researching new technologies and innovations for the application of blockchain and fintech;</p><p>- Transferring comprehensive systems to domestic and international partners (e-learning, remote training) in the 3 areas of scientific and technological services being implemented;</p><p>- Organizing scientific conferences and summer schools;</p><p>- Publishing scientific works and publications in both domestic and international journals;</p><p>- Organizing scientific awards;</p><p>- Research contracts and training, technology transfer agreements.</p>',
                    },
                ],
                isSystem: false,
                isPageContent: true,
            } as Pages),
        validators: {
            onSubmit: PagesSchema,
        },
        onSubmit: async ({ value }) => {
            const faviconParsed = await processImageUrls(
                {
                    favicon: value.favicon as File,
                },
                'page',
                'favicon'
            )
            const shortcutIconParsed = await processImageUrls(
                {
                    shortcutIcon: value.shortcutIcon as File,
                },
                'page',
                'shortcutIcon'
            )
            const appleIconParsed = await processImageUrls(
                {
                    appleIcon: value.appleIcon as File,
                },
                'page',
                'appleIcon'
            )
            value.favicon = faviconParsed.favicon
            value.shortcutIcon = shortcutIconParsed.shortcutIcon
            value.appleIcon = appleIconParsed.appleIcon
            const processedValue = await processImageUrls(value, 'page', 'images')

            if (!page) {
                const result = await createPage(processedValue)
                if (result.statusCode !== StatusCode.Created) {
                    return toaster.error(result.message)
                }
                router.push('/admin/page')
                return toaster.success(result.message)
            } else if (page.id) {
                const result = await updatePage(page?.id, processedValue)
                if (result.statusCode !== StatusCode.Ok) {
                    return toaster.error(result.message)
                }
                return toaster.success(result.message)
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
            className='flex h-[calc(100vh-70px)] w-full flex-col p-2'
        >
            <div className='h-1/12 flex items-center justify-between p-2 shadow-md'>
                <h2 className='text-xl font-bold'>{header}</h2>
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}
                >
                    {([canSubmit, isSubmitting, isDirty]) => {
                        return (
                            <div className='flex gap-2'>
                                <SubmitButton
                                    type='submit'
                                    disabled={!canSubmit || !isDirty}
                                    isSubmitting={isSubmitting}
                                >
                                    <Save className='mr-2 size-4' />
                                    {page ? 'Update' : 'Create'}
                                </SubmitButton>
                            </div>
                        )
                    }}
                </form.Subscribe>
            </div>

            <ScrollArea className='size-full rounded-md py-6'>
                <div className='grid grid-cols-1 gap-4 p-2'>
                    <form.Field name='title'>
                        {(field) => (
                            <CustomFormField
                                meta={field.state.meta}
                                labelName='Title'
                                description={
                                    page?.isSystem ? 'Trang hệ thống không thể chỉnh sửa' : ''
                                }
                                name={field.name}
                            >
                                <Input
                                    id={field.name}
                                    disabled={page?.isSystem}
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
                                description={
                                    page?.isSystem ? 'Trang hệ thống không thể chỉnh sửa' : ''
                                }
                            >
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    disabled={page?.isSystem}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                            </CustomFormField>
                        )}
                    </form.Field>
                    <form.Field name='metadataBase'>
                        {(field) => (
                            <CustomFormField
                                meta={field.state.meta}
                                labelName='MetadataBase'
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
                    <form.Field name='author'>
                        {(field) => (
                            <CustomFormField
                                meta={field.state.meta}
                                labelName='Author'
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
                    <form.Field name='keywords'>
                        {(field) => (
                            <CustomFormField
                                meta={field.state.meta}
                                labelName='Keywords'
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
                    <form.Field name='applicationName'>
                        {(field) => (
                            <CustomFormField
                                meta={field.state.meta}
                                labelName='Application Name'
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
                    <form.Field name='appleIcon'>
                        {(field) => (
                            <CustomFormField
                                meta={field.state.meta}
                                labelName='Apple Icon'
                                name={field.name}
                            >
                                <SingleHandleImage
                                    className='max-w-[200px]'
                                    type='IMAGE'
                                    initialUrl={field.state.value as string}
                                    onChange={(file) => {
                                        field.setValue(file as File)
                                    }}
                                />
                            </CustomFormField>
                        )}
                    </form.Field>
                    <form.Field name='favicon'>
                        {(field) => (
                            <CustomFormField
                                meta={field.state.meta}
                                labelName='Favicon'
                                name={field.name}
                            >
                                <SingleHandleImage
                                    className='max-w-[200px]'
                                    type='IMAGE'
                                    initialUrl={field.state.value as string}
                                    onChange={(file) => {
                                        field.setValue(file as File)
                                    }}
                                />
                            </CustomFormField>
                        )}
                    </form.Field>
                    <form.Field name='shortcutIcon'>
                        {(field) => (
                            <CustomFormField
                                meta={field.state.meta}
                                labelName='Shortcut Icon'
                                name={field.name}
                            >
                                <SingleHandleImage
                                    className='max-w-[200px]'
                                    type='IMAGE'
                                    initialUrl={field.state.value as string}
                                    onChange={(file) => {
                                        field.setValue(file as File)
                                    }}
                                />
                            </CustomFormField>
                        )}
                    </form.Field>
                    <Tabs defaultValue='tab-0' className='flex w-full flex-col gap-2'>
                        <form.Field name='metadata' mode='array'>
                            {(field) => (
                                <div className='flex w-full flex-col items-start gap-2 rounded-md border p-2'>
                                    <Label htmlFor={field.name}>Metadata</Label>
                                    <TabsList>
                                        <div className='flex w-full items-center gap-2'>
                                            {field?.state?.value?.map((item, index) => (
                                                <TabsTrigger
                                                    key={index}
                                                    value={`tab-${index}`}
                                                    className='h-full px-4'
                                                >
                                                    {item.language}
                                                </TabsTrigger>
                                            ))}
                                        </div>
                                    </TabsList>
                                    {field?.state?.value?.map((_, i) => (
                                        <TabsContent
                                            key={i}
                                            value={`tab-${i}`}
                                            defaultValue={`tab-${i}`}
                                            className='relative w-full space-y-2 rounded-md shadow-sm'
                                        >
                                            <form.Field name={`metadata[${i}].title`}>
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
                                                            onChange={(e) =>
                                                                field.handleChange(e.target.value)
                                                            }
                                                        />
                                                    </CustomFormField>
                                                )}
                                            </form.Field>

                                            <form.Field name={`metadata[${i}].description`}>
                                                {(field) => (
                                                    <CustomFormField
                                                        meta={field.state.meta}
                                                        labelName='Description'
                                                        name={field.name}
                                                    >
                                                        <Textarea
                                                            cols={5}
                                                            id={field.name}
                                                            name={field.name}
                                                            value={
                                                                field.state.value === null
                                                                    ? undefined
                                                                    : field.state.value
                                                            }
                                                            onBlur={field.handleBlur}
                                                            onChange={(e) => {
                                                                field.handleChange(e.target.value)
                                                            }}
                                                        />
                                                    </CustomFormField>
                                                )}
                                            </form.Field>
                                        </TabsContent>
                                    ))}
                                </div>
                            )}
                        </form.Field>
                    </Tabs>
                    <Tabs defaultValue='tab-0' className='flex w-full flex-col gap-2'>
                        <form.Field name='openGraph' mode='array'>
                            {(field) => (
                                <div className='flex w-full flex-col items-start gap-2 rounded-md border p-2'>
                                    <Label htmlFor={field.name}>Open Graph</Label>
                                    <TabsList>
                                        <div className='flex w-full items-center gap-2'>
                                            {field?.state?.value?.map((item, index) => (
                                                <TabsTrigger
                                                    key={index}
                                                    value={`tab-${index}`}
                                                    className='h-full px-4'
                                                >
                                                    {item.language}
                                                </TabsTrigger>
                                            ))}
                                        </div>
                                    </TabsList>
                                    {field?.state?.value?.map((_, i) => (
                                        <TabsContent
                                            key={i}
                                            value={`tab-${i}`}
                                            defaultValue={`tab-${i}`}
                                            className='relative w-full space-y-2 rounded-md shadow-sm'
                                        >
                                            <form.Field name={`openGraph[${i}].title`}>
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
                                                            onChange={(e) =>
                                                                field.handleChange(e.target.value)
                                                            }
                                                        />
                                                    </CustomFormField>
                                                )}
                                            </form.Field>

                                            <form.Field name={`openGraph[${i}].description`}>
                                                {(field) => (
                                                    <CustomFormField
                                                        meta={field.state.meta}
                                                        labelName='Description'
                                                        name={field.name}
                                                    >
                                                        <Textarea
                                                            cols={5}
                                                            id={field.name}
                                                            name={field.name}
                                                            value={
                                                                field.state.value === null
                                                                    ? undefined
                                                                    : field.state.value
                                                            }
                                                            onBlur={field.handleBlur}
                                                            onChange={(e) => {
                                                                field.handleChange(e.target.value)
                                                            }}
                                                        />
                                                    </CustomFormField>
                                                )}
                                            </form.Field>

                                            <form.Field name={`openGraph[${i}].images`}>
                                                {(field) => (
                                                    <CustomFormField
                                                        meta={field.state.meta}
                                                        labelName='Image'
                                                        name={field.name}
                                                    >
                                                        <SingleHandleImage
                                                            type='IMAGE'
                                                            initialUrl={field.state.value as string}
                                                            onChange={(file) => {
                                                                field.setValue(file as File)
                                                            }}
                                                        />
                                                    </CustomFormField>
                                                )}
                                            </form.Field>
                                        </TabsContent>
                                    ))}
                                </div>
                            )}
                        </form.Field>
                    </Tabs>
                    <Tabs defaultValue='tab-0' className='flex w-full flex-col gap-2'>
                        <form.Field name='twitter' mode='array'>
                            {(field) => (
                                <div className='flex w-full flex-col items-start gap-2 rounded-md border p-2'>
                                    <Label htmlFor={field.name}>Twitter</Label>
                                    <TabsList>
                                        <div className='flex w-full items-center gap-2'>
                                            {field?.state?.value?.map((item, index) => (
                                                <TabsTrigger
                                                    key={index}
                                                    value={`tab-${index}`}
                                                    className='h-full px-4'
                                                >
                                                    {item.language}
                                                </TabsTrigger>
                                            ))}
                                        </div>
                                    </TabsList>
                                    {field?.state?.value?.map((_, i) => (
                                        <TabsContent
                                            key={i}
                                            value={`tab-${i}`}
                                            defaultValue={`tab-${i}`}
                                            className='relative w-full space-y-2 rounded-md shadow-sm'
                                        >
                                            <form.Field name={`twitter[${i}].title`}>
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
                                                            onChange={(e) =>
                                                                field.handleChange(e.target.value)
                                                            }
                                                        />
                                                    </CustomFormField>
                                                )}
                                            </form.Field>

                                            <form.Field name={`twitter[${i}].description`}>
                                                {(field) => (
                                                    <CustomFormField
                                                        meta={field.state.meta}
                                                        labelName='Description'
                                                        name={field.name}
                                                    >
                                                        <Textarea
                                                            cols={5}
                                                            id={field.name}
                                                            name={field.name}
                                                            value={
                                                                field.state.value === null
                                                                    ? undefined
                                                                    : field.state.value
                                                            }
                                                            onBlur={field.handleBlur}
                                                            onChange={(e) => {
                                                                field.handleChange(e.target.value)
                                                            }}
                                                        />
                                                    </CustomFormField>
                                                )}
                                            </form.Field>

                                            <form.Field name={`twitter[${i}].images`}>
                                                {(field) => (
                                                    <CustomFormField
                                                        meta={field.state.meta}
                                                        labelName='Image'
                                                        name={field.name}
                                                    >
                                                        <SingleHandleImage
                                                            type='IMAGE'
                                                            initialUrl={field.state.value as string}
                                                            onChange={(file) => {
                                                                field.setValue(file as File)
                                                            }}
                                                        />
                                                    </CustomFormField>
                                                )}
                                            </form.Field>
                                        </TabsContent>
                                    ))}
                                </div>
                            )}
                        </form.Field>
                    </Tabs>
                    {(page?.isPageContent || !page) && (
                        <Tabs defaultValue='tab-0' className='flex w-full flex-col gap-2'>
                            <form.Field name='pageContent' mode='array'>
                                {(field) => (
                                    <div className='flex w-full flex-col items-start gap-2 rounded-md border p-2'>
                                        <Label htmlFor={field.name}>Page Content</Label>
                                        <TabsList>
                                            <div className='flex w-full items-center gap-2'>
                                                {field?.state?.value?.map((item, index) => (
                                                    <TabsTrigger
                                                        key={index}
                                                        value={`tab-${index}`}
                                                        className='h-full px-4'
                                                    >
                                                        {item.language}
                                                    </TabsTrigger>
                                                ))}
                                            </div>
                                        </TabsList>
                                        {field?.state?.value?.map((_, i) => (
                                            <TabsContent
                                                key={i}
                                                value={`tab-${i}`}
                                                defaultValue={`tab-${i}`}
                                                className='relative w-full space-y-2 rounded-md shadow-sm'
                                            >
                                                <form.Field name={`pageContent[${i}].content`}>
                                                    {(field) => (
                                                        <CustomFormField
                                                            meta={field.state.meta}
                                                            labelName='Description'
                                                            name={field.name}
                                                        >
                                                            <TiptapEditor
                                                                ref={editorRef}
                                                                ssr={true}
                                                                output='html'
                                                                contentMinHeight={400}
                                                                contentMaxHeight={640}
                                                                onContentChange={(value) => {
                                                                    field.handleChange(
                                                                        value as string
                                                                    )
                                                                }}
                                                                initialContent={field.state.value}
                                                            />
                                                        </CustomFormField>
                                                    )}
                                                </form.Field>
                                            </TabsContent>
                                        ))}
                                    </div>
                                )}
                            </form.Field>
                        </Tabs>
                    )}
                </div>
            </ScrollArea>
        </form>
    )
}
