import React from 'react'
import { Banknote, GalleryVerticalEnd, NewspaperIcon, PackageCheck, User } from 'lucide-react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar'

import { NavUser } from '@/components/sidebar/nav-user'
import { NavProjects } from '@/components/sidebar/nav-project'

const data = {
    user: {
        name: 'admin',
        email: 'admin@gmail.com',
    },
    teams: [
        {
            name: 'Acme Inc',
            logo: <GalleryVerticalEnd />,
            plan: 'Enterprise',
        },
    ],

    projects: [
        { name: 'User', url: '/admin/user', icon: <User /> },
        { name: 'Bulletin', url: '/admin/bulletin', icon: <NewspaperIcon /> },
        { name: 'Banner', url: '/admin/banner', icon: <Banknote /> },
        { name: 'Pages', url: '/admin/page', icon: <PackageCheck /> },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible='icon' {...props}>
            <SidebarHeader>
                <div className='flex items-center justify-center space-x-4'>
                    <span className='text-xl font-bold'>
                        <span className='text-primary'>IIT</span>{' '}
                        <span className='group-data-[collapsible=icon]:hidden'>Admin</span>
                    </span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                {/* <NavMain items={data.navMain} /> */}
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
