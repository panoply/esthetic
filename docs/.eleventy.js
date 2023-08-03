const eleventy = require('@panoply/11ty');
const svgsprite = require('eleventy-plugin-svg-sprite');
const navigation = require('@11ty/eleventy-navigation');
const htmlmin = require('@sardine/eleventy-plugin-tinyhtml');
const markdownit = require('markdown-it');
const mdcontainer = require('markdown-it-container')
const anchor = require('markdown-it-anchor');
const papyrus = require('papyrus');
const merge = require('mergerino');
const yaml = require('js-yaml');
const esthetic = require('esthetic');

/* -------------------------------------------- */
/* CONSTANTS                                    */
/* -------------------------------------------- */

/** Examples input (code) tab */
const INPUT = 'Input';

/** Examples input code rules tag */
const RULES = 'Rules';

/** Tooltips aria labels for tooltip blocks */
const TOOLTIPS = {
  '🤡': 'The choice of a clown.',
  '🙌': 'Authors choice',
  '👍': 'Good choice.',
  '👎': 'Not recommended',
  '🤌': 'Delightful. Your mother is proud of you',
  '😳': 'We live in a society, we\'re not animals',
  '💡': 'Showing an example of the rule',
  '🧐': 'You gotta do, what you gotta do'
};

const SVG_GEARS = `
<svg xmlns="http://www.w3.org/2000/svg" class="gears" preserveAspectRatio="none" viewBox="0 0 100 100"><g class="gear-1"><animateTransform fill="freeze" data-demo-target="gear" attributeName="none" dur="4.68s" from="360 78.5 37" repeatCount="indefinite" to="0 78.5 37" type="rotate"/><path d="M93.942 35.007 100 32c-.379-1.686-.954-3.326-1.715-4.878l-6.61 1.435c-.921-1.467-2.095-2.794-3.493-3.901l2.16-6.407c-.722-.457-1.474-.886-2.261-1.265-.791-.379-1.592-.699-2.401-.977l-3.66 5.685c-1.738-.398-3.506-.489-5.228-.29l-3.006-6.058c-1.687.375-3.326.95-4.878 1.708l1.434 6.607c-1.47.918-2.803 2.091-3.917 3.492-2.255-.761-4.474-1.506-6.407-2.159-.461.725-.893 1.479-1.271 2.277-.379.78-.695 1.574-.974 2.378 1.716 1.102 3.689 2.373 5.688 3.656-.408 1.748-.496 3.522-.297 5.254-2.131 1.056-4.231 2.098-6.062 3.007.376 1.683.948 3.319 1.706 4.871 1.996-.435 4.283-.931 6.606-1.435.925 1.48 2.104 2.816 3.516 3.935l-2.163 6.403c.723.458 1.471.883 2.265 1.262.784.379 1.584.699 2.389.98 1.104-1.716 2.368-3.689 3.659-5.692 1.751.409 3.532.494 5.267.294l3 6.055c1.686-.379 3.322-.95 4.875-1.712-.435-1.993-.932-4.283-1.435-6.61 1.47-.921 2.803-2.101 3.917-3.509l6.408 2.156c.454-.715.875-1.46 1.251-2.244.379-.794.706-1.602.983-2.411l-5.688-3.663c.399-1.741.488-3.515.284-5.237zm-8.89 4.91c-1.729 3.588-6.034 5.098-9.619 3.372-3.588-1.725-5.097-6.031-3.372-9.619 1.723-3.588 6.032-5.097 9.619-3.372 3.585 1.723 5.093 6.032 3.372 9.619z"/></g><g class="gear-2"><animateTransform data-demo-target="gear" fill="freeze" attributeName="none" dur="7s" from="0 31 53" repeatCount="indefinite" to="360 31 53" type="rotate"/><path d="m56.452 54.774 6.297-1.147c.017-1.813-.124-3.616-.415-5.388l-6.397-.192c-.444-2.078-1.15-4.098-2.102-6.003l4.879-4.143c-.879-1.571-1.896-3.064-3.042-4.47l-5.637 3.035c-1.401-1.559-3.016-2.957-4.829-4.149l2.15-6.025c-.769-.457-1.562-.889-2.386-1.284-.82-.395-1.646-.741-2.479-1.059l-3.365 5.447c-2.062-.673-4.163-1.065-6.258-1.189l-1.149-6.296c-1.813-.02-3.614.12-5.385.411l-.193 6.397c-2.081.444-4.101 1.15-6.008 2.104l-4.146-4.878c-1.565.882-3.059 1.898-4.46 3.042l3.032 5.633c-1.559 1.401-2.961 3.022-4.153 4.836-2.186-.78-4.248-1.516-6.026-2.152-.454.774-.885 1.562-1.28 2.382s-.742 1.649-1.062 2.486c1.607.993 3.466 2.144 5.443 3.365-.67 2.062-1.062 4.166-1.187 6.261L.001 52.947c-.02 1.811.121 3.61.412 5.385l6.397.189c.447 2.085 1.156 4.107 2.107 6.009L4.04 68.674c.883 1.568 1.896 3.062 3.046 4.466l5.63-3.035c1.408 1.559 3.025 2.957 4.835 4.149l-2.146 6.025c.765.451 1.556.882 2.376 1.274.823.398 1.653.748 2.492 1.062l3.366-5.44c2.058.67 4.159 1.062 6.25 1.184l1.15 6.296c1.813.02 3.613-.124 5.388-.412l.196-6.4c2.078-.444 4.094-1.15 5.999-2.104l4.143 4.875c1.568-.875 3.062-1.892 4.467-3.035l-3.032-5.64c1.556-1.401 2.95-3.016 4.143-4.829l6.025 2.153c.454-.771.889-1.565 1.284-2.385.392-.817.738-1.65 1.059-2.487l-5.443-3.365c.669-2.06 1.06-4.158 1.184-6.252zm-13.638 4.009c-3.039 6.319-10.622 8.979-16.941 5.937-6.319-3.035-8.979-10.619-5.937-16.938 3.038-6.319 10.622-8.979 16.938-5.94 6.319 3.039 8.98 10.622 5.94 16.941z"/></g></svg>
`

/* -------------------------------------------- */
/* CONFIGS                                      */
/* -------------------------------------------- */

/**
 * Æsthetic Rules
 *
 * An immutable merge of Æsthetic rules applied when producing
 * the demo side-by-side rule examples.
 *
 *
 * @param {esthetic.Rules} ruleOptions
 * @returns {esthetic.Rules}
 */
function getEstheticRules (ruleOptions) {

  return merge({
    crlf: false,
    correct: false,
    preset: 'default',
    language: 'auto',
    endNewline: false,
    indentChar: ' ',
    indentLevel: 0,
    indentSize: 2,
    preserveLine: 2,
    wrap: 0,
    wrapFraction: 0,
    liquid: {
      commentNewline: false,
      commentIndent: true,
      delimiterTrims: 'preserve',
      delimiterPlacement: 'preserve',
      forceFilter: 0,
      forceArgument: 0,
      ignoreTagList: [],
      indentAttribute: false,
      lineBreakSeparator: 'before',
      normalizeSpacing: true,
      preserveComment: false,
      preserveInternal: false,
      dedentTagList: [],
      quoteConvert: 'none'
    },
    markup: {
      attributeCasing: 'preserve',
      attributeSort: false,
      commentNewline: false,
      commentIndent: true,
      delimiterTerminus: 'inline',
      forceAttribute: 3,
      forceAttributeValue: true,
      forceIndent: false,
      ignoreCSS: false,
      ignoreJS: true,
      ignoreJSON: false,
      lineBreakValue: 'preserve',
      preserveComment: false,
      preserveText: false,
      preserveAttribute: false,
      selfCloseSpace: true,
      selfCloseSVG: true,
      stripAttributeLines: false,
      quoteConvert: 'none'
    },
    json: {
      arrayFormat: 'default',
      braceAllman: false,
      bracePadding: false,
      objectIndent: 'default',
      objectSort: false,

      braceStyle: 'none',
      caseSpace: false,
      commentIndent: false,
      commentNewline: false,
      correct: false,
      elseNewline: false,
      functionNameSpace: false,
      functionSpace: false,
      methodChain: 4,
      neverFlatten: false,
      noCaseIndent: false,
      preserveComment: false,
      styleGuide: 'none',
      ternaryLine: false,
      variableList: 'none',

      quoteConvert: 'double',
      endComma: 'never',
      noSemicolon: true,
      vertical: false
    },
    style: {
      commentIndent: false,
      commentNewline: false,
      atRuleSpace: true,
      classPadding: false,
      noLeadZero: false,
      preserveComment: false,
      sortSelectors: false,
      sortProperties: false,
      quoteConvert: 'none'
    },
    script: {
      arrayFormat: 'default',
      braceNewline: false,
      bracePadding: false,
      braceStyle: 'none',
      braceAllman: false,
      caseSpace: false,
      commentIndent: false,
      commentNewline: false,
      elseNewline: false,
      endComma: 'never',
      functionNameSpace: false,
      functionSpace: false,
      inlineReturn: true,
      methodChain: 4,
      neverFlatten: false,
      noCaseIndent: false,
      noSemicolon: false,
      objectSort: false,
      objectIndent: 'default',
      preserveComment: false,
      quoteConvert: 'none',
      styleGuide: 'none',
      ternaryLine: false,
      variableList: 'none',
      vertical: false
    }
  }, ruleOptions);

}

/* -------------------------------------------- */
/* STATES                                       */
/* -------------------------------------------- */

/**
 * Code Block Input
 *
 * Holds an escaped string reference to the contents of code blocks. This is assigned
 * in the `highlightCode` function and is the raw code input.
 *
 * @type {string}
 */
let input;

/**
 * Æsthetic Format Rules
 *
 * Holds a reference to the formatting rules custom code block applied in markdown
 * files which uses this annotation:
 *
 * ```md
 * json:rules
 * ```
 *
 * @type {esthetic.Rules}
 */
let rules;

/**
 * isRule
 *
 * Holds a boolean reference indicating whether or not the embedded code region
 * is a formatting rule. Formatting rules will **ALWAYS** follow a `json:rules`
 * code block.
 *
 * ```md
 * json:rules
 * ```
 *
 * @type {boolean}
 */
let isRule;


/* -------------------------------------------- */
/* UTILITIES                                    */
/* -------------------------------------------- */

/**
 * Sugar helper for generating markup. Just a simple `.join('')`
 * utility
 *
 * @param {string[]} lines
 * @returns {string}
 */
function string (lines) {

  return lines.join('')

}

/**
 * Extracts the raw string from a `<code></code>` element.
 *
 * @param {string} raw
 * @returns {string}
 */
function getCodeBlockInput (raw) {

  const begin = raw.indexOf('>', raw.indexOf('<code') + 1) + 1
  const ender = raw.indexOf('</code')

  return raw.slice(begin, ender)

}

/**
 * An inspector for the `rules` variable which holds the parsed `json:rules`
 * code block JSON contents. The `json:rules` code block may sometimes instruct
 * upon what should be generated. This function is used to determine what the
 * object holds.
 *
 *
 * @param {'example'|'esthetic'|'papyrus'|'tabs'} prop
 * @returns {string}
 */
function has (prop) {

  if (typeof rules === 'object' && prop in rules) {
    return true
  }

  return false;


}

/* -------------------------------------------- */
/* MARKDOWN-IT PLUGINS                          */
/* -------------------------------------------- */


/**
 * Prints an error to the console when an issue occurs during the
 * `highlightCode` function.
 *
 * @param {string} language
 * @param {Error} error
 */
function highlightError (language, error) {

  const SEP = '\n\n------------------------------------------------------------\n\n'

  console.error(
    SEP,
    ' HIGHLIGHT ERROR\n',
    ' LANGUAGE: ' + language + '\n\n',
    error,
    SEP
  );

}


/**
 * Highlights code blocks contained within markdown files. Some contained
 * code blocks may use a language identifier separated by colon `:` character.
 * In such cases, this infers some higher order logic will be applied
 * in the next known code block.
 *
 * Typically this is found in the rules.
 *
 * @param {markdownit} md markdown-it
 * @param {string} str code input
 * @param {string} language code language
 */
function highlightCode(md, raw, language) {

  let code = '';

  if (language) {

    if (language === 'json:rules') {

      if(isRule) throw new Error('Repeated "```json:rules" block. Only 1 can exist above a code block')

      isRule = true;

      return raw;

    }

    try {

      if(isRule) {

        isRule = false;

        code = papyrus.static(raw, {
          language,
          editor: true,
          showSpace: false,
          addAttrs: {
            pre: [
              'data-demo-target="input"'
            ]
          }
        });

      } else if (language === 'bash' || language === 'cli' || language === 'shell') {


        code = papyrus.static(raw, {
          language,
          editor: false,
          showSpace: false,
          showTab: false,
          showCR: false,
          showLF: false,
          showCRLF: false,
          lineNumbers: false
        })

      } else {

        code = papyrus.static(raw, {
          language,
          editor: false,
          showSpace: true,
          trimEnd: true,
          trimStart: true
        });

      }

      input = md.utils.escapeHtml(raw);

    } catch (error) {
      highlightError(language, error)
      code = md.utils.escapeHtml(raw);
    }

  } else {

    code = md.utils.escapeHtml(raw);
    input = md.utils.escapeHtml(raw);

  }


  return code;

};



/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */


/**
 * Generates the `wrapFraction` rules example showcase
 *
 * @param {esthetic.Rules} estheticRules
 * Esthetic formatting rules
 *
 * @param {papyrus.CreateOptions} papyrusValue
 * Papyrus editor options
 *
 * @param {string} rawInput
 * The unescaped raw input of the codeblock
 *
 * @returns {string}
 */
function getWrapFractionRuleExample (estheticRules, papyrusValue, rawInput) {


  /** @type {papyrus.CreateOptions} */
  const papyrusOptions = merge(papyrusValue, {
    editor: false,
    showSpace: true,
    addAttrs: {
      pre: [
        'data-demo-target="input"'
      ]
    }
  });

  let output = ''

  try {

    const format = esthetic.format(rawInput, estheticRules)

    output = papyrus.static(format, papyrusOptions)

  } catch (error) {

    console.error(error)

    output = papyrus.static(rawInput, papyrusOptions)

  }


  return string([
    /* html */`
    <div class="col-6">
      <div class="row jc-center ai-center px-2">
        <div class="col-5">
          <legend class="fs-xs mb-0"     aria-label="Adjustments are disabled as we showcasing the default behaviour"
            data-tooltip="top">Wrap Fraction</legend>
          <input
            type="range"
            class="fm-range wrap-fraction"
            name="wrapFraction"
            min="0"
            max="100"
            step="1"
            value="80"
            disabled
            data-demo-target="wrapFractionRange"
            data-action="demo#onWrapFraction">
        </div>
        <div
          class="col-auto fs fc-cyan pl-1"
          data-demo-target="wrapFractionCount"
          aria-label="wrapFraction"
          data-tooltip="top">
          80
        </div>
        <div class="col-5">
          <legend class="fs-xs mb-0">Wrap</legend>
          <input
            type="range"
            class="fm-range"
            name="wrap"
            min="0"
            max="100"
            step="1"
            value="100"
            data-demo-target="wrapRange"
            data-action="demo#onWrapFraction">
        </div>
        <div
          class="col-auto fs fc-salmon pl-1 pr-0"
          data-demo-target="wrapCount"
          aria-label="wrap"
          data-tooltip="top">
          100
        </div>
      </div>
    </div>
    <div class="col-12 rel">
      <div
        style="width: 80%"
        class="wrap-fraction-line"
        data-demo-target="wrapFractionLine">
      </div>
      <div
        style="width: ${rules.esthetic.wrap}%"
        class="wrap-line"
        data-demo-target="wrapLine">
      </div>
      <div class="demo-input">
        ${output}
      </div>
    </div>
    `
  ])

}


/**
 * Generates the `wrap` rules example showcase
 *
 * @param {esthetic.Rules} estheticRules
 * Esthetic formatting rules
 *
 * @param {papyrus.CreateOptions} papyrusValue
 * Papyrus editor options
 *
 * @param {string} rawInput
 * The unescaped raw input of the codeblock
 *
 * @returns {string}
 */
function getWrapRuleExample (estheticRules, papyrusValue, rawInput) {


  /** @type {papyrus.CreateOptions} */
  const papyrusOptions = merge(papyrusValue, {
    editor: false,
    showSpace: true,
    addAttrs: {
      pre: [
        'data-demo-target="input"'
      ]
    }
  });

  let output = ''

  try {

    const format = esthetic.format(rawInput, estheticRules)

    output = papyrus.static(format, papyrusOptions)

  } catch (error) {

    console.error(error)

    output = papyrus.static(rawInput, papyrusOptions)

  }


  return string([
    /* html */`
    <div class="col-6">
      <div class="row jc-center ai-center px-4 pt-1">
        <input
          type="range"
          class="col fm-range"
          name="${rules.example.rule}"
          min="${rules.example.min}"
          max="${rules.example.max}"
          step="${rules.example.step}"
          value="${rules.example.value}"
          data-demo-target="range"
          data-action="demo#onForm">
        <div
          class="col-auto fs-sm ml-4 pl-1"
          data-demo-target="wrapCount"
          aria-label="The wrap rule value"
          data-tooltip="top">
          ${rules.example.value}
        </div>
      </div>
    </div>
    <div class="col-12 rel">
      <div
        style="width: ${rules.example.value}%"
        class="wrap-line"
        data-demo-target="wrapLine">
      </div>
      <div class="demo-input">
        ${output}
      </div>
    </div>
    `
  ])

}

/**
 * Builds side-by-side comparisons for rules based on the Markdown structure
 *
 * @param {esthetic.Rules} estheticRules
 * Esthetic formatting rules
 *
 * @param {papyrus.CreateOptions} papyrusValue
 * Papyrus editor options
 *
 * @param {string} inputValue
 * The Papyrus input codeblock generated in `highlightCode`
 *
 * @param {string} rawInput
 * The unescaped raw input of the codeblock
 *
 * @returns {string}
 */
function getRuleDemo (estheticRules, papyrusValue, inputValue, rawInput) {

  /** @type {papyrus.CreateOptions} */
  const papyrusOptions = merge(papyrusValue, {
    editor: false,
    showSpace: true,
    addAttrs: {
      pre: [
        'data-demo-target="output"'
      ]
    }
  });

  let output = ''

  try {

    const format1 = esthetic.format(rawInput, estheticRules)
    const format2 = esthetic.format(format1, estheticRules)

    output = papyrus.static(format2, papyrusOptions)

  } catch (error) {

    console.error(error)

    output = papyrus.static(rawInput, papyrusOptions)

  }


  return string([
    /* html */`

      <!-- EMPTY IN DEMO SHOWCASE -->
      <div class="col-6"></div>

      <div class="col-12 col-lg-6">
        <div class="demo-input">
          ${inputValue}
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <div class="demo-output">
          ${output}
        </div>
      </div>
    `
  ])

}

/**
 *
 * Generate the rule showcase type. Reads and digests `json:rules`, returning
 * the intended values and showcase demo/example.
 *
 * @param {markdownit} md
 * @param {string} inputValue
 * @param {string} language
 * @returns {{ template: string; rulesValue: string; papyrusValue: string; mode: string; }}
 */
function getRuleShowcase (md, inputValue, language) {

  /** @type {'example'|'editor'} */
  const mode = has('example') ? 'example' : 'editor'

  /** @type {esthetic.Rules} */
  const rulesValue = has('esthetic') ? rules.esthetic : rules;

  /** @type {papyrus.MountOptions} */
  const papyrusValue = has('papyrus') ? merge(rules.papyrus, { language }) : { language };

  /** @type {string} */
  const rawInput = md.utils.unescapeAll(input);

  /** @type {esthetic.Rules} */
  const estheticOptions = getEstheticRules(rulesValue);

   /** @type {{ [name: string]: {label: string; tooltip: string; }}} */
  const tabs = has('tabs') ? rules.tabs : {
    input: {
      label: 'Input',
      tooltip: 'Before Formatting'
    },
    rules: {
      label: 'Rules',
      tooltip: 'Rule Definitions'
    }
  }

  /* SHOWCASE ----------------------------------- */

  /** @type {string} */
  let showcase = ''


  if(has('example')) {

    if(rules.example.rule === 'wrap') {

      showcase = getWrapRuleExample(estheticOptions, papyrusValue, rawInput)

    } else if(rules.example.rule === 'wrapFraction') {

      showcase = getWrapFractionRuleExample(estheticOptions, papyrusValue, rawInput)

    }

  } else {

    showcase = getRuleDemo(estheticOptions, papyrusValue, inputValue, rawInput)

  }

  /**
   * The rule showcase template
   */
  const template = string([
    /* html */`
    <div class="row gx-0">
      <div class="col-6">
        <div class="demo-tabs">
          <button
            type="button"
            class="tab is-active"
            data-demo-target="inputTab"
            data-action="demo#onClickInputTab"
            aria-label="${tabs.input.tooltip}"
            data-tooltip="top">
            ${tabs.input.label}
          </button>
          <button
            type="button"
            class="tab"
            data-demo-target="rulesTab"
            data-action="demo#onClickRulesTab"
            aria-label="${tabs.rules.tooltip}"
            data-tooltip="top">
            ${tabs.rules.label}
          </button>
          <div data-controller="dropdown" class="dropdown">
            <button
              type="button"
              class="tab"
              data-dropdown-target="button"
              aria-label="Choose another code sample"
              data-tooltip="top">
              Samples
            </button>
            <div data-dropdown-target="collapse" class="dropdown-list">
              <ul>
                <li></li>
              </ul>
            </div>
          </div>
          <button
            type="button"
            class="tab is-undo ml-auto"
            data-action="demo#onClickResetButton"
            aria-label="Reset Input"
            data-tooltip="top">
          </button>
        </div>
      </div>

      <!-- SHOWCASE -->

      ${showcase}

    </div>
    `
  ]);


  return {
    template,
    mode,
    rulesValue: md.utils.escapeHtml(JSON.stringify(rulesValue)),
    papyrusValue: md.utils.escapeHtml(JSON.stringify(papyrusValue))
  }

}


/**
 * @param {markdownit} md
 */
function codeblocks(md) {

  const { fence } =  md.renderer.rules

  md.renderer.rules.fence = function(...args) {

    const [ tokens, index ] = args;
    const language = tokens[index].info.trim();
    const inputValue = fence(...args);

    if (language === 'json:rules') {

      const json = getCodeBlockInput(inputValue)

      try {

        rules = JSON.parse(json.trim());

        return ''

      } catch (e) {

        throw new Error('Invalid JSON in in the json:rules code block')

      }

    } else if (language === 'bash' || language === 'cli' || language === 'shell') {

      return inputValue

    }

    if (rules === undefined) return inputValue

    const {
      template,
      mode,
      papyrusValue,
      rulesValue
    } = getRuleShowcase(md, inputValue, language)


    rules = undefined

    return string([
      /* html */`
      <div
        class="rule-example"
        data-controller="demo"
        data-demo-mode-value="${mode}"
        data-demo-rules-value="${rulesValue}"
        data-demo-rules-original-value="${rulesValue}"
        data-demo-language-value="${language}"
        data-demo-input-value="${input.trim()}"
        data-demo-input-original-value="${input.trim()}"
        data-demo-papyrus-value="${papyrusValue}"
        spx-morph="children">
        ${template.trim()}
      </div>`

    ])

  }

}

/**
 * Generates HTML markup for various blocks
 *
 * @param {"note"|"tip"|"important"} type The type of alert to create.
 * @param {Array<markdownit>} tokens Array of MarkdownIt tokens to use.
 * @param {number} index The index of the current token in the tokens array.
 * @returns {string} The markup for the alert.
 */
function notes(tokens, index) {

  return tokens[index].nesting === 1 ? `<blockquote class="note">` : '</blockquote>'

}

function rule(md, tokens, idx) {

  if (tokens[idx].nesting === 1) {

    var m = tokens[idx].info.trim().match(/^rule\s+(.*)$/);

    if (tokens[idx].nesting === 1) {

      if (m !== null && m[1] in TOOLTIPS) {


        // opening tag
        return [

          /* html */`
          <div class="rule-title d-flex ai-center">
          <div
            class="h5 mr-2"
            aria-label="${TOOLTIPS[m[1]]}"
            data-tooltip="top">
            ${md.utils.escapeHtml(m[1])}
          </div>
          `
        ].join('')

      } else {

        // opening tag

        return [
          /* html */`
            <div class="rule-title d-flex ai-center">
          `
        ].join('')

      }
    }
  }

  return '</div>'

}



/**
 * Generates HTML markup for various blocks
 *
 * @param {"note"|"tip"|"important"} type The type of alert to create.
 * @param {Array<markdownit>} tokens Array of MarkdownIt tokens to use.
 * @param {number} index The index of the current token in the tokens array.
 * @returns {string} The markup for the alert.
 */
function grid(md, tokens, idx) {

 if(tokens[idx].nesting === 1) {

  var col = tokens[idx].info.trim().match(/^grid\s+(.*)$/);

  if (col !== null) {

    // opening tag
    return [

      /* html */`
      <div class="${md.utils.escapeHtml(col[1])}">
      `
    ].join('')
  }


 }

  return '</div>'

}


module.exports = eleventy(function (config) {


  const md = markdownit({
    html: true,
    linkify: true,
    typographer: true,
    breaks: false,
    highlight: (str, lang) => highlightCode(md, str, lang)
  })
    .use(anchor)
    .use(codeblocks)
    .use(mdcontainer, 'grid', {
      render: (tokens, idx) => grid(md, tokens, idx)
    })
    .use(mdcontainer, 'note', {
      render: (tokens, idx) => notes(tokens, idx)
    })
    .use(mdcontainer, 'rule', {
      render: (tokens, idx) => rule(md, tokens, idx)
    })
    .disable("code");

  config.setBrowserSyncConfig();
  config.addLiquidShortcode('version', () =>require('../package.json').version)
  config.setLibrary('md', md);
  config.addPlugin(svgsprite, {
    path: 'src/assets/svg',
    spriteConfig: {
      mode: {
        symbol: {
          inline: true,
          sprite: 'sprite.svg',
          example: false
        }
      },
      shape: {
        transform: ['svgo'],
        id: {
          generator: 'svg-%s'
        }
      },
      svg: {
        xmlDeclaration: false,
        doctypeDeclaration: false
      }
    }
  });

  config.addPassthroughCopy({
    'node_modules/moloko/dist': 'assets/moloko',
    'node_modules/esthetic/dist/esthetic.js': 'assets/esthetic.min.js'
  })


  if(process.env.ENV ==='prod') {
    config.addPlugin(htmlmin, {
      collapseBooleanAttributes: false,
      collapseWhitespace: true,
      decodeEntities: true,
      html5: true,
      removeAttributeQuotes: true,
      removeComments: true,
      removeOptionalTags: true,
      sortAttributes: true,
      sortClassName: true
    });
  }

  return {
    htmlTemplateEngine: 'liquid',
    passthroughFileCopy: false,
    markdownTemplateEngine: false,
    pathPrefix: '',
    templateFormats: [
      'liquid',
      'json',
      'md'
    ],
    dir: {
      input: 'src',
      output: 'public',
      includes: 'views/include',
      layouts: 'views/layouts',
      data: 'data'
    },
  };

});
