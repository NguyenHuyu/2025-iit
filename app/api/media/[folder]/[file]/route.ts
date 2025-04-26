import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { Status } from '@reflet/http'
import { fileTypeFromBuffer } from 'file-type'
import mime from 'mime'

export const dynamic = 'force-static'

const UPLOADS_DIR = path.join(process.cwd(), 'uploads')

function isValidName(name: string) {
    return /^[a-zA-Z0-9._-]+$/.test(name)
}

export async function GET(
    request: Request,
    {
        params,
    }: {
        params: Promise<{ folder: string; file: string }>
    }
) {
    try {
        const { folder, file } = await params

        // Validate folder and file name
        if (!isValidName(folder) || !isValidName(file)) {
            return NextResponse.json(
                { error: 'Invalid file or folder name' },
                { status: Status.BadRequest }
            )
        }

        const filePath = path.join(UPLOADS_DIR, folder, file)

        try {
            await fs.stat(filePath)
        } catch {
            return NextResponse.json({ error: 'File not found' }, { status: Status.NotFound })
        }

        // Kiểm tra MIME type
        const fileBuffer = await fs.readFile(filePath)
        const fileType = await fileTypeFromBuffer(new Uint8Array(fileBuffer))

        if (!fileType) {
            return NextResponse.json(
                { error: 'Unsupported file type' },
                { status: Status.UnsupportedMediaType }
            )
        }

        const mimeType = mime.getType(filePath) || 'application/octet-stream'

        // Trả về file stream để tối ưu bộ nhớ khi render video
        const stream = (await fs.open(filePath, 'r')).createReadStream()

        return new NextResponse(stream as any, {
            headers: {
                'Content-Type': mimeType,
                'Content-Length': fileBuffer.length.toString(),
                'Accept-Ranges': 'bytes',
            },
        })
    } catch (error) {
        console.error('Error serving file:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: Status.InternalServerError }
        )
    }
}
