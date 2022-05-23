import { rollup, plugin, env } from '@liquify/rollup-config';

export default rollup(
  [
    {
      input: 'src/index.ts',
      preserveEntrySignatures: 'allow-extension',
      output: [
        {
          format: 'cjs',
          file: 'package/index.js',
          sourcemap: process.env.prod ? false : 'inline',
          esModule: false,
          freeze: false,
          preferConst: true,
          chunkFileNames: '[name].js'
        },
        {
          format: 'esm',
          file: 'package/index.mjs',
          sourcemap: process.env.prod ? false : 'inline',
          esModule: true,
          freeze: false,
          preferConst: true,
          chunkFileNames: '[name].js'
        }
      ],
      plugins: env.if('dev')(
        [
          plugin.del(
            {
              verbose: true,
              runOnce: !process.env.prod,
              targets: 'package/*'
            }
          ),
          plugin.esbuild(),
          plugin.copy(
            {
              targets: [
               {
                  src: 'src/types/options.ts',
                  dest: 'types',
                  rename: 'index.d.ts'
                },
                {
                  src: [
                    'src/types/shared.ts',
                    'src/types/markup.ts',
                    'src/types/json.ts',
                    'src/types/script.ts',
                    'src/types/style.ts'
                  ],
                  dest: 'types',
                  rename: name => `${name}.d.ts`
                }
              ]
            }
          )
        ]
      )(
        [
          plugin.esminify(),
          plugin.filesize(
            {
              showGzippedSize: false,
              showMinifiedSize: true
            }
          )
        ]
      )
    },
    {
      input: 'src/index.ts',
      output: {
        format: 'esm',
        file: 'package/index.d.ts'
      },
      plugins: [
        plugin.dts()
      ]
    }
  ]
);
