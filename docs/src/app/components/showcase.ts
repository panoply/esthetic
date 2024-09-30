import { parseJSON } from '../utilities/common';
import { Rules } from 'esthetic';
import papyrus, { Papyrus } from 'papyrus';
import merge from 'mergerino';
import spx, { SPX } from 'spx'

export class Showcase extends spx.Component<typeof Showcase.define> {

  static rules: Map<string, Rules> = new Map();
  static source: Map<string, string> = new Map();

  static define = {
    nodes: [

      /* EDITOR RELATED ----------------------------- */

      'range',
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
      height: Number,
      step: Number,
      rulesOriginal: Object,
      input: String,
      inputOriginal: String,
      language: String,
      tab: Number,
      boundWrap: Number,
      preset: {
        typeof: String,
        persist: true
      }
    }
  }

  get rulesInput () {

    return JSON.stringify(this.state.rules, null, 2);

  }

  updateRules (value?: Rules) {

    this.state.rules = merge(this.state.rules, value);

  }

  /**
   * Set max-height and min-height based on output bounding height
   */
  // getEditorRect () {

  //   const ih = this.inputNode.getBoundingClientRect().height;

  //   let height = ih;

  //   if (this.outputNode) {

  //     const oh = this.output.pre.getBoundingClientRect().height;
  //     const sh = this.output.code.scrollHeight;

  //     if (oh > ih) height = oh;
  //     if (height < sh) height = sh + 12;

  //     this.input.pre.style.minHeight = height + 'px';
  //     this.input.pre.style.height = height + 'px';
  //     this.input.pre.style.maxHeight = height + 'px';
  //     this.output.pre.style.maxHeight = height + 'px';
  //     this.output.pre.style.height = height + 'px';
  //     this.output.pre.style.minHeight = height + 'px';

  //   } else {

  //     const sh = this.input.code.scrollHeight  ;

  //     if (height < sh) height = sh + 5;

  //     this.input.pre.style.minHeight = height + 'px';
  //     this.input.pre.style.height = height + 'px';
  //     this.input.pre.style.maxHeight = height + 'px';

  //   }

  // }

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

    for (const [ uuid, rules ] of Showcase.rules) {

      const input = papyrus.get(`input:${uuid}`);
      const output = papyrus.get(`output:${uuid}`);
      const string = Showcase.source.get(uuid);

      const format = esthetic.format(string, rules);
      output.update(format, output.language);

    }
  }

  onPresetChange (event: { target: HTMLLIElement }) {

    if (this.state.preset !== event.target.id) {
      this.state.preset = event.target.id;
      localStorage.setItem('preset', this.state.preset);
      Showcase.rules.set(this.state.uuid, esthetic.preset(this.state.preset, this.state.rules));
      this.setPreset();
    }
  }

  connect() {

    papyrus();

  }

  onmount () {

   // this.state.preset = localStorage.getItem('preset') || 'default';
    this.input = papyrus.get(`input:${this.state.uuid}`);
    this.output = papyrus.get(`output:${this.state.uuid}`);

    this.input.onupdate(this.onInputEdit, this);
    this.input.onsave(this.onInputSave, this);

    this.onHeight()

   // this.setPreset();

  }

  unmount (): void {



  }


  onHeight () {

    const i = this.input.height()
    const o = this.output.height()

    if (i > o) {
      this.output.height(i)
    } else {
      this.input.height(o)
    }


  }


  formatCode (input: string = this.state.input) {

    try {

      const output = esthetic.format(input, this.state.rules);

      this.output.update(output);
      this.onHeight()

     // this.getEditorRect();
     // this.getOutputReact(this.input, this.output);

    } catch (e) {

      // eslint-disable-next-line no-control-regex
      const clean = /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/mg;

      this.output.error.show(e.replace(clean, ''), {
         heading: 'Error thrown by Æsthetic'
       });


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
      } : this.state.rules);

      this.input.update(output);
      this.output.update(output);

      this.onHeight()

    } catch (e) {

    }

  }

  onInputEdit (value: string) {


    if (this.state.mode === 'rules') {

      this.formatCode(this.state.input);

      try {

        this.state.rules = parseJSON(value);
        this.formatCode(this.state.input);
        this.timer = NaN;

        return value;

      } catch (error) {

        this.output.error.show(error, {
          title: 'JSON ERROR',
          heading: 'Invalid JSON Syntax',
        });

      }


    } else {

      this.state.input = value;
      this.formatCode(this.state.input);

    }


    this.onHeight()

  }


  onWrap ({ target }: SPX.InputEvent) {

    // @ts-ignore
    let wrap = Number(target.value)

    if(wrap < 1) {

      target.ariaLabel = 'Wrap Disabled'
      this.wrapLineNode.style.display = 'none'

    } else {

      target.ariaLabel = 'Word Wrap'
      this.wrapLineNode.style.display = ''

    }

    this.updateRules({ wrap })



    this.wrapCountNode.innerHTML = `${this.state.rules.wrap}`;
    this.wrapLineNode.style.borderColor = 'hotpink'
    this.wrapLineNode.style.transition = 'width linear';
    this.wrapLineNode.style.willChange = 'auto';


    this.wrapLineNode.style.width = `${this.state.step * wrap}px`;

    this.state.input = esthetic.format(this.state.input, this.state.rules);

    this.output.update(this.state.input);
    this.output.height(this.input.height())
    this.onHeight()

    target.onmouseup = () => this.wrapLineNode.style.removeProperty('borderColor')


    //this.updateRules({ wrap: +target.value })


  }

  wrapFormat() {

    const input = esthetic.format(this.state.input, this.state.rules);

    this.formatCode(input)

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

    const rules = Showcase.rules.get(this.state.uuid);
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
      this.input.update(this.rulesInput, 'json', true);

      this.formatCode();
    }

  }

  /**
   * Clicked `rules` button tab in the example
   */
  onClickRulesTab () {

    if(this.state.mode === 'rules') return;

    if (this.inputTabNode.classList.contains('is-active')) {
      this.inputTabNode.classList.remove('is-active');
    }

    if (!this.rulesTabNode.classList.contains('is-active')) {
      this.rulesTabNode.classList.add('is-active');
    }

    this.state.mode = 'rules';
    // this.input.editor.disable();
    this.input.update(this.rulesInput, 'json');

  }

  /**
   * Clicked `input` button tab in the example
   */
  onClickInputTab () {

    if(this.state.mode === 'editor') return;

    this.output.error.hide();

    if (this.rulesTabNode.classList.contains('is-active')) {
      this.rulesTabNode.classList.remove('is-active');
    }

    if (!this.inputTabNode.classList.contains('is-active')) {
      this.inputTabNode.classList.add('is-active');
    }

    this.state.mode = 'editor';
    this.input.update(this.state.input, this.state.language, true)


  }

  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */

  input: Papyrus.Model;
  output: Papyrus.Model;

  /* TABS --------------------------------------- */

  inputTabNode: HTMLButtonElement;
  rulesTabNode: HTMLButtonElement;
  presetTabNode: HTMLButtonElement;
  presetTabNodes: HTMLButtonElement[];
  inputNode: HTMLPreElement;
  outputNode: HTMLPreElement;
  outputNodes: HTMLPreElement[];

  /* WRAP RULE ---------------------------------- */

  wrapCountNode: HTMLElement;
  wrapLineNode: HTMLElement;
  wrapRangeNode: HTMLInputElement;

  /* WRAP FRACTION RULE --------------------------- */

  wrapFractionCountNode: HTMLElement;
  wrapFractionLineNode: HTMLElement;
  wrapFractionRangeNode: HTMLInputElement;

}
