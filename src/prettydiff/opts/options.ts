import { IMarkupOptions, IScriptOptions, IStyleOptions, IJSONOptions, IGlobalOptions } from '../../types/options';
import { SparserMarkup, SparserScript, SparserStyle } from '../../types/sparser';
import { PrettyDiffOptions } from '../../types/prettydiff';
import { markup, style, script, json } from './prettify';
export { markup, style, script, json } from './prettify';

export interface Definition {
  /**
   * The default setting
   */
  default: boolean | string[] | string | number;
  /**
   * Rules description
   */
  description: string;
  /**
   * Type
   */
  type: 'boolean' | 'array' | 'number' | 'string' | 'select';
  /**
   * The name of the rule
   */
  rule: string;
  /**
   * An optional list of pre-selected rule values.
   */
  values?: {
    /**
     * The rule value
     */
    rule: string;
    /**
     * Rule value description
     */
    description: string;
  }[]
}

export function options (config: IGlobalOptions = {}): {
  markup: {
    prettify: IMarkupOptions;
    prettydiff: PrettyDiffOptions;
    sparser: SparserMarkup;
    definition: Definition;
  };
  style: {
    prettify: IStyleOptions;
    prettydiff: PrettyDiffOptions;
    sparser: SparserStyle;
    definition: Definition;
  };
  script: {
    prettify: IScriptOptions;
    prettydiff: PrettyDiffOptions;
    sparser: SparserScript;
    definition: Definition;
  };
  json: {
    prettify: IJSONOptions;
    prettydiff: PrettyDiffOptions;
    sparser: SparserScript;
    definition: Definition;
  }
} {

  const o = Object.create(null);

  o.markup = 'markup' in config
    ? markup(config.markup)
    : markup();

  o.style = 'style' in config
    ? style(config.style)
    : style();

  o.script = 'script' in config
    ? script(config.script)
    : script();

  o.json = 'json' in config
    ? json(config.json)
    : json();

  return o;

};
