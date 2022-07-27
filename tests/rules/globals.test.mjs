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

    // t.log(output);

    t.snapshot(output, `Global Option { wrap: ${wrap} } ${wrap === 0 ? '(default)' : ''}`);

  };

});

test.serial('CRLF Line Terminations', async t => {

  /* OPTIONS ------------------------------------ */

  prettify.options({ language: 'html' });

  /* SAMPLE ------------------------------------- */

  const source = await samples.rules('global/crlf');

  /* RULES -------------------------------------- */

  for (const crlf of [ true, false ]) {

    const output = await prettify.format(source, { crlf });

    // t.log(output);

    t.snapshot(output, `Global Option { crlf: ${crlf}  ${crlf === false ? '(default)' : ''}`);

  };

});

test.serial('Indent Characters', async t => {

  /* OPTIONS ------------------------------------ */

  prettify.options({ language: 'javascript' });

  /* SAMPLE ------------------------------------- */

  const source = await samples.rules('global/indent-char');

  /* RULES -------------------------------------- */

  for (const { indentChar, indentSize } of [
    {
      indentSize: 1,
      indentChar: '\t'
    }, {
      indentSize: 2,
      indentChar: 'x'
    }, {
      indentSize: 2,
      indentChar: ' '
    }
  ]) {

    const output = await prettify.format(source, { indentChar, indentSize });

    // t.log(output, indentChar);

    t.snapshot(output, `Global Option { indentChar: ${indentChar} } ${indentChar === ' ' ? '(default)' : ''}`);

  };

});

test.serial('Identation Size', async t => {

  /* OPTIONS ------------------------------------ */

  prettify.options({ language: 'liquid' });

  /* SAMPLE ------------------------------------- */

  const source = await samples.rules('global/indent-size');

  /* RULES -------------------------------------- */

  for (const indentSize of [ 6, 4, 5, 3, 1, 2 ]) {

    const output = await prettify.format(source, { indentSize });

    // t.log(output);

    t.snapshot(output, `Global Option { indentSize: ${indentSize} } ${indentSize === 2 ? '(default)' : ''}`);

  };

});

test.serial('Preserve Newlines', async t => {

  /* OPTIONS ------------------------------------ */

  prettify.options({ language: 'css' });

  /* SAMPLE ------------------------------------- */

  const source = await samples.rules('global/preserve-line');

  /* RULES -------------------------------------- */

  for (const preserveLine of [
    6,
    4,
    5,
    1,
    3,
    0,
    2
  ]) {

    const output = await prettify.format(source, { preserveLine });

    // t.log(output);

    t.snapshot(output, `Global Option { preserveLine: ${preserveLine} } ${preserveLine === 2 ? '(default)' : ''}`);

  };

});

test.serial('End with Newline', async t => {

  /* OPTIONS ------------------------------------ */

  prettify.options({ language: 'text' });

  /* SAMPLE ------------------------------------- */

  const source = await samples.rules('global/end-newline');

  /* RULES -------------------------------------- */

  for (const endNewline of [ true, false ]) {

    const output = await prettify.format(source, { endNewline });

    // t.log(output);

    t.snapshot(output, `Global Option { endNewline: ${endNewline} } ${endNewline === false ? '(default)' : ''}`);

  };

});

test.todo('Comment Indentation: Rule is not being respected in Liquid');
test.todo('Comment Indentation: HTML multiline comments fail');
test.todo('Comment Preservation: Liquid and HTML comments do not respect preservation');

test.serial.skip('Preserve Comments', async t => {

  prettify.options({ language: 'liquid' });

  /* SAMPLE ------------------------------------- */

  const source = await samples.rules('global/comment-indent');

  /* RULES -------------------------------------- */

  for (const preserveComment of [ true, false ]) {

    const output = await prettify.format(source, { preserveComment });

    t.log(`{ preserveComment: ${preserveComment} }`, output);
    /* t.snapshot(
      output,
      `{ commentIndent: ${commentIndent} } ${commentIndent === false ? '(default)' : ''}`
    ); */

  };
});

test.serial.skip('Comment Indentation', async t => {

  prettify.options({ language: 'liquid' });

  /* SAMPLE ------------------------------------- */

  const source = await samples.rules('global/comment-indent');

  /* RULES -------------------------------------- */

  for (const commentIndent of [ true, false ]) {

    const output = await prettify.format(source, { commentIndent });

    t.log(`{ commentIndent: ${commentIndent} }`, output);
    /* t.snapshot(
      output,
      `{ commentIndent: ${commentIndent} } ${commentIndent === false ? '(default)' : ''}`
    ); */

  };
});
