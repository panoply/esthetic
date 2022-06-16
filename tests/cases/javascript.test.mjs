import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test('Return inline rule', async t => {

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
  t.log('Attempt Correction is false');

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
  t.log('Attempt Correction is true');

});
