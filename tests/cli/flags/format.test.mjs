import { execSync } from 'node:child_process';

import { samples } from '@liquify/ava/esthetic';
import test from 'ava';

const commands = [
  'cd tests/e2e/cjs; pnpm esthetic ./samples/*.liquid -f;',
  'cd tests/e2e/esm; pnpm esthetic ./samples/*.liquid -f;'
];

test.before('Liquid samples', async () => {

  await samples.get({
    from: 'liquid',
    to: 'e2e/esm/liquid',
    ext: '.liquid'
  });

});

test.skip('e2e (esm): CLI Liquid format command', async (t) => {

  for (const command of commands) {

    const output = execSync('pnpm esthetic ./liquid/* -f').toString();
    const stdout = output.split('\n').filter(Boolean).pop();
    t.assert(stdout.startsWith('formatted'));
  }

  t.pass();

});

test.after('Cleanup Samples', async () => {

  await samples.clear('e2e/esm/liquid');

});
