import {
  Rules,
  Options,
  MarkupOptions,
  ScriptOptions,
  StyleOptions,
  JSONOptions,
  Definitions
} from './prettify.d';

export interface Prettify {
  (source: string, rules?: Options): Promise<string>;
  config?: (options: Rules) => Rules;
  markup?: (source: string, rules?: MarkupOptions) => Promise<string>;
  script?: (source: string, rules?: ScriptOptions) => Promise<string>;
  style?: (source: string, rules?: StyleOptions) => Promise<string>;
  json?: (source: string, rules?: JSONOptions) => Promise<string>;
  definitions?: Definitions
}
