import { MarkupOptions, ScriptOptions, StyleOptions, Options } from '@liquify/prettify';
import { HighlightOptions } from 'cli-highlight';
import { ExecutionContext } from 'ava';

declare type Files = (`cases/attributes/${string}` | `cases/css/${string}` | `cases/embedded/${string}` | `cases/html/${string}` | `cases/ignores/${string}` | `cases/javascript/${string}` | `cases/json/${string}` | `cases/jsx/${string}` | `cases/languages/${string}` | `cases/liquid/${string}` | `cases/scss/${string}` | `cases/typescript/${string}` | `rules/global/${string}` | `rules/json/${string}` | `rules/markup/${string}` | `rules/script/${string}` | `rules/style/${string}`);
declare type Directories = ('cases/attributes' | 'cases/css' | 'cases/embedded' | 'cases/html' | 'cases/ignores' | 'cases/javascript' | 'cases/json' | 'cases/jsx' | 'cases/languages' | 'cases/liquid' | 'cases/scss' | 'cases/typescript' | 'rules/global' | 'rules/json' | 'rules/markup' | 'rules/script' | 'rules/style');
/**
 * Rule Options
 */
interface ForRuleOptions {
    /**
     * Target rules within a specific lexer.
     *
     * @example
     * import util from '@prettify/test-utils'
     *
     * util.forRule('cases/dir/file', { lexer: 'markup' })([
     *  {}, // markup rules
     *  {}, // markup rules
     * ], async function(source, rule, label) {})
     *
     * util.forRule('cases/dir', { lexer: 'markup' })({
     *  'file-1': [{}], // markup rules
     *  'file-2': [{}], // markup rules
     * }, async function(source, rule, label) {})
     *
     */
    lexer: 'markup' | 'script' | 'style';
}
/**
 * Rule Assertions
 */
declare type Resolve<T extends ForRuleOptions['lexer']> = T extends 'markup' ? MarkupOptions[] : T extends 'script' ? ScriptOptions[] : T extends 'style' ? StyleOptions[] : Options[];
/**
 * Snapshot Label Generator
 */
interface Label {
    /**
     * The snapshot description label
     */
    description?: string;
    /**
     * Options to be stringified and appended inot snapshot report.
     */
    (options?: Options): string;
}
interface DevCallback {
    (source: string, highlight: (source: string, options?: HighlightOptions) => string): void | Promise<{
        /**
         * Repeat the test function to simulate a persisted environment
         * like that found in text-editors when formatting onSave.
         */
        repeat: number;
        /**
         * Provide the output source which was beautified
         */
        source: string;
        /**
         * Whether or not to log output of each repeat
         */
        logger?: boolean;
        /**
         * A callback function to run after repeats finished
         */
        finish: () => void;
    }>;
}
declare const getSample: (sample: Files) => Promise<string>;
/**
 * Dev Mode
 */
declare const dev: (t: ExecutionContext<unknown>) => (sample: string | DevCallback, callback: DevCallback) => Promise<void>;
declare const forRule: <T extends ForRuleOptions>(sample: Directories | Files, options?: T) => (resolve: any[] | {
    [filename: string]: any[] | Resolve<T["lexer"]>;
} | Resolve<T["lexer"]>[number], callback: (this: {
    highlight: (source: string, options?: HighlightOptions) => string;
}, source: string, rule: any, label: Label) => void) => Promise<void>;
declare const forSample: (path: Directories) => (files: string[], callback: (source: string, label: Label) => void) => Promise<void>;

declare const utils_getSample: typeof getSample;
declare const utils_dev: typeof dev;
declare const utils_forRule: typeof forRule;
declare const utils_forSample: typeof forSample;
declare namespace utils {
  export {
    utils_getSample as getSample,
    utils_dev as dev,
    utils_forRule as forRule,
    utils_forSample as forSample,
  };
}

export { utils as default };
