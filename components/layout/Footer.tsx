import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { InterfacePage } from '@/types/route.type'
import { getDictionary } from '@/i18n/dictionaries'
import { Facebook, Youtube, Instagram, Linkedin, Phone, Mail } from 'lucide-react'

export default async function Footer({ params }: { params: InterfacePage['params'] }) {
    const { locale } = await params
    const { footer } = await getDictionary(locale)

    return (
        <footer className='bg-[#0033a0] text-sm text-white'>
            <div className='mx-auto grid max-w-full grid-cols-1 justify-between gap-4 py-8 md:max-w-6xl md:gap-2 lg:max-w-full lg:grid-cols-2'>
                {/* Left: Logo + Description */}
                <div className='space-y-4'>
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <Image src='/assets/logosiu.png' alt='SIU Logo' width={100} height={70} />
                        <h2 className='text-xl lg:text-2xl xl:text-3xl'>{footer.title}</h2>
                    </div>

                    {/* Social media */}
                    <div className='mt-4 flex justify-center gap-4'>
                        <Link href='https://facebook.com/iit.siu.edu.vn' target='_blank'>
                            <Facebook className='size-5 hover:text-yellow-400' />
                        </Link>
                        <Link
                            href='https://youtube.com/channel/UCbN4qbS_htx24I4I97W1mUQ'
                            target='_blank'
                        >
                            <Youtube className='size-5 hover:text-yellow-400' />
                        </Link>
                        <Link href='https://siu.edu.vn' target='_blank'>
                            <Instagram className='size-5 hover:text-yellow-400' />
                        </Link>
                        <Link href='https://linkedin.com/in/iit-siu-75a99b273' target='_blank'>
                            <Linkedin className='size-5 hover:text-yellow-400' />
                        </Link>
                    </div>

                    <div className='mt-6 flex flex-wrap justify-center gap-4 text-sm text-yellow-400 md:flex-row'>
                        <Link href='#'>ĐIỀU KHOẢN SỬ DỤNG</Link>
                        <Link href='#'>CHÍNH SÁCH BẢO MẬT</Link>
                        <Link href='#'>TUYỂN DỤNG</Link>
                        <Link href='#'>LIÊN HỆ</Link>
                    </div>
                </div>

                {/* Right: Address and Info */}
                <div className='mx-auto grid grid-cols-1 items-center justify-center gap-6 p-2 text-sm md:grid-cols-2'>
                    <ul className='space-y-1'>
                        <li className='text-base md:text-lg'>
                            <strong>Lewis Hall:</strong> 8C Tống Hữu Định, Thảo Điền, TP. Thủ Đức,
                            TPHCM
                        </li>
                        <li className='text-base md:text-lg'>
                            <strong>Eliot Hall:</strong> 9 Tống Hữu Định, Thảo Điền, TP. Thủ Đức
                        </li>
                        <li className='text-base md:text-lg'>
                            <strong>McCarthy Hall:</strong> 10 Tống Hữu Định, Thảo Điền, TP. Thủ Đức
                        </li>
                        <li className='text-base md:text-lg'>
                            <strong>Fleming Hall:</strong> 16 Tống Hữu Định, Thảo Điền, TP. Thủ Đức
                        </li>
                        <li className='text-base md:text-lg'>
                            <strong>Đông A Hall:</strong> 18 Tống Hữu Định, Thảo Điền, TP. Thủ Đức
                        </li>
                    </ul>

                    <div className='space-y-4'>
                        <div className='flex items-center gap-2'>
                            <Phone className='size-5 text-yellow-400' />
                            <p className='text-base md:text-lg'>+84 28.36203932</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Mail className='size-5 text-yellow-400' />
                            <p className='text-base md:text-lg'>iit@siu.edu.vn</p>
                        </div>
                        <div className='mt-6 text-xs text-gray-300'>
                            © 2023 Trường Đại học Tư thục Quốc tế Sài Gòn
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
