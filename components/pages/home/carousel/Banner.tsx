import BannerCarousel from './Carousel'

export enum BannerType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
}

// Enum for status
export enum Status {
    Active = 'Active',
    Inactive = 'Inactive',
    Achieved = 'Achieved',
}

// Banner interface
export interface Banner {
    id: string
    name: string
    url: string
    size: number
    type: BannerType
    status: Status
    createdAt: Date
    updatedAt: Date
}

// Sample data
export const sampleBanners: Banner[] = [
    {
        id: '1',
        name: 'Summer Sale Banner',
        url: '/media/banner/download.jpg',
        size: 1024,
        type: BannerType.IMAGE,
        status: Status.Active,
        createdAt: new Date('2023-06-15'),
        updatedAt: new Date('2023-06-15'),
    },
    // {
    //     id: '2',
    //     name: 'Product Demo',
    //     url: '/media/banner/v.mp4',
    //     size: 5120,
    //     type: BannerType.VIDEO,
    //     status: Status.Achieved,
    //     createdAt: new Date('2023-05-10'),
    //     updatedAt: new Date('2023-05-20'),
    // },
]

// Helper functions
export const getStatusColor = (status: Status) => {
    switch (status) {
        case Status.Active:
            return 'bg-green-500'
        case Status.Inactive:
            return 'bg-gray-500'
        case Status.Achieved:
            return 'bg-blue-500'
        default:
            return 'bg-gray-500'
    }
}

export const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    else if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
    else return `${(bytes / 1048576).toFixed(1)} MB`
}

// In a real application, you would fetch data from an API or database here
export async function getBanners(): Promise<Banner[]> {
    // Simulate a server delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Return the sample data
    return sampleBanners
}

export default async function BannerPage() {
    // Fetch banners on the server
    const banners = await getBanners()

    return <BannerCarousel banners={banners} />
}
