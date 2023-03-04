#!/usr/bin/env node

import mm from 'minimist';
import { run } from 'cli/run';

(async () => await run(mm(process.argv.slice(1), {
  alias: {
    watch: 'w',
    output: 'o',
    config: 'c',
    format: 'f'
  },
  default: {
    format: false,
    liquid: false,
    html: false,
    xml: false,
    css: false,
    scss: false,
    json: false,
    javascript: false,
    jsx: false,
    typescript: false,
    tsx: false
  },
  boolean: [
    'watch',
    'dry',
    'liquid',
    'html',
    'xml',
    'css',
    'scss',
    'json',
    'javascript',
    'jsx',
    'typescript',
    'tsx'
  ],
  string: [
    'config',
    'output'
  ]
})))();
