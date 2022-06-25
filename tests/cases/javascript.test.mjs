import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test.serial('preserveComment: false', async t => {

  const { source } = await samples.get('javascript/comment-indent');

  const output = await prettify.format(source, {
    preserveComment: false,
    script: {
      braceNewline: false
    }
  });

  t.snapshot(output);

});

test.serial('inlineReturn: true', async t => {

  const { source } = await samples.get('javascript/inline-return');

  const attemptCorrectionFalse = await prettify.format(source, {
    attemptCorrection: false,
    indentSize: 2,
    script: {
      braceNewline: false,
      inlineReturn: true,
      elseNewline: false
    }
  });

  t.snapshot(attemptCorrectionFalse);

  const attemptCorrectionTrue = await prettify.format(source, {
    attemptCorrection: true,
    indentSize: 2,
    script: {
      braceNewline: false,
      inlineReturn: true,
      elseNewline: false
    }
  });

  t.snapshot(attemptCorrectionTrue);

});

test.serial('objectSort: true', async t => {

  const { source } = await samples.get('javascript/object-sort');

  const objectSortTrue = await prettify.format(source, {
    attemptCorrection: false,
    indentSize: 2,
    script: {
      objectSort: true,
      objectIndent: 'indent'
    },
    style: {
      sortProperties: true
    }
  });

  t.snapshot(objectSortTrue);

  const objectSortFalse = await prettify.format(source, {
    attemptCorrection: false,
    indentSize: 2,
    script: {
      objectSort: false,
      objectIndent: 'indent'
    },
    style: {
      sortProperties: false
    }
  });

  t.snapshot(objectSortFalse);

});
