import DropdownPattern from '@/components/patterns/dropdown-pattern'
import TablePattern from '@/components/patterns/Table'
import { Button } from '@/components/ui/button'
import { UserService } from '@/services/user.service'
import { User } from '@/types/user.type'
import { GripVertical, Plus } from 'lucide-react'
import React, { Fragment } from 'react'
import Link from 'next/link'
import { deleteUser } from '@/actions/user.action'
import { BreadcrumbOption } from '@/components/breadcrumb/Main'

export default async function Page() {
    const results = await UserService.getAllUsers({})

    return (
        <Fragment>
            <BreadcrumbOption
                breadcrumbItems={[{ label: 'User', href: '/admin/user', isActive: true }]}
            >
                <Link href='/admin/user/create'>
                    <Button className='bg-primary text-white'>
                        <Plus className='sr-only size-4 md:not-sr-only' />
                        Create
                    </Button>
                </Link>
            </BreadcrumbOption>

            <TablePattern<User>
                data={results.data.content}
                columns={[
                    {
                        title: 'Email',
                        render: (image) => image.email,
                    },
                    {
                        title: 'Họ tên',
                        render: (image) => <div className='max-w-28 truncate'>{image.name}</div>,
                    },
                    {
                        title: 'Vai trò',
                        render: (image) => <div className='max-w-28 truncate'>{image.role}</div>,
                    },
                    {
                        title: 'Actions',
                        render: (item) => (
                            <DropdownPattern
                                readUrl={`/admin/user/${item?.id}?mode=read`}
                                editUrl={`/admin/user/${item?.id}?mode=edit`}
                                deleteId={item?.id}
                                handleDelete={deleteUser}
                            >
                                <GripVertical />
                            </DropdownPattern>
                        ),
                    },
                ]}
            />
        </Fragment>
    )
}
