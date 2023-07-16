import { Controller } from '@hotwired/stimulus';
import { parseJSON } from '../utilities/common';
import { Rules } from 'esthetic';
import papyrus, { Languages } from 'papyrus';
import merge from 'mergerino';
import JSONCompletions from '../completions/rules';

const rules = (ruleOptions: Rules) => merge<Rules>({
  crlf: false,
  correct: false,
  preset: 'default',
  language: 'auto',
  endNewline: false,
  indentChar: ' ',
  indentLevel: 0,
  indentSize: 2,
  preserveLine: 2,
  wrap: 0,
  wrapFraction: 0,
  liquid: {
    commentNewline: false,
    commentIndent: true,
    delimiterTrims: 'preserve',
    delimiterPlacement: 'preserve',
    forceFilter: 0,
    forceArgument: 0,
    ignoreTagList: [],
    indentAttribute: false,
    lineBreakSeparator: 'before',
    normalizeSpacing: true,
    preserveComment: false,
    preserveInternal: false,
    dedentTagList: [],
    quoteConvert: 'none'
  },
  markup: {
    attributeCasing: 'preserve',
    attributeSort: false,
    commentNewline: false,
    commentIndent: true,
    delimiterTerminus: 'inline',
    forceAttribute: 3,
    forceAttributeValue: true,
    forceIndent: false,
    ignoreCSS: false,
    ignoreJS: true,
    ignoreJSON: false,
    lineBreakValue: 'preserve',
    preserveComment: false,
    preserveText: false,
    preserveAttribute: false,
    selfCloseSpace: true,
    selfCloseSVG: true,
    stripAttributeLines: false,
    quoteConvert: 'none'
  },
  json: {
    arrayFormat: 'default',
    braceAllman: false,
    bracePadding: false,
    objectIndent: 'default',
    objectSort: false,

    braceStyle: 'none',
    caseSpace: false,
    commentIndent: false,
    commentNewline: false,
    correct: false,
    elseNewline: false,
    functionNameSpace: false,
    functionSpace: false,
    methodChain: 4,
    neverFlatten: false,
    noCaseIndent: false,
    preserveComment: false,
    styleGuide: 'none',
    ternaryLine: false,
    variableList: 'none',

    quoteConvert: 'double',
    endComma: 'never',
    noSemicolon: true,
    vertical: false
  },
  style: {
    commentIndent: false,
    commentNewline: false,
    atRuleSpace: true,
    classPadding: false,
    noLeadZero: false,
    preserveComment: false,
    sortSelectors: false,
    sortProperties: false,
    quoteConvert: 'none'
  },
  script: {
    arrayFormat: 'default',
    braceNewline: false,
    bracePadding: false,
    braceStyle: 'none',
    braceAllman: false,
    caseSpace: false,
    commentIndent: false,
    commentNewline: false,
    elseNewline: false,
    endComma: 'never',
    functionNameSpace: false,
    functionSpace: false,
    inlineReturn: true,
    methodChain: 4,
    neverFlatten: false,
    noCaseIndent: false,
    noSemicolon: false,
    objectSort: false,
    objectIndent: 'default',
    preserveComment: false,
    quoteConvert: 'none',
    styleGuide: 'none',
    ternaryLine: false,
    variableList: 'none',
    vertical: false
  }
}, ruleOptions);

export class Demo extends Controller {

  /**
   * Stimulus: Targets
   */
  static targets = [

    /* EDITOR RELATED ----------------------------- */

    'rules',
    'rulesTab',
    'input',
    'inputTab',
    'output',

    /* RULE REALTED ------------------------------- */

    'wrapLine',
    'wrapCount',
    'wrapFractionRange',
    'wrapFractionCount',
    'wrapFractionLine',
    'wrapRange'

  ];

  /**
   * Stimulus: Values
   */
  static values = {
    mode: String,
    rules: Object,
    rulesOriginal: Object,
    input: String,
    inputOriginal: String,
    language: String,
    papyrus: Object,
    tab: Number
  };

  get rulesInput () {

    return JSON.stringify(this.rulesValue, null, 2);

  }

  /**
   * Set max-height and min-height based on output bounding height
   */
  getEditorRect () {

    const ih = this.inputTarget.getBoundingClientRect().height;

    let height = ih;

    if (this.hasOutputTarget) {

      const oh = this.outputTarget.getBoundingClientRect().height;
      const sh = this.output.code.scrollHeight;

      if (oh > ih) height = oh;
      if (height < sh) height = sh + 5;

      this.input.pre.style.minHeight = height + 'px';
      this.input.pre.style.maxHeight = height + 'px';
      this.output.pre.style.maxHeight = height + 'px';
      this.output.pre.style.minHeight = height + 'px';

    } else {

      const sh = this.input.code.scrollHeight;

      if (height < sh) height = sh + 5;

      this.input.pre.style.minHeight = height + 'px';
      this.input.pre.style.maxHeight = height + 'px';

    }

  }

  connect () {

    this.input = papyrus.mount(this.inputTarget, merge<papyrus.Options>({
      showSpace: true,
      showTab: false,
      editor: {
        completions: {
          json: JSONCompletions
        }
      }
    }, this.papyrusValue));

    this.input.onupdate(this.onInputEdit, this);
    this.input.onsave(this.onInputSave, this);

    if (this.hasOutputTarget) {

      this.output = papyrus.mount(this.outputTarget, merge<papyrus.Options>({
        editor: false,
        showSpace: true,
        showTab: true
      }, this.papyrusValue));

    }

    this.getEditorRect();

  }

  disconnect (): void {

    if (this.input.complete) this.input.complete.destroy(true);

  }

  formatCode (input?: string) {

    try {
      const output = esthetic.format(input || this.inputValue, rules(this.rulesValue));
      if (input) {
        this.output.update(output);
      } else {
        this.formatCode(output);
      }
    } catch (e) {
      this.output.showError(e, { heading: 'Error thrown by Æsthetic' });
    }

  }

  timer: number = NaN;

  onInputSave (value: string) {

    if (!isNaN(this.timer)) {
      window.clearTimeout(this.timer);
      this.timer = NaN;
    }

    try {

      const output = esthetic.format(value, this.modeValue === 'rules' ? {
        language: 'json',
        json: {
          arrayFormat: 'indent',
          objectIndent: 'indent',
          braceAllman: true,
          bracePadding: false,
          objectSort: false
        }
      } : rules(this.rulesValue));

      return output;

    } catch (e) {

    }

  }

  onInputEdit (value: string) {

    if (this.modeValue === 'rules') {

      this.formatCode();
      this.getEditorRect();

      if (!isNaN(this.timer)) {
        window.clearTimeout(this.timer);
        this.timer = NaN;
      }

      this.timer = window.setTimeout(() => {

        try {

          this.rulesValue = parseJSON(value);
          this.formatCode();
          this.timer = NaN;

          return value;

        } catch (error) {

          this.output.showError(error.message, {
            title: 'JSON ERROR',
            heading: 'Invalid JSON Syntax',
            stack: error.stack
          });

          this.timer = NaN;

        }

      }, 1500);

    } else {

      this.inputValue = value;
      this.formatCode();
      this.getEditorRect();

    }

  }

  doWrap (value: number, [ lexer, rule = null ]: string[]) {

    if (rule === null) {

      this.rulesValue.wrap = value;

      const input = esthetic.format(this.input.raw, rules({ ...this.rulesValue, wrap: value }));

      this.wrapCountTarget.innerHTML = `${value}`;
      this.wrapLineTarget.style.width = `${value}%`;
      this.wrapLineTarget.style.transition = 'width 50ms ease-in-out';
      this.wrapLineTarget.style.willChange = 'auto';

      this.input.update(input);

    }

  }

  onWrapFraction ({ target }: { target: HTMLInputElement }) {

    const wrap = target.valueAsNumber + 15;

    this.wrapCountTarget.innerHTML = `${target.valueAsNumber}`;
    this.wrapLineTarget.style.width = `${target.valueAsNumber}%`;
    this.wrapLineTarget.style.transition = 'width 50ms ease-in-out';
    this.wrapLineTarget.style.willChange = 'auto';

    this.wrapFractionCountTarget.innerHTML = `${target.valueAsNumber - Math.round(wrap / 6)}`;
    this.wrapFractionLineTarget.style.width = `${target.valueAsNumber - Math.round(wrap / 6)}%`;
    this.wrapFractionLineTarget.style.transition = 'width 50ms ease-in-out';
    this.wrapFractionLineTarget.style.willChange = 'auto';
    this.wrapFractionRangeTarget.value = `${target.valueAsNumber - Math.round(wrap / 6)}`;

    const input = esthetic.format(this.input.raw, rules({
      ...this.rulesValue,
      wrap,
      wrapFraction: wrap - Math.round((wrap / 6))
    }));

    this.input.update(input);

  }

  onForm ({ target, name }: { target: HTMLInputElement, type: string; name: string; value: number }) {

    if (target.type === 'range') {

      if (target.name === 'wrap') {

        this.doWrap(target.valueAsNumber, target.name.split('.'));

      }

    }

  }

  /* -------------------------------------------- */
  /* TABS                                         */
  /* -------------------------------------------- */

  /**
   * Clicked `reset` button in the example
   */
  onClickResetButton () {

    if (this.modeValue === 'editor') {

      this.inputValue = this.inputOriginalValue;
      this.input.update(this.inputValue, this.languageValue);
      this.formatCode();

    } else if (this.modeValue === 'rules') {

      this.rulesValue = this.rulesOriginalValue;
      this.input.update(this.rulesInput, 'json');
      this.formatCode();
    }

  }

  /**
   * Clicked `rules` button tab in the example
   */
  onClickRulesTab () {

    if (this.modeValue === 'rules') return;

    if (this.inputTabTarget.classList.contains('is-active')) {
      this.inputTabTarget.classList.remove('is-active');
    }

    if (!this.rulesTabTarget.classList.contains('is-active')) {
      this.rulesTabTarget.classList.add('is-active');
    }

    this.modeValue = 'rules';
    this.input.update(this.rulesInput, 'json', true);

  }

  /**
   * Clicked `input` button tab in the example
   */
  onClickInputTab () {

    if (this.modeValue === 'editor') return;

    if (this.output) this.output.hideError();

    if (this.rulesTabTarget.classList.contains('is-active')) {
      this.rulesTabTarget.classList.remove('is-active');
    }

    if (!this.inputTabTarget.classList.contains('is-active')) {
      this.inputTabTarget.classList.add('is-active');
    }

    if (this.hasOutputTarget) {
      this.input.update(this.inputValue, this.languageValue, true);
      this.output.hideError();
    } else {
      this.formatCode();
    }

    this.modeValue = 'editor';

  }

  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */

  /**
   * Papyrus Input
   */
  input: papyrus.Model;
  /**
   * Papyrus Output
   */
  output: papyrus.Model;

  /* MODE --------------------------------------- */

  /**
   * The current mode
   */
  modeValue: 'editor' | 'rules' | 'demo' | 'example';
  /**
   * Whether or not a mode value was provided
   */
  hasModeValue: boolean;

  /* LANGUAGE ----------------------------------- */

  /**
   * The language name
   */
  languageValue: Languages;

  /* PAPYRUS ------------------------------------ */

  /**
   * The Papyrus options
   */
  papyrusValue: papyrus.Options;
  /**
   * Whether or not custom papyrus configuration was provided
   */
  hasPapyrusValue: boolean;

  /* RULES -------------------------------------- */

  /**
   * The rules to use when formatting code with Æsthetic
   */
  rulesValue: Rules;
  /**
   * The original value before edits, used to reset
   */
  rulesOriginalValue: Rules;
  /**
   * Whether or not rules value was provided
   */
  hasRulesValue: boolean;

  /* TABS --------------------------------------- */

  /**
   * The input tab element button
   */
  inputTabTarget: HTMLButtonElement;
  /**
   * Whether or not an input tab target exists
   */
  hasInputTabTarget: boolean;
  /**
   * The rules tab element button
   */
  rulesTabTarget: HTMLButtonElement;
  /**
   * Whether or not an rules tab target exists
   */
  hasRulesTabTarget: boolean;

  /* INPUT DEMO --------------------------------- */

  /**
   * The input code target provided on initial render
   */
  inputTarget: HTMLPreElement;
  /**
   * The input value escaped string
   */
  inputValue: string;
  /**
   * The input value before edits
   */
  inputOriginalValue: string;

  /* OUTPUT DEMO -------------------------------- */

  /**
   * The output code target provided on initial render
   */
  outputTarget: HTMLPreElement;
  /**
   * The output value escaped string
   */
  outputValue: string;
  /**
   * Whether or not an output target exists
   */
  hasOutputTarget: boolean;

  /* WRAP RULE ---------------------------------- */

  /**
   * The count element used in example range
   */
  wrapCountTarget: HTMLElement;
  /**
   * The wrap line overlay target
   */
  wrapLineTarget: HTMLElement;
  /**
   * The `wrap` form range input element
   */
  wrapRangeTarget: HTMLInputElement;
  /**
   * Whether or not `wrap` rule line target exists
   */
  hasWrapLineTarget: boolean;

  /* WRAP FRACTION RULE --------------------------- */

  /**
   * The count element used in example range
   */
  wrapFractionCountTarget: HTMLElement;
  /**
   * The wrapFraction line overlay target
   */
  wrapFractionLineTarget: HTMLElement;
  /**
   * The `wrapFraction` form range input element
   */
  wrapFractionRangeTarget: HTMLInputElement;

}
