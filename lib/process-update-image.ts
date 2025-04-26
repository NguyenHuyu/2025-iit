import { uploadFile } from '@/lib/upload'
import { Status } from '@reflet/http'

type RecursiveObject = Record<string, any> & {
    [key: string]: any
}

export async function processImageUrls<T extends RecursiveObject>(
    obj: T,
    metadata?: string,
    imagesKey: string = 'images'
): Promise<T> {
    const entries = Object.entries(obj)
    for (const [key, value] of entries) {
        if (key === imagesKey && Array.isArray(value)) {
            // Process `imagesKey` key
            const processedUrls = await Promise.all(
                value.map(async (item) => {
                    if (item instanceof File) {
                        const result = await uploadFile(item, metadata)
                        if (result.statusCode === Status.Ok && result.data?.imageUrl) {
                            return result.data?.imageUrl // Replace File with uploaded URL
                        }
                        return null // Skip failed uploads
                    }
                    return item // Keep strings (URLs) as they are
                })
            )
            // Update the `imagesKey` property with processed URLs
            return {
                ...obj,
                [imagesKey]: processedUrls.filter((url) => url !== null && url !== '') as string[],
            }
        } else if (key === imagesKey && value instanceof File) {
            const result = await uploadFile(value, metadata)
            if (result.statusCode === Status.Ok && result.data?.imageUrl) {
                return {
                    ...obj,
                    [imagesKey]: result.data?.imageUrl,
                }
            }
        } else if (Array.isArray(value)) {
            // Process arrays of objects
            ;(obj as Record<string, any>)[key] = await Promise.all(
                value.map(async (item) => {
                    if (typeof item === 'object' && item !== null) {
                        return await processImageUrls(item, metadata, imagesKey) // Recurse into objects
                    }
                    return item // Keep non-object values as they are
                })
            )
        } else if (typeof value === 'object' && value !== null) {
            // Process nested objects
            ;(obj as Record<string, any>)[key] = await processImageUrls(value, metadata, imagesKey) // Recurse into objects
        }
    }

    return obj
}
