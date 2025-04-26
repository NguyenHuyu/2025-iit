'use server'
import fs, { promises as fsPromises } from 'fs'
import path from 'path'
import { Readable } from 'stream'
import { fileTypeFromBuffer } from 'file-type'
import { Status } from '@reflet/http'

const MAX_SIZE_IMAGE = 100 * 1024 * 1024 // 100 MB
const MAX_SIZE_VIDEO = 1000 * 1024 * 1024 // 1 GB

type FileResult = {
    statusCode: Status
    message: string
    data: {
        type: string
        imageUrl: string
    } | null
}

async function getUniqueFilePath(uploadDir: string, fileName: string) {
    let counter = 1
    const ext = path.extname(fileName)
    const baseName = path.basename(fileName, ext)
    let filePath = path.join(uploadDir, fileName)

    while (await fileExists(filePath)) {
        filePath = path.join(uploadDir, `${baseName}_${counter}${ext}`)
        counter++
    }

    return filePath
}

async function fileExists(filePath: string) {
    try {
        await fsPromises.stat(filePath)
        return true
    } catch {
        return false
    }
}

function sanitizeFilePath(folder?: string) {
    if (!folder) return 'uploads'
    if (!/^[a-zA-Z0-9-_]+$/.test(folder)) throw new Error('Invalid folder name')
    return path.join('uploads', folder)
}

async function getValidUploadDir(folder?: string) {
    const sanitizedPath = sanitizeFilePath(folder)

    if (folder && !(await fileExists(sanitizedPath))) {
        return null // ✅ Do not create the folder if it doesn't exist
    }

    return sanitizedPath
}

async function convertToNodeReadable(stream: ReadableStream<Uint8Array>) {
    const reader = stream.getReader()
    return new Readable({
        async read() {
            const { done, value } = await reader.read()
            if (done) {
                this.push(null)
            } else {
                if (!this.push(Buffer.from(value))) {
                    await new Promise((resolve) => this.once('drain', resolve))
                }
            }
        },
    })
}

async function saveFileWithStream(file: File, filePath: string) {
    const nodeReadableStream = await convertToNodeReadable(file.stream())
    const writeStream = fs.createWriteStream(filePath)

    return new Promise<void>((resolve, reject) => {
        nodeReadableStream.pipe(writeStream)
        writeStream.on('finish', resolve)
        writeStream.on('error', reject)
    })
}

async function validateFile(file: File) {
    const reader = file.stream().getReader()
    const { value } = await reader.read()
    if (!value) throw new Error('Empty file detected.')

    const type = await fileTypeFromBuffer(Buffer.from(value))
    const mimeType = type?.mime

    if (!mimeType || (!mimeType.startsWith('image/') && !mimeType.startsWith('video/'))) {
        throw new Error('File type is not supported.')
    }

    if (mimeType === 'image/svg+xml') throw new Error('SVG files are not allowed.')
    if (mimeType.startsWith('image/') && file.size > MAX_SIZE_IMAGE)
        throw new Error('Image file is too large.')
    if (mimeType.startsWith('video/') && file.size > MAX_SIZE_VIDEO)
        throw new Error('Video file is too large.')

    return mimeType
}

export async function uploadFile(file: File | null, folder?: string): Promise<FileResult> {
    if (!file)
        return {
            statusCode: Status.BadRequest,
            message: 'No file uploaded',
            data: null,
        }

    try {
        const validateFileResult = await validateFile(file)
        const uploadDir = await getValidUploadDir(folder)

        if (!uploadDir) {
            return {
                statusCode: Status.BadRequest,
                message: 'Invalid or non-existent folder',
                data: null,
            }
        }

        const safeFileName = file.name.replace(/[^a-zA-Z0-9.-_]/g, '_')
        const uniqueFilePath = await getUniqueFilePath(uploadDir, safeFileName)

        await saveFileWithStream(file, uniqueFilePath)

        return {
            statusCode: Status.Ok,
            message: 'File uploaded successfully!',
            data: {
                type: validateFileResult,
                imageUrl: `/media${folder ? `/${folder}` : ''}/${path.basename(uniqueFilePath)}`,
            },
        }
    } catch (error: unknown) {
        return {
            statusCode: Status.InternalServerError,
            message: error instanceof Error ? error.message : 'An error occurred',
            data: null,
        }
    }
}
