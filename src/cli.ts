#!/usr/bin/env node

import mm from 'minimist';
import { run } from 'cli/run';

(async () => await run(mm(process.argv.slice(1), {
  alias: {
    watch: 'w',
    output: 'o',
    config: 'c',
    format: 'f',
    help: 'h',
    javascript: 'js',
    typescript: 'ts'
  },
  default: {
    format: false,
    help: false,
    liquid: false,
    html: false,
    xml: false,
    css: false,
    scss: false,
    json: false,
    javascript: false,
    jsx: false,
    typescript: false,
    tsx: false,
    test: false,
    'no-color': false
  },
  boolean: [
    'watch',
    'dry',
    'test',
    'no-color',
    'silent',
    'rules',
    'help',
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
