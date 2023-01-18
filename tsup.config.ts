import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    './src/index.ts'
  ],
  outDir: './',
  treeshake: true,
  globalName: 'esthetic',
  splitting: false,
  esbuildOptions: options => {
    options.treeShaking = true;
  },
  format: [
    'cjs',
    'esm'
  ]
});
