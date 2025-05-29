import shared from '@liquify/eslint-config';

export default [
  {
    ignores: [
      '**/dist/*',
      '**/node_modules/*'
    ]
  },
  ...shared,
  {
    rules: {

      'n/no-callback-literal': 'off',
      'no-lone-blocks': 'off',
      'no-unmodified-loop-condition': 'off',
      'no-unused-vars': 'off',
      'operator-linebreak': [
        'error',
        'after',
        {
          overrides: {
            '?': 'before',
            ':': 'before',
            '&&': 'after',
            '||': 'after',
            '+': 'after'
          }
        }
      ]
    }
  }
];
