const esbuild = require('esbuild');
const path = require('path');

const isDev = process.argv.includes('--dev');
const isWatch = process.argv.includes('--watch');

/** @type {import('esbuild').BuildOptions} */
const buildOptions = {
  entryPoints: [
    'src/extension.ts',
    'src/test/runTests.ts',
    'src/test/suite/index.ts',
  ],
  bundle: true,
  outdir: 'dist',
  external: ['vscode', '@vscode/test-electron', 'mocha'],
  format: 'cjs',
  platform: 'node',
  target: 'node18',
  sourcemap: isDev,
  minify: !isDev,
  logLevel: 'info',
};

async function build() {
  if (isWatch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log('Watching for changes...');
  } else {
    await esbuild.build(buildOptions);
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
