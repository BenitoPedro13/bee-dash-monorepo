/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '/public/**',
            },
            {
                protocol: 'https',
                hostname: 'api1.thatsbee.co',
                port: '',
                pathname: '/public/**',
            },

            {
                protocol: 'https',
                hostname: 'api.thatsbee.co',
                port: '',
                pathname: '/public/**',
            },
        ],
    },
}

module.exports = nextConfig
