import { Controller } from '@hotwired/stimulus';
import papyrus from 'papyrus';
import esthetic from 'esthetic';
import { liquid } from 'language-literals';
import m from 'mithril';

export class Parser extends Controller {

  /**
   * Stimulus: Targets
   */
  static targets = [
    'input',
    'output'
  ];

  get rules () {
    return esthetic.rules();
  }

  connect (): void {

    const input = liquid`
    <style>
      .list {
        background-color: {{ bg.color }};
      }
    </style>

    <main id="{{ object.prop }}">
      <ul class="list">
        {% for item in arr %}
          <li>{{ item }}</li>
        {% endfor %}
      </ul>
    </main>

    {% schema %}
      {
        "prop": []
      }
    {% endschema %}
    `;

    this.input = papyrus.mount(this.inputTarget, {
      language: 'liquid',
      input,
      lineNumbers: true,
      editor: true
    });

    this.input.update(input);
    this.input.onupdate(this.update, this);

  }

  update (code: string, language: papyrus.Languages) {

    if (this.rules.language !== language) {
      esthetic.rules({ language });
    }

    m.render(this.outputTarget, this.table(code));

  }

  table (code: string) {

    const data = esthetic.parse(code);

    const isEven = (n: number) => n % 2 === 0 ? 'stripe' : '';

    return [
      m('table',
        m('tr', [
          m('td.pl-2.bold', 'Index'),
          m('td.bold', 'Line No'),
          m('td.bold', 'Begin'),
          m('td.bold', 'Ender'),
          m('td.bold', 'Lines'),
          m('td.bold', 'Lexer'),
          m('td.bold', 'Type'),
          m('td.bold', 'Stack'),
          m('td.bold', 'Token')
        ]),
        data.begin.map((_, i) => [
          m('tr', {
            class: isEven(i)
          }, [
            m('td.pl-2', `${i}`),
            m('td', `${esthetic.lines[i]}`),
            m('td', `${data.begin[i]}`),
            m('td', `${data.ender[i]}`),
            m('td', `${data.lines[i]}`),
            m('td', `${data.lexer[i]}`),
            m('td', `${data.types[i]}`),
            m('td', `${data.stack[i]}`),
            m('td', m('pre', m('code.fc-gray', data.token[i])))

          ])
        ]))
    ];

  }

  /**
   * Papyrus Input
   */
  input: papyrus.Model;

  /**
   * Input target
   */
  inputTarget: HTMLElement;

  /**
   * Output target to mount
   */
  outputTarget: HTMLElement;

}
