import { ExternalToast, toast } from 'sonner'

export const toaster = {
    success(message: string, props?: ExternalToast) {
        return toast.success(message, props)
    },
    error(message: string, props?: ExternalToast) {
        return toast.error(message, props)
    },
    info(message: string, props?: ExternalToast) {
        return toast.info(message, props)
    },
}
