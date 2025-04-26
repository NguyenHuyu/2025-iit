import { uploadFile } from '@/lib/upload'
import { Status } from '@reflet/http'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const UPLOADS_DIR = path.join(process.cwd(), 'uploads')

export async function POST(request: Request) {
    const formData = await request.formData()
    try {
        const file = formData.get('file')
        const folder = formData.get('folder')

        if (!file) {
            return NextResponse.json({
                status: Status.BadRequest,
                body: 'No file uploaded',
            })
        }

        const result = await uploadFile(file as File, folder as string)
        return Response.json({
            url: result.data?.imageUrl,
            status: Status.Ok,
        })
    } catch (error: unknown) {
        console.error(error)
        return NextResponse.json({
            status: Status.InternalServerError,
            body: 'An error occurred',
        })
    }
}

function isValidName(name: string) {
    return /^[a-zA-Z0-9._-]+$/.test(name)
}

export async function GET(request: Request, { params }: { params: Promise<{ folder: string }> }) {
    try {
        const { folder } = await params

        // Kiểm tra tên thư mục hợp lệ
        if (!isValidName(folder)) {
            return NextResponse.json(
                {
                    error: 'Invalid folder name',
                },
                {
                    status: Status.BadRequest,
                }
            )
        }

        // Đường dẫn đầy đủ của thư mục
        const folderPath = path.join(UPLOADS_DIR, folder)
        const resolvedPath = path.resolve(folderPath)

        // Đảm bảo thư mục nằm trong thư mục uploads
        if (!resolvedPath.startsWith(UPLOADS_DIR)) {
            return NextResponse.json(
                {
                    error: 'Access denied',
                },
                {
                    status: Status.Forbidden,
                }
            )
        }

        // Kiểm tra sự tồn tại của thư mục
        let folderStats
        try {
            folderStats = await fs.promises.stat(resolvedPath)
        } catch {
            return NextResponse.json(
                {
                    error: 'Folder not found',
                },
                {
                    status: Status.NotFound,
                }
            )
        }

        // Đảm bảo đây là một thư mục
        if (!folderStats.isDirectory()) {
            return NextResponse.json(
                {
                    error: 'Not a valid folder',
                },
                {
                    status: Status.BadRequest,
                }
            )
        }

        // Lấy danh sách tệp
        const files = await fs.promises.readdir(resolvedPath)

        // Lấy thông tin chi tiết từng tệp
        const fileDetails = await Promise.all(
            files.map(async (file) => {
                const filePath = path.join(resolvedPath, file)
                const stats = await fs.promises.stat(filePath)

                return {
                    name: file,
                    size: stats.size,
                    isDirectory: stats.isDirectory(),
                    lastModified: stats.mtime,
                }
            })
        )

        return NextResponse.json(fileDetails, {
            status: Status.Ok,
        })
    } catch (error) {
        console.error('Error retrieving file list:', error)
        return NextResponse.json(
            {
                error: 'Internal Server Error',
            },
            {
                status: Status.InternalServerError,
            }
        )
    }
}
