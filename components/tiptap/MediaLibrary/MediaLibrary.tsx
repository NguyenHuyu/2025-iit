import React, { useEffect, useRef, useState } from 'react'
import MediaGallery from './MediaGallery'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface MediaLibraryProps {
    onInsert?: (image: ImageData) => void
    onClose?: () => void
}

interface ImageData {
    id?: string
    url: string
    size: number
    isDirectory: boolean
    lastModified: string
    width?: number
    height?: number
    format?: string
    display_name?: string
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ onInsert, onClose }) => {
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [images, setImages] = useState<ImageData[]>([])
    const [previews, setPreviews] = useState<ImageData[]>([])
    const [selected, setSelected] = useState<ImageData | null>(null)
    const fileInput = useRef<HTMLInputElement>(null)

    const handleUploadClick = () => {
        const confirmUpload = window.confirm(
            'Please avoid uploading too many images unnecessarily to save storage space. Also, ensure your images comply with copyright rules. Do you wish to continue?'
        )

        if (confirmUpload) {
            fileInput.current?.click()
        }
    }

    const loadImage = (file: File): Promise<ImageData> => {
        return new Promise((resolve) => {
            const url = URL.createObjectURL(file)
            const image = new Image()
            image.onload = () => {
                resolve({
                    url,
                    width: image.width,
                    height: image.height,
                    format: file.type.split('/')[1],
                    display_name: file.name.split(/\.\w+$/)[0],
                    size: file.size,
                    isDirectory: false,
                    lastModified: new Date(file.lastModified).toISOString(),
                })
            }
            console.log('image', image)
            image.src = url
        })
    }

    const uploadImage = async (file: File) => {
        if (!file.type.startsWith('image/')) return

        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'images')

        try {
            const response = await fetch('/media', {
                method: 'POST',
                body: formData,
            })
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Upload error:', error)
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploading(true)

        const previewPromises = Array.from(files).map(loadImage)
        const loadedPreviews = await Promise.all(previewPromises)
        setPreviews(loadedPreviews)

        const uploadPromises = Array.from(files).map(uploadImage)
        const uploadImages = await Promise.all(uploadPromises)

        loadedPreviews.forEach((preview) => URL.revokeObjectURL(preview.url))
        setPreviews([])
        console.log('uploadImages', uploadImages)
        setImages((prev) => [...uploadImages, ...prev])
        setUploading(false)
    }

    const handleFinish = () => selected !== null && onInsert?.(selected)

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true)
                const response = await fetch('/media/images')
                const data = await response.json()
                setImages(data)
            } catch (error) {
                console.error('Error fetching images:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchImages()
    }, [])

    return (
        <div className='m-auto flex h-[95vh] w-[90vw] flex-col bg-white'>
            <header className='flex items-center justify-between border p-3'>
                <h2 className='font-bold'>Assets</h2>
                <Button disabled={loading || uploading} onClick={handleUploadClick}>
                    Upload from device
                </Button>
            </header>

            <div className='flex h-full flex-1 overflow-hidden p-2'>
                {loading ? (
                    <div
                        className='m-auto size-[60px] animate-spin rounded-full border'
                        aria-label='Loading images'
                    />
                ) : (
                    <MediaGallery
                        data={[...previews, ...images]}
                        onSelect={setSelected}
                        selected={selected}
                    />
                )}
            </div>

            <footer className='flex items-center justify-end gap-1 border p-2'>
                <Button variant='outline' onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    className={cn(selected && 'hover:bg-red-500')}
                    disabled={!selected || loading || uploading}
                    onClick={handleFinish}
                >
                    Insert
                </Button>
            </footer>

            <input
                style={{ display: 'none' }}
                type='file'
                multiple
                accept='image/*'
                ref={fileInput}
                onChange={handleFileChange}
            />
        </div>
    )
}

export default MediaLibrary
