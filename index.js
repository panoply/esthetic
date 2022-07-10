'use strict';

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => prettify_exports,
  definitions: () => definitions
});
module.exports = __toCommonJS(src_exports);

// src/utils/native.ts
var assign = Object.assign;
var create = Object.create;
var keys = Object.keys;

// src/options/definitions.ts
var definitions = {
  language: {
    description: "The language name",
    lexer: "all",
    type: "select",
    default: "auto",
    values: [
      {
        rule: "auto",
        description: "Prettify will automatically detect the language"
      },
      {
        rule: "text",
        description: "Plain Text"
      },
      {
        rule: "html",
        description: "HTML"
      },
      {
        rule: "liquid",
        description: "HTML + Liquid"
      },
      {
        rule: "javascript",
        description: "JavaScript"
      },
      {
        rule: "jsx",
        description: "JSX"
      },
      {
        rule: "typescript",
        description: "TypeScript"
      },
      {
        rule: "tsx",
        description: "TSX"
      },
      {
        rule: "json",
        description: "JSON"
      },
      {
        rule: "css",
        description: "CSS"
      },
      {
        rule: "scss",
        description: "SCSS"
      },
      {
        rule: "less",
        description: "LESS"
      },
      {
        rule: "xml",
        description: "XML"
      }
    ]
  },
  wrap: {
    default: 0,
    description: "Character width limit before applying word wrap. A 0 value disables this option. A negative value concatenates script strings.",
    lexer: "all",
    type: "number"
  },
  indentSize: {
    default: 2,
    description: 'The number of "indentChar" values to comprise a single indentation.',
    lexer: "all",
    type: "number"
  },
  indentChar: {
    default: " ",
    description: "The string characters to comprise a single indentation. Any string combination is accepted.",
    lexer: "all",
    type: "string"
  },
  crlf: {
    default: false,
    description: "If line termination should be Windows (CRLF) format. Unix (LF) format is the default.",
    lexer: "all",
    type: "boolean"
  },
  endNewline: {
    default: false,
    description: "Insert an empty line at the end of output.",
    lexer: "all",
    type: "boolean"
  },
  preserveLine: {
    default: 2,
    description: "The maximum number of consecutive empty lines to retain.",
    lexer: "all",
    type: "number"
  },
  preserveComment: {
    default: false,
    description: "Prevent comment reformatting due to option wrap.",
    lexer: "all",
    type: "boolean"
  },
  commentNewline: {
    default: false,
    description: "If a blank new line should be forced above comments.",
    lexer: "all",
    type: "boolean"
  },
  commentIndent: {
    default: false,
    description: "This will determine whether comments should always start at position 0 of each line or if comments should be indented according to the code.",
    lexer: "all",
    type: "boolean"
  },
  quoteConvert: {
    lexer: "all",
    description: "If the quotes of markup attributes should be converted to single quotes or double quotes.",
    type: "select",
    default: "none",
    values: [
      {
        rule: "none",
        description: "Ignores this option"
      },
      {
        rule: "single",
        description: "Converts double quotes to single quotes"
      },
      {
        rule: "double",
        description: "Converts single quotes to double quotes"
      }
    ]
  },
  correct: {
    default: false,
    description: "Automatically correct some sloppiness in code.",
    lexer: "all",
    type: "boolean"
  },
  attributeSort: {
    default: false,
    description: "Alphanumerically sort markup attributes. Attribute sorting is ignored on tags that contain attributes template attributes.",
    lexer: "markup",
    type: "boolean"
  },
  attributeSortList: {
    default: [],
    description: "A comma separated list of attribute names. Attributes will be sorted according to this list and then alphanumerically. This option requires 'attributeSort' have a value of true.",
    lexer: "markup",
    type: "array"
  },
  attributeChain: {
    default: "inline",
    description: "Controls how Liquid tags contained within HTML attributed should be formatted.",
    type: "select",
    lexer: "markup",
    values: [
      {
        rule: "inline",
        description: "Liquid tag block contents are chained together"
      },
      {
        rule: "collapse",
        description: "Liquid tag block contents are split onto newlines"
      },
      {
        rule: "preserve",
        description: "Liquid tag block contents are preserved"
      }
    ]
  },
  delimiterSpacing: {
    default: true,
    description: "Whether or not delimiter characters should apply a single space at the start and end point",
    lexer: "markup",
    type: "boolean"
  },
  forceAttribute: {
    default: false,
    description: "If all markup attributes should be indented each onto their own line.",
    lexer: "markup",
    type: "boolean"
  },
  forceIndent: {
    default: false,
    description: "Will force indentation upon all content and tags without regard for the creation of new text nodes.",
    lexer: "markup",
    type: "boolean"
  },
  preserveAttributes: {
    default: false,
    description: "If markup tags should have their insides preserved. This option is only available to markup and does not support child tokens that require a different lexer.",
    lexer: "markup",
    type: "boolean"
  },
  preserveValues: {
    default: false,
    description: "Whether or not attribute values should be preserved. When enabled, values will allow newline characters and processing on the contents will be skipped.",
    lexer: "markup",
    type: "boolean"
  },
  preserveText: {
    default: false,
    description: "If text in the provided markup code should be preserved exactly as provided. This option eliminates beautification and wrapping of text content.",
    lexer: "markup",
    type: "boolean"
  },
  selfCloseSpace: {
    default: false,
    description: 'Markup self-closing tags end will end with " />" instead of "/>".',
    lexer: "markup",
    type: "boolean"
  },
  classPadding: {
    description: "Inserts new line characters between every CSS code block.",
    default: false,
    type: "boolean",
    lexer: "style"
  },
  sortSelectors: {
    default: false,
    type: "boolean",
    description: "If comma separated CSS selectors should present on a single line of code.",
    lexer: "style"
  },
  sortProperties: {
    lexer: "style",
    description: "This option will alphabetically sort CSS properties contained within classes.",
    default: false,
    type: "boolean"
  },
  noLeadZero: {
    lexer: "style",
    description: "This will eliminate leading zeros from numbers expressed within values.",
    default: false,
    type: "boolean"
  },
  compressCSS: {
    lexer: "style",
    description: "If CSS should be beautified in a style where the properties and values are minifed for faster reading of selectors.",
    default: false,
    type: "boolean"
  },
  braceAllman: {
    lexer: "script",
    default: false,
    description: 'Determines if opening curly braces will exist on the same line as their condition or be forced onto a new line, otherwise known as "Allman Style" indentation.',
    type: "boolean"
  },
  bracePadding: {
    default: false,
    description: "This will create a newline before and after objects values",
    type: "boolean",
    lexer: "script"
  },
  braceNewline: {
    default: false,
    description: "If true an empty line will be inserted after opening curly braces and before closing curly braces.",
    type: "boolean",
    lexer: "script"
  },
  braceStyle: {
    default: "none",
    description: "Emulates JSBeautify's brace_style option using existing Prettify options",
    type: "select",
    lexer: "script",
    values: [
      {
        rule: "none",
        description: "Ignores this option"
      },
      {
        rule: "collapse",
        description: "Sets formatObject to indent and neverflatten to true."
      },
      {
        rule: "collapse-preserve-inline",
        description: "Sets formatObject to inline and bracePadding to true"
      },
      {
        rule: "expand",
        description: "Sets objectIndent to indent and braceNewline + neverflatten to true."
      }
    ]
  },
  arrayFormat: {
    lexer: "script",
    description: "Determines if all array indexes should be indented, never indented, or left to the default",
    type: "select",
    default: "default",
    values: [
      {
        rule: "default",
        description: "Default formatting"
      },
      {
        rule: "indent",
        description: "Always indent each index of an array"
      },
      {
        rule: "inline",
        description: "Ensure all array indexes appear on a single line"
      }
    ]
  },
  objectSort: {
    default: false,
    description: "This option will alphabetically sort object properties in JSON objects",
    type: "boolean",
    lexer: "script"
  },
  objectIndent: {
    description: "This option will alphabetically sort object properties in JSON objects",
    type: "select",
    lexer: "script",
    default: "default",
    values: [
      {
        rule: "default",
        description: "Default formatting"
      },
      {
        rule: "indent",
        description: "Always indent each index of an array"
      },
      {
        rule: "inline",
        description: "Ensure all array indexes appear on a single line"
      }
    ]
  },
  functionSpace: {
    lexer: "script",
    default: true,
    type: "boolean",
    description: "Inserts a space following the function keyword for anonymous functions."
  },
  functionNameSpace: {
    lexer: "script",
    default: true,
    type: "boolean",
    description: "If a space should follow a JavaScript function name."
  },
  methodChain: {
    lexer: "script",
    default: -1,
    description: "When to break consecutively chained methods and properties onto separate lines. A negative value disables this option. A value of 0 ensures method chainsare never broken.",
    type: "number"
  },
  caseSpace: {
    default: false,
    type: "boolean",
    description: "If the colon separating a case's expression (of a switch/case block) from its statement should be followed by a space instead of indentation thereby keeping the case on a single line of code.",
    lexer: "script"
  },
  inlineReturn: {
    lexer: "script",
    default: true,
    type: "boolean",
    description: "Inlines return statements contained within `if` and `else` conditions. This rules also augments code and will reason about your structure to output the best and most readable results."
  },
  elseNewline: {
    lexer: "script",
    default: false,
    type: "boolean",
    description: 'If keyword "else" is forced onto a new line.'
  },
  ternaryLine: {
    lexer: "script",
    description: "If ternary operators in JavaScript `?` and `:` should remain on the same line.",
    type: "boolean",
    default: false
  },
  neverFlatten: {
    lexer: "script",
    default: true,
    description: "If destructured lists in script should never be flattend.",
    type: "boolean"
  },
  variableList: {
    lexer: "script",
    description: "If consecutive JavaScript variables should be merged into a comma separated list or if variables in a list should be separated. each \u2014 Ensure each reference is a single declaration statement.",
    type: "select",
    default: "none",
    values: [
      {
        rule: "none",
        description: "Ignores this option"
      },
      {
        rule: "each",
        description: "Ensure each reference is a single declaration statement"
      },
      {
        rule: "list",
        description: "Ensure consecutive declarations are a comma separated list"
      }
    ]
  },
  vertical: {
    lexer: "script",
    description: "If lists of assignments and properties should be vertically aligned",
    type: "boolean",
    default: false
  },
  noSemicolon: {
    lexer: "script",
    description: "Removes semicolons that would be inserted by ASI. This option is in conflict with option `attemptCorrection` and takes precedence over conflicting features. Use of this option is a possible security/stability risk.",
    default: false,
    type: "boolean"
  },
  endComma: {
    description: "If there should be a trailing comma in arrays and objects.",
    type: "select",
    lexer: "script",
    default: "none",
    values: [
      {
        rule: "none",
        description: "Ignore this option"
      },
      {
        rule: "always",
        description: "Always ensure there is a tailing comma"
      },
      {
        rule: "never",
        description: "Remove trailing commas"
      }
    ]
  }
};

// src/options.ts
var prettify = create(null);
prettify.parsed = create(null);
prettify.options = create(null);
prettify.beautify = create(null);
prettify.lexers = create(null);
prettify.definitions = definitions;
prettify.mode = "beautify";
prettify.source = "";
prettify.end = 0;
prettify.iterator = 0;
prettify.start = 0;
prettify.scopes = [];
prettify.stats = create(null);
prettify.stats.chars = -1;
prettify.stats.time = -1;
prettify.stats.size = "";
prettify.stats.language = "";
prettify.hooks = create(null);
prettify.hooks.before = [];
prettify.hooks.language = [];
prettify.hooks.rules = [];
prettify.hooks.after = [];
prettify.options.mode = "beautify";
prettify.options.tagMerge = false;
prettify.options.tagSort = false;
prettify.options.lexer = "auto";
prettify.options.language = "text";
prettify.options.languageName = "Plain Text";
prettify.options.indentLevel = 0;
prettify.options.crlf = false;
prettify.options.commentIndent = true;
prettify.options.endNewline = false;
prettify.options.indentChar = " ";
prettify.options.indentSize = 2;
prettify.options.preserveComment = false;
prettify.options.preserveLine = 2;
prettify.options.wrap = 0;
prettify.options.markup = create(null);
prettify.options.markup.correct = false;
prettify.options.markup.commentNewline = false;
prettify.options.markup.attributeChain = "inline";
prettify.options.markup.attributeValues = "align";
prettify.options.markup.attributeSort = false;
prettify.options.markup.attributeSortList = [];
prettify.options.markup.forceAttribute = false;
prettify.options.markup.forceLeadingAttribute = false;
prettify.options.markup.preserveText = false;
prettify.options.markup.preserveAttributes = false;
prettify.options.markup.selfCloseSpace = false;
prettify.options.markup.forceIndent = false;
prettify.options.markup.quoteConvert = "none";
prettify.options.style = create(null);
prettify.options.style.correct = false;
prettify.options.style.compressCSS = false;
prettify.options.style.classPadding = false;
prettify.options.style.noLeadZero = false;
prettify.options.style.sortSelectors = false;
prettify.options.style.sortProperties = false;
prettify.options.style.quoteConvert = "none";
prettify.options.script = create(null);
prettify.options.script.correct = false;
prettify.options.script.braceNewline = false;
prettify.options.script.bracePadding = false;
prettify.options.script.braceStyle = "none";
prettify.options.script.braceAllman = false;
prettify.options.script.commentNewline = false;
prettify.options.script.caseSpace = false;
prettify.options.script.inlineReturn = true;
prettify.options.script.elseNewline = false;
prettify.options.script.endComma = "never";
prettify.options.script.arrayFormat = "default";
prettify.options.script.objectSort = false;
prettify.options.script.objectIndent = "default";
prettify.options.script.functionNameSpace = false;
prettify.options.script.functionSpace = false;
prettify.options.script.styleGuide = "none";
prettify.options.script.ternaryLine = false;
prettify.options.script.methodChain = 4;
prettify.options.script.neverFlatten = false;
prettify.options.script.noCaseIndent = false;
prettify.options.script.noSemicolon = false;
prettify.options.script.quoteConvert = "none";
prettify.options.script.variableList = "none";
prettify.options.script.vertical = false;
prettify.options.json = create(null);
prettify.options.json.arrayFormat = "default";
prettify.options.json.braceAllman = false;
prettify.options.json.bracePadding = false;
prettify.options.json.objectIndent = "default";
prettify.options.json.objectSort = false;

// src/utils/helpers.ts
function repeatChar(count, ch = " ") {
  if (count === 0)
    return ch;
  let char = "";
  let i = 1;
  do {
    char += ch;
  } while (i++ < count);
  return char;
}
function is(string, code) {
  if (!string)
    return false;
  return string.charCodeAt(0) === code;
}
function not(string, code) {
  return is(string, code) === false;
}
function ws(string) {
  return /\s/.test(string);
}
function size(bytes) {
  const kb = 1024;
  const mb = 1048576;
  const gb = 1073741824;
  if (bytes < kb)
    return bytes + " B";
  else if (bytes < mb)
    return (bytes / kb).toFixed(1) + " KB";
  else if (bytes < gb)
    return (bytes / mb).toFixed(1) + " MB";
  else
    return (bytes / gb).toFixed(1) + " GB";
}

// src/parser/parse.ts
var parse = new class Parse {
  constructor() {
    this.error = "";
    this.data = create(null);
    this.references = [[]];
    this.structure = [["global", -1]];
    this.datanames = ["begin", "ender", "lexer", "lines", "stack", "token", "types"];
    this.count = -1;
    this.lineNumber = 1;
    this.linesSpace = 0;
    this.data.begin = [];
    this.data.ender = [];
    this.data.lexer = [];
    this.data.lines = [];
    this.data.stack = [];
    this.data.token = [];
    this.data.types = [];
  }
  get current() {
    const {
      begin,
      ender,
      lexer,
      lines,
      stack,
      token,
      types
    } = this.data;
    return {
      begin: begin[begin.length - 1],
      ender: ender[ender.length - 1],
      lexer: lexer[lexer.length - 1],
      lines: lines[lines.length - 1],
      stack: stack[stack.length - 1],
      token: token[begin.length - 1],
      types: types[begin.length - 1]
    };
  }
  concat(data, array) {
    for (const v of this.datanames)
      data[v] = data[v].concat(array[v]);
    if (data === this.data)
      this.count = data.token.length - 1;
  }
  objectSort(data) {
    let cc2 = this.count;
    let dd = this.structure[this.structure.length - 1][1];
    let ee = 0;
    let ff = 0;
    let gg = 0;
    let behind = 0;
    let commaTest = true;
    let front = 0;
    let keyend = 0;
    let keylen = 0;
    const global = data.lexer[cc2] === "style" && this.structure[this.structure.length - 1][0] === "global";
    const keys2 = [];
    const length = this.count;
    const begin = dd;
    const style3 = data.lexer[cc2] === "style";
    const delim = style3 === true ? [";", "separator"] : [",", "separator"];
    const lines = this.linesSpace;
    const stack = global === true ? "global" : this.structure[this.structure.length - 1][0];
    function sort(x, y) {
      let xx = x[0];
      let yy = y[0];
      if (data.types[xx] === "comment") {
        do {
          xx = xx + 1;
        } while (xx < length && data.types[xx] === "comment");
        if (data.token[xx] === void 0) {
          return 1;
        }
      }
      if (data.types[yy] === "comment") {
        do {
          yy = yy + 1;
        } while (yy < length && data.types[yy] === "comment");
        if (data.token[yy] === void 0)
          return 1;
      }
      if (style3 === true) {
        if (data.token[xx].indexOf("@import") === 0 || data.token[yy].indexOf("@import") === 0) {
          return xx < yy ? -1 : 1;
        }
        if (data.types[xx] !== data.types[yy]) {
          if (data.types[xx] === "function")
            return 1;
          if (data.types[xx] === "variable")
            return -1;
          if (data.types[xx] === "selector")
            return 1;
          if (data.types[xx] === "property" && data.types[yy] !== "variable")
            return -1;
          if (data.types[xx] === "mixin" && data.types[yy] !== "property" && data.types[yy] !== "variable")
            return -1;
        }
      }
      if (data.token[xx].toLowerCase() > data.token[yy].toLowerCase())
        return 1;
      return -1;
    }
    const store = create(null);
    store.begin = [];
    store.ender = [];
    store.lexer = [];
    store.lines = [];
    store.stack = [];
    store.token = [];
    store.types = [];
    behind = cc2;
    do {
      if (data.begin[cc2] === dd || global === true && cc2 < behind && data.token[cc2] === "}" && data.begin[data.begin[cc2]] === -1) {
        if (data.types[cc2].indexOf("template") > -1)
          return;
        if (data.token[cc2] === delim[0] || style3 === true && data.token[cc2] === "}" && data.token[cc2 + 1] !== ";") {
          commaTest = true;
          front = cc2 + 1;
        } else if (style3 === true && data.token[cc2 - 1] === "}") {
          commaTest = true;
          front = cc2;
        }
        if (front === 0 && data.types[0] === "comment") {
          do {
            front = front + 1;
          } while (data.types[front] === "comment");
        } else if (data.types[front] === "comment" && data.lines[front] < 2) {
          front = front + 1;
        }
        if (commaTest === true && (data.token[cc2] === delim[0] || style3 === true && data.token[cc2 - 1] === "}") && front <= behind) {
          if (style3 === true && "};".indexOf(data.token[behind]) < 0) {
            behind = behind + 1;
          } else if (style3 === false && data.token[behind] !== ",") {
            behind = behind + 1;
          }
          keys2.push([front, behind]);
          if (style3 === true && data.token[front] === "}") {
            behind = front;
          } else {
            behind = front - 1;
          }
        }
      }
      cc2 = cc2 - 1;
    } while (cc2 > dd);
    if (keys2.length > 0 && keys2[keys2.length - 1][0] > cc2 + 1) {
      ee = keys2[keys2.length - 1][0] - 1;
      if (data.types[ee] === "comment" && data.lines[ee] > 1) {
        do {
          ee = ee - 1;
        } while (ee > 0 && data.types[ee] === "comment");
        keys2[keys2.length - 1][0] = ee + 1;
      }
      if (data.types[cc2 + 1] === "comment" && cc2 === -1) {
        do {
          cc2 = cc2 + 1;
        } while (data.types[cc2 + 1] === "comment");
      }
      keys2.push([cc2 + 1, ee]);
    }
    if (keys2.length > 1) {
      if (style3 === true || data.token[cc2 - 1] === "=" || data.token[cc2 - 1] === ":" || data.token[cc2 - 1] === "(" || data.token[cc2 - 1] === "[" || data.token[cc2 - 1] === "," || data.types[cc2 - 1] === "word" || cc2 === 0) {
        keys2.sort(sort);
        keylen = keys2.length;
        commaTest = false;
        dd = 0;
        do {
          keyend = keys2[dd][1];
          if (style3 === true) {
            gg = keyend;
            if (data.types[gg] === "comment")
              gg = gg - 1;
            if (data.token[gg] === "}") {
              keyend = keyend + 1;
              delim[0] = "}";
              delim[1] = "end";
            } else {
              delim[0] = ";";
              delim[1] = "separator";
            }
          }
          ee = keys2[dd][0];
          if (style3 === true && data.types[keyend - 1] !== "end" && data.types[keyend] === "comment" && data.types[keyend + 1] !== "comment" && dd < keylen - 1) {
            keyend = keyend + 1;
          }
          if (ee < keyend) {
            do {
              if (style3 === false && dd === keylen - 1 && ee === keyend - 2 && data.token[ee] === "," && data.lexer[ee] === "script" && data.types[ee + 1] === "comment") {
                ff = ff + 1;
              } else {
                const o = create(null);
                o.begin = data.begin[ee];
                o.ender = data.ender[ee];
                o.lexer = data.lexer[ee];
                o.lines = data.lines[ee];
                o.stack = data.stack[ee];
                o.token = data.token[ee];
                o.types = data.types[ee];
                this.push(store, o, "");
                ff = ff + 1;
              }
              if (data.token[ee] === delim[0] && (style3 === true || data.begin[ee] === data.begin[keys2[dd][0]])) {
                commaTest = true;
              } else if (data.token[ee] !== delim[0] && data.types[ee] !== "comment") {
                commaTest = false;
              }
              ee = ee + 1;
            } while (ee < keyend);
          }
          if (commaTest === false && store.token[store.token.length - 1] !== "x;" && (style3 === true || dd < keylen - 1)) {
            ee = store.types.length - 1;
            if (store.types[ee] === "comment") {
              do {
                ee = ee - 1;
              } while (ee > 0 && store.types[ee] === "comment");
            }
            ee = ee + 1;
            this.splice({
              data: store,
              howmany: 0,
              index: ee,
              record: {
                begin,
                ender: this.count,
                lexer: store.lexer[ee - 1],
                lines: 0,
                stack,
                token: delim[0],
                types: delim[1]
              }
            });
            ff = ff + 1;
          }
          dd = dd + 1;
        } while (dd < keylen);
        this.splice({ data, howmany: ff, index: cc2 + 1 });
        this.linesSpace = lines;
        this.concat(data, store);
      }
    }
  }
  pop(data) {
    const output = create(null);
    output.begin = data.begin.pop();
    output.ender = data.ender.pop();
    output.lexer = data.lexer.pop();
    output.lines = data.lines.pop();
    output.stack = data.stack.pop();
    output.token = data.token.pop();
    output.types = data.types.pop();
    if (data === this.data)
      this.count = this.count - 1;
    return output;
  }
  push(data, record, structure) {
    const ender = () => {
      let a = this.count;
      const begin = data.begin[a];
      if ((data.lexer[a] === "script" || data.lexer[a] === "style") && prettify.options[data.lexer[a]].objectSort === true) {
        return;
      }
      do {
        if (data.begin[a] === begin || data.begin[data.begin[a]] === begin && data.types[a].indexOf("attribute") > -1 && data.types[a].indexOf("attribute_end") < 0) {
          data.ender[a] = this.count;
        } else {
          a = data.begin[a];
        }
        a = a - 1;
      } while (a > begin);
      if (a > -1)
        data.ender[a] = this.count;
    };
    this.datanames.forEach((value) => data[value].push(record[value]));
    if (data === this.data) {
      this.count = this.count + 1;
      this.linesSpace = 0;
      if (record.lexer !== "style") {
        if (structure.replace(/(\{|\}|@|<|>|%|#|)/g, "") === "") {
          structure = record.types === "else" ? "else" : structure = record.token;
        }
      }
      if (record.types === "start" || record.types.indexOf("_start") > 0) {
        this.structure.push([structure, this.count]);
      } else if (record.types === "end" || record.types.indexOf("_end") > 0) {
        let case_ender = 0;
        if (this.structure.length > 2 && (data.types[this.structure[this.structure.length - 1][1]] === "else" || data.types[this.structure[this.structure.length - 1][1]].indexOf("_else") > 0) && (data.types[this.structure[this.structure.length - 2][1]] === "start" || data.types[this.structure[this.structure.length - 2][1]].indexOf("_start") > 0) && (data.types[this.structure[this.structure.length - 2][1] + 1] === "else" || data.types[this.structure[this.structure.length - 2][1] + 1].indexOf("_else") > 0)) {
          this.structure.pop();
          data.begin[this.count] = this.structure[this.structure.length - 1][1];
          data.stack[this.count] = this.structure[this.structure.length - 1][0];
          data.ender[this.count - 1] = this.count;
          case_ender = data.ender[data.begin[this.count] + 1];
        }
        ender();
        if (case_ender > 0)
          data.ender[data.begin[this.count] + 1] = case_ender;
        this.structure.pop();
      } else if (record.types === "else" || record.types.indexOf("_else") > 0) {
        if (structure === "")
          structure = "else";
        if (this.count > 0 && (data.types[this.count - 1] === "start" || data.types[this.count - 1].indexOf("_start") > 0)) {
          this.structure.push([structure, this.count]);
        } else {
          ender();
          if (structure === "") {
            this.structure[this.structure.length - 1] = ["else", this.count];
          } else {
            this.structure[this.structure.length - 1] = [structure, this.count];
          }
        }
      }
    }
  }
  safeSort(array, operation, recursive) {
    let extref = (item) => item;
    const arTest = (item) => Array.isArray(item) === true;
    function safeSortNormal(item) {
      let storeb = item;
      const done = [item[0]];
      function safeSortNormalChild() {
        let a = 0;
        const len = storeb.length;
        if (a < len) {
          do {
            if (arTest(storeb[a]) === true)
              storeb[a] = safeSortNormal(storeb[a]);
            a = a + 1;
          } while (a < len);
        }
      }
      function safeSortNormalRecurse(x) {
        let a = 0;
        const storea = [];
        const len = storeb.length;
        if (a < len) {
          do {
            if (storeb[a] !== x)
              storea.push(storeb[a]);
            a = a + 1;
          } while (a < len);
        }
        storeb = storea;
        if (storea.length > 0) {
          done.push(storea[0]);
          extref(storea[0]);
        } else {
          if (recursive === true)
            safeSortNormalChild();
          item = storeb;
        }
      }
      extref = safeSortNormalRecurse;
      safeSortNormalRecurse(array[0]);
      return item;
    }
    function safeSortDescend(item) {
      let c = 0;
      const len = item.length;
      const storeb = item;
      function safeSortDescendChild() {
        let a = 0;
        const lenc = storeb.length;
        if (a < lenc) {
          do {
            if (arTest(storeb[a]))
              storeb[a] = safeSortDescend(storeb[a]);
            a = a + 1;
          } while (a < lenc);
        }
      }
      function safeSortDescendRecurse(value) {
        let a = c;
        let b = 0;
        let d = 0;
        let e = 0;
        let key = storeb[c];
        let ind = [];
        let tstore = "";
        const tkey = typeof key;
        if (a < len) {
          do {
            tstore = typeof storeb[a];
            if (storeb[a] > key || tstore > tkey) {
              key = storeb[a];
              ind = [a];
            } else if (storeb[a] === key) {
              ind.push(a);
            }
            a = a + 1;
          } while (a < len);
        }
        d = ind.length;
        a = c;
        b = d + c;
        if (a < b) {
          do {
            storeb[ind[e]] = storeb[a];
            storeb[a] = key;
            e = e + 1;
            a = a + 1;
          } while (a < b);
        }
        c = c + d;
        if (c < len) {
          extref("");
        } else {
          if (recursive === true)
            safeSortDescendChild();
          item = storeb;
        }
        return value;
      }
      extref = safeSortDescendRecurse;
      safeSortDescendRecurse("");
      return item;
    }
    function safeSortAscend(item) {
      let c = 0;
      const len = item.length;
      const storeb = item;
      function safeSortAscendChild() {
        let a = 0;
        const lenc = storeb.length;
        if (a < lenc) {
          do {
            if (arTest(storeb[a]) === true)
              storeb[a] = safeSortAscend(storeb[a]);
            a = a + 1;
          } while (a < lenc);
        }
      }
      function safeSortAscendRecurse(value) {
        let a = c;
        let b = 0;
        let d = 0;
        let e = 0;
        let ind = [];
        let key = storeb[c];
        let tstore = "";
        const tkey = typeof key;
        if (a < len) {
          do {
            tstore = typeof storeb[a];
            if (storeb[a] < key || tstore < tkey) {
              key = storeb[a];
              ind = [a];
            } else if (storeb[a] === key) {
              ind.push(a);
            }
            a = a + 1;
          } while (a < len);
        }
        d = ind.length;
        a = c;
        b = d + c;
        if (a < b) {
          do {
            storeb[ind[e]] = storeb[a];
            storeb[a] = key;
            e = e + 1;
            a = a + 1;
          } while (a < b);
        }
        c = c + d;
        if (c < len) {
          extref("");
        } else {
          if (recursive === true)
            safeSortAscendChild();
          item = storeb;
        }
        return value;
      }
      extref = safeSortAscendRecurse;
      safeSortAscendRecurse("");
      return item;
    }
    if (arTest(array) === false)
      return array;
    if (operation === "normal")
      return safeSortNormal(array);
    if (operation === "descend")
      return safeSortDescend(array);
    return safeSortAscend(array);
  }
  sortCorrection(start, end) {
    let a = start;
    let endslen = -1;
    const data = this.data;
    const ends = [];
    const structure = this.structure.length < 2 ? [-1] : [this.structure[this.structure.length - 2][1]];
    do {
      if (a > 0 && data.types[a].indexOf("attribute") > -1 && data.types[a].indexOf("end") < 0 && data.types[a - 1].indexOf("start") < 0 && data.types[a - 1].indexOf("attribute") < 0 && data.lexer[a] === "markup") {
        structure.push(a - 1);
      }
      if (a > 0 && data.types[a - 1].indexOf("attribute") > -1 && data.types[a].indexOf("attribute") < 0 && data.lexer[structure[structure.length - 1]] === "markup" && data.types[structure[structure.length - 1]].indexOf("start") < 0) {
        structure.pop();
      }
      if (data.begin[a] !== structure[structure.length - 1]) {
        if (structure.length > 0) {
          data.begin[a] = structure[structure.length - 1];
        } else {
          data.begin[a] = -1;
        }
      }
      if (data.types[a].indexOf("else") > -1) {
        if (structure.length > 0) {
          structure[structure.length - 1] = a;
        } else {
          structure.push(a);
        }
      }
      if (data.types[a].indexOf("end") > -1)
        structure.pop();
      if (data.types[a].indexOf("start") > -1)
        structure.push(a);
      a = a + 1;
    } while (a < end);
    a = end;
    do {
      a = a - 1;
      if (data.types[a].indexOf("end") > -1) {
        ends.push(a);
        endslen = endslen + 1;
      }
      data.ender[a] = endslen > -1 ? ends[endslen] : -1;
      if (data.types[a].indexOf("start") > -1) {
        ends.pop();
        endslen = endslen - 1;
      }
    } while (a > start);
  }
  spacer(args) {
    this.linesSpace = 1;
    do {
      if (args.array[args.index] === "\n") {
        this.linesSpace = this.linesSpace + 1;
        this.lineNumber = this.lineNumber + 1;
      }
      if (/\s/.test(args.array[args.index + 1]) === false)
        break;
      args.index = args.index + 1;
    } while (args.index < args.end);
    return args.index;
  }
  splice(splice) {
    const finalItem = [this.data.begin[this.count], this.data.token[this.count]];
    if (splice.record !== void 0 && splice.record.token !== "") {
      for (const value of this.datanames) {
        splice.data[value].splice(splice.index, splice.howmany, splice.record[value]);
      }
      if (splice.data === this.data) {
        this.count = this.count - splice.howmany + 1;
        if (finalItem[0] !== this.data.begin[this.count] || finalItem[1] !== this.data.token[this.count]) {
          this.linesSpace = 0;
        }
      }
      return;
    }
    for (const value of this.datanames) {
      splice.data[value].splice(splice.index, splice.howmany);
    }
    if (splice.data === this.data) {
      this.count = this.count - splice.howmany;
      this.linesSpace = 0;
    }
  }
  wrapCommentBlock(config) {
    let a = config.start;
    let b = 0;
    let c = 0;
    let d = 0;
    let len = 0;
    let lines = [];
    let space = "";
    let bline = "";
    let emptyLine = false;
    let bulletLine = false;
    let numberLine = false;
    let bigLine = false;
    let output = "";
    let terml = config.terminator.length - 1;
    let term = config.terminator.charAt(terml);
    let twrap = 0;
    const {
      wrap,
      crlf,
      preserveComment
    } = prettify.options;
    const build = [];
    const second = [];
    const lf = crlf === true ? "\r\n" : "\n";
    const sanitize = (input) => `\\${input}`;
    const regEsc = /(\/|\\|\||\*|\[|\]|\{|\})/g;
    const regEndEsc = /{%-?\s*|\s*-?%}/g;
    const regEnd = new RegExp(`\\s*${config.terminator.replace(regEndEsc, (input) => {
      if (input.charCodeAt(0) === 123 /* LCB */)
        return "{%-?\\s*";
      return "\\s*-?%}";
    })}$`);
    const opensan = config.opening.replace(regEsc, sanitize);
    const regIgnore = new RegExp(`^(${opensan}\\s*@prettify-ignore-start)`);
    const regStart = new RegExp(`(${opensan}\\s*)`);
    const isLiquid = is(config.opening[0], 123 /* LCB */) && is(config.opening[1], 37 /* PER */);
    function emptylines() {
      if (/^\s+$/.test(lines[b + 1]) || lines[b + 1] === "") {
        do {
          b = b + 1;
        } while (b < len && (/^\s+$/.test(lines[b + 1]) || lines[b + 1] === ""));
      }
      if (b < len - 1)
        second.push("");
    }
    do {
      build.push(config.chars[a]);
      if (config.chars[a] === "\n")
        this.lineNumber = this.lineNumber + 1;
      if (config.chars[a] === term && config.chars.slice(a - terml, a + 1).join("") === config.terminator)
        break;
      a = a + 1;
    } while (a < config.end);
    output = build.join("");
    if (regIgnore.test(output) === true) {
      let termination = "\n";
      a = a + 1;
      do {
        build.push(config.chars[a]);
        if (build.slice(build.length - 20).join("") === "@prettify-ignore-end") {
          if (isLiquid) {
            const d2 = config.chars.indexOf("{", a);
            if (is(config.chars[d2 + 1], 37 /* PER */)) {
              const ender = config.chars.slice(d2, config.chars.indexOf("}", d2 + 1) + 1).join("");
              if (regEnd.test(ender))
                config.terminator = ender;
            }
          }
          a = a + 1;
          break;
        }
        a = a + 1;
      } while (a < config.end);
      b = a;
      terml = config.opening.length - 1;
      term = config.opening.charAt(terml);
      do {
        if (config.opening === "/*" && config.chars[b - 1] === "/" && (config.chars[b] === "*" || config.chars[b] === "/"))
          break;
        if (config.opening !== "/*" && config.chars[b] === term && config.chars.slice(b - terml, b + 1).join("") === config.opening)
          break;
        b = b - 1;
      } while (b > config.start);
      if (config.opening === "/*" && config.chars[b] === "*") {
        termination = "*/";
      } else if (config.opening !== "/*") {
        termination = config.terminator;
      }
      terml = termination.length - 1;
      term = termination.charAt(terml);
      if (termination !== "\n" || config.chars[a] !== "\n") {
        do {
          build.push(config.chars[a]);
          if (termination === "\n" && config.chars[a + 1] === "\n")
            break;
          if (config.chars[a] === term && config.chars.slice(a - terml, a + 1).join("") === termination)
            break;
          a = a + 1;
        } while (a < config.end);
      }
      if (config.chars[a] === "\n")
        a = a - 1;
      output = build.join("").replace(/\s+$/, "");
      return [output, a];
    }
    if (preserveComment === true || wrap < 1 || a === config.end || output.length <= wrap && output.indexOf("\n") < 0 || config.opening === "/*" && output.indexOf("\n") > 0 && output.replace("\n", "").indexOf("\n") > 0 && /\n(?!(\s*\*))/.test(output) === false) {
      return [output, a];
    }
    b = config.start;
    if (b > 0 && config.chars[b - 1] !== "\n" && /\s/.test(config.chars[b - 1])) {
      do {
        b = b - 1;
      } while (b > 0 && config.chars[b - 1] !== "\n" && /\s/.test(config.chars[b - 1]));
    }
    space = config.chars.slice(b, config.start).join("");
    const spaceLine = new RegExp("\n" + space, "g");
    lines = output.replace(/\r\n/g, "\n").replace(spaceLine, "\n").split("\n");
    len = lines.length;
    lines[0] = lines[0].replace(regStart, "");
    lines[len - 1] = lines[len - 1].replace(regEnd, "");
    if (len < 2)
      lines = lines[0].split(" ");
    if (lines[0] === "") {
      lines[0] = config.opening;
    } else {
      lines.splice(0, 0, config.opening);
    }
    len = lines.length;
    b = 0;
    do {
      bline = b < len - 1 ? lines[b + 1].replace(/^\s+/, "") : "";
      if (/^\s+$/.test(lines[b]) === true || lines[b] === "") {
        emptylines();
      } else if (lines[b].slice(0, 4) === "    ") {
        second.push(lines[b]);
      } else if (lines[b].replace(/^\s+/, "").length > wrap && lines[b].replace(/^\s+/, "").indexOf(" ") > wrap) {
        lines[b] = lines[b].replace(/^\s+/, "");
        c = lines[b].indexOf(" ");
        second.push(lines[b].slice(0, c));
        lines[b] = lines[b].slice(c + 1);
        b = b - 1;
      } else {
        lines[b] = config.opening === "/*" && lines[b].indexOf("/*") !== 0 ? `   ${lines[b].replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s+/g, " ")}` : `${lines[b].replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s+/g, " ")}`;
        twrap = b < 1 ? wrap - (config.opening.length + 1) : wrap;
        c = lines[b].length;
        d = lines[b].replace(/^\s+/, "").indexOf(" ");
        if (c > twrap && d > 0 && d < twrap) {
          c = twrap;
          do {
            c = c - 1;
            if (/\s/.test(lines[b].charAt(c)) && c <= wrap)
              break;
          } while (c > 0);
          if (lines[b].slice(0, 4) !== "    " && /^\s*(\*|-)\s/.test(lines[b]) === true && /^\s*(\*|-)\s/.test(lines[b + 1]) === false) {
            lines.splice(b + 1, 0, "* ");
          }
          if (lines[b].slice(0, 4) !== "    " && /^\s*\d+\.\s/.test(lines[b]) === true && /^\s*\d+\.\s/.test(lines[b + 1]) === false) {
            lines.splice(b + 1, 0, "1. ");
          }
          if (c < 4) {
            second.push(lines[b]);
            bigLine = true;
          } else if (b === len - 1) {
            second.push(lines[b].slice(0, c));
            lines[b] = lines[b].slice(c + 1);
            bigLine = true;
            b = b - 1;
          } else if (/^\s+$/.test(lines[b + 1]) === true || lines[b + 1] === "") {
            second.push(lines[b].slice(0, c));
            lines[b] = lines[b].slice(c + 1);
            emptyLine = true;
            b = b - 1;
          } else if (lines[b + 1].slice(0, 4) !== "    " && /^\s*(\*|-)\s/.test(lines[b + 1])) {
            second.push(lines[b].slice(0, c));
            lines[b] = lines[b].slice(c + 1);
            bulletLine = true;
            b = b - 1;
          } else if (lines[b + 1].slice(0, 4) !== "    " && /^\s*\d+\.\s/.test(lines[b + 1])) {
            second.push(lines[b].slice(0, c));
            lines[b] = lines[b].slice(c + 1);
            numberLine = true;
            b = b - 1;
          } else if (lines[b + 1].slice(0, 4) === "    ") {
            second.push(lines[b].slice(0, c));
            lines[b] = lines[b].slice(c + 1);
            bigLine = true;
            b = b - 1;
          } else if (c + bline.length > wrap && bline.indexOf(" ") < 0) {
            second.push(lines[b].slice(0, c));
            lines[b] = lines[b].slice(c + 1);
            bigLine = true;
            b = b - 1;
          } else if (lines[b].replace(/^\s+/, "").indexOf(" ") < wrap) {
            lines[b + 1] = lines[b].length > wrap ? lines[b].slice(c + 1) + lf + lines[b + 1] : `${lines[b].slice(c + 1)} ${lines[b + 1]}`;
          }
          if (emptyLine === false && bulletLine === false && numberLine === false && bigLine === false) {
            lines[b] = lines[b].slice(0, c);
          }
        } else if (lines[b + 1] !== void 0 && (lines[b].length + bline.indexOf(" ") > wrap && bline.indexOf(" ") > 0 || lines[b].length + bline.length > wrap && bline.indexOf(" ") < 0)) {
          second.push(lines[b]);
          b = b + 1;
        } else if (lines[b + 1] !== void 0 && /^\s+$/.test(lines[b + 1]) === false && lines[b + 1] !== "" && lines[b + 1].slice(0, 4) !== "    " && /^\s*(\*|-|(\d+\.))\s/.test(lines[b + 1]) === false) {
          lines[b + 1] = `${lines[b]} ${lines[b + 1]}`;
          emptyLine = true;
        }
        if (bigLine === false && bulletLine === false && numberLine === false) {
          if (emptyLine === true) {
            emptyLine = false;
          } else if (/^\s*(\*|-|(\d+\.))\s*$/.test(lines[b]) === false) {
            if (b < len - 1 && lines[b + 1] !== "" && /^\s+$/.test(lines[b]) === false && lines[b + 1].slice(0, 4) !== "    " && /^\s*(\*|-|(\d+\.))\s/.test(lines[b + 1]) === false) {
              lines[b] = `${lines[b]} ${lines[b + 1]}`;
              lines.splice(b + 1, 1);
              len = len - 1;
              b = b - 1;
            } else {
              if (config.opening === "/*" && lines[b].indexOf("/*") !== 0) {
                second.push(`   ${lines[b].replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s+/g, " ")}`);
              } else {
                second.push(`${lines[b].replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s+/g, " ")}`);
              }
            }
          }
        }
        bigLine = false;
        bulletLine = false;
        numberLine = false;
      }
      b = b + 1;
    } while (b < len);
    if (second.length > 0) {
      if (second[second.length - 1].length > wrap - (config.terminator.length + 1)) {
        second.push(config.terminator);
      } else {
        second[second.length - 1] = `${second[second.length - 1]} ${config.terminator}`;
      }
      output = second.join(lf);
    } else {
      lines[lines.length - 1] = lines[lines.length - 1] + config.terminator;
      output = lines.join(lf);
    }
    return [output, a];
  }
  wrapCommentLine(config) {
    let a = config.start;
    let b = 0;
    let output = "";
    let build = [];
    const { wrap, preserveComment } = prettify.options;
    function recurse() {
      let line = "";
      do {
        b = b + 1;
        if (config.chars[b + 1] === "\n")
          return;
      } while (b < config.end && /\s/.test(config.chars[b]) === true);
      if (config.chars[b] + config.chars[b + 1] === "//") {
        build = [];
        do {
          build.push(config.chars[b]);
          b = b + 1;
        } while (b < config.end && config.chars[b] !== "\n");
        line = build.join("");
        if (/^\/\/ (\*|-|(\d+\.))/.test(line) === false && line.slice(0, 6) !== "//    " && /^\/\/\s*$/.test(line) === false) {
          output = `${output} ${line.replace(/(^\/\/\s*)/, "").replace(/\s+$/, "")}`;
          a = b - 1;
          recurse();
        }
      }
    }
    const wordWrap = () => {
      const lines = [];
      const record = create(null);
      record.ender = -1;
      record.types = "comment";
      record.lexer = config.lexer;
      record.lines = this.linesSpace;
      if (this.count > -1) {
        record.begin = this.structure[this.structure.length - 1][1];
        record.stack = this.structure[this.structure.length - 1][0];
        record.token = this.data.token[this.count];
      } else {
        record.begin = -1;
        record.stack = "global";
        record.token = "";
      }
      let c = 0;
      let d = 0;
      output = output.replace(/\s+/g, " ").replace(/\s+$/, "");
      d = output.length;
      if (wrap > d)
        return;
      do {
        c = wrap;
        if (output.charAt(c) !== " ") {
          do {
            c = c - 1;
          } while (c > 0 && output.charAt(c) !== " ");
          if (c < 3) {
            c = wrap;
            do {
              c = c + 1;
            } while (c < d - 1 && output.charAt(c) !== " ");
          }
        }
        lines.push(output.slice(0, c));
        output = `// ${output.slice(c).replace(/^\s+/, "")}`;
        d = output.length;
      } while (wrap < d);
      c = 0;
      d = lines.length;
      do {
        record.token = lines[c];
        this.push(this.data, record, "");
        record.lines = 2;
        this.linesSpace = 2;
        c = c + 1;
      } while (c < d);
    };
    do {
      build.push(config.chars[a]);
      a = a + 1;
    } while (a < config.end && config.chars[a] !== "\n");
    if (a === config.end) {
      config.chars.push("\n");
    } else {
      a = a - 1;
    }
    output = build.join("").replace(/\s+$/, "");
    if (/^(\/\/\s*@prettify-ignore-start\b)/.test(output) === true) {
      let termination = "\n";
      a = a + 1;
      do {
        build.push(config.chars[a]);
        a = a + 1;
      } while (a < config.end && (config.chars[a - 1] !== "d" || config.chars[a - 1] === "d" && build.slice(build.length - 20).join("") !== "@prettify-ignore-end"));
      b = a;
      do {
      } while (b > config.start && config.chars[b - 1] === "/" && (config.chars[b] === "*" || config.chars[b] === "/"));
      if (config.chars[b] === "*")
        termination = "*/";
      if (termination !== "\n" || config.chars[a] !== "\n") {
        do {
          build.push(config.chars[a]);
          if (termination === "\n" && config.chars[a + 1] === "\n")
            break;
          a = a + 1;
        } while (a < config.end && (termination === "\n" || termination === "*/" && (config.chars[a - 1] !== "*" || config.chars[a] !== "/")));
      }
      if (config.chars[a] === "\n")
        a = a - 1;
      output = build.join("").replace(/\s+$/, "");
      return [output, a];
    }
    if (output === "//" || output.slice(0, 6) === "//    " || preserveComment === true) {
      return [output, a];
    }
    output = output.replace(/(\/\/\s*)/, "// ");
    if (wrap < 1 || a === config.end - 1 && this.data.begin[this.count] < 1)
      return [output, a];
    b = a + 1;
    recurse();
    wordWrap();
    return [output, a];
  }
}();

// src/lexers/style.ts
prettify.lexers.style = function style(source) {
  const { options: options2 } = prettify;
  let a = 0;
  let ltype = "";
  let ltoke = "";
  const data = parse.data;
  const b = source.split("");
  const len = source.length;
  const mapper = [];
  const nosort = [];
  function recordPush(structure) {
    const record = create(null);
    record.begin = parse.structure[parse.structure.length - 1][1];
    record.ender = -1;
    record.lexer = "style";
    record.lines = parse.linesSpace;
    record.stack = parse.structure[parse.structure.length - 1][0];
    record.token = ltoke;
    record.types = ltype;
    parse.push(data, record, structure);
  }
  const esctest = function lexer_style_esctest(index) {
    const slashy = index;
    do {
      index = index - 1;
    } while (b[index] === "\\" && index > 0);
    if ((slashy - index) % 2 === 1) {
      return true;
    }
    return false;
  };
  function value(val) {
    const x = val.replace(/\s*!important/, " !important").split("");
    const values = [];
    const transition = /-?transition$/.test(data.token[parse.count - 2]);
    const colorPush = function lexer_style_value_colorPush(value2) {
      return value2;
    };
    const valueSpace = function lexer_style_value_valueSpace(find) {
      find = find.replace(/\s*/g, "");
      if (/\/\d/.test(find) === true && val.indexOf("url(") === 0)
        return find;
      return ` ${find.charAt(0)} ${find.charAt(1)}`;
    };
    const zerofix = function lexer_style_value_zerofix(find) {
      if (options2.style.noLeadZero === true) {
        const scrub = function lexer_style_value_zerofix_scrub(search) {
          return search.replace(/0+/, "");
        };
        return find.replace(/^-?\D0+(\.|\d)/, scrub);
      }
      if (/0*\./.test(find) === true)
        return find.replace(/0*\./, "0.");
      if (/0+/.test(/\d+/.exec(find)[0]) === true) {
        if (/^\D*0+\D*$/.test(find) === true)
          return find.replace(/0+/, "0");
        return find.replace(/\d+/.exec(find)[0], /\d+/.exec(find)[0].replace(/^0+/, ""));
      }
      return find;
    };
    const commaspace = function lexer_style_value_commaspace(find) {
      return find.replace(",", ", ");
    };
    const diFix = function lexer_style_value_diFix(di) {
      return `${di} `;
    };
    const slash = function lexer_style_value_slash() {
      const start = cc2 - 1;
      let xx = start;
      if (start < 1) {
        return true;
      }
      do {
        xx = xx - 1;
      } while (xx > 0 && x[xx] === "\\");
      if ((start - xx) % 2 === 1) {
        return true;
      }
      return false;
    };
    const zerodotstart = /^-?0+\.\d+[a-z]/;
    const dotstart = /^-?\.\d+[a-z]/;
    const zerodot = /(\s|\(|,)-?0+\.?\d+([a-z]|\)|,|\s)/g;
    const dot = /(\s|\(|,)-?\.?\d+([a-z]|\)|,|\s)/g;
    const dimensions = "%|cap|ch|cm|deg|dpcm|dpi|dppx|em|ex|fr|grad|Hz|ic|in|kHz|lh|mm|ms|mS|pc|pt|px|Q|rad|rem|rlh|s|turn|vb|vh|vi|vmax|vmin|vw";
    let cc2 = 0;
    let dd = 0;
    let block = "";
    let leng = x.length;
    let items = [];
    if (cc2 < leng) {
      do {
        items.push(x[cc2]);
        if (x[cc2 - 1] !== "\\" || slash() === false) {
          if (block === "") {
            if (x[cc2] === '"') {
              block = '"';
              dd = dd + 1;
            } else if (x[cc2] === "'") {
              block = "'";
              dd = dd + 1;
            } else if (x[cc2] === "(") {
              block = ")";
              dd = dd + 1;
            } else if (x[cc2] === "[") {
              block = "]";
              dd = dd + 1;
            }
          } else if (x[cc2] === "(" && block === ")" || x[cc2] === "[" && block === "]") {
            dd = dd + 1;
          } else if (x[cc2] === block) {
            dd = dd - 1;
            if (dd === 0) {
              block = "";
            }
          }
        }
        if (block === "" && x[cc2] === " ") {
          items.pop();
          values.push(colorPush(items.join("")));
          items = [];
        }
        cc2 = cc2 + 1;
      } while (cc2 < leng);
    }
    values.push(colorPush(items.join("")));
    leng = values.length;
    cc2 = 0;
    if (cc2 < leng) {
      do {
        if (options2.style.noLeadZero === true && zerodotstart.test(values[cc2]) === true) {
          values[cc2] = values[cc2].replace(/0+\./, ".");
        } else if ((options2.style.noLeadZero === false || options2.style.noLeadZero === void 0) && dotstart.test(values[cc2]) === true) {
          values[cc2] = values[cc2].replace(".", "0.");
        } else if (zerodot.test(values[cc2]) === true || dot.test(values[cc2]) === true) {
          values[cc2] = values[cc2].replace(zerodot, zerofix).replace(dot, zerofix);
        } else if (/^(0+([a-z]{2,3}|%))$/.test(values[cc2]) === true && transition === false) {
          values[cc2] = "0";
        } else if (/^(0+)/.test(values[cc2]) === true) {
          values[cc2] = values[cc2].replace(/0+/, "0");
          if (/\d/.test(values[cc2].charAt(1)) === true) {
            values[cc2] = values[cc2].substr(1);
          }
        } else if (/^url\((?!('|"))/.test(values[cc2]) === true && values[cc2].charAt(values[cc2].length - 1) === ")") {
          block = values[cc2].charAt(values[cc2].indexOf("url(") + 4);
          if (block !== "@" && block !== "{" && block !== "<") {
            if (options2.style.quoteConvert === "double") {
              values[cc2] = values[cc2].replace(/url\(/, 'url("').replace(/\)$/, '")');
            } else {
              values[cc2] = values[cc2].replace(/url\(/, "url('").replace(/\)$/, "')");
            }
          }
        }
        if (/^(\+|-)?\d+(\.\d+)?(e-?\d+)?\D+$/.test(values[cc2]) === true) {
          if (dimensions.indexOf(values[cc2].replace(/(\+|-)?\d+(\.\d+)?(e-?\d+)?/, "")) < 0) {
            values[cc2] = values[cc2].replace(/(\+|-)?\d+(\.\d+)?(e-?\d+)?/, diFix);
          }
        }
        if (/^\w+\(/.test(values[cc2]) === true && values[cc2].charAt(values[cc2].length - 1) === ")" && (values[cc2].indexOf("url(") !== 0 || values[cc2].indexOf("url(") === 0 && values[cc2].indexOf(" ") > 0)) {
          values[cc2] = values[cc2].replace(/,\S/g, commaspace);
        }
        cc2 = cc2 + 1;
      } while (cc2 < leng);
    }
    block = values.join(" ");
    return block.charAt(0) + block.slice(1).replace(/\s*(\/|\+|\*)\s*(\d|\$)/, valueSpace);
  }
  const buildtoken = function lexer_style_build() {
    let aa = a;
    let bb = 0;
    const out = [];
    let outy = "";
    let funk = null;
    const block = [];
    const qc = options2.style.quoteConvert === void 0 ? "none" : options2.style.quoteConvert;
    const spacestart = function lexer_style_build_spacestart() {
      out.push(b[aa]);
      if (/\s/.test(b[aa + 1]) === true) {
        do {
          aa = aa + 1;
        } while (aa < len && /\s/.test(b[aa + 1]) === true);
      }
    };
    if (aa < len) {
      do {
        if (b[aa] === '"' || b[aa] === "'") {
          if (funk === null) {
            funk = false;
          }
          if (block[block.length - 1] === b[aa] && (b[aa - 1] !== "\\" || esctest(aa - 1) === false)) {
            block.pop();
            if (qc === "double") {
              b[aa] = '"';
            } else if (qc === "single") {
              b[aa] = "'";
            }
          } else if (block[block.length - 1] !== '"' && block[block.length - 1] !== "'" && (b[aa - 1] !== "\\" || esctest(aa - 1) === false)) {
            block.push(b[aa]);
            if (qc === "double") {
              b[aa] = '"';
            } else if (qc === "single") {
              b[aa] = "'";
            }
          } else if (b[aa - 1] === "\\" && qc !== "none") {
            if (esctest(aa - 1) === true) {
              if (qc === "double" && b[aa] === "'") {
                out.pop();
              } else if (qc === "single" && b[aa] === '"') {
                out.pop();
              }
            }
          } else if (qc === "double" && b[aa] === '"') {
            b[aa] = '\\"';
          } else if (qc === "single" && b[aa] === "'") {
            b[aa] = "\\'";
          }
          out.push(b[aa]);
        } else if (b[aa - 1] !== "\\" || esctest(aa - 1) === false) {
          if (b[aa] === "(") {
            if (funk === null) {
              funk = true;
            }
            block.push(")");
            spacestart();
          } else if (b[aa] === "[") {
            funk = false;
            block.push("]");
            spacestart();
          } else if ((b[aa] === "#" || b[aa] === "@") && b[aa + 1] === "{") {
            funk = false;
            out.push(b[aa]);
            aa = aa + 1;
            block.push("}");
            spacestart();
          } else if (b[aa] === block[block.length - 1]) {
            out.push(b[aa]);
            block.pop();
          } else {
            out.push(b[aa]);
          }
        } else {
          out.push(b[aa]);
        }
        if (parse.structure[parse.structure.length - 1][0] === "map" && block.length === 0 && (b[aa + 1] === "," || b[aa + 1] === ")")) {
          if (b[aa + 1] === ")" && data.token[parse.count] === "(") {
            parse.pop(data);
            parse.structure.pop();
            out.splice(0, 0, "(");
          } else {
            break;
          }
        }
        if (b[aa + 1] === ":") {
          bb = aa;
          if (/\s/.test(b[bb]) === true) {
            do {
              bb = bb - 1;
            } while (/\s/.test(b[bb]) === true);
          }
          outy = b.slice(bb - 6, bb + 1).join("");
          if (outy.indexOf("filter") === outy.length - 6 || outy.indexOf("progid") === outy.length - 6) {
            outy = "filter";
          }
        }
        if (block.length === 0) {
          if (b[aa + 1] === ";" && esctest(aa + 1) === true || b[aa + 1] === ":" && b[aa] !== ":" && b[aa + 2] !== ":" && outy !== "filter" && outy !== "progid" || b[aa + 1] === "}" || b[aa + 1] === "{" || b[aa + 1] === "/" && (b[aa + 2] === "*" || b[aa + 2] === "/")) {
            bb = out.length - 1;
            if (/\s/.test(out[bb]) === true) {
              do {
                bb = bb - 1;
                aa = aa - 1;
                out.pop();
              } while (/\s/.test(out[bb]) === true);
            }
            break;
          }
          if (b[aa + 1] === ",") {
            break;
          }
        }
        aa = aa + 1;
      } while (aa < len);
    }
    a = aa;
    if (parse.structure[parse.structure.length - 1][0] === "map" && out[0] === "(") {
      mapper[mapper.length - 1] = mapper[mapper.length - 1] - 1;
    }
    ltoke = out.join("").replace(/\s+/g, " ").replace(/^\s/, "").replace(/\s$/, "");
    if (funk === true) {
      ltoke = ltoke.replace(/\s+\(/g, "(").replace(/\s+\)/g, ")").replace(/,\(/g, ", (");
    }
    if (parse.count > -1 && data.token[parse.count].indexOf("extend(") === 0) {
      ltype = "pseudo";
    } else if (funk === true && /\d/.test(ltoke.charAt(0)) === false && /^rgba?\(/.test(ltoke) === false && ltoke.indexOf("url(") !== 0 && (ltoke.indexOf(" ") < 0 || ltoke.indexOf(" ") > ltoke.indexOf("(")) && ltoke.charAt(ltoke.length - 1) === ")") {
      if (data.token[parse.count] === ":") {
        ltype = "value";
      } else {
        ltoke = ltoke.replace(/,\u0020?/g, ", ");
        ltype = "function";
      }
      ltoke = value(ltoke);
    } else if (parse.count > -1 && `"'`.indexOf(data.token[parse.count].charAt(0)) > -1 && data.types[parse.count] === "variable") {
      ltype = "item";
    } else if (out[0] === "@" || out[0] === "$") {
      if (data.types[parse.count] === "colon" && options2.language === "css" && (data.types[parse.count - 1] === "property" || data.types[parse.count - 1] === "variable")) {
        ltype = "value";
      } else if (parse.count > -1) {
        ltype = "item";
        outy = data.token[parse.count];
        aa = outy.indexOf("(");
        if (outy.charAt(outy.length - 1) === ")" && aa > 0) {
          outy = outy.slice(aa + 1, outy.length - 1);
          data.token[parse.count] = data.token[parse.count].slice(0, aa + 1) + value(outy) + ")";
        }
      }
      ltoke = value(ltoke);
    } else {
      ltype = "item";
    }
    recordPush("");
  };
  const item = function lexer_style_item(type) {
    let aa = parse.count;
    let bb = 0;
    let first = "";
    const comsa = [];
    const priors = function lexer_style_item_priors() {
      if (data.types[aa] === "comment" || data.types[aa] === "ignore") {
        do {
          aa = aa - 1;
          comsa.push(data.token[aa]);
        } while (aa > 0 && data.lexer[aa] === "style" && (data.types[aa] === "comment" || data.types[aa] === "ignore"));
      }
      bb = aa - 1;
      if (data.types[bb] === "comment" || data.types[bb] === "ignore") {
        do {
          bb = bb - 1;
        } while (bb > 0 && data.lexer[aa] === "style" && (data.types[bb] === "comment" || data.types[bb] === "ignore"));
      }
      first = data.token[aa].charAt(0);
    };
    const selectorPretty = function lexer_style_item_selectorPretty(index) {
      let cc2 = index;
      const dd = data.begin[cc2];
      data.token[index] = data.token[index].replace(/\s*&/, " &").replace(/(\s*>\s*)/g, " > ").replace(/:\s+/g, ": ").replace(/^(\s+)/, "").replace(/(\s+)$/, "").replace(/\s+::\s+/, "::");
      if (data.token[cc2 - 1] === "," || data.token[cc2 - 1] === ":" || data.types[cc2 - 1] === "comment") {
        do {
          cc2 = cc2 - 1;
          if (data.begin[cc2] === dd) {
            if (data.token[cc2] === ";") {
              break;
            }
            if (data.token[cc2] !== "," && data.types[cc2] !== "comment") {
              data.types[cc2] = "selector";
            }
            if (data.token[cc2] === ":") {
              data.token[cc2 - 1] = `${data.token[cc2 - 1]}:${data.token[cc2 + 1]}`;
              parse.splice({
                data,
                howmany: 2,
                index: cc2
              });
            }
          } else {
            break;
          }
        } while (cc2 > 0);
      }
      cc2 = parse.count;
      if (options2.style.sortSelectors === true && data.token[cc2 - 1] === ",") {
        const store = [data.token[cc2]];
        do {
          cc2 = cc2 - 1;
          if (data.types[cc2] === "comment" || data.types[cc2] === "ignore") {
            do {
              cc2 = cc2 - 1;
            } while (cc2 > 0 && (data.types[cc2] === "comment" || data.types[cc2] === "ignore"));
          }
          if (data.token[cc2] === ",") {
            cc2 = cc2 - 1;
          }
          store.push(data.token[cc2]);
        } while (cc2 > 0 && (data.token[cc2 - 1] === "," || data.types[cc2 - 1] === "selector" || data.types[cc2 - 1] === "comment" || data.types[cc2 - 1] === "ignore"));
        store.sort();
        cc2 = parse.count;
        data.token[cc2] = store.pop();
        do {
          cc2 = cc2 - 1;
          if (data.types[cc2] === "comment" || data.types[cc2] === "ignore") {
            do {
              cc2 = cc2 - 1;
            } while (cc2 > 0 && (data.types[cc2] === "comment" || data.types[cc2] === "ignore"));
          }
          if (data.token[cc2] === ",") {
            cc2 = cc2 - 1;
          }
          data.token[cc2] = store.pop();
        } while (cc2 > 0 && (data.token[cc2 - 1] === "," || data.token[cc2 - 1] === "selector" || data.types[cc2 - 1] === "comment" || data.types[cc2 - 1] === "ignore"));
      }
      aa = parse.count;
      priors();
    };
    priors();
    if (type === "start" && (data.types[aa] === "value" || data.types[aa] === "variable")) {
      data.types[aa] = "item";
    }
    if (data.lexer[parse.count - 1] !== "style" || bb < 0) {
      if (type === "colon") {
        if (first === "$" || first === "@") {
          data.types[aa] = "variable";
        } else {
          data.types[aa] = "property";
        }
      } else if (data.lexer[aa] === "style") {
        data.types[aa] = "selector";
        selectorPretty(aa);
      }
    } else if (type === "start" && data.types[aa] === "function" && data.lexer[aa] === "style") {
      data.types[aa] = "selector";
      selectorPretty(aa);
    } else if (data.types[aa] === "item" && data.lexer[aa] === "style") {
      if (type === "start") {
        selectorPretty(aa);
        data.types[aa] = "selector";
        if (data.token[aa] === ":") {
          data.types[bb] = "selector";
        }
        if (data.token[aa].indexOf("=\u201C") > 0) {
          parse.error = `Quote looking character (\u201C, \\201c) used instead of actual quotes on line number ${parse.lineNumber}`;
        } else if (data.token[aa].indexOf("=\u201D") > 0) {
          parse.error = `Quote looking character (\u201D, \\201d) used instead of actual quotes on line number ${parse.lineNumber}`;
        }
      } else if (type === "end") {
        if (first === "$" || first === "@") {
          data.types[aa] = "variable";
        } else {
          data.types[aa] = "value";
        }
        data.token[aa] = value(data.token[aa]);
      } else if (type === "separator") {
        if (data.types[bb] === "colon" || data.token[bb] === "," || data.token[bb] === "{") {
          if (b[a] !== ";" && (data.types[bb] === "selector" || data.token[bb] === "{")) {
            data.types[aa] = "selector";
            selectorPretty(aa);
          } else if (data.token[aa].charAt(0) === "$" || data.token[aa].charAt(0) === "@") {
            data.types[aa] = "variable";
          } else {
            data.types[aa] = "value";
          }
          data.token[aa] = value(data.token[aa]);
          if (data.token[aa].charAt(0) === "\u201C") {
            parse.error = `Quote looking character (\u201C, \\201c) used instead of actual quotes on line number ${parse.lineNumber}`;
          } else if (data.token[aa].charAt(0) === "\u201D") {
            parse.error = `Quote looking character (\u201D, \\201d) used instead of actual quotes on line number ${parse.lineNumber}`;
          }
        } else {
          if (first === "$" || first === "@") {
            data.types[aa] = "variable";
          } else if (data.types[bb] === "value" || data.types[bb] === "variable") {
            data.token[bb] = data.token[bb] + data.token[aa];
            parse.pop(data);
          } else {
            data.types[aa] = "value";
          }
        }
      } else if (type === "colon") {
        if (first === "$" || first === "@") {
          data.types[aa] = "variable";
        } else {
          data.types[aa] = "property";
        }
      } else if (data.token[bb].charAt(0) === "@" && (data.types[bb - 2] !== "variable" && data.types[bb - 2] !== "property" || data.types[bb - 1] === "separator")) {
        data.types[bb] = "variable";
        ltype = "variable";
        data.token[bb] = value(data.token[bb]);
      }
    }
  };
  const semiComment = function lexer_style_separatorComment() {
    let x = parse.count;
    do {
      x = x - 1;
    } while (x > 0 && data.types[x] === "comment");
    if (data.token[x] === ";") {
      return;
    }
    parse.splice({
      data,
      howmany: 0,
      index: x + 1,
      record: {
        begin: parse.structure[parse.structure.length - 1][1],
        ender: -1,
        lexer: "style",
        lines: parse.linesSpace,
        stack: parse.structure[parse.structure.length - 1][0],
        token: ";",
        types: "separator"
      }
    });
  };
  const template = function lexer_style_template(open, end) {
    let quote = "";
    let name = "";
    let start = open.length;
    let endlen = 0;
    const store = [];
    const exit = function lexer_style_template_exit(typename) {
      const endtype = data.types[parse.count - 1];
      if (ltype === "item") {
        if (endtype === "colon") {
          data.types[parse.count] = "value";
        } else {
          item(endtype);
        }
      }
      ltype = typename;
      if (ltype.indexOf("start") > -1 || ltype.indexOf("else") > -1) {
        recordPush(ltoke);
      } else {
        recordPush("");
      }
    };
    nosort[nosort.length - 1] = true;
    if (a < len) {
      do {
        store.push(b[a]);
        if (quote === "") {
          if (b[a] === '"') {
            quote = '"';
          } else if (b[a] === "'") {
            quote = "'";
          } else if (b[a] === "/") {
            if (b[a + 1] === "/") {
              quote = "/";
            } else if (b[a + 1] === "*") {
              quote = "*";
            }
          } else if (b[a + 1] === end.charAt(0)) {
            do {
              endlen = endlen + 1;
              a = a + 1;
              store.push(b[a]);
            } while (a < len && endlen < end.length && b[a + 1] === end.charAt(endlen));
            if (endlen === end.length) {
              quote = store.join("");
              if (/\s/.test(quote.charAt(start)) === true) {
                do {
                  start = start + 1;
                } while (/\s/.test(quote.charAt(start)) === true);
              }
              endlen = start;
              do {
                endlen = endlen + 1;
              } while (endlen < end.length && /\s/.test(quote.charAt(endlen)) === false);
              if (endlen === quote.length) {
                endlen = endlen - end.length;
              }
              if (open === "{%") {
                if (quote.indexOf("{%-") === 0) {
                  quote = quote.replace(/^(\{%-\s*)/, "{%- ").replace(/(\s*-%\})$/, " -%}").replace(/(\s*%\})$/, " %}");
                  name = quote.slice(4);
                } else {
                  quote = quote.replace(/^(\{%\s*)/, "{% ").replace(/(\s*%\})$/, " %}").replace(/(\s*-%\})$/, " -%}");
                  name = quote.slice(3);
                }
              }
              if (open === "{{") {
                quote = quote.replace(/^(\{\{\s*)/, "{{ ").replace(/^(\{\{-\s*)/, "{{- ").replace(/(\s*-\}\})$/, " -}}").replace(/(\s*\}\})$/, " }}");
              }
              if (ltype === "item" && data.types[parse.count - 1] === "colon" && (data.types[parse.count - 2] === "property" || data.types[parse.count - 2] === "variable")) {
                ltype = "value";
                data.types[parse.count] = "value";
                if (Number.isNaN(Number(data.token[parse.count])) === true && data.token[parse.count].charAt(data.token[parse.count].length - 1) !== ")") {
                  data.token[parse.count] = data.token[parse.count] + quote;
                } else {
                  data.token[parse.count] = data.token[parse.count] + " " + quote;
                }
                return;
              }
              ltoke = quote;
              if (open === "{%") {
                const templateNames = [
                  "autoescape",
                  "block",
                  "capture",
                  "case",
                  "comment",
                  "embed",
                  "filter",
                  "for",
                  "form",
                  "if",
                  "macro",
                  "paginate",
                  "raw",
                  "sandbox",
                  "spaceless",
                  "tablerow",
                  "unless",
                  "verbatim"
                ];
                let namesLen = templateNames.length - 1;
                name = name.slice(0, name.indexOf(" "));
                if (name.indexOf("(") > 0) {
                  name = name.slice(0, name.indexOf("("));
                }
                if (name === "else" || name === "elseif" || name === "when" || name === "elsif") {
                  exit("template_else");
                  return;
                }
                namesLen = templateNames.length - 1;
                if (namesLen > -1) {
                  do {
                    if (name === templateNames[namesLen]) {
                      exit("template_start");
                      return;
                    }
                    if (name === "end" + templateNames[namesLen]) {
                      exit("template_end");
                      return;
                    }
                    namesLen = namesLen - 1;
                  } while (namesLen > -1);
                }
              } else if (open === "{{") {
                let group = quote.slice(2);
                const ending = group.length;
                let begin = 0;
                do {
                  begin = begin + 1;
                } while (begin < ending && /\s/.test(group.charAt(begin)) === false && group.charAt(start) !== "(");
                group = group.slice(0, begin);
                if (group.charAt(group.length - 2) === "}") {
                  group = group.slice(0, group.length - 2);
                }
                if (group === "end") {
                  exit("template_end");
                  return;
                }
                if (group === "block" || group === "define" || group === "form" || group === "if" || group === "range" || group === "with") {
                  exit("template_start");
                  return;
                }
              }
              exit("template");
              return;
            }
            endlen = 0;
          }
        } else if (quote === b[a]) {
          if (quote === '"' || quote === "'") {
            quote = "";
          } else if (quote === "/" && (b[a] === "\r" || b[a] === "\n")) {
            quote = "";
          } else if (quote === "*" && b[a + 1] === "/") {
            quote = "";
          }
        }
        a = a + 1;
      } while (a < len);
    }
  };
  const comment2 = function lexer_style_comment(line) {
    const comm = line === true ? parse.wrapCommentLine({
      chars: b,
      end: len,
      lexer: "style",
      opening: "//",
      start: a,
      terminator: "\n"
    }) : parse.wrapCommentBlock({
      chars: b,
      end: len,
      lexer: "style",
      opening: "/*",
      start: a,
      terminator: "*/"
    });
    ltoke = comm[0];
    ltype = /^(\/\*\s*parse-ignore-start)/.test(ltoke) === true ? "ignore" : "comment";
    recordPush("");
    a = comm[1];
  };
  const margin_padding = function lexer_style_marginPadding() {
    const lines = parse.linesSpace;
    const props = {
      data: {
        margin: ["", "", "", "", false],
        padding: ["", "", "", "", false]
      },
      last: {
        margin: 0,
        padding: 0
      },
      removes: []
    };
    const begin = parse.structure[parse.structure.length - 1][1];
    const populate = function lexer_style_marginPadding_populate(prop) {
      if (data.token[aa - 2] === prop) {
        const values = data.token[aa].replace(/\s*!important\s*/g, "").split(" ");
        const vlen = values.length;
        if (data.token[aa].indexOf("!important") > -1) {
          props.data[prop[4]] = true;
        }
        if (vlen > 3) {
          if (props.data[prop][0] === "") {
            props.data[prop][0] = values[0];
          }
          if (props.data[prop][1] === "") {
            props.data[prop][1] = values[1];
          }
          if (props.data[prop][2] === "") {
            props.data[prop][2] = values[2];
          }
          if (props.data[prop][3] === "") {
            props.data[prop][3] = values[3];
          }
        } else if (vlen > 2) {
          if (props.data[prop][0] === "") {
            props.data[prop][0] = values[0];
          }
          if (props.data[prop][1] === "") {
            props.data[prop][1] = values[1];
          }
          if (props.data[prop][2] === "") {
            props.data[prop][2] = values[2];
          }
          if (props.data[prop][3] === "") {
            props.data[prop][3] = values[1];
          }
        } else if (vlen > 1) {
          if (props.data[prop][0] === "") {
            props.data[prop][0] = values[0];
          }
          if (props.data[prop][1] === "") {
            props.data[prop][1] = values[1];
          }
          if (props.data[prop][2] === "") {
            props.data[prop][2] = values[0];
          }
          if (props.data[prop][3] === "") {
            props.data[prop][3] = values[1];
          }
        } else {
          if (props.data[prop][0] === "") {
            props.data[prop][0] = values[0];
          }
          if (props.data[prop][1] === "") {
            props.data[prop][1] = values[0];
          }
          if (props.data[prop][2] === "") {
            props.data[prop][2] = values[0];
          }
          if (props.data[prop][3] === "") {
            props.data[prop][3] = values[0];
          }
        }
      } else if (data.token[aa - 2] === `${prop}-bottom`) {
        if (props.data[prop][2] === "")
          props.data[prop][2] = data.token[aa];
      } else if (data.token[aa - 2] === `${prop}-left`) {
        if (props.data[prop][3] === "")
          props.data[prop][3] = data.token[aa];
      } else if (data.token[aa - 2] === `${prop}-right`) {
        if (props.data[prop][1] === "")
          props.data[prop][1] = data.token[aa];
      } else if (data.token[aa - 2] === `${prop}-top`) {
        if (props.data[prop][0] === "")
          props.data[prop][0] = data.token[aa];
      } else {
        return;
      }
      props.removes.push([aa, prop]);
      props.last[prop] = aa;
    };
    const removes = function lexer_style_marginPadding_removes() {
      let cc2 = 0;
      let values = "";
      const zero = /^(0+([a-z]+|%))/;
      const bb = props.removes.length;
      const tmargin = props.data.margin[0] !== "" && props.data.margin[1] !== "" && props.data.margin[2] !== "" && props.data.margin[3] !== "";
      const tpadding = props.data.padding[0] !== "" && props.data.padding[1] !== "" && props.data.padding[2] !== "" && props.data.padding[3] !== "";
      const applyValues = function lexer_style_marginPadding_removes_applyValues(prop) {
        if (zero.test(props.data[prop][0]) === true)
          props.data[prop][0] = "0";
        if (zero.test(props.data[prop][1]) === true)
          props.data[prop][1] = "0";
        if (zero.test(props.data[prop][2]) === true)
          props.data[prop][2] = "0";
        if (zero.test(props.data[prop][3]) === true)
          props.data[prop][3] = "0";
        if (props.data[prop][0] === props.data[prop][1] && props.data[prop][0] === props.data[prop][2] && props.data[prop][0] === props.data[prop][3]) {
          values = props.data[prop][0];
        } else if (props.data[prop][0] === props.data[prop][2] && props.data[prop][1] === props.data[prop][3] && props.data[prop][0] !== props.data[prop][1]) {
          values = `${props.data[prop][0]} ${props.data[prop][1]}`;
        } else if (props.data[prop][1] === props.data[prop][3] && props.data[prop][0] !== props.data[prop][2]) {
          values = `${props.data[prop][0]} ${props.data[prop][1]} ${props.data[prop][2]}`;
        } else {
          values = `${props.data[prop][0]} ${props.data[prop][1]} ${props.data[prop][2]} ${props.data[prop][3]}`;
        }
        if (props.data[prop[4]] === true)
          values = `${values.replace(" !important", "")} !important`;
        if (props.last[prop] > parse.count) {
          cc2 = begin < 1 ? 1 : begin + 1;
          do {
            if (data.begin[cc2] === begin && data.types[cc2] === "value" && data.token[cc2 - 2].indexOf(prop) === 0) {
              props.last[prop] = cc2;
              break;
            }
            cc2 = cc2 + 1;
          } while (cc2 < parse.count);
        }
        data.token[props.last[prop]] = values;
        data.token[props.last[prop] - 2] = prop;
      };
      if (bb > 1 && (tmargin === true || tpadding === true)) {
        do {
          if (props.removes[cc2][0] !== props.last.margin && props.removes[cc2][0] !== props.last.padding && (tmargin === true && props.removes[cc2][1] === "margin" || tpadding === true && props.removes[cc2][1] === "padding")) {
            parse.splice({
              data,
              howmany: data.types[props.removes[cc2][0] + 1] === "separator" ? 4 : 3,
              index: props.removes[cc2][0] - 2
            });
          }
          cc2 = cc2 + 1;
        } while (cc2 < bb - 1);
      }
      if (tmargin === true)
        applyValues("margin");
      if (tpadding === true)
        applyValues("padding");
      if (endtest === true) {
        if (begin < 0) {
          parse.error = "Brace mismatch. There appears to be more closing braces than starting braces.";
        } else {
          parse.sortCorrection(begin, parse.count + 1);
        }
      }
    };
    let aa = parse.count;
    let endtest = false;
    do {
      aa = aa - 1;
      if (data.begin[aa] === begin) {
        if (data.types[aa] === "value" && data.types[aa - 2] === "property") {
          if (data.token[aa - 2].indexOf("margin") === 0) {
            populate("margin");
          } else if (data.token[aa - 2].indexOf("padding") === 0) {
            populate("padding");
          }
        }
      } else {
        endtest = true;
        aa = data.begin[aa];
      }
    } while (aa > begin);
    removes();
    parse.linesSpace = lines;
  };
  do {
    if (/\s/.test(b[a]) === true) {
      a = parse.spacer({
        array: b,
        end: len,
        index: a
      });
    } else if (b[a] === "/" && b[a + 1] === "*") {
      comment2(false);
    } else if (b[a] === "/" && b[a + 1] === "/") {
      comment2(true);
    } else if (b[a] === "{" && b[a + 1] === "%") {
      template("{%", "%}");
    } else if (b[a] === "{" && b[a + 1] === "{") {
      template("{{", "}}");
    } else if (b[a] === "{" || b[a] === "(" && data.token[parse.count] === ":" && data.types[parse.count - 1] === "variable") {
      item("start");
      ltype = "start";
      ltoke = b[a];
      if (b[a] === "(") {
        recordPush("map");
        mapper.push(0);
      } else if (data.types[parse.count] === "selector" || data.types[parse.count] === "variable") {
        recordPush(data.token[parse.count]);
      } else if (data.types[parse.count] === "colon") {
        recordPush(data.token[parse.count - 1]);
      } else {
        recordPush("block");
      }
      nosort.push(false);
    } else if (b[a] === "}" || b[a] === ")" && parse.structure[parse.structure.length - 1][0] === "map" && mapper[mapper.length - 1] === 0) {
      if (b[a] === "}" && data.types[parse.count] === "item" && data.token[parse.count - 1] === "{" && data.token[parse.count - 2] !== void 0 && data.token[parse.count - 2].charAt(data.token[parse.count - 2].length - 1) === "@") {
        data.token[parse.count - 2] = data.token[parse.count - 2] + "{" + data.token[parse.count] + "}";
        parse.pop(data);
        parse.pop(data);
        parse.structure.pop();
      } else {
        if (b[a] === ")")
          mapper.pop();
        item("end");
        if (b[a] === "}" && data.token[parse.count] !== ";") {
          if (data.types[parse.count] === "value" || data.types[parse.count] === "function" || data.types[parse.count] === "variable" && (data.token[parse.count - 1] === ":" || data.token[parse.count - 1] === ";")) {
            if (options2.style.correct === true) {
              ltoke = ";";
            } else {
              ltoke = "x;";
            }
            ltype = "separator";
            recordPush("");
          } else if (data.types[parse.count] === "comment") {
            semiComment();
          }
        }
        ltype = "end";
        nosort.pop();
        ltoke = b[a];
        ltype = "end";
        if (b[a] === "}")
          margin_padding();
        if (options2.style.sortProperties === true && b[a] === "}")
          parse.objectSort(data);
        recordPush("");
      }
    } else if (b[a] === ";" || b[a] === ",") {
      if (data.types[parse.count - 1] === "selector" || data.token[parse.count - 1] === "}" && data.types[parse.count] !== "function") {
        item("start");
      } else {
        item("separator");
      }
      if (data.types[parse.count] !== "separator" && esctest(a) === true) {
        ltoke = b[a];
        ltype = "separator";
        recordPush("");
      }
    } else if (b[a] === ":" && data.types[parse.count] !== "end") {
      item("colon");
      ltoke = ":";
      ltype = "colon";
      recordPush("");
    } else {
      if (parse.structure[parse.structure.length - 1][0] === "map" && b[a] === "(") {
        mapper[mapper.length - 1] = mapper[mapper.length - 1] + 1;
      }
      buildtoken();
    }
    a = a + 1;
  } while (a < len);
  if (options2.style.sortProperties === true)
    parse.objectSort(data);
  return data;
};

// src/lexers/script.ts
prettify.lexers.script = function script(source) {
  const { options: options2 } = prettify;
  if (options2.language === "json") {
    options2.script.quoteConvert = "double";
  }
  let a = 0;
  let ltoke = "";
  let ltype = "";
  let pword = [];
  let lengthb = 0;
  let wordTest = -1;
  let paren = -1;
  let funreferences = [];
  let tempstore;
  let pstack;
  let comment2;
  const data = parse.data;
  const references = parse.references;
  const b = source.length;
  const c = source.split("");
  const lword = [];
  const brace = [];
  const classy = [];
  const sourcemap = [0, ""];
  const datatype = [false];
  const namelist = [
    "autoescape",
    "block",
    "capture",
    "case",
    "comment",
    "embed",
    "filter",
    "for",
    "form",
    "if",
    "macro",
    "paginate",
    "raw",
    "sandbox",
    "spaceless",
    "tablerow",
    "unless",
    "verbatim"
  ];
  const vart = create(null);
  vart.count = [];
  vart.index = [];
  vart.len = -1;
  vart.word = [];
  function asi(isEnd) {
    let aa = 0;
    const next = nextchar(1, false);
    const clist = parse.structure.length === 0 ? "" : parse.structure[parse.structure.length - 1][0];
    const record = create(null);
    record.begin = data.begin[parse.count];
    record.ender = data.begin[parse.count];
    record.lexer = data.lexer[parse.count];
    record.lines = data.lines[parse.count];
    record.stack = data.stack[parse.count];
    record.token = data.token[parse.count];
    record.types = data.types[parse.count];
    if (/^(\/(\/|\*)\s*@ignore\s+start)/.test(ltoke))
      return;
    if (ltype === "start" || ltype === "type_start")
      return;
    if (options2.language === "json")
      return;
    if (record.token === ";" || record.token === "," || record.stack === "class" || record.stack === "map" || record.stack === "attribute" || data.types[record.begin - 1] === "generic" || next === "{" || clist === "initializer") {
      return;
    }
    if (record.token === "}" && data.stack[record.begin - 1] === "global" && data.types[record.begin - 1] !== "operator" && record.stack === data.stack[parse.count - 1]) {
      return;
    }
    if (record.stack === "array" && record.token !== "]")
      return;
    if (data.token[data.begin[parse.count]] === "{" && record.stack === "data_type")
      return;
    if (record.types !== void 0 && record.types.indexOf("template") > -1 && record.types.indexOf("template_string") < 0) {
      return;
    }
    if (next === ";" && isEnd === false)
      return;
    if (data.lexer[parse.count - 1] !== "script" && (a < b && b === prettify.source.length - 1 || b < prettify.source.length - 1)) {
      return;
    }
    if (record.token === "}" && (record.stack === "function" || record.stack === "if" || record.stack === "else" || record.stack === "for" || record.stack === "do" || record.stack === "while" || record.stack === "switch" || record.stack === "class" || record.stack === "try" || record.stack === "catch" || record.stack === "finally" || record.stack === "block")) {
      if (record.stack === "function" && (data.stack[record.begin - 1] === "data_type" || data.types[record.begin - 1] === "type")) {
        aa = record.begin;
        do {
          aa = aa - 1;
        } while (aa > 0 && data.token[aa] !== ")" && data.stack[aa] !== "arguments");
        aa = data.begin[aa];
      } else {
        aa = data.begin[record.begin - 1];
      }
      if (data.token[aa] === "(") {
        aa = aa - 1;
        if (data.token[aa - 1] === "function")
          aa = aa - 1;
        if (data.stack[aa - 1] === "object" || data.stack[aa - 1] === "switch")
          return;
        if (data.token[aa - 1] !== "=" && data.token[aa - 1] !== "return" && data.token[aa - 1] !== ":") {
          return;
        }
      } else {
        return;
      }
    }
    if (record.types === "comment" || clist === "method" || clist === "paren" || clist === "expression" || clist === "array" || clist === "object" || clist === "switch" && record.stack !== "method" && data.token[data.begin[parse.count]] === "(" && data.token[data.begin[parse.count] - 1] !== "return" && data.types[data.begin[parse.count] - 1] !== "operator") {
      return;
    }
    if (data.stack[parse.count] === "expression" && (data.token[data.begin[parse.count] - 1] !== "while" || data.token[data.begin[parse.count] - 1] === "while" && data.stack[data.begin[parse.count] - 2] !== "do")) {
      return;
    }
    if (next !== "" && "=<>+*?|^:&%~,.()]".indexOf(next) > -1 && isEnd === false)
      return;
    if (record.types === "comment") {
      aa = parse.count;
      do {
        aa = aa - 1;
      } while (aa > 0 && data.types[aa] === "comment");
      if (aa < 1)
        return;
      record.token = data.token[aa];
      record.types = data.types[aa];
      record.stack = data.stack[aa];
    }
    if (record.token === void 0 || record.types === "start" || record.types === "separator" || record.types === "operator" && record.token !== "++" && record.token !== "--" || record.token === "x}" || record.token === "var" || record.token === "let" || record.token === "const" || record.token === "else" || record.token.indexOf("#!/") === 0 || record.token === "instanceof") {
      return;
    }
    if (record.stack === "method" && (data.token[record.begin - 1] === "function" || data.token[record.begin - 2] === "function")) {
      return;
    }
    if (options2.script.variableList === "list")
      vart.index[vart.len] = parse.count;
    ltoke = options2.script.correct === true ? ";" : "x;";
    ltype = "separator";
    aa = parse.linesSpace;
    parse.linesSpace = 0;
    recordPush("");
    parse.linesSpace = aa;
    blockinsert();
  }
  function asibrace() {
    let aa = parse.count;
    do {
      aa = aa - 1;
    } while (aa > -1 && data.token[aa] === "x}");
    if (data.stack[aa] === "else")
      return recordPush("");
    aa = aa + 1;
    parse.splice({
      data,
      howmany: 0,
      index: aa,
      record: {
        begin: data.begin[aa],
        ender: -1,
        lexer: "script",
        lines: parse.linesSpace,
        stack: data.stack[aa],
        token: ltoke,
        types: ltype
      }
    });
    recordPush("");
  }
  function asifix() {
    let len = parse.count;
    if (data.types[len] === "comment") {
      do {
        len = len - 1;
      } while (len > 0 && data.types[len] === "comment");
    }
    if (data.token[len] === "from")
      len = len - 2;
    if (data.token[len] === "x;") {
      parse.splice({
        data,
        howmany: 1,
        index: len
      });
    }
  }
  function blockComment() {
    asi(false);
    if (wordTest > -1)
      word();
    comment2 = parse.wrapCommentBlock({
      chars: c,
      end: b,
      lexer: "script",
      opening: "/*",
      start: a,
      terminator: "*/"
    });
    a = comment2[1];
    if (data.token[parse.count] === "var" || data.token[parse.count] === "let" || data.token[parse.count] === "const") {
      tempstore = parse.pop(data);
      recordPush("");
      parse.push(data, tempstore, "");
      if (data.lines[parse.count - 2] === 0)
        data.lines[parse.count - 2] = data.lines[parse.count];
      data.lines[parse.count] = 0;
    } else if (comment2[0] !== "") {
      ltoke = comment2[0];
      ltype = /^\/\*\s*@ignore\s*\bstart\b/.test(ltoke) ? "ignore" : "comment";
      if (ltoke.indexOf("# sourceMappingURL=") === 2) {
        sourcemap[0] = parse.count + 1;
        sourcemap[1] = ltoke;
      }
      parse.push(data, {
        begin: parse.structure[parse.structure.length - 1][1],
        ender: -1,
        lexer: "script",
        lines: parse.linesSpace,
        stack: parse.structure[parse.structure.length - 1][0],
        token: ltoke,
        types: ltype
      }, "");
    }
    if (/\/\*\s*global\s+/.test(data.token[parse.count]) === true && data.types.indexOf("word") < 0) {
      references[0] = data.token[parse.count].replace(/\/\*\s*global\s+/, "").replace("*/", "").replace(/,\s+/g, ",").split(",");
    }
  }
  function blockinsert() {
    let name = "";
    const next = nextchar(5, false);
    const g = parse.count;
    const lines = parse.linesSpace;
    if (options2.language === "json" || brace.length < 1 || brace[brace.length - 1].charAt(0) !== "x" || /^x?(;|\}|\))$/.test(ltoke) === false) {
      return;
    }
    if (data.stack[parse.count] === "do" && next === "while" && data.token[parse.count] === "}") {
      return;
    }
    if (ltoke === ";" && data.token[g - 1] === "x{") {
      name = data.token[data.begin[g - 2] - 1];
      if (data.token[g - 2] === "do" || data.token[g - 2] === ")" && "ifforwhilecatch".indexOf(name) > -1) {
        tempstore = parse.pop(data);
        ltoke = options2.script.correct === true ? "}" : "x}";
        ltype = "end";
        pstack = parse.structure[parse.structure.length - 1];
        recordPush("");
        brace.pop();
        parse.linesSpace = lines;
        return;
      }
      tempstore = parse.pop(data);
      ltoke = options2.script.correct === true ? "}" : "x}";
      ltype = "end";
      pstack = parse.structure[parse.structure.length - 1];
      recordPush("");
      brace.pop();
      ltoke = ";";
      ltype = "end";
      parse.push(data, tempstore, "");
      parse.linesSpace = lines;
      return;
    }
    ltoke = options2.script.correct === true ? "}" : "x}";
    ltype = "end";
    if (data.token[parse.count] === "x}")
      return;
    if (data.stack[parse.count] === "if" && (data.token[parse.count] === ";" || data.token[parse.count] === "x;") && next === "else") {
      pstack = parse.structure[parse.structure.length - 1];
      recordPush("");
      brace.pop();
      parse.linesSpace = lines;
      return;
    }
    do {
      pstack = parse.structure[parse.structure.length - 1];
      recordPush("");
      brace.pop();
      if (data.stack[parse.count] === "do")
        break;
    } while (brace[brace.length - 1] === "x{");
    parse.linesSpace = lines;
  }
  function commaComment() {
    let x = parse.count;
    if (data.stack[x] === "object" && options2.script.objectSort === true) {
      ltoke = ",";
      ltype = "separator";
      asifix();
      recordPush("");
    } else {
      do {
        x = x - 1;
      } while (x > 0 && data.types[x - 1] === "comment");
      parse.splice({
        data,
        howmany: 0,
        index: x,
        record: {
          begin: data.begin[x],
          ender: -1,
          lexer: "script",
          lines: parse.linesSpace,
          stack: data.stack[x],
          token: ",",
          types: "separator"
        }
      });
      recordPush("");
    }
  }
  function end(x) {
    let insert = false;
    let newarr = false;
    const next = nextchar(1, false);
    const count = data.token[parse.count] === "(" ? parse.count : data.begin[parse.count];
    function newarray() {
      let arraylen = 0;
      const ar = data.token[count - 1] === "Array";
      const startar = ar === true ? "[" : "{";
      const endar = ar === true ? "]" : "}";
      const namear = ar === true ? "array" : "object";
      if (ar === true && data.types[parse.count] === "number") {
        arraylen = Number(data.token[parse.count]);
        tempstore = parse.pop(data);
      }
      tempstore = parse.pop(data);
      tempstore = parse.pop(data);
      tempstore = parse.pop(data);
      parse.structure.pop();
      ltoke = startar;
      ltype = "start";
      recordPush(namear);
      if (arraylen > 0) {
        ltoke = ",";
        ltype = "separator";
        do {
          recordPush("");
          arraylen = arraylen - 1;
        } while (arraylen > 0);
      }
      ltoke = endar;
      ltype = "end";
      recordPush("");
    }
    if (wordTest > -1)
      word();
    if (classy.length > 0) {
      if (classy[classy.length - 1] === 0) {
        classy.pop();
      } else {
        classy[classy.length - 1] = classy[classy.length - 1] - 1;
      }
    }
    if (x === ")" || x === "x)" || x === "]") {
      if (options2.script.correct === true)
        plusplus();
      asifix();
    }
    if (x === ")" || x === "x)")
      asi(false);
    if (vart.len > -1) {
      if (x === "}" && (options2.script.variableList === "list" && vart.count[vart.len] === 0 || data.token[parse.count] === "x;" && options2.script.variableList === "each")) {
        vartpop();
      }
      vart.count[vart.len] = vart.count[vart.len] - 1;
      if (vart.count[vart.len] < 0)
        vartpop();
    }
    if (ltoke === "," && data.stack[parse.count] !== "initializer" && (x === "]" && data.token[parse.count - 1] === "[" || x === "}")) {
      tempstore = parse.pop(data);
    }
    if (x === ")" || x === "x)") {
      ltoke = x;
      if (lword.length > 0) {
        pword = lword[lword.length - 1];
        if (pword.length > 1 && next !== "{" && (pword[0] === "if" || pword[0] === "for" || pword[0] === "with" || pword[0] === "while" && data.stack[pword[1] - 2] !== void 0 && data.stack[pword[1] - 2] !== "do")) {
          insert = true;
        }
      }
    } else if (x === "]") {
      ltoke = "]";
    } else if (x === "}") {
      if (ltoke !== "," && options2.script.correct === true)
        plusplus();
      if (parse.structure.length > 0 && parse.structure[parse.structure.length - 1][0] !== "object")
        asi(true);
      if (options2.script.objectSort === true && parse.structure[parse.structure.length - 1][0] === "object") {
        parse.objectSort(data);
      }
      if (ltype === "comment") {
        ltoke = data.token[parse.count];
        ltype = data.types[parse.count];
      }
      ltoke = "}";
    }
    if (parse.structure[parse.structure.length - 1][0] === "data_type") {
      ltype = "type_end";
    } else {
      ltype = "end";
    }
    lword.pop();
    pstack = parse.structure[parse.structure.length - 1];
    if (x === ")" && options2.script.correct === true && count - parse.count < 2 && (data.token[parse.count] === "(" || data.types[parse.count] === "number") && (data.token[count - 1] === "Array" || data.token[count - 1] === "Object") && data.token[count - 2] === "new") {
      newarray();
      newarr = true;
    }
    if (brace[brace.length - 1] === "x{" && x === "}") {
      blockinsert();
      brace.pop();
      if (data.stack[parse.count] !== "try") {
        if (next !== ":" && next !== ";" && data.token[data.begin[a] - 1] !== "?")
          blockinsert();
      }
      ltoke = "}";
    } else {
      brace.pop();
    }
    if (options2.script.endComma !== void 0 && options2.script.endComma !== "none" && parse.structure[parse.structure.length - 1][0] === "array" || parse.structure[parse.structure.length - 1][0] === "object" || parse.structure[parse.structure.length - 1][0] === "data_type") {
      if (options2.script.endComma === "always" && data.token[parse.count] !== ",") {
        const begin = parse.structure[parse.structure.length - 1][1];
        let y = parse.count;
        do {
          if (data.begin[y] === begin) {
            if (data.token[y] === ",")
              break;
          } else {
            y = data.begin[y];
          }
          y = y - 1;
        } while (y > begin);
        if (y > begin) {
          const type = ltype;
          const toke = ltoke;
          ltoke = ",";
          ltype = "separator";
          recordPush("");
          ltoke = toke;
          ltype = type;
        }
      } else if (options2.script.endComma === "never" && data.token[parse.count] === ",") {
        parse.pop(data);
      }
    }
    if (newarr === false) {
      recordPush("");
      if (ltoke === "}" && data.stack[parse.count] !== "object" && data.stack[parse.count] !== "class" && data.stack[parse.count] !== "data_type") {
        references.pop();
        blockinsert();
      }
    }
    if (insert === true) {
      ltoke = options2.script.correct === true ? "{" : "x{";
      ltype = "start";
      recordPush(pword[0]);
      brace.push("x{");
      pword[1] = parse.count;
    }
    datatype.pop();
    if (parse.structure[parse.structure.length - 1][0] !== "data_type")
      datatype[datatype.length - 1] = false;
  }
  function general(starting, ending, type) {
    let ee = 0;
    let escape = false;
    let ext = false;
    let build = [starting];
    let temp;
    const ender = ending.split("");
    const endlen = ender.length;
    const start2 = a;
    const base = a + starting.length;
    const qc = options2.script.quoteConvert === void 0 ? "none" : options2.script.quoteConvert;
    function cleanUp() {
      let linesSpace = 0;
      build = [];
      ltype = type;
      ee = a;
      if (type === "string" && /\s/.test(c[ee + 1]) === true) {
        linesSpace = 1;
        do {
          ee = ee + 1;
          if (c[ee] === "\n")
            linesSpace = linesSpace + 1;
        } while (ee < b && /\s/.test(c[ee + 1]) === true);
        parse.linesSpace = linesSpace;
      }
    }
    function finish() {
      let str = "";
      function bracketSpace(input) {
        if (options2.language !== "javascript" && options2.language !== "typescript" && options2.language !== "jsx" && options2.language !== "tsx") {
          const spaceStart = (start3) => start3.replace(/\s*$/, " ");
          const spaceEnd = (end2) => end2.replace(/^\s*/, " ");
          if (/\{(#|\/|(%>)|(%\]))/.test(input) || /\}%(>|\])/.test(input))
            return input;
          input = input.replace(/\{((\{+)|%-?)\s*/g, spaceStart);
          input = input.replace(/\s*((\}\}+)|(-?%\}))/g, spaceEnd);
          return input;
        }
        return input;
      }
      if (starting === '"' && qc === "single") {
        build[0] = "'";
        build[build.length - 1] = "'";
      } else if (starting === "'" && qc === "double") {
        build[0] = '"';
        build[build.length - 1] = '"';
      } else if (escape === true) {
        str = build[build.length - 1];
        build.pop();
        build.pop();
        build.push(str);
      }
      a = ee;
      if (ending === "\n") {
        a = a - 1;
        build.pop();
      }
      ltoke = build.join("");
      if (starting === '"' || starting === "'" || starting === "{{" || starting === "{%") {
        ltoke = bracketSpace(ltoke);
      }
      if (starting === "{%" || starting === "{{") {
        temp = tname(ltoke);
        ltype = temp[0];
        recordPush(temp[1]);
        return;
      }
      if (type === "string") {
        ltype = "string";
        if (options2.language === "json") {
          ltoke = ltoke.replace(/\u0000/g, "\\u0000").replace(/\u0001/g, "\\u0001").replace(/\u0002/g, "\\u0002").replace(/\u0003/g, "\\u0003").replace(/\u0004/g, "\\u0004").replace(/\u0005/g, "\\u0005").replace(/\u0006/g, "\\u0006").replace(/\u0007/g, "\\u0007").replace(/\u0008/g, "\\u0008").replace(/\u0009/g, "\\u0009").replace(/\u000a/g, "\\u000a").replace(/\u000b/g, "\\u000b").replace(/\u000c/g, "\\u000c").replace(/\u000d/g, "\\u000d").replace(/\u000e/g, "\\u000e").replace(/\u000f/g, "\\u000f").replace(/\u0010/g, "\\u0010").replace(/\u0011/g, "\\u0011").replace(/\u0012/g, "\\u0012").replace(/\u0013/g, "\\u0013").replace(/\u0014/g, "\\u0014").replace(/\u0015/g, "\\u0015").replace(/\u0016/g, "\\u0016").replace(/\u0017/g, "\\u0017").replace(/\u0018/g, "\\u0018").replace(/\u0019/g, "\\u0019").replace(/\u001a/g, "\\u001a").replace(/\u001b/g, "\\u001b").replace(/\u001c/g, "\\u001c").replace(/\u001d/g, "\\u001d").replace(/\u001e/g, "\\u001e").replace(/\u001f/g, "\\u001f");
        } else if (starting.indexOf("#!") === 0) {
          ltoke = ltoke.slice(0, ltoke.length - 1);
          parse.linesSpace = 2;
        } else if (parse.structure[parse.structure.length - 1][0] !== "object" || parse.structure[parse.structure.length - 1][0] === "object" && nextchar(1, false) !== ":" && data.token[parse.count] !== "," && data.token[parse.count] !== "{") {
          if (ltoke.length > options2.wrap && options2.wrap > 0 || options2.wrap !== 0 && data.token[parse.count] === "+" && (data.token[parse.count - 1].charAt(0) === '"' || data.token[parse.count - 1].charAt(0) === "'")) {
            let item = ltoke;
            let segment = "";
            let q = qc === "double" ? '"' : qc === "single" ? "'" : item.charAt(0);
            const limit = options2.wrap;
            const uchar = /u[0-9a-fA-F]{4}/;
            const xchar = /x[0-9a-fA-F]{2}/;
            item = item.slice(1, item.length - 1);
            if (data.token[parse.count] === "+" && (data.token[parse.count - 1].charAt(0) === '"' || data.token[parse.count - 1].charAt(0) === "'")) {
              parse.pop(data);
              q = data.token[parse.count].charAt(0);
              item = data.token[parse.count].slice(1, data.token[parse.count].length - 1) + item;
              parse.pop(data);
            }
            if (item.length > limit && limit > 0) {
              do {
                segment = item.slice(0, limit);
                if (segment.charAt(limit - 5) === "\\" && uchar.test(item.slice(limit - 4, limit + 1))) {
                  segment = segment.slice(0, limit - 5);
                } else if (segment.charAt(limit - 4) === "\\" && uchar.test(item.slice(limit - 3, limit + 2))) {
                  segment = segment.slice(0, limit - 4);
                } else if (segment.charAt(limit - 3) === "\\" && (uchar.test(item.slice(limit - 2, limit + 3)) || xchar.test(item.slice(limit - 2, limit + 1)))) {
                  segment = segment.slice(0, limit - 3);
                } else if (segment.charAt(limit - 2) === "\\" && (uchar.test(item.slice(limit - 1, limit + 4)) || xchar.test(item.slice(limit - 1, limit + 2)))) {
                  segment = segment.slice(0, limit - 2);
                } else if (segment.charAt(limit - 1) === "\\") {
                  segment = segment.slice(0, limit - 1);
                }
                segment = q + segment + q;
                item = item.slice(segment.length - 2);
                ltoke = segment;
                ltype = "string";
                recordPush("");
                parse.linesSpace = 0;
                ltoke = "+";
                ltype = "operator";
                recordPush("");
              } while (item.length > limit);
            }
            if (item === "") {
              ltoke = q + q;
            } else {
              ltoke = q + item + q;
            }
            ltype = "string";
          }
        }
      } else if (/\{\s*\?>$/.test(ltoke)) {
        ltype = "template_start";
      } else {
        ltype = type;
      }
      if (ltoke.length > 0)
        recordPush("");
    }
    if (wordTest > -1)
      word();
    if (c[a - 1] === "\\" && slashes(a - 1) === true && (c[a] === '"' || c[a] === "'")) {
      parse.pop(data);
      if (data.token[0] === "{") {
        if (c[a] === '"') {
          starting = '"';
          ending = '\\"';
          build = ['"'];
        } else {
          starting = "'";
          ending = "\\'";
          build = ["'"];
        }
        escape = true;
      } else {
        if (c[a] === '"') {
          build = ['\\"'];
          finish();
          return;
        }
        build = ["\\'"];
        finish();
        return;
      }
    }
    ee = base;
    if (ee < b) {
      do {
        if (data.token[0] !== "{" && data.token[0] !== "[" && qc !== "none" && (c[ee] === '"' || c[ee] === "'")) {
          if (c[ee - 1] === "\\") {
            if (slashes(ee - 1) === true) {
              if (qc === "double" && c[ee] === "'") {
                build.pop();
              } else if (qc === "single" && c[ee] === '"') {
                build.pop();
              }
            }
          } else if (qc === "double" && c[ee] === '"' && c[a] === "'") {
            c[ee] = '\\"';
          } else if (qc === "single" && c[ee] === "'" && c[a] === '"') {
            c[ee] = "\\'";
          }
          build.push(c[ee]);
        } else if (ee > start2) {
          ext = true;
          if (c[ee] === "{" && c[ee + 1] === "%" && c[ee + 2] !== starting) {
            finish();
            general("{%", "%}", "template");
            cleanUp();
          } else if (c[ee] === "{" && c[ee + 1] === "{" && c[ee + 2] !== starting) {
            finish();
            general("{{", "}}", "template");
            cleanUp();
          } else {
            ext = false;
            build.push(c[ee]);
          }
        } else {
          build.push(c[ee]);
        }
        if ((starting === '"' || starting === "'") && (ext === true || ee > start2) && options2.language !== "json" && c[ee - 1] !== "\\" && c[ee] !== '"' && c[ee] !== "'" && (c[ee] === "\n" || ee === b - 1)) {
          parse.error = "Unterminated string in script on line number " + parse.lineNumber;
          break;
        }
        if (c[ee] === ender[endlen - 1] && (c[ee - 1] !== "\\" || slashes(ee - 1) === false)) {
          if (endlen === 1)
            break;
          if (build[ee - base] === ender[0] && build.slice(ee - base - endlen + 2).join("") === ending)
            break;
        }
        ee = ee + 1;
      } while (ee < b);
    }
    finish();
  }
  function lineComment() {
    asi(false);
    blockinsert();
    if (wordTest > -1)
      word();
    comment2 = parse.wrapCommentLine({
      chars: c,
      end: b,
      lexer: "script",
      opening: "//",
      start: a,
      terminator: "\n"
    });
    a = comment2[1];
    if (comment2[0] !== "") {
      ltoke = comment2[0];
      ltype = /^(\/\/\s*@ignore:?\s+\bstart\b)/.test(ltoke) ? "ignore" : "comment";
      if (ltoke.indexOf("# sourceMappingURL=") === 2) {
        sourcemap[0] = parse.count + 1;
        sourcemap[1] = ltoke;
      }
      parse.push(data, {
        begin: parse.structure[parse.structure.length - 1][1],
        ender: -1,
        lexer: "script",
        lines: parse.linesSpace,
        stack: parse.structure[parse.structure.length - 1][0],
        token: ltoke,
        types: ltype
      }, "");
    }
  }
  function lexerMarkup() {
    let d = 0;
    let curlytest = false;
    let endtag = false;
    let anglecount = 0;
    let curlycount = 0;
    let tagcount = 0;
    let next = "";
    let priorToken = "";
    let priorType = "";
    const output = [];
    const dt = datatype[datatype.length - 1];
    const syntaxnum = "0123456789=<>+-*?|^:&.,;%(){}[]~";
    function applyMarkup() {
      if (ltoke === "(")
        parse.structure[parse.structure.length - 1] = ["paren", parse.count];
      prettify.lexers.markup(output.join(""));
    }
    if (wordTest > -1)
      word();
    priorToken = parse.count > 0 ? data.token[parse.count - 1] : "";
    priorType = parse.count > 0 ? data.types[parse.count - 1] : "";
    next = nextchar(1, false);
    if (options2.language !== "jsx" && options2.language !== "tsx" && /\d/.test(next) === false && (ltoke === "function" || priorToken === "=>" || priorToken === "void" || priorToken === "." || data.stack[parse.count] === "arguments" || ltype === "type" && priorToken === "type" || ltype === "reference" && (priorType === "operator" || priorToken === "function" || priorToken === "class" || priorToken === "new") || ltype === "type" && priorType === "operator" || ltoke === "return" || ltype === "operator")) {
      const build = [];
      let inc = 0;
      let e = 0;
      d = a;
      do {
        build.push(c[d]);
        if (c[d] === "<") {
          inc = inc + 1;
        } else if (c[d] === ">") {
          inc = inc - 1;
          if (inc < 1)
            break;
        }
        d = d + 1;
      } while (d < b);
      e = a;
      a = d;
      next = nextchar(1, false);
      if (c[d] === ">" && (dt === true || priorToken === "=>" || priorToken === "." || priorType !== "operator" || priorType === "operator" && (next === "(" || next === "="))) {
        ltype = "generic";
        ltoke = build.join("").replace(/^<\s+/, "<").replace(/\s+>$/, ">").replace(/,\s*/g, ", ");
        recordPush("");
        return;
      }
      a = e;
    }
    d = parse.count;
    if (data.types[d] === "comment") {
      do {
        d = d - 1;
      } while (d > 0 && data.types[d] === "comment");
    }
    if (dt === false && nextchar(1, false) !== ">" && (c[a] !== "<" && syntaxnum.indexOf(c[a + 1]) > -1 || data.token[d] === "++" || data.token[d] === "--" || /\s/.test(c[a + 1]) === true || /\d/.test(c[a + 1]) === true && (ltype === "operator" || ltype === "string" || ltype === "number" || ltype === "reference" || ltype === "word" && ltoke !== "return"))) {
      ltype = "operator";
      ltoke = operator();
      return recordPush("");
    }
    if (options2.language !== "typescript" && (data.token[d] === "return" || data.types[d] === "operator" || data.types[d] === "start" || data.types[d] === "separator" || data.types[d] === "jsx_attribute_start" || data.token[d] === "}" && parse.structure[parse.structure.length - 1][0] === "global")) {
      ltype = "markup";
      options2.language = "jsx";
      do {
        output.push(c[a]);
        if (c[a] === "{") {
          curlycount = curlycount + 1;
          curlytest = true;
        } else if (c[a] === "}") {
          curlycount = curlycount - 1;
          if (curlycount === 0)
            curlytest = false;
        } else if (c[a] === "<" && curlytest === false) {
          if (c[a + 1] === "<") {
            do {
              output.push(c[a]);
              a = a + 1;
            } while (a < b && c[a + 1] === "<");
          }
          anglecount = anglecount + 1;
          if (nextchar(1, false) === "/")
            endtag = true;
        } else if (c[a] === ">" && curlytest === false) {
          if (c[a + 1] === ">") {
            do {
              output.push(c[a]);
              a = a + 1;
            } while (c[a + 1] === ">");
          }
          anglecount = anglecount - 1;
          if (endtag === true) {
            tagcount = tagcount - 1;
          } else if (c[a - 1] !== "/") {
            tagcount = tagcount + 1;
          }
          if (anglecount === 0 && curlycount === 0 && tagcount < 1) {
            next = nextchar(2, false);
            if (next.charAt(0) !== "<")
              return applyMarkup();
            if (next.charAt(0) === "<" && syntaxnum.indexOf(next.charAt(1)) < 0 && /\s/.test(next.charAt(1)) === false) {
              d = a + 1;
              do {
                d = d + 1;
                if (c[d] === ">" || /\s/.test(c[d - 1]) && syntaxnum.indexOf(c[d]) < 0)
                  break;
                if (syntaxnum.indexOf(c[d]) > -1)
                  return applyMarkup();
              } while (d < b);
            } else {
              return applyMarkup();
            }
          }
          endtag = false;
        }
        a = a + 1;
      } while (a < b);
      return applyMarkup();
    }
    ltype = "operator";
    ltoke = operator();
    recordPush("");
  }
  function nextchar(len, current) {
    let cc2 = current === true ? a : a + 1;
    let dd = "";
    if (typeof len !== "number" || len < 1)
      len = 1;
    if (c[a] === "/") {
      if (c[a + 1] === "/") {
        dd = "\n";
      } else if (c[a + 1] === "*") {
        dd = "/";
      }
    }
    if (cc2 < b) {
      do {
        if (/\s/.test(c[cc2]) === false) {
          if (c[cc2] === "/") {
            if (dd === "") {
              if (c[cc2 + 1] === "/") {
                dd = "\n";
              } else if (c[cc2 + 1] === "*") {
                dd = "/";
              }
            } else if (dd === "/" && c[cc2 - 1] === "*") {
              dd = "";
            }
          }
          if (dd === "" && c[cc2 - 1] + c[cc2] !== "*/")
            return c.slice(cc2, cc2 + len).join("");
        } else if (dd === "\n" && c[cc2] === "\n") {
          dd = "";
        }
        cc2 = cc2 + 1;
      } while (cc2 < b);
    }
    return "";
  }
  function numb() {
    const f = b;
    const build = [c[a]];
    let ee = 0;
    let test = /zz/;
    let dot = build[0] === ".";
    if (a < b - 2 && c[a] === "0") {
      if (c[a + 1] === "x") {
        test = /[0-9a-fA-F]/;
      } else if (c[a + 1] === "o") {
        test = /[0-9]/;
      } else if (c[a + 1] === "b") {
        test = /0|1/;
      }
      if (test.test(c[a + 2]) === true) {
        build.push(c[a + 1]);
        ee = a + 1;
        do {
          ee = ee + 1;
          build.push(c[ee]);
        } while (test.test(c[ee + 1]) === true);
        a = ee;
        return build.join("");
      }
    }
    ee = a + 1;
    if (ee < f) {
      do {
        if (/[0-9]/.test(c[ee]) || c[ee] === "." && dot === false) {
          build.push(c[ee]);
          if (c[ee] === ".")
            dot = true;
        } else {
          break;
        }
        ee = ee + 1;
      } while (ee < f);
    }
    if (ee < f - 1 && (/\d/.test(c[ee - 1]) === true || /\d/.test(c[ee - 2]) === true && (c[ee - 1] === "-" || c[ee - 1] === "+")) && (c[ee] === "e" || c[ee] === "E")) {
      build.push(c[ee]);
      if (c[ee + 1] === "-" || c[ee + 1] === "+") {
        build.push(c[ee + 1]);
        ee = ee + 1;
      }
      dot = false;
      ee = ee + 1;
      if (ee < f) {
        do {
          if (/[0-9]/.test(c[ee]) || c[ee] === "." && dot === false) {
            build.push(c[ee]);
            if (c[ee] === ".")
              dot = true;
          } else {
            break;
          }
          ee = ee + 1;
        } while (ee < f);
      }
    }
    a = ee - 1;
    return build.join("");
  }
  function operator() {
    let g = 0;
    let h = 0;
    let jj = b;
    let output = "";
    const syntax = [
      "=",
      "<",
      ">",
      "+",
      "*",
      "?",
      "|",
      "^",
      ":",
      "&",
      "%",
      "~"
    ];
    const synlen = syntax.length;
    if (wordTest > -1)
      word();
    if (c[a] === "/" && (parse.count > -1 && (ltype !== "word" && ltype !== "reference" || ltoke === "typeof" || ltoke === "return" || ltoke === "else") && ltype !== "number" && ltype !== "string" && ltype !== "end")) {
      if (ltoke === "return" || ltoke === "typeof" || ltoke === "else" || ltype !== "word") {
        ltoke = regex();
        ltype = "regex";
      } else {
        ltoke = "/";
        ltype = "operator";
      }
      recordPush("");
      return "regex";
    }
    if (c[a] === "?" && ("+-*/.?".indexOf(c[a + 1]) > -1 || c[a + 1] === ":" && syntax.join("").indexOf(c[a + 2]) < 0)) {
      if (c[a + 1] === "." && /\d/.test(c[a + 2]) === false) {
        output = "?.";
      } else if (c[a + 1] === "?") {
        output = "??";
      }
      if (output === "")
        return "?";
    }
    if (c[a] === ":" && "+-*/".indexOf(c[a + 1]) > -1)
      return ":";
    if (a < b - 1) {
      if (c[a] !== "<" && c[a + 1] === "<")
        return c[a];
      if (c[a] === "!" && c[a + 1] === "/")
        return "!";
      if (c[a] === "-") {
        datatype[datatype.length - 1] = false;
        if (c[a + 1] === "-") {
          output = "--";
        } else if (c[a + 1] === "=") {
          output = "-=";
        } else if (c[a + 1] === ">") {
          output = "->";
        }
        if (output === "")
          return "-";
      }
      if (c[a] === "+") {
        datatype[datatype.length - 1] = false;
        if (c[a + 1] === "+") {
          output = "++";
        } else if (c[a + 1] === "=") {
          output = "+=";
        }
        if (output === "")
          return "+";
      }
      if (c[a] === "=" && c[a + 1] !== "=" && c[a + 1] !== "!" && c[a + 1] !== ">") {
        datatype[datatype.length - 1] = false;
        return "=";
      }
    }
    if (c[a] === ":") {
      if (options2.language === "typescript") {
        if (data.stack[parse.count] === "arguments") {
          if (data.token[parse.count] === "?") {
            parse.pop(data);
            output = "?:";
            a = a - 1;
          }
          datatype[datatype.length - 1] = true;
        } else if (ltoke === ")" && (data.token[data.begin[parse.count] - 1] === "function" || data.token[data.begin[parse.count] - 2] === "function")) {
          datatype[datatype.length - 1] = true;
        } else if (ltype === "reference") {
          g = parse.count;
          let colon = false;
          do {
            if (data.begin[g] === data.begin[parse.count]) {
              if (g < parse.count && data.token[g] === ":" && data.types[g + 1] !== "type")
                colon = true;
              if (data.token[g] === "?" && colon === false)
                break;
              if (data.token[g] === ";" || data.token[g] === "x;")
                break;
              if (data.token[g] === "var" || data.token[g] === "let" || data.token[g] === "const" || data.types[g] === "type") {
                datatype[datatype.length - 1] = true;
                break;
              }
            } else {
              if (data.types[g] === "type_end") {
                datatype[datatype.length - 1] = true;
                break;
              }
              g = data.begin[g];
            }
            g = g - 1;
          } while (g > data.begin[parse.count]);
        }
      } else if (data.token[parse.count - 1] === "[" && (data.types[parse.count] === "word" || data.types[parse.count] === "reference")) {
        parse.structure[parse.structure.length - 1][0] = "attribute";
        data.stack[parse.count] = "attribute";
      }
    }
    if (output === "") {
      if (c[a + 1] === "+" && c[a + 2] === "+" || c[a + 1] === "-" && c[a + 2] === "-") {
        output = c[a];
      } else {
        const buildout = [c[a]];
        g = a + 1;
        if (g < jj) {
          do {
            if (c[g] === "+" && c[g + 1] === "+" || c[g] === "-" && c[g + 1] === "-")
              break;
            h = 0;
            if (h < synlen) {
              do {
                if (c[g] === syntax[h]) {
                  buildout.push(syntax[h]);
                  break;
                }
                h = h + 1;
              } while (h < synlen);
            }
            if (h === synlen)
              break;
            g = g + 1;
          } while (g < jj);
        }
        output = buildout.join("");
      }
    }
    a = a + (output.length - 1);
    if (output === "=>" && ltoke === ")") {
      g = parse.count;
      jj = data.begin[g];
      do {
        if (data.begin[g] === jj)
          data.stack[g] = "method";
        g = g - 1;
      } while (g > jj - 1);
    }
    return output;
  }
  function plusplus() {
    let pre = true;
    let toke = "+";
    let tokea = "";
    let tokeb = "";
    let tokec = "";
    let inc = 0;
    let ind = 0;
    let walk = 0;
    let next = "";
    const store = [];
    function end2() {
      walk = data.begin[walk] - 1;
      if (data.types[walk] === "end") {
        end2();
      } else if (data.token[walk - 1] === ".") {
        period();
      }
    }
    function period() {
      walk = walk - 2;
      if (data.types[walk] === "end") {
        end2();
      } else if (data.token[walk - 1] === ".") {
        period();
      }
    }
    function applyStore() {
      let x = 0;
      const y = store.length;
      if (x < y) {
        do {
          parse.push(data, store[x], "");
          x = x + 1;
        } while (x < y);
      }
    }
    function recordStore(index) {
      const o = create(null);
      o.begin = data.begin[index];
      o.ender = data.ender[index];
      o.lexer = data.lexer[index];
      o.lines = data.lines[index];
      o.stack = data.stack[index];
      o.token = data.token[index];
      o.types = data.types[index];
      return o;
    }
    tokea = data.token[parse.count];
    tokeb = data.token[parse.count - 1];
    tokec = data.token[parse.count - 2];
    if (tokea !== "++" && tokea !== "--" && tokeb !== "++" && tokeb !== "--") {
      walk = parse.count;
      if (data.types[walk] === "end") {
        end2();
      } else if (data.token[walk - 1] === ".") {
        period();
      }
    }
    if (data.token[walk - 1] === "++" || data.token[walk - 1] === "--") {
      if ("startendoperator".indexOf(data.types[walk - 2]) > -1)
        return;
      inc = walk;
      if (inc < parse.count + 1) {
        do {
          store.push(recordStore(inc));
          inc = inc + 1;
        } while (inc < parse.count + 1);
        parse.splice({
          data,
          howmany: parse.count - walk,
          index: walk
        });
      }
    } else {
      if (options2.script.correct === false || tokea !== "++" && tokea !== "--" && tokeb !== "++" && tokeb !== "--") {
        return;
      }
      next = nextchar(1, false);
      if ((tokea === "++" || tokea === "--") && (c[a] === ";" || next === ";" || c[a] === "}" || next === "}" || c[a] === ")" || next === ")")) {
        toke = data.stack[parse.count];
        if (toke === "array" || toke === "method" || toke === "object" || toke === "paren" || toke === "notation" || data.token[data.begin[parse.count] - 1] === "while" && toke !== "while") {
          return;
        }
        inc = parse.count;
        do {
          inc = inc - 1;
          if (data.token[inc] === "return")
            return;
          if (data.types[inc] === "end") {
            do {
              inc = data.begin[inc] - 1;
            } while (data.types[inc] === "end" && inc > 0);
          }
        } while (inc > 0 && (data.token[inc] === "." || data.types[inc] === "word" || data.types[inc] === "reference" || data.types[inc] === "end"));
        if (data.token[inc] === "," && c[a] !== ";" && next !== ";" && c[a] !== "}" && next !== "}" && c[a] !== ")" && next !== ")") {
          return;
        }
        if (data.types[inc] === "operator") {
          if (data.stack[inc] === "switch" && data.token[inc] === ":") {
            do {
              inc = inc - 1;
              if (data.types[inc] === "start") {
                ind = ind - 1;
                if (ind < 0)
                  break;
              } else if (data.types[inc] === "end") {
                ind = ind + 1;
              }
              if (data.token[inc] === "?" && ind === 0)
                return;
            } while (inc > 0);
          } else {
            return;
          }
        }
        pre = false;
        toke = tokea === "--" ? "-" : "+";
      } else if (tokec === "[" || tokec === ";" || tokec === "x;" || tokec === "}" || tokec === "{" || tokec === "(" || tokec === ")" || tokec === "," || tokec === "return") {
        if (tokea === "++" || tokea === "--") {
          if (tokec === "[" || tokec === "(" || tokec === "," || tokec === "return")
            return;
          if (tokea === "--")
            toke = "-";
          pre = false;
        } else if (tokeb === "--" || tokea === "--") {
          toke = "-";
        }
      } else {
        return;
      }
      if (pre === false)
        tempstore = parse.pop(data);
      walk = parse.count;
      if (data.types[walk] === "end") {
        end2();
      } else if (data.token[walk - 1] === ".") {
        period();
      }
      inc = walk;
      if (inc < parse.count + 1) {
        do {
          store.push(recordStore(inc));
          inc = inc + 1;
        } while (inc < parse.count + 1);
      }
    }
    if (pre === true) {
      parse.splice({
        data,
        howmany: 1,
        index: walk - 1
      });
      ltoke = "=";
      ltype = "operator";
      recordPush("");
      applyStore();
      ltoke = toke;
      ltype = "operator";
      recordPush("");
      ltoke = "1";
      ltype = "number";
      recordPush("");
    } else {
      ltoke = "=";
      ltype = "operator";
      recordPush("");
      applyStore();
      ltoke = toke;
      ltype = "operator";
      recordPush("");
      ltoke = "1";
      ltype = "number";
      recordPush("");
    }
    ltoke = data.token[parse.count];
    ltype = data.types[parse.count];
    if (next === "}" && c[a] !== ";")
      asi(false);
  }
  function recordPush(structure) {
    const record = create(null);
    record.begin = parse.structure[parse.structure.length - 1][1];
    record.ender = -1;
    record.lexer = "script";
    record.lines = parse.linesSpace;
    record.stack = parse.structure[parse.structure.length - 1][0];
    record.token = ltoke;
    record.types = ltype;
    parse.push(data, record, structure);
  }
  function regex() {
    let ee = a + 1;
    let h = 0;
    let i = 0;
    let output = "";
    let square = false;
    const f = b;
    const build = ["/"];
    if (ee < f) {
      do {
        build.push(c[ee]);
        if (c[ee - 1] !== "\\" || c[ee - 2] === "\\") {
          if (c[ee] === "[") {
            square = true;
          }
          if (c[ee] === "]") {
            square = false;
          }
        }
        if (c[ee] === "/" && square === false) {
          if (c[ee - 1] === "\\") {
            i = 0;
            h = ee - 1;
            if (h > 0) {
              do {
                if (c[h] === "\\") {
                  i = i + 1;
                } else {
                  break;
                }
                h = h - 1;
              } while (h > 0);
            }
            if (i % 2 === 0) {
              break;
            }
          } else {
            break;
          }
        }
        ee = ee + 1;
      } while (ee < f);
    }
    if (c[ee + 1] === "g" || c[ee + 1] === "i" || c[ee + 1] === "m" || c[ee + 1] === "y" || c[ee + 1] === "u") {
      build.push(c[ee + 1]);
      if (c[ee + 2] !== c[ee + 1] && (c[ee + 2] === "g" || c[ee + 2] === "i" || c[ee + 2] === "m" || c[ee + 2] === "y" || c[ee + 2] === "u")) {
        build.push(c[ee + 2]);
        if (c[ee + 3] !== c[ee + 1] && c[ee + 3] !== c[ee + 2] && (c[ee + 3] === "g" || c[ee + 3] === "i" || c[ee + 3] === "m" || c[ee + 3] === "y" || c[ee + 3] === "u")) {
          build.push(c[ee + 3]);
          if (c[ee + 4] !== c[ee + 1] && c[ee + 4] !== c[ee + 2] && c[ee + 4] !== c[ee + 3] && (c[ee + 4] === "g" || c[ee + 4] === "i" || c[ee + 4] === "m" || c[ee + 4] === "y" || c[ee + 4] === "u")) {
            build.push(c[ee + 4]);
            if (c[ee + 5] !== c[ee + 1] && c[ee + 5] !== c[ee + 2] && c[ee + 5] !== c[ee + 3] && c[ee + 5] !== c[ee + 4] && (c[ee + 5] === "g" || c[ee + 5] === "i" || c[ee + 5] === "m" || c[ee + 5] === "y" || c[ee + 5] === "u")) {
              build.push(c[ee + 4]);
              a = ee + 5;
            } else {
              a = ee + 4;
            }
          } else {
            a = ee + 3;
          }
        } else {
          a = ee + 2;
        }
      } else {
        a = ee + 1;
      }
    } else {
      a = ee;
    }
    output = build.join("");
    return output;
  }
  function slashes(index) {
    const slashy = index;
    do {
      index = index - 1;
    } while (c[index] === "\\" && index > 0);
    return (slashy - index) % 2 === 1;
  }
  function start(x) {
    let aa = parse.count;
    let wordx = "";
    let wordy = "";
    let stack = "";
    let func = false;
    brace.push(x);
    if (x === "{" && (data.types[parse.count] === "type" || data.types[parse.count] === "type_end" || data.types[parse.count] === "generic")) {
      let begin = 0;
      if (data.types[parse.count] === "type_end")
        aa = data.begin[parse.count];
      begin = aa;
      do {
        aa = aa - 1;
        if (data.begin[aa] !== begin && data.begin[aa] !== -1)
          break;
        if (data.token[aa] === ":")
          break;
      } while (aa > data.begin[aa]);
      if (data.token[aa] === ":" && data.stack[aa - 1] === "arguments") {
        datatype.push(false);
        func = true;
      } else {
        datatype.push(datatype[datatype.length - 1]);
      }
      aa = parse.count;
    } else if (x === "[" && data.types[parse.count] === "type_end") {
      datatype.push(true);
    } else {
      datatype.push(datatype[datatype.length - 1]);
    }
    if (wordTest > -1) {
      word();
      aa = parse.count;
    }
    if (vart.len > -1)
      vart.count[vart.len] = vart.count[vart.len] + 1;
    if (data.token[aa - 1] === "function") {
      lword.push(["function", aa + 1]);
    } else {
      lword.push([ltoke, aa + 1]);
    }
    ltoke = x;
    if (datatype[datatype.length - 1] === true) {
      ltype = "type_start";
    } else {
      ltype = "start";
    }
    if (x === "(" || x === "x(") {
      asifix();
    } else if (x === "{") {
      if (paren > -1) {
        if (data.begin[paren - 1] === data.begin[data.begin[aa] - 1] || data.token[data.begin[aa]] === "x(") {
          paren = -1;
          if (options2.script.correct === true) {
            end(")");
          } else {
            end("x)");
          }
          asifix();
          ltoke = "{";
          ltype = "start";
        }
      } else if (ltoke === ")") {
        asifix();
      }
      if (ltype === "comment" && data.token[aa - 1] === ")") {
        ltoke = data.token[aa];
        data.token[aa] = "{";
        ltype = data.types[aa];
        data.types[aa] = "start";
      }
    }
    wordx = (() => {
      let bb = parse.count;
      if (data.types[bb] === "comment") {
        do {
          bb = bb - 1;
        } while (bb > 0 && data.types[bb] === "comment");
      }
      return data.token[bb];
    })();
    wordy = data.stack[aa] === void 0 ? "" : (() => {
      let bb = parse.count;
      if (data.types[bb] === "comment") {
        do {
          bb = bb - 1;
        } while (bb > 0 && data.types[bb] === "comment");
      }
      return data.token[data.begin[bb] - 1];
    })();
    if (ltoke === "{" && (data.types[aa] === "word" || data.token[aa] === "]")) {
      let bb = aa;
      if (data.token[bb] === "]") {
        do {
          bb = data.begin[bb] - 1;
        } while (data.token[bb] === "]");
      }
      do {
        if (data.types[bb] === "start" || data.types[bb] === "end" || data.types[bb] === "operator")
          break;
        bb = bb - 1;
      } while (bb > 0);
      if (data.token[bb] === ":" && data.stack[bb - 1] === "arguments") {
        stack = "function";
        references.push(funreferences);
        funreferences = [];
      }
    }
    if (ltype === "type_start") {
      stack = "data_type";
    } else if (stack === "" && (ltoke === "{" || ltoke === "x{")) {
      if (wordx === "else" || wordx === "do" || wordx === "try" || wordx === "finally" || wordx === "switch") {
        stack = wordx;
      } else if (classy[classy.length - 1] === 0 && wordx !== "return") {
        classy.pop();
        stack = "class";
      } else if (data.token[aa - 1] === "class") {
        stack = "class";
      } else if (data.token[aa] === "]" && data.token[aa - 1] === "[") {
        stack = "array";
      } else if ((data.types[aa] === "word" || data.types[aa] === "reference") && (data.types[aa - 1] === "word" || data.types[aa - 1] === "reference" || data.token[aa - 1] === "?" && (data.types[aa - 2] === "word" || data.types[aa - 2] === "reference")) && data.token[aa] !== "in" && data.token[aa - 1] !== "export" && data.token[aa - 1] !== "import") {
        stack = "map";
      } else if (data.stack[aa] === "method" && data.types[aa] === "end" && (data.types[data.begin[aa] - 1] === "word" || data.types[data.begin[aa] - 1] === "reference") && data.token[data.begin[aa] - 2] === "new") {
        stack = "initializer";
      } else if (ltoke === "{" && (wordx === ")" || wordx === "x)") && (data.types[data.begin[aa] - 1] === "word" || data.types[data.begin[aa] - 1] === "reference" || data.token[data.begin[aa] - 1] === "]")) {
        if (wordy === "if") {
          stack = "if";
        } else if (wordy === "for") {
          stack = "for";
        } else if (wordy === "while") {
          stack = "while";
        } else if (wordy === "class") {
          stack = "class";
        } else if (wordy === "switch" || data.token[data.begin[aa] - 1] === "switch") {
          stack = "switch";
        } else if (wordy === "catch") {
          stack = "catch";
        } else {
          stack = "function";
        }
      } else if (ltoke === "{" && (wordx === ";" || wordx === "x;")) {
        stack = "block";
      } else if (ltoke === "{" && data.token[aa] === ":" && data.stack[aa] === "switch") {
        stack = "block";
      } else if (data.token[aa - 1] === "import" || data.token[aa - 2] === "import" || data.token[aa - 1] === "export" || data.token[aa - 2] === "export") {
        stack = "object";
      } else if (wordx === ")" && (pword[0] === "function" || pword[0] === "if" || pword[0] === "for" || pword[0] === "class" || pword[0] === "while" || pword[0] === "switch" || pword[0] === "catch")) {
        stack = pword[0];
      } else if (data.stack[aa] === "notation") {
        stack = "function";
      } else if ((data.types[aa] === "number" || data.types[aa] === "string" || data.types[aa] === "word" || data.types[aa] === "reference") && (data.types[aa - 1] === "word" || data.types[aa - 1] === "reference") && data.token[data.begin[aa] - 1] !== "for") {
        stack = "function";
      } else if (parse.structure.length > 0 && data.token[aa] !== ":" && parse.structure[parse.structure.length - 1][0] === "object" && (data.token[data.begin[aa] - 2] === "{" || data.token[data.begin[aa] - 2] === ",")) {
        stack = "function";
      } else if (data.types[pword[1] - 1] === "markup" && data.token[pword[1] - 3] === "function") {
        stack = "function";
      } else if (wordx === "=>") {
        stack = "function";
      } else if (func === true || data.types[parse.count] === "type_end" && data.stack[data.begin[parse.count] - 2] === "arguments") {
        stack = "function";
      } else if (wordx === ")" && data.stack[aa] === "method" && (data.types[data.begin[aa] - 1] === "word" || data.types[data.begin[aa] - 1] === "property" || data.types[data.begin[aa] - 1] === "reference")) {
        stack = "function";
      } else if (data.types[aa] === "word" && ltoke === "{" && data.token[aa] !== "return" && data.token[aa] !== "in" && data.token[aa] !== "import" && data.token[aa] !== "const" && data.token[aa] !== "let" && data.token[aa] !== "") {
        stack = "block";
      } else if (ltoke === "{" && "if|else|for|while|function|class|switch|catch|finally".indexOf(data.stack[aa]) > -1 && (data.token[aa] === "x}" || data.token[aa] === "}")) {
        stack = "block";
      } else if (data.stack[aa] === "arguments") {
        stack = "function";
      } else if (data.types[aa] === "generic") {
        do {
          aa = aa - 1;
          if (data.token[aa] === "function" || data.stack[aa] === "arguments") {
            stack = "function";
            break;
          }
          if (data.token[aa] === "interface") {
            stack = "map";
            break;
          }
          if (data.token[aa] === ";") {
            stack = "object";
            break;
          }
        } while (aa > data.begin[parse.count]);
      } else {
        stack = "object";
      }
      if (stack !== "object" && stack !== "class") {
        if (stack === "function") {
          references.push(funreferences);
          funreferences = [];
        } else {
          references.push([]);
        }
      }
    } else if (ltoke === "[") {
      stack = "array";
    } else if (ltoke === "(" || ltoke === "x(") {
      if (wordx === "function" || data.token[aa - 1] === "function" || data.token[aa - 1] === "function*" || data.token[aa - 2] === "function") {
        stack = "arguments";
      } else if (data.token[aa - 1] === "." || data.token[data.begin[aa] - 2] === ".") {
        stack = "method";
      } else if (data.types[aa] === "generic") {
        stack = "method";
      } else if (data.token[aa] === "}" && data.stack[aa] === "function") {
        stack = "method";
      } else if (wordx === "if" || wordx === "for" || wordx === "class" || wordx === "while" || wordx === "catch" || wordx === "finally" || wordx === "switch" || wordx === "with") {
        stack = "expression";
      } else if (data.types[aa] === "word" || data.types[aa] === "property" || data.types[aa] === "reference") {
        stack = "method";
      } else {
        stack = "paren";
      }
    }
    recordPush(stack);
    if (classy.length > 0)
      classy[classy.length - 1] = classy[classy.length - 1] + 1;
  }
  function tempstring() {
    const output = [c[a]];
    a = a + 1;
    if (a < b) {
      do {
        output.push(c[a]);
        if (c[a] === "`" && (c[a - 1] !== "\\" || slashes(a - 1) === false))
          break;
        if (c[a - 1] === "$" && c[a] === "{" && (c[a - 2] !== "\\" || slashes(a - 2) === false))
          break;
        a = a + 1;
      } while (a < b);
    }
    return output.join("");
  }
  function tname(x) {
    let sn = 2;
    let en = 0;
    let name = "";
    const st = x.slice(0, 2);
    const len = x.length;
    if (x.charAt(2) === "-")
      sn = sn + 1;
    if (/\s/.test(x.charAt(sn)) === true) {
      do {
        sn = sn + 1;
      } while (/\s/.test(x.charAt(sn)) === true && sn < len);
    }
    en = sn;
    do {
      en = en + 1;
    } while (/\s/.test(x.charAt(en)) === false && x.charAt(en) !== "(" && en < len);
    if (en === len)
      en = x.length - 2;
    name = x.slice(sn, en);
    if (name === "else" || st === "{%" && (name === "elseif" || name === "when" || name === "elif" || name === "elsif")) {
      return ["template_else", `template_${name}`];
    }
    if (st === "{{") {
      if (name === "end")
        return ["template_end", ""];
      if (name === "block" && /\{%\s*\w/.test(source) === false || name === "define" || name === "form" || name === "if" || name === "unless" || name === "range" || name === "with") {
        return ["template_start", `template_${name}`];
      }
      return ["template", ""];
    }
    en = namelist.length - 1;
    if (en > -1) {
      do {
        if (name === namelist[en] && (name !== "block" || /\{%\s*\w/.test(source) === false)) {
          return ["template_start", `template_${name}`];
        }
        if (name === "end" + namelist[en]) {
          return [
            "template_end",
            ""
          ];
        }
        en = en - 1;
      } while (en > -1);
    }
    return ["template", ""];
  }
  function vartpop() {
    vart.count.pop();
    vart.index.pop();
    vart.word.pop();
    vart.len = vart.len - 1;
  }
  function word() {
    let f = wordTest;
    let g = 1;
    let output = "";
    let nextitem = "";
    let tokel = ltoke;
    let typel = ltype;
    const lex = [];
    function elsefix() {
      brace.push("x{");
      parse.splice({
        data,
        howmany: 1,
        index: parse.count - 3
      });
    }
    function hoisting(index, ref, samescope) {
      const begin = data.begin[index];
      let parent = 0;
      do {
        if (data.token[index] === ref && data.types[index] === "word") {
          if (samescope === true) {
            data.types[index] = "reference";
          } else if (data.begin[index] > begin && data.token[data.begin[index]] === "{" && data.stack[index] !== "object" && data.stack[index] !== "class" && data.stack[index] !== "data_type") {
            if (data.stack[index] === "function") {
              data.types[index] = "reference";
            } else {
              parent = data.begin[index];
              do {
                if (data.stack[parent] === "function") {
                  data.types[index] = "reference";
                  break;
                }
                parent = data.begin[parent];
              } while (parent > begin);
            }
          }
        }
        index = index - 1;
      } while (index > begin);
    }
    do {
      lex.push(c[f]);
      if (c[f] === "\\") {
        parse.error = `Illegal escape in JavaScript on line number ${parse.lineNumber}`;
      }
      f = f + 1;
    } while (f < a);
    if (ltoke.charAt(0) === "\u201C") {
      parse.error = `Quote looking character (\u201C, \\u201c) used instead of actual quotes on line number ${parse.lineNumber}`;
    } else if (ltoke.charAt(0) === "\u201D") {
      parse.error = `Quote looking character (\u201D, \\u201d) used instead of actual quotes on line number ${parse.lineNumber}`;
    }
    output = lex.join("");
    wordTest = -1;
    if (parse.count > 0 && output === "function" && data.token[parse.count] === "(" && (data.token[parse.count - 1] === "{" || data.token[parse.count - 1] === "x{")) {
      data.types[parse.count] = "start";
    }
    if (parse.count > 1 && output === "function" && ltoke === "(" && (data.token[parse.count - 1] === "}" || data.token[parse.count - 1] === "x}")) {
      if (data.token[parse.count - 1] === "}") {
        f = parse.count - 2;
        if (f > -1) {
          do {
            if (data.types[f] === "end") {
              g = g + 1;
            } else if (data.types[f] === "start" || data.types[f] === "end") {
              g = g - 1;
            }
            if (g === 0)
              break;
            f = f - 1;
          } while (f > -1);
        }
        if (data.token[f] === "{" && data.token[f - 1] === ")") {
          g = 1;
          f = f - 2;
          if (f > -1) {
            do {
              if (data.types[f] === "end") {
                g = g + 1;
              } else if (data.types[f] === "start" || data.types[f] === "end") {
                g = g - 1;
              }
              if (g === 0)
                break;
              f = f - 1;
            } while (f > -1);
          }
          if (data.token[f - 1] !== "function" && data.token[f - 2] !== "function") {
            data.types[parse.count] = "start";
          }
        }
      } else {
        data.types[parse.count] = "start";
      }
    }
    if (options2.script.correct === true && (output === "Object" || output === "Array") && c[a + 1] === "(" && c[a + 2] === ")" && data.token[parse.count - 1] === "=" && data.token[parse.count] === "new") {
      if (output === "Object") {
        data.token[parse.count] = "{";
        ltoke = "}";
        data.stack[parse.count] = "object";
        parse.structure[parse.structure.length - 1][0] = "object";
      } else {
        data.token[parse.count] = "[";
        ltoke = "]";
        data.stack[parse.count] = "array";
        parse.structure[parse.structure.length - 1][0] = "array";
      }
      data.types[parse.count] = "start";
      ltype = "end";
      c[a + 1] = "";
      c[a + 2] = "";
      a = a + 2;
    } else {
      g = parse.count;
      f = g;
      if (options2.script.variableList !== "none" && (output === "var" || output === "let" || output === "const")) {
        if (data.types[g] === "comment") {
          do {
            g = g - 1;
          } while (g > 0 && data.types[g] === "comment");
        }
        if (options2.script.variableList === "list" && vart.len > -1 && vart.index[vart.len] === g && output === vart.word[vart.len]) {
          ltoke = ",";
          ltype = "separator";
          data.token[g] = ltoke;
          data.types[g] = ltype;
          vart.count[vart.len] = 0;
          vart.index[vart.len] = g;
          vart.word[vart.len] = output;
          return;
        }
        vart.len = vart.len + 1;
        vart.count.push(0);
        vart.index.push(g);
        vart.word.push(output);
        g = f;
      } else if (vart.len > -1 && output !== vart.word[vart.len] && parse.count === vart.index[vart.len] && data.token[vart.index[vart.len]] === ";" && ltoke !== vart.word[vart.len] && options2.script.variableList === "list") {
        vartpop();
      }
      if (output === "from" && data.token[parse.count] === "x;" && data.token[parse.count - 1] === "}") {
        asifix();
      }
      if (output === "while" && data.token[parse.count] === "x;" && data.token[parse.count - 1] === "}") {
        let d = 0;
        let e = parse.count - 2;
        if (e > -1) {
          do {
            if (data.types[e] === "end") {
              d = d + 1;
            } else if (data.types[e] === "start") {
              d = d - 1;
            }
            if (d < 0) {
              if (data.token[e] === "{" && data.token[e - 1] === "do")
                asifix();
              return;
            }
            e = e - 1;
          } while (e > -1);
        }
      }
      if (typel === "comment") {
        let d = parse.count;
        do {
          d = d - 1;
        } while (d > 0 && data.types[d] === "comment");
        typel = data.types[d];
        tokel = data.token[d];
      }
      nextitem = nextchar(2, false);
      if (output === "void") {
        if (tokel === ":" && data.stack[parse.count - 1] === "arguments") {
          ltype = "type";
        } else {
          ltype = "word";
        }
      } else if ((parse.structure[parse.structure.length - 1][0] === "object" || parse.structure[parse.structure.length - 1][0] === "class" || parse.structure[parse.structure.length - 1][0] === "data_type") && (data.token[parse.count] === "{" || data.token[data.begin[parse.count]] === "{" && data.token[parse.count] === "," || data.types[parse.count] === "template_end" && (data.token[data.begin[parse.count] - 1] === "{" || data.token[data.begin[parse.count] - 1] === ","))) {
        if (output === "return" || output === "break") {
          ltype = "word";
        } else {
          ltype = "property";
        }
      } else if (datatype[datatype.length - 1] === true || (options2.language === "typescript" || options2.language === "flow") && tokel === "type") {
        ltype = "type";
      } else if (references.length > 0 && (tokel === "function" || tokel === "class" || tokel === "const" || tokel === "let" || tokel === "var" || tokel === "new" || tokel === "void")) {
        ltype = "reference";
        references[references.length - 1].push(output);
        if (options2.language === "javascript" || options2.language === "jsx" || options2.language === "typescript" || options2.language === "tsx") {
          if (tokel === "var" || tokel === "function" && data.types[parse.count - 1] !== "operator" && data.types[parse.count - 1] !== "start" && data.types[parse.count - 1] !== "end") {
            hoisting(parse.count, output, true);
          } else {
            hoisting(parse.count, output, false);
          }
        } else {
          hoisting(parse.count, output, false);
        }
      } else if (parse.structure[parse.structure.length - 1][0] === "arguments" && ltype !== "operator") {
        ltype = "reference";
        funreferences.push(output);
      } else if (tokel === "," && data.stack[parse.count] !== "method" && (data.stack[parse.count] !== "expression" || data.token[data.begin[parse.count] - 1] === "for")) {
        let d = parse.count;
        const e = parse.structure[parse.structure.length - 1][1];
        do {
          if (data.begin[d] === e) {
            if (data.token[d] === ";")
              break;
            if (data.token[d] === "var" || data.token[d] === "let" || data.token[d] === "const" || data.token[d] === "type") {
              break;
            }
          } else if (data.types[d] === "end") {
            d = data.begin[d];
          }
          d = d - 1;
        } while (d > e);
        if (references.length > 0 && data.token[d] === "var") {
          ltype = "reference";
          references[references.length - 1].push(output);
          if (options2.language === "javascript" || options2.language === "jsx" || options2.language === "typescript" || options2.language === "tsx") {
            hoisting(d, output, true);
          } else {
            hoisting(d, output, false);
          }
        } else if (references.length > 0 && (data.token[d] === "let" || data.token[d] === "const" || data.token[d] === "type" && (options2.language === "typescript" || options2.language === "tsx"))) {
          ltype = "reference";
          references[references.length - 1].push(output);
          hoisting(d, output, false);
        } else {
          ltype = "word";
        }
      } else if (parse.structure[parse.structure.length - 1][0] !== "object" || parse.structure[parse.structure.length - 1][0] === "object" && ltoke !== "," && ltoke !== "{") {
        let d = references.length;
        let e = 0;
        if (d > 0) {
          do {
            d = d - 1;
            e = references[d].length;
            if (e > 0) {
              do {
                e = e - 1;
                if (output === references[d][e])
                  break;
              } while (e > 0);
              if (output === references[d][e])
                break;
            }
          } while (d > 0);
          if (references[d][e] === output && tokel !== ".") {
            ltype = "reference";
          } else {
            ltype = "word";
          }
        } else {
          ltype = "word";
        }
      } else {
        ltype = "word";
      }
      ltoke = output;
      if (output === "from" && data.token[parse.count] === "}")
        asifix();
    }
    recordPush("");
    if (output === "class")
      classy.push(0);
    if (output === "do") {
      nextitem = nextchar(1, true);
      if (nextitem !== "{") {
        ltoke = options2.script.correct === true ? "{" : "x{";
        ltype = "start";
        brace.push("x{");
        recordPush("do");
      }
    }
    if (output === "else") {
      nextitem = nextchar(2, true);
      let x = parse.count - 1;
      if (data.types[x] === "comment") {
        do {
          x = x - 1;
        } while (x > 0 && data.types[x] === "comment");
      }
      if (data.token[x] === "x}") {
        if (data.token[parse.count] === "else") {
          if (data.stack[parse.count - 1] !== "if" && data.types[parse.count - 1] !== "comment" && data.stack[parse.count - 1] !== "else") {
            brace.pop();
            parse.splice({
              data,
              howmany: 0,
              index: parse.count - 1,
              record: {
                begin: data.begin[data.begin[data.begin[parse.count - 1] - 1] - 1],
                ender: -1,
                lexer: "script",
                lines: 0,
                stack: "if",
                token: options2.script.correct === true ? "}" : "x}",
                types: "end"
              }
            });
            if (parse.structure.length > 1) {
              parse.structure.splice(parse.structure.length - 2, 1);
              parse.structure[parse.structure.length - 1][1] = parse.count;
            }
          } else if (data.token[parse.count - 2] === "x}" && pstack[0] !== "if" && data.stack[parse.count] === "else") {
            elsefix();
          } else if (data.token[parse.count - 2] === "}" && data.stack[parse.count - 2] === "if" && pstack[0] === "if" && data.token[pstack[1] - 1] !== "if" && data.token[data.begin[parse.count - 1]] === "x{") {
            elsefix();
          }
        } else if (data.token[parse.count] === "x}" && data.stack[parse.count] === "if") {
          elsefix();
        }
      }
      if (nextitem !== "if" && nextitem.charAt(0) !== "{") {
        ltoke = options2.script.correct === true ? "{" : "x{";
        ltype = "start";
        brace.push("x{");
        recordPush("else");
      }
    }
    if ((output === "for" || output === "if" || output === "switch" || output === "catch") && data.token[parse.count - 1] !== ".") {
      nextitem = nextchar(1, true);
      if (nextitem !== "(") {
        paren = parse.count;
        if (options2.script.correct === true) {
          start("(");
        } else {
          start("x(");
        }
      }
    }
  }
  do {
    if (/\s/.test(c[a])) {
      if (wordTest > -1)
        word();
      a = parse.spacer({
        array: c,
        end: b,
        index: a
      });
      if (parse.linesSpace > 1 && ltoke !== ";" && lengthb < parse.count && c[a + 1] !== "}") {
        asi(false);
        lengthb = parse.count;
      }
    } else if (c[a] === "{" && c[a + 1] === "%") {
      general("{%", "%}", "template");
    } else if (c[a] === "{" && c[a + 1] === "{") {
      general("{{", "}}", "template");
    } else if (c[a] === "<" && c[a + 1] === "!" && c[a + 2] === "-" && c[a + 3] === "-") {
      general("<!--", "-->", "comment");
    } else if (c[a] === "<") {
      lexerMarkup();
    } else if (c[a] === "/" && (a === b - 1 || c[a + 1] === "*")) {
      blockComment();
    } else if ((parse.count < 0 || data.lines[parse.count] > 0) && c[a] === "#" && c[a + 1] === "!" && (c[a + 2] === "/" || c[a + 2] === "[")) {
      general("#!" + c[a + 2], "\n", "string");
    } else if (c[a] === "/" && (a === b - 1 || c[a + 1] === "/")) {
      lineComment();
    } else if (c[a] === "`" || c[a] === "}" && parse.structure[parse.structure.length - 1][0] === "template_string") {
      if (wordTest > -1)
        word();
      ltoke = tempstring();
      if (ltoke.charAt(0) === "}" && ltoke.slice(ltoke.length - 2) === "${") {
        ltype = "template_string_else";
        recordPush("template_string");
      } else if (ltoke.slice(ltoke.length - 2) === "${") {
        ltype = "template_string_start";
        recordPush("template_string");
      } else if (ltoke.charAt(0) === "}") {
        ltype = "template_string_end";
        recordPush("");
      } else {
        ltype = "string";
        recordPush("");
      }
    } else if (c[a] === '"' || c[a] === "'") {
      general(c[a], c[a], "string");
    } else if (c[a] === "-" && (a < b - 1 && c[a + 1] !== "=" && c[a + 1] !== "-") && (ltype === "number" || ltype === "word" || ltype === "reference") && ltoke !== "return" && (ltoke === ")" || ltoke === "]" || ltype === "word" || ltype === "reference" || ltype === "number")) {
      if (wordTest > -1)
        word();
      ltoke = "-";
      ltype = "operator";
      recordPush("");
    } else if (wordTest === -1 && (c[a] !== "0" || c[a] === "0" && c[a + 1] !== "b") && (/\d/.test(c[a]) || a !== b - 2 && c[a] === "-" && c[a + 1] === "." && /\d/.test(c[a + 2]) || a !== b - 1 && (c[a] === "-" || c[a] === ".") && /\d/.test(c[a + 1]))) {
      if (wordTest > -1)
        word();
      if (ltype === "end" && c[a] === "-") {
        ltoke = "-";
        ltype = "operator";
      } else {
        ltoke = numb();
        ltype = "number";
      }
      recordPush("");
    } else if (c[a] === ":" && c[a + 1] === ":") {
      if (wordTest > -1)
        word();
      if (options2.script.correct === true)
        plusplus();
      asifix();
      a = a + 1;
      ltoke = "::";
      ltype = "separator";
      recordPush("");
    } else if (c[a] === ",") {
      if (wordTest > -1)
        word();
      if (options2.script.correct === true)
        plusplus();
      if (datatype[datatype.length - 1] === true && data.stack[parse.count].indexOf("type") < 0) {
        datatype[datatype.length - 1] = false;
      }
      if (ltype === "comment") {
        commaComment();
      } else if (vart.len > -1 && vart.count[vart.len] === 0 && options2.script.variableList === "each") {
        asifix();
        ltoke = ";";
        ltype = "separator";
        recordPush("");
        ltoke = vart.word[vart.len];
        ltype = "word";
        recordPush("");
        vart.index[vart.len] = parse.count;
      } else {
        ltoke = ",";
        ltype = "separator";
        asifix();
        recordPush("");
      }
    } else if (c[a] === ".") {
      if (wordTest > -1)
        word();
      datatype[datatype.length - 1] = false;
      if (c[a + 1] === "." && c[a + 2] === ".") {
        ltoke = "...";
        ltype = "operator";
        a = a + 2;
      } else {
        asifix();
        ltoke = ".";
        ltype = "separator";
      }
      if (/\s/.test(c[a - 1]) === true)
        parse.linesSpace = 1;
      recordPush("");
    } else if (c[a] === ";") {
      if (wordTest > -1)
        word();
      if (datatype[datatype.length - 1] === true && data.stack[parse.count].indexOf("type") < 0) {
        datatype[datatype.length - 1] = false;
      }
      if (classy[classy.length - 1] === 0)
        classy.pop();
      if (vart.len > -1 && vart.count[vart.len] === 0) {
        if (options2.script.variableList === "each") {
          vartpop();
        } else {
          vart.index[vart.len] = parse.count + 1;
        }
      }
      if (options2.script.correct === true)
        plusplus();
      ltoke = ";";
      ltype = "separator";
      if (data.token[parse.count] === "x}") {
        asibrace();
      } else {
        recordPush("");
      }
      blockinsert();
    } else if (c[a] === "(" || c[a] === "[" || c[a] === "{") {
      start(c[a]);
    } else if (c[a] === ")" || c[a] === "]" || c[a] === "}") {
      end(c[a]);
    } else if (c[a] === "*" && data.stack[parse.count] === "object" && wordTest < 0 && /\s/.test(c[a + 1]) === false && c[a + 1] !== "=" && /\d/.test(c[a + 1]) === false) {
      wordTest = a;
    } else if (c[a] === "=" || c[a] === "&" || c[a] === "<" || c[a] === ">" || c[a] === "+" || c[a] === "-" || c[a] === "*" || c[a] === "/" || c[a] === "!" || c[a] === "?" || c[a] === "|" || c[a] === "^" || c[a] === ":" || c[a] === "%" || c[a] === "~") {
      ltoke = operator();
      if (ltoke === "regex") {
        ltoke = data.token[parse.count];
      } else if (ltoke === "*" && data.token[parse.count] === "function") {
        data.token[parse.count] = "function*";
      } else {
        ltype = "operator";
        if (ltoke !== "!" && ltoke !== "++" && ltoke !== "--")
          asifix();
        recordPush("");
      }
    } else if (wordTest < 0 && c[a] !== "") {
      wordTest = a;
    }
    if (vart.len > -1 && parse.count === vart.index[vart.len] + 1 && data.token[vart.index[vart.len]] === ";" && ltoke !== vart.word[vart.len] && ltype !== "comment" && options2.script.variableList === "list") {
      vartpop();
    }
    a = a + 1;
  } while (a < b);
  if (wordTest > -1)
    word();
  if ((data.token[parse.count] !== "}" && data.token[0] === "{" || data.token[0] !== "{") && (data.token[parse.count] !== "]" && data.token[0] === "[" || data.token[0] !== "[")) {
    asi(false);
  }
  if (sourcemap[0] === parse.count) {
    ltoke = "\n" + sourcemap[1];
    ltype = "string";
    recordPush("");
  }
  if (data.token[parse.count] === "x;" && (data.token[parse.count - 1] === "}" || data.token[parse.count - 1] === "]") && data.begin[parse.count - 1] === 0) {
    parse.pop(data);
  }
  return data;
};

// src/lexers/markup.ts
prettify.lexers.markup = function markup(source) {
  const blocks = /* @__PURE__ */ new Set([
    "body",
    "colgroup",
    "dd",
    "dt",
    "head",
    "html",
    "li",
    "option",
    "p",
    "tbody",
    "td",
    "tfoot",
    "th",
    "thead",
    "tr"
  ]);
  const voids = /* @__PURE__ */ new Set([
    "area",
    "base",
    "basefont",
    "br",
    "col",
    "embed",
    "eventsource",
    "frame",
    "hr",
    "image",
    "img",
    "input",
    "isindex",
    "keygen",
    "link",
    "meta",
    "path",
    "param",
    "progress",
    "source",
    "wbr",
    "use"
  ]);
  const names = /* @__PURE__ */ new Set([
    "autoescape",
    "case",
    "capture",
    "comment",
    "embed",
    "filter",
    "for",
    "form",
    "if",
    "macro",
    "paginate",
    "raw",
    "switch",
    "tablerow",
    "unless",
    "verbatim",
    "schema",
    "style",
    "javascript",
    "highlight",
    "stylesheet"
  ]);
  const condelse = /* @__PURE__ */ new Set([
    "case",
    "default",
    "else",
    "when",
    "elsif"
  ]);
  const { options: options2 } = prettify;
  const { data } = parse;
  const asl = options2.markup.attributeSortList.length;
  const count = create(null);
  count.end = 0;
  count.index = -1;
  count.start = 0;
  const b = source.split("");
  const c = b.length;
  let a = 0;
  const sgmlflag = 0;
  let ext = false;
  let html2 = "html";
  let ttexp = false;
  function getLiquidTagName(input) {
    const begin = input.indexOf("{");
    const token = is(input[begin + 2], 45 /* DSH */) ? input.slice(begin + 3).trimStart() : input.slice(begin + 2).trimStart();
    return token.slice(0, token.search(/\s/));
  }
  function isLiquidStart(input) {
    const begin = input.indexOf("{");
    if (is(input[begin + 1], 37 /* PER */)) {
      let token = is(input[begin + 2], 45 /* DSH */) ? input.slice(begin + 3).trimStart() : input.slice(begin + 2).trimStart();
      token = token.slice(0, token.search(/\s/));
      if (token.startsWith("end"))
        return false;
      return names.has(token);
    }
    return false;
  }
  function isLiquidEnd(input) {
    let token = input;
    if (Array.isArray(input))
      token = input.join("");
    const begin = token.indexOf("{");
    if (is(token[begin + 1], 37 /* PER */)) {
      if (is(token[begin + 2], 45 /* DSH */))
        return token.slice(begin + 3).trimStart().startsWith("end");
      return token.slice(begin + 2).trimStart().startsWith("end");
    }
    return false;
  }
  function isLiquid(input, direction) {
    if (direction === 1) {
      return is(input[0], 123 /* LCB */) && (is(input[1], 37 /* PER */) || is(input[1], 123 /* LCB */));
    } else if (direction === 2) {
      return is(input[input.length - 1], 125 /* RCB */) && (is(input[input.length - 2], 37 /* PER */) || is(input[input.length - 2], 123 /* LCB */));
    } else if (direction === 3) {
      return is(input[0], 123 /* LCB */) && (is(input[1], 37 /* PER */) || is(input[1], 123 /* LCB */)) && (is(input[input.length - 1], 125 /* RCB */) && (is(input[input.length - 2], 37 /* PER */) || is(input[input.length - 2], 123 /* LCB */)));
    } else if (direction === 4) {
      return /{[{%}]/.test(input);
    } else if (direction === 5) {
      return /{[{%]/.test(input) && /[%}]}/.test(input);
    }
  }
  function bracketSpace(input) {
    if (options2.language !== "xml" && options2.language !== "jsx") {
      const spaceStart = (start) => start.replace(/\s*$/, " ");
      const spaceEnd = (end) => end.replace(/^\s*/, " ");
      if (/(?:{[=#/]|%[>\]])|\}%[>\]]/.test(input))
        return input;
      input = input.replace(/{[{%]-?\s*/g, spaceStart);
      input = input.replace(/\s*-?[%}]}/g, spaceEnd);
      return input;
    }
    return input;
  }
  function recordpush(target, record, structure) {
    if (target === data) {
      if (record.types.indexOf("end") > -1) {
        count.end = count.end + 1;
      } else if (record.types.indexOf("start") > -1) {
        count.start = count.start + 1;
      }
    }
    parse.push(target, record, structure);
  }
  function tagName(tag2) {
    let space = 0;
    let name = "";
    const reg = /^(?:<|{%-?|{{-?)=?\s*/;
    if (typeof tag2 !== "string")
      return "";
    space = tag2.replace(reg, "%").replace(/\s+/, " ").indexOf(" ");
    name = tag2.replace(reg, " ");
    name = space < 0 ? name.slice(1, tag2.length - 1) : name.slice(1, space);
    if (html2 === "html")
      name = name.toLowerCase();
    name = name.replace(/-?[%}]}$/, "");
    if (name.indexOf("(") > 0)
      name = name.slice(0, name.indexOf("("));
    if (name === "?xml?")
      return "xml";
    return name;
  }
  function fixHtmlEnd(element, end) {
    const tname = tagName(element);
    const record = create(null);
    record.begin = parse.structure[parse.structure.length - 1][1];
    record.ender = -1;
    record.lexer = "markup";
    record.lines = data.lines[parse.count] > 0 ? 1 : 0;
    record.stack = parse.structure[parse.structure.length - 1][0];
    record.token = `</${parse.structure[parse.structure.length - 1][0]}>`;
    record.types = "end";
    recordpush(data, record, "");
    if (blocks.has(parse.structure[parse.structure.length - 1][0]) && (end === true && parse.structure.length > 1 || end === false && `/${parse.structure[parse.structure.length - 1][0]}` !== tname)) {
      do {
        record.begin = parse.structure[parse.structure.length - 1][1];
        record.stack = parse.structure[parse.structure.length - 1][0];
        record.token = `</${parse.structure[parse.structure.length - 1][0]}>`;
        recordpush(data, record, "");
      } while (blocks.has(parse.structure[parse.structure.length - 1][0]) && (end === true && parse.structure.length > 1 || end === false && `/${parse.structure[parse.structure.length - 1][0]}` !== tname));
    }
  }
  function tag(end) {
    const record = create(null);
    record.begin = parse.structure[parse.structure.length - 1][1];
    record.ender = -1;
    record.lexer = "markup";
    record.lines = parse.linesSpace;
    record.stack = parse.structure[parse.structure.length - 1][0];
    record.token = "";
    record.types = "";
    let igcount = 0;
    let element = "";
    let lastchar = "";
    let ltype = "";
    let tname = "";
    let start = "";
    let cheat = false;
    let earlyexit = false;
    let ignoreme = false;
    let jscom = false;
    let nosort = false;
    let preserve = false;
    let simple = false;
    let attstore = [];
    let comm = ["", 0];
    function attrname(x) {
      const eq = x.indexOf("=");
      if (eq > 0 && (eq < x.indexOf('"') && x.indexOf('"') > 0 || eq < x.indexOf("'") && x.indexOf("'") > 0)) {
        return [
          x.slice(0, eq),
          x.slice(eq + 1)
        ];
      }
      return [x, ""];
    }
    function attrecord() {
      const begin = parse.count;
      const stack = tname.replace(/(\/)$/, "");
      const qc = options2.markup.quoteConvert;
      let idx = 0;
      let eq = 0;
      let dq = 0;
      let name = "";
      let value = "";
      let store = [];
      let len = attstore.length;
      function convertq() {
        if (ignoreme === true || qc === "none" || record.types !== "attribute" || qc === "single" && record.token.indexOf('"') < 0 || qc === "double" && record.token.indexOf("'") < 0) {
          recordpush(data, record, "");
        } else {
          let ee = 0;
          let inner = false;
          const chars = record.token.split("");
          const eq2 = record.token.indexOf("=");
          const len2 = chars.length - 1;
          if (not(chars[eq2 + 1], 34 /* DQO */) && not(chars[chars.length - 1], 34 /* DQO */) && qc === "single") {
            recordpush(data, record, "");
          } else if (not(chars[eq2 + 1], 39 /* SQO */) && not(chars[chars.length - 1], 39 /* SQO */) && qc === "double") {
            recordpush(data, record, "");
          } else {
            ee = eq2 + 2;
            if (qc === "double") {
              if (record.token.slice(eq2 + 2, len2).indexOf('"') > -1)
                inner = true;
              chars[eq2 + 1] = '"';
              chars[chars.length - 1] = '"';
            } else {
              if (record.token.slice(eq2 + 2, len2).indexOf("'") > -1)
                inner = true;
              chars[eq2 + 1] = "'";
              chars[chars.length - 1] = "'";
            }
            if (inner === true) {
              do {
                if (chars[ee] === "'" && qc === "single") {
                  chars[ee] = '"';
                } else if (chars[ee] === '"' && qc === "double") {
                  chars[ee] = "'";
                }
                ee = ee + 1;
              } while (ee < len2);
            }
            record.token = chars.join("");
            recordpush(data, record, "");
          }
        }
      }
      function liquidAttributes(sample, token) {
        if (isLiquidStart(token)) {
          const ttname = getLiquidTagName(token);
          if (names.has(ttname)) {
            record.types = "template_attribute_start";
            record.stack = ttname;
            parse.structure.push([record.stack, parse.count]);
          }
          record.token = token;
          convertq();
          return;
        } else if (isLiquidEnd(token)) {
          record.types = "template_attribute_end";
          record.token = token;
          parse.structure.pop();
          convertq();
          return;
        } else if (isLiquid(sample, 1)) {
          record.types = "template_attribute";
        } else if (is(sample[0], 60 /* LAN */)) {
          record.types = "template_attribute";
        }
        record.token = token;
        convertq();
        record.types = "attribute";
      }
      if (attstore.length < 1)
        return;
      if (attstore[attstore.length - 1][0] === "/") {
        attstore.pop();
        element = element.replace(/>$/, "/>");
      }
      eq = attstore.length;
      dq = 1;
      if (dq < eq) {
        do {
          name = attstore[dq - 1][0];
          if (name.charAt(name.length - 1) === "=" && attstore[dq][0].indexOf("=") < 0) {
            attstore[dq - 1][0] = name + attstore[dq][0];
            attstore.splice(dq, 1);
            eq = eq - 1;
            dq = dq - 1;
          }
          dq = dq + 1;
        } while (dq < eq);
      }
      if (options2.markup.attributeSort === true && options2.language !== "jsx" && jscom === false && nosort === false) {
        if (asl > 0) {
          const tempstore = [];
          dq = 0;
          eq = 0;
          len = attstore.length;
          do {
            eq = 0;
            do {
              name = attstore[eq][0].split("=")[0];
              if (options2.markup.attributeSortList[dq] === name) {
                tempstore.push(attstore[eq]);
                attstore.splice(eq, 1);
                len = len - 1;
                break;
              }
              eq = eq + 1;
            } while (eq < len);
            dq = dq + 1;
          } while (dq < asl);
          attstore = parse.safeSort(attstore, "", false);
          attstore = tempstore.concat(attstore);
          len = attstore.length;
        } else {
          attstore = parse.safeSort(attstore, "", false);
        }
      }
      record.begin = begin;
      record.stack = stack;
      record.types = "attribute";
      store = [];
      if (idx < len) {
        do {
          if (attstore[idx] === void 0)
            break;
          attstore[idx][0] = attstore[idx][0].replace(/\s+$/, "");
          record.lines = attstore[idx][1];
          eq = attstore[idx][0].indexOf("=");
          dq = attstore[idx][0].indexOf('"');
          if (isLiquid(attstore[idx][0], 5)) {
            if (eq > attstore[idx][0].indexOf("{") && eq < attstore[idx][0].indexOf("}")) {
              eq = -1;
            }
          }
          attstore[idx][0].indexOf("'");
          if (/^\/(\/|\*)/.test(attstore[idx][0]) && options2.language === "jsx") {
            record.types = "comment_attribute";
            record.token = attstore[idx][0];
            convertq();
          } else if (eq < 0) {
            if (isLiquid(attstore[idx][0], 5)) {
              if (is(attstore[idx][0][1], 123 /* LCB */)) {
                record.types = "template_attribute";
              } else {
                if (isLiquidEnd(attstore[idx][0])) {
                  record.types = "template_attribute_end";
                  parse.structure.pop();
                } else {
                  const ttname = getLiquidTagName(attstore[idx][0]);
                  if (names.has(ttname)) {
                    record.types = "template_attribute_start";
                    record.stack = ttname;
                    parse.structure.push([record.stack, parse.count]);
                  } else if (condelse.has(ttname)) {
                    record.types = "template_attribute_else";
                  }
                }
              }
              record.token = attstore[idx][0];
              console.log(record);
              convertq();
            } else {
              record.types = "attribute";
              record.token = "#[{(".indexOf(attstore[idx][0].charAt(0)) < 0 ? attstore[idx][0].toLowerCase() : record.token = attstore[idx][0];
              convertq();
            }
          } else {
            name = attstore[idx][0].slice(0, eq);
            value = attstore[idx][0].slice(eq + 1);
            if (options2.markup.correct && `<{"'=`.indexOf(value[0]) < 0)
              value = '"' + value + '"';
            if (options2.language === "jsx" && /^\s*\{/.test(value)) {
              record.token = name + "={";
              record.types = "jsx_attribute_start";
              recordpush(data, record, "jsx_attribute");
              prettify.lexers.script(value.slice(1, value.length - 1));
              record.begin = parse.count;
              if (/\s\}$/.test(value)) {
                value = value.slice(0, value.length - 1);
                value = /\s+$/.exec(value)[0];
                if (value.indexOf("\n") < 0) {
                  record.lines = 1;
                } else {
                  record.lines = value.split("\n").length;
                }
              } else {
                record.lines = 0;
              }
              record.begin = parse.structure[parse.structure.length - 1][1];
              record.stack = parse.structure[parse.structure.length - 1][0];
              record.token = "}";
              record.types = "jsx_attribute_end";
              convertq();
              record.types = "attribute";
              record.begin = begin;
              record.stack = stack;
            } else if (isLiquid(name, 5)) {
              name = name + "=" + value;
              liquidAttributes(value.replace(/^(["'])/, "").replace(/(["'])$/, ""), name.replace(/(\s+)$/, ""));
            } else {
              record.types = "attribute";
              record.token = "#[{(".indexOf(attstore[idx][0].charAt(0)) < 0 ? attstore[idx][0].toLowerCase() : record.token = attstore[idx][0];
              convertq();
            }
          }
          idx = idx + 1;
        } while (idx < len);
      }
      if (store.length > 0) {
        record.token = store.join(" ");
        convertq();
      }
    }
    ext = false;
    if (end === "---") {
      start = "---";
      ltype = "comment";
    } else if (is(b[a], 60 /* LAN */)) {
      if (b[a + 1] === "/") {
        end = ">";
        ltype = "end";
      } else if (b[a + 1] === "!") {
        if ((b[a + 2] === "d" || b[a + 2] === "D") && (b[a + 3] === "o" || b[a + 3] === "O") && (b[a + 4] === "c" || b[a + 4] === "C") && (b[a + 5] === "t" || b[a + 5] === "T") && (b[a + 6] === "y" || b[a + 6] === "Y") && (b[a + 7] === "p" || b[a + 7] === "P") && (b[a + 8] === "e" || b[a + 8] === "E")) {
          end = ">";
          ltype = "doctype";
          preserve = true;
        } else if (b[a + 2] === "-" && b[a + 3] === "-") {
          end = "-->";
          ltype = "comment";
          start = "<!--";
        } else if (b[a + 2] === "[" && b[a + 3] === "C" && b[a + 4] === "D" && b[a + 5] === "A" && b[a + 6] === "T" && b[a + 7] === "A" && b[a + 8] === "[") {
          end = "]]>";
          ltype = "cdata";
          preserve = true;
        }
      } else if (b[a + 1] === "?") {
        end = "?>";
        if (b[a + 2] === "x" && b[a + 3] === "m" && b[a + 4] === "l") {
          ltype = "xml";
          simple = true;
        } else {
          preserve = true;
          ltype = "template";
        }
      } else if (is(b[a + 1], 37 /* PER */)) {
        preserve = true;
      } else if ((b[a + 1] === "p" || b[a + 1] === "P") && (b[a + 2] === "r" || b[a + 2] === "R") && (b[a + 3] === "e" || b[a + 3] === "E") && (b[a + 4] === ">" || /\s/.test(b[a + 4]))) {
        end = "</pre>";
        ltype = "ignore";
        preserve = true;
      } else {
        simple = true;
        end = ">";
      }
    } else if (is(b[a], 123 /* LCB */)) {
      if (options2.language === "jsx") {
        ext = true;
        earlyexit = true;
        record.token = "{";
        record.types = "script_start";
        parse.structure.push(["script", parse.count]);
        recordpush(data, record, "");
        return;
      }
      if (is(b[a + 1], 123 /* LCB */)) {
        preserve = true;
        end = "}}";
        ltype = "template";
      } else if (is(b[a + 1], 37 /* PER */)) {
        preserve = true;
        end = "%}";
        ltype = "template";
        const rcb = b.indexOf("}", a + 2);
        if (b[rcb - 1].charCodeAt(0) === 37 /* PER */) {
          let t = b.slice(a + 2, rcb - 1).join("");
          if (t.charCodeAt(0) === 45 /* DSH */) {
            start = "{%-";
            t = t.slice(1).trimStart();
          } else {
            start = "{%";
            t = t.trimStart();
          }
          if (t.charCodeAt(t.length - 1) === 45 /* DSH */) {
            end = "-%}";
            t = t.slice(0, t.length - 1).trimEnd();
          } else {
            end = "%}";
            t = t.trimEnd();
          }
          if (t === "comment") {
            const idx1 = source.indexOf("{%", rcb);
            let idx2 = idx1;
            if (b[idx1 + 1].charCodeAt(0) === 45 /* DSH */)
              idx2 = idx1 + 1;
            idx2 = source.indexOf("endcomment", idx2);
            if (idx2 > 0) {
              idx2 = b.indexOf("}", idx2);
              if (idx2 > 0 && b[idx2 - 1].charCodeAt(0) === 37 /* PER */) {
                ltype = "comment";
                start = b.slice(a, rcb + 1).join("");
                end = b.slice(idx1, idx2 + 1).join("");
              }
            }
          }
        } else {
          preserve = true;
          end = "%}";
          ltype = "template";
        }
      } else {
        preserve = true;
        end = b[a + 1] + "}";
        ltype = "template";
      }
    }
    if (options2.markup.preserveAttributes === true)
      preserve = true;
    if (earlyexit)
      return;
    lastchar = end.charAt(end.length - 1);
    if (ltype === "comment" && (is(b[a], 60 /* LAN */) || is(b[a], 123 /* LCB */) && is(b[a + 1], 37 /* PER */))) {
      comm = parse.wrapCommentBlock({
        chars: b,
        end: c,
        lexer: "markup",
        opening: start,
        start: a,
        terminator: end
      });
      element = comm[0];
      a = comm[1];
      if (element.replace(start, "").trimStart().indexOf("@prettify-ignore-start") === 0) {
        record.token = element;
        record.types = "ignore";
        recordpush(data, record, "");
        return;
      }
    } else if (a < c) {
      let inliquid2 = function() {
        if (inliq === false && is(b[a - 1], 123 /* LCB */) && (is(b[a], 123 /* LCB */) || is(b[a], 37 /* PER */))) {
          return true;
        } else if (inliq === true && is(b[a], 125 /* RCB */) && (is(b[a - 1], 125 /* RCB */) || is(b[a - 1], 37 /* PER */))) {
          return false;
        }
        return inliq;
      }, escslash2 = function() {
        let x = a;
        do {
          x = x - 1;
        } while (b[x] === "\\");
        x = a - x;
        return x % 2 === 1;
      }, lexattr2 = function(quotes) {
        let name;
        let attr = "";
        let aa = 0;
        let bb = 0;
        const ignoreattr = "data-prettify-ignore";
        if (quotes === true) {
          attr = attribute.join("");
          name = attrname(attr);
          quote = "";
          if (name[0] === ignoreattr)
            ignoreme = true;
        } else {
          attr = attribute.join("");
          if (options2.language !== "jsx" || options2.language === "jsx" && attr.charAt(attr.length - 1) !== "}") {
            attr = attr.replace(/\s+/g, " ");
          }
          name = attrname(attr);
          if (name[0] === ignoreattr)
            ignoreme = true;
          if (options2.language === "jsx" && attribute[0] === "{" && attribute[attribute.length - 1] === "}") {
            jsxcount = 0;
          }
        }
        if (is(attr[0], 123 /* LCB */) && is(attr[1], 37 /* PER */))
          nosort = true;
        if (ttexp === false && isLiquidStart(attr)) {
          ttexp = true;
        } else if (ttexp === true && isLiquidEnd(attr)) {
          ttexp = false;
        }
        attr = attr.replace(/^\u0020/, "").replace(/\u0020$/, "");
        attribute = attr.replace(/\r\n/g, "\n").split("\n");
        bb = attribute.length;
        if (aa < bb) {
          do {
            attribute[aa] = attribute[aa].replace(/(\s+)$/, "");
            aa = aa + 1;
          } while (aa < bb);
        }
        attr = attribute.join(options2.crlf === true ? "\r\n" : "\n");
        attr = bracketSpace(attr);
        if (ttexp === true || is(attr[0], 123 /* LCB */) && (is(attr[1], 37 /* PER */) || is(attr[1], 123 /* LCB */))) ;
        if (attr === "=") {
          attstore[attstore.length - 1][0] = `${attstore[attstore.length - 1][0]}=`;
        } else if (is(attr[0], 61 /* EQS */) && attstore.length > 0 && attstore[attstore.length - 1][0].indexOf("=") < 0) {
          attstore[attstore.length - 1][0] = attstore[attstore.length - 1][0] + attr;
        } else if (not(attr[0], 61 /* EQS */) && attstore.length > 0 && attstore[attstore.length - 1][0].indexOf("=") === attstore[attstore.length - 1][0].length - 1) {
          attstore[attstore.length - 1][0] = attstore[attstore.length - 1][0] + attr;
        } else if (attr !== "" && attr !== " ") {
          attstore.push([attr, lines]);
        }
        if (attstore.length > 0) {
          const [value] = attstore[attstore.length - 1];
          if (value.indexOf("=\u201C") > 0) {
            parse.error = `Invalid quote character (\u201C, &#x201c) used on line number ${parse.lineNumber}`;
          } else if (value.indexOf("=\u201D") > 0) {
            parse.error = `Invalid quote character (\u201D, &#x201d) used on line number ${parse.lineNumber}`;
          }
        }
        attribute = [];
        lines = b[a] === "\n" ? 2 : 1;
      };
      const liqattr = [];
      const lex = [];
      let bcount = 0;
      let jsxcount = 0;
      let e = 0;
      let f = 0;
      let parncount = 0;
      let lines = 0;
      let quote = "";
      let jsxquote = "";
      let stest = false;
      let quotetest = false;
      let inliq = false;
      let attribute = [];
      do {
        if (is(b[a], 10 /* NWL */)) {
          lines = lines + 1;
          parse.lineNumber = parse.lineNumber + 1;
        }
        if (preserve === true || (ws(b[a]) === false && not(quote, 125 /* RCB */) || is(quote, 125 /* RCB */))) {
          inliq = inliquid2();
          lex.push(b[a]);
          if (is(lex[0], 60 /* LAN */) && is(lex[1], 162 /* RAN */) && is(end, 162 /* RAN */)) {
            record.token = "<>";
            record.types = "start";
            recordpush(data, record, "(empty)");
            return;
          }
          if (is(lex[0], 60 /* LAN */) && is(lex[1], 45 /* FWS */) && is(lex[2], 162 /* RAN */) && is(end, 162 /* RAN */)) {
            record.token = "</>";
            record.types = "end";
            recordpush(data, record, "");
            return;
          }
        }
        if (ltype === "cdata" && is(b[a], 162 /* RAN */) && b[a - 1] === "]" && b[a - 2] !== "]") {
          parse.error = `CDATA tag (${lex.join("")}) not properly terminated with "]]>"`;
          break;
        }
        if (ltype === "comment") {
          quote = "";
          if (b[a] === lastchar && lex.length > end.length + 1) {
            f = lex.length;
            e = end.length - 1;
            if (e > -1) {
              do {
                f = f - 1;
                if (lex[f] !== end.charAt(e))
                  break;
                e = e - 1;
              } while (e > -1);
            }
            if (e < 0)
              break;
          }
        } else {
          if (quote === "") {
            if (is(lex[0], 60 /* LAN */) && is(lex[1], 33 /* BNG */) && ltype !== "cdata") {
              if (ltype === "doctype" && is(b[a], 162 /* RAN */))
                break;
              if (b[a] === "[") {
                if (is(b[a + 1], 60 /* LAN */)) {
                  ltype = "start";
                  break;
                }
                if (ws(b[a + 1])) {
                  do {
                    a = a + 1;
                    if (b[a] === "\n") {
                      lines = lines + 1;
                    }
                  } while (a < c - 1 && ws(b[a + 1]));
                }
                if (is(b[a + 1], 60 /* LAN */)) {
                  ltype = "start";
                  break;
                }
              }
            }
            if (options2.language === "jsx") {
              if (is(b[a], 123 /* LCB */)) {
                jsxcount = jsxcount + 1;
              } else if (is(b[a], 125 /* RCB */)) {
                jsxcount = jsxcount - 1;
              }
            }
            if (is(b[a], 60 /* LAN */) && preserve === false && lex.length > 1 && end !== ">>" && end !== ">>>" && simple === true) {
              parse.error = `Parse error (line ${parse.lineNumber}) on: ${lex.join("")}`;
            }
            if (stest === true && ws(b[a]) === false && b[a] !== lastchar) {
              stest = false;
              quote = jsxquote;
              igcount = 0;
              lex.pop();
              if (a < c) {
                do {
                  if (is(b[a], 10 /* NWL */))
                    parse.lineNumber = parse.lineNumber + 1;
                  if (options2.markup.preserveAttributes === true) {
                    lex.push(b[a]);
                  } else {
                    attribute.push(b[a]);
                  }
                  if (options2.language !== "jsx" && (is(b[a], 60 /* LAN */) || is(b[a], 162 /* RAN */)) && (quote === "" || quote === ">")) {
                    if (quote === "" && is(b[a], 162 /* RAN */)) {
                      quote = ">";
                    } else if (is(quote, 162 /* RAN */)) {
                      if (is(b[a], 60 /* LAN */)) ; else if (b[a] === ">") ;
                    }
                  } else if (quote === "") {
                    if (b[a + 1] === lastchar) {
                      if (is(attribute[attribute.length - 1], 45 /* FWS */) || is(attribute[attribute.length - 1], 63 /* QWS */) && ltype === "xml") {
                        attribute.pop();
                        if (preserve === true)
                          lex.pop();
                        a = a - 1;
                      }
                      if (attribute.length > 0)
                        lexattr2(false);
                      break;
                    }
                    if (preserve === false && /^=?['"]?({[{%]|\/|\^|<)/.test(b[a] + b[a + 1] + b[a + 2] + b[a + 3])) {
                      attribute.pop();
                      if (attribute.length > 0 && not(b[a], 61 /* EQS */) && ttexp) {
                        lexattr2(false);
                      }
                      quote = "";
                      do {
                        attribute.push(b[a]);
                        inliq = inliquid2();
                        if (b[a] === liqattr[liqattr.length - 1]) {
                          liqattr.pop();
                          if (is(b[a], 125 /* RCB */) && is(b[a + 1], 125 /* RCB */)) {
                            attribute.push("}");
                            a = a + 1;
                          }
                          if (liqattr.length < 1) {
                            if (ttexp === false && is(b[a], 125 /* RCB */) && not(attribute[0], 123 /* LCB */) && (not(attribute[1], 37 /* PER */) || not(attribute[1], 123 /* LCB */))) {
                              lexattr2(false);
                              inliq = !inliq;
                              break;
                            }
                            if (ttexp === true && isLiquidEnd(attribute)) {
                              if (ws(b[a + 1])) {
                                lexattr2(false);
                                break;
                              } else {
                                a = a + 1;
                                break;
                              }
                            }
                            lexattr2(false);
                            b[a] = " ";
                            break;
                          }
                        } else if ((is(b[a], 34 /* DQO */) || is(b[a], 39 /* SQO */)) && not(liqattr[liqattr.length - 1], 34 /* DQO */) && not(liqattr[liqattr.length - 1], 39 /* SQO */)) {
                          liqattr.push(b[a]);
                        } else if (not(liqattr[liqattr.length - 1], 125 /* RCB */) && is(b[a], 123 /* LCB */) && (is(b[a + 1], 123 /* LCB */) || is(b[a + 1], 37 /* PER */))) {
                          liqattr.push("}");
                        } else if (inliq === false && is(b[a], 60 /* LAN */) && not(liqattr[liqattr.length - 1], 162 /* RAN */)) {
                          liqattr.push(">");
                        }
                        a = a + 1;
                      } while (a < c);
                    } else if (is(b[a], 123 /* LCB */) && is(b[a - 1], 61 /* EQS */) && options2.language !== "jsx") {
                      quote = "}";
                    } else if (is(b[a], 34 /* DQO */) || is(b[a], 39 /* SQO */)) {
                      quote = b[a];
                      if (is(b[a - 1], 61 /* EQS */) && (is(b[a + 1], 60 /* LAN */) || is(b[a + 1], 123 /* LCB */) && is(b[a + 2], 37 /* PER */) || ws(b[a + 1]) && not(b[a - 1], 61 /* EQS */))) {
                        igcount = a;
                      }
                    } else if (is(b[a], 40 /* LPR */)) {
                      quote = ")";
                      parncount = 1;
                    } else if (options2.language === "jsx") {
                      if ((is(b[a - 1], 61 /* EQS */) || ws(b[a - 1])) && is(b[a], 123 /* LCB */)) {
                        quote = "}";
                        bcount = 1;
                      } else if (is(b[a], 45 /* FWS */)) {
                        if (b[a + 1] === "*") {
                          quote = "*/";
                        } else if (b[a + 1] === "/") {
                          quote = "\n";
                        }
                      }
                    } else if (is(lex[0], 123 /* LCB */) && is(b[a], 123 /* LCB */) && (is(b[a + 1], 123 /* LCB */) || is(b[a + 1], 37 /* PER */))) {
                      if (is(b[a + 1], 123 /* LCB */)) {
                        quote = "}}";
                      } else {
                        quote = b[a + 1] + "}";
                      }
                    }
                    if (ws(b[a]) && quote === "") {
                      if (is(attribute[attribute.length - 2], 61 /* EQS */)) {
                        e = a + 1;
                        if (e < c) {
                          do {
                            if (ws(b[e]) === false) {
                              if (is(b[e], 34 /* DQO */) || is(b[e], 39 /* SQO */)) {
                                a = e - 1;
                                quotetest = true;
                                attribute.pop();
                              }
                              break;
                            }
                            e = e + 1;
                          } while (e < c);
                        }
                      }
                      if (quotetest === true) {
                        quotetest = false;
                      } else if (jsxcount === 0 || jsxcount === 1 && is(attribute[0], 123 /* LCB */)) {
                        attribute.pop();
                        lexattr2(false);
                        stest = true;
                        break;
                      }
                    }
                  } else if (is(b[a], 40 /* LPR */) && is(quote, 41 /* RPR */)) {
                    parncount = parncount + 1;
                  } else if (is(b[a], 41 /* RPR */) && is(quote, 41 /* RPR */)) {
                    parncount = parncount - 1;
                    if (parncount === 0) {
                      quote = "";
                      if (b[a + 1] === end.charAt(0)) {
                        lexattr2(false);
                        break;
                      }
                    }
                  } else if (options2.language === "jsx" && (is(quote, 125 /* RCB */) || is(quote, 10 /* NWL */) && is(b[a], 10 /* NWL */) || quote === "*/" && is(b[a - 1], 42 /* ARS */) && is(b[a], 45 /* FWS */))) {
                    if (is(quote, 125 /* RCB */)) {
                      if (is(b[a], 125 /* RCB */)) {
                        bcount = bcount + 1;
                      } else if (b[a] === quote) {
                        bcount = bcount - 1;
                        if (bcount === 0) {
                          jsxcount = 0;
                          quote = "";
                          element = attribute.join("");
                          if (options2.markup.preserveAttributes === false) {
                            if (options2.language === "jsx") {
                              if (/^\s*$/.test(element) === false)
                                attstore.push([element, lines]);
                            } else {
                              element = element.replace(/\s+/g, " ");
                              if (element !== " ")
                                attstore.push([element, lines]);
                            }
                          }
                          attribute = [];
                          lines = 1;
                          break;
                        }
                      }
                    } else {
                      jsxquote = "";
                      jscom = true;
                      element = attribute.join("");
                      if (element !== " ")
                        attstore.push([element, lines]);
                      attribute = [];
                      lines = quote === "\n" ? 2 : 1;
                      quote = "";
                      break;
                    }
                  } else if (is(b[a], 123 /* LCB */) && is(b[a + 1], 37 /* PER */) && is(b[igcount - 1], 61 /* EQS */) && (is(quote, 34 /* DQO */) || is(quote, 39 /* SQO */))) {
                    quote = quote + "{%";
                    igcount = 0;
                  } else if (is(b[a - 1], 37 /* PER */) && is(b[a], 125 /* RCB */) && (quote === '"{%' || quote === "'{%")) {
                    quote = quote.charAt(0);
                    igcount = 0;
                  } else if (is(b[a], 60 /* LAN */) && is(end, 162 /* RAN */) && is(b[igcount - 1], 61 /* EQS */) && (is(quote, 34 /* DQO */) || is(quote, 39 /* SQO */))) {
                    quote = quote + "<";
                    igcount = 0;
                  } else if (is(b[a], 162 /* RAN */) && (quote === '"<' || quote === "'<")) {
                    quote = quote.charAt(0);
                    igcount = 0;
                  } else if (igcount === 0 && not(quote, 162 /* RAN */) && (quote.length < 2 || not(quote[0], 34 /* DQO */) && not(quote[0], 39 /* SQO */))) {
                    f = 0;
                    if (lex.length > 1) {
                      tname = lex[1] + lex[2];
                      tname = tname.toLowerCase();
                    }
                    e = quote.length - 1;
                    if (e > -1) {
                      do {
                        if (b[a - f].charCodeAt(0) !== quote.charCodeAt(e))
                          break;
                        f = f + 1;
                        e = e - 1;
                      } while (e > -1);
                    }
                    if (e < 0) {
                      lexattr2(true);
                      if (b[a + 1] === lastchar)
                        break;
                    }
                  } else if (igcount > 0 && ws(b[a]) === false) {
                    igcount = 0;
                  }
                  a = a + 1;
                } while (a < c);
              }
            } else if (is(end, 10 /* NWL */) === false && (is(b[a], 34 /* DQO */) || is(b[a], 39 /* SQO */))) {
              quote = b[a];
            } else if (ltype !== "comment" && is(end, 10 /* NWL */) === false && is(b[a], 60 /* LAN */) && is(b[a + 1], 33 /* BNG */) && is(b[a + 2], 45 /* DSH */) && is(b[a + 3], 45 /* DSH */) && data.types[parse.count] !== "conditional") {
              quote = "-->";
            } else if (is(b[a], 123 /* LCB */) && not(lex[0], 123 /* LCB */) && not(end, 10 /* NWL */) && (is(b[a + 1], 123 /* LCB */) || is(b[a + 1], 37 /* PER */))) {
              if (is(b[a + 1], 123 /* LCB */)) {
                quote = "}}";
              } else {
                quote = b[a + 1] + "}";
                if (attribute.length < 1 && (attstore.length < 1 || ws(b[a - 1]))) {
                  lex.pop();
                  do {
                    if (is(b[a], 10 /* NWL */))
                      lines = lines + 1;
                    attribute.push(b[a]);
                    a = a + 1;
                  } while (a < c && b[a - 1] + b[a] !== quote);
                  attribute.push("}");
                  attstore.push([attribute.join(""), lines]);
                  attribute = [];
                  lines = 1;
                  quote = "";
                }
              }
              if (quote === end)
                quote = "";
            } else if ((simple === true || ltype === "sgml") && not(end, 10 /* NWL */) && ws(b[a]) && not(b[a - 1], 60 /* LAN */)) {
              if (ltype === "sgml") {
                lex.push(" ");
              } else {
                stest = true;
              }
            } else if (simple === true && options2.language === "jsx" && is(b[a], 45 /* FWS */) && (is(b[a + 1], 42 /* ARS */) || is(b[a + 1], 45 /* FWS */))) {
              stest = true;
              lex[lex.length - 1] = " ";
              attribute.push(b[a]);
              if (is(b[a + 1], 42 /* ARS */)) {
                jsxquote = "*/";
              } else {
                jsxquote = "\n";
              }
            } else if ((b[a] === lastchar || is(end, 10 /* NWL */) && is(b[a + 1], 60 /* LAN */)) && (lex.length > end.length + 1 || lex[0] === "]") && (options2.language !== "jsx" || jsxcount === 0)) {
              if (is(end, 10 /* NWL */)) {
                if (ws(lex[lex.length - 1])) {
                  do {
                    lex.pop();
                    a = a - 1;
                  } while (ws(lex[lex.length - 1]));
                }
                break;
              }
              f = lex.length;
              e = end.length - 1;
              if (e > -1) {
                do {
                  f = f - 1;
                  if (lex[f] !== end.charAt(e))
                    break;
                  e = e - 1;
                } while (e > -1);
              }
              if (e < 0)
                break;
            }
          } else if (b[a].charCodeAt(0) === quote.charCodeAt(quote.length - 1) && (options2.language === "jsx" && is(end, 125 /* RCB */) && (b[a - 1] !== "\\" || escslash2() === false) || options2.language !== "jsx" || not(end, 125 /* RCB */))) {
            f = 0;
            if (lex.length > 1) {
              tname = lex[1] + lex[2];
              tname = tname.toLowerCase();
            }
            e = quote.length - 1;
            if (e > -1) {
              do {
                if (b[a - f] !== quote.charAt(e))
                  break;
                f = f + 1;
                e = e - 1;
              } while (e > -1);
            }
            if (e < 0)
              quote = "";
          }
        }
        a = a + 1;
      } while (a < c);
      if (options2.markup.correct === true) {
        if (is(b[a + 1], 162 /* RAN */) && is(lex[0], 60 /* LAN */) && not(lex[0], 60 /* LAN */)) {
          do {
            a = a + 1;
          } while (is(b[a + 1], 162 /* RAN */));
        } else if (is(lex[0], 60 /* LAN */) && is(lex[1], 60 /* LAN */) && not(b[a + 1], 162 /* RAN */) && not(lex[lex.length - 2], 162 /* RAN */)) {
          do {
            lex.splice(1, 1);
          } while (lex[1] === "<");
        }
      }
      igcount = 0;
      element = lex.join("");
      tname = tagName(element);
      element = bracketSpace(element);
      if (tname === "xml") {
        html2 = "xml";
      } else if (html2 === "" && tname === "html") {
        html2 = "html";
      } else if (html2 === "liquid") {
        html2 = "html";
      }
    }
    record.token = element;
    record.types = ltype;
    tname = tagName(element);
    if (preserve === false && options2.language !== "jsx")
      element = element.replace(/\s+/g, " ");
    if (tname === "comment" && isLiquid(element, 2)) {
      let lineFindStart2 = function(spaces) {
        linesStart = spaces === "" ? 0 : spaces.split("\n").length;
        return "";
      }, lineFindEnd2 = function(spaces) {
        linesEnd = spaces === "" ? 0 : spaces.split("\n").length;
        return "";
      };
      const open = element.slice(0, element.indexOf("%}") + 2);
      const comm2 = element.slice(element.indexOf("%}") + 2, element.lastIndexOf("{%"));
      const end2 = element.slice(element.lastIndexOf("{%"));
      let linesStart = 0;
      let linesEnd = 0;
      record.begin = parse.structure[parse.structure.length - 1][1];
      record.ender = parse.count + 3;
      record.stack = parse.structure[parse.structure.length - 1][0];
      record.types = "template_start";
      record.token = open;
      recordpush(data, record, "comment");
      element = comm2.replace(/^\s*/, lineFindStart2);
      element = element.replace(/\s*$/, lineFindEnd2);
      record.begin = parse.count;
      record.lines = linesStart;
      record.stack = "comment";
      record.token = element;
      record.types = "comment";
      recordpush(data, record, "");
      record.types = "template_end";
      record.stack = "comment";
      record.lines = linesEnd;
      record.token = end2;
      recordpush(data, record, "");
      return;
    }
    record.types = ltype;
    cheat = (() => {
      const ender = /(\/>)$/;
      function peertest(n, i) {
        if (!blocks.has(n))
          return false;
        if (n === i)
          return true;
        if (n === "dd" && i === "dt")
          return true;
        if (n === "dt" && i === "dd")
          return true;
        if (n === "td" && i === "th")
          return true;
        if (n === "th" && i === "td")
          return true;
        if (n === "colgroup" && (i === "tbody" || i === "tfoot" || i === "thead" || i === "tr"))
          return true;
        if (n === "tbody" && (i === "colgroup" || i === "tfoot" || i === "thead"))
          return true;
        if (n === "tfoot" && (i === "colgroup" || i === "tbody" || i === "thead"))
          return true;
        if (n === "thead" && (i === "colgroup" || i === "tbody" || i === "tfoot"))
          return true;
        if (n === "tr" && i === "colgroup")
          return true;
        return false;
      }
      function addHtmlEnd(count2) {
        record.lines = data.lines[parse.count] > 0 ? 1 : 0;
        record.token = `</${parse.structure[parse.structure.length - 1][0]}>`;
        record.types = "end";
        recordpush(data, record, "");
        if (count2 > 0) {
          do {
            record.begin = parse.structure[parse.structure.length - 1][1];
            record.stack = parse.structure[parse.structure.length - 1][0];
            record.token = `</${parse.structure[parse.structure.length - 1][0]}>`;
            recordpush(data, record, "");
            count2 = count2 - 1;
          } while (count2 > 0);
        }
        record.begin = parse.structure[parse.structure.length - 1][1];
        record.lines = parse.linesSpace;
        record.stack = parse.structure[parse.structure.length - 1][0];
        record.token = element;
        record.types = "end";
        data.lines[parse.count - 1] = 0;
      }
      if (ltype === "end") {
        const lastToken = data.token[parse.count];
        if (data.types[parse.count - 1] === "singleton" && lastToken.charCodeAt(lastToken.length - 2) !== 45 /* FWS */ && "/" + tagName(lastToken) === tname) {
          data.types[parse.count - 1] = "start";
        }
      }
      if (html2 === "html") {
        if (element.charCodeAt(0) === 60 /* LAN */ && element.charCodeAt(1) !== 33 /* BNG */ && element.charCodeAt(1) !== 63 /* QWS */ && (parse.count < 0 || data.types[parse.count].indexOf("template") < 0)) {
          element = element.toLowerCase();
        }
        if (blocks.has(parse.structure[parse.structure.length - 1][0]) && peertest(tname.slice(1), parse.structure[parse.structure.length - 2][0])) {
          addHtmlEnd(0);
        } else if (parse.structure.length > 3 && blocks.has(parse.structure[parse.structure.length - 1][0]) && blocks.has(parse.structure[parse.structure.length - 2][0]) && blocks.has(parse.structure[parse.structure.length - 3][0]) && peertest(tname, parse.structure[parse.structure.length - 4][0]) === true) {
          addHtmlEnd(3);
        } else if (parse.structure.length > 2 && blocks.has(parse.structure[parse.structure.length - 1][0]) && blocks.has(parse.structure[parse.structure.length - 2][0]) && peertest(tname, parse.structure[parse.structure.length - 3][0]) === true) {
          addHtmlEnd(2);
        } else if (parse.structure.length > 1 && blocks.has(parse.structure[parse.structure.length - 1][0]) && peertest(tname, parse.structure[parse.structure.length - 2][0]) === true) {
          addHtmlEnd(1);
        } else if (peertest(tname, parse.structure[parse.structure.length - 1][0]) === true) {
          addHtmlEnd(0);
        } else if (tname.charCodeAt(0) === 45 /* FWS */ && blocks.has(parse.structure[parse.structure.length - 1][0]) && parse.structure[parse.structure.length - 1][0] !== tname.slice(1)) {
          fixHtmlEnd(element, false);
          record.begin = parse.structure[parse.structure.length - 1][1];
          record.lines = parse.linesSpace;
          record.stack = parse.structure[parse.structure.length - 1][0];
          record.token = element;
          record.types = "end";
          data.lines[parse.count - 1] = 0;
        }
        if (voids.has(tname)) {
          if (options2.markup.correct === true && ender.test(element) === false) {
            element = element.slice(0, element.length - 1) + " />";
          }
          return true;
        }
      }
      return false;
    })();
    if (/\bscript|style\b/.test(tname) && element.slice(element.length - 2) !== "/>" || /\bschema|style|stylesheet|javascript\b/.test(tname) && element.slice(element.length - 2) === "%}") {
      const liquid2 = isLiquid(element, 3);
      let len = attstore.length - 1;
      let attValue = "";
      let attrName = [];
      if (len > -1) {
        do {
          attrName = attrname(attstore[len][0]);
          if (attrName[0] === "type") {
            attValue = attrName[1];
            if (attValue.charCodeAt(0) === 34 /* DQO */ || attValue.charCodeAt(0) === 39 /* SQO */) {
              attValue = attValue.slice(1, attValue.length - 1);
            }
            break;
          }
          len = len - 1;
        } while (len > -1);
      }
      if (liquid2 === false && tname === "script" && (attValue === "" || attValue === "text/javascript" || attValue === "babel" || attValue === "module" || attValue === "application/javascript" || attValue === "application/x-javascript" || attValue === "text/ecmascript" || attValue === "application/ecmascript" || attValue === "text/jsx" || attValue === "application/jsx" || attValue === "text/cjs" || attValue === "application/json" || attValue === "application/ld+json")) {
        ext = true;
      } else if (tname === "style" && options2.language !== "jsx" && (attValue === "" || attValue === "text/css")) {
        ext = true;
      } else if (liquid2 === true && (tname === "javascript" || tname === "schema" || tname === "style" || tname === "stylesheet")) {
        ext = true;
      }
      if (ext === true) {
        len = a + 1;
        if (len < c) {
          do {
            if (ws(b[len]) === false) {
              if (is(b[len], 60 /* LAN */)) {
                if (b.slice(len + 1, len + 4).join("") === "!--") {
                  len = len + 4;
                  if (len < c) {
                    do {
                      if (ws(b[len]) === false) {
                        ext = false;
                        break;
                      }
                      if (b[len] === "\n" || b[len] === "\r")
                        break;
                      len = len + 1;
                    } while (len < c);
                  }
                } else {
                  ext = false;
                }
              }
              break;
            }
            len = len + 1;
          } while (len < c);
        }
      }
    }
    if (simple && ignoreme === false && ltype !== "xml") {
      if (cheat === true || element.slice(element.length - 2) === "/>") {
        ltype = "singleton";
      } else {
        ltype = "start";
      }
      record.types = ltype;
    }
    if (simple && preserve === false && ignoreme && is(end, 162 /* RAN */) && element.slice(element.length - 2) !== "/>") {
      const tags = [];
      const atstring = [];
      if (cheat === true) {
        ltype = "singleton";
      } else {
        attstore.forEach((value) => atstring.push(value[0]));
        preserve = true;
        ltype = "ignore";
        a = a + 1;
        if (a < c) {
          let delim = "";
          let ee = 0;
          let ff = 0;
          let endtag = false;
          do {
            if (is(b[a], 10 /* NWL */))
              parse.lineNumber = parse.lineNumber + 1;
            tags.push(b[a]);
            if (delim === "") {
              if (is(b[a], 34 /* DQO */)) {
                delim = '"';
              } else if (is(b[a], 39 /* SQO */)) {
                delim = "'";
              } else if (not(tags[0], 123 /* LCB */) && is(b[a], 123 /* LCB */) && (is(b[a + 1], 123 /* LCB */) || is(b[a + 1], 37 /* PER */))) {
                if (is(b[a + 1], 123 /* LCB */)) {
                  delim = "}}";
                } else {
                  delim = b[a + 1] + "}";
                }
              } else if (is(b[a], 60 /* LAN */) && simple === true) {
                if (is(b[a + 1], 45 /* FWS */)) {
                  endtag = true;
                } else {
                  endtag = false;
                }
              } else if (b[a] === lastchar && not(b[a - 1], 45 /* FWS */)) {
                if (endtag === true) {
                  igcount = igcount - 1;
                  if (igcount < 0)
                    break;
                } else {
                  igcount = igcount + 1;
                }
              }
            } else if (b[a] === delim.charAt(delim.length - 1)) {
              ff = 0;
              ee = delim.length - 1;
              if (ee > -1) {
                do {
                  if (b[a - ff] !== delim.charAt(ee))
                    break;
                  ff = ff + 1;
                  ee = ee - 1;
                } while (ee > -1);
              }
              if (ee < 0)
                delim = "";
            }
            a = a + 1;
          } while (a < c);
        }
      }
      element = element + tags.join("");
      element = element.replace(">", ` ${atstring.join(" ")}>`);
      record.token = element;
      record.types = "content-ignore";
      attstore = [];
    }
    if (record.types.indexOf("template") > -1) {
      if (is(element[0], 123 /* LCB */) && is(element[1], 37 /* PER */)) {
        if ((tname === "case" || tname === "default") && (parse.structure[parse.structure.length - 1][0] === "switch" || parse.structure[parse.structure.length - 1][0] === "case")) {
          record.types = "template_else";
        } else if (tname === "else" || tname === "when" || tname === "elsif") {
          record.types = "template_else";
        } else {
          if (names.has(tname)) {
            record.types = "template_start";
          } else if (tname[0] === "e" && tname[1] === "n" && tname[2] === "d" && names.has(tname.slice(3))) {
            record.types = "template_end";
          } else if (tname[0] === "e" && tname[1] === "n" && tname[2] === "d") {
            record.types = "template_end";
            record.stack = tname.slice(3);
            let idx = 0;
            do {
              if (data.types[idx] === "template" && data.stack[idx] === record.stack) {
                data.types[idx] = "template_start";
                count.start = count.start + 1;
                break;
              } else {
                idx = data.stack.indexOf(record.stack, idx + 1);
              }
            } while (idx > -1);
          } else {
            record.stack = tname;
          }
        }
      } else if (record.types === "template") {
        if (element.indexOf("else") > 2)
          record.types = "template_else";
      }
      if (record.types === "template_start" || record.types === "template_else") {
        if (tname === "" || tname === "%") {
          tname = tname + element.slice(1).replace(tname, "").replace(/^\s+/, "");
          tname = tname.slice(0, tname.indexOf("(")).replace(/\s+/, "");
        }
      }
    }
    if (ltype === "cdata" && (record.stack === "script" || record.stack === "style")) {
      let counta = parse.count;
      let countb = parse.count;
      const stack = record.stack;
      if (data.types[countb] === "attribute") {
        do {
          counta = counta - 1;
          countb = countb - 1;
        } while (data.types[countb] === "attribute" && countb > -1);
      }
      record.begin = counta;
      record.token = "<![CDATA[";
      record.types = "cdata_start";
      element = element.replace(/^(\s*<!\[cdata\[)/i, "").replace(/(\]\]>\s*)$/, "");
      recordpush(data, record, "");
      parse.structure.push(["cdata", parse.count]);
      if (stack === "script") {
        prettify.lexers.script(element);
      } else {
        prettify.lexers.style(element);
      }
      record.begin = parse.structure[parse.structure.length - 1][1];
      record.token = "]]>";
      record.types = "cdata_end";
      recordpush(data, record, "");
      parse.structure.pop();
    } else {
      recordpush(data, record, tname);
    }
    attrecord();
    if (options2.wrap > 0 && options2.language === "jsx") {
      let current_length = 0;
      let bb = parse.count;
      let cc2 = 0;
      if (data.types[bb].indexOf("attribute") > -1) {
        do {
          current_length = current_length + data.token[bb].length + 1;
          bb = bb - 1;
        } while (data.lexer[bb] !== "markup" || data.types[bb].indexOf("attribute") > -1);
        if (data.lines[bb] === 1)
          current_length = current_length + data.token[bb].length + 1;
      } else if (data.lines[bb] === 1) {
        current_length = data.token[bb].length + 1;
      }
      cc2 = bb - 1;
      if (current_length > 0 && data.types[cc2] !== "script_end") {
        if (data.types[cc2].indexOf("attribute") > -1) {
          do {
            current_length = current_length + data.token[cc2].length + 1;
            cc2 = cc2 - 1;
          } while (data.lexer[cc2] !== "markup" || data.types[cc2].indexOf("attribute") > -1);
          if (data.lines[cc2] === 1)
            current_length = current_length + data.token[cc2].length + 1;
        } else if (data.lines[cc2] === 1) {
          current_length = data.token[cc2].length + 1;
        }
        if (current_length > options2.wrap && data.lines[bb] === 1) {
          record.begin = data.begin[bb];
          record.ender = bb + 2;
          record.lexer = data.lexer[bb];
          record.lines = 1;
          record.stack = data.stack[bb];
          record.token = "{";
          record.types = "script_start";
          parse.splice({
            data,
            howmany: 0,
            index: bb,
            record
          });
          record.begin = bb;
          record.lexer = "script";
          record.lines = 0;
          record.stack = "script";
          if (options2.markup.quoteConvert === "single") {
            record.token = "' '";
          } else {
            record.token = '" "';
          }
          record.types = "string";
          parse.splice({
            data,
            howmany: 0,
            index: bb + 1,
            record
          });
          record.lexer = "markup";
          record.token = "}";
          record.types = "script_end";
          parse.splice({
            data,
            howmany: 0,
            index: bb + 2,
            record
          });
          data.ender[bb + 3] = data.ender[bb + 3] + 3;
          bb = bb + 4;
          do {
            data.begin[bb] = data.begin[bb] + 3;
            data.ender[bb] = data.ender[bb] + 3;
            bb = bb + 1;
          } while (bb < parse.count);
        }
      }
    }
    parse.linesSpace = 0;
  }
  function content() {
    let ltoke = "";
    let liner = parse.linesSpace;
    let name = "";
    const lex = [];
    const jsxbrace = data.token[parse.count] === "{";
    const now = a;
    if (ext === true) {
      if (jsxbrace === true) {
        name = "script";
      } else if (parse.structure[parse.structure.length - 1][1] > -1) {
        name = tagName(data.token[parse.structure[parse.structure.length - 1][1]].toLowerCase());
      } else if (data.begin[parse.count] > 1) {
        name = tagName(data.token[data.begin[parse.count]].toLowerCase());
      } else {
        name = tagName(data.token[data.begin[parse.count]].toLowerCase());
      }
    }
    const square = data.types[parse.count] === "template_start" && data.token[parse.count].indexOf("<!") === 0 && data.token[parse.count].indexOf("<![") < 0 && data.token[parse.count].charAt(data.token[parse.count].length - 1) === "[";
    const record = /* @__PURE__ */ Object.create(null);
    record.begin = parse.structure[parse.structure.length - 1][1];
    record.ender = -1;
    record.lexer = "markup";
    record.lines = liner;
    record.stack = parse.structure[parse.structure.length - 1][0];
    record.token = "";
    record.types = "content";
    function esctest() {
      let aa = a - 1;
      let bb = 0;
      if (b[a - 1] !== "\\")
        return false;
      if (aa > -1) {
        do {
          if (b[aa] !== "\\")
            break;
          bb = bb + 1;
          aa = aa - 1;
        } while (aa > -1);
      }
      return bb % 2 === 1;
    }
    if (a < c) {
      let end = "";
      let quote = "";
      let quotes = 0;
      do {
        if (b[a] === "\n")
          parse.lineNumber = parse.lineNumber + 1;
        if (ext === true) {
          if (quote === "") {
            if (b[a] === "/") {
              if (b[a + 1] === "*") {
                quote = "*";
              } else if (b[a + 1] === "/") {
                quote = "/";
              } else if (name === "script" && "([{!=,;.?:&<>".indexOf(b[a - 1]) > -1) {
                if (options2.language !== "jsx" || b[a - 1] !== "<")
                  quote = "reg";
              }
            } else if ((b[a] === '"' || b[a] === "'" || b[a] === "`") && esctest() === false) {
              quote = b[a];
            } else if (b[a] === "{" && jsxbrace === true) {
              quotes = quotes + 1;
            } else if (b[a] === "}" && jsxbrace === true) {
              if (quotes === 0) {
                prettify.lexers.script(lex.join("").replace(/^(\s+)/, "").replace(/(\s+)$/, ""));
                parse.structure[parse.structure.length - 1][1] += 1;
                if (data.types[parse.count] === "end" && data.lexer[data.begin[parse.count] - 1] === "script") {
                  record.lexer = "script";
                  record.token = options2.markup.correct === true ? ";" : "x;";
                  record.types = "separator";
                  recordpush(data, record, "");
                  record.lexer = "markup";
                }
                record.token = "}";
                record.types = "script_end";
                recordpush(data, record, "");
                parse.structure.pop();
                break;
              }
              quotes = quotes - 1;
            }
            if (isLiquid(data.token[parse.count], 3) === false) {
              end = b.slice(a, a + 10).join("").toLowerCase();
              if (name === "script") {
                end = a === c - 9 ? end.slice(0, end.length - 1) : end.slice(0, end.length - 2);
                if (end === "<\/script") {
                  let outside = lex.join("").replace(/^(\s+)/, "").replace(/(\s+)$/, "");
                  a = a - 1;
                  if (lex.length < 1)
                    break;
                  if (/^<!--+/.test(outside) && /--+>$/.test(outside)) {
                    record.token = "<!--";
                    record.types = "comment";
                    recordpush(data, record, "");
                    outside = outside.replace(/^<!--+/, "").replace(/--+>$/, "");
                    prettify.lexers.script(outside);
                    record.token = "-->";
                    recordpush(data, record, "");
                  } else {
                    prettify.lexers.script(outside);
                  }
                  break;
                }
              }
              if (name === "style") {
                if (a === c - 8) {
                  end = end.slice(0, end.length - 1);
                } else if (a === c - 9) {
                  end = end.slice(0, end.length - 2);
                } else {
                  end = end.slice(0, end.length - 3);
                }
                if (end === "</style") {
                  let outside = lex.join("").replace(/^(\s+)/, "").replace(/(\s+)$/, "");
                  a = a - 1;
                  if (lex.length < 1)
                    break;
                  if (/^<!--+/.test(outside) && /--+>$/.test(outside)) {
                    record.token = "<!--";
                    record.types = "comment";
                    recordpush(data, record, "");
                    outside = outside.replace(/^<!--+/, "").replace(/--+>$/, "");
                    prettify.lexers.style(outside);
                    record.token = "-->";
                    recordpush(data, record, "");
                  } else {
                    prettify.lexers.style(outside);
                    if (options2.style.sortProperties === true)
                      parse.sortCorrection(0, parse.count + 1);
                  }
                  break;
                }
              }
            } else {
              if (name === "schema") {
                end = b.slice(a + 3, a + 14).join("").toLowerCase();
                if (a === c - 12) {
                  end = end.slice(0, end.length - 3);
                } else {
                  end = end.slice(0, end.length - 2);
                }
                if (end === "endschema") {
                  let outside = lex.join("").replace(/^(\s+)/, "").replace(/(\s+)$/, "");
                  a = a - 1;
                  if (lex.length < 1)
                    break;
                  if (/^<!--+/.test(outside) && /--+>$/.test(outside)) {
                    record.token = "<!--";
                    record.types = "comment";
                    recordpush(data, record, "");
                    outside = outside.replace(/^<!--+/, "").replace(/--+>$/, "");
                    prettify.lexers.script(outside);
                    record.token = "-->";
                    recordpush(data, record, "");
                  } else {
                    prettify.options.language = "json";
                    prettify.lexers.script(outside);
                    if (options2.script.objectSort === true)
                      parse.sortCorrection(0, parse.count + 1);
                    prettify.options.language = "liquid";
                  }
                  break;
                }
              } else if (name === "style") {
                end = b.slice(a + 4, a + 14).join("").toLowerCase();
                if (a === c - 14) {
                  end = end.slice(0, end.length - 4);
                } else if (a === c - 13) {
                  end = end.slice(0, end.length - 3);
                } else {
                  end = end.slice(0, end.length - 2);
                }
                if (end === "endstyle") {
                  let outside = lex.join("").replace(/^(\s+)/, "").replace(/(\s+)$/, "");
                  a = a - 1;
                  if (lex.length < 1)
                    break;
                  if (/^<!--+/.test(outside) && /--+>$/.test(outside)) {
                    record.token = "<!--";
                    record.types = "comment";
                    recordpush(data, record, "");
                    outside = outside.replace(/^<!--+/, "").replace(/--+>$/, "");
                    prettify.lexers.style(outside);
                    record.token = "-->";
                    recordpush(data, record, "");
                  } else {
                    prettify.lexers.style(outside);
                  }
                  break;
                }
              } else if (name === "javascript") {
                end = b.slice(a + 4, a + 19).join("").toLowerCase();
                if (a === c - 19) {
                  end = end.slice(0, end.length - 4);
                } else if (a === c - 18) {
                  end = end.slice(0, end.length - 3);
                } else {
                  end = end.slice(0, end.length - 2);
                }
                if (end === "endjavascript") {
                  let outside = lex.join("").replace(/^(\s+)/, "").replace(/(\s+)$/, "");
                  a = a - 1;
                  if (lex.length < 1)
                    break;
                  if (/^<!--+/.test(outside) && /--+>$/.test(outside)) {
                    record.token = "<!--";
                    record.types = "comment";
                    recordpush(data, record, "");
                    outside = outside.replace(/^<!--+/, "").replace(/--+>$/, "");
                    prettify.lexers.script(outside);
                    record.token = "-->";
                    recordpush(data, record, "");
                  } else {
                    prettify.lexers.script(outside);
                    if (options2.script.objectSort === true) {
                      parse.sortCorrection(0, parse.count + 1);
                    }
                  }
                  break;
                }
              }
            }
          } else if (quote === b[a] && (quote === '"' || quote === "'" || quote === "`" || quote === "*" && b[a + 1] === "/") && esctest() === false) {
            quote = "";
          } else if (quote === "`" && b[a] === "$" && b[a + 1] === "{" && esctest() === false) {
            quote = "}";
          } else if (quote === "}" && b[a] === "}" && esctest() === false) {
            quote = "`";
          } else if (quote === "/" && (b[a] === "\n" || b[a] === "\r")) {
            quote = "";
          } else if (quote === "reg" && b[a] === "/" && esctest() === false) {
            quote = "";
          } else if (quote === "/" && b[a] === ">" && b[a - 1] === "-" && b[a - 2] === "-") {
            end = b.slice(a + 1, a + 11).join("").toLowerCase();
            end = end.slice(0, end.length - 2);
            if (name === "script" && end === "<\/script")
              quote = "";
            end = end.slice(0, end.length - 1);
            if (name === "style" && end === "</style")
              quote = "";
          }
        }
        if (square === true && b[a] === "]") {
          a = a - 1;
          ltoke = lex.join("");
          ltoke = ltoke.replace(/\s+$/, "");
          liner = 0;
          record.token = ltoke;
          recordpush(data, record, "");
          break;
        }
        if (ext === false && lex.length > 0 && (b[a] === "<" && b[a + 1] !== "=" && !/\s|\d/.test(b[a + 1]) || b[a] === "[" && b[a + 1] === "%" || b[a] === "{" && (options2.language === "jsx" || b[a + 1] === "{" || b[a + 1] === "%"))) {
          a = a - 1;
          if (parse.structure[parse.structure.length - 1][0] === "comment") {
            ltoke = lex.join("");
          } else {
            ltoke = lex.join("").replace(/\s+$/, "");
          }
          ltoke = bracketSpace(ltoke);
          liner = 0;
          record.token = ltoke;
          if (options2.wrap > 0 && options2.markup.preserveText !== true) {
            let wrapper2 = function() {
              if (ltoke.charAt(aa) === " ") {
                store.push(ltoke.slice(0, aa));
                ltoke = ltoke.slice(aa + 1);
                len = ltoke.length;
                aa = wrap;
                return;
              }
              do {
                aa = aa - 1;
              } while (aa > 0 && ltoke.charAt(aa) !== " ");
              if (aa > 0) {
                store.push(ltoke.slice(0, aa));
                ltoke = ltoke.slice(aa + 1);
                len = ltoke.length;
                aa = wrap;
              } else {
                aa = wrap;
                do {
                  aa = aa + 1;
                } while (aa < len && ltoke.charAt(aa) !== " ");
                store.push(ltoke.slice(0, aa));
                ltoke = ltoke.slice(aa + 1);
                len = ltoke.length;
                aa = wrap;
              }
            };
            let aa = options2.wrap;
            let len = ltoke.length;
            const startSpace = "";
            const endSpace = "";
            const wrap = options2.wrap;
            const store = [];
            if (data.token[data.begin[parse.count]] === "<a>" && data.token[data.begin[data.begin[parse.count]]] === "<li>" && data.lines[data.begin[parse.count]] === 0 && parse.linesSpace === 0 && ltoke.length < options2.wrap) {
              recordpush(data, record, "");
              break;
            }
            if (len < wrap) {
              recordpush(data, record, "");
              break;
            }
            if (parse.linesSpace < 1) {
              let bb = parse.count;
              do {
                aa = aa - data.token[bb].length;
                if (data.types[bb].indexOf("attribute") > -1)
                  aa = aa - 1;
                if (data.lines[bb] > 0 && data.types[bb].indexOf("attribute") < 0)
                  break;
                bb = bb - 1;
              } while (bb > 0 && aa > 0);
              if (aa < 1)
                aa = ltoke.indexOf(" ");
            }
            ltoke = lex.join("");
            ltoke = ltoke.replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s+/g, " ");
            do {
              wrapper2();
            } while (aa < len);
            if (ltoke !== "" && ltoke !== " ")
              store.push(ltoke);
            ltoke = options2.crlf === true ? store.join("\r\n") : store.join("\n");
            ltoke = startSpace + ltoke + endSpace;
          }
          liner = 0;
          record.token = ltoke;
          recordpush(data, record, "");
          break;
        }
        lex.push(b[a]);
        a = a + 1;
      } while (a < c);
    }
    if (a > now && a < c) {
      if (/\s/.test(b[a]) === true) {
        let x = a;
        parse.linesSpace = 1;
        do {
          if (b[x] === "\n")
            parse.linesSpace = parse.linesSpace + 1;
          x = x - 1;
        } while (x > now && /\s/.test(b[x]) === true);
      } else {
        parse.linesSpace = 0;
      }
    } else if (a !== now || a === now && ext === false) {
      ltoke = lex.join("").replace(/\s+$/, "");
      liner = 0;
      if (record.token !== ltoke) {
        record.token = ltoke;
        recordpush(data, record, "");
        parse.linesSpace = 0;
      }
    }
    ext = false;
  }
  if (asl > 0) {
    do {
      options2.markup.attributeSortList[a] = options2.markup.attributeSortList[a].replace(/^\s+/, "").replace(/\s+$/, "");
      a = a + 1;
    } while (a < asl);
    a = 0;
  }
  if (options2.language === "html" || options2.language === "liquid")
    html2 = "html";
  do {
    if (/\s/.test(b[a])) {
      if (data.types[parse.count] === "template_start" && parse.structure[parse.structure.length - 1][0] === "comment") {
        content();
      } else {
        a = parse.spacer({ array: b, end: c, index: a });
      }
    } else if (ext) {
      content();
    } else if (b[a] === "<") {
      tag("");
    } else if (b[a] === "[" && b[a + 1] === "%") {
      tag("%]");
    } else if (b[a] === "{" && (options2.language === "jsx" || b[a + 1] === "{" || b[a + 1] === "%")) {
      tag("");
    } else if (b[a] === "]" && sgmlflag > 0) {
      tag("]>");
    } else if (b[a] === "-" && b[a + 1] === "-" && b[a + 2] === "-") {
      tag("---");
    } else {
      content();
    }
    a = a + 1;
  } while (a < c);
  if (data.token[parse.count].charAt(0) !== "/" && blocks.has(parse.structure[parse.structure.length - 1][0])) {
    fixHtmlEnd(data.token[parse.count], true);
  }
  if (count.end !== count.start && parse.error === "") {
    if (count.end > count.start) {
      const x = count.end - count.start;
      const plural = x === 1 ? "" : "s";
      parse.error = `\u2716 Prettify Parse Error:

  ${x} more end type${plural} than start types.

`;
    } else {
      const x = count.start - count.end;
      const plural = x === 1 ? "" : "s";
      parse.error = ` \u2716 Prettify Parse Error:

  ${x} more start type${plural} than end types.

`;
    }
  }
  return data;
};

// src/beautify/markup.ts
prettify.beautify.markup = function markup2(options2) {
  const type = create(null);
  const token = create(null);
  const externalIndex = create(null);
  const lexer = "markup";
  const data = prettify.parsed;
  const lf = options2.crlf === true ? String.fromCharCode(13, 10) : String.fromCharCode(10);
  const c = prettify.end < 1 || prettify.end > data.token.length ? data.token.length : prettify.end + 1;
  type.is = (index, name) => data.types[index] === name;
  type.not = (index, name) => data.types[index] !== name;
  type.idx = (index, name) => index > -1 && data.types[index].indexOf(name);
  token.is = (index, tag) => data.token[index] === tag;
  token.not = (index, tag) => data.token[index] !== tag;
  let a = prettify.start;
  let comstart = -1;
  let next = 0;
  let count = 0;
  let indent = isNaN(options2.indentLevel) ? 0 : Number(options2.indentLevel);
  const levels = (() => {
    const level = prettify.start > 0 ? Array(prettify.start).fill(0, 0, prettify.start) : [];
    function nextIndex() {
      let x = a + 1;
      let y = 0;
      if (type.is(x, void 0))
        return x - 1;
      if (type.is(x, "comment") || a < c - 1 && type.idx(x, "attribute") > -1) {
        do {
          if (type.is(x, "jsx_attribute_start")) {
            y = x;
            do {
              if (type.is(x, "jsx_attribute_end") && data.begin[x] === y)
                break;
              x = x + 1;
            } while (x < c);
          } else if (type.not(x, "comment") && type.idx(x, "attribute") < 0)
            return x;
          x = x + 1;
        } while (x < c);
      }
      return x;
    }
    function anchorList() {
      const stop = data.begin[a];
      let aa = a;
      do {
        aa = aa - 1;
        if (token.is(aa, "</li>") && token.is(aa - 1, "</a>") && data.begin[data.begin[aa]] === stop && data.begin[aa - 1] === data.begin[aa] + 1) {
          aa = data.begin[aa];
        } else {
          return;
        }
      } while (aa > stop + 1);
      aa = a;
      do {
        aa = aa - 1;
        if (type.is(aa + 1, "attribute")) {
          level[aa] = -10;
        } else if (token.not(aa, "</li>")) {
          level[aa] = -20;
        }
      } while (aa > stop + 1);
    }
    function comment2() {
      let x = a;
      let test = false;
      if (data.lines[a + 1] === 0 && options2.markup.forceIndent === false) {
        do {
          if (data.lines[x] > 0) {
            test = true;
            break;
          }
          x = x - 1;
        } while (x > comstart);
        x = a;
      } else {
        test = true;
      }
      if (test === true) {
        const ind = type.is(next, "comment") || type.is(next, "end") || type.is(next, "template_end") ? indent + 1 : indent;
        do {
          level.push(ind);
          x = x - 1;
        } while (x > comstart);
        if (ind === indent + 1)
          level[a] = indent;
        if (type.is(x, "attribute") || type.is(x, "template_attribute") || type.is(x, "jsx_attribute_start")) {
          level[data.begin[x]] = ind;
        } else {
          level[x] = ind;
        }
      } else {
        do {
          level.push(-20);
          x = x - 1;
        } while (x > comstart);
        level[x] = -20;
      }
      comstart = -1;
    }
    function content() {
      let ind = indent;
      if (options2.markup.forceIndent === true || options2.markup.forceAttribute === true) {
        level.push(indent);
        return;
      }
      if (next < c && (type.idx(next, "end") > -1 || type.idx(next, "start") > -1) && data.lines[next] > 0) {
        level.push(indent);
        ind = ind + 1;
        if (data.types[a] === "singleton" && a > 0 && type.idx(a - 1, "attribute") > -1 && type.is(data.begin[a - 1], "singleton")) {
          if (data.begin[a] < 0 || type.is(data.begin[a - 1], "singleton") && data.begin[data.ender[a] - 1] !== a) {
            level[a - 1] = indent;
          } else {
            level[a - 1] = indent + 1;
          }
        }
      } else if (a > 0 && type.is(a, "singleton") && type.idx(a - 1, "attribute") > -1) {
        level[a - 1] = indent;
        count = data.token[a].length;
        level.push(-10);
      } else if (data.lines[next] === 0) {
        level.push(-20);
      } else if ((options2.wrap === 0 || a < c - 2 && type.idx(a + 2, "attribute") > -1 && data.token[a].length + data.token[a + 1].length > options2.wrap || (data.token[a].length + data.token[a + 1] ? data.token[a + 1].length : 0) > options2.wrap) && (type.is(a + 1, "singleton") || type.is(a + 1, "template"))) {
        level.push(indent);
      } else {
        count = count + 1;
        level.push(-10);
      }
      if (a > 0 && type.idx(a - 1, "attribute") > -1 && data.lines[a] < 1) {
        level[a - 1] = -20;
      }
      if (count > options2.wrap) {
        let d = a;
        let e = Math.max(data.begin[a], 0);
        if (type.is(a, "content") && options2.markup.preserveText === false) {
          let countx = 0;
          const chars = data.token[a].replace(/\s+/g, " ").split(" ");
          do {
            d = d - 1;
            if (level[d] < 0) {
              countx = countx + data.token[d].length;
              if (level[d] === -10)
                countx = countx + 1;
            } else {
              break;
            }
          } while (d > 0);
          d = 0;
          e = chars.length;
          do {
            if (chars[d].length + countx > options2.wrap) {
              chars[d] = lf + chars[d];
              countx = chars[d].length;
            } else {
              chars[d] = ` ${chars[d]}`;
              countx = countx + chars[d].length;
            }
            d = d + 1;
          } while (d < e);
          if (chars[0].charAt(0) === " ") {
            data.token[a] = chars.join("").slice(1);
          } else {
            level[a - 1] = ind;
            data.token[a] = chars.join("").replace(lf, "");
          }
          if (data.token[a].indexOf(lf) > 0) {
            count = data.token[a].length - data.token[a].lastIndexOf(lf);
          }
        } else {
          do {
            d = d - 1;
            if (level[d] > -1) {
              count = data.token[a].length;
              if (data.lines[a + 1] > 0)
                count = count + 1;
              return;
            }
            if (data.types[d].indexOf("start") > -1) {
              count = 0;
              return;
            }
            if (data.lines[d + 1] > 0 && (type.not(d, "attribute") || type.is(d, "attribute") && type.is(d + 1, "attribute"))) {
              if (type.not(d, "singleton") || type.is(d, "attribute") && type.is(d + 1, "attribute")) {
                count = data.token[a].length;
                if (data.lines[a + 1] > 0)
                  count = count + 1;
                break;
              }
            }
          } while (d > e);
          level[d] = ind;
        }
      }
    }
    function external() {
      const skip = a;
      do {
        if (data.lexer[a + 1] === lexer && data.begin[a + 1] < skip && type.not(a + 1, "start") && type.not(a + 1, "singleton"))
          break;
        level.push(0);
        a = a + 1;
      } while (a < c);
      externalIndex[skip] = a;
      level.push(indent - 1);
      next = nextIndex();
      if (data.lexer[next] === lexer && data.stack[a].indexOf("attribute") < 0 && (data.types[next] === "end" || data.types[next] === "template_end")) {
        indent = indent - 1;
      }
    }
    function attribute() {
      function attributeName(x) {
        const eq = x.indexOf("=");
        if (eq > 0 && (eq < x.indexOf('"') && x.indexOf('"') > 0 || eq < x.indexOf("'") && x.indexOf("'") > 0)) {
          return [
            x.slice(0, eq),
            x.slice(eq + 1)
          ];
        }
        return [x, ""];
      }
      function attributeValues(input) {
        const attr = attributeName(input);
        if (attr[1] === "") {
          return input;
        } else if (options2.markup.attributeValues === "preserve") {
          return attr[0] + "=" + attr[1];
        } else if (options2.markup.attributeValues === "strip") {
          return attr[0].trimStart() + "=" + attr[1].replace(/\s+/g, " ").replace(/^["']\s+/, '"');
        }
        const m = options2.markup.attributeValues === "collapse" || options2.markup.attributeValues === "wrap" ? attr[1].replace(/\s+/g, " ") : attr[1].replace(/\s+/g, (x) => /\n/.test(x) ? "\n" : x.replace(/\s+/, " "));
        const attarr = [];
        const wrp = options2.wrap > 0 ? attr[1].length > options2.wrap : false;
        let vi = 0;
        let vt = "";
        let nt = 0;
        do {
          if (is(m[vi], 123 /* LCB */) && (is(m[vi + 1], 123 /* LCB */) || is(m[vi + 1], 37 /* PER */))) {
            nt = (is(m[vi + 1], 37 /* PER */) ? m.indexOf("%}", vi + 1) : m.indexOf("}}", vi + 1)) + 2;
            vt = m.slice(vi, nt);
            vi = nt;
            attarr.push(vt);
          } else {
            if (m[vi] === " ") {
              if (options2.markup.attributeValues === "collapse") {
                attarr.push("\n");
              } else if (options2.markup.attributeValues === "wrap") {
                if (wrp)
                  attarr.push("\n");
              }
            }
            attarr.push(m[vi]);
            vi = vi + 1;
          }
        } while (vi < m.length);
        return attr[0] + "=" + attarr.join("");
      }
      const parent = a - 1;
      function wrap(index) {
        if (type.is(index, "attribute") || type.idx(index, "template_attribute") > -1) {
          data.token[index] = attributeValues(data.token[index]);
          return;
        }
        const item = data.token[index].replace(/\s+/g, " ").split(" ");
        const ilen = item.length;
        let bb = 1;
        let acount = item[0].length;
        do {
          if (acount + item[bb].length > options2.wrap) {
            acount = item[bb].length;
            item[bb] = lf + item[bb];
          } else {
            item[bb] = ` ${item[bb]}`;
            acount = acount + item[bb].length;
          }
          bb = bb + 1;
        } while (bb < ilen);
        data.token[index] = item.join("");
      }
      let w = a;
      let plural = false;
      let earlyexit = false;
      let attStart = false;
      let len = data.token[parent].length + 1;
      let lev = (() => {
        if (type.idx(a, "start") > 0) {
          let x = a;
          do {
            if (data.types[x].indexOf("end") > 0 && data.begin[x] === a) {
              if (x < c - 1 && type.idx(x + 1, "attribute") > -1) {
                plural = true;
                break;
              }
            }
            x = x + 1;
          } while (x < c);
        } else if (a < c - 1 && type.idx(a + 1, "attribute") > -1) {
          plural = true;
        }
        if (type.is(next, "end") || type.is(next, "template_end")) {
          return indent + (type.is(parent, "singleton") ? 2 : 1);
        }
        if (type.is(parent, "singleton")) {
          return indent + 1;
        }
        return indent;
      })();
      if (plural === false && type.is(a, "comment_attribute")) {
        level.push(indent);
        if (data.types[parent] === "singleton") {
          level[parent] = indent + 1;
        } else {
          level[parent] = indent;
        }
        return;
      }
      if (lev < 1)
        lev = 1;
      do {
        count = count + data.token[a].length + 1;
        if (data.types[a].indexOf("attribute") > 0) {
          if (data.types[a] === "template_attribute_start") {
            if (options2.markup.preserveAttributes === true) {
              level.push(-10);
            } else {
              do {
                len = len + data.token[a].length + 1;
                if (data.types[a] === "template_attribute_end")
                  break;
                if (options2.markup.attributeChain === "inline") {
                  level.push(-20);
                } else if (options2.markup.attributeChain === "collapse") {
                  level.push(lev);
                } else if (options2.markup.attributeChain === "preserve") {
                  if (data.lines[a] === 0) {
                    level.push(-20);
                  } else if (data.lines[a] === 1) {
                    level.push(-10);
                  } else if (data.lines[a] > options2.preserveLine) {
                    level.push(options2.preserveLine);
                  } else {
                    level.push(lev);
                  }
                }
                a = a + 1;
                count = count + data.token[a].length + 1;
              } while (a < c);
              if (len > options2.wrap) ;
            }
          } else if (data.types[a] === "template_attribute") {
            level.push(-10);
          } else if (data.types[a] === "comment_attribute") {
            level.push(lev);
          } else if (data.types[a].indexOf("start") > 0) {
            attStart = true;
            if (a < c - 2 && data.types[a + 2].indexOf("attribute") > 0) {
              level.push(-20);
              a = a + 1;
              externalIndex[a] = a;
            } else {
              if (parent === a - 1 && plural === false) {
                level.push(lev);
              } else {
                level.push(lev + 1);
              }
              if (data.lexer[a + 1] !== lexer) {
                a = a + 1;
                external();
              }
            }
          } else if (data.types[a].indexOf("end") > 0 && data.types[a].indexOf("template") < 0) {
            if (level[a - 1] !== -20)
              level[a - 1] = level[data.begin[a]] - 1;
            if (data.lexer[a + 1] !== lexer) {
              level.push(-20);
            } else {
              level.push(lev);
            }
          } else {
            level.push(lev);
          }
          earlyexit = true;
        } else if (type.is(a, "attribute")) {
          len = len + data.token[a].length + 1;
          if (options2.markup.preserveAttributes === true) {
            level.push(-10);
          } else if (options2.markup.forceAttribute === true || options2.markup.forceAttribute >= 1 || attStart === true || a < c - 1 && type.not(a + 1, "template_attribute") && type.idx(a + 1, "attribute") > 0) {
            level.push(lev);
          } else {
            level.push(-10);
          }
        } else if (data.begin[a] < parent + 1) {
          break;
        }
        a = a + 1;
      } while (a < c);
      a = a - 1;
      if (level[a - 1] > 0 && type.idx(a, "end") > 0 && type.idx(a, "attribute") > 0 && type.not(parent, "singleton") && plural === true) {
        level[a - 1] = level[a - 1] - 1;
      }
      if (level[a] !== -20) {
        if (options2.language === "jsx" && type.idx(parent, "start") > -1 && type.is(a + 1, "script_start")) {
          level[a] = lev;
        } else {
          level[a] = level[parent];
        }
      }
      if (options2.markup.forceAttribute === true) {
        count = 0;
        level[parent] = lev;
      } else if (options2.markup.forceAttribute >= 1) {
        if (level.length > options2.markup.forceAttribute) {
          level[parent] = lev;
        } else {
          level[parent] = -10;
        }
      } else {
        level[parent] = -10;
      }
      if (earlyexit === true || options2.markup.preserveAttributes === true || token.is(parent, "<%xml%>") || token.is(parent, "<?xml?>")) {
        count = 0;
        return;
      }
      w = a;
      if (w > parent + 1) {
        if (options2.markup.selfCloseSpace === false)
          len = len - 1;
        if (len > options2.wrap && options2.wrap > 0 && options2.markup.forceAttribute === false) {
          count = data.token[a].length;
          do {
            if (data.token[w].length > options2.wrap && /\s/.test(data.token[w]))
              wrap(w);
            level[w] = lev;
            w = w - 1;
          } while (w > parent);
        }
      } else if (options2.wrap > 0 && type.is(a, "attribute") && data.token[a].length > options2.wrap && /\s/.test(data.token[a])) {
        wrap(a);
      }
    }
    do {
      if (data.lexer[a] === lexer) {
        if (data.token[a].toLowerCase().indexOf("<!doctype") === 0)
          level[a - 1] = indent;
        if (data.types[a].indexOf("attribute") > -1) {
          attribute();
        } else if (type.is(a, "comment")) {
          if (comstart < 0)
            comstart = a;
          if (type.not(a + 1, "comment") || a > 0 && type.idx(a - 1, "end") > -1)
            comment2();
        } else if (type.not(a, "comment")) {
          next = nextIndex();
          if (type.is(next, "end") || type.is(next, "template_end")) {
            indent = indent - 1;
            if (type.is(next, "template_end") && type.is(data.begin[next] + 1, "template_else")) {
              indent = indent - 1;
            }
            if (token.is(a, "</ol>") || token.is(a, "</ul>") || token.is(a, "</dl>")) {
              anchorList();
            }
          }
          if (type.is(a, "script_end") && type.is(a + 1, "end")) {
            if (data.lines[a + 1] < 1) {
              level.push(-20);
            } else {
              level.push(-10);
            }
          } else if ((options2.markup.forceIndent === false || options2.markup.forceIndent && type.is(next, "script_start")) && (type.is(a, "content") || type.is(a, "singleton") || type.is(a, "template"))) {
            count = count + data.token[a].length;
            if (type.is(a, "template")) {
              level.push(indent);
              const pos = data.token[a].indexOf(lf);
              if (pos > 0) {
                const linez = level[a - 1] * options2.indentSize + (data.token[a].charCodeAt(2) === 45 ? options2.indentSize : options2.indentSize - 1);
                const linesout = [];
                let iidx = 0;
                do {
                  linesout.push(" ");
                  iidx = iidx + 1;
                } while (iidx < linez);
                data.token[a] = data.token[a].replace(/^\s+/gm, "").replace(/\n/g, (n) => {
                  return n + linesout.join("");
                });
              }
            } else if (data.lines[next] > 0 && type.is(next, "script_start")) {
              level.push(-10);
            } else if (options2.wrap > 0 && (type.idx(a, "template") < 0 || next < c && type.idx(a, "template") > -1 && type.idx(a, "template") < 0)) {
              content();
            } else if (next < c && (type.idx(next, "end") > -1 || type.idx(next, "start") > -1) && (data.lines[next] > 0 || type.idx(a, "template_") > -1)) {
              level.push(indent);
            } else if (data.lines[next] === 0) {
              level.push(-20);
            } else {
              level.push(indent);
            }
          } else if (type.is(a, "start") || type.is(a, "template_start")) {
            indent = indent + 1;
            if (type.is(a, "template_start") && type.is(a + 1, "template_else")) {
              indent = indent + 1;
            }
            if (options2.language === "jsx" && token.is(a + 1, "{")) {
              if (data.lines[a + 1] === 0) {
                level.push(-20);
              } else {
                level.push(-10);
              }
            } else if (type.is(a, "start") && type.is(next, "end")) {
              level.push(-20);
            } else if (type.is(a, "start") && type.is(next, "script_start")) {
              level.push(-10);
            } else if (options2.markup.forceIndent === true) {
              level.push(indent);
            } else if (type.is(a, "template_start") && type.is(next, "template_end")) {
              level.push(-20);
            } else if (data.lines[next] === 0 && (type.is(next, "content") || type.is(next, "singleton") || type.is(next, "start") && type.is(next, "template"))) {
              level.push(-20);
            } else {
              level.push(indent);
            }
          } else if (options2.markup.forceIndent === false && data.lines[next] === 0 && (type.is(next, "content") || type.is(next, "singleton"))) {
            level.push(-20);
          } else if (type.is(a + 2, "script_end")) {
            level.push(-20);
          } else if (type.is(a, "template_else")) {
            if (type.is(next, "template_end")) {
              level[a - 1] = indent + 1;
            } else {
              level[a - 1] = indent - 1;
            }
            level.push(indent);
          } else {
            level.push(indent);
          }
        }
        if (type.not(a, "content") && type.not(a, "singleton") && type.not(a, "template") && type.not(a, "attribute")) {
          count = 0;
        }
      } else {
        count = 0;
        external();
      }
      a = a + 1;
    } while (a < c);
    return level;
  })();
  return (() => {
    const build = [];
    const ind = (() => {
      const indy = [options2.indentChar];
      const size2 = options2.indentSize - 1;
      let aa = 0;
      if (aa < size2) {
        do {
          indy.push(options2.indentChar);
          aa = aa + 1;
        } while (aa < size2);
      }
      return indy.join("");
    })();
    function newline(tabs) {
      const linesout = [];
      const pres = options2.preserveLine + 1;
      const total = Math.min(data.lines[a + 1] - 1, pres);
      let index = 0;
      if (tabs < 0)
        tabs = 0;
      do {
        linesout.push(lf);
        index = index + 1;
      } while (index < total);
      if (tabs > 0) {
        index = 0;
        do {
          linesout.push(ind);
          index = index + 1;
        } while (index < tabs);
      }
      return linesout.join("");
    }
    function multiline() {
      let lines = data.token[a].split(lf);
      const line = data.lines[a + 1];
      if (type.is(a, "comment"))
        lines = lines.map((l) => l.trimStart());
      const lev = levels[a - 1] > -1 ? type.is(a, "attribute") ? levels[a - 1] + 1 : levels[a - 1] : (() => {
        let bb = a - 1;
        let start = bb > -1 && type.idx(bb, "start") > -1;
        if (levels[a] > -1 && type.is(a, "attribute")) {
          return levels[a] + 1;
        }
        do {
          bb = bb - 1;
          if (levels[bb] > -1) {
            if (type.is(a, "content") && start === false) {
              return levels[bb];
            } else {
              return levels[bb] + 1;
            }
          }
          if (type.idx(bb, "start") > -1)
            start = true;
        } while (bb > 0);
        return 1;
      })();
      data.lines[a + 1] = 0;
      let aa = 0;
      const len = lines.length - 1;
      do {
        if (type.is(a, "comment")) {
          if (lines[aa] !== "") {
            if (lines[aa + 1].trimStart() !== "") {
              build.push(lines[aa], newline(lev));
            } else {
              build.push(lines[aa], "\n");
            }
          } else {
            if (lines[aa + 1].trimStart() === "") {
              build.push("\n");
            } else {
              build.push(newline(lev));
            }
          }
        } else {
          build.push(lines[aa], newline(lev));
        }
        aa = aa + 1;
      } while (aa < len);
      data.lines[a + 1] = line;
      build.push(lines[len]);
      if (levels[a] === -10) {
        build.push(" ");
      } else if (levels[a] > -1) {
        build.push(newline(levels[a]));
      }
    }
    function attributeEnd() {
      const parent = data.token[a];
      const regend = /(\/|\?)?>$/;
      const end = regend.exec(parent);
      let y = a + 1;
      let jsx = false;
      let space = options2.markup.selfCloseSpace === true && end !== null && end[0] === "/>" ? " " : "";
      if (end === null)
        return;
      data.token[a] = parent.replace(regend, "");
      do {
        if (type.is(y, "jsx_attribute_end") && data.begin[data.begin[y]] === a) {
          jsx = false;
        } else if (data.begin[y] === a) {
          if (type.is(y, "jsx_attribute_start")) {
            jsx = true;
          } else if (type.idx(y, "attribute") < 0 && jsx === false) {
            break;
          }
        } else if (jsx === false && (data.begin[y] < a || type.idx(y, "attribute") < 0)) {
          break;
        }
        y = y + 1;
      } while (y < c);
      if (type.is(y - 1, "comment_attribute"))
        space = newline(levels[y - 2] - 1);
      data.token[y - 1] = data.token[y - 1] + space + end[0];
      if (type.is(y, "comment") && data.lines[a + 1] < 2)
        levels[a] = -10;
    }
    a = prettify.start;
    let ext = "";
    let lastLevel;
    lastLevel = options2.indentLevel;
    do {
      if (data.lexer[a] === lexer) {
        if ((type.is(a, "start") || type.is(a, "singleton") || type.is(a, "xml") || type.is(a, "sgml")) && type.idx(a, "attribute") < 0 && a < c - 1 && data.types[a + 1] !== void 0 && type.idx(a + 1, "attribute") > -1) {
          attributeEnd();
        }
        if (token.not(a, void 0) && data.token[a].indexOf(lf) > 0 && (type.is(a, "content") && options2.markup.preserveText === false || type.is(a, "comment") || type.is(a, "attribute"))) {
          multiline();
        } else {
          build.push(data.token[a]);
          if (levels[a] === -10 && a < c - 1) {
            build.push(" ");
          } else if (levels[a] > -1) {
            build.push(newline(levels[a]));
            lastLevel = levels[a];
          }
        }
      } else {
        if (externalIndex[a] === a && type.not(a, "reference")) {
          build.push(data.token[a]);
        } else {
          prettify.end = externalIndex[a];
          prettify.start = a;
          options2.indentLevel = lastLevel;
          ext = prettify.beautify[data.lexer[a]](options2).replace(/\s+$/, "");
          build.push(ext);
          if (levels[prettify.iterator] > -1 && externalIndex[a] > a) {
            build.push(newline(levels[prettify.iterator]));
          }
          a = prettify.iterator;
          options2.indentLevel = 0;
        }
      }
      a = a + 1;
    } while (a < c);
    prettify.iterator = c - 1;
    if (build[0] === lf || build[0] === " ")
      build[0] = "";
    return build.join("");
  })();
};

// src/beautify/style.ts
prettify.beautify.style = function style2(options2) {
  const build = [];
  const data = prettify.parsed;
  const lf = options2.crlf === true ? "\r\n" : "\n";
  const len = prettify.end > 0 ? prettify.end + 1 : data.token.length;
  const tab = function beautify_style_tab() {
    let aa = 0;
    const bb = [];
    do {
      bb.push(options2.indentChar);
      aa = aa + 1;
    } while (aa < options2.indentSize);
    return bb.join("");
  }();
  const pres = options2.preserveLine + 1;
  let indent = options2.indentLevel;
  let a = prettify.start;
  let when = ["", ""];
  const nl = function beautify_style_nl(tabs) {
    const linesout = [];
    const total = function beautify_style_nl_total() {
      if (a === len - 1) {
        return 1;
      }
      if (data.lines[a + 1] - 1 > pres) {
        return pres;
      }
      if (data.lines[a + 1] > 1) {
        return data.lines[a + 1] - 1;
      }
      return 1;
    }();
    let index = 0;
    if (tabs < 0)
      tabs = 0;
    do {
      linesout.push(lf);
      index = index + 1;
    } while (index < total);
    if (tabs > 0) {
      index = 0;
      do {
        linesout.push(tab);
        index = index + 1;
      } while (index < tabs);
    }
    build.push(linesout.join(""));
  };
  const vertical = function beautify_style_vertical() {
    const start = data.begin[a];
    const startChar = data.token[start];
    const endChar = data.token[a];
    const store = [];
    let b = a;
    let c = 0;
    let item;
    let longest = 0;
    if (start < 0 || b <= start)
      return;
    do {
      b = b - 1;
      if (data.begin[b] === start) {
        if (data.token[b] === ":") {
          item = [b - 1, 0];
          do {
            b = b - 1;
            if ((data.token[b] === ";" && startChar === "{" || data.token[b] === "," && startChar === "(") && data.begin[b] === start || data.token[b] === endChar && data.begin[data.begin[b]] === start) {
              break;
            }
            if (data.types[b] !== "comment" && data.types[b] !== "selector" && data.token[b] !== startChar && data.begin[b] === start) {
              item[1] = data.token[b].length + item[1];
            }
          } while (b > start + 1);
          if (item[1] > longest)
            longest = item[1];
          store.push(item);
        }
      } else if (data.types[b] === "end") {
        if (b < data.begin[b])
          break;
        b = data.begin[b];
      }
    } while (b > start);
    b = store.length;
    if (b < 2)
      return;
    do {
      b = b - 1;
      if (store[b][1] < longest) {
        c = store[b][1];
        do {
          data.token[store[b][0]] = data.token[store[b][0]] + " ";
          c = c + 1;
        } while (c < longest);
      }
    } while (b > 0);
  };
  if (options2.script.vertical === true && options2.style.compressCSS === false) {
    a = len;
    do {
      a = a - 1;
      if (data.token[a] === "}" || data.token[a] === ")")
        vertical();
    } while (a > 0);
    a = prettify.start;
  }
  do {
    if (data.types[a + 1] === "end" || data.types[a + 1] === "template_end" || data.types[a + 1] === "template_else") {
      indent = indent - 1;
    }
    if (data.types[a] === "template" && data.lines[a] > 0) {
      build.push(data.token[a]);
      if (data.types[a - 2] !== "property" && data.types[a - 1] !== "colon")
        nl(indent);
    } else if (data.types[a] === "template_else") {
      build.push(data.token[a]);
      indent = indent + 1;
      nl(indent);
    } else if (data.types[a] === "start" || data.types[a] === "template_start") {
      indent = indent + 1;
      build.push(data.token[a]);
      if (data.types[a + 1] !== "end" && data.types[a + 1] !== "template_end" && (options2.style.compressCSS === false || options2.style.compressCSS === true && data.types[a + 1] === "selector")) {
        nl(indent);
      }
    } else if (data.token[a] === ";" && (options2.style.compressCSS === false || options2.style.compressCSS === true && data.types[a + 1] === "selector") || data.types[a] === "end" || data.types[a] === "template_end" || data.types[a] === "comment") {
      build.push(data.token[a]);
      if (data.types[a + 1] === "value") {
        if (data.lines[a + 1] === 1) {
          build.push(" ");
        } else if (data.lines[a + 1] > 1) {
          nl(indent);
        }
      } else if (data.types[a + 1] !== "separator") {
        if (data.types[a + 1] !== "comment" || data.types[a + 1] === "comment" && data.lines[a + 1] > 1) {
          nl(indent);
        } else {
          build.push(" ");
        }
      }
    } else if (data.token[a] === ":") {
      build.push(data.token[a]);
      if (options2.style.compressCSS === false)
        build.push(" ");
    } else if (data.types[a] === "selector") {
      if (options2.style.classPadding === true && data.types[a - 1] === "end" && data.lines[a] < 3) {
        build.push(lf);
      }
      if (data.token[a].indexOf("and(") > 0) {
        data.token[a] = data.token[a].replace(/and\(/, "and (");
        build.push(data.token[a]);
      } else if (data.token[a].indexOf("when(") > 0) {
        when = data.token[a].split("when(");
        build.push(when[0].replace(/\s+$/, ""));
        nl(indent + 1);
        build.push(`when (${when[1]}`);
      } else {
        build.push(data.token[a]);
      }
      if (data.types[a + 1] === "start") {
        if (options2.script.braceAllman === true) {
          nl(indent);
        } else if (options2.style.compressCSS === false) {
          build.push(" ");
        }
      }
    } else if (data.token[a] === ",") {
      build.push(data.token[a]);
      if (data.types[a + 1] === "selector" || data.types[a + 1] === "property") {
        nl(indent);
      } else if (options2.style.compressCSS === false) {
        build.push(" ");
      }
    } else if (data.stack[a] === "map" && data.token[a + 1] === ")" && a - data.begin[a] > 5) {
      build.push(data.token[a]);
      nl(indent);
    } else if (data.token[a] === "x;") {
      nl(indent);
    } else if ((data.types[a] === "variable" || data.types[a] === "function") && options2.style.classPadding === true && data.types[a - 1] === "end" && data.lines[a] < 3) {
      build.push(lf);
      build.push(data.token[a]);
    } else if (data.token[a] !== ";" || data.token[a] === ";" && (options2.style.compressCSS === false || options2.style.compressCSS === true && data.token[a + 1] !== "}")) {
      build.push(data.token[a]);
    }
    a = a + 1;
  } while (a < len);
  prettify.iterator = len - 1;
  return build.join("");
};

// src/beautify/script.ts
prettify.beautify.script = function script2(options2) {
  const apiword = /* @__PURE__ */ new Set([
    "ActiveXObject",
    "ArrayBuffer",
    "AudioContext",
    "Canvas",
    "CustomAnimation",
    "DOMParser",
    "DataView",
    "Date",
    "Error",
    "EvalError",
    "FadeAnimation",
    "FileReader",
    "Flash",
    "Float32Array",
    "Float64Array",
    "FormField",
    "Frame",
    "Generator",
    "HotKey",
    "Image",
    "Iterator",
    "Intl",
    "Int16Array",
    "Int32Array",
    "Int8Array",
    "InternalError",
    "Loader",
    "Map",
    "MenuItem",
    "MoveAnimation",
    "Notification",
    "ParallelArray",
    "Point",
    "Promise",
    "Proxy",
    "RangeError",
    "Rectangle",
    "ReferenceError",
    "Reflect",
    "RegExp",
    "ResizeAnimation",
    "RotateAnimation",
    "Set",
    "SQLite",
    "ScrollBar",
    "Set",
    "Shadow",
    "StopIteration",
    "Symbol",
    "SyntaxError",
    "Text",
    "TextArea",
    "Timer",
    "TypeError",
    "URL",
    "Uint16Array",
    "Uint32Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "URIError",
    "WeakMap",
    "WeakSet",
    "Web",
    "Window",
    "XMLHttpRequest"
  ]);
  const externalIndex = create(null);
  const data = prettify.parsed;
  const lexer = "script";
  const scopes = prettify.scopes;
  const b = prettify.end < 1 || prettify.end > data.token.length ? data.token.length : prettify.end + 1;
  const levels = (() => {
    let a = prettify.start;
    let indent = isNaN(options2.indentLevel) ? 0 : Number(options2.indentLevel);
    let notcomment = false;
    let lastlist = false;
    let ctype = "";
    let ctoke = "";
    let ltype = data.types[0];
    let ltoke = data.token[0];
    const varindex = [-1];
    const list = [];
    const level = prettify.start > 0 ? Array(prettify.start).fill(0, 0, prettify.start) : [];
    const ternary = [];
    const extraindent = [[]];
    const arrbreak = [];
    const destruct = [];
    const itemcount = [];
    const assignlist = [false];
    const wordlist = [];
    const count = [];
    function comment2() {
      destructfix(false, false);
      const ind = options2.commentIndent === true ? indent : 0;
      if (notcomment === false && /\/\u002a\s*global\s/.test(data.token[a])) {
        const globallist = data.token[a].replace(/\/\u002a\s*global\s+/, "").replace(/\s*\u002a\/$/, "").split(",");
        let aa = globallist.length;
        do {
          aa = aa - 1;
          globallist[aa] = globallist[aa].replace(/\s+/g, "");
          if (globallist[aa] !== "")
            scopes.push([globallist[aa], -1]);
        } while (aa > 0);
      }
      if (data.types[a - 1] === "comment" || data.types[a + 1] === "comment") {
        level[a - 1] = ind;
      } else if (data.lines[a] < 2) {
        let aa = a + 1;
        if (data.types[aa] === "comment") {
          do {
            aa = aa + 1;
          } while (aa < b && data.types[aa] === "comment");
        }
        if (a < b - 1 && data.stack[aa] !== "block" && (data.token[aa] === "{" || data.token[aa] === "x{")) {
          let bb = scopes.length;
          data.begin.splice(a, 0, data.begin[aa]);
          data.ender.splice(a, 0, data.ender[aa]);
          data.lexer.splice(a, 0, data.lexer[aa]);
          data.lines.splice(a, 0, data.lines[aa]);
          data.stack.splice(a, 0, data.stack[aa]);
          data.token.splice(a, 0, data.token[aa]);
          data.types.splice(a, 0, data.types[aa]);
          if (bb > 0) {
            do {
              bb = bb - 1;
              if (scopes[bb][1] === aa) {
                scopes[bb][1] = a;
              } else if (scopes[bb][1] < a) {
                break;
              }
            } while (bb > 0);
          }
          aa = aa + 1;
          data.begin.splice(aa, 1);
          data.ender.splice(aa, 1);
          data.lexer.splice(aa, 1);
          data.lines.splice(aa, 1);
          data.stack.splice(aa, 1);
          data.token.splice(aa, 1);
          data.types.splice(aa, 1);
          bb = a + 1;
          do {
            data.begin[bb] = a;
            data.stack[bb] = data.stack[aa];
            bb = bb + 1;
          } while (bb < aa);
          bb = bb + 1;
          do {
            if (data.begin[bb] === data.begin[aa]) {
              data.begin[bb] = a;
              if (data.types[bb] === "end") {
                break;
              }
            }
            bb = bb + 1;
          } while (bb < b - 1);
          data.begin[aa] = a;
          a = a - 1;
        } else {
          level[a - 1] = -10;
          if (data.stack[a] === "paren" || data.stack[a] === "method") {
            level.push(indent + 2);
          } else {
            level.push(indent);
          }
          if (options2.commentIndent === true && level[a] > -1 && data.lines[a] < 3) {
            data.lines[a] = 3;
          }
        }
        if (data.types[a + 1] !== "comment")
          notcomment = true;
        return;
      } else if (data.token[a - 1] === ",") {
        level[a - 1] = ind;
      } else if (ltoke === "=" && data.types[a - 1] !== "comment" && /^(\/\*\*\s*@[a-z_]+\s)/.test(ctoke) === true) {
        level[a - 1] = -10;
      } else if (ltoke === "{" && data.types[a - 1] !== "comment" && data.lines[0] < 2) {
        if (data.stack[a] === "function") {
          level[a - 1] = ind;
        } else {
          level[a - 1] = /\n/.test(ctoke) ? ind : -10;
        }
      } else {
        level[a - 1] = ind;
      }
      if (data.types[a + 1] !== "comment")
        notcomment = true;
      if (data.token[data.begin[a]] === "(") {
        level.push(indent + 1);
      } else {
        level.push(indent);
      }
      if (level[a] > -1 && data.lines[a] < 3) {
        if (data.types[a - 1] === "comment" && ctoke.startsWith("//")) {
          data.lines[a] = 2;
        } else {
          data.lines[a] = 3;
        }
      }
      if (options2.script.commentNewline === true && ctoke.startsWith("//") === false && data.lines[a] >= 3) {
        data.lines[a] = 2;
      }
    }
    function destructfix(listFix, override) {
      let c = a - 1;
      let d = listFix === true ? 0 : 1;
      const ei = extraindent[extraindent.length - 1] === void 0 ? [] : extraindent[extraindent.length - 1];
      const arrayCheck = override === false && data.stack[a] === "array" && listFix === true && ctoke !== "[";
      if (destruct[destruct.length - 1] === false || data.stack[a] === "array" && options2.script.arrayFormat === "inline" || data.stack[a] === "object" && options2.script.objectIndent === "inline") {
        return;
      }
      destruct[destruct.length - 1] = false;
      do {
        if (data.types[c] === "end") {
          d = d + 1;
        } else if (data.types[c] === "start") {
          d = d - 1;
        }
        if (data.stack[c] === "global") {
          break;
        }
        if (d === 0) {
          if (data.stack[a] === "class" || data.stack[a] === "map" || arrayCheck === false && (listFix === false && data.token[c] !== "(" && data.token[c] !== "x(" || listFix === true && data.token[c] === ",")) {
            if (data.types[c + 1] === "template_start") {
              if (data.lines[c] < 1) {
                level[c] = -20;
              } else {
                level[c] = indent - 1;
              }
            } else if (ei.length > 0 && ei[ei.length - 1] > -1) {
              level[c] = indent - 1;
            } else {
              level[c] = indent;
            }
          } else if (data.stack[a] === "array" && data.types[a] === "operator") {
            if (data.token[c] === ",")
              level[c] = indent;
            if (c === data.begin[a])
              break;
          }
          if (listFix === false)
            break;
        }
        if (d < 0) {
          if (data.types[c + 1] === "template_start" || data.types[c + 1] === "template_string_start") {
            if (data.lines[c] < 1) {
              level[c] = -20;
            } else {
              level[c] = indent - 1;
            }
          } else if (ei.length > 0 && ei[ei.length - 1] > -1) {
            level[c] = indent - 1;
          } else {
            level[c] = indent;
          }
          break;
        }
        c = c - 1;
      } while (c > -1);
    }
    function end() {
      const ei = extraindent[extraindent.length - 1] === void 0 ? [] : extraindent[extraindent.length - 1];
      const markuplist = () => {
        let aa = a;
        let markup4 = false;
        const begin = data.begin[aa];
        do {
          aa = aa - 1;
          if (data.lexer[aa] === "markup") {
            markup4 = true;
            break;
          }
          if (data.begin[aa] !== begin)
            aa = data.begin[aa];
        } while (aa > begin);
        if (markup4 === true) {
          aa = a;
          do {
            aa = aa - 1;
            if (data.begin[aa] !== begin) {
              aa = data.begin[aa];
            } else if (data.token[aa] === ",") {
              level[aa] = indent + 1;
            }
          } while (aa > begin);
          level[begin] = indent + 1;
          level[a - 1] = indent;
        } else {
          level[a - 1] = -20;
        }
      };
      if (ctoke === ")" && data.token[a + 1] === "." && ei[ei.length - 1] > -1 && data.token[ei[0]] !== ":") {
        let c = data.begin[a];
        let d = false;
        let e = false;
        do {
          c = c - 1;
        } while (c > 0 && level[c] < -9);
        d = level[c] === indent;
        c = a + 1;
        do {
          c = c + 1;
          if (data.token[c] === "{") {
            e = true;
            break;
          }
          if (data.begin[c] === data.begin[a + 1] && (data.types[c] === "separator" || data.types[c] === "end")) {
            break;
          }
        } while (c < b);
        if (d === false && e === true && extraindent.length > 1) {
          extraindent[extraindent.length - 2].push(data.begin[a]);
          indent = indent + 1;
        }
      }
      if (ltype !== "separator")
        fixchain();
      if (data.token[a + 1] === "," && (data.stack[a] === "object" || data.stack[a] === "array")) {
        destructfix(true, false);
      }
      if (data.token[data.begin[a] - 1] === "," && (data.token[a + 1] === "}" || data.token[a + 1] === "]") && (data.stack[a] === "object" || data.stack[a] === "array")) {
        destructfix(true, false);
      }
      if (data.stack[a] !== "attribute") {
        if (ctoke !== ")" && ctoke !== "x)" && (data.lexer[a - 1] !== "markup" || data.lexer[a - 1] === "markup" && data.token[a - 2] !== "return")) {
          indent = indent - 1;
        }
        if (ctoke === "}" && data.stack[a] === "switch" && options2.script.noCaseIndent === false) {
          indent = indent - 1;
        }
      }
      if (ctoke === "}" || ctoke === "x}") {
        if (data.types[a - 1] !== "comment" && ltoke !== "{" && ltoke !== "x{" && ltype !== "end" && ltype !== "string" && ltype !== "number" && ltype !== "separator" && ltoke !== "++" && ltoke !== "--" && (a < 2 || data.token[a - 2] !== ";" || data.token[a - 2] !== "x;" || ltoke === "break" || ltoke === "return")) {
          let c = a - 1;
          let assign2 = false;
          const begin = data.begin[a];
          const listlen = list.length;
          do {
            if (data.begin[c] === begin) {
              if (data.token[c] === "=" || data.token[c] === ";" || data.token[c] === "x;") {
                assign2 = true;
              }
              if (data.token[c] === "." && level[c - 1] > -1) {
                destruct[destruct.length - 1] = false;
                level[begin] = indent + 1;
                level[a - 1] = indent;
                break;
              }
              if (c > 0 && data.token[c] === "return" && (data.token[c - 1] === ")" || data.token[c - 1] === "x)" || data.token[c - 1] === "{" || data.token[c - 1] === "x{" || data.token[c - 1] === "}" || data.token[c - 1] === "x}" || data.token[c - 1] === ";" || data.token[c - 1] === "x;")) {
                indent = indent - 1;
                level[a - 1] = indent;
                break;
              }
              if (data.token[c] === ":" && ternary.length === 0 || data.token[c] === "," && assign2 === false) {
                break;
              }
              if (c === 0 || data.token[c - 1] === "{" || data.token[c - 1] === "x{" || data.token[c] === "for" || data.token[c] === "if" || data.token[c] === "do" || data.token[c] === "function" || data.token[c] === "while" || data.token[c] === "var" || data.token[c] === "let" || data.token[c] === "const" || data.token[c] === "with") {
                if (list[listlen - 1] === false && listlen > 1 && (a === b - 1 || data.token[a + 1] !== ")" && data.token[a + 1] !== "x)") && data.stack[a] !== "object") {
                  indent = indent - 1;
                }
                break;
              }
            } else {
              c = data.begin[c];
            }
            c = c - 1;
          } while (c > begin);
        }
        varindex.pop();
      }
      if (options2.script.bracePadding === false && ctoke !== "}" && ltype !== "markup") {
        level[a - 1] = -20;
      }
      if (options2.script.bracePadding === true && ltype !== "start" && ltoke !== ";" && (level[data.begin[a]] < -9 || destruct[destruct.length - 1] === true)) {
        level[data.begin[a]] = -10;
        level[a - 1] = -10;
        level.push(-20);
      } else if (data.stack[a] === "attribute") {
        level[a - 1] = -20;
        level.push(indent);
      } else if (data.stack[a] === "array" && (ei.length > 0 || arrbreak[arrbreak.length - 1] === true)) {
        endExtraInd();
        destruct[destruct.length - 1] = false;
        level[data.begin[a]] = indent + 1;
        level[a - 1] = indent;
        level.push(-20);
      } else if ((data.stack[a] === "object" || data.begin[a] === 0 && ctoke === "}") && ei.length > 0) {
        endExtraInd();
        destruct[destruct.length - 1] = false;
        level[data.begin[a]] = indent + 1;
        level[a - 1] = indent;
        level.push(-20);
      } else if (ctoke === ")" || ctoke === "x)") {
        const countx = ctoke === ")" && ltoke !== "(" && count.length > 0 ? count.pop() + 1 : 0;
        const countif = data.token[data.begin[a] - 1] === "if" ? (() => {
          let bb = a;
          do {
            bb = bb - 1;
            if (data.token[bb] === ")" && level[bb - 1] > -1)
              return countx;
          } while (bb > data.begin[a]);
          return countx + 5;
        })() : countx;
        if (countx > 0 && (options2.language !== "jsx" || options2.language === "jsx" && data.token[data.begin[a] - 1] !== "render")) {
          const wrap = options2.wrap;
          const begin = data.begin[a];
          const len = count.length;
          let aa = a - 2;
          if (countif > wrap) {
            level[data.begin[a]] = indent + 1;
            level[a - 1] = indent;
            do {
              if (data.begin[aa] === begin) {
                if (data.token[aa] === "&&" || data.token[aa] === "||") {
                  level[aa] = indent + 1;
                } else if (level[aa] > -1 && data.types[aa] !== "comment" && data.token[aa + 1] !== ".") {
                  level[aa] = level[aa] + 1;
                }
              } else if (level[aa] > -1 && data.token[aa + 1] !== ".") {
                level[aa] = level[aa] + 1;
              }
              aa = aa - 1;
            } while (aa > begin);
          } else if (len > 0) {
            count[len - 1] = count[len - 1] + countx;
          }
        } else if (ctoke === ")" && a > data.begin[a] + 2 && data.lexer[data.begin[a] + 1] === lexer && data.token[data.begin[a] + 1] !== "function") {
          const open = data.begin[a] < 0 ? 0 : data.begin[a];
          const wrap = options2.wrap;
          const exl = ei.length;
          let len = 0;
          let aa = 0;
          let short = 0;
          let first = 0;
          let inc = 0;
          let comma = false;
          let array = false;
          let ind = indent + 1;
          let ready = false;
          let mark = false;
          let tern = false;
          if (level[open] < -9) {
            aa = open;
            do {
              aa = aa + 1;
            } while (aa < a && level[aa] < -9);
            first = aa;
            do {
              len = len + data.token[aa].length;
              if (level[aa] === -10)
                len = len + 1;
              if (data.token[aa] === "(" && short > 0 && short < wrap - 1 && first === a) {
                short = -1;
              }
              if (data.token[aa] === ")") {
                inc = inc - 1;
              } else if (data.token[aa] === "(") {
                inc = inc + 1;
              }
              if (aa === open && inc > 0)
                short = len;
              aa = aa - 1;
            } while (aa > open && level[aa] < -9);
            if (data.token[aa + 1] === ".")
              ind = level[aa] + 1;
            if (len > wrap - 1 && wrap > 0 && ltoke !== "(" && short !== -1 && destruct[destruct.length - 2] === false) {
              if (data.token[open - 1] === "if" && list[list.length - 1] === true || data.token[open - 1] !== "if") {
                level[open] = ind;
                if (data.token[open - 1] === "for") {
                  aa = open;
                  do {
                    aa = aa + 1;
                    if (data.token[aa] === ";" && data.begin[aa] === open) {
                      level[aa] = ind;
                    }
                  } while (aa < a);
                }
              }
            }
          }
          aa = a;
          len = 0;
          do {
            aa = aa - 1;
            if (data.stack[aa] === "function") {
              aa = data.begin[aa];
            } else if (data.begin[aa] === open) {
              if (data.token[aa] === "?") {
                tern = true;
              } else if (data.token[aa] === "," && comma === false) {
                comma = true;
                if (len >= wrap && wrap > 0)
                  ready = true;
              } else if (data.types[aa] === "markup" && mark === false) {
                mark = true;
              }
              if (level[aa] > -9 && data.token[aa] !== "," && data.types[aa] !== "markup") {
                len = 0;
              } else {
                if (level[aa] === -10)
                  len = len + 1;
                len = len + data.token[aa].length;
                if (len >= wrap && wrap > 0 && (comma === true || mark === true)) {
                  ready = true;
                }
              }
            } else {
              if (level[aa] > -9) {
                len = 0;
              } else {
                len = len + data.token[aa].length;
                if (len >= wrap && wrap > 0 && (comma === true || mark === true)) {
                  ready = true;
                }
              }
            }
          } while (aa > open && ready === false);
          if (comma === false && data.token[data.begin[a] + 1].charAt(0) === "`") {
            level[data.begin[a]] = -20;
            level[a - 1] = -20;
          } else if ((comma === true || mark === true) && len >= wrap && wrap > 0 || level[open] > -9) {
            if (tern === true) {
              ind = level[open];
              if (data.token[open - 1] === "[") {
                aa = a;
                do {
                  aa = aa + 1;
                  if (data.types[aa] === "end" || data.token[aa] === "," || data.token[aa] === ";") {
                    break;
                  }
                } while (aa < b);
                if (data.token[aa] === "]") {
                  ind = ind - 1;
                  array = true;
                }
              }
            } else if (exl > 0 && ei[exl - 1] > aa) {
              ind = ind - exl;
            }
            destruct[destruct.length - 1] = false;
            aa = a;
            do {
              aa = aa - 1;
              if (data.begin[aa] === open) {
                if (data.token[aa].indexOf("=") > -1 && data.types[aa] === "operator" && data.token[aa].indexOf("!") < 0 && data.token[aa].indexOf("==") < 0 && data.token[aa] !== "<=" && data.token[aa].indexOf(">") < 0) {
                  len = aa;
                  do {
                    len = len - 1;
                    if (data.begin[len] === open && (data.token[len] === ";" || data.token[len] === "," || len === open)) {
                      break;
                    }
                  } while (len > open);
                } else if (data.token[aa] === ",") {
                  level[aa] = ind;
                } else if (level[aa] > -9 && array === false && (data.token[open - 1] !== "for" || data.token[aa + 1] === "?" || data.token[aa + 1] === ":") && (data.token[data.begin[a]] !== "(" || data.token[aa] !== "+")) {
                  level[aa] = level[aa] + 1;
                }
              } else if (level[aa] > -9 && array === false) {
                level[aa] = level[aa] + 1;
              }
            } while (aa > open);
            level[open] = ind;
            level[a - 1] = ind - 1;
          } else {
            level[a - 1] = -20;
          }
          if (data.token[data.begin[a] - 1] === "+" && level[data.begin[a]] > -9) {
            level[data.begin[a] - 1] = -10;
          }
        } else if (options2.language === "jsx") {
          markuplist();
        } else {
          level[a - 1] = -20;
        }
        level.push(-20);
      } else if (destruct[destruct.length - 1] === true) {
        if (ctoke === "]" && data.begin[a] - 1 > 0 && data.token[data.begin[data.begin[a] - 1]] === "[") {
          destruct[destruct.length - 2] = false;
        }
        if (data.begin[a] < level.length)
          level[data.begin[a]] = -20;
        if (options2.language === "jsx") {
          markuplist();
        } else if (ctoke === "]" && level[data.begin[a]] > -1) {
          level[a - 1] = level[data.begin[a]] - 1;
        } else {
          level[a - 1] = -20;
        }
        level.push(-20);
      } else if (data.types[a - 1] === "comment" && data.token[a - 1].substring(0, 2) === "//") {
        if (data.token[a - 2] === "x}")
          level[a - 3] = indent + 1;
        level[a - 1] = indent;
        level.push(-20);
      } else if (data.types[a - 1] !== "comment" && (ltoke === "{" && ctoke === "}" || ltoke === "[" && ctoke === "]")) {
        level[a - 1] = -20;
        level.push(-20);
      } else if (ctoke === "]") {
        if (list[list.length - 1] === true && destruct[destruct.length - 1] === false && options2.script.arrayFormat !== "inline" || ltoke === "]" && level[a - 2] === indent + 1) {
          level[a - 1] = indent;
          level[data.begin[a]] = indent + 1;
        } else if (level[a - 1] === -10) {
          level[a - 1] = -20;
        }
        if (data.token[data.begin[a] + 1] === "function") {
          level[a - 1] = indent;
        } else if (list[list.length - 1] === false) {
          if (ltoke === "}" || ltoke === "x}")
            level[a - 1] = indent;
          let c = a - 1;
          let d = 1;
          do {
            if (data.token[c] === "]")
              d = d + 1;
            if (data.token[c] === "[") {
              d = d - 1;
              if (d === 0) {
                if (c > 0 && (data.token[c + 1] === "{" || data.token[c + 1] === "x{" || data.token[c + 1] === "[")) {
                  level[c] = indent + 1;
                  break;
                }
                if (data.token[c + 1] !== "[" || lastlist === false) {
                  level[c] = -20;
                  break;
                }
                break;
              }
            }
            if (d === 1 && data.token[c] === "+" && level[c] > 1) {
              level[c] = level[c] - 1;
            }
            c = c - 1;
          } while (c > -1);
        } else if (options2.language === "jsx") {
          markuplist();
        }
        if (options2.script.arrayFormat === "inline") {
          let c = a;
          const begin = data.begin[a];
          do {
            c = c - 1;
            if (data.types[c] === "end")
              break;
          } while (c > begin);
          if (c > begin) {
            level[data.begin[a]] = indent + 1;
            level[a - 1] = indent;
          } else {
            level[data.begin[a]] = -20;
            level[a - 1] = -20;
          }
        } else if (level[data.begin[a]] > -1) {
          level[a - 1] = level[data.begin[a]] - 1;
        }
        level.push(-20);
      } else if (ctoke === "}" || ctoke === "x}" || list[list.length - 1] === true) {
        if (ctoke === "}" && ltoke === "x}" && data.token[a + 1] === "else") {
          level[a - 2] = indent + 2;
          level.push(-20);
        } else {
          level.push(indent);
        }
        level[a - 1] = indent;
      } else {
        level.push(-20);
      }
      if (data.types[a - 1] === "comment")
        level[a - 1] = indent;
      if (options2.script.inlineReturn && options2.attemptCorrection === false && ctoke === "x}" && (data.stack[a] === "if" || data.stack[a] === "else") && data.token[data.begin[data.begin[a - 1] - 1] - 2] !== "else") {
        level[a - 1] = -20;
      }
      endExtraInd();
      lastlist = list[list.length - 1];
      list.pop();
      extraindent.pop();
      arrbreak.pop();
      itemcount.pop();
      wordlist.pop();
      destruct.pop();
      assignlist.pop();
    }
    function endExtraInd() {
      let c = 0;
      const ei = extraindent[extraindent.length - 1];
      if (ei === void 0)
        return;
      c = ei.length - 1;
      if (c < 1 && ei[c] < 0 && (ctoke === ";" || ctoke === "x;" || ctoke === ")" || ctoke === "x)" || ctoke === "}" || ctoke === "x}")) {
        ei.pop();
        return;
      }
      if (c < 0 || ei[c] < 0)
        return;
      if (ctoke === ":") {
        if (data.token[ei[c]] !== "?") {
          do {
            ei.pop();
            c = c - 1;
            indent = indent - 1;
          } while (c > -1 && ei[c] > -1 && data.token[ei[c]] !== "?");
        }
        ei[c] = a;
        level[a - 1] = indent;
      } else {
        do {
          ei.pop();
          c = c - 1;
          indent = indent - 1;
        } while (c > -1 && ei[c] > -1);
      }
      if ((data.stack[a] === "array" || ctoke === ",") && ei.length < 1)
        ei.push(-1);
    }
    function external() {
      const skip = a;
      do {
        if (data.lexer[a + 1] === lexer && data.begin[a + 1] < skip)
          break;
        if (data.token[skip - 1] === "return" && data.types[a] === "end" && data.begin[a] === skip)
          break;
        level.push(0);
        a = a + 1;
      } while (a < b);
      externalIndex[skip] = a;
      level.push(indent - 1);
    }
    function fixchain() {
      let bb = a - 1;
      const cc2 = data.begin[a];
      if (indent < 1)
        return;
      do {
        if (cc2 !== data.begin[bb]) {
          bb = data.begin[bb];
        } else {
          if (data.types[bb] === "separator" || data.types[bb] === "operator") {
            if (data.token[bb] === "." && level[bb - 1] > 0) {
              if (data.token[cc2 - 1] === "if") {
                indent = indent - 2;
              } else {
                indent = indent - 1;
              }
            }
            break;
          }
        }
        bb = bb - 1;
      } while (bb > 0 && bb > cc2);
    }
    function markup3() {
      if (data.token[a + 1] !== "," && ctoke.indexOf("/>") !== ctoke.length - 2 || data.token[a + 1] === "," && data.token[data.begin[a] - 3] !== "React") {
        destructfix(false, false);
      }
      if (ltoke === "return" || ltoke === "?" || ltoke === ":") {
        level[a - 1] = -10;
        level.push(-20);
      } else if (ltype === "start" || data.token[a - 2] === "return" && data.stack[a - 1] === "method") {
        level.push(indent);
      } else {
        level.push(-20);
      }
    }
    function operator() {
      const ei = extraindent[extraindent.length - 1] === void 0 ? [] : extraindent[extraindent.length - 1];
      function opWrap() {
        const aa = data.token[a + 1];
        let line = 0;
        let next = 0;
        let c = a;
        let ind = ctoke === "+" ? indent + 2 : indent;
        let meth = 0;
        if (options2.wrap < 1) {
          level.push(-10);
          return;
        }
        do {
          c = c - 1;
          if (data.token[data.begin[a]] === "(") {
            if (c === data.begin[a]) {
              meth = line;
            }
            if (data.token[c] === "," && data.begin[c] === data.begin[a] && list[list.length - 1] === true) {
              break;
            }
          }
          if (line > options2.wrap - 1)
            break;
          if (level[c] > -9)
            break;
          if (data.types[c] === "operator" && data.token[c] !== "=" && data.token[c] !== "+" && data.begin[c] === data.begin[a]) {
            break;
          }
          line = line + data.token[c].length;
          if (c === data.begin[a] && data.token[c] === "[" && line < options2.wrap - 1) {
            break;
          }
          if (data.token[c] === "." && level[c] > -9)
            break;
          if (level[c] === -10)
            line = line + 1;
        } while (c > 0);
        if (meth > 0)
          meth = meth + aa.length;
        line = line + aa.length;
        next = c;
        if (line > options2.wrap - 1 && level[c] < -9) {
          do {
            next = next - 1;
          } while (next > 0 && level[next] < -9);
        }
        if (data.token[next + 1] === "." && data.begin[a] <= data.begin[next]) {
          ind = ind + 1;
        } else if (data.types[next] === "operator") {
          ind = level[next];
        }
        next = aa.length;
        if (line + next < options2.wrap) {
          level.push(-10);
          return;
        }
        if (data.token[data.begin[a]] === "(" && (data.token[ei[0]] === ":" || data.token[ei[0]] === "?")) {
          ind = indent + 3;
        } else if (data.stack[a] === "method") {
          level[data.begin[a]] = indent;
          if (list[list.length - 1] === true) {
            ind = indent + 3;
          } else {
            ind = indent + 1;
          }
        } else if (data.stack[a] === "object" || data.stack[a] === "array") {
          destructfix(true, false);
        }
        if (data.token[c] === "var" || data.token[c] === "let" || data.token[c] === "const") {
          line = line - options2.indentSize * options2.indentChar.length * 2;
        }
        if (meth > 0) {
          c = options2.wrap - meth;
        } else {
          c = options2.wrap - line;
        }
        if (c > 0 && c < 5) {
          level.push(ind);
          if (data.token[a].charAt(0) === '"' || data.token[a].charAt(0) === "'") {
            a = a + 1;
            level.push(-10);
          }
          return;
        }
        if (data.token[data.begin[a]] !== "(" || meth > options2.wrap - 1 || meth === 0) {
          if (meth > 0)
            line = meth;
          if (line - aa.length < options2.wrap - 1 && (aa.charAt(0) === '"' || aa.charAt(0) === "'")) {
            a = a + 1;
            line = line + 3;
            if (line - aa.length > options2.wrap - 4) {
              level.push(ind);
              return;
            }
            level.push(-10);
            return;
          }
          level.push(ind);
          return;
        }
        level.push(-10);
      }
      fixchain();
      if (ei.length > 0 && ei[ei.length - 1] > -1 && data.stack[a] === "array") {
        arrbreak[arrbreak.length - 1] = true;
      }
      if (ctoke !== ":") {
        if (data.token[data.begin[a]] !== "(" && data.token[data.begin[a]] !== "x(" && destruct.length > 0) {
          destructfix(true, false);
        }
        if (ctoke !== "?" && data.token[ei[ei.length - 1]] === ".") {
          let e = 0;
          let c = a;
          const d = data.begin[c];
          do {
            if (data.begin[c] === d) {
              if (data.token[c + 1] === "{" || data.token[c + 1] === "[" || data.token[c] === "function") {
                break;
              }
              if (data.token[c] === "," || data.token[c] === ";" || data.types[c] === "end" || data.token[c] === ":") {
                ei.pop();
                indent = indent - 1;
                break;
              }
              if (data.token[c] === "?" || data.token[c] === ":") {
                if (data.token[ei[ei.length - 1]] === "." && e < 2)
                  ei[ei.length - 1] = d + 1;
                break;
              }
              if (data.token[c] === ".")
                e = e + 1;
            }
            c = c + 1;
          } while (c < b);
        }
      }
      if (ctoke === "!" || ctoke === "...") {
        if (ltoke === "}" || ltoke === "x}")
          level[a - 1] = indent;
        level.push(-20);
        return;
      }
      if (ltoke === ";" || ltoke === "x;") {
        if (data.token[data.begin[a] - 1] !== "for")
          level[a - 1] = indent;
        level.push(-20);
        return;
      }
      if (ctoke === "*") {
        if (ltoke === "function" || ltoke === "yield") {
          level[a - 1] = -20;
        } else {
          level[a - 1] = -10;
        }
        level.push(-10);
        return;
      }
      if (ctoke === "?") {
        if (data.lines[a] === 0 && data.types[a - 2] === "word" && data.token[a - 2] !== "return" && data.token[a - 2] !== "in" && data.token[a - 2] !== "instanceof" && data.token[a - 2] !== "typeof" && (ltype === "reference" || ltype === "word")) {
          if (data.types[a + 1] === "word" || data.types[a + 1] === "reference" || (data.token[a + 1] === "(" || data.token[a + 1] === "x(") && data.token[a - 2] === "new") {
            level[a - 1] = -20;
            if (data.types[a + 1] === "word" || data.types[a + 1] === "reference") {
              level.push(-10);
              return;
            }
            level.push(-20);
            return;
          }
        }
        if (data.token[a + 1] === ":") {
          level[a - 1] = -20;
          level.push(-20);
          return;
        }
        ternary.push(a);
        if (options2.script.ternaryLine === true) {
          level[a - 1] = -10;
        } else {
          let c = a - 1;
          do {
            c = c - 1;
          } while (c > -1 && level[c] < -9);
          ei.push(a);
          indent = indent + 1;
          if (level[c] === indent && data.token[c + 1] !== ":") {
            indent = indent + 1;
            ei.push(a);
          }
          level[a - 1] = indent;
          if (data.token[data.begin[a]] === "(" && (ei.length < 2 || ei[0] === ei[1])) {
            destruct[destruct.length - 1] = false;
            if (a - 2 === data.begin[a]) {
              level[data.begin[a]] = indent - 1;
            } else {
              level[data.begin[a]] = indent;
            }
            c = a - 2;
            do {
              if (data.types[c] === "end" && level[c - 1] > -1)
                break;
              if (level[c] > -1)
                level[c] = level[c] + 1;
              c = c - 1;
            } while (c > data.begin[a]);
          }
        }
        level.push(-10);
        return;
      }
      if (ctoke === ":") {
        if (data.stack[a] === "map" || data.types[a + 1] === "type" || data.types[a + 1] === "type_start") {
          level[a - 1] = -20;
          level.push(-10);
          return;
        }
        if (ternary.length > 0 && data.begin[ternary[ternary.length - 1]] === data.begin[a]) {
          let c = a;
          const d = data.begin[a];
          do {
            c = c - 1;
            if (data.begin[c] === d) {
              if (data.token[c] === "," || data.token[c] === ";") {
                level[a - 1] = -20;
                break;
              }
              if (data.token[c] === "?") {
                ternary.pop();
                endExtraInd();
                if (options2.script.ternaryLine === true)
                  level[a - 1] = -10;
                level.push(-10);
                return;
              }
            } else if (data.types[c] === "end") {
              c = data.begin[c];
            }
          } while (c > d);
        }
        if (data.token[a - 2] === "where" && data.stack[a - 2] === data.stack[a]) {
          level[a - 1] = -10;
          level.push(-10);
          return;
        }
        if (ltype === "reference" && data.token[data.begin[a]] !== "(" && data.token[data.begin[a]] !== "x(") {
          level[a - 1] = -20;
          level.push(-10);
          return;
        }
        if ((ltoke === ")" || ltoke === "x)") && data.token[data.begin[a - 1] - 2] === "function") {
          level[a - 1] = -20;
          level.push(-10);
          return;
        }
        if (data.stack[a] === "attribute") {
          level[a - 1] = -20;
          level.push(-10);
          return;
        }
        if (data.token[data.begin[a]] !== "(" && data.token[data.begin[a]] !== "x(" && (ltype === "reference" || ltoke === ")" || ltoke === "]" || ltoke === "?") && (data.stack[a] === "map" || data.stack[a] === "class" || data.types[a + 1] === "reference") && (ternary.length === 0 || ternary[ternary.length - 1] < data.begin[a]) && ("mapclassexpressionmethodglobalparen".indexOf(data.stack[a]) > -1 || data.types[a - 2] === "word" && data.stack[a] !== "switch")) {
          level[a - 1] = -20;
          level.push(-10);
          return;
        }
        if (data.stack[a] === "switch" && (ternary.length < 1 || ternary[ternary.length - 1] < data.begin[a])) {
          level[a - 1] = -20;
          if (options2.script.caseSpace === true) {
            level.push(-10);
          } else {
            level.push(indent);
          }
          return;
        }
        if (data.stack[a] === "object") {
          level[a - 1] = -20;
        } else if (ternary.length > 0) {
          level[a - 1] = indent;
        } else {
          level[a - 1] = -10;
        }
        level.push(-10);
        return;
      }
      if (ctoke === "++" || ctoke === "--") {
        if (ltype === "number" || ltype === "reference") {
          level[a - 1] = -20;
          level.push(-10);
        } else if (a < b - 1 && (data.types[a + 1] === "number" || data.types[a + 1] === "reference")) {
          level.push(-20);
        } else {
          level.push(-10);
        }
        return;
      }
      if (ctoke === "+") {
        if (ltype === "start") {
          level[a - 1] = -20;
        } else {
          level[a - 1] = -10;
        }
        if (options2.wrap < 1 || data.token[data.begin[a]] === "x(") {
          level.push(-10);
          return;
        }
        const aa = data.token[a + 1];
        if (aa === void 0) {
          level.push(-10);
          return;
        }
        if (data.types[a - 1] === "operator" || data.types[a - 1] === "start") {
          if (data.types[a + 1] === "reference" || aa === "(" || aa === "[") {
            level.push(-20);
            return;
          }
          if (Number(aa.slice(1, -1)) > -1 && (/\d/.test(aa.charAt(1)) === true || aa.charAt(1) === "." || aa.charAt(1) === "-" || aa.charAt(1) === "+")) {
            level.push(-20);
            return;
          }
        }
        return opWrap();
      }
      if (data.types[a - 1] !== "comment") {
        if (ltoke === "(") {
          level[a - 1] = -20;
        } else if (ctoke === "*" && data.stack[a] === "object" && data.types[a + 1] === "reference" && (ltoke === "{" || ltoke === ",")) {
          level[a - 1] = indent;
        } else if (ctoke !== "?" || ternary.length === 0) {
          level[a - 1] = -10;
        }
      }
      if (ctoke.indexOf("=") > -1 && ctoke !== "==" && ctoke !== "===" && ctoke !== "!=" && ctoke !== "!==" && ctoke !== ">=" && ctoke !== "<=" && ctoke !== "=>" && data.stack[a] !== "method" && data.stack[a] !== "object") {
        let c = a + 1;
        let d = 0;
        let e = false;
        let f = "";
        if ((data.token[data.begin[a]] === "(" || data.token[data.begin[a]] === "x(") && data.token[a + 1] !== "function") {
          return;
        }
        do {
          if (data.types[c] === "start") {
            if (e === true && data.token[c] !== "[") {
              if (assignlist[assignlist.length - 1] === true) {
                assignlist[assignlist.length - 1] = false;
              }
              break;
            }
            d = d + 1;
          }
          if (data.types[c] === "end")
            d = d - 1;
          if (d < 0) {
            if (assignlist[assignlist.length - 1] === true) {
              assignlist[assignlist.length - 1] = false;
            }
            break;
          }
          if (d === 0) {
            f = data.token[c];
            if (e === true) {
              if (data.types[c] === "operator" || data.token[c] === ";" || data.token[c] === "x;" || data.token[c] === "?" || data.token[c] === "var" || data.token[c] === "let" || data.token[c] === "const") {
                if (f !== void 0 && (f === "?" || f.indexOf("=") > -1 && f !== "==" && f !== "===" && f !== "!=" && f !== "!==" && f !== ">=" && f !== "<=")) {
                  if (assignlist[assignlist.length - 1] === false) {
                    assignlist[assignlist.length - 1] = true;
                  }
                }
                if ((f === ";" || f === "x;" || f === "var" || f === "let" || f === "const") && assignlist[assignlist.length - 1] === true) {
                  assignlist[assignlist.length - 1] = false;
                }
                break;
              }
              if (assignlist[assignlist.length - 1] === true && (f === "return" || f === "break" || f === "continue" || f === "throw")) {
                assignlist[assignlist.length - 1] = false;
              }
            }
            if (f === ";" || f === "x;" || f === ",")
              e = true;
          }
          c = c + 1;
        } while (c < b);
        level.push(-10);
        return;
      }
      if (ctoke === "-" && ltoke === "return" || ltoke === "=") {
        level.push(-20);
        return;
      }
      if (ltype === "operator" && data.types[a + 1] === "reference" && ltoke !== "--" && ltoke !== "++" && ctoke !== "&&" && ctoke !== "||") {
        level.push(-20);
        return;
      }
      return opWrap();
    }
    function reference2() {
      const hoist = () => {
        let func = data.begin[a];
        if (func < 0) {
          scopes.push([data.token[a], -1]);
        } else {
          if (data.stack[func + 1] !== "function") {
            do {
              func = data.begin[func];
            } while (func > -1 && data.stack[func + 1] !== "function");
          }
          scopes.push([data.token[a], func]);
        }
      };
      if (data.types[a - 1] === "comment") {
        level[a - 1] = indent;
      } else if (ltype === "end" && ltoke !== ")" && data.token[data.begin[a - 1] - 1] !== ")") {
        level[a - 1] = -10;
      } else if (ltype !== "separator" && ltype !== "start" && ltype !== "end" && ltype.indexOf("template_string") < 0) {
        if (ltype === "word" || ltype === "operator" || ltype === "property" || ltype === "type" || ltype === "reference") {
          level[a - 1] = -10;
        } else {
          level[a - 1] = -20;
        }
      }
      if (ltoke === "var" && data.lexer[a - 1] === lexer) {
        hoist();
      } else if (ltoke === "function") {
        scopes.push([data.token[a], a]);
      } else if (ltoke === "let" || ltoke === "const") {
        scopes.push([data.token[a], a]);
      } else if (data.stack[a] === "arguments") {
        scopes.push([data.token[a], a]);
      } else if (ltoke === ",") {
        let index = a;
        do {
          index = index - 1;
        } while (index > data.begin[a] && data.token[index] !== "var" && data.token[index] !== "let" && data.token[index] !== "const");
        if (data.token[index] === "var") {
          hoist();
        } else if (data.token[index] === "let" || data.token[index] === "const") {
          scopes.push([data.token[a], a]);
        }
      }
      level.push(-10);
    }
    function separator() {
      const ei = extraindent[extraindent.length - 1] === void 0 ? [] : extraindent[extraindent.length - 1];
      const propertybreak = () => {
        if (options2.script.methodChain > 0) {
          let x = a;
          let y = data.begin[a];
          const z = [a];
          const ify = data.token[y - 1] === "if";
          do {
            x = x - 1;
            if (data.types[x] === "end")
              x = data.begin[x];
            if (data.begin[x] === y) {
              if (data.types[x] === "string" && data.token[x].indexOf("${") === data.token[x].length - 2) {
                break;
              }
              if (data.token[x] === ".") {
                if (level[x - 1] > 0) {
                  level[a - 1] = ify === true ? indent + 1 : indent;
                  return;
                }
                z.push(x);
              } else if (data.token[x] === ";" || data.token[x] === "," || data.types[x] === "operator" || (data.types[x] === "word" || data.types[x] === "reference") && (data.types[x - 1] === "word" || data.types[x - 1] === "reference")) {
                break;
              }
            }
          } while (x > y);
          if (z.length < options2.script.methodChain) {
            level[a - 1] = -20;
            return;
          }
          x = 0;
          y = z.length;
          do {
            level[z[x] - 1] = ify === true ? indent + 1 : indent;
            x = x + 1;
          } while (x < y);
          x = z[z.length - 1] - 1;
          do {
            if (level[x] > -1)
              level[x] = level[x] + 1;
            x = x + 1;
          } while (x < a);
          indent = ify === true ? indent + 2 : indent + 1;
        }
        level[a - 1] = indent;
      };
      if (ctoke === "::") {
        level[a - 1] = -20;
        level.push(-20);
        return;
      }
      if (ctoke === ".") {
        if (data.token[data.begin[a]] !== "(" && data.token[data.begin[a]] !== "x(" && ei.length > 0) {
          if (data.stack[a] === "object" || data.stack[a] === "array") {
            destructfix(true, false);
          } else {
            destructfix(false, false);
          }
        }
        if (options2.script.methodChain === 0) {
          level[a - 1] = -20;
        } else if (options2.script.methodChain < 0) {
          if (data.lines[a] > 0) {
            propertybreak();
          } else {
            level[a - 1] = -20;
          }
        } else {
          propertybreak();
        }
        level.push(-20);
        return;
      }
      if (ctoke === ",") {
        fixchain();
        if (list[list.length - 1] === false && (data.stack[a] === "object" || data.stack[a] === "array" || data.stack[a] === "paren" || data.stack[a] === "expression" || data.stack[a] === "method")) {
          list[list.length - 1] = true;
          if (data.token[data.begin[a]] === "(") {
            let aa = a;
            do {
              aa = aa - 1;
              if (data.begin[aa] === data.begin[a] && data.token[aa] === "+" && level[aa] > -9) {
                level[aa] = level[aa] + 2;
              }
            } while (aa > data.begin[a]);
          }
        }
        if (data.stack[a] === "array" && options2.script.arrayFormat === "indent") {
          level[a - 1] = -20;
          level.push(indent);
          return;
        }
        if (data.stack[a] === "array" && options2.script.arrayFormat === "inline") {
          level[a - 1] = -20;
          level.push(-10);
          return;
        }
        if (data.stack[a] === "object" && options2.script.objectIndent === "indent") {
          level[a - 1] = -20;
          level.push(indent);
          return;
        }
        if (data.stack[a] === "object" && options2.script.objectIndent === "inline") {
          level[a - 1] = -20;
          level.push(-10);
          return;
        }
        if (ei.length > 0) {
          if (ei[ei.length - 1] > -1)
            endExtraInd();
          level[a - 1] = -20;
          level.push(indent);
          return;
        }
        if (data.token[a - 2] === ":" && data.token[a - 4] === "where") {
          level[a - 1] = -20;
          level.push(-10);
          return;
        }
        level[a - 1] = -20;
        if (data.types[a + 1] !== "end") {
          itemcount[itemcount.length - 1] = itemcount[itemcount.length - 1] + 1;
        }
        if ((data.token[data.begin[a]] === "(" || data.token[data.begin[a]] === "x(") && options2.language !== "jsx" && data.stack[a] !== "global" && (data.types[a - 1] !== "string" && data.types[a - 1] !== "number" || data.token[a - 2] !== "+" || data.types[a - 1] === "string" && data.types[a - 1] !== "number" && data.token[a - 2] === "+" && data.types[a - 3] !== "string" && data.types[a - 3] !== "number")) {
          level.push(-10);
          return;
        }
        if (ltype === "reference" && data.types[a - 2] === "word" && "var-let-const-from".indexOf(data.token[a - 2]) < 0 && (data.types[a - 3] === "end" || data.token[a - 3] === ";")) {
          wordlist[wordlist.length - 1] = true;
          level.push(-10);
          return;
        }
        if (wordlist[wordlist.length - 1] === true || data.stack[a] === "notation") {
          level.push(-10);
          return;
        }
        if (itemcount[itemcount.length - 1] > 3 && (data.stack[a] === "array" || data.stack[a] === "object")) {
          if (destruct[destruct.length - 1] === true)
            destructfix(true, true);
          level[a - 1] = -20;
          if (arrbreak[arrbreak.length - 1] === true) {
            level.push(indent);
            return;
          }
          const begin = data.begin[a];
          let c = a;
          do {
            if (data.types[c] === "end") {
              c = data.begin[c];
            } else {
              if (data.token[c] === "," && data.types[c + 1] !== "comment") {
                level[c] = indent;
              }
            }
            c = c - 1;
          } while (c > begin);
          level[begin] = indent;
          arrbreak[arrbreak.length - 1] = true;
          return;
        }
        if (data.stack[a] === "object") {
          if (destruct[destruct.length - 1] === true && data.types[data.begin[a] - 1] !== "word" && data.types[data.begin[a] - 1] !== "reference" && data.token[data.begin[a] - 1] !== "(" && data.token[data.begin[a] - 1] !== "x(") {
            const bb = data.begin[a];
            let aa = a - 1;
            do {
              if (data.begin[aa] === bb) {
                if (data.token[aa] === ",")
                  break;
                if (data.token[aa] === ":") {
                  destructfix(true, false);
                  break;
                }
              }
              aa = aa - 1;
            } while (aa > bb);
          }
        }
        if (destruct[destruct.length - 1] === false || data.token[a - 2] === "+" && (ltype === "string" || ltype === "number") && level[a - 2] > 0 && (ltoke.charAt(0) === '"' || ltoke.charAt(0) === "'")) {
          if (data.stack[a] === "method") {
            if (data.token[a - 2] === "+" && (ltoke.charAt(0) === '"' || ltoke.charAt(0) === "'") && (data.token[a - 3].charAt(0) === '"' || data.token[a - 3].charAt(0) === "'")) {
              level.push(indent + 2);
              return;
            }
            if (data.token[a - 2] !== "+") {
              level.push(-10);
              return;
            }
          }
          level.push(indent);
          return;
        }
        if (destruct[destruct.length - 1] === true && data.stack[a] !== "object") {
          level.push(-10);
          return;
        }
        if (itemcount[itemcount.length - 1] < 4 && (data.stack[a] === "array" || data.stack[a] === "object")) {
          level.push(-10);
          return;
        }
        level.push(indent);
        return;
      }
      if (ctoke === ";" || ctoke === "x;") {
        fixchain();
        if (data.token[a + 1] !== void 0 && data.types[a + 1].indexOf("attribute") > 0 && data.types[a + 1].indexOf("end") > 0) {
          level[a - 1] = -20;
          level.push(indent - 1);
          return;
        }
        if (varindex[varindex.length - 1] > -1 && data.stack[varindex[varindex.length - 1]] !== "expression") {
          let aa = a;
          do {
            aa = aa - 1;
            if (data.token[aa] === ";")
              break;
            if (data.token[aa] === ",") {
              indent = indent - 1;
              break;
            }
            if (data.types[aa] === "end")
              aa = data.begin[aa];
          } while (aa > 0 && aa > data.begin[a]);
        }
        varindex[varindex.length - 1] = -1;
        endExtraInd();
        if (data.token[data.begin[a] - 1] !== "for")
          destructfix(false, false);
        wordlist[wordlist.length - 1] = false;
        level[a - 1] = -20;
        if (data.begin[a] > 0 && data.token[data.begin[a] - 1] === "for" && data.stack[a] !== "for") {
          level.push(-10);
          return;
        }
        level.push(indent);
        return;
      }
      level.push(-20);
    }
    function start() {
      const deep = data.stack[a + 1];
      const deeper = a === 0 ? data.stack[a] : data.stack[a - 1];
      if (ltoke === ")" || (deeper === "object" || deeper === "array") && ltoke !== "]") {
        if (deep !== "method" || deep === "method" && data.token[a + 1] !== ")" && data.token[a + 2] !== ")") {
          if (ltoke === ")" && (deep !== "function" || data.token[data.begin[data.begin[a - 1] - 1]] === "(" || data.token[data.begin[data.begin[a - 1] - 1]] === "x(")) {
            destructfix(false, false);
          } else if (data.types[a + 1] !== "end" && data.types[a + 2] !== "end") {
            destructfix(true, false);
          }
        }
      }
      list.push(false);
      extraindent.push([]);
      assignlist.push(false);
      arrbreak.push(false);
      wordlist.push(false);
      itemcount.push(0);
      if (options2.script.neverFlatten === true || deep === "array" && options2.script.arrayFormat === "indent" || deep === "attribute" || ltype === "generic" || deep === "class" && ltoke !== "(" && ltoke !== "x(" || ctoke === "[" && data.token[a + 1] === "function") {
        destruct.push(false);
      } else {
        if (deep === "expression" || deep === "method") {
          destruct.push(true);
        } else if ((deep === "object" || deep === "class") && (ltoke === "(" || ltoke === "x(" || ltype === "word" || ltype === "reference")) {
          destruct.push(true);
        } else if (deep === "array" || ctoke === "(" || ctoke === "x(") {
          destruct.push(true);
        } else if (ctoke === "{" && deep === "object" && ltype !== "operator" && ltype !== "start" && ltype !== "string" && ltype !== "number" && deeper !== "object" && deeper !== "array" && a > 0) {
          destruct.push(true);
        } else {
          destruct.push(false);
        }
      }
      if (ctoke !== "(" && ctoke !== "x(" && data.stack[a + 1] !== "attribute") {
        indent = indent + 1;
      }
      if (ctoke === "{" || ctoke === "x{") {
        varindex.push(-1);
        if (data.types[a - 1] !== "comment") {
          if (ltype === "markup") {
            level[a - 1] = indent;
          } else if (options2.script.braceAllman === true && ltype !== "operator" && ltoke !== "return") {
            level[a - 1] = indent - 1;
          } else if (data.stack[a + 1] !== "block" && (deep === "function" || ltoke === ")" || ltoke === "x)" || ltoke === "," || ltoke === "}" || ltype === "markup")) {
            level[a - 1] = -10;
          } else if (ltoke === "{" || ltoke === "x{" || ltoke === "[" || ltoke === "}" || ltoke === "x}") {
            level[a - 1] = indent - 1;
          }
        }
        if (deep === "object") {
          if (options2.script.objectIndent === "indent") {
            destruct[destruct.length - 1] = false;
            level.push(indent);
            return;
          }
          if (options2.script.objectIndent === "inline") {
            destruct[destruct.length - 1] = true;
            level.push(-20);
            return;
          }
        }
        if (deep === "switch") {
          if (options2.script.noCaseIndent === true) {
            level.push(indent - 1);
            return;
          }
          indent = indent + 1;
          level.push(indent);
          return;
        }
        if (destruct[destruct.length - 1] === true) {
          if (ltype !== "word" && ltype !== "reference") {
            level.push(-20);
            return;
          }
        }
        level.push(indent);
        return;
      }
      if (ctoke === "(" || ctoke === "x(") {
        if (options2.wrap > 0 && ctoke === "(" && data.token[a + 1] !== ")") {
          count.push(1);
        }
        if (ltoke === "-" && (data.token[a - 2] === "(" || data.token[a - 2] === "x(")) {
          level[a - 2] = -20;
        }
        if (ltype === "end" && deeper !== "if" && deeper !== "for" && deeper !== "catch" && deeper !== "else" && deeper !== "do" && deeper !== "try" && deeper !== "finally" && deeper !== "catch") {
          if (data.types[a - 1] === "comment") {
            level[a - 1] = indent;
          } else {
            level[a - 1] = -20;
          }
        }
        if (ltoke === "async") {
          level[a - 1] = -10;
        } else if (deep === "method" || data.token[a - 2] === "function" && ltype === "reference") {
          if (ltoke === "import" || ltoke === "in" || options2.script.functionNameSpace === true) {
            level[a - 1] = -10;
          } else if (ltoke === "}" && data.stack[a - 1] === "function" || ltype === "word" || ltype === "reference" || ltype === "property") {
            level[a - 1] = -20;
          } else if (deeper !== "method" && deep !== "method") {
            level[a - 1] = indent;
          }
        }
        if (ltoke === "+" && (data.token[a - 2].charAt(0) === '"' || data.token[a - 2].charAt(0) === "'")) {
          level.push(indent);
          return;
        }
        if (ltoke === "}" || ltoke === "x}") {
          level.push(-20);
          return;
        }
        if (ltoke === "-" && (a < 2 || data.token[a - 2] !== ")" && data.token[a - 2] !== "x)" && data.token[a - 2] !== "]" && data.types[a - 2] !== "reference" && data.types[a - 2] !== "string" && data.types[a - 2] !== "number") || options2.script.functionSpace === false && ltoke === "function") {
          level[a - 1] = -20;
        }
        level.push(-20);
        return;
      }
      if (ctoke === "[") {
        if (ltoke === "[")
          list[list.length - 2] = true;
        if (ltoke === "return" || ltoke === "var" || ltoke === "let" || ltoke === "const") {
          level[a - 1] = -10;
        } else if (data.types[a - 1] !== "comment" && data.stack[a - 1] !== "attribute" && (ltype === "end" || ltype === "word" || ltype === "reference")) {
          level[a - 1] = -20;
        } else if (ltoke === "[" || ltoke === "{" || ltoke === "x{") {
          level[a - 1] = indent - 1;
        }
        if (data.stack[a] === "attribute") {
          level.push(-20);
          return;
        }
        if (options2.script.arrayFormat === "indent") {
          destruct[destruct.length - 1] = false;
          level.push(indent);
          return;
        }
        if (options2.script.arrayFormat === "inline") {
          destruct[destruct.length - 1] = true;
          level.push(-20);
          return;
        }
        if (deep === "method" || destruct[destruct.length - 1] === true) {
          level.push(-20);
          return;
        }
        let c = a + 1;
        do {
          if (data.token[c] === "]") {
            level.push(-20);
            return;
          }
          if (data.token[c] === ",") {
            level.push(indent);
            return;
          }
          c = c + 1;
        } while (c < b);
        level.push(-20);
      }
    }
    function string() {
      if (ctoke.length === 1) {
        level.push(-20);
        if (data.lines[a] === 0)
          level[a - 1] = -20;
      } else if (ctoke.indexOf("#!/") === 0) {
        level.push(indent);
      } else {
        level.push(-10);
      }
      if ((ltoke === "," || ltype === "start") && (data.stack[a] === "object" || data.stack[a] === "array") && destruct[destruct.length - 1] === false && a > 0) {
        level[a - 1] = indent;
      }
    }
    function template() {
      if (ctype === "template_else") {
        level[a - 1] = indent - 1;
        level.push(indent);
      } else if (ctype === "template_start") {
        indent = indent + 1;
        if (data.lines[a - 1] < 1)
          level[a - 1] = -20;
        if (data.lines[a] > 0 || ltoke.length === 1 && ltype === "string") {
          level.push(indent);
        } else {
          level.push(-20);
        }
      } else if (ctype === "template_end") {
        indent = indent - 1;
        if (ltype === "template_start" || data.lines[a - 1] < 1) {
          level[a - 1] = -20;
        } else {
          level[a - 1] = indent;
        }
        if (data.lines[a] > 0) {
          level.push(indent);
        } else {
          level.push(-20);
        }
      } else if (ctype === "template") {
        if (data.lines[a] > 0) {
          level.push(indent);
        } else {
          level.push(-20);
        }
      }
    }
    function templateString() {
      if (ctype === "template_string_start") {
        indent = indent + 1;
        level.push(indent);
      } else if (ctype === "template_string_else") {
        fixchain();
        level[a - 1] = indent - 1;
        level.push(indent);
      } else {
        fixchain();
        indent = indent - 1;
        level[a - 1] = indent;
        level.push(-10);
      }
      if (a > 2 && (data.types[a - 2] === "template_string_else" || data.types[a - 2] === "template_string_start")) {
        if (options2.script.bracePadding === true) {
          level[a - 2] = -10;
          level[a - 1] = -10;
        } else {
          level[a - 2] = -20;
          level[a - 1] = -20;
        }
      }
    }
    function types() {
      if (data.token[a - 1] === "," || data.token[a - 1] === ":" && data.stack[a - 1] !== "data_type") {
        level[a - 1] = -10;
      } else {
        level[a - 1] = -20;
      }
      if (data.types[a] === "type" || data.types[a] === "type_end") {
        level.push(-10);
      }
      if (data.types[a] === "type_start") {
        level.push(-20);
      }
    }
    function word() {
      if ((ltoke === ")" || ltoke === "x)") && data.stack[a] === "class" && (data.token[data.begin[a - 1] - 1] === "static" || data.token[data.begin[a - 1] - 1] === "final" || data.token[data.begin[a - 1] - 1] === "void")) {
        level[a - 1] = -10;
        level[data.begin[a - 1] - 1] = -10;
      }
      if (ltoke === "]")
        level[a - 1] = -10;
      if (ctoke === "else" && ltoke === "}") {
        if (data.token[a - 2] === "x}")
          level[a - 3] = level[a - 3] - 1;
        if (options2.script.braceAllman === true || options2.script.elseNewline === true) {
          level[a - 1] = indent;
        }
      }
      if (ctoke === "new" && apiword.has(data.token[a + 1]))
        ;
      if (ctoke === "from" && ltype === "end" && a > 0 && (data.token[data.begin[a - 1] - 1] === "import" || data.token[data.begin[a - 1] - 1] === ",")) {
        level[a - 1] = -10;
      }
      if (ctoke === "function") {
        if (options2.script.functionSpace === false && a < b - 1 && (data.token[a + 1] === "(" || data.token[a + 1] === "x(")) {
          level.push(-20);
          return;
        }
        level.push(-10);
        return;
      }
      if (ltoke === "-" && a > 1) {
        if (data.types[a - 2] === "operator" || data.token[a - 2] === ",") {
          level[a - 1] = -20;
        } else if (data.types[a - 2] === "start") {
          level[a - 2] = -20;
          level[a - 1] = -20;
        }
      } else if (ctoke === "while" && (ltoke === "}" || ltoke === "x}")) {
        let c = a - 1;
        let d = 0;
        do {
          if (data.token[c] === "}" || data.token[c] === "x}")
            d = d + 1;
          if (data.token[c] === "{" || data.token[c] === "x{")
            d = d - 1;
          if (d === 0) {
            if (data.token[c - 1] === "do") {
              level[a - 1] = -10;
              break;
            }
            level[a - 1] = indent;
            break;
          }
          c = c - 1;
        } while (c > -1);
      } else if (ctoke === "in" || (ctoke === "else" && options2.script.elseNewline === false && options2.script.braceAllman === false || ctoke === "catch") && (ltoke === "}" || ltoke === "x}")) {
        level[a - 1] = -10;
      } else if (ctoke === "var" || ctoke === "let" || ctoke === "const") {
        varindex[varindex.length - 1] = a;
        if (ltype === "end")
          level[a - 1] = indent;
        if (data.token[data.begin[a] - 1] !== "for") {
          let c = a + 1;
          let d = 0;
          do {
            if (data.types[c] === "end")
              d = d - 1;
            if (data.types[c] === "start")
              d = d + 1;
            if (d < 0 || d === 0 && (data.token[c] === ";" || data.token[c] === ",")) {
              break;
            }
            c = c + 1;
          } while (c < b);
          if (data.token[c] === ",")
            indent = indent + 1;
        }
        level.push(-10);
        return;
      }
      if ((ctoke === "default" || ctoke === "case") && ltype !== "word" && data.stack[a] === "switch") {
        level[a - 1] = indent - 1;
        level.push(-10);
        return;
      }
      if (ctoke === "catch" && ltoke === ".") {
        level[a - 1] = -20;
        level.push(-20);
        return;
      }
      if (ctoke === "catch" || ctoke === "finally") {
        level[a - 1] = -10;
        level.push(-10);
        return;
      }
      if (options2.script.bracePadding === false && a < b - 1 && data.token[a + 1].charAt(0) === "}") {
        level.push(-20);
        return;
      }
      if (data.stack[a] === "object" && (ltoke === "{" || ltoke === ",") && (data.token[a + 1] === "(" || data.token[a + 1] === "x(")) {
        level.push(-20);
        return;
      }
      if (data.types[a - 1] === "comment" && data.token[data.begin[a]] === "(") {
        level[a - 1] = indent + 1;
      }
      if (options2.script.inlineReturn) {
        if (data.stack[a] === "if" && ctoke === "return" && (ltoke === "x{" || ltoke === "{")) {
          const lastelse = data.begin.lastIndexOf(data.begin[a - 1], a - 3);
          if (data.token[lastelse - 2] === "else") {
            if (ltoke === "x{")
              data.token[a - 1] = "{";
            if (data.token[data.ender[a]] === "x}")
              data.token[data.ender[a]] = "}";
            data.lines[data.ender[a]] = data.lines[data.ender[a]] - 1;
          } else {
            if (data.token[data.ender[a - 1] + 2] !== "if" && data.token[data.ender[a - 1] + 1] !== "else") {
              level[a - 1] = -20;
              if (ltoke === "{")
                data.token[a - 1] = "x{";
              if (data.token[data.ender[a]] === "}")
                data.token[data.ender[a]] = "x}";
            } else if (data.token[data.ender[a - 1] + 2] !== "if" && data.token[data.ender[a - 1] + 1] !== "x{") {
              level[a - 1] = -20;
              data.lines[data.ender[a - 1] + 2] = data.lines[data.ender[a - 1] + 2] - 1;
              if (data.token[a - 1] === "{")
                data.token[a - 1] = "x{";
              if (data.token[data.ender[a]] === "}")
                data.token[data.ender[a]] = "x}";
              if (data.token[data.ender[a - 1] + 2] === "{")
                data.token[data.ender[a - 1] + 2] = "x{";
            }
          }
        }
        if ((ltoke === "x}" || ltoke === "}") && (data.stack[a - 1] === "if" && ctoke === "else" && (data.token[a + 1] === "{" || data.token[a + 1] === "x{") && data.token[a + 2] === "return")) {
          if (data.token[a - 2] === "x;")
            data.token[a - 2] = ";";
        }
        if (ltoke === "x{" && ctoke === "return" && data.stack[a] === "else") {
          level[a - 1] = -20;
          if (data.token[data.ender[a - 1] - 1] === "x;")
            data.token[data.ender[a - 1] - 1] = ";";
          data.lines[data.ender[a - 1]] = data.lines[data.ender[a - 1]] - 1;
          data.lines[data.ender[a] + 1] = data.lines[data.ender[a] + 1] - 1;
        }
        if (ltoke === "x}" && ctoke === "else" && data.token[a + 1] === "x{" && data.token[a + 2] === "return" && data.token[data.ender[a] - 1] === "}") {
          data.token[data.ender[a] - 1] = "x}";
        }
      }
      level.push(-10);
    }
    do {
      if (data.lexer[a] === lexer) {
        ctype = data.types[a];
        ctoke = data.token[a];
        if (ctype === "comment") {
          comment2();
        } else if (ctype === "regex") {
          level.push(-20);
        } else if (ctype === "string") {
          string();
        } else if (ctype.indexOf("template_string") === 0) {
          templateString();
        } else if (ctype === "separator") {
          separator();
        } else if (ctype === "start") {
          start();
        } else if (ctype === "end") {
          end();
        } else if (ctype === "type" || ctype === "type_start" || ctype === "type_end") {
          types();
        } else if (ctype === "operator") {
          operator();
        } else if (ctype === "word") {
          word();
        } else if (ctype === "reference") {
          reference2();
        } else if (ctype === "markup") {
          markup3();
        } else if (ctype.indexOf("template") === 0) {
          template();
        } else if (ctype === "generic") {
          if (ltoke !== "return" && ltoke.charAt(0) !== "#" && ltype !== "operator" && ltoke !== "public" && ltoke !== "private" && ltoke !== "static" && ltoke !== "final" && ltoke !== "implements" && ltoke !== "class" && ltoke !== "void") {
            level[a - 1] = -20;
          }
          if (data.token[a + 1] === "(" || data.token[a + 1] === "x(") {
            level.push(-20);
          } else {
            level.push(-10);
          }
        } else {
          level.push(-10);
        }
        if (ctype !== "comment") {
          ltype = ctype;
          ltoke = ctoke;
        }
        if (count.length > 0 && data.token[a] !== ")") {
          if (data.types[a] === "comment" && count[count.length - 1] > -1) {
            count[count.length - 1] = options2.wrap + 1;
          } else if (level[a] > -1 || data.token[a].charAt(0) === "`" && data.token[a].indexOf("\n") > 0) {
            count[count.length - 1] = -1;
          } else if (count[count.length - 1] > -1) {
            count[count.length - 1] = count[count.length - 1] + data.token[a].length;
            if (level[a] === -10)
              count[count.length - 1] = count[count.length - 1] + 1;
          }
        }
      } else {
        external();
      }
      a = a + 1;
    } while (a < b);
    return level;
  })();
  const output = (() => {
    const build = [];
    const tab = (() => {
      const tabby = [];
      const ch = options2.indentChar;
      let index = options2.indentSize;
      if (typeof index !== "number" || index < 1)
        return "";
      do {
        tabby.push(ch);
        index = index - 1;
      } while (index > 0);
      return tabby.join("");
    })();
    const lf = options2.crlf === true ? "\r\n" : "\n";
    const pres = options2.preserveLine + 1;
    const invisibles = ["x;", "x}", "x{", "x(", "x)"];
    let a = prettify.start;
    let external = "";
    options2.indentLevel;
    function nl(tabs) {
      const linesout = [];
      const total = (() => {
        if (a === b - 1)
          return 1;
        if (data.lines[a + 1] - 1 > pres)
          return pres;
        if (data.lines[a + 1] > 1)
          return data.lines[a + 1] - 1;
        return 1;
      })();
      let index = 0;
      if (tabs < 0)
        tabs = 0;
      do {
        linesout.push(lf);
        index = index + 1;
      } while (index < total);
      if (tabs > 0) {
        index = 0;
        do {
          linesout.push(tab);
          index = index + 1;
        } while (index < tabs);
      }
      return linesout.join("");
    }
    if (options2.script.vertical === true) {
      let vertical2 = function(end) {
        let longest = 0;
        let complex = 0;
        let aa = end - 1;
        let bb = 0;
        let cc2 = 0;
        const begin = data.begin[a];
        const list = [];
        do {
          if ((data.begin[aa] === begin || data.token[aa] === "]" || data.token[aa] === ")") && (data.token[aa + 1] === ":" && data.stack[aa] === "object" || data.token[aa + 1] === "=")) {
            bb = aa;
            complex = 0;
            do {
              if (data.begin[bb] === begin) {
                if (data.token[bb] === "," || data.token[bb] === ";" || data.token[bb] === "x;" || levels[bb] > -1 && data.types[bb] !== "comment") {
                  if (data.token[bb + 1] === ".") {
                    complex = complex + options2.indentSize * options2.indentChar.length;
                  }
                  break;
                }
              } else if (levels[bb] > -1) {
                break;
              }
              if (data.types[bb] !== "comment") {
                if (levels[bb - 1] === -10)
                  complex = complex + 1;
                complex = data.token[bb].length + complex;
              }
              bb = bb - 1;
            } while (bb > begin);
            cc2 = bb;
            if (data.token[cc2] === "," && data.token[aa + 1] === "=") {
              do {
                if (data.types[cc2] === "end")
                  cc2 = data.begin[cc2];
                if (data.begin[cc2] === begin) {
                  if (data.token[cc2] === ";" || data.token[cc2] === "x;")
                    break;
                  if (data.token[cc2] === "var" || data.token[cc2] === "const" || data.token[cc2] === "let") {
                    complex = complex + options2.indentSize * options2.indentChar.length;
                    break;
                  }
                }
                cc2 = cc2 - 1;
              } while (cc2 > begin);
            }
            if (complex > longest)
              longest = complex;
            list.push([aa, complex]);
            aa = bb;
          } else if (data.types[aa] === "end") {
            aa = data.begin[aa];
          }
          aa = aa - 1;
        } while (aa > begin);
        aa = list.length;
        if (aa > 0) {
          do {
            aa = aa - 1;
            bb = list[aa][1];
            if (bb < longest) {
              do {
                data.token[list[aa][0]] = data.token[list[aa][0]] + " ";
                bb = bb + 1;
              } while (bb < longest);
            }
          } while (aa > 0);
        }
      };
      a = b;
      do {
        a = a - 1;
        if (data.lexer[a] === "script") {
          if (data.token[a] === "}" && data.token[a - 1] !== "{" && levels[data.begin[a]] > 0) {
            vertical2(a);
          }
        } else {
          a = data.begin[a];
        }
      } while (a > 0);
    }
    a = prettify.start;
    do {
      if (data.lexer[a] === lexer || prettify.beautify[data.lexer[a]] === void 0) {
        if (data.types[a] === "comment" && options2.commentIndent === true) {
          if (/\n/.test(data.token[a])) {
            const space = data.begin[a] > -1 ? data.token[a].charAt(2) === "*" ? repeatChar(levels[a], tab) + options2.indentChar : repeatChar(levels[a], tab) : options2.indentChar;
            const comm = data.token[a].split(/\n/);
            let i = 1;
            do {
              comm[i] = space + comm[i].trimLeft();
              i = i + 1;
            } while (i < comm.length);
            data.token.splice(a, 1, comm.join("\n"));
          }
        }
        if (invisibles.indexOf(data.token[a]) < 0) {
          if (data.token[a] !== ";" || options2.script.noSemicolon === false) {
            build.push(data.token[a]);
          } else if (levels[a] < 0 && data.types[a + 1] !== "comment") {
            build.push(";");
          }
        }
        if (a < b - 1 && data.lexer[a + 1] !== lexer && data.begin[a] === data.begin[a + 1] && data.types[a + 1].indexOf("end") < 0 && data.token[a] !== ",") {
          build.push(" ");
        } else if (levels[a] > -1) {
          if ((levels[a] > -1 && data.token[a] === "{" || levels[a] > -1 && data.token[a + 1] === "}") && data.lines[a] < 3 && options2.script.braceNewline === true) {
            if (data.lines[a + 1] < 3)
              build.push(nl(0));
          }
          build.push(nl(levels[a]));
          levels[a];
        } else if (levels[a] === -10) {
          build.push(" ");
          if (data.lexer[a + 1] !== lexer)
            ;
        }
      } else {
        if (externalIndex[a] === a) {
          build.push(data.token[a]);
        } else {
          prettify.end = externalIndex[a];
          prettify.start = a;
          external = prettify.beautify[data.lexer[a]](options2);
          build.push(external.replace(/\s+$/, ""));
          a = prettify.iterator;
          if (levels[a] === -10) {
            build.push(" ");
          } else if (levels[a] > -1) {
            build.push(nl(levels[a]));
          }
          options2.indentLevel = 0;
        }
      }
      a = a + 1;
    } while (a < b);
    prettify.iterator = b - 1;
    return build.join("");
  })();
  return output;
};

// src/prettify.ts
var prettify_exports = {};
__export(prettify_exports, {
  format: () => format,
  language: () => detect,
  options: () => options,
  parse: () => parse2
});

// src/languages/css.ts
var css = [
  {
    pattern: /[a-z-]+:(?!:).+;/,
    type: "keyword"
  },
  {
    pattern: /<(\/)?style>/,
    type: "not"
  }
];

// src/languages/html.ts
var html = [
  {
    pattern: /<!DOCTYPE (html|HTML PUBLIC .+)>/,
    type: "meta.module",
    nearTop: true
  },
  {
    pattern: /<[a-z0-9]+(\s*[\w]+=('|").+('|")\s*)?>.*<\/[a-z0-9]+>/g,
    type: "keyword"
  },
  {
    pattern: /<!--(.*)(-->)?/,
    type: "comment.block"
  },
  {
    pattern: /[a-z-]+=("|').+("|')/g,
    type: "keyword.other"
  },
  {
    pattern: /{[{%][\s\S]*?[%}]}/g,
    type: "not"
  },
  {
    pattern: /{%-?\s*(end)?(schema|style(sheet)?|javascript)\s*-?%}/,
    type: "not",
    deterministic: "liquid"
  }
];

// src/languages/liquid.ts
var liquid = [
  {
    pattern: /<!DOCTYPE (html|HTML PUBLIC .+)>/,
    type: "meta.module",
    nearTop: true
  },
  {
    pattern: /<[a-z0-9]+(\s*[\w]+=('|").+('|")\s*)?>.*<\/[a-z0-9]+>/g,
    type: "keyword"
  },
  {
    pattern: /<!--(.*)(-->)?/,
    type: "comment.block"
  },
  {
    pattern: /[a-z-]+=("|').+("|')/g,
    type: "keyword.other"
  },
  {
    pattern: /{[{%][\s\S]*?[%}]}/g,
    type: "keyword",
    deterministic: "liquid",
    unless: /\/.*?{[{%][\s\S]*?[%}]}.*\//
  },
  {
    pattern: /{%-?\s*(end)?(schema|style(sheet)?|javascript)\s*-?%}/,
    type: "meta.module",
    deterministic: "liquid"
  }
];

// src/languages/json.ts
var json = [
  {
    pattern: /^[{[]$/,
    type: "meta.module",
    nearTop: true
  },
  {
    pattern: /^\s*".+":\s*(".+"|[0-9]+|null|true|false)(,)?$/,
    type: "keyword"
  },
  {
    pattern: /^\s*".+":\s*(\{|\[)$/,
    type: "keyword"
  },
  {
    pattern: /^\s*".+":\s*\{(\s*".+":\s*(".+"|[0-9]+|null|true|false)(,)?\s*){1,}\}(,)?$/,
    type: "keyword"
  },
  {
    pattern: /\s*".+"\s*\[\s*((".+"|[0-9]+|null|true|false)(,)?\s*){1,}\](,)?$/,
    type: "keyword"
  }
];

// src/languages/yaml.ts
var yaml = [
  {
    pattern: /^( )*([A-Za-z0-9_. ]+):( )?(.*)?$/,
    type: "keyword"
  },
  {
    pattern: /^( )*-( )([A-Za-z0-9_. ]+):( )?(.*)?$/,
    type: "keyword"
  },
  {
    pattern: /^( )*-( )(.*)$/,
    type: "keyword"
  },
  {
    pattern: /^( )*([A-Za-z0-9_. ]+):( )!!binary( )?(|)?$/,
    type: "constant.type"
  },
  {
    pattern: /^( )*([A-Za-z0-9_. ]+):( )\|$/,
    type: "keyword"
  },
  {
    pattern: /^( )*([A-Za-z0-9_. ]+):( )>$/,
    type: "keyword"
  },
  {
    pattern: /^( )*\?( )(.*)$/,
    type: "keyword"
  },
  {
    pattern: /^( )*\?( )\|$/,
    type: "constant.type"
  },
  {
    pattern: /^( )*<<:( )(\*)(.*)?$/,
    type: "constant.type"
  },
  {
    pattern: /^( )*([A-Za-z0-9_. ]+):(.*)?( )?{$/,
    type: "not"
  },
  {
    pattern: /^( )*([A-Za-z0-9_. ]+):(.*)?( )?,$/,
    type: "not"
  }
];

// src/languages/javascript.ts
var javascript = [
  {
    pattern: /undefined/g,
    type: "keyword"
  },
  {
    pattern: /window\./g,
    type: "keyword"
  },
  {
    pattern: /console\.log\s*\(/,
    type: "keyword.print"
  },
  {
    pattern: /(var|const|let)\s+\w+\s*=?/,
    type: "keyword.variable"
  },
  {
    pattern: /(('|").+('|")\s*|\w+):\s*[{[]/,
    type: "constant.array"
  },
  {
    pattern: /===/g,
    type: "keyword.operator"
  },
  {
    pattern: /!==/g,
    type: "keyword.operator"
  },
  {
    pattern: /function\*?\s*([A-Za-z$_][\w$]*)?\s*[(][^:;()]*[)]\s*{/g,
    type: "keyword.function"
  },
  {
    pattern: /\(* => {/g,
    type: "keyword.function"
  },
  {
    pattern: /null/g,
    type: "constant.null"
  },
  {
    pattern: /\(.*\)\s*=>\s*.+/,
    type: "keyword.control"
  },
  {
    pattern: /(else )?if\s+\(.+\)/,
    type: "keyword.control"
  },
  {
    pattern: /while\s+\(.+\)/,
    type: "keyword.control"
  },
  {
    pattern: /\*\w+/,
    type: "not"
  },
  {
    pattern: /(var|const|let)\s+\w+:\s*(string|number|boolean|string)(?:\[\])?/,
    type: "not"
  },
  {
    pattern: /(interface|type)\s+\w+?/,
    type: "not"
  },
  {
    pattern: /(declare|namespace)\s+\w+?/,
    type: "not"
  },
  {
    pattern: /<(\/)?script\s*(type=('|")text\/javascript('|"))?>/,
    type: "not"
  },
  {
    pattern: /<(\/)?style>/,
    type: "not"
  },
  {
    pattern: /fn\s[A-Za-z0-9<>,]+\(.*\)\s->\s\w+(\s\{|)/,
    type: "not"
  },
  {
    pattern: /{[{%][\s\S]*?[%}]}/g,
    type: "not"
  },
  {
    pattern: /{%-?\s*(end)?(schema|style(sheet)?|javascript)\s*-?%}/,
    type: "not",
    deterministic: "liquid"
  }
];

// src/languages/typescript.ts
var typescript = [
  {
    pattern: /undefined/g,
    type: "keyword"
  },
  {
    pattern: /window\./g,
    type: "keyword"
  },
  {
    pattern: /console\.log\s*\(/,
    type: "keyword.print"
  },
  {
    pattern: /(var|const|let)\s+\w+\s*=?/,
    type: "keyword.variable"
  },
  {
    pattern: /(('|").+('|")\s*|\w+):\s*[{[]/,
    type: "constant.array"
  },
  {
    pattern: /===/g,
    type: "keyword.operator"
  },
  {
    pattern: /!==/g,
    type: "keyword.operator"
  },
  {
    pattern: /function\*?\s*([A-Za-z$_][\w$]*)?\s*[(][^:;()]*[)]\s*{/g,
    type: "keyword.function"
  },
  {
    pattern: /\(* => {/g,
    type: "keyword.function"
  },
  {
    pattern: /null/g,
    type: "constant.null"
  },
  {
    pattern: /\(.*\)\s*=>\s*.+/,
    type: "keyword.control"
  },
  {
    pattern: /(else )?if\s+\(.+\)/,
    type: "keyword.control"
  },
  {
    pattern: /while\s+\(.+\)/,
    type: "keyword.control"
  },
  {
    pattern: /\*\w+/,
    type: "not"
  },
  {
    pattern: /<(\/)?script( type=('|")text\/javascript('|"))?>/,
    type: "not"
  },
  {
    pattern: /<(\/)?style>/,
    type: "not"
  },
  {
    pattern: /fn\s[A-Za-z0-9<>,]+\(.*\)\s->\s\w+(\s\{|)/,
    type: "not"
  },
  {
    pattern: /{[{%][\s\S]*?[%}]}/g,
    type: "not"
  },
  {
    pattern: /{%-?\s*(end)?(schema|style(sheet)?|javascript)\s*-?%}/,
    type: "not",
    deterministic: "liquid"
  },
  {
    pattern: /(var|const|let)\s+\w+:\s*(string|number|boolean|string|any)(\[\])?/,
    type: "keyword.variable"
  },
  {
    pattern: /(\(\s*)?\w+:\s*(string|number|boolean|string|any)(\[\])?(\s*\))?/,
    type: "keyword.other"
  },
  {
    pattern: /\):\s*(\w+)(\[\])?\s*(=>|\{)\s*/,
    type: "keyword.function"
  },
  {
    pattern: /(interface|type)\s+\w+?/,
    type: "keyword.other"
  },
  {
    pattern: /(declare|namespace)\s+\w+?/,
    type: "keyword.other"
  },
  {
    pattern: /as\s+\w+?/,
    type: "keyword.other"
  }
];

// src/languages/markdown.ts
var markdown = [
  {
    pattern: /^(#){2,6}\s.+/,
    type: "keyword"
  },
  {
    pattern: /^(?!!)(=|-){2,}(?<!>)$/,
    type: "meta.module"
  },
  {
    pattern: /(!)?\[.+\]\(.+\)/,
    type: "keyword"
  },
  {
    pattern: /\[.+\]\[.+\]/,
    type: "keyword"
  },
  {
    pattern: /^\[.+\]:\s?(<)?(http)?/,
    type: "keyword"
  },
  {
    pattern: /^(> .*)+/,
    type: "macro"
  },
  {
    pattern: /^```([A-Za-z0-9#_]+)?$/,
    type: "keyword"
  },
  {
    pattern: /^---$/,
    type: "meta.module",
    nearTop: true
  }
];

// src/parser/detect.ts
var shebangMap = {
  node: "javascript",
  jsc: "javascript",
  deno: "typescript"
};
var languages = {
  css,
  html,
  liquid,
  javascript,
  typescript,
  json,
  markdown,
  yaml
};
function detectLanguage(sample) {
  let linesOfCode = sample.replace(/\r\n?/g, "\n").replace(/\n{2,}/g, "\n").split("\n");
  if (linesOfCode.length > 500) {
    linesOfCode = linesOfCode.filter((_, index) => {
      if (nearTop(index, linesOfCode))
        return true;
      return index % Math.ceil(linesOfCode.length / 500) === 0;
    });
  }
  if (linesOfCode[0].startsWith("#!")) {
    if (linesOfCode[0].startsWith("#!/usr/bin/env")) {
      let language;
      language = linesOfCode[0].split(" ").slice(1).join(" ");
      language = shebangMap[language] || language.charAt(0).toUpperCase() + language.slice(1);
      return {
        language,
        statistics: {},
        linesOfCode: linesOfCode.length
      };
    }
    if (linesOfCode[0].startsWith("#!/bin/bash")) {
      return {
        language: "javascript",
        statistics: {},
        linesOfCode: linesOfCode.length
      };
    }
  }
  const pairs = keys(languages).map((key) => ({ language: key, checkers: languages[key] }));
  const results = [];
  const determine = pairs.reduce((acc, { language, checkers }) => {
    acc[language] = checkers.filter((pattern) => "deterministic" in pattern);
    return acc;
  }, {});
  for (let i = 0; i < pairs.length; i++) {
    const { language, checkers } = pairs[i];
    let points = 0;
    for (let j = 0; j < linesOfCode.length; j++) {
      if (/^\s*$/.test(linesOfCode[j]))
        continue;
      if (language in determine) {
        const determined = definitive(linesOfCode[j], checkers);
        if (determined) {
          return {
            language: determined,
            statistics: {},
            linesOfCode: j
          };
        }
      }
      if (!nearTop(j, linesOfCode)) {
        points += getPoints(linesOfCode[j], checkers.filter((checker) => !checker.nearTop));
      } else {
        points += getPoints(linesOfCode[j], checkers);
      }
    }
    results.push({ language, points });
  }
  const bestResult = results.reduce((a, b) => a.points >= b.points ? a : b, {
    points: 0,
    language: ""
  });
  const statistics = {};
  for (let i = 0; i < results.length; i++)
    statistics[results[i].language] = results[i].points;
  return {
    language: bestResult.language,
    statistics,
    linesOfCode: linesOfCode.length
  };
}
function definitive(lineOfCode, checkers) {
  for (const { pattern, deterministic, unless = null } of checkers) {
    if (pattern.test(lineOfCode) && unless !== null && !unless.test(lineOfCode)) {
      return deterministic;
    }
  }
  return false;
}
function parsePoint(type) {
  switch (type) {
    case "keyword.print":
    case "meta.import":
    case "meta.module":
      return 5;
    case "keyword.function":
    case "constant.null":
      return 4;
    case "constant.type":
    case "constant.string":
    case "constant.numeric":
    case "constant.boolean":
    case "constant.dictionary":
    case "constant.array":
    case "keyword.variable":
      return 3;
    case "section.scope":
    case "keyword.other":
    case "keyword.operator":
    case "keyword.control":
    case "keyword.visibility":
    case "keyword":
      return 2;
    case "comment.block":
    case "comment.line":
    case "comment.documentation":
    case "macro":
      return 1;
    case "not":
    default:
      return -20;
  }
}
function getPoints(lineOfCode, checkers) {
  const checker = checkers.map((o) => {
    if (o.pattern.test(lineOfCode))
      return parsePoint(o.type);
    return 0;
  });
  return checker.reduce((memo, num) => memo + num, 0);
}
function nearTop(index, linesOfCode) {
  if (linesOfCode.length <= 10)
    return true;
  return index < linesOfCode.length / 10;
}

// src/parser/language.ts
var lexmap = create(null);
var map = create(null);
{
  lexmap.markup = "markup";
  lexmap.html = "markup";
  lexmap.liquid = "markup";
  lexmap.js = "script";
  lexmap.ts = "script";
  lexmap.javascript = "script";
  lexmap.typescript = "script";
  lexmap.json = "script";
  lexmap.jsx = "script";
  lexmap.tsx = "script";
  lexmap.less = "style";
  lexmap.scss = "style";
  lexmap.sass = "style";
  lexmap.css = "style";
  lexmap.text = "text";
  lexmap.xml = "markup";
  map.javascript = "JavaScript";
  map.json = "JSON";
  map.jsx = "JSX";
  map.html = "HTML";
  map.liquid = "Liquid";
  map.markup = "markup";
  map.scss = "SCSS";
  map.text = "Plain Text";
  map.typescript = "TypeScript";
}
function setLexer(input) {
  if (typeof input !== "string")
    return "script";
  if (input.indexOf("html") > -1)
    return "markup";
  if (lexmap[input] === void 0)
    return "script";
  return lexmap[input];
}
function setLanguageName(input) {
  if (typeof input !== "string" || map[input] === void 0)
    return input.toUpperCase();
  return map[input];
}
function reference(language) {
  const result = create(null);
  result.language = language;
  result.languageName = setLanguageName(language);
  result.lexer = setLexer(language);
  return result;
}
detect.reference = reference;
detect.listen = function(callback) {
  prettify.hooks.language.push(callback);
};
function detect(sample) {
  const { language } = detectLanguage(sample);
  const result = create(null);
  result.language = language;
  result.languageName = setLanguageName(language);
  result.lexer = setLexer(language);
  if (prettify.hooks.language.length > 0) {
    for (const hook of prettify.hooks.language) {
      const langhook = hook(result);
      if (typeof langhook === "object")
        assign(result, langhook);
    }
  }
  return result;
}

// src/parser/comment.ts
function comment(prettify2) {
  const definitions2 = prettify2.definitions;
  const sindex = prettify2.source.search(/((\/(\*|\/))|{%-?\s*comment\s*-?%}|<!--)\s*@prettify\s+(\w+)?\s*{\s+/);
  const signore = prettify2.source.search(/((\/(\*|\/))|{%-?\s*comment\s*-?%}|<!--)\s*@prettify-ignore\b/);
  const k = keys(definitions2);
  const len = k.length;
  let a = 0;
  if (signore > -1 && prettify2.source.slice(0, signore).trimStart() === "")
    return false;
  if (sindex > -1 && (sindex === 0 || `"':`.indexOf(prettify2.source.charAt(sindex - 1)) < 0)) {
    let esc2 = function() {
      if (source.charAt(a2 - 1) !== "\\")
        return false;
      let x = a2;
      do {
        x = x - 1;
      } while (x > 0 && source.charAt(x) === "\\");
      return (a2 - x) % 2 === 0;
    };
    const ops = [];
    const pdcom = sindex;
    const source = prettify2.source;
    const len2 = source.length;
    let a2 = pdcom;
    let b2 = 0;
    let quote = "";
    let item = "";
    let lang = "";
    let lex = "";
    let valkey = [];
    let op = [];
    let rcb;
    let comment2;
    if (source.charAt(a2) === "<") {
      comment2 = "<!--";
    } else if (source.charAt(a2 + 1) === "/") {
      comment2 = "//";
    } else if (source.charAt(a2 + 1) === "%") {
      rcb = source.indexOf("}", a2 + 1);
      if (source[rcb - 1].charCodeAt(0) === 37 /* PER */)
        comment2 = source.slice(a2, rcb + 1);
    } else {
      comment2 = "/*";
    }
    do {
      if (source.slice(a2 - 9, a2) === "@prettify")
        break;
      a2 = a2 + 1;
    } while (a2 < len2);
    do {
      if (esc2() === false) {
        if (quote === "") {
          if (source.charAt(a2) === '"' || source.charAt(a2) === "'" || source.charAt(a2) === "`") {
            quote = source.charAt(a2);
            if (ops.length > 0 && ops[ops.length - 1].charAt(ops[ops.length - 1].length - 1) === ":")
              b2 = a2;
          } else if (/\s/.test(source.charAt(a2)) === false && b2 === 0) {
            b2 = a2;
          } else if (source.charAt(a2) === "," || /\s/.test(source.charAt(a2)) === true && b2 > 0) {
            item = source.slice(b2, a2);
            if (ops.length > 0) {
              if (ops.length > 0 && item === ":" && ops[ops.length - 1].indexOf(":") < 0) {
                ops[ops.length - 1] = ops[ops.length - 1] + item;
                b2 = a2;
              } else if (ops.length > 0 && ops[ops.length - 1].charAt(ops[ops.length - 1].length - 1) === ":") {
                ops[ops.length - 1] = ops[ops.length - 1] + item;
                b2 = 0;
              } else {
                ops.push(item);
                b2 = 0;
              }
            } else {
              ops.push(item);
              b2 = 0;
            }
          }
          if (comment2 === "<!--" && source.slice(a2 - 2, a2 + 1) === "-->")
            break;
          if (comment2 === "//" && source.charAt(a2) === "\n")
            break;
          if (comment2 === "/*" && source.slice(a2 - 1, a2 + 1) === "*/")
            break;
          if (comment2.charCodeAt(1) === 37 /* PER */ && source.slice(a2 - 1, a2 + 1) === "%" && source.indexOf("endcomment", source.indexOf("{%", rcb)) > 0)
            break;
        } else if (source.charAt(a2) === quote && quote !== "${") {
          quote = "";
        } else if (quote === "`" && source.slice(a2, a2 + 2) === "${") {
          quote = "${";
        } else if (quote === "${" && source.charAt(a2) === "}") {
          quote = "`";
        }
      }
      a2 = a2 + 1;
    } while (a2 < len2);
    if (b2 > 0) {
      quote = source.slice(b2, a2 + 1);
      if (comment2 === "<!--")
        quote = quote.replace(/\s*-+>$/, "");
      else if (comment2 === "//")
        quote = quote.replace(/\s+$/, "");
      else
        quote = quote.replace(/\s*\u002a\/$/, "");
      ops.push(quote);
    }
    a2 = ops.length;
    if (a2 > 0) {
      do {
        a2 = a2 - 1;
        if (ops[a2].indexOf(":") > 0) {
          op = [ops[a2].slice(0, ops[a2].indexOf(":")), ops[a2].slice(ops[a2].indexOf(":") + 1)];
        } else if (definitions2[ops[a2]] !== void 0 && definitions2[ops[a2]].type === "boolean") {
          prettify2.options[ops[a2]] = true;
        }
        if (op.length === 2 && definitions2[op[0]] !== void 0) {
          if (op[1].charAt(op[1].length - 1) === op[1].charAt(0) && (op[1].charAt(0) === '"' || op[1].charAt(0) === "'" || op[1].charAt(0) === "`")) {
            op[1] = op[1].slice(1, op[1].length - 1);
          }
          if (definitions2[op[0]].type === "number" && isNaN(Number(op[1])) === false) {
            prettify2.options[op[0]] = Number(op[1]);
          } else if (definitions2[op[0]].type === "boolean") {
            prettify2.options[op[0]] = op[1] === "true";
          } else {
            if (definitions2[op[0]].values !== void 0) {
              valkey = keys(definitions2[op[0]].values);
              b2 = valkey.length;
              do {
                b2 = b2 - 1;
                if (valkey[b2] === op[1]) {
                  prettify2.options[op[0]] = op[1];
                  break;
                }
              } while (b2 > 0);
            } else {
              if (op[0] === "language") {
                lang = op[1];
              } else if (op[0] === "lexer") {
                lex = op[1];
              }
              prettify2.options[op[0]] = op[1];
            }
          }
        }
      } while (a2 > 0);
      if (lex === "" && lang !== "")
        lex = setLexer(lang);
    }
  }
  if (prettify2.options.lexer === "script") {
    if (prettify2.options.script.styleGuide !== void 0) {
      switch (prettify2.options.script.styleGuide) {
        case "airbnb":
          prettify2.options.wrap = 80;
          prettify2.options.indentChar = " ";
          prettify2.options.indentSize = 2;
          prettify2.options.preserveLine = 1;
          prettify2.options.script.correct = true;
          prettify2.options.script.quoteConvert = "single";
          prettify2.options.script.variableList = "each";
          prettify2.options.script.endComma = "always";
          prettify2.options.script.bracePadding = true;
          break;
        case "crockford":
          prettify2.options.indentChar = " ";
          prettify2.options.indentSize = 4;
          prettify2.options.script.correct = true;
          prettify2.options.script.bracePadding = false;
          prettify2.options.script.elseNewline = false;
          prettify2.options.script.endComma = "never";
          prettify2.options.script.noCaseIndent = true;
          prettify2.options.script.functionSpace = true;
          prettify2.options.script.variableList = "each";
          prettify2.options.script.vertical = false;
          break;
        case "google":
          prettify2.options.wrap = -1;
          prettify2.options.indentChar = " ";
          prettify2.options.indentSize = 4;
          prettify2.options.preserveLine = 1;
          prettify2.options.script.correct = true;
          prettify2.options.script.quoteConvert = "single";
          prettify2.options.script.vertical = false;
          break;
        case "jquery":
          prettify2.options.wrap = 80;
          prettify2.options.indentChar = "	";
          prettify2.options.indentSize = 1;
          prettify2.options.script.correct = true;
          prettify2.options.script.bracePadding = true;
          prettify2.options.script.quoteConvert = "double";
          prettify2.options.script.variableList = "each";
          break;
        case "jslint":
          prettify2.options.indentChar = " ";
          prettify2.options.indentSize = 4;
          prettify2.options.script.correct = true;
          prettify2.options.script.bracePadding = false;
          prettify2.options.script.elseNewline = false;
          prettify2.options.script.endComma = "never";
          prettify2.options.script.noCaseIndent = true;
          prettify2.options.script.functionSpace = true;
          prettify2.options.script.variableList = "each";
          prettify2.options.script.vertical = false;
          break;
        case "standard":
          prettify2.options.wrap = 0;
          prettify2.options.indentChar = " ";
          prettify2.options.indentSize = 2;
          prettify2.options.endNewline = false;
          prettify2.options.preserveLine = 1;
          prettify2.options.script.correct = true;
          prettify2.options.script.noSemicolon = true;
          prettify2.options.script.endComma = "never";
          prettify2.options.script.braceNewline = false;
          prettify2.options.script.bracePadding = false;
          prettify2.options.script.braceAllman = false;
          prettify2.options.script.quoteConvert = "single";
          prettify2.options.script.functionSpace = true;
          prettify2.options.script.ternaryLine = false;
          prettify2.options.script.variableList = "each";
          prettify2.options.script.vertical = false;
          break;
        case "yandex":
          prettify2.options.script.correct = true;
          prettify2.options.script.bracePadding = false;
          prettify2.options.script.quoteConvert = "single";
          prettify2.options.script.variableList = "each";
          prettify2.options.script.vertical = false;
          break;
      }
    }
    if (prettify2.options.script.braceStyle !== void 0) {
      switch (prettify2.options.script.braceStyle) {
        case "collapse":
          prettify2.options.script.braceNewline = false;
          prettify2.options.script.bracePadding = false;
          prettify2.options.script.braceAllman = false;
          prettify2.options.script.objectIndent = "indent";
          prettify2.options.script.neverFlatten = true;
          break;
        case "collapse-preserve-inline":
          prettify2.options.script.braceNewline = false;
          prettify2.options.script.bracePadding = true;
          prettify2.options.script.braceAllman = false;
          prettify2.options.script.objectIndent = "indent";
          prettify2.options.script.neverFlatten = false;
          break;
        case "expand":
          prettify2.options.script.braceNewline = false;
          prettify2.options.script.bracePadding = false;
          prettify2.options.script.braceAllman = true;
          prettify2.options.script.objectIndent = "indent";
          prettify2.options.script.neverFlatten = true;
          break;
      }
    }
    if (prettify2.options.language === "json")
      prettify2.options.wrap = 0;
  }
  do {
    if (prettify2.options[keys[a]] !== void 0) {
      definitions2[keys[a]].lexer.length;
    }
    a = a + 1;
  } while (a < len);
}

// src/parser/mode.ts
function parser(prettify2) {
  const langname = prettify2.options.language;
  const langlexer = prettify2.options.lexer;
  parse.count = -1;
  parse.linesSpace = 0;
  parse.lineNumber = 1;
  parse.data.begin = [];
  parse.data.ender = [];
  parse.data.lexer = [];
  parse.data.lines = [];
  parse.data.stack = [];
  parse.data.token = [];
  parse.data.types = [];
  parse.datanames = [
    "begin",
    "ender",
    "lexer",
    "lines",
    "stack",
    "token",
    "types"
  ];
  parse.structure = [["global", -1]];
  parse.structure.pop = function pop() {
    const len = parse.structure.length - 1;
    const arr = parse.structure[len];
    if (len > 0)
      parse.structure.splice(len, 1);
    return arr;
  };
  if (prettify2.options.language === "auto" || prettify2.options.lexer === "auto") {
    const lang = detect(prettify2.source);
    if (prettify2.options.language === "auto")
      prettify2.options.language = lang.language;
    if (prettify2.options.lexer === "auto")
      prettify2.options.lexer = lang.lexer;
  }
  if (typeof prettify2.lexers[prettify2.options.lexer] === "function") {
    parse.references = [[]];
    parse.error = "";
    for (const lexer of keys(prettify2.lexers)) {
      if (prettify2.options.language === "json") {
        prettify2.options.json = prettify2.options.json || create(null);
      } else {
        prettify2.options[lexer] = prettify2.options[lexer] || create(null);
      }
    }
    prettify2.lexers[prettify2.options.lexer](`${prettify2.source} `);
  } else {
    parse.error = `Specified lexer, ${prettify2.options.lexer}, is not a function.`;
  }
  let a = 0;
  let b = 0;
  const k = keys(parse.data);
  const c = k.length;
  do {
    b = a + 1;
    do {
      if (parse.data[k[a]].length !== parse.data[k[b]].length) {
        parse.error = `"${k[a]}" array is of different length than "${k[b]}"`;
        break;
      }
      b = b + 1;
    } while (b < c);
    a = a + 1;
  } while (a < c - 1);
  if (parse.data.begin.length > 0) {
    if (prettify2.options.lexer === "script" && prettify2.options[prettify2.options.lexer].objectSort) {
      parse.sortCorrection(0, parse.count + 1);
    } else if (prettify2.options.lexer === "style" && prettify2.options[prettify2.options.lexer].sortProperties) {
      parse.sortCorrection(0, parse.count + 1);
    }
  }
  prettify2.options.language = langname;
  prettify2.options.lexer = langlexer;
  return parse.data;
}
function mode(prettify2) {
  const start = Date.now();
  const mv = prettify2.mode;
  const lf = prettify2.options.crlf === true ? "\r\n" : "\n";
  let result = "";
  if (prettify2.source.trimStart() === "") {
    const preserve = new RegExp(`\\n{${prettify2.options.preserveLine},}`);
    result = prettify2.source;
    result = prettify2.source.replace(preserve, "\n\n");
    result = prettify2.options.endNewline === true ? result.replace(/\s*$/, lf) : result.replace(/\s+$/, "");
    prettify2.stats.chars = result.length;
    prettify2.stats.language = prettify2.options.languageName;
    prettify2.stats.size = size(result.length);
    prettify2.stats.time = (Date.now() - start).toFixed(1);
    return result;
  }
  if (prettify2.options.language === "text") {
    prettify2.options.language = "auto";
  }
  if (prettify2.options.lexer === "text") {
    prettify2.options.lexer = "auto";
  }
  if (prettify2.options.language === "text" || prettify2.options.lexer === "text") {
    prettify2.options.language = "text";
    prettify2.options.languageName = "Plain Text";
    prettify2.options.lexer = "text";
  } else if (prettify2.options.language === "auto" && prettify2.options.lexer === "auto") {
    const lang = detect(prettify2.source);
    if (lang.language === "text") {
      lang.language = "html";
      lang.lexer = "markup";
      lang.languageName = "HTML";
    }
    if (prettify2.options.lexer === "auto") {
      prettify2.options.lexer = lang.lexer;
    }
    if (prettify2.options.language === "auto") {
      prettify2.options.language = lang.language;
      prettify2.options.languageName = lang.languageName;
    }
  } else {
    prettify2.options.lexer = "markup";
  }
  prettify2.stats.language = prettify2.options.languageName;
  const comm = comment(prettify2);
  if (comm === false) {
    prettify2.stats.time = -1;
    prettify2.stats.chars = prettify2.source.length;
    prettify2.stats.size = size(prettify2.stats.chars);
    return prettify2.source;
  }
  prettify2.parsed = parser(prettify2);
  if (mv === "parse") {
    prettify2.stats.time = (Date.now() - start).toFixed(1);
    prettify2.stats.chars = prettify2.source.length;
    prettify2.stats.size = size(prettify2.stats.chars);
    return prettify2.parsed;
  }
  result = prettify2.beautify[prettify2.options.lexer](prettify2.options);
  result = prettify2.options.endNewline === true ? result.replace(/\s*$/, lf) : result.replace(/\s+$/, "");
  const length = result.length;
  prettify2.stats.chars = length;
  prettify2.stats.size = size(length);
  prettify2.stats.time = (Date.now() - start).toFixed(1);
  prettify2.end = 0;
  prettify2.start = 0;
  return result;
}

// src/prettify.ts
format.before = function(callback) {
  prettify.hooks.before.push(callback);
};
format.after = function(callback) {
  prettify.hooks.after.push(callback);
};
options.listen = function(callback) {
  prettify.hooks.rules.push(callback);
};
Object.defineProperty(format, "stats", {
  get() {
    return prettify.stats;
  }
});
Object.defineProperty(options, "rules", {
  get() {
    return prettify.options;
  }
});
function format(source, rules) {
  prettify.source = source;
  if (typeof rules === "object")
    prettify.options = options(rules);
  if (prettify.hooks.before.length > 0) {
    for (const cb of prettify.hooks.before) {
      if (cb(prettify.options, source) === false)
        return source;
    }
  }
  const output = mode(prettify);
  if (prettify.hooks.after.length > 0) {
    for (const cb of prettify.hooks.after) {
      if (cb.call(prettify.parsed, output, prettify.options) === false)
        return source;
    }
  }
  return new Promise((resolve, reject) => {
    if (parse.error.length)
      return reject(parse.error);
    return resolve(output);
  });
}
function options(rules) {
  var _a, _b;
  for (const rule of keys(rules)) {
    if (((_b = (_a = definitions) == null ? void 0 : _a[rule]) == null ? void 0 : _b.lexer) === "auto") {
      prettify.options[rule] = rules[rule];
    } else if (rule === "markup") {
      assign(prettify.options.markup, rules.markup);
    } else if (rule === "script") {
      assign(prettify.options.script, rules.script);
    } else if (rule === "style") {
      assign(prettify.options.style, rules.style);
    } else if (rule === "json") {
      assign(prettify.options.script, rules.script);
    } else if (rule in prettify.options) {
      prettify.options[rule] = rules[rule];
    }
  }
  if (prettify.hooks.rules.length > 0) {
    for (const cb of prettify.hooks.rules)
      cb(prettify.options);
  }
  return prettify.options;
}
function parse2(source, rules) {
  prettify.source = source;
  prettify.mode = "parse";
  if (typeof rules === "object")
    prettify.options = options(rules);
  const formatted = mode(prettify);
  return new Promise((resolve, reject) => {
    if (parse.error.length)
      return reject(parse.error);
    return resolve(formatted);
  });
}
