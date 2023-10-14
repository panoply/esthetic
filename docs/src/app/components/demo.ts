import { Controller } from '@hotwired/stimulus';
import { parseJSON } from '../utilities/common';
import { Rules } from 'esthetic';
import papyrus, { Languages, Model } from 'papyrus';
import merge from 'mergerino';

export class Demo extends Controller {

  static rules: Map<string, Rules> = new Map();
  static source: Map<string, string> = new Map();

  /**
   * Stimulus: Targets
   */
  static targets = [

    /* EDITOR RELATED ----------------------------- */

    'rules',
    'rulesTab',
    'input',
    'inputTab',
    'presetTab',
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
    uuid: String,
    rules: Object,
    rulesOriginal: Object,
    input: String,
    inputOriginal: String,
    language: String,
    papyrus: Object,
    tab: Number,
    preset: String
  };

  get rulesInput () {

    return JSON.stringify(this.rulesValue, null, 2);

  }

  updateRules (value?: Rules) {

    this.rulesValue = merge(this.rulesValue, value);

  }

  getOutputReact (input: Model, output: Model) {

    const ih = input.pre.getBoundingClientRect().height;

    let height = ih;

    const oh = output.pre.getBoundingClientRect().height;
    const sh = output.code.scrollHeight;

    if (oh > ih) height = oh;
    if (height < sh) height = sh + 5;

    input.pre.style.minHeight = height + 'px';
    input.pre.style.maxHeight = height + 'px';
    output.pre.style.maxHeight = height + 'px';
    output.pre.style.minHeight = height + 'px';
  }

  /**
   * Set max-height and min-height based on output bounding height
   */
  getEditorRect () {

    const ih = this.inputTarget.getBoundingClientRect().height;

    let height = ih;

    if (this.hasOutputTarget) {

      const oh = this.output.pre.getBoundingClientRect().height;
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

  setPreset () {

    const label = `Preset (${this.presetValue})<span class="icon"></span>`;

    for (const target of document.querySelectorAll('[data-demo-target=presetTab]')) {

      if (target.parentElement.getAttribute('data-dropdown-selected-value') !== this.presetValue) {
        target.parentElement.setAttribute('data-dropdown-selected-value', this.presetValue);
      }

      if (target.innerHTML !== label) target.innerHTML = label;

      for (const node of target.nextElementSibling.children) {
        if (node.id !== this.presetValue) {
          if (node.classList.contains('selected')) {
            node.classList.remove('selected');
          }
        } else {
          if (!node.classList.contains('selected')) {
            node.classList.add('selected');
          }
        }
      }
    }

    for (const [ uuid, rules ] of Demo.rules) {

      const input = papyrus.get(`input:${uuid}`);
      const output = papyrus.get(`output:${uuid}`);
      const string = Demo.source.get(uuid);

      const format = esthetic.format(string, rules);
      output.update(format, output.language);

      const ih = input.code.getBoundingClientRect().height;

      let height = ih;

      const oh = output.code.getBoundingClientRect().height;
      const sh = output.code.scrollHeight;

      if (oh > ih) height = oh;
      if (height < sh) height = sh + 5;

      input.pre.style.minHeight = height + 'px';
      input.pre.style.maxHeight = height + 'px';
      output.pre.style.maxHeight = height + 'px';
      output.pre.style.minHeight = height + 'px';
    }

  }

  onPresetChange (event: { target: HTMLLIElement }) {

    if (this.presetValue !== event.target.id) {
      this.presetValue = event.target.id;
      localStorage.setItem('preset', this.presetValue);
      Demo.rules.set(this.uuidValue, esthetic.preset(this.presetValue, this.rulesValue));
      this.setPreset();
    }
  }

  connect () {

    this.presetValue = localStorage.getItem('preset') || 'default';

    this.input = papyrus.mount(this.inputTarget, merge<papyrus.Options>(this.papyrusValue, {
      id: `input:${this.uuidValue}`,
      showSpace: true,
      input: this.inputValue,
      showTab: false,
      showCR: false,
      showCRLF: false,
      showLF: false,
      editor: true
    }));

    this.input.onupdate(this.onInputEdit, this);
    this.input.onsave(this.onInputSave, this);

    if (this.hasOutputTarget) {

      this.output = papyrus.mount(this.outputTarget, merge<papyrus.Options>(this.papyrusValue, {
        id: `output:${this.uuidValue}`,
        editor: false,
        showSpace: false,
        showTab: false,
        showCR: false,
        showCRLF: false,
        showLF: false
      }));

    }

    Demo.rules.set(this.uuidValue, esthetic.preset(this.presetValue, this.rulesValue));
    Demo.source.set(this.uuidValue, this.inputValue);

    this.getEditorRect();
    this.setPreset();

  }

  disconnect (): void {

    if (this.input.complete) this.input.complete.destroy(true);

  }

  formatCode (input?: string) {

    try {

      const output = esthetic.format(input || this.inputValue, Demo.rules.get(this.uuidValue));

      if (input) {
        this.output.update(output);
      } else {
        this.formatCode(output);
      }

      this.getEditorRect();
      this.getOutputReact(this.input, this.output);

    } catch (e) {

      // eslint-disable-next-line no-control-regex
      const clean = /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/mg;

      this.output.showError(e.replace(clean, ''), { heading: 'Error thrown by Æsthetic' });
      this.getOutputReact(this.input, this.output);

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
      } : Demo.rules.get(this.uuidValue));

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

          this.output.showError(error, {
            title: 'JSON ERROR',
            heading: 'Invalid JSON Syntax',
            stack: error.stack
          });

          this.getOutputReact(this.input, this.output);
          this.timer = NaN;

        }

      }, 500);

    } else {

      this.inputValue = value;

      console.log(esthetic.rules());
      this.formatCode();
      this.getEditorRect();

    }

  }

  doWrap (value: number, [ lexer, rule = null ]: string[]) {

    if (rule === null) {

      const rules = Demo.rules.get(this.uuidValue);
      rules.wrap = value;

      const input = esthetic.format(this.input.raw, rules);

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

    const rules = Demo.rules.get(this.uuidValue);
    rules.wrap = wrap;
    rules.wrapFraction = wrap - Math.round((wrap / 6));

    const input = esthetic.format(this.input.raw, rules);

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
    // this.input.editor.disable();
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

      // this.input.editor.enable();
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

  uuidValue: string;
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
  /**
   * The preset tab element button
   */
  presetTabTarget: HTMLButtonElement;
  /**
   * The preset tab element button
   */
  presetTabTargets: HTMLButtonElement[];
  /**
   * Whether or not an preset tab target exists
   */
  hasPresetTabTarget: boolean;
  /**
   * The input value before edits
   */
  presetValue: string;

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
   * The output code target provided on initial render
   */
  outputTargets: HTMLPreElement[];
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
