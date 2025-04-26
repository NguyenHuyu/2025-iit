export type Blog = {
    id: string
    title: string
    content: string
    excerpt: string
    status: 'draft' | 'published'
    createdAt: string
    updatedAt: string
}

export const blogs: Blog[] = [
    {
        id: '1',
        title: 'Getting Started with Next.js 15',
        content:
            'Next.js 15 introduces several exciting features including improved performance, better developer experience, and enhanced SEO capabilities...',
        excerpt:
            'Learn how to get started with the latest version of Next.js and explore its new features.',
        status: 'published',
        createdAt: '2025-03-01T12:00:00Z',
        updatedAt: '2025-03-01T12:00:00Z',
    },
    // Thêm 30 mục blog mới
    ...Array.from({ length: 10 }, (_, i) => ({
        id: (i + 2).toString(),
        title: `Blog Post ${i + 2}`,
        content: `This is the content for blog post ${i + 2}. It covers various topics on web development, programming, and technology trends.`,
        excerpt: `A brief summary of blog post ${i + 2}.`,
        status: i % 2 === 0 ? ('published' as const) : ('draft' as const),
        createdAt: new Date(2025, 2, i + 1, 10, 0, 0).toISOString(),
        updatedAt: new Date(2025, 2, i + 1, 10, 0, 0).toISOString(),
    })),
]

// Hàm này sẽ mô phỏng việc lấy dữ liệu từ API hoặc database
export async function getBlogs(): Promise<Blog[]> {
    // Trong thực tế, đây sẽ là một cuộc gọi API hoặc truy vấn database
    // Ví dụ: const response = await fetch('https://api.example.com/blogs')
    // Ví dụ: const blogs = await response.json()

    // Đối với mục đích demo, chúng ta sẽ trả về dữ liệu mẫu sau một độ trễ giả lập
    await new Promise((resolve) => setTimeout(resolve, 500)) // Giả lập độ trễ mạng
    return blogs
}

export async function getBlogById(id: string): Promise<Blog | undefined> {
    // Trong thực tế, đây sẽ là một cuộc gọi API hoặc truy vấn database
    // Ví dụ: const response = await fetch(`https://api.example.com/blogs/${id}`)
    // Ví dụ: const blog = await response.json()

    // Đối với mục đích demo, chúng ta sẽ tìm bài viết trong dữ liệu mẫu
    await new Promise((resolve) => setTimeout(resolve, 100)) // Giả lập độ trễ mạng
    return blogs.find((blog) => blog.id === id)
}
