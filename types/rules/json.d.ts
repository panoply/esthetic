export interface JSONOptions {
  /**
   * **Default:** `false`
   *
   * This option will alphabetically sort object properties in JSON objects.
   */
  objectSort?: boolean

  /**
   * **Default:** `true`
   *
   * This option will determine how arrays cotained on objects will
   * be formatted. If opening curly braces should exist on the same
   * line as their condition or be forced onto a new line.
   * (Allman style indentation).
   *
   * ---
   *
   * #### Enabled
   *
   * _Below is an example when this option is set to `true` and each
   * object in the array starts on a newline._
   *
   * ```json
   *
   * {
   *    "array": [
   *      {
   *        "name": "foo"
   *      },
   *      {
   *        "name": "bar"
   *      },
   *      {
   *        "name": "baz"
   *      }
   *    ]
   * }
   * ```
   *
   * ---
   *
   * #### Disabled
   *
   * _Below is an example when this option is set to `false` and
   * each object in the array starts curly braces inline._
   *
   * ```json
   *
   * {
   *    "array": [
   *      {
   *        "name": "foo"
   *      }, {
   *        "name": "bar"
   *      }, {
   *        "name": "baz"
   *      }
   *    ]
   * }
   * ```
   */
  braceAllman?: boolean,

  /**
   * **Default:** `false`
   *
   * If true an empty line will be inserted after opening curly braces
   * and before closing curly braces.
   *
   * ---
   *
   * #### Enabled
   *
   * Below is an example when this option is set to `true`
   *
   * ```json
   * {
   *
   *  "foo": {
   *
   *   "bar": {
   *      "baz": 0
   *    }
   *
   *   }
   *
   * }
   * ```
   *
   * #### Disabled
   *
   * Below is an example when this option is set to `false`
   *
   * ```json
   *
   * {
   *  "foo": {
   *   "bar": {
   *      "baz": 0
   *    }
   *   }
   * }
   * ```
   */
  bracePadding?: boolean,

  /**
   * **Default:** `default`
   *
   * Controls how arrays on objects are formatted. This rules will
   * determines if all array indexes should be indented, never indented,
   * or left to the default.
   *
   * **Options**
   *
   * - `default`
   *  Default formatting (default)
   *
   * - `indent`
   *  "Always indent each index of an array
   *
   * - `inline`
   *  Ensure all array indexes appear on a single line
   *
   * @default 'default'
   */
  arrayFormat?: 'default' | 'indent' | 'inline',

  /**
   * **Default:** `default`
   *
   * Controls how arrays on objects are formatted. We will exclude
   * the `inline` option to prevent unreadable objects. If all object
   * keys should be indented, never indented, or left to the default.
   *
   * **Options**
   *
   * > `default` (default)
   *  Default formatting
   *
   * > `indent`
   *  "Always indent each index of an array
   */
  objectIndent?: 'default' | 'indent',
}
