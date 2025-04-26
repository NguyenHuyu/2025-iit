'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Ban, CheckCheck, Trash } from 'lucide-react'
import { Status } from '@reflet/http'
import { toaster } from '@/components/shared/Toast'

export default function Confirm({
    handleDelete,
    deleteId,
    setOpen,
}: {
    handleDelete: (id: number | string) => Promise<any>
    deleteId: number | string
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const [showPopup, setShowPopup] = useState(false)

    const submitAction = useCallback(
        async (id: number | string) => {
            const result = await handleDelete(id)
            toaster.success(result)
            if (result.statusCode === Status.Ok) {
                setShowPopup(false)
                setOpen(false)
            }
        },
        [handleDelete, setOpen]
    )

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && showPopup && deleteId) {
                submitAction(deleteId)
            }
        }

        document.addEventListener('keydown', handleKeyPress)

        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [deleteId, submitAction, showPopup])

    return (
        <div className='relative flex w-full justify-start'>
            <Button
                variant='ghost'
                onClick={() => setShowPopup(true)}
                disabled={showPopup}
                className='h-7 w-full px-0 text-destructive hover:bg-destructive hover:text-white'
            >
                <Trash className='size-4' />
                Delete ⌘⌫
            </Button>

            {showPopup && (
                <div className='absolute bottom-1 left-0 z-50 flex w-full items-center justify-center bg-transparent transition-all duration-300'>
                    <div className='bg-white shadow-lg'>
                        <div className='flex justify-end space-x-2'>
                            <Button
                                onClick={() => setShowPopup(false)}
                                className='h-6 rounded bg-primary px-4 py-2 hover:bg-muted-foreground focus:outline-none'
                            >
                                <Ban />
                            </Button>
                            <Button
                                onClick={() => submitAction(deleteId)}
                                className='h-6 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none'
                            >
                                <CheckCheck />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
