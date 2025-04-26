'use server'

export type Post = {
    id: string
    title: string
    slug: string
    authorId: string
    mainImage?: string
}

export type Category = {
    id: string
    name: string
}

// Simulated database calls
const db = {
    posts: [
        {
            id: '1',
            title: 'Blog 1',
            slug: 'blog-1',
            authorId: '1',
            mainImage:
                'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZktOPzGqWt9dlFgvi2K2gSJsRsFHBN.png',
        },
        { id: '2', title: 'Blog 2', slug: 'blog-2', authorId: '2' },
    ],
    categories: [
        { id: '1', name: 'Post' },
        { id: '2', name: 'Author' },
        { id: '3', name: 'Category' },
    ],
}

export async function getPosts(): Promise<Post[]> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return db.posts
}

export async function getPost(id: string): Promise<Post | null> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return db.posts.find((post) => post.id === id) || null
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return db.posts.find((post) => post.slug === slug) || null
}

export async function getCategories(): Promise<Category[]> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return db.categories
}

export async function updatePost(post: Partial<Post> & { id: string }) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const index = db.posts.findIndex((p) => p.id === post.id)
    if (index > -1) {
        db.posts[index] = { ...db.posts[index], ...post }
    }
    return db.posts[index]
}

export async function createPost(post: Omit<Post, 'id'>) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const newPost = { ...post, id: Math.random().toString() }
    db.posts.push(newPost)
    return newPost
}
