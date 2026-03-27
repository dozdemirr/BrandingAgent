import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

export default [
  {
    // bundle bgl scripts
    input: './wwwroot/dist/scripts/bgl.bundle.js',
    plugins: [
      getBabelOutputPlugin({
        presets: ['@babel/preset-env']
      }),
      terser()
    ],
    output: {
      file: './wwwroot/dist/scripts/bgl.bundle.min.js',
      format: 'cjs',
      sourcemap: true
    },
  },
  {
    // bundle external scripts
    input: './wwwroot/dist/scripts/external.bundle.js',
    plugins: [
      terser()
    ],
    output: {
      file: './wwwroot/dist/scripts/external.bundle.min.js',
      format: 'cjs'
    },
  },
  {
    // Copy common for Ping pages
    input: './TempFiles/common/scripts/bgl/bgl.common.js',
    plugins: [
      terser()
    ],
    output: {
      file: './wwwroot/dist/scripts/bgl/bgl.common.js',
      format: 'cjs'
    },
  },
  {
    // Copy jquery for Ping pages
    input: './TempFiles/common/scripts/jquery/jquery.js',
    plugins: [
      terser()
    ],
    output: {
      file: './wwwroot/dist/scripts/jquery/jquery.js',
      format: 'cjs'
    },
  },
  {
    // Copy app insights sdk
    input: './TempFiles/common/scripts/applicationinsights/ai.js',
    output: {
      file: './wwwroot/dist/scripts/applicationinsights/ai.js',
      format: 'cjs'
    },
  }
];