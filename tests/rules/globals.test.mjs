import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

/* -------------------------------------------- */
/* GLOBAL RULE TESTS                            */
/* -------------------------------------------- */

// ALL PRETTIFY OPTIONS MUST END WITH THE DEFAULTS
// BECAUSE OPTIONS ARE PERSISTED WHEN CHANGED.

/* -------------------------------------------- */
/* TESTS                                        */
/* -------------------------------------------- */

test.serial('Word Wrap limit', async t => {

  /* OPTIONS ------------------------------------ */

  prettify.options({ language: 'xml', markup: { forceIndent: true } });

  /* SAMPLE ------------------------------------- */

  const source = await samples.rules('global/wrap');

  /* RULES -------------------------------------- */

  for (const wrap of [ 80, 100, 120, 30, 0 ]) {

    const output = await prettify.format(source, { wrap });

    t.log(`{ wrap: ${wrap} }`);
    t.snapshot(output, `{ wrap: ${wrap} } ${wrap === 0 ? '(default)' : ''}`);

  };

});

test.serial('CRLF Line Terminations', async t => {

  /* OPTIONS ------------------------------------ */

  prettify.options({ language: 'html' });

  /* SAMPLE ------------------------------------- */

  const source = await samples.rules('global/crlf');

  /* RULES -------------------------------------- */

  const crlfTrue = await prettify.format(source, { crlf: true });

  t.log('{ crlf: true }');
  t.snapshot(crlfTrue, '{ crlf: true }');

  const crlfFalse = await prettify.format(source);

  t.log('{ crlf: false }');
  t.snapshot(crlfFalse, '{ crlf: false } (default)');

});

test.serial('Indentation Characters', async t => {

  /* OPTIONS ------------------------------------ */

  prettify.options({ language: 'javascript' });

  /* SAMPLE ------------------------------------- */

  const source = await samples.rules('global/indent-char');

  /* RULES -------------------------------------- */

  const indentCharTab = await prettify.format(source, { indentSize: 1, indentChar: '\t' });

  t.log('{ indentChar: "\\t" }');
  t.snapshot(indentCharTab, '{ indentChar: "\t", indentSize: 1 }');

  const indentCharX = await prettify.format(source, { indentSize: 2, indentChar: 'x' });

  t.log('{ indentChar: "x" }');
  t.snapshot(indentCharX, '{ indentChar: "x", indentSize: 2 }');

  const indentChar = await prettify.format(source, { indentChar: ' ' });

  t.log('{ indentChar: " " }');
  t.snapshot(indentChar, '{ indentChar: " " } (default)');

});

test.serial('Identation Size', async t => {

  /* OPTIONS ------------------------------------ */

  prettify.options({ language: 'liquid' });

  /* SAMPLE ------------------------------------- */

  const source = await samples.rules('global/indent-size');

  /* RULES -------------------------------------- */

  for (const indentSize of [ 6, 4, 5, 3, 1, 2 ]) {

    const output = await prettify.format(source, { indentSize });

    t.log(`{ indentSize: ${indentSize} }`);
    t.snapshot(output, `{ indentSize: ${indentSize} } ${indentSize === 2 ? '(default)' : ''}`);

  };

});

test.serial('Preserve Newlines', async t => {

  /* OPTIONS ------------------------------------ */

  prettify.options({ language: 'css' });

  /* SAMPLE ------------------------------------- */

  const source = await samples.rules('global/preserve-line');

  /* RULES -------------------------------------- */

  for (const preserveLine of [ 6, 4, 5, 1, 3, 0, 2 ]) {

    const output = await prettify.format(source, { preserveLine });

    t.log(`{ preserveLine: ${preserveLine} }`);
    t.snapshot(output, `{ preserveLine: ${preserveLine} } ${preserveLine === 2 ? '(default)' : ''}`);

  };

});

test.serial('End with Newline', async t => {

  /* OPTIONS ------------------------------------ */

  prettify.options({ language: 'text' });

  /* SAMPLE ------------------------------------- */

  const source = await samples.rules('global/end-newline');

  /* RULES -------------------------------------- */

  const endNewlineTrue = await prettify.format(source, { endNewline: true });

  t.log('{ endNewline: true }');
  t.snapshot(endNewlineTrue, '{ endNewline: true }');

  const endNewlineFalse = await prettify.format(source, { endNewline: false });

  t.log('{ endNewline: false }');
  t.snapshot(endNewlineFalse, '{ endNewline: false } (default)');

});
