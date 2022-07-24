import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test.serial('Preserve Comments', async t => {

  const { source } = await samples.cases('javascript/comment-indent');

  const preserveCommentFalse = await prettify.format(source, {
    preserveComment: false,
    script: {
      braceNewline: false
    }
  });

  t.log('preserveComment: false');
  t.snapshot(preserveCommentFalse);

  const preserveCommentTrue = await prettify.format(source, {
    preserveComment: true,
    script: {
      braceNewline: false
    }
  });

  t.log('preserveComment: true');
  t.snapshot(preserveCommentTrue);

});

test.serial('Inline Return', async t => {

  const { source } = await samples.cases('javascript/inline-return');

  const attemptCorrectionFalse = await prettify.format(source, {
    attemptCorrection: false,
    indentSize: 2,
    script: {
      braceNewline: false,
      inlineReturn: true,
      elseNewline: false
    }
  });

  t.log('inlineReturn: false');
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

  t.log('inlineReturn: true');
  t.snapshot(attemptCorrectionTrue);

});

test.serial('Object Sorting', async t => {

  const { source } = await samples.cases('javascript/object-sort');

  const objectSortTrue = await prettify.format(source, {
    indentSize: 2,
    script: {
      objectSort: true,
      objectIndent: 'indent'
    },
    style: {
      sortProperties: true
    }
  });

  // t.log(objectSortTrue);
  t.log('objectSort: true');
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

  // t.log(objectSortFalse);
  t.log('objectSort: false');
  t.snapshot(objectSortFalse);

});
