import Prism from 'prismjs'
import { CodeJar } from 'codejar';
import { withLineNumbers } from 'codejar/linenumbers';
import { Controller } from '@hotwired/stimulus';
import esthetic, { Rules } from 'esthetic'
import { prism } from '../utilities/prism';


/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */

export class Editor extends Controller {

  /**
   * Stimulus: Targets
   */
  static targets = [
    'editor',
    'preview',
  ];

  static values = {
    rules: Object,
    input: String,
  };

  editorTarget: HTMLElement;
  previewTarget: HTMLElement;
  inputValue: string
  rulesValue: Rules;
  editor: CodeJar;
  preview: CodeJar

  initialize(): void {

    Prism.languages.html = prism()


  }

  connect(): void {

    setTimeout(() => {

      this.editorTarget.classList.add('language-markup')

      this.preview = CodeJar(this.previewTarget, Prism.highlightElement);
      this.editor.updateCode(this.inputValue)

      this.editor.onUpdate(code => {

        const format = esthetic.format.sync(code, this.rulesValue)
        this.preview.updateCode(format)

      })
    }, 2000)
  }

  disconnect(): void {
    this.preview.destroy()
    this.editor.destroy()
  }



}




