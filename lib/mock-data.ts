// Mock data for UI demonstration
export const MOCK_POSTS = [
    {
        id: '1',
        status: 'PUBLISHED',
        createdAt: new Date('2023-05-15'),
        updatedAt: new Date('2023-05-20'),
        authorId: '1',
        categoryIds: ['1', '2'],
        tags: ['nextjs', 'react', 'tutorial'],
        featuredImage: 'https://example.com/images/nextjs.jpg',
        translations: [
            {
                id: '1',
                languageCode: 'en',
                title: 'Getting Started with Next.js',
                slug: 'getting-started-with-nextjs',
                content:
                    'Next.js is a React framework that enables server-side rendering and static site generation...',
                excerpt:
                    'Learn how to get started with Next.js, the React framework for production.',
                metaTitle: 'Getting Started with Next.js | Tech Blog',
                metaDescription:
                    'Learn how to get started with Next.js, the React framework for production.',
                metaKeywords: 'nextjs, react, tutorial, web development',
                createdAt: new Date('2023-05-15'),
                updatedAt: new Date('2023-05-20'),
            },
        ],
    },
    {
        id: '2',
        status: 'DRAFT',
        createdAt: new Date('2023-06-10'),
        updatedAt: new Date('2023-06-12'),
        authorId: '1',
        categoryIds: ['2', '3'],
        tags: ['typescript', 'javascript', 'programming'],
        featuredImage: 'https://example.com/images/typescript.jpg',
        translations: [
            {
                id: '2',
                languageCode: 'en',
                title: 'Mastering TypeScript',
                slug: 'mastering-typescript',
                content:
                    'TypeScript is a strongly typed programming language that builds on JavaScript...',
                excerpt: 'Learn how to master TypeScript and improve your JavaScript development.',
                metaTitle: 'Mastering TypeScript | Tech Blog',
                metaDescription:
                    'Learn how to master TypeScript and improve your JavaScript development.',
                metaKeywords: 'typescript, javascript, programming',
                createdAt: new Date('2023-06-10'),
                updatedAt: new Date('2023-06-12'),
            },
            {
                id: '3',
                languageCode: 'vi',
                title: 'Làm chủ TypeScript',
                slug: 'lam-chu-typescript',
                content:
                    'TypeScript là một ngôn ngữ lập trình được định kiểu mạnh dựa trên JavaScript...',
                excerpt:
                    'Tìm hiểu cách làm chủ TypeScript và cải thiện phát triển JavaScript của bạn.',
                metaTitle: 'Làm chủ TypeScript | Blog Công nghệ',
                metaDescription:
                    'Tìm hiểu cách làm chủ TypeScript và cải thiện phát triển JavaScript của bạn.',
                metaKeywords: 'typescript, javascript, lập trình',
                createdAt: new Date('2023-06-11'),
                updatedAt: new Date('2023-06-12'),
            },
        ],
    },
    {
        id: '3',
        status: 'PUBLISHED',
        createdAt: new Date('2023-07-05'),
        updatedAt: new Date('2023-07-10'),
        authorId: '2',
        categoryIds: ['4'],
        tags: ['css', 'responsive', 'design', 'mobile'],
        featuredImage: 'https://example.com/images/responsive.jpg',
        translations: [
            {
                id: '4',
                languageCode: 'en',
                title: 'Responsive Design Techniques',
                slug: 'responsive-design-techniques',

                content: "In this article, we'll explore modern responsive design techniques...",
                excerpt:
                    'Learn modern responsive design techniques to create the best user experience on any device.',
                metaTitle: 'Responsive Design Techniques | Tech Blog',
                metaDescription:
                    'Learn modern responsive design techniques to create the best user experience on any device.',
                metaKeywords: 'responsive design, web design, mobile-first, CSS Grid, Flexbox',
                createdAt: new Date('2023-07-05'),
                updatedAt: new Date('2023-07-10'),
            },
            {
                id: '5',
                languageCode: 'vi',
                slug: 'responsive-design-techniques',

                title: 'Kỹ thuật Thiết kế Responsive',
                content:
                    'Trong bài viết này, chúng ta sẽ tìm hiểu về các kỹ thuật thiết kế responsive hiện đại...',
                excerpt:
                    'Tìm hiểu các kỹ thuật thiết kế responsive hiện đại để tạo ra trải nghiệm người dùng tốt nhất trên mọi thiết bị.',
                metaTitle: 'Kỹ thuật Thiết kế Responsive | Blog Công nghệ',
                metaDescription:
                    'Tìm hiểu các kỹ thuật thiết kế responsive hiện đại để tạo ra trải nghiệm người dùng tốt nhất trên mọi thiết bị.',
                metaKeywords: 'responsive design, thiết kế web, mobile-first, CSS Grid, Flexbox',
                createdAt: new Date('2023-07-06'),
                updatedAt: new Date('2023-07-12'),
            },
            {
                id: '6',
                languageCode: 'fr',
                title: 'Techniques de Design Responsive',
                content:
                    'Dans cet article, nous explorerons les techniques modernes de design responsive...',
                slug: 'responsive-design-techniques',

                excerpt:
                    "Découvrez les techniques modernes de design responsive pour créer la meilleure expérience utilisateur sur n'importe quel appareil.",
                metaTitle: 'Techniques de Design Responsive | Blog Tech',
                metaDescription:
                    "Découvrez les techniques modernes de design responsive pour créer la meilleure expérience utilisateur sur n'importe quel appareil.",
                metaKeywords: 'responsive design, conception web, mobile-first, CSS Grid, Flexbox',
                createdAt: new Date('2023-07-07'),
                updatedAt: new Date('2023-07-15'),
            },
        ],
    },
]

export const MOCK_CATEGORIES = [
    {
        id: '1',
        slug: 'web-development',
        translations: [
            {
                id: '1',
                languageCode: 'en',
                name: 'Web Development',
                description: 'Articles about web development technologies and techniques.',
            },
            {
                id: '2',
                languageCode: 'vi',
                name: 'Phát triển Web',
                description: 'Các bài viết về công nghệ và kỹ thuật phát triển web.',
            },
        ],
    },
    {
        id: '2',
        slug: 'programming',
        translations: [
            {
                id: '3',
                languageCode: 'en',
                name: 'Programming',
                description: 'Articles about programming languages and software development.',
            },
            {
                id: '4',
                languageCode: 'vi',
                name: 'Lập trình',
                description: 'Các bài viết về ngôn ngữ lập trình và phát triển phần mềm.',
            },
        ],
    },
    {
        id: '3',
        slug: 'javascript',
        translations: [
            {
                id: '5',
                languageCode: 'en',
                name: 'JavaScript',
                description: 'Articles about JavaScript and its ecosystem.',
            },
            {
                id: '6',
                languageCode: 'vi',
                name: 'JavaScript',
                description: 'Các bài viết về JavaScript và hệ sinh thái của nó.',
            },
        ],
    },
    {
        id: '4',
        slug: 'design',
        translations: [
            {
                id: '7',
                languageCode: 'en',
                name: 'Design',
                description: 'Articles about web design, UI/UX, and visual design.',
            },
            {
                id: '8',
                languageCode: 'vi',
                name: 'Thiết kế',
                description: 'Các bài viết về thiết kế web, UI/UX và thiết kế trực quan.',
            },
        ],
    },
]

// Available languages for the blog
export const AVAILABLE_LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'es', name: 'Spanish' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' },
]
