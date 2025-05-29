import { Rules } from 'esthetic';
import merge from 'mergerino';
import papyrus, { Papyrus } from 'papyrus';
import spx, { SPX } from 'spx';

import { parseJSON } from '../utilities/common';

esthetic.settings({
  persistRules: false
});

export class Showcase extends spx.Component({
  nodes: <const>[

    /* EDITOR RELATED ----------------------------- */

    'range',
    'rules',
    'rulesTab',
    'input',
    'inputTab',
    'presetTab',
    'output',
    'moloko',

    /* RULE REALTED ------------------------------- */

    'wrapCount',
    'inputWrapFractionRange',
    'wrapFractionCount',
    'wrapFractionLine',
    'wrapRange'

  ],
  state: {
    mode: String<'editor' | 'rules'>,
    uuid: String,
    rules: Object<Rules>,
    height: Number,
    wrap: Number,
    rulesOriginal: Object<Rules>,
    input: String,
    language: String,
    tab: Number,
    boundWrap: Number,
    preset: {
      typeof: String,
      persist: true
    }
  }
}) {

  static rules: Map<string, Rules> = new Map();
  static stash: { rules: Rules; input: string } = { rules: {}, input: '' };

  public edits: string;
  public input: Papyrus.Model;
  public output: Papyrus.Model;
  public wrapLine = spx.dom`
    <div
      class="wrap-line"
      style="display:none;margin-left:var(--padding-left)">
    </div>
  `;

  get rulesInput () {

    return JSON.stringify(this.state.rules, null, 2);

  }

  get code () { return Showcase.stash.input; }
  set code (code: string) { Showcase.stash.input = code; }
  get rules () { return Showcase.stash.rules; }
  set rules (rules: Rules) { Showcase.stash.rules = { ...rules }; }

  updateRules (value?: Rules) {

    this.state.rules = merge(this.state.rules, value);

  }

  connect () {

    this.rules = this.state.rules;
    this.code = this.state.input;

  }

  onmount () {

    papyrus();

    this.input = papyrus.get(`input:${this.state.uuid}`);
    this.output = papyrus.get(`output:${this.state.uuid}`);
    this.input.onupdate(this.onInputEdit, this);
    this.input.onsave(this.onInputSave, this);
    this.onHeight();

  }

  public unmount () {

  }

  onHeight () {

    const i = this.input.height();
    const o = this.output.height();

    if (i > o) {
      this.output.height(i);
    } else {
      this.input.height(o);
    }

  }

  formatCode (input: string = this.state.input) {

    try {

      const output = esthetic.format(input, this.state.rules);

      this.output.update(output);
      this.onHeight();

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
        arrayFormat: 'indent',
        objectIndent: 'indent',
        braceAllman: true,
        bracePadding: false,
        objectSort: false
      } : this.state.rules);

      this.output.update(output);

      this.onHeight();

    } catch (e) {

    }

  }

  onInputEdit (value: string) {

    if (this.state.mode === 'rules') {

      try {

        this.output.error.hide();
        this.state.rules = parseJSON(value);
        this.formatCode(this.edits);
        this.timer = NaN;

        return value;

      } catch (error) {

        this.output.error.show(error, {
          title: 'JSON ERROR',
          heading: 'Invalid JSON Syntax'
        });
      }

    } else {

      this.formatCode(this.input.input);

    }

    this.onHeight();

  }

  onWrap ({ target }: SPX.InputEvent) {

    let wordWrap = +target.value;

    if (wordWrap <= 20) {
      wordWrap = 0;
      target.ariaLabel = 'Wrap Disabled';
      this.wrapLine.style.display = 'none';
    } else {
      target.ariaLabel = 'Word Wrap';
      this.wrapLine.style.display = '';
    }

    this.updateRules({ wordWrap });

    this.wrapLine.style.borderColor = 'hotpink';
    this.wrapLine.style.left = wordWrap > 80 ? `${wordWrap + 2}%` : `${wordWrap + 2}%`;

    this.state.wrap = this.state.rules.wordWrap;
    this.state.input = esthetic.format(this.state.input, this.state.rules);

    this.output.update(this.state.input);
    this.output.height(this.input.height());

    this.onHeight();

    target.onpointerup = () => this.wrapLine.style.removeProperty('border-color');

  }

  wrapFormat () {

    const input = esthetic.format(this.state.input, this.state.rules);

    this.formatCode(input);

  }

  /* -------------------------------------------- */
  /* TABS                                         */
  /* -------------------------------------------- */

  onClickFormat () {

    const input = esthetic.format(this.input.input, this.state.rules);

    this.formatCode(input);

  }

  /**
   * Clicked `reset` button in the example
   */
  onClickResetButton () {

    if (this.state.mode === 'editor') {

      this.state.input = this.code;
      this.input.update(this.state.input, this.state.language, true);
      this.formatCode();

    } else if (this.state.mode === 'rules') {

      this.state.rules = this.rules;
      this.input.update(this.rulesInput, 'json', true);
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
    this.edits = this.input.input;
    this.input.update(this.rulesInput, 'json');

  }

  /**
   * Clicked `input` button tab in the example
   */
  onClickInputTab () {

    if (this.state.mode === 'editor') return;

    this.output.error.hide();

    if (this.rulesTabNode.classList.contains('is-active')) {
      this.rulesTabNode.classList.remove('is-active');
    }

    if (!this.inputTabNode.classList.contains('is-active')) {
      this.inputTabNode.classList.add('is-active');
    }

    this.state.mode = 'editor';
    this.input.update(this.state.input, this.state.language, true);

  }

}
