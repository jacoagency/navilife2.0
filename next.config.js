/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                dns: false,
                fs: false,
                net: false,
                tls: false,
            };
        }
        return config;
    },
    env: {
        FAL_KEY: process.env.FAL_KEY,
    },
};

module.exports = nextConfig;
