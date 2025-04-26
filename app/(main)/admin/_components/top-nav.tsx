import { Button } from '@/components/ui/button'
import { Settings, User } from 'lucide-react'

export default function TopNav() {
    return (
        <header className='sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4'>
            <div className='flex items-center justify-between p-4'>
                <div className='flex items-center space-x-2'>
                    <Button variant='ghost' size='icon'>
                        <Settings className='size-4' />
                    </Button>
                    <Button variant='ghost' size='icon'>
                        <User className='size-4' />
                    </Button>
                </div>
            </div>
        </header>
    )
}
