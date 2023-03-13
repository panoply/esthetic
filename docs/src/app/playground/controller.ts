import { Controller } from '@hotwired/stimulus';
import esthetic, { Rules } from 'esthetic'
import Prism from 'prismjs'
import { Buffer, TextAreaCodeElement } from 'textarea-code'
import { CodeEditElement, languages } from 'code-edit'
import { prism } from '../utilities/prism';

/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */


/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */

export class Playground extends Controller {

  /**
   * Stimulus: Targets
   */
  static targets = [
    'rules',
    'editor',
    'textarea',
    'editorLines',
    'output',
    'outputLines'
  ];

  static values = {
    rules: Object,
    input: String,
    output: String,
    mode: String
  };

  rulesTarget: HTMLElement
  editorTarget: HTMLElement
  editorLinesTarget: HTMLElement
  outputTarget: HTMLDivElement
  outputLinesTarget: HTMLElement
  textareaTarget: HTMLTextAreaElement

  inputValue: string
  rulesValue: Rules
  modeValue: 'initial' | 'format' | 'edit' | 'parsed' | 'rules'

  editor: Buffer
  timer: NodeJS.Timeout

  getLines (input: string) {

    const split = input.split('\n')
    const numbers = [ ...Array(split.length - 1) ]
    const lines = numbers.map((_, i) => (`<span class="line-number">${i + 1}</span><br>`)).join('')

    return lines

  }

  initialize(): void {

    Prism.languages.html = prism()
  }



  connect(): void {



    customElements.define('textarea-code', TextAreaCodeElement as unknown as CustomElementConstructor, {
      extends: 'textarea'
    })





    // const next =  store.firstElementChild

    // this.textareaTarget.oninput = () => {

    //   this.editorTarget.innerHTML = Prism.highlight(this.textareaTarget.value , Prism.languages.html, 'html')



    // }

    // console.log(next)

    // this.editor = CodeJar(next, (editor) => {

  //    next.innerHTML = Prism.highlight(editor.textContent, Prism.languages.html, 'html')
//
    //   this.editorTarget.replaceWith(next)


    // })

    // this.editor.onUpdate(code => {
    //  // this.editorLinesTarget.innerHTML = this.getLines(code)
    //   this.doFormat(code)
    // })

    // this.modeValue = 'initial'





  }

  last: number

  lastEdit () {

  }

  onInput() {

    const { value } = this.textareaTarget

    if(this.inputValue !== value) {
      this.inputValue = value;
      this.editorTarget.innerHTML = Prism.highlight(value, Prism.languages.html, 'html')
      setTimeout(() => {
        this.doFormat(value)
       }, 100)
    }

    // Update code

  }



  doFormat (input: string) {

    try {

      const output = esthetic.format(input, { language: 'liquid' })

      if(this.outputTarget.innerHTML !== output && output.length > 0) {
       // this.outputLinesTarget.innerHTML = this.getLines(output)
        this.outputTarget.innerHTML = Prism.highlight(output, Prism.languages.html, 'html')
      }

    } catch (error) {

     console.log(error)

    }

  }

  onScroll () {

    this.textareaTarget.scrollTop =  this.editorTarget.scrollTop
    this.textareaTarget.scrollLeft =  this.editorTarget.scrollLeft

    this.outputTarget.parentElement.scrollTop =  this.editorTarget.scrollTop
    this.outputTarget.parentElement.scrollLeft =  this.editorTarget.scrollLeft
   // this.outputTarget.parentElement.scrollTop = this.editorTarget.parentElement.scrollTop
   // this.outputTarget.parentElement.scrollLeft = this.editorTarget.parentElement.scrollLeft

  }

}
