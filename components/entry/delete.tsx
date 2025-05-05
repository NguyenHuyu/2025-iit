'use client'
import { Fragment, Suspense, useState } from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { useContextHooks } from '@/components/entry'
import { Status } from '@reflet/http'
import { toast } from 'sonner'

export function DeleteAction() {
    const { isDeleteDialogOpen, setIsDeleteDialogOpen, selectedId, operations } = useContextHooks()

    const [isDeleting, setIsDeleting] = useState(false)

    if (!selectedId) return null

    async function handleDelete() {
        setIsDeleting(true)
        try {
            if (!selectedId) return
            if (!operations.delete) throw new Error('Delete operation not defined')
            const result = await operations.delete(selectedId)
            if (result.statusCode !== Status.Ok) {
                return toast.error(result.message)
            }
            setIsDeleteDialogOpen(false)
            return toast.success(result.message)
        } catch (error) {
            console.error('Error deleting item:', error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <Suspense
                    fallback={
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <div className='flex justify-center py-2'>
                                <div className='size-6 animate-spin rounded-full border-b-2 border-primary'></div>
                            </div>
                        </AlertDialogHeader>
                    }
                >
                    <DeleteConfirmationContent
                        onConfirm={handleDelete}
                        onCancel={() => setIsDeleteDialogOpen(false)}
                        isDeleting={isDeleting}
                    />
                </Suspense>
            </AlertDialogContent>
        </AlertDialog>
    )
}

// function DeleteConfirmationContent<TDetail extends BaseEntity>({
function DeleteConfirmationContent({
    // itemPromise,
    onConfirm,
    onCancel,
    isDeleting,
}: {
    // itemPromise: Promise<TDetail | null>
    onConfirm: () => void
    onCancel: () => void
    isDeleting: boolean
}) {
    return (
        <Fragment>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>Do you really want to delete</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel
                    className='hover:cursor-pointer'
                    onClick={onCancel}
                    disabled={isDeleting}
                >
                    Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                    onClick={onConfirm}
                    disabled={isDeleting}
                    className='bg-destructive hover:cursor-pointer hover:bg-destructive/90'
                >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
            </AlertDialogFooter>
        </Fragment>
    )
}
