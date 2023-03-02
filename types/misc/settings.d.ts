import { LiteralUnion } from 'type-fest';

export interface Settings {
  /**
   * **Throw Errors**
   *
   * Whether or not Æsthetic should throw exceptions when encountering a
   * parse error. When disabled (`false`) then errors will fail quitely.
   * Use the `esthetic.on('error', (e) => {})` event or check the `esthetic.error`
   * to take control of parse errors when this is disabled.
   *
   * @default true
   */
  throwErrors?: boolean;
  /**
   * **Persist Rules**
   *
   * Whether or not Æsthetic should persist defined rules. By default, Æsthetic
   * maintains a persisted reference of formatting rules. Setting this to `false`
   * will result in Æsthetic merging rules with defaults (or `preset`) each time
   * the `esthetic.format()`, `esthetic.parse()` or `eshetic.rules()` is invoked.
   *
   * @default true
   */
  persistRules?: boolean;
  /**
   * **Log Colors**
   *
   * By default, operations which invole printing to console, such are errors will
   * apply ansi coloring. Set this to `false` to prevent highlights being applied.
   *
   * @default true
   */
  logColors?: boolean;
  /**
   * **Resolve Config**
   *
   * Use an external configuration approach for definind rules. Æsthetic supports
   * `package.json` files containing an `esthetic` key, an `.estheticrc` or `.estheticrc.json`
   * files. You can provide a uri reference to a specific file containing rules.
   *
   * @default undefined
   */
  resolveConfig?: LiteralUnion<'package.json' | '.estheticrc', string>
}
