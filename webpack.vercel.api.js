/**
 * Webpack config for bundling the Express API into a single file for Vercel serverless.
 *
 * Why: The @shreehari/* workspace libs have no package.json, so they exist only as
 * TypeScript path aliases. @vercel/node compiles vercel.ts but leaves
 * `require('@shreehari/...')` in the output, which Node.js can't resolve at runtime.
 * This config bundles the workspace libs inline and externalises npm packages
 * (available in the Lambda's node_modules via `npm install`).
 */

const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const ROOT = __dirname;
const TSCONFIG = path.join(ROOT, 'tsconfig.base.json');

module.exports = {
  mode: 'production',
  target: 'node',
  entry: './apps/api/src/vercel.ts',
  output: {
    filename: 'vercel.js',
    path: path.join(ROOT, 'dist/vercel-api'),
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin({ configFile: TSCONFIG }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: TSCONFIG,
            // transpileOnly skips full type-checking so that JSX files reached
            // via the shared data-access lib don't fail the build.
            // TypeORM entities in this project use explicit column types so
            // emitDecoratorMetadata is not required.
            transpileOnly: true,
            compilerOptions: {
              module: 'commonjs',
              // Allow JSX in case UI components are transitively included
              jsx: 'react',
            },
          },
        },
      },
    ],
  },
  externals: [
    function ({ request }, callback) {
      // Bundle @shreehari/* workspace packages inline — they have no node_modules entry
      if (request && request.startsWith('@shreehari/')) {
        return callback();
      }
      // Externalise all bare npm package names; they are deployed via npm install
      if (
        request &&
        !request.startsWith('.') &&
        !request.startsWith('/') &&
        !path.isAbsolute(request)
      ) {
        return callback(null, `commonjs ${request}`);
      }
      callback();
    },
  ],
  optimization: {
    // Keep output readable for easier debugging of Lambda errors
    minimize: false,
  },
};
