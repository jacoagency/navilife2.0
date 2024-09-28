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
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    },
};

module.exports = nextConfig;