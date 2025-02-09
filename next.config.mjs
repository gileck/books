/** @type {import('next').NextConfig} */
import WithBundleAnalyzer from '@next/bundle-analyzer';
// next.config.js
const withBundleAnalyzerFunc = WithBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});





const nextConfig = withBundleAnalyzerFunc({
    webpack: (config, { isServer, dev, config: { distDir } }) => {
        // addServiceWorker({ config, distDir, dev, isServer });
        return config;
    },
});

export default nextConfig;


// module.exports = withBundleAnalyzer({
//     webpack(config) {
//         // Your existing webpack config can be modified here if needed
//         return config;
//     },
// });


