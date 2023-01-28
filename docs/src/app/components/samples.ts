import { Controller } from '@hotwired/stimulus';
import Prism from 'prismjs';
import m from 'mithril';
import esthetic from 'esthetic';
import { global } from '../samples/global';

/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */

export class Sample extends Controller {

  /**
   * Stimulus: Targets
   */
  static targets = [
    'input',
    'output'
  ];

  /**
   * Stimulus Connect
   */
  connect (): void {

    m.mount(this.element.firstElementChild, this.vnode);

  }

  /**
   * Stimulus Disconnect
   */
  disconnect () {

  }

  get vnode () {

    const highlight = Prism.highlight(global.indentChar.input, Prism.languages.html, 'html');

    return {
      view: () => [
        m('h2', 'Test'),
        m('.row',

          m(
            '.col-8',
            m(
              'pre.language-html.p-0.m-0'
              , m('code.language-html.p-0.m-0', m.trust(highlight))
            )
          ),
          m('.col-4.mt-3',
            m('input.fm-input', {
              value: ' '
            })))
      ]
    };

  }

}
