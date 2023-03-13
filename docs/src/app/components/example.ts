import { Controller } from '@hotwired/stimulus';
import esthetic, { Rules } from 'esthetic'
import Prism from 'prismjs'


/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */


Prism.languages.insertBefore('js', 'keyword', {
  variable: {
    pattern: /\b(?:const|var|let)\b/
  },
  module: {
    pattern: /\b(?:import|as|export|from|default)\b/
  },
  op: {
    pattern: /\b(?:typeof|new|of|delete|void|readonly)\b/
  },
  'punctuation-chars': {
    pattern: /[.,]/,
    global: true
  },
  semi: {
    pattern: /[;]/,
    global: true
  },
  nil: {
    pattern: /\b(?:null|undefined)\b/
  },
  'browser-objects': {
    pattern: /\b(?:window|document|console)\b/
  },
  types: {
    pattern: /\b(?:any|string|object|boolean|number|Promise)\b/,
    global: true
  },
  'type-array': {
    pattern: /\[\]/,
    global: true
  },
  'type-object': {
    pattern: /\{\}/,
    global: true
  },
  'return-type': {
    pattern: /(\)):(?=\s)/,
    global: true,
    lookbehind: true
  },
  'parameter-optional': {
    pattern: /[a-z_$][\w$]+(?=\?:\s*)/i,
    lookbehind: true
  },
  'parameter-type': {
    pattern: /(\?:\s*)[a-z_$][\w$]+/i,
    lookbehind: true
  },
  flow: {
    pattern: /\b(?:return|await)\b/
  },
  method: {
    pattern: /(\.\s*)[a-z_$][\w$]*(?=(\())/i,
    lookbehind: true
  }
});


const grammar = {
  pattern: /{[{%]-?[\s\S]+-?[%}]}/,
  inside: {
  'liquid-comment': {
    lookbehind: true,
    global: true,
    pattern: /(?:\{%-?\s*comment\s*-?%\}[\s\S]+\{%-?\s*endcomment\s*-?%\}|\{%-?\s*#[\s\S]+?-?%\})/
  },
  'liquid-tag': {
    lookbehind: true,
    pattern: /({%-?\s*)\b([a-z]+)\b(?=[\s-%])/i
  },
  'liquid-tagged': {
    pattern: /\s+\b((?:end)[a-z]+|echo|if|unless|for|case|when)\s+/
  },
  'liquid-object': {
    lookbehind: true,
    pattern: /({[{%]-?\s*)\b[a-z_$][\w$]+(?=\.\s*)/i
  },
  'liquid-property': {
    lookbehind: true,
    pattern: /(\.\s*)[a-z_$][\w$]+(?=[.\s])/i
  },
  'liquid-filter': {
    lookbehind: true,
    pattern: /(\|)\s*(\w+)(?=[:]?)/
  },
  'liquid-string': {
    lookbehind: true,
    pattern: /['"].*?['"]/
  },
  'liquid-punctuation': {
    global: true,
    pattern: /[.,|:?]/
  },
  'liquid-operator': {
    pattern: /[!=]=|<|>|[<>]=?|[|?:=-]|\b(?:and|contains(?=\s)|or)\b/
  },
  'liquid-boolean': {
    pattern: /\b(?:true|false|nil)\b/
  },
  'liquid-number': {
    pattern: /\b(?:\d+)\b/
  },
  'liquid-parameter': {
    lookbehind: true,
    global: true,
    greedy: true,
    pattern: /(,)\s*(\w+)(?=:)/i
  },
  'liquid-style': {
    inside: Prism.languages.style,
    lookbehind: true,
    pattern: /(\{%-?\s*style(?:sheet)?\s*-?%\})([\s\S]+?)(?=\{%-?\s*endstyle(?:sheet)?\s*-?%\})/
  },
  'liquid-javascript': {
    inside: Prism.languages.script,
    lookbehind: true,
    pattern: /(\{%-?\s*javascript\s*-?%\})([\s\S]*?)(?=\{%-?\s*endjavascript\s*-?%\})/
  },
  'liquid-schema': {
    inside: Prism.languages.json,
    lookbehind: true,
    pattern: /(\{%-?\s*schema\s*-?%\})([\s\S]+?)(?=\{%-?\s*endschema\s*-?%\})/
  }
}
}

Prism.languages.html = Prism.languages.extend('markup', {
  'tag': {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    greedy: true,
    inside: {
      'tag': {
        pattern: /^<\/?[^\s>\/]+/,
        inside: {
          'punctuation': /^<\/?/,
          'namespace': /^[^\s>\/:]+:/
        }
      },
      'special-attr': [],
      'attr-value': {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
          'punctuation': [
            {
              pattern: /^=/,
              alias: 'attr-equals'
            },
            {
              pattern: /^(\s*)["']|["']$/,
              lookbehind: true
            }
          ]
        }
      },
      grammar: grammar,
      'punctuation': /\/?>/,
      'attr-name': {
        pattern: /[^\s>\/]+/,
        inside: {
          'namespace': /^[^\s>\/:]+:/,
            punctuation: /{[{%]-?|-?[%}]}/,
            'attr-object': {
              lookbehind: true,
              pattern: /([a-z]*?)\s*[[\]0-9_\w$]+(?=\.)/i
            },
            'attr-property': {
              lookbehind: true,
              pattern: /(\.)\s*?[[\]\w0-9_$]+(?=[.\s?])/i
            },
            'punctuation-chars': {
              global: true,
              pattern: /[.,|:?]/
            },
            'attr-eq': /=/
          }

      }

    }
  },
  'delimiters': {
    pattern: /{[{%]-?[\s\S]+-?[%}]}/,
    inside: {
    'liquid-comment': {
      lookbehind: true,
      global: true,
      pattern: /(?:\{%-?\s*comment\s*-?%\}[\s\S]+\{%-?\s*endcomment\s*-?%\}|\{%-?\s*#[\s\S]+?-?%\})/
    },
    'liquid-tag': {
      lookbehind: true,
      pattern: /({%-?\s*)\b([a-z]+)\b(?=[\s-%])/i
    },
    'liquid-tagged': {
      pattern: /\s+\b((?:end)[a-z]+|echo|if|unless|for|case|when)\s+/
    },
    'liquid-object': {
      lookbehind: true,
      pattern: /({[{%]-?\s*)\b[a-z_$][\w$]+(?=\.\s*)/i
    },
    'liquid-property': {
      lookbehind: true,
      pattern: /(\.\s*)[a-z_$][\w$]+(?=[.\s])/i
    },
    'liquid-filter': {
      lookbehind: true,
      pattern: /(\|)\s*(\w+)(?=[:]?)/
    },
    'liquid-string': {
      lookbehind: true,
      pattern: /['"].*?['"]/
    },
    'liquid-punctuation': {
      global: true,
      pattern: /[.,|:?]/
    },
    'liquid-operator': {
      pattern: /[!=]=|<|>|[<>]=?|[|?:=-]|\b(?:and|contains(?=\s)|or)\b/
    },
    'liquid-boolean': {
      pattern: /\b(?:true|false|nil)\b/
    },
    'liquid-number': {
      pattern: /\b(?:\d+)\b/
    },
    'liquid-parameter': {
      lookbehind: true,
      global: true,
      greedy: true,
      pattern: /(,)\s*(\w+)(?=:)/i
    },
    'liquid-style': {
      inside: Prism.languages.style,
      lookbehind: true,
      pattern: /(\{%-?\s*style(?:sheet)?\s*-?%\})([\s\S]+?)(?=\{%-?\s*endstyle(?:sheet)?\s*-?%\})/
    },
    'liquid-javascript': {
      inside: Prism.languages.script,
      lookbehind: true,
      pattern: /(\{%-?\s*javascript\s*-?%\})([\s\S]*?)(?=\{%-?\s*endjavascript\s*-?%\})/
    },
    'liquid-schema': {
      inside: Prism.languages.json,
      lookbehind: true,
      pattern: /(\{%-?\s*schema\s*-?%\})([\s\S]+?)(?=\{%-?\s*endschema\s*-?%\})/
    }
  }
}
});

Prism.languages.bash = {
  keyword: {
    pattern: /(esthetic\s)/
  },
  argument: {
    pattern: /\<(.*?)\>/
  },
  punctuation: {
    pattern: /[<>]|--?(?=[a-z])/
  },
  comment: {
    pattern: /#.*?(?=\n)/
  }
}


/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */

export class Example extends Controller {

  /**
   * Stimulus: Targets
   */
  static targets = [
    'input',
    'inputLines',
    'output',
    'outputLines',
    'format',
    'rules',
    'parsed'
  ];

  static values = {
    rules: Object,
    input: String,
    output: String,
    mode: String
  };

  /**
   * The code input target provided on initial render
   */
  inputTarget: HTMLElement
  /**
   * The code input lines target provided on initial render
   */
  inputLinesTarget: HTMLDivElement
  /**
   * The input value escaped string
   */
  inputValue: string;
  /**
   * The input lines value escaped
   */
  inputLines: string;

  outputLines: string
  outputTarget: HTMLElement
  outputLinesTarget: HTMLDivElement
  outputValue: string;

  rulesValue: Rules
  modeValue: 'initial' | 'before' | 'after'


  rules: Rules;
  timer: NodeJS.Timeout
  button: HTMLButtonElement



  getLines (input: string) {

    const split = input.split('\n')
    const numbers = [ ...Array(split.length) ]
    const lines = numbers.map((_, i) => (`<span class="line-number">${i + 1}</span><br>`))

    return lines.join('')

  }



  getEditorRect () {



    const { height, width } = this.inputTarget.parentElement.getBoundingClientRect()

    const input = this.inputTarget.parentElement
    const output = this.outputTarget.parentElement

    input.style.minHeight = height + 'px'
    input.style.maxHeight = height + 'px'
    input.style.maxWidth = width + 'px'
    input.style.minWidth = width + 'px'

    output.style.minHeight = height + 'px'
    output.style.maxHeight = height + 'px'
    output.style.maxWidth = width + 'px'
    output.style.minWidth = width + 'px'

  }


  initialize(): void {

    this.modeValue = 'before'
    this.rules = esthetic.rules()
  }


  connect(): void {


    // this.editor = CodeJar(this.inputTarget, (editor) => {
    //  // editor.style.whiteSpace = 'pre'
    //   editor.innerHTML = Prism.highlight(editor.innerText, Prism.languages.html, 'html')
    // })

    // this.editor.onUpdate(code => {
    //   this.inputLinesTarget.innerHTML = this.getLines(code)
    //   this.inputValue = code
    //   this.doFormat(code)
    // })


   // this.rules = esthetic.rules()
    this.button = this.element.querySelector('button[data-action="example#before"]')
    this.inputLines = this.inputLinesTarget.innerHTML
    this.outputLines = this.inputLines


  }

  doFormat (input: string) {

      const output = esthetic.format(this.inputValue, this.rulesValue)
      this.outputLines = this.getLines(output)
      this.inputTarget.innerHTML = Prism.highlight(output, Prism.languages.html, 'html')
      this.outputValue = output

      esthetic.rules(this.rules)

  }


  before ({ target }: { target: HTMLButtonElement}) {

    if(this.modeValue === 'after') {

      this.element.classList.toggle('after')
      this.button.classList.remove('selected')
      target.classList.add('selected')

      this.inputTarget.innerHTML = Prism.highlight(this.inputValue, Prism.languages.html, 'html')
      this.inputLinesTarget.innerHTML = this.inputLines
      this.modeValue = 'before'
      this.button = target
    }

  }

  after ({ target }: { target: HTMLButtonElement}) {

    if(this.modeValue === 'before') {

      this.element.classList.toggle('after')
      this.button.classList.remove('selected')
      target.classList.add('selected')

      this.doFormat(this.inputValue)
      this.inputLinesTarget.innerHTML = this.outputLines
      this.modeValue = 'after'
      this.button = target

    }

  }
}
