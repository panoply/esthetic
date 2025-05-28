#!/usr/bin/env node

import { run } from 'cli/run';
import mm from 'minimist';

(async () => await run(
  mm(process.argv.slice(1), {
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
      json: false,
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
      'json'

    ],
    string: [
      'config',
      'output'
    ]
  })
))();
