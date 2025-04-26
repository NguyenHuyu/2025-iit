import { UserService } from '@/services/user.service'
import type { InterfaceModePage } from '@/types/route.type'
import { notFound } from 'next/navigation'
import RenderDisplayInformation from '../../_components/RenderInformation'
import FormUser from '../_components/FormUser'
import { User } from '@/types/user.type'
import { BreadcrumbHeader } from '@/components/breadcrumb'

export default async function Page({ params, searchParams }: InterfaceModePage) {
    const promiseParams = await params
    const promiseSearchParams = await searchParams

    const result = await UserService.getUserById(promiseParams.id)

    const mode = promiseSearchParams.mode

    if (!result.data) {
        return notFound()
    }

    switch (mode) {
        case 'read':
            return (
                <>
                    <BreadcrumbHeader
                        breadcrumbItems={[
                            {
                                href: '/admin/user',
                                label: 'User',
                            },
                            {
                                label: 'Read user',
                                href: `/admin/user/${promiseParams.id}?mode=read`,
                                isActive: true,
                            },
                        ]}
                    />
                    <RenderDisplayInformation
                        data={result.data}
                        displayConfig={{
                            name: 'Tên người dùng',
                            email: 'Email người dùng',
                            role: 'Vai trò',
                            createdAt: 'Ngày tạo',
                            updatedAt: 'Ngày cập',
                        }}
                    />
                </>
            )
        case 'edit':
            return (
                <>
                    <BreadcrumbHeader
                        breadcrumbItems={[
                            {
                                href: '/admin/user',
                                label: 'User',
                            },
                            {
                                label: 'Edit user',
                                href: `/admin/user/${promiseParams.id}?mode=edit`,
                            },
                        ]}
                    />
                    <FormUser initialValues={result.data as User} />
                </>
            )

        default:
            return notFound()
    }
}
