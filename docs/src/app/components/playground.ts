import moloko from 'moloko';
import esthetic from 'esthetic';
import m, { Vnode } from 'mithril'
import { Controller } from '@hotwired/stimulus';
import { rules } from '../playground/rules';


export class Playground extends Controller {

  /**
   * Stimulus: Targets
   */
  static targets = [
    'editor',
    'rules',
    'actions'
  ];



  connect(): void {

    moloko.mount(this.element, {
      resolve: {
        path: 'moloko'
      },
      offset: 52,
    });


  }



  rules () {



  }





   /**
   * The code input target provided on initial render
   */
   editorTarget: HTMLElement
  /**
   * Rules Target
   */
   rulesTarget: HTMLElement
   actionsTarget: HTMLElement
}
