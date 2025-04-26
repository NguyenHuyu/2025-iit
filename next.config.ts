import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    // webpack: (config) => {
    //     config.module.rules.push({
    //         test: /\.svg$/,
    //         use: [
    //             {
    //                 loader: '@svgr/webpack',
    //                 options: {
    //                     svgoConfig: {
    //                         plugins: [
    //                             {
    //                                 name: 'preset-default',
    //                                 params: {
    //                                     overrides: {
    //                                         removeViewBox: false,
    //                                     },
    //                                 },
    //                             },
    //                         ],
    //                     },
    //                 },
    //             },
    //         ],
    //     })
    //     return config
    // },
    sassOptions: {
        implementation: 'sass-embedded',
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                ],
            },
        ]
    },
    async rewrites() {
        return [
            {
                source: '/media/:path*',
                destination: '/api/media/:path*',
            },
        ]
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    reactStrictMode: false,
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb',
        },
    },
}

export default nextConfig
