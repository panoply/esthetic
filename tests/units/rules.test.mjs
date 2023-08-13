import test from 'ava';
import esthetic from 'esthetic';

test('Unit: Persisting merging of rules ', t => {

  const rules = esthetic.rules({
    language: 'liquid',
    liquid: {
      normalizeSpacing: true
    }
  });

});
