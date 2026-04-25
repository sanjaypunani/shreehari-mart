//@ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  turbopack: {},
  transpilePackages: [
    '@shreehari/types',
    '@shreehari/ui',
    '@shreehari/design-system',
    '@shreehari/utils',
    '@shreehari/data-access',
    '@shreehari/server-utils',
  ],
};

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  register: true,
});

module.exports = withPWA(nextConfig);
