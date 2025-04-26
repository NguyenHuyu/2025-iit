import React from 'react'
import { getDictionary } from '@/i18n/dictionaries'
import { InterfacePage } from '@/types/route.type'
import { SheetLeft } from './SheetLeft'
import { Logo } from '../Logo'
import NavMenu from './Nav-Menu'
import SwitchLanguage from './SwitchLanguage'

export async function Navbar({ params }: { params: InterfacePage['params'] }) {
    const { header, navigation } = await getDictionary((await params).locale)

    const navbar = [
        {
            href: '',
            title: header.home,
        },
        {
            href: '#',
            title: header.about,
            children: [
                {
                    title: header.about_us,
                    href: 'gioi-thieu-iit',
                },
                {
                    title: header.vision_mission,
                    href: 'tam-nhin-su-menh',
                },
                {
                    title: header.organization,
                    href: 'co-cau-to-chuc',
                },
            ],
        },
        {
            href: '#',
            title: header.education,
            children: [
                {
                    title: header.education_program,
                    href: 'chuong-trinh-dao-tao',
                },
                {
                    title: header.course,
                    href: 'khoa-hoc',
                },
            ],
        },
        {
            href: '#',
            title: header.research,
            children: [
                {
                    title: header.seminar,
                    href: 'seminar-workshops',
                },
                {
                    title: header.program_product,
                    href: 'chuong-trinh-du-an',
                },
                {
                    title: header.product,
                    href: 'san-pham-nghien-cuu-chuyen-giao-cong-nghe',
                },
                {
                    title: header.publication,
                    href: 'cong-bo-khoa-hoc',
                },
                {
                    title: header.others,
                    href: 'sach-giao-trinh-bai-giang',
                },
            ],
        },
        {
            href: '#',
            title: header.cooperate,
            children: [
                {
                    title: header.academic_partners,
                    href: 'doi-tac-hoc-thuat',
                },
                {
                    title: header.business_partners,
                    href: 'doi-tac-doanh-nghiep',
                },
            ],
        },
        {
            href: 'lien-he',
            title: header.contact,
        },
    ]

    const navbarMobileData = navbar.flatMap((item) => {
        if (item.children) {
            return item.children
        }
        return item
    })

    return (
        <nav className='sticky top-0 z-50 h-auto w-full bg-[#7b2022]/90 pb-1'>
            <div className='mx-auto flex h-full items-center justify-between bg-[#871817] px-1 shadow-md md:max-w-6xl md:gap-2 lg:max-w-full'>
                <div className='flex items-center'>
                    <SheetLeft dictionary={navigation} items={navbarMobileData} />

                    <Logo />
                </div>

                <div className='hidden w-full items-center justify-center text-sm font-medium md:flex'>
                    <NavMenu data={navbar} />
                </div>

                <SwitchLanguage />
            </div>
        </nav>
    )
}
