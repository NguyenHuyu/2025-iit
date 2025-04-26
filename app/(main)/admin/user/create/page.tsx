import React, { Fragment } from 'react'
import FormUser from '../_components/FormUser'
import { BreadcrumbHeader } from '@/components/breadcrumb'

export default function Page() {
    return (
        <Fragment>
            <BreadcrumbHeader
                breadcrumbItems={[
                    { label: 'User', href: '/admin/user' },
                    { label: 'Create', href: '/admin/user/create', isActive: true },
                ]}
            />

            <FormUser />
        </Fragment>
    )
}
