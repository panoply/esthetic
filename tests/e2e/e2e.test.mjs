import test from 'ava';
import { execSync } from 'node:child_process';

const commands = [
  'cd tests/e2e/cjs; pnpm esthetic ./samples/*.liquid -f;',
  'cd tests/e2e/esm; pnpm esthetic ./samples/*.liquid -f;'
];

test('e2e: CLI Format as CJS', async (t) => {

  for (const command of commands) {

    const output = execSync(command).toString();
    const stdout = output.split('\n').filter(Boolean).pop();
    t.assert(stdout.startsWith('formatted'));
  }

  t.pass();
});
