//@ts-check

const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: /** @type {any} */ ({
    svgr: false,
  }),
};

// Compose with explicit base config
const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
