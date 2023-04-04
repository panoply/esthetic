import { Controller, Context } from '@hotwired/stimulus';
import type { Rules } from 'esthetic'
import esthetic from 'esthetic';
import { CodeJar } from 'codejar'
import { Prism } from '../utilities/prism';


export class Example extends Controller {

  /**
   * Stimulus: Targets
   */
  static targets = [
    'editor',
    'wrap',
    'wrapSize',
    'rules',
    'demo',
    'before',
    'after',
    'range',
    'input',
    'lines',
  ]

  /**
   * Stimulus: Values
   */
  static values = {
    mode: String,
    rules: Object,
    input: String,
    editor: Boolean
  };


  getLines (input: string) {

    const split = input.split('\n')
    const numbers = [ ...Array(split.length) ]
    const lines = numbers.map((_, i) => (`<span class="line-number">${i + 1}</span><br>`))

    return lines.join('')

  }



  getEditorRect () {

    const { height, width } = this.inputTarget.parentElement.getBoundingClientRect()

    const input = this.inputTarget.parentElement


    input.style.minHeight = height + 'px'
    input.style.maxHeight = height + 'px'
    input.style.maxWidth = width + 'px'
    input.style.minWidth = width + 'px'



  }


  initialize (): void {

    if(!this.hasModeValue) this.modeValue = 'before'

    this.rules = esthetic.rules()

  }


  connect(): void {

    this.input = this.inputTarget.innerHTML
    this.lines = this.linesTarget.innerHTML

    if(this.hasWrapTarget) {
      this.rangeTarget.value = `${this.rulesValue.wrap}`
      this.wrapTarget.style.width = `${this.rulesValue.wrap}%`
    }

  }

  doRestore () {

    this.inputTarget.innerHTML = this.input
    this.linesTarget.innerHTML = this.lines

    if(this.editorValue) this.onEdit()

  }

  doRules () {

    const output = JSON.stringify(this.rulesValue, null, 2)

    this.inputTarget.innerHTML = this.getLines(output)
    this.inputTarget.innerHTML = Prism.highlight(output, Prism.languages.js, 'js')

    console.log(output)

  }

  doFormat () {

    const output = esthetic.format(this.inputValue, this.rulesValue)

    this.linesTarget.innerHTML = this.getLines(output)
    this.inputTarget.innerHTML = Prism.highlight(output, Prism.languages.html, 'html')

    esthetic.rules(this.rules)

  }


  doWrap (value: number, [ lexer, rule = null ]: string[]) {

    if(rule === null) {

      setTimeout(() => {

        this.rulesValue = Object.assign(this.rulesValue, { [lexer]: value });

        const output = esthetic.format(this.inputValue, this.rulesValue);

        this.wrapSizeTarget.innerHTML = `${this.rulesValue.wrap}`
        this.wrapTarget.style.width = `${this.rulesValue.wrap}%`
        this.linesTarget.innerHTML = this.getLines(output)
        this.inputTarget.innerHTML = Prism.highlight(output, Prism.languages.html, 'html')

      }, 50)
    }

  }

  onResize () {



    this.inputTarget.style.userSelect = 'none'
    this.wrapTarget.style.borderColor = '#e45589'


    const offset = this.wrapTarget.parentElement.offsetWidth


    //on mouseup remove windows functions mousemove & mouseup

    const moveResize = (e: MouseEvent) => {

      const wrap = Math.round(Math.abs(((offset - (offset + e.offsetX)) / offset) * 100))

      if(wrap >= 100 || wrap <= 0) return

      this.wrapSizeTarget.innerHTML = `${wrap}`
      this.rangeTarget.value = `${wrap}`
      this.rulesValue = Object.assign(this.rulesValue, { wrap });

      const output = esthetic.format(this.inputValue, this.rulesValue);


      this.wrapTarget.style.width = `${wrap - 0.5}%`
      this.linesTarget.innerHTML = this.getLines(output)
      this.inputTarget.innerHTML = Prism.highlight(output, Prism.languages.html, 'html')

    }

    const stopResize = () => {
      this.inputTarget.style.userSelect = ''
      removeEventListener('mousemove', moveResize, false);
      removeEventListener('mouseup', stopResize, false);
    }


    addEventListener('mouseup', stopResize, false);
    addEventListener('mousemove', moveResize, false);

  }

  onForm({ target}: { target: HTMLInputElement, type: string; name: string; value: number }) {

    if(target.type === 'range') return this.doWrap(target.valueAsNumber, target.name.split('.'))

  }

  /**
   * Clicked `edit` button in the example
   */
  onEdit () {

    if(this.editorTarget.classList.contains('enabled')) {
      this.editorTarget.classList.remove('enabled')
      this.editorTarget.setAttribute('aria-label', 'Click to enable editing')
      this.editorValue = false
    } else {
      this.editorTarget.classList.add('enabled')
      this.editorTarget.setAttribute('aria-label', 'Click to disable editing')
      this.editorValue = true
    }

    if(this.editorValue) {

      this.codejar = CodeJar(this.inputTarget, (editor) => {
        const output = Prism.highlight(editor.innerText, Prism.languages.html, 'html')
        editor.innerHTML = this.input = output
      })

      this.codejar.onUpdate(code => {
        this.linesTarget.innerHTML = this.lines = this.getLines(code)
        this.inputValue = code
      })

    } else {

      this.codejar.destroy()

      if(this.modeValue === 'before') this.doRestore()

    }


  }

  onDemo () {

    if (this.modeValue === 'demo') return

    if(this.editorValue && this.editorTarget.classList.contains('d-none')) {
      this.editorTarget.classList.remove('d-none')
    }

    if(this.hasWrapTarget && this.wrapTarget.classList.contains('d-none')) {
      this.wrapTarget.classList.remove('d-none')
    }

    if(this.rulesTarget.classList.contains('selected')) {
      this.rulesTarget.classList.remove('selected')
    }


    if(!this.demoTarget.classList.contains('selected')) {
      this.demoTarget.classList.add('selected')
    }

    this.doFormat()
    this.modeValue = 'demo'


  }


  /**
   * Clicked `rules` button in the example
   */
  onRules () {

    if (this.modeValue === 'rules') return

    if(this.hasAfterTarget && this.afterTarget.classList.contains('selected')) {
      this.afterTarget.classList.remove('selected')
    }

    if(this.hasBeforeTarget && this.beforeTarget.classList.contains('selected')) {
      this.beforeTarget.classList.remove('selected')
    }


    if(this.hasDemoTarget && this.demoTarget.classList.contains('selected')) {
      this.demoTarget.classList.remove('selected')

      if(this.hasWrapTarget && !this.wrapTarget.classList.contains('d-none')) {
        this.wrapTarget.classList.add('d-none')
      }
    }

    if(!this.editorTarget.classList.contains('d-none')) {
      this.editorTarget.classList.add('d-none')
    }


    if(!this.rulesTarget.classList.contains('selected')) {
      this.rulesTarget.classList.add('selected')
    }

    if(this.editorValue) this.codejar.destroy()

    this.doRules()
    this.modeValue = 'rules'

  }

  /**
   * Clicked `before` tab in the example
   */
  onBefore () {


    if (this.modeValue === 'before') return

    if(this.afterTarget.classList.contains('selected')) {
      this.afterTarget.classList.remove('selected')
    }

    if(this.rulesTarget.classList.contains('selected')) {
      this.rulesTarget.classList.remove('selected')
    }

    if(this.editorValue && this.editorTarget.classList.contains('d-none')) {
      this.editorTarget.classList.remove('d-none')
    }

    if(this.beforeTarget.classList.contains('selected')) {
      this.beforeTarget.classList.add('selected')
    }

    this.doRestore()
    this.modeValue = 'before'


  }


  /**
   * Clicked `after` tab in the example
   */
  onAfter () {

    if (this.modeValue === 'after') return

    if(this.beforeTarget.classList.contains('selected')) {
      this.beforeTarget.classList.remove('selected')
    }

    if(this.rulesTarget.classList.contains('selected')) {
      this.rulesTarget.classList.remove('selected')
    }

    if(!this.editorTarget.classList.contains('d-none')) {
      this.editorTarget.classList.add('d-none')
    }

    if(!this.afterTarget.classList.contains('selected')) {
      this.afterTarget.classList.add('selected')
    }

    if(this.editorValue) this.codejar.destroy()

    this.doFormat()
    this.modeValue = 'after'


  }

  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */


  resize: boolean;
  /** The current code of the example */
  modeValue: 'before' | 'after' | 'rules' | 'demo';
  /** Whether or not a mode value was provided */
  hasModeValue: boolean
  /** The rules to use when formatting code with Æsthetic */
  rulesValue: Rules;
  /** Whether or not rules value was provided */
  hasRulesValue: boolean;
  /** Rules cache */
  rules: Rules;
  /** The input code target provided on initial render  */
  inputTarget: HTMLElement;
  /** The input value escaped string */
  inputValue: string;
  /** Input cache */
  input: string
  /** The input code lines target provided on initial render */
  linesTarget: HTMLDivElement
  /** Lines cache */
  lines: string;
  /** The wrap line overlay target */
  wrapSizeTarget: HTMLDivElement;
  /** The wrap line overlay target */
  wrapTarget: HTMLElement;
  /** Whether or not rules value was provided */
  hasWrapTarget: boolean;
  /** The range slider form input element (use for wrap examples) */
  rangeTarget: HTMLInputElement;
  /** The `before` tab button */
  beforeTarget:  HTMLButtonElement;
  /** Whether or not the `before` tab exists */
  hasBeforeTarget: boolean;
  /** The `after` tab button */
  afterTarget: HTMLButtonElement;
  /** Whether or not the `after` tab exists */
  hasAfterTarget: boolean;
  /** The `rules` tab button */
  rulesTarget: HTMLButtonElement;
  /** Whether or not the `rules` tab exists */
  hasRulesTarget: boolean;
  /** The `demo` tab button */
  demoTarget: HTMLButtonElement;
  /** Whether or not the `demo` tab exists */
  hasDemoTarget: boolean;
  /** The edit button target to activate CodeJar */
  editorTarget: HTMLButtonElement;
  /** The edit mode status to signal whether or not editing is enabled */
  editorValue: boolean;
  /** CodeJar Editor instance when editing was enabled. */
  codejar: CodeJar

}
