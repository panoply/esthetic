import { parseJSON } from '../utilities/common';
import { Rules } from 'esthetic';
import papyrus, { Model } from 'papyrus';
import merge from 'mergerino';
import spx from 'spx'

export class Demo extends spx.Component<typeof Demo.define> {

  static rules: Map<string, Rules> = new Map();
  static source: Map<string, string> = new Map();

  static define = {
    nodes: [

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

    ],
    state: {
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
    }
  }

  get rulesInput () {

    return JSON.stringify(this.state.rules, null, 2);

  }

  updateRules (value?: Rules) {

    this.state.rules = merge(this.state.rules, value);

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

    const ih = this.inputNode.getBoundingClientRect().height;

    let height = ih;

    if (this.hasoutputNode) {

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

    const label = `Preset (${this.state.preset})<span class="icon"></span>`;

    for (const target of document.querySelectorAll('[data-demo-target=presetTab]')) {

      if (target.parentElement.getAttribute('data-dropdown-selected-value') !== this.state.preset) {
        target.parentElement.setAttribute('data-dropdown-selected-value', this.state.preset);
      }

      if (target.innerHTML !== label) target.innerHTML = label;

      for (const node of target.nextElementSibling.children) {
        if (node.id !== this.state.preset) {
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

    if (this.state.preset !== event.target.id) {

      this.state.preset = event.target.id;
      localStorage.setItem('preset', this.state.preset);
      Demo.rules.set(this.state.uuid, esthetic.preset(this.state.preset, this.state.rules));
      this.setPreset();
    }
  }

  onmount () {

    this.state.preset = localStorage.getItem('preset') || 'default';

    this.input = papyrus.mount(this.inputNode, merge<papyrus.Options>(this.state.papyrus, {
      id: `input:${this.state.uuid}`,
      showSpace: true,
      input: this.state.input,
      showTab: false,
      showCR: false,
      showCRLF: false,
      showLF: false,
      editor: true
    }));

    this.input.onupdate(this.onInputEdit, this);
    this.input.onsave(this.onInputSave, this);

    if (this.outputNode) {

      this.output = papyrus.mount(this.outputNode, merge<papyrus.Options>(this.state.papyrus, {
        id: `output:${this.state.uuid}`,
        editor: false,
        showSpace: false,
        showTab: false,
        showCR: false,
        showCRLF: false,
        showLF: false
      }));

    }

    Demo.rules.set(this.state.uuid, esthetic.preset(this.state.preset, this.state.rules));
    Demo.source.set(this.state.uuid, this.state.input);

    this.getEditorRect();
    this.setPreset();

  }

  unmount (): void {

    if (this.input.complete) this.input.complete.destroy(true);

  }

  formatCode (input?: string) {

    try {

      const output = esthetic.format(input || this.state.input, Demo.rules.get(this.state.uuid));

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

      const output = esthetic.format(value, this.state.mode === 'rules' ? {
        language: 'json',
        json: {
          arrayFormat: 'indent',
          objectIndent: 'indent',
          braceAllman: true,
          bracePadding: false,
          objectSort: false
        }
      } : Demo.rules.get(this.state.uuid));

      return output;

    } catch (e) {

    }

  }

  onInputEdit (value: string) {

    console.log(this)

    if (this.state.mode === 'rules') {

      this.formatCode();
      this.getEditorRect();

      if (!isNaN(this.timer)) {
        window.clearTimeout(this.timer);
        this.timer = NaN;
      }

      this.timer = window.setTimeout(() => {

        try {

          this.state.rules = parseJSON(value);

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

      this.state.input = value;

      this.formatCode();
      this.getEditorRect();

    }

  }

  doWrap (value: number, [ lexer, rule = null ]: string[]) {

    if (rule === null) {

      const rules = Demo.rules.get(this.state.uuid);
      rules.wrap = value;

      const input = esthetic.format(this.input.raw, rules);

      this.wrapCountNode.innerHTML = `${value}`;
      this.wrapLineNode.style.width = `${value}%`;
      this.wrapLineNode.style.transition = 'width 50ms ease-in-out';
      this.wrapLineNode.style.willChange = 'auto';

      this.input.update(input);

    }

  }

  onWrapFraction ({ target }: { target: HTMLInputElement }) {

    const wrap = target.valueAsNumber + 15;

    this.wrapCountNode.innerHTML = `${target.valueAsNumber}`;
    this.wrapLineNode.style.width = `${target.valueAsNumber}%`;
    this.wrapLineNode.style.transition = 'width 50ms ease-in-out';
    this.wrapLineNode.style.willChange = 'auto';

    this.wrapFractionCountNode.innerHTML = `${target.valueAsNumber - Math.round(wrap / 6)}`;
    this.wrapFractionLineNode.style.width = `${target.valueAsNumber - Math.round(wrap / 6)}%`;
    this.wrapFractionLineNode.style.transition = 'width 50ms ease-in-out';
    this.wrapFractionLineNode.style.willChange = 'auto';
    this.wrapFractionRangeNode.value = `${target.valueAsNumber - Math.round(wrap / 6)}`;

    const rules = Demo.rules.get(this.state.uuid);
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

    if (this.state.mode === 'editor') {

      this.state.input = this.state.inputOriginal;
      this.input.update(this.state.input, this.state.language);

      this.formatCode();

    } else if (this.state.mode === 'rules') {

      this.state.rules = this.state.rulesOriginal;
      this.input.update(this.rulesInput, 'json');

      this.formatCode();
    }

  }

  /**
   * Clicked `rules` button tab in the example
   */
  onClickRulesTab () {

    if (this.state.mode === 'rules') return;

    if (this.inputTabNode.classList.contains('is-active')) {
      this.inputTabNode.classList.remove('is-active');
    }

    if (!this.rulesTabNode.classList.contains('is-active')) {
      this.rulesTabNode.classList.add('is-active');
    }

    this.state.mode = 'rules';
    // this.input.editor.disable();
    this.input.update(this.rulesInput, 'json', true);

  }

  /**
   * Clicked `input` button tab in the example
   */
  onClickInputTab () {

    if (this.state.mode === 'editor') return;

    if (this.output) this.output.hideError();

    if (this.rulesTabNode.classList.contains('is-active')) {
      this.rulesTabNode.classList.remove('is-active');
    }

    if (!this.inputTabNode.classList.contains('is-active')) {
      this.inputTabNode.classList.add('is-active');
    }

    if (this.hasoutputNode) {

      // this.input.editor.enable();
      this.input.update(this.state.input, this.state.language, true);
      this.output.hideError();

    } else {

      this.formatCode();
    }

    this.state.mode = 'editor';

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

  /* TABS --------------------------------------- */

  /**
   * The input tab element button
   */
  inputTabNode: HTMLButtonElement;
  /**
   * Whether or not an input tab target exists
   */
  hasInputTabNode: boolean;
  /**
   * The rules tab element button
   */
  rulesTabNode: HTMLButtonElement;
  /**
   * Whether or not an rules tab target exists
   */
  hasRulesTabNode: boolean;
  /**
   * The preset tab element button
   */
  presetTabNode: HTMLButtonElement;
  /**
   * The preset tab element button
   */
  presetTabNodes: HTMLButtonElement[];
  /**
   * Whether or not an preset tab target exists
   */
  hasPresetTabNode: boolean;

  /* INPUT DEMO --------------------------------- */

  /**
   * The input code target provided on initial render
   */
  inputNode: HTMLPreElement;

  /* OUTPUT DEMO -------------------------------- */

  /**
   * The output code target provided on initial render
   */
  outputNode: HTMLPreElement;
  /**
   * The output code target provided on initial render
   */
  outputNodes: HTMLPreElement[];
  /**
   * Whether or not an output target exists
   */
  hasOutputNode: boolean;

  /* WRAP RULE ---------------------------------- */

  /**
   * The count element used in example range
   */
  wrapCountNode: HTMLElement;
  /**
   * The wrap line overlay target
   */
  wrapLineNode: HTMLElement;
  /**
   * The `wrap` form range input element
   */
  wrapRangeNode: HTMLInputElement;
  /**
   * Whether or not `wrap` rule line target exists
   */
  hasWrapLineNode: boolean;

  /* WRAP FRACTION RULE --------------------------- */

  /**
   * The count element used in example range
   */
  wrapFractionCountNode: HTMLElement;
  /**
   * The wrapFraction line overlay target
   */
  wrapFractionLineNode: HTMLElement;
  /**
   * The `wrapFraction` form range input element
   */
  wrapFractionRangeNode: HTMLInputElement;

}
