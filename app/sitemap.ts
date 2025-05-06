import type { MetadataRoute } from 'next'

export default async function Sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://iit.siu.edu.vn'

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 1,
            alternates: {
                languages: {
                    vi: 'https://iit.siu.edu.vn/vi',
                    en: 'https://iit.siu.edu.vn/en',
                },
            },
        },
        {
            url: 'https://iit.siu.edu.vn/tin-tuc',
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 1,
            alternates: {
                languages: {
                    vi: 'https://iit.siu.edu.vn/vi/tin-tuc',
                    en: 'https://iit.siu.edu.vn/en/tin-tuc',
                },
            },
        },
    ]
}
