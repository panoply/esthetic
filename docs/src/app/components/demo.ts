import { Controller } from '@hotwired/stimulus';
import { Rules } from 'esthetic';
import papyrus, { Model, Languages, MountOptions } from 'papyrus';
import merge from 'mergerino';

const rules = (ruleOptions: Rules) => merge({
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

  input: Model;
  output: Model;

  /**
   * Stimulus: Targets
   */
  static targets = [
    'editor',
    'rules',
    'cover',
    'gear',
    'demo',
    'wrap',
    'count',
    'before',
    'after',
    'range',
    'input',
    'output'
  ];

  min: number;
  max: number;

  /**
   * Stimulus: Values
   */
  static values = {
    mode: String,
    rules: Object,
    original: String,
    input: String,
    language: String,
    papyrus: Object
  };

  getEditorRect () {

    const ih = this.inputTarget.getBoundingClientRect().height;
    const oh = this.outputTarget.getBoundingClientRect().height;
    const sh = this.output.code.scrollHeight;

    let height = ih;

    if (oh > ih) {
      height = oh;
    } else if (ih > oh) {
      height = ih;
    }

    if (height < sh) height = sh + 5;

    const max = height;

    this.input.pre.style.minHeight = max + 'px';
    this.input.pre.style.maxHeight = max + 'px';

    this.output.pre.style.maxHeight = max + 0 + 'px';
    this.output.pre.style.minHeight = max + 0 + 'px';

  }

  initialize () {

    if (!this.hasModeValue) this.modeValue = 'editor';

  }

  connect () {

    if (this.modeValue === 'example') {

      this.exampleRule();

    } else {

      this.sideBySide();
    }

  }

  exampleRule () {

    this.input = papyrus.mount(this.inputTarget, {
      editor: false,
      showSpace: true,
      language: this.languageValue
    });

    this.originalValue = this.inputValue;

  }

  sideBySide () {

    if (this.hasPapyrusValue) {
      this.papyrusValue = merge<MountOptions>({
        editor: false,
        lineHighlight: false,
        showSpace: true,
        language: this.languageValue
      }, this.papyrusValue);
    } else {
      this.papyrusValue = {
        editor: false,
        lineHighlight: false,
        showSpace: true,
        language: this.languageValue
      };
    }

    this.input = papyrus.mount(this.inputTarget, {
      editor: true,
      showSpace: false,
      language: this.languageValue
    });

    this.languageValue = this.input.language;
    this.input.onUpdate(this.onEdit, this);
    this.output = papyrus.mount(this.outputTarget, this.papyrusValue);

    this.getEditorRect();

  }

  onShow () {

    const output = esthetic.format(this.inputValue, rules(this.rulesValue));

    this.output.update(output);
    this.coverTarget.classList.add('d-none');
    this.coverTarget.nextElementSibling.classList.remove('d-none');

    this.getEditorRect();

  }

  onCover (event: MouseEvent) {

    this.gearTargets.forEach(target => {
      if (event.type === 'mouseout') {
        target.setAttribute('attributeName', 'none');
      } else {
        if (target.getAttribute('attributeName') !== 'transform') {
          target.setAttribute('attributeName', 'transform');
        }
      }
    });

  }

  onTable () {

    const data = JSON.stringify(esthetic.parse(this.inputValue), null, 2);

    this.output.update(data, 'json');

  }

  onEdit (value: string) {

    if (this.modeValue === 'rules') {

      this.onShow();

      try {

        this.rulesValue = JSON.parse(value);

        try {

          const output = esthetic.format(this.inputValue, this.rulesValue);

          this.output.update(output);

          return value;

        } catch (e) {

          this.output.showError(e, {
            heading: 'Error thrown by Æsthetic'
          });

        }

      } catch (e) {

        this.output.showError(e.message, {
          heading: 'Invalid JSON Syntax'
        });

      }

    } else {

      this.onShow();

      try {

        this.inputValue = value;

        const output = esthetic.format(value, this.rulesValue);

        this.output.update(output);

      } catch (e) {

        this.output.showError(e, {
          heading: 'Error thrown by Æsthetic'
        });
      }
    }

  }

  doRestore () {

    if (this.output) {
      this.input.update(this.inputValue, this.languageValue);
      this.output.hideError();
    } else {
      const output = esthetic.format(this.inputValue, rules(this.rulesValue));
      this.input.update(output, this.languageValue);
    }
  }

  doRules () {

    const output = JSON.stringify(this.rulesValue, null, 2);
    this.input.update(output, 'json');

  }

  doFormat () {

    // if (this.modeValue === 'rules') {
    //   const output = esthetic.format(this.inputValue, this.rulesValue);
    //   this.code.update(output, this.languageValue);
    // } else {
    //   const output = esthetic.format(this.code.raw, this.rulesValue);
    //   this.output.update(output);
    // }

    esthetic.rules(this.rules);

  }

  doWrap (value: number, [ lexer, rule = null ]: string[]) {

    if (rule === null) {

      const output = esthetic.format(this.inputValue, rules(Object.assign(this.rulesValue, { [lexer]: value })));
      this.countTarget.innerHTML = `${value}`;
      this.wrapTarget.style.width = `${value}%`;
      this.input.update(output);

    }

  }

  onForm ({ target }: { target: HTMLInputElement, type: string; name: string; value: number }) {

    if (target.type === 'range') {
      return this.doWrap(target.valueAsNumber, target.name.split('.'));
    }

  }

  onReset () {

    this.inputValue = this.originalValue;
    this.input.update(this.inputValue);

  }

  /**
   * Clicked `rules` button in the example
   */
  onRules () {

    if (this.modeValue === 'rules') return;

    if (this.editorTarget.classList.contains('is-active')) {
      this.editorTarget.classList.remove('is-active');
    }

    if (!this.rulesTarget.classList.contains('is-active')) {
      this.rulesTarget.classList.add('is-active');
    }

    // if (this.editorValue) this.code.disable();

    this.modeValue = 'rules';
    this.doRules();

  }

  /**
   * Clicked `before` tab in the example
   */
  onInput () {

    if (this.modeValue === 'editor') return;

    if (this.output) this.output.hideError();

    if (this.rulesTarget.classList.contains('is-active')) {
      this.rulesTarget.classList.remove('is-active');
    }

    if (!this.editorTarget.classList.contains('is-active')) {
      this.editorTarget.classList.add('is-active');
    }

    this.doRestore();
    this.modeValue = 'editor';

  }

  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */

  /** The count element used in example range */
  countTarget: HTMLElement;
  /** The Papyrus options  */
  papyrusValue: MountOptions;
  /** Whether or not custom papyrus configuration was provided */
  hasPapyrusValue: boolean;
  /** The current code of the example */
  modeValue: 'editor' | 'rules' | 'demo' | 'example';
  /** Whether or not a mode value was provided */
  hasModeValue: boolean;
  /** The rules to use when formatting code with Æsthetic */
  rulesValue: Rules;
  /** The language name */
  languageValue: Languages;
  /** Whether or not rules value was provided */
  hasRulesValue: boolean;
  /** Rules cache */
  rules: Rules;
  /** The input tab target provided on initial render  */
  editorTarget: HTMLPreElement;
  /** The input code target provided on initial render  */
  inputTarget: HTMLPreElement;
  /** The input value escaped string */
  inputValue: string;
  /** The input code target provided on initial render  */
  gearTargets: HTMLElement[];
  /** The input code target provided on initial render  */
  coverTarget: HTMLPreElement;
  /** The input value before edits */
  originalValue: string;
  /** The output code target provided on initial render  */
  outputTarget: HTMLPreElement;
  /** The output value escaped string */
  outputValue: string;
  /** The wrap line overlay target */
  wrapTarget: HTMLElement;
  /** Whether or not rules value was provided */
  hasWrapTarget: boolean;
  /** The range slider form input element (use for wrap examples) */
  rangeTarget: HTMLInputElement;
  /** The `before` tab button */
  beforeTarget: HTMLButtonElement;
  /** Whether or not the `before` tab exists */
  hasBeforeTarget: boolean;
  /** The `rules` tab button */
  rulesTarget: HTMLButtonElement;
  /** Whether or not the `rules` tab exists */
  hasRulesTarget: boolean;
  /** The edit mode status to signal whether or not editing is enabled */
  editorValue: boolean;

}
