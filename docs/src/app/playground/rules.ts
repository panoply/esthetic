import type { Definition, LexerName, Rules } from 'esthetic';
import m from 'mithril';
import esthetic from 'esthetic'
import relapse from 'relapse';
import moloko from 'moloko-monaco';

/* -------------------------------------------- */
/* TYPINGS                                      */
/* -------------------------------------------- */

/**
 * Generated Rules
 */
type Rule = Definition & { rule: string; }


/* -------------------------------------------- */
/* COMPONENT                                    */
/* -------------------------------------------- */

 /**
 * Rules Sidebar
 *
 * Formatting rules component. This will render the format
 * rulesets to the side of the playground. State is maintained
 * using a meiosis.js variation pattern.
 */
export const rules: m.ClosureComponent<{ rules: Rules }> = ({ attrs: { rules } }) => {

  console.log(rules)

  rules.language = 'liquid'

 const isGlobal = (name: string) => name in esthetic.definitions.global

  /* -------------------------------------------- */
  /* DATASET                                      */
  /* -------------------------------------------- */

  /**
   * Accumulator dataset record. The object will be
   * passed to the reducer generator. We live in a society,
   * we are not animals and as such we don't use the prototype.
   */
  const data = {
    global: Object.entries(esthetic.definitions.global),
    liquid: Object.entries(esthetic.definitions.liquid),
    markup: Object.entries(esthetic.definitions.markup),
    script: Object.entries(esthetic.definitions.script),
    style: Object.entries(esthetic.definitions.style),
    json: Object.entries(esthetic.definitions.json)
  };


  /* -------------------------------------------- */
  /* BEGIN                                        */
  /* -------------------------------------------- */

  /**
   * Holds input value entered in `array()`
   */
  let input: string;

  /**
   * Boolean Type Options
   *
   * The function returns virtual nodes for type `boolean` rule
   * defintions. State is updated `onclick`
   */
  function boolean (lexer: LexerName, name: string, option: Rule) {

    let rule: boolean = isGlobal(name) ? rules[name] : rules[lexer][name];

    return m('.d-block.py-4.px-5',[
       m(
        '.fs-name.uncase.mb-3'
        , name
      ),
       m(
        'button.boolean.btn.d-flex.jc-start.w-100.uncase'
        , {
          class: rule ? 'enabled' : ''
          , onclick: () => {

            rule = !rule

            if(isGlobal(name)) {
              rules[name] = rule
            } else {
              rules[lexer][name] = rule
            }

            moloko.format(rules);

          }
        }
        , m(
          'svg.icon'
          , m(`use[xlink:href="#svg-${rule ? 'checked' : 'unchecked'}"]`)
        )
        , m(
          'code.code-badge.ml-3'
          , JSON.stringify(rule)
        )
      )
      , m(
        'p.fs-sm.fc-gray.fw-300.mt-0'
        , option.description
      )
    ]);

  };

  /**
   * String Type Options
   *
   * The function returns virtual nodes for type `string` rule
   * defintions. State is updated `oninput`
   */
  function string (lexer: LexerName, name: string, option: Definition) {

    let value: string = isGlobal(name) ? rules[name] : rules[lexer][name];

    return m('.d-block.py-4.px-5',[
       m(
        '.fs-name.uncase.mb-3'
        , name
      )
      ,m(
        '.string.d-flex.jc-start.w-100'
        , m(
          'input.input'
          , {
            value
            , oninput: (
              {
                target
              }: {
                target: HTMLInputElement
              }
            ) => {

              value = target.value
              if(isGlobal(name)) {
                rules[name] = value
              } else {
                rules[lexer][name] = value
              }

              moloko.format(rules);
            }
          }
        )
        , m(
          'code.code-badge.ml-auto'
          , JSON.stringify(value)
        )
      ),
      , m(
        'p.fs-sm.fc-gray.fw-300.mt-0'
        , option.description
      )
    ]);

  };

  /**
   * Array Type Options
   *
   * The function returns virtual nodes for type `string[]` rule
   * defintions. These rules accept a string list of customer
   * defined options. State is updated `onclick`
   */
  function array (lexer: LexerName, name: string, option: Rule) {

    const list: string[] = isGlobal(name) ? rules[name] : rules[lexer][name];

    return  m('.d-block.py-4.px-5',[
       m('.array', [
      m(
        '.d-flex.jc-start.w-100.mb-3'
        , m(
          'svg.icon.ml-1'
          , m('use[xlink:href="#svg-corner-left"]')
        )
        , m(
          'fc-white.fs-sm.ml-3'
          , name
        )
        , m(
          'code.code-badge.ml-auto'
          , JSON.stringify(list.length === 0 ? list : `string[${list.length}]`)
        )
      )
      , list.map((item: string, count: number) => m(
        '.d-flex.ml-2.mb-1.array-item'
        , m(
          '.fs-sm.ff-code.d-inline.mr-2'
          , `${count}`
        )
        , m(
          'code.d-inline.ml-3.fc-white.code'
          , item
        )
        , m(
          'button.btn-remove',
          {
            onclick: () => {
              list.splice(count, 1);
              rules[lexer][name] = list;
              moloko.format(rules);
            }
          }
          , m('svg.icon', m('use[xlink:href="#svg-cross"]'))
        )
      ))
      , m(
        '.d-block.btn-add'
        , m(
          '.ml-2.d-inline.next-no.fs-sm.ff-code'
          , `${rules[lexer][name].length}`
        )
        , m(
          'input.input'
          , {
            placeholder: 'Value...'
            , value: input
            , oninput: ({ target: { value } }) => {
              input = value;
            }
            , onkeydown: ({ keyCode, target }) => {
              if (keyCode === 27) {
                target.value = '';
              } else if (keyCode === 13 && !list.includes(input) && input.length > 0) {
                list.push(input);
                input = '';
                rules[lexer][name] = list;
                moloko.format(rules);
              }
            }
          }
        )
        , m(
          'button.button'
          , {
            type: 'button',
            disabled: !input,
            onclick: () => {
              if (input && input.length > 0 && !list.includes(input)) {
                list.push(input);
                input = '';
                rules[lexer][name] = list;
                moloko.format(rules);
              }
            }
          }
          , m('svg.icon', m('use[xlink:href="#svg-plus"]'))
        )
      )
      , m(
        'p.fs-sm.fc-gray.mt-3'
        , option.description
      )
      ])
    ]);

  };

  /**
   * Select Type Options
   *
   * The function returns virtual nodes for type `select` rule
   * defintions. These rules use a pre-defined set of options.
   * The definitions expose the accepted values as an array and
   * each option is rendered as a radio-list.
   */
  function choice (lexer: LexerName, name: string, option: Rule) {

    if(name === 'preset' || name === 'language') return []
    /**
     * Maintains a reference to the selected rule
     */
    const selected: string = isGlobal(name) ? rules[name] : rules[lexer][name];

    return m('.d-block.py-4.px-5',[
      m(
        '.fs-name.uncase.mb-3'
        , name
      ),
      // m(
      //   '.select.d-flex.jc-start.w-100'
      //   , m(
      //     'svg.icon.ml-1'
      //     , m('use[xlink:href="#svg-corner-left"]')
      //   )
      //   // , m(
      //   //   'code.code-badge.ml-auto'
      //   //   , JSON.stringify(selected)
      //   // )
      // )
      , m(
        'p.fs-sm.fc-gray.mb-3'
        , option.description
      )
      , option.values.map(value => {

        const enabled = value.rule === selected;

        return [
          m(
            'button.boolean.btn.d-flex.jc-start.w-100'
            , {
              class: enabled ? 'enabled' : ''
              , onclick: () => {
                rules[lexer][name] = value.rule;
                moloko.format(rules);
              }
            }
            , m(
              'svg.icon'
              , m(`use[xlink:href="#svg-${enabled ? 'checked' : 'unchecked'}"]`)
            )
            , m(
              '.ff-code.fs-sm.mx-3.uncase'
              , value.rule
            )
          )
          , m(
            'p.fs-xs.fc-gray.mt-3'
            , option.description
          )
        ];
      })

    ]);

  };

  /**
   * Number Type Options
   *
   * The function returns virtual nodes for type `number` rule
   * defintions. State is updated `oninput`
   */
  function number (lexer: LexerName, name: string, option: Rule) {

    const value: number = isGlobal(name) ? rules[name] : rules[lexer][name];

    return m('.d-block.py-4.px-5',[
      , m(
        '.fs-name.uncase.mb-3'
        , name
      ),
      m(
        '.number.d-flex.jc-start.w-100'
        , m(
          'input.input'
          , {
            value
            , type: 'number'
            , min: -1
            , oninput: ({
              target
            }: {
              target: HTMLInputElement
            }) => {
              rules[lexer][name] = +target.value;
              moloko.format(rules);
            }
          }
        )
        // , m(
        //   'code.code-badge.ml-3'
        //   , JSON.stringify(value)
        // )
      ),
      , m(
        'p.fs-sm.fc-gray.fw-300.mt-0'
        , option.description
      )
    ]);

  };

  /**
   * Multi Type Option
   *
   * The function returns virtual nodes for a multitype
   * option definition, like (for example) `forceAttribute`
   * which accepts either a _boolean_ or _number_.
   */
  function multitype (lexer: LexerName, name: string, option: Rule) {

    /**
     * Maintains a reference to the selected rule
     */
    let selected: number | boolean = isGlobal(name) ? rules[name] : rules[lexer][name];

    return [
      m(
        '.select.d-flex.jc-start.w-100'
        , m(
          'svg.icon.ml-1'
          , m('use[xlink:href="#svg-corner-left"]')
        )
        , m(
          'fc-white.fs-sm.ml-3'
          , name
        )
        , m(
          'code.code-badge.ml-auto'
          , JSON.stringify(selected)
        )
      )
      , m(
        'p.fs-xs.px-3.fc-gray.mt-2'
        , option.description
      )
      , Array.isArray(option.type) ? option.type.map((value, i) => {

        const rule = option.values[value];
        const or = i > 0 ? m('span.stripe', 'OR') : null;

        if (value === 'number') {
          return [
            or,
            m(
              '.number.d-flex.jc-start.w-100'
              , m(
                'input.input'
                , {
                  value: typeof selected === 'boolean' ? '' : selected
                  , type: 'number'
                  , min: 1
                  , oninput: ({
                    target
                  }: {
                    target: HTMLInputElement
                  }) => {

                    selected = Number(target.value);
                    rules[lexer][name] = selected;
                    moloko.format(rules);
                  }
                }
              )
              , m(
                'fc-white.fs-sm.ml-3'
                , value
              )
            )
            , m(
              'p.fs-xs.px-3.fc-gray.mt-0'
              , rule.description
            )
          ];
        } else if (value === 'boolean') {

          return [
            or,
            m(
              'button.boolean.btn.d-flex.jc-start.w-100'
              , {
                class: (
                  typeof option.default === 'boolean' &&
                  typeof selected === 'boolean' &&
                  selected
                ) ? 'enabled'
                  : ''
                , onclick: () => {

                  rules[lexer][name] = !selected
                  moloko.format(rules);
                }

              }
              , m(
                'svg.icon'
                , m(`use[xlink:href="#svg-${(
                  typeof selected === 'boolean' &&
                  selected
                ) ? 'checked'
                  : 'unchecked'}"]`)
              )
              , m(
                'fc-white.fs-sm.mx-3'
                , value
              )
            )
            , m(
              'p.fs-xs.fc-gray.d.block.mx-3'
              , rule.description
            )
          ];

        }

        return null;

      }) : null

    ];
  }

  /**
   * Type Dispatch
   *
   * This function determines the option type are will pass
   * the defintion onto the appropriate vnode function.
   */
  function types (lexer: LexerName, name: string, option: Rule) {

    if (typeof option.type === 'object') {

      //return multitype(lexer, name, option);

    } else {
      switch (option.type) {
        case 'boolean':
          return boolean(lexer, name, option);
        case 'string':
          return string(lexer, name, option);
        case 'number':
          return number(lexer, name, option);
        case 'choice':
          return choice(lexer, name, option);
        case 'array':
          return array(lexer, name, option);
      }
    }
  };

  /* -------------------------------------------- */
  /* VDOM                                         */
  /* -------------------------------------------- */

  let active: any = 'global'

  const view = () => {

    return m(
      '.row.g-0'
      , m(
        '.col.pl-0.br.rule-options.bg-glass'
        ,[
          //m('h2.upcase.mt-4.mb.3', `${active} Rules`)
          // , m('p', 'Lorem ipsum')
           data[active].map(([ name, rule ]: [
              string,
              Rule
            ]) => types(active, name, rule)
          )
        ]
      )
      , m(
        '.col-auto.bg-glass'
        , {
          style: {
            width:'230px'
          }
        }
        , m('ul.list-lined[data-controller="sticky"][data-sticky-offset-value="0"]', [
          , Object.keys(data).map((lexer: LexerName) => [
              m(`li.px-3[aria-label="${data[lexer].length} Rules"]`
              , {
                class: active === lexer ? 'active' : ''
              }
              , m(
              'button.btn.upcase.d-block'
              , {
                  class: active === lexer ? 'fc-pink' : '',
                  onclick: () => {
                    active = lexer
                    m.redraw()
                  }
                }
              , lexer
            ))
          ])
        ])
      )

    );
  }

  return { view };
};
