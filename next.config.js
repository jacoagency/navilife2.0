/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        serverActions: true,
    },
    webpack: (config, { dev, isServer }) => {
        if (dev && !isServer) {
            config.cache = false;
        }
        return config;
    },
    env: {
        FAL_KEY: process.env.FAL_KEY,
    },
};

module.exports = nextConfig;
