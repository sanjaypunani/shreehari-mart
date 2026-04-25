/**
 * Builds the API for Vercel deployment using webpack's Node.js API.
 * Run with: node scripts/build-api-vercel.js
 */

const webpack = require('webpack');
const config = require('../webpack.vercel.api.js');

const compiler = webpack(config);

compiler.run((err, stats) => {
  if (err) {
    console.error('Webpack fatal error:', err);
    process.exit(1);
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.error('Build errors:');
    info.errors.forEach((e) => console.error(e.message || e));
    process.exit(1);
  }

  if (stats.hasWarnings()) {
    console.warn('Build warnings:');
    info.warnings.forEach((w) => console.warn(w.message || w));
  }

  console.log(
    stats.toString({ colors: true, modules: false, chunks: false })
  );
  console.log('\nBuild complete → dist/vercel-api/vercel.js');

  compiler.close((closeErr) => {
    if (closeErr) console.error('Compiler close error:', closeErr);
  });
});
