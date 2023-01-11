// src/utils/chars.ts
var NIL = "";
var WSP = " ";
var NWL = "\n";

// src/utils/native.ts
var assign = Object.assign;
var keys = Object.keys;
var defineProperties = Object.defineProperties;
var isArray = Array.isArray;

// src/model.ts
var prettify = function(rules2) {
  const env = typeof process !== "undefined" && process.versions != null ? "node" : "browser";
  const events2 = {
    before: [],
    language: [],
    rules: [],
    after: []
  };
  const stats3 = {
    chars: -1,
    time: "",
    size: "",
    language: ""
  };
  let input = NIL;
  let parse2;
  return {
    env,
    mode: "beautify",
    lexer: "auto",
    end: 0,
    iterator: 0,
    start: 0,
    error: {},
    beautify: {
      script: void 0,
      style: void 0,
      markup: void 0
    },
    lexers: {
      script: void 0,
      style: void 0,
      markup: void 0
    },
    get rules() {
      return rules2;
    },
    get data() {
      return parse2;
    },
    set data(data) {
      parse2 = data;
    },
    get source() {
      return env === "node" && Buffer.isBuffer(input) ? input.toString() : input;
    },
    set source(source) {
      input = env === "node" ? Buffer.isBuffer(source) ? source : Buffer.from(source) : source;
    },
    get stats() {
      return stats3;
    },
    set stats(data) {
      assign(data, stats3);
    },
    get events() {
      return events2;
    }
  };
}(
  {
    crlf: false,
    language: "auto",
    languageName: "",
    endNewline: false,
    indentChar: " ",
    indentLevel: 0,
    indentSize: 2,
    preserveLine: 2,
    wrap: 0,
    liquid: {
      commentNewline: false,
      commentIndent: true,
      delimiterTrims: "preserve",
      ignoreTagList: [],
      lineBreakSeparator: "default",
      normalizeSpacing: true,
      preserveComment: false,
      quoteConvert: "none",
      valueForce: "intent"
    },
    markup: {
      attributeCasing: "preserve",
      attributeSort: false,
      attributeSortList: [],
      correct: false,
      commentNewline: false,
      commentIndent: true,
      delimiterForce: false,
      forceAttribute: 3,
      forceLeadAttribute: true,
      forceIndent: false,
      ignoreCSS: false,
      ignoreJS: true,
      ignoreJSON: false,
      preserveComment: false,
      preserveText: false,
      preserveAttributes: false,
      selfCloseSpace: true,
      quoteConvert: "none"
    },
    json: {
      arrayFormat: "default",
      braceAllman: false,
      bracePadding: false,
      objectIndent: "default",
      objectSort: false
    },
    style: {
      correct: false,
      atRuleSpace: true,
      classPadding: false,
      noLeadZero: false,
      sortSelectors: false,
      sortProperties: false,
      quoteConvert: "none"
    },
    script: {
      arrayFormat: "default",
      braceNewline: false,
      bracePadding: false,
      braceStyle: "none",
      braceAllman: false,
      caseSpace: false,
      commentIndent: false,
      commentNewline: false,
      correct: false,
      elseNewline: false,
      endComma: "never",
      functionNameSpace: false,
      functionSpace: false,
      methodChain: 4,
      neverFlatten: false,
      noCaseIndent: false,
      noSemicolon: false,
      objectSort: false,
      objectIndent: "default",
      preserveComment: false,
      quoteConvert: "none",
      styleGuide: "none",
      ternaryLine: false,
      variableList: "none",
      vertical: false
    }
  }
);

// src/shared/grammar.ts
function LiquidGrammar(grammar2 = {
  embedded: {
    schema: [
      {
        language: "json"
      }
    ],
    style: [
      {
        language: "css"
      }
    ],
    stylesheet: [
      {
        language: "css"
      },
      {
        language: "scss",
        argument: /['"]scss['"]/
      }
    ],
    javascript: [
      {
        language: "javascript"
      }
    ]
  },
  tags: [
    "form",
    "paginate",
    "capture",
    "case",
    "comment",
    "for",
    "if",
    "raw",
    "tablerow",
    "unless",
    "schema",
    "style",
    "script",
    "stylesheet",
    "javascript"
  ],
  control: [
    "if",
    "unless",
    "case"
  ],
  else: [
    "else",
    "elsif"
  ],
  singletons: [
    "include",
    "layout",
    "section",
    "assign",
    "liquid",
    "break",
    "continue",
    "cycle",
    "decrement",
    "echo",
    "increment",
    "render",
    "when"
  ]
}) {
  const ELSE = new Set(grammar2.else);
  const CONTROL = new Set(grammar2.control);
  const TAGS = new Set(grammar2.tags);
  const SINGLETON = new Set(grammar2.singletons);
  const EMBEDDED = {};
  embed(grammar2.embedded);
  return {
    get grammar() {
      return grammar2;
    },
    get tags() {
      return TAGS;
    },
    get control() {
      return CONTROL;
    },
    get else() {
      return ELSE;
    },
    get singleton() {
      return SINGLETON;
    },
    get embed() {
      return EMBEDDED;
    },
    extend(rules2) {
      for (const rule in rules2) {
        if (isArray(rules2[rule])) {
          for (const tag of rules2[rule]) {
            if (rule === "tags" && TAGS.has(tag) === false) {
              grammar2.tags.push(tag);
              TAGS.add(tag);
            } else if (rule === "else" && ELSE.has(tag) === false) {
              grammar2.else.push(tag);
              ELSE.add(tag);
            } else if (rule === "control" && CONTROL.has(tag)) {
              grammar2.control.push(tag);
              CONTROL.add(tag);
            } else if (rule === "singletons" && SINGLETON.has(tag) === false) {
              grammar2.singletons.push(tag);
              SINGLETON.add(tag);
            }
          }
        } else if (rule === "embed") {
          if (typeof rules2[rule] === "object") {
            embed(rules2[rule]);
          }
        }
      }
    }
  };
  function embed(rules2) {
    for (const tag in rules2) {
      for (const { language: language2, argument = null } of rules2[tag]) {
        if (!(tag in EMBEDDED)) {
          EMBEDDED[tag] = {
            tag,
            language: language2,
            args: /* @__PURE__ */ new Map([[/* @__PURE__ */ new Set(), { tag, language: language2 }]])
          };
        }
        if (argument) {
          for (const [match] of EMBEDDED[tag].args) {
            if (match === null)
              continue;
            if (isArray(argument)) {
              for (const arg of argument)
                if (!match.has(arg))
                  match.add(arg);
            } else {
              const exp = new RegExp(argument);
              if (match.size > 0) {
                for (const m of match) {
                  if (!(m instanceof RegExp))
                    continue;
                  if (m.source !== exp.source)
                    match.add(exp);
                }
              } else {
                match.add(exp);
              }
            }
          }
        }
      }
    }
  }
}
function HTMLGrammar(grammar2 = {
  embedded: {
    script: [
      {
        language: "javascript"
      },
      {
        language: "json",
        attribute: {
          type: [
            "application/json",
            "application/ld+json"
          ]
        }
      },
      {
        language: "jsx",
        attribute: {
          type: [
            "text/jsx",
            "application/jsx"
          ]
        }
      }
    ],
    style: [
      {
        language: "css"
      }
    ]
  },
  svg: [
    "a",
    "altGlyph",
    "altGlyphDef",
    "altGlyphItem",
    "animate",
    "animateColor",
    "animateMotion",
    "animateTransform",
    "circle",
    "clipPath",
    "color-profile",
    "cursor",
    "defs",
    "desc",
    "ellipse",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "filter",
    "font",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "foreignObject",
    "g",
    "glyph",
    "glyphRef",
    "hkern",
    "image",
    "line",
    "linearGradient",
    "marker",
    "mask",
    "metadata",
    "missing-glyph",
    "mpath",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "script",
    "set",
    "stop",
    "style",
    "switch",
    "symbol",
    "text",
    "textPath",
    "title",
    "tref",
    "tspan",
    "use",
    "view",
    "vkern"
  ],
  voids: [
    "area",
    "base",
    "br",
    "col",
    "command",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "menuitem",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ],
  tags: [
    "a",
    "abbr",
    "acronym",
    "address",
    "applet",
    "article",
    "aside",
    "audio",
    "b",
    "basefont",
    "bdi",
    "bdo",
    "big",
    "blockquote",
    "body",
    "button",
    "canvas",
    "caption",
    "center",
    "cite",
    "code",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "dir",
    "div",
    "dl",
    "dt",
    "em",
    "fieldset",
    "figcaption",
    "figure",
    "figure",
    "font",
    "footer",
    "form",
    "frame",
    "frameset",
    "h1",
    "h6",
    "head",
    "header",
    "html",
    "i",
    "iframe",
    "ins",
    "isindex",
    "kbd",
    "label",
    "legend",
    "fieldset",
    "li",
    "main",
    "map",
    "mark",
    "marquee",
    "menu",
    "meter",
    "nav",
    "noframes",
    "frame",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "object",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "small",
    "picture",
    "video",
    "audio",
    "span",
    "strike",
    "strong",
    "style",
    "sub",
    "summary",
    "details",
    "sup",
    "svg",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "audio",
    "video",
    "tt",
    "u",
    "ul",
    "var",
    "video"
  ]
}) {
  const SVG = new Set(grammar2.svg);
  const TAGS = new Set(grammar2.tags);
  const VOIDS = new Set(grammar2.voids);
  const EMBEDDED = {};
  embed(grammar2.embedded);
  return {
    get grammar() {
      return grammar2;
    },
    get svg() {
      return SVG;
    },
    get tags() {
      return TAGS;
    },
    get voids() {
      return VOIDS;
    },
    get embed() {
      return EMBEDDED;
    },
    extend(rules2) {
      for (const rule in rules2) {
        if (isArray(rules2[rule])) {
          for (const tag of rules2[rule]) {
            if (rule === "tags" && TAGS.has(tag) === false) {
              grammar2.tags.push(tag);
              TAGS.add(tag);
            } else if (rule === "voids" && VOIDS.has(tag) === false) {
              grammar2.voids.push(tag);
              VOIDS.add(tag);
            } else if (rule === "svg" && SVG.has(tag) === false) {
              grammar2.svg.push(tag);
              SVG.add(tag);
            }
          }
        } else if (rule === "embedded") {
          if (typeof rules2[rule] === "object") {
            embed(rules2[rule]);
          }
        }
      }
    }
  };
  function embed(rules2) {
    for (const tag in rules2) {
      if (!(tag in EMBEDDED))
        EMBEDDED[tag] = { tag, attr: /* @__PURE__ */ new Map() };
      for (const { language: language2, attribute } of rules2[tag]) {
        if (!("language" in EMBEDDED[tag]))
          EMBEDDED[tag].language = language2;
        if (!EMBEDDED[tag].attr.has(language2)) {
          EMBEDDED[tag].attr.set(language2, { tag, language: language2, attr: /* @__PURE__ */ new Map() });
        }
        if (attribute) {
          const entry = EMBEDDED[tag].attr.get(language2);
          for (const attr in attribute) {
            if (!entry.attr.has(attr)) {
              entry.attr.set(attr, {
                tag,
                language: language2,
                attr,
                value: /* @__PURE__ */ new Set()
              });
            }
            const curr = EMBEDDED[tag].attr.get(language2).attr.get(attr);
            if (isArray(attribute[attr])) {
              for (const arg of attribute[attr])
                if (!curr.value.has(arg))
                  curr.value.add(arg);
            } else {
              const exp = new RegExp(attribute[attr]);
              if (curr.value.size > 0) {
                for (const m of curr.value) {
                  if (!(m instanceof RegExp))
                    continue;
                  if (m.source !== exp.source)
                    curr.value.add(exp);
                }
              } else {
                curr.value.add(exp);
              }
            }
          }
        }
      }
    }
  }
}
function CSSGrammar(grammar2 = {
  units: [
    "%",
    "cap",
    "ch",
    "cm",
    "deg",
    "dpcm",
    "dpi",
    "dppx",
    "em",
    "ex",
    "fr",
    "grad",
    "Hz",
    "ic",
    "in",
    "kHz",
    "lh",
    "mm",
    "ms",
    "mS",
    "pc",
    "pt",
    "px",
    "Q",
    "rad",
    "rem",
    "rlh",
    "s",
    "turn",
    "vb",
    "vh",
    "vi",
    "vmax",
    "vmin",
    "vw"
  ],
  atrules: [
    "@charset",
    "@color-profile",
    "@counter-style",
    "@font-face",
    "@font-feature-values",
    "@font-palette-values",
    "@import",
    "@keyframes",
    "@layer",
    "@media",
    "@namespace",
    "@page",
    "@supports"
  ],
  webkit: {
    classes: [
      "webkit-any",
      "webkit-any-link*",
      "webkit-autofill"
    ],
    elements: [
      "webkit-file-upload-button",
      "webkit-inner-spin-button",
      "webkit-input-placeholder",
      "webkit-meter-bar",
      "webkit-meter-even-less-good-value",
      "webkit-meter-inner-element",
      "webkit-meter-optimum-value",
      "webkit-meter-suboptimum-value",
      "webkit-outer-spin-button",
      "webkit-progress-bar",
      "webkit-progress-inner-element",
      "webkit-progress-value",
      "webkit-search-cancel-button",
      "webkit-search-results-button",
      "webkit-slider-runnable-track",
      "webkit-slider-thumb"
    ]
  },
  pseudo: {
    classes: [
      "active",
      "any-link",
      "checked",
      "default",
      "defined",
      "disabled",
      "empty",
      "enabled",
      "first",
      "first-child",
      "first-of-type",
      "fullscreen",
      "focus",
      "focus-visible",
      "focus-within",
      "host",
      "hover",
      "indeterminate",
      "in-range",
      "invalid",
      "is",
      "lang",
      "last-child",
      "last-of-type",
      "left",
      "link",
      "modal",
      "not",
      "nth-child",
      "nth-col",
      "nth-last-child",
      "nth-last-of-type",
      "nth-of-type",
      "only-child",
      "only-of-type",
      "optional",
      "out-of-range",
      "picture-in-picture",
      "placeholder-shown",
      "paused",
      "playing",
      "read-only",
      "read-write",
      "required",
      "right",
      "root",
      "scope",
      "target",
      "valid",
      "visited",
      "where"
    ],
    elements: [
      "after",
      "backdrop",
      "before",
      "cue",
      "cue-region",
      "first-letter",
      "first-line",
      "file-selector-button",
      "marker",
      "part",
      "placeholder",
      "selection",
      "slotted"
    ],
    functions: [
      "after",
      "before",
      "first-letter",
      "first-line",
      "host",
      "host-context",
      "part",
      "slotted",
      "lang",
      "not",
      "nth-child",
      "nth-col",
      "nth-last-child",
      "nth-last-of-type",
      "nth-of-type",
      "where"
    ]
  }
}) {
  const UNITS = new Set(grammar2.units);
  const ATRULES = new Set(grammar2.atrules);
  const PSEUDO_CLASSES = new Set(grammar2.pseudo.classes);
  const PSEUDO_ELEMENTS = new Set(grammar2.pseudo.elements);
  const PSEUDO_FUNCTIONS = new Set(grammar2.pseudo.functions);
  const WEBKIT_ELEMENTS = new Set(grammar2.webkit.elements);
  const WEBKIT_CLASSES = new Set(grammar2.webkit.classes);
  return {
    get grammar() {
      return grammar2;
    },
    get units() {
      return UNITS;
    },
    get atrules() {
      return ATRULES;
    },
    get pseudoClasses() {
      return PSEUDO_CLASSES;
    },
    get pseudoElements() {
      return PSEUDO_ELEMENTS;
    },
    get pseudoFunctions() {
      return PSEUDO_FUNCTIONS;
    },
    get webkitElements() {
      return WEBKIT_ELEMENTS;
    },
    get webkitClasses() {
      return WEBKIT_CLASSES;
    },
    extend(rules2) {
      for (const rule in rules2) {
        if (isArray(rules2[rule])) {
          for (const tag of rules2[rule]) {
            if (rule === "units" && !UNITS.has(tag)) {
              grammar2[rule].push(tag);
              UNITS.add(tag);
            } else if (rule === "atrules" && !ATRULES.has(tag)) {
              grammar2[rule].push(tag);
              ATRULES.add(tag);
            }
          }
        }
        if (typeof rules2[rule] === "object") {
          for (const prop in rules2[rule]) {
            if (isArray(rules2[rule][prop])) {
              for (const tag of rules2[rule][prop]) {
                if (rule === "webkit") {
                  if (prop === "elements") {
                    grammar2[rule][prop].push(tag);
                    WEBKIT_ELEMENTS.add(tag);
                  } else if (prop === "classes") {
                    grammar2[rule][prop].push(tag);
                    WEBKIT_CLASSES.add(tag);
                  }
                } else if (rule === "pseudo") {
                  if (prop === "elements") {
                    grammar2[rule][prop].push(tag);
                    PSEUDO_ELEMENTS.add(tag);
                  } else if (prop === "classes") {
                    grammar2[rule][prop].push(tag);
                    PSEUDO_CLASSES.add(tag);
                  } else if (prop === "functions") {
                    grammar2[rule][prop].push(tag);
                    PSEUDO_FUNCTIONS.add(tag);
                  }
                }
              }
            }
          }
        }
      }
    }
  };
}
function JavaScriptGrammar(grammar2 = {
  keywords: [
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
  ]
}) {
  const KEYWORDS = new Set(grammar2.keywords);
  return {
    get grammar() {
      return grammar2;
    },
    get keywords() {
      return KEYWORDS;
    },
    extend(rules2) {
      for (const rule in rules2) {
        if (isArray(rules2[rule])) {
          for (const tag of rules2[rule]) {
            if (rule === "keywords" && !KEYWORDS.has(tag)) {
              grammar2[rule].push(tag);
              KEYWORDS.add(tag);
            }
          }
        }
      }
    }
  };
}
var grammar = new class Grammar {
  constructor() {
    this.css = CSSGrammar();
    this.liquid = LiquidGrammar();
    this.js = JavaScriptGrammar();
    this.html = HTMLGrammar();
  }
  extend(options) {
    if (options) {
      for (const language2 in options) {
        if (language2 === "liquid") {
          this.liquid.extend(options.liquid);
        } else if (language2 === "html") {
          this.html.extend(options.html);
        } else if (language2 === "css") {
          this.css.extend(options.css);
        } else if (language2 === "js") {
          this.js.extend(options.js);
        }
      }
    }
    return this;
  }
}();

// src/utils/helpers.ts
function join(...message) {
  return message.join(NWL);
}
function repeatChar(count, character = WSP) {
  if (count === 0)
    return character;
  let char = NIL;
  let i = 1;
  do {
    char += character;
  } while (i++ < count);
  return char;
}
function is(string, code) {
  return string ? string.charCodeAt(0) === code : false;
}
is.last = function(string, code) {
  return is(string[string.length - 1], code);
};
function not(string, code) {
  return is(string, code) === false;
}
not.last = function(string, code) {
  return is.last(string, code) === false;
};
function ws(string) {
  return /\s/.test(string);
}
function digit(string) {
  return /\d/.test(string);
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
function sanitizeComment(input) {
  return `\\${input}`;
}
function getTagName(tag, slice = NaN) {
  if (typeof tag !== "string")
    return NIL;
  if (not(tag, 60 /* LAN */) && not(tag, 123 /* LCB */))
    return tag;
  if (is(tag, 60 /* LAN */)) {
    const next = tag.search(/[\s>]/);
    const name2 = tag.slice(is(tag[1], 47 /* FWS */) ? 2 : 1, next);
    return is(name2, 63 /* QWS */) && is.last(name2, 63 /* QWS */) ? "xml" : isNaN(slice) ? name2.toLowerCase() : name2.slice(slice).toLowerCase();
  }
  const name = is(tag[2], 45 /* DSH */) ? tag.slice(3).trimStart() : tag.slice(2).trimStart();
  const tname = name.slice(0, name.search(/[\s=|!<>,.[]|-?[%}]}/)).toLowerCase();
  return isNaN(slice) ? tname : tname.slice(slice);
}
function isLiquidControl(input) {
  const begin = input.indexOf("{");
  if (is(input[begin + 1], 37 /* PER */)) {
    let token;
    token = input.slice(begin + (is(input[begin + 2], 45 /* DSH */) ? 3 : 2)).trimStart();
    token = token.slice(0, token.search(/[\s=|!<>,.[]|-?[%}]}/));
    return token.startsWith("end") ? false : grammar.liquid.control.has(token);
  }
  return false;
}
function isLiquidElse(input) {
  const begin = input.indexOf("{");
  if (is(input[begin + 1], 37 /* PER */)) {
    let token;
    token = input.slice(begin + (is(input[begin + 2], 45 /* DSH */) ? 3 : 2)).trimStart();
    token = token.slice(0, token.search(/[\s=|!<>,.[]|-?[%}]}/));
    return token.startsWith("end") ? false : grammar.liquid.else.has(token);
  }
  return false;
}
function isValueLiquid(input) {
  const eq = input.indexOf("=");
  if (eq > -1) {
    if (is(input[eq + 1], 34 /* DQO */) || is(input[eq + 1], 39 /* SQO */)) {
      return /{%-?\s*end[a-z]+/.test(input.slice(eq, input.lastIndexOf(input[eq + 1])));
    }
  }
  return false;
}
function isLiquidLine(input) {
  if (isLiquidStart(input))
    return /{%-?\s*end\w+/.test(input);
  return false;
}
function isLiquidStart(input, strict = false) {
  let token;
  if (strict) {
    if (is(input[0], 123 /* LCB */) && is(input[1], 37 /* PER */) && is(input[input.length - 2], 37 /* PER */) && is(input[input.length - 1], 125 /* RCB */)) {
      token = input.slice(is(input[2], 45 /* DSH */) ? 3 : 2).trimStart();
      if (is(token, 34 /* DQO */) || is(token, 39 /* SQO */))
        return false;
      token = token.slice(0, token.search(/[\s=|!<"'>,.[]|-?[%}]}/));
      return token.startsWith("end") ? false : grammar.liquid.tags.has(token);
    }
    return false;
  }
  let begin = input.indexOf("{");
  if (begin === -1)
    return false;
  do {
    if (is(input[begin + 1], 37 /* PER */)) {
      token = input.slice(begin + (is(input[begin + 2], 45 /* DSH */) ? 3 : 2)).trimStart();
      token = token.slice(0, token.search(/[\s=|!<>,.[]|-?[%}]}/));
      return token.startsWith("end") ? false : grammar.liquid.tags.has(token);
    }
    begin = input.indexOf("{", begin + 1);
  } while (begin > -1);
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
function isLiquid(input, type) {
  if (type === 1 /* Open */) {
    return is(input[0], 123 /* LCB */) && (is(input[1], 37 /* PER */) || is(input[1], 123 /* LCB */));
  } else if (type === 6 /* OpenTag */) {
    return is(input[0], 123 /* LCB */) && is(input[1], 37 /* PER */);
  } else if (type === 7 /* OpenOutput */) {
    return is(input[0], 123 /* LCB */) && is(input[1], 123 /* LCB */);
  } else if (type === 8 /* CloseTag */) {
    return is(input[input.length - 2], 37 /* PER */) && is(input[input.length - 1], 125 /* RCB */);
  } else if (type === 9 /* CloseOutput */) {
    return is(input[input.length - 2], 125 /* RCB */) && is(input[input.length - 1], 125 /* RCB */);
  } else if (type === 4 /* HasOpen */) {
    return /{[{%]/.test(input);
  } else if (type === 5 /* HasOpenAndClose */) {
    return /{[{%]/.test(input) && /[%}]}/.test(input);
  } else if (type === 2 /* Close */) {
    const size2 = input.length;
    return is(input[size2 - 1], 125 /* RCB */) && (is(input[size2 - 2], 37 /* PER */) || is(input[size2 - 2], 125 /* RCB */));
  } else if (type === 3 /* OpenAndClose */) {
    const size2 = input.length;
    return is(input[0], 123 /* LCB */) && (is(input[1], 37 /* PER */) || is(input[1], 123 /* LCB */)) && (is(input[size2 - 1], 125 /* RCB */) && (is(input[size2 - 2], 37 /* PER */) || is(input[size2 - 2], 125 /* RCB */)));
  }
}
function safeSortAscend(item) {
  let c = 0;
  const len = item.length;
  const storeb = item;
  const safeSortAscendChild = () => {
    let a = 0;
    const lenc = storeb.length;
    if (a < lenc) {
      do {
        if (isArray(storeb[a]) === true)
          storeb[a] = safeSortAscend.apply(this, storeb[a]);
        a = a + 1;
      } while (a < lenc);
    }
  };
  const safeSortAscendRecurse = (value) => {
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
      safeSortAscendRecurse("");
    } else {
      if (this.recursive === true)
        safeSortAscendChild();
      item = storeb;
    }
    return value;
  };
  safeSortAscendRecurse("");
  return item;
}
function safeSortDescend(item) {
  let c = 0;
  const len = item.length;
  const storeb = item;
  const safeSortDescendChild = () => {
    let a = 0;
    const lenc = storeb.length;
    if (a < lenc) {
      do {
        if (isArray(storeb[a]))
          storeb[a] = safeSortDescend.apply(this, storeb[a]);
        a = a + 1;
      } while (a < lenc);
    }
  };
  const safeSortDescendRecurse = (value) => {
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
      safeSortDescendRecurse("");
    } else {
      if (this.recursive === true)
        safeSortDescendChild();
      item = storeb;
    }
    return value;
  };
  safeSortDescendRecurse("");
  return item;
}
function safeSortNormal(item) {
  let storeb = item;
  const done = [item[0]];
  const safeSortNormalChild = () => {
    let a = 0;
    const len = storeb.length;
    if (a < len) {
      do {
        if (isArray(storeb[a]))
          storeb[a] = safeSortNormal.apply(this, storeb[a]);
        a = a + 1;
      } while (a < len);
    }
  };
  const safeSortNormalRecurse = (x) => {
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
      safeSortNormalRecurse(storea[0]);
    } else {
      if (this.recursive === true)
        safeSortNormalChild();
      item = storeb;
    }
  };
  safeSortNormalRecurse(this.array[0]);
  return item;
}

// src/parse/detection.ts
var lexmap = {
  markup: "markup",
  html: "markup",
  liquid: "markup",
  xml: "markup",
  javascript: "script",
  typescript: "script",
  jsx: "script",
  tsx: "script",
  json: "script",
  less: "style",
  scss: "style",
  sass: "style",
  css: "style",
  text: "text"
};
var langmap = {
  html: "HTML",
  xhtml: "XHTML",
  liquid: "Liquid",
  xml: "XML",
  jsx: "JSX",
  tsx: "TSX",
  json: "JSON",
  yaml: "YAML",
  css: "CSS",
  scss: "SCSS",
  sass: "SASS",
  less: "LESS",
  text: "Plain Text",
  javascript: "JavaScript",
  typescript: "TypeScript"
};
function setLexer(input) {
  return typeof input !== "string" || input.indexOf("html") > -1 || lexmap[input] === void 0 ? "markup" : lexmap[input];
}
function setLanguageName(input) {
  if (typeof input !== "string" || langmap[input] === void 0)
    return input.toUpperCase();
  return langmap[input];
}
function reference(language2) {
  const result = {};
  if (language2 === "unknown") {
    result.language = language2;
    result.languageName = "Unknown";
    result.lexer = "markup";
  } else if (language2 === "xhtml" || language2 === "markup") {
    result.language = "xml";
    result.languageName = "XHTML";
    result.lexer = "markup";
  } else {
    result.language = language2;
    result.languageName = setLanguageName(language2);
    result.lexer = setLexer(language2);
  }
  if (prettify.events.language.length > 0) {
    for (const hook of prettify.events.language) {
      const langhook = hook(result);
      if (typeof langhook === "object")
        assign(result, langhook);
    }
  }
  return result;
}
detect.reference = reference;
detect.listen = function(callback) {
  prettify.events.language.push(callback);
};
function detect(sample) {
  let b = [];
  let c = 0;
  const vartest = /(((var)|(let)|(const)|(function)|(import))\s+(\w|\$)+[a-zA-Z0-9]*)/.test(sample) && /@import/.test(sample) === false;
  const finalstatic = /((((final)|(public)|(private))\s+static)|(static\s+void))/.test(sample);
  function isStyle() {
    if (/\n\s*#+\s+/.test(sample) || /^#+\s+/.test(sample))
      return reference("markdown");
    if (/\$[a-zA-Z]/.test(sample) || /\{\s*(\w|\.|\$|#)+\s*\{/.test(sample) || /^[.#]?[\w][\w-]+\s+\{(?:\s+[a-z][a-z-]+:\s*\S+;)+\s+[&>+]?\s+[.#:]?[\w][\w-]\s+\{/.test(sample) && /:\s*@[a-zA-Z];/.test(sample) === false)
      return reference("scss");
    if (/@[a-zA-Z]:/.test(sample) || /\.[a-zA-Z]\(\);/.test(sample))
      return reference("less");
    return reference("css");
  }
  function notMarkup() {
    let d = 1;
    let join2 = NIL;
    let flaga = false;
    let flagb = false;
    const pp = /((public)|(private))\s+(static\s+)?(((v|V)oid)|(class)|(final))/.test(sample);
    function isScript() {
      if (sample.indexOf("(") > -1 || sample.indexOf("=") > -1 || sample.indexOf(";") > -1 && sample.indexOf("{") > -1) {
        if (finalstatic === true || /\w<\w+(,\s+\w+)*>/.test(sample))
          return reference("typescript");
        if (/(?:var|let|const)\s+\w+\s*:/.test(sample) || /=\s*<\w+/.test(sample))
          return reference("typescript");
        return reference("javascript");
      }
      return reference("unknown");
    }
    function isScriptOrStyle() {
      if (/:\s*(?:number|string|boolean|any|unknown)(?:\[\])?/.test(sample) || /(?:public|private)\s+/.test(sample) || /(?:export|declare)\s+type\s+\w+\s*=/.test(sample) || /(?:namespace|interface|enum|implements|declare)\s+\w+/.test(sample) || /(?:typeof|keyof|as)\s+\w+/.test(sample) || /\w+\s+as\s+\w+/.test(sample) || /\[\w+(?:(?::\s*\w+)|(?:\s+in\s+\w+))\]:/.test(sample) || /\):\s*\w+(?:\[\])?\s*(?:=>|\{)\s+/.test(sample) || /(var|const|let)\s+\w+:\s*(string|number|boolean|string|any)(\[\])?/.test(sample))
        return reference("typescript");
      if (/\s(class|var|const|let)\s+\w/.test(sample) === false && /<[a-zA-Z](?:-[a-zA-Z])?/.test(sample) && /<\/[a-zA-Z-](?:-[a-zA-Z])?/.test(sample) && (/\s?\{%/.test(sample) || /{{/.test(sample)))
        return reference("liquid");
      if (/^(\s*[$@])/.test(sample) === false && /([}\]];?\s*)$/.test(sample)) {
        if (/^\s*import\s+\*\s+as\s+\w+\s+from\s+['"]/.test(sample) || /module\.export\s+=\s+/.test(sample) || /export\s+default\s+\{/.test(sample) || /[?:]\s*[{[]/.test(sample) || /^(?:\s*return;?(?:\s+[{[])?)/.test(sample)) {
          return reference("javascript");
        }
      }
      if (/{%/.test(sample) && /{{/.test(sample) && /<\w/.test(sample))
        return reference("liquid");
      if (/{\s*(?:\w|\.|@|#)+\s*\{/.test(sample))
        return reference("less");
      if (/\$(\w|-)/.test(sample))
        return reference("scss");
      if (/[;{:]\s*@\w/.test(sample) === true)
        return reference("less");
      return reference("css");
    }
    if (d < c) {
      do {
        if (flaga === false) {
          if (is(b[d], 42 /* ARS */) && is(b[d - 1], 47 /* FWS */)) {
            b[d - 1] = NIL;
            flaga = true;
          } else if (flagb === false && d < c - 6 && b[d].charCodeAt(0) === 102 && b[d + 1].charCodeAt(0) === 105 && b[d + 2].charCodeAt(0) === 108 && b[d + 3].charCodeAt(0) === 116 && b[d + 4].charCodeAt(0) === 101 && b[d + 5].charCodeAt(0) === 114 && is(b[d + 6], 58 /* COL */)) {
            flagb = true;
          }
        } else if (flaga === true && is(b[d], 42 /* ARS */) && d !== c - 1 && is(b[d + 1], 47 /* FWS */)) {
          flaga = false;
          b[d] = NIL;
          b[d + 1] = NIL;
        } else if (flagb === true && is(b[d], 59 /* SEM */)) {
          flagb = false;
          b[d] = NIL;
        }
        if (flaga === true || flagb === true)
          b[d] = NIL;
        d = d + 1;
      } while (d < c);
    }
    join2 = b.join(NIL);
    if (/\s\/\//.test(sample) === false && /\/\/\s/.test(sample) === false && /^(\s*(\{|\[)(?!%))/.test(sample) === true && /((\]|\})\s*)$/.test(sample) && sample.indexOf(",") !== -1)
      return reference("json");
    if (/((\}?(\(\))?\)*;?\s*)|([a-z0-9]("|')?\)*);?(\s*\})*)$/i.test(sample) === true && (vartest === true || pp === true || /console\.log\(/.test(sample) === true || /export\s+default\s+class\s+/.test(sample) === true || /export\s+(const|var|let|class)s+/.test(sample) === true || /document\.get/.test(sample) === true || /((=|(\$\())\s*function)|(\s*function\s+(\w*\s+)?\()/.test(sample) === true || sample.indexOf("{") === -1 || /^(\s*if\s+\()/.test(sample) === true))
      return isScript();
    if (sample.indexOf("{") > -1 && (/^(\s*[\u007b\u0024\u002e#@a-z0-9])/i.test(sample) || /^(\s*\/(\*|\/))/.test(sample) || /^(\s*\*\s*\{)/.test(sample)) && /^(\s*if\s*\()/.test(sample) === false && /=\s*(\{|\[|\()/.test(join2) === false && (/(\+|-|=|\?)=/.test(join2) === false || /\/\/\s*=+/.test(join2) || /=+('|")?\)/.test(sample) && /;\s*base64/.test(sample)) && /function(\s+\w+)*\s*\(/.test(join2) === false)
      return isScriptOrStyle();
    return sample.indexOf("{%") > -1 ? reference("liquid") : reference("unknown");
  }
  function isMarkup() {
    function isHTML() {
      return /{%-?\s*(schema|for|if|unless|render|include)/.test(sample) || /{%-?\s*end\w+/.test(sample) || /{{-?\s*content_for/.test(sample) || /{{-?\s*[a-zA-Z0-9_'".[\]]+\s*-?}}/.test(sample) || /{%/.test(sample) && /%}/.test(sample) && /{{/.test(sample) && /}}/.test(sample) ? reference("liquid") : reference("html");
    }
    return /^(\s*<!doctype\s+html>)/i.test(sample) || /^(\s*<html)/i.test(sample) || /<form\s/i.test(sample) && /<label\s/i.test(sample) && /<input\s/i.test(sample) || (/<img(\s+\w+=['"]?\S+['"]?)*\s+src\s*=/.test(sample) || /<a(\s+\w+=['"]?\S+['"]?)*\s+href\s*=/.test(sample)) || /<ul\s/i.test(sample) && /<li\s/i.test(sample) && /<\/li>/i.test(sample) && /<\/ul>/i.test(sample) || /<head\s*>/.test(sample) && /<\/head>/.test(sample) || /^(\s*<!DOCTYPE\s+((html)|(HTML))\s+PUBLIC\s+)/.test(sample) && /XHTML\s+1\.1/.test(sample) === false && /XHTML\s+1\.0\s+(S|s)((trict)|(TRICT))/.test(sample) === false ? isHTML() : /\s?{[{%]-?/.test(sample) ? reference("liquid") : reference("xml");
  }
  if (sample === null || sample.replace(/\s+/g, NIL) === NIL)
    return reference("unknown");
  if ((/\n\s*#{1,6}\s+/.test(sample) || /\n\s*(?:\*|-|(?:\d+\.))\s/.test(sample)) && (/\[( |x|X)\]/.test(sample) || /\s[*_~]{1,2}\w+[*_~]{1,2}/.test(sample) || /\n\s*```[a-zA-Z]*?\s+/.test(sample) || /-+\|(-+\|)+/.test(sample)))
    return reference("markdown");
  if (/^(\s*<!DOCTYPE\s+html>)/i.test(sample))
    return isMarkup();
  if (/^\s*@(?:charset|import|include|keyframes|media|namespace|page)\b/.test(sample))
    return isStyle();
  if (finalstatic === false && /=(>|=|-|\+|\*)/.test(sample) === false && /^(?:\s*((if)|(for)|(function))\s*\()/.test(sample) === false && /(?:\s|;|\})((if)|(for)|(function\s*\w*))\s*\(/.test(sample) === false && vartest === false && /return\s*\w*\s*(;|\})/.test(sample) === false && (sample === void 0 || /^(?:\s*#(?!(!\/)))/.test(sample) || /\n\s*(\.|@)\w+(\(|(\s*:))/.test(sample) && />\s*<\w/.test(sample) === false || (/^\s*:root\s*\{/.test(sample) || /-{2}\w+\s*\{/.test(sample) || /^\s*(?:body|button|hr|section|h[1-6]|p|strong|\*)\s+\{\s+/.test(sample))))
    return isStyle();
  b = sample.replace(/\[[a-zA-Z][\w-]*=['"]?[a-zA-Z][\w-]*['"]?\]/g, NIL).split(NIL);
  c = b.length;
  if (/^(\s*({{|{%|<))/.test(sample))
    return isMarkup();
  if (finalstatic === true || /^(?:[\s\w-]*<)/.test(sample) === false && /(?:>[\s\w-]*)$/.test(sample) === false)
    return notMarkup();
  return (/^(?:\s*<\?xml)/.test(sample) || /(?:>[\w\s:]*)?<(?:\/|!|#)?[\w\s:\-[]+/.test(sample) || /^\s*</.test(sample) && /<\/\w+(\w|\d)+>\s*$/.test(sample)) && (/^(?:[\s\w]*<)/.test(sample) || /(?:>[\s\w]*)$/.test(sample)) || /^(?:\s*<s((cript)|(tyle)))/i.test(sample) && /(?:<\/s((cript)|(tyle))>\s*)$/i.test(sample) ? /^(?:[\s\w]*<)/.test(sample) === false || /(?:>[\s\w]*)$/.test(sample) === false ? notMarkup() : isMarkup() : reference("unknown");
}

// src/parse/structure.ts
var Structure = class extends Array {
  constructor(structure) {
    super(structure);
  }
  get scope() {
    return this[this.length - 1];
  }
  update(token, index) {
    const i = this.length - 1;
    if (i > 0) {
      if (index === void 0) {
        if (typeof token === "string") {
          this[i][0] = token;
        } else {
          this[i][1] = token;
        }
      } else {
        this[i][0] = token;
        this[i][2] = index;
      }
      return this[i];
    } else {
      this.push([token, index]);
      return this[i + 1];
    }
  }
  clear() {
    if (this.length > 0)
      this.splice(0, this.length - 2);
    return this[0];
  }
  pop() {
    const i = this.length - 1;
    const x = this[i];
    if (i > 0)
      this.splice(i, 1);
    return x;
  }
};

// src/parse/parser.ts
var parse = new class Parser {
  constructor() {
    this.data = {
      begin: [],
      ender: [],
      lexer: [],
      lines: [],
      stack: [],
      token: [],
      types: []
    };
    this.structure = new Structure(["global", -1]);
    this.attributes = /* @__PURE__ */ new Map();
    this.external = /* @__PURE__ */ new Map();
    this.references = [[]];
    this.count = -1;
    this.lineStart = 0;
    this.lineNumber = 0;
    this.linesSpace = 0;
    this.pairs = /* @__PURE__ */ new Map();
    this.error = NIL;
  }
  get scope() {
    const { scope } = this.structure;
    return {
      token: scope[0],
      index: scope[1]
    };
  }
  get source() {
    return prettify.source;
  }
  get current() {
    return this.get(this.count);
  }
  get(index) {
    const { data } = this;
    return {
      get begin() {
        return data.begin[index];
      },
      get ender() {
        return data.ender[index];
      },
      get lexer() {
        return data.lexer[index];
      },
      get lines() {
        return data.lines[index];
      },
      get stack() {
        return data.stack[index];
      },
      get token() {
        return data.token[index];
      },
      get types() {
        return data.types[index];
      }
    };
  }
  full() {
    this.error = NIL;
    this.count = -1;
    this.lineStart = 0;
    this.linesSpace = 0;
    this.lineNumber = 1;
    this.data.begin = [];
    this.data.ender = [];
    this.data.lexer = [];
    this.data.lines = [];
    this.data.stack = [];
    this.data.token = [];
    this.data.types = [];
    this.references = [[]];
    this.structure.clear();
    return this.data;
  }
  pushEnder(data) {
    let a = this.count;
    const begin = data.begin[a];
    if (data.lexer[a] === "style" && prettify.rules.style.sortProperties === true || data.lexer[a] === "script" && (prettify.rules.script.objectSort === true || prettify.rules.json.objectSort === true)) {
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
  }
  lexers(output, language2) {
    const { rules: rules2 } = prettify;
    const mode = lexmap[language2];
    const curr = rules2.language;
    rules2.language = language2;
    rules2.languageName = setLanguageName(language2);
    if (language2 === "json") {
      const json = assign({}, rules2.json);
      const clone = assign({}, rules2.script);
      assign(rules2.script, rules2.json, {
        quoteConvert: "double",
        endComma: "never",
        noSemicolon: true,
        vertical: false
      });
      prettify.lexers[mode](output);
      if (rules2.json.objectSort)
        this.sortCorrect(0, this.count + 1);
      rules2.language = curr;
      rules2.languageName = setLanguageName(curr);
      rules2.json = json;
      rules2.script = clone;
    } else {
      prettify.lexers[mode](output);
      if (language2 === "javascript" && rules2.script.objectSort === true || (language2 === "css" || language2 === "scss") && rules2.style.sortProperties === true) {
        this.sortCorrect(0, this.count + 1);
      }
      rules2.language = curr;
      rules2.languageName = setLanguageName(curr);
    }
  }
  beautify(indent) {
    const { rules: rules2 } = prettify;
    const language2 = rules2.language;
    const external = this.external.get(prettify.start);
    rules2.indentLevel = indent;
    return {
      reset() {
        rules2.language = language2;
        rules2.languageName = setLanguageName(external.language);
        rules2.indentLevel = 0;
      },
      get beautify() {
        return prettify.beautify[external.lexer](rules2);
      }
    };
  }
  push(data, record, structure = NIL) {
    data.begin.push(record.begin);
    data.ender.push(record.ender);
    data.lexer.push(record.lexer);
    data.stack.push(record.stack);
    data.token.push(record.token);
    data.types.push(record.types);
    data.lines.push(record.lines);
    if (data === this.data) {
      this.count = this.count + 1;
      this.linesSpace = 0;
      if (record.lexer !== "style" && structure.replace(/[{}@<>%#]/g, NIL) === NIL) {
        structure = record.types === "else" ? "else" : getTagName(record.token);
      }
      if (record.types === "start" || record.types.indexOf("_start") > 0) {
        this.structure.push([structure, this.count]);
      } else if (record.types === "end" || record.types.indexOf("_end") > 0) {
        let ender = 0;
        const length = this.structure.length;
        if (this.structure.length > 2 && (data.types[this.structure[length - 1][1]] === "else" || data.types[this.structure[length - 1][1]].indexOf("_else") > 0) && (data.types[this.structure[length - 2][1]] === "start" || data.types[this.structure[length - 2][1]].indexOf("_start") > 0) && (data.types[this.structure[length - 2][1] + 1] === "else" || data.types[this.structure[length - 2][1] + 1].indexOf("_else") > 0)) {
          this.structure.pop();
          const [token, index] = this.structure.scope;
          data.begin[this.count] = index;
          data.stack[this.count] = token;
          data.ender[this.count - 1] = this.count;
          ender = data.ender[data.begin[this.count] + 1];
        }
        this.pushEnder(data);
        if (ender > 0)
          data.ender[data.begin[this.count] + 1] = ender;
        this.structure.pop();
      } else if (record.types === "else" || record.types.indexOf("_else") > 0) {
        if (structure === NIL)
          structure = "else";
        if (this.count > 0 && (data.types[this.count - 1] === "start" || data.types[this.count - 1].indexOf("_start") > 0)) {
          this.structure.push([structure, this.count]);
        } else {
          this.pushEnder(data);
          this.structure.update(structure === NIL ? "else" : structure, this.count);
        }
      }
    }
  }
  pop(data) {
    if (data === this.data)
      this.count = this.count - 1;
    return {
      begin: data.begin.pop(),
      ender: data.ender.pop(),
      lexer: data.lexer.pop(),
      lines: data.lines.pop(),
      stack: data.stack.pop(),
      token: data.token.pop(),
      types: data.types.pop()
    };
  }
  concat(data, record) {
    data.begin = data.begin.concat(record.begin);
    data.ender = data.ender.concat(record.ender);
    data.lexer = data.lexer.concat(record.lexer);
    data.stack = data.stack.concat(record.stack);
    data.token = data.token.concat(record.token);
    data.types = data.types.concat(record.types);
    data.lines = data.lines.concat(record.lines);
    if (data === this.data)
      this.count = data.token.length - 1;
  }
  splice(splice) {
    const begin = this.data.begin[this.count];
    const token = this.data.token[this.count];
    if (splice.record !== void 0 && splice.record.token !== NIL) {
      splice.data.begin.splice(splice.index, splice.howmany, splice.record.begin);
      splice.data.ender.splice(splice.index, splice.howmany, splice.record.ender);
      splice.data.token.splice(splice.index, splice.howmany, splice.record.token);
      splice.data.lexer.splice(splice.index, splice.howmany, splice.record.lexer);
      splice.data.stack.splice(splice.index, splice.howmany, splice.record.stack);
      splice.data.types.splice(splice.index, splice.howmany, splice.record.types);
      splice.data.lines.splice(splice.index, splice.howmany, splice.record.lines);
      if (splice.data === this.data) {
        this.count = this.count - splice.howmany + 1;
        if (begin !== this.data.begin[this.count] || token !== this.data.token[this.count]) {
          this.linesSpace = 0;
        }
      }
    } else {
      splice.data.begin.splice(splice.index, splice.howmany);
      splice.data.ender.splice(splice.index, splice.howmany);
      splice.data.token.splice(splice.index, splice.howmany);
      splice.data.lexer.splice(splice.index, splice.howmany);
      splice.data.stack.splice(splice.index, splice.howmany);
      splice.data.types.splice(splice.index, splice.howmany);
      splice.data.lines.splice(splice.index, splice.howmany);
      if (splice.data === this.data) {
        this.count = this.count - splice.howmany;
        this.linesSpace = 0;
      }
    }
  }
  sortObject(data) {
    let cc2 = this.count;
    let dd = this.structure[this.structure.length - 1][1];
    let ee = 0;
    let ff = 0;
    let gg = 0;
    let behind = 0;
    let front = 0;
    let keyend = 0;
    let keylen = 0;
    let comma = true;
    const keys2 = [];
    const begin = dd;
    const struc = this.structure.scope[0];
    const lines = this.linesSpace;
    const length = this.count;
    const json = prettify.rules.language === "json";
    const global = data.lexer[cc2] === "style" && struc === "global";
    const style = data.lexer[cc2] === "style";
    const delim = style === true ? [";", "separator"] : [",", "separator"];
    const stack = global === true ? "global" : struc;
    const store = {
      begin: [],
      ender: [],
      lexer: [],
      lines: [],
      stack: [],
      token: [],
      types: []
    };
    const sort = (x, y) => {
      let xx = x[0];
      let yy = y[0];
      if (data.types[xx] === "comment") {
        do
          xx = xx + 1;
        while (xx < length && data.types[xx] === "comment");
        if (data.token[xx] === void 0)
          return 1;
      }
      if (data.types[yy] === "comment") {
        do
          yy = yy + 1;
        while (yy < length && data.types[yy] === "comment");
        if (data.token[yy] === void 0)
          return 1;
      }
      if (style === true) {
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
    };
    behind = cc2;
    do {
      if (data.begin[cc2] === dd || global === true && cc2 < behind && is(data.token[cc2], 125 /* RCB */) && data.begin[data.begin[cc2]] === -1) {
        if (data.types[cc2].indexOf("liquid") > -1)
          return;
        if (data.token[cc2] === delim[0] || style === true && is(data.token[cc2], 125 /* RCB */) && not(data.token[cc2 + 1], 59 /* SEM */)) {
          comma = true;
          front = cc2 + 1;
        } else if (style === true && is(data.token[cc2 - 1], 125 /* RCB */)) {
          comma = true;
          front = cc2;
        }
        if (front === 0 && data.types[0] === "comment") {
          do
            front = front + 1;
          while (data.types[front] === "comment");
        } else if (data.types[front] === "comment" && data.lines[front] < 2) {
          front = front + 1;
        }
        if (comma === true && (data.token[cc2] === delim[0] || style === true && is(data.token[cc2 - 1], 125 /* RCB */)) && front <= behind) {
          if (style === true && "};".indexOf(data.token[behind]) < 0) {
            behind = behind + 1;
          } else if (style === false && not(data.token[behind], 44 /* COM */)) {
            behind = behind + 1;
          }
          keys2.push([front, behind]);
          if (style === true && is(data.token[front], 125 /* RCB */)) {
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
        do
          ee = ee - 1;
        while (ee > 0 && data.types[ee] === "comment");
        keys2[keys2.length - 1][0] = ee + 1;
      }
      if (data.types[cc2 + 1] === "comment" && cc2 === -1) {
        do
          cc2 = cc2 + 1;
        while (data.types[cc2 + 1] === "comment");
      }
      keys2.push([cc2 + 1, ee]);
    }
    if (keys2.length > 1) {
      if (json === true || style === true || is(data.token[cc2 - 1], 61 /* EQS */) || is(data.token[cc2 - 1], 58 /* COL */) || is(data.token[cc2 - 1], 40 /* LPR */) || is(data.token[cc2 - 1], 91 /* LSB */) || is(data.token[cc2 - 1], 44 /* COM */) || data.types[cc2 - 1] === "word" || cc2 === 0) {
        keys2.sort(sort);
        keylen = keys2.length;
        comma = false;
        dd = 0;
        do {
          keyend = keys2[dd][1];
          if (style === true) {
            gg = keyend;
            if (data.types[gg] === "comment")
              gg = gg - 1;
            if (is(data.token[gg], 125 /* RCB */)) {
              keyend = keyend + 1;
              delim[0] = "}";
              delim[1] = "end";
            } else {
              delim[0] = ";";
              delim[1] = "separator";
            }
          }
          ee = keys2[dd][0];
          if (style === true && data.types[keyend - 1] !== "end" && data.types[keyend] === "comment" && data.types[keyend + 1] !== "comment" && dd < keylen - 1) {
            keyend = keyend + 1;
          }
          if (ee < keyend) {
            do {
              if (style === false && dd === keylen - 1 && ee === keyend - 2 && is(data.token[ee], 44 /* COM */) && data.lexer[ee] === "script" && data.types[ee + 1] === "comment") {
                ff = ff + 1;
              } else {
                this.push(store, {
                  begin: data.begin[ee],
                  ender: data.ender[ee],
                  lexer: data.lexer[ee],
                  lines: data.lines[ee],
                  stack: data.stack[ee],
                  token: data.token[ee],
                  types: data.types[ee]
                });
                ff = ff + 1;
              }
              if (data.token[ee] === delim[0] && (style === true || data.begin[ee] === data.begin[keys2[dd][0]])) {
                comma = true;
              } else if (data.token[ee] !== delim[0] && data.types[ee] !== "comment") {
                comma = false;
              }
              ee = ee + 1;
            } while (ee < keyend);
          }
          if (comma === false && store.token[store.token.length - 1] !== "x;" && (style === true || dd < keylen - 1)) {
            ee = store.types.length - 1;
            if (store.types[ee] === "comment") {
              do
                ee = ee - 1;
              while (ee > 0 && store.types[ee] === "comment");
            }
            ee = ee + 1;
            this.splice({
              data: store,
              howmany: 0,
              index: ee,
              record: {
                begin,
                stack,
                ender: this.count,
                lexer: store.lexer[ee - 1],
                lines: 0,
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
  sortSafe(array, operation, recursive) {
    if (isArray(array) === false)
      return array;
    if (operation === "normal")
      return safeSortNormal.call({ array, recursive }, array);
    if (operation === "descend")
      return safeSortDescend.call({ recursive }, array);
    return safeSortAscend.call({ recursive }, array);
  }
  sortCorrect(start, end) {
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
        data.begin[a] = structure.length > 0 ? structure[structure.length - 1] : -1;
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
  space(array, length) {
    this.linesSpace = 1;
    return (index) => {
      do {
        if (is(array[index], 10 /* NWL */))
          this.lineNumber = this.lineNumber + 1;
        if (ws(array[index]) === false)
          break;
        this.linesSpace = this.linesSpace + 1;
        index = index + 1;
      } while (index < length);
      return index;
    };
  }
  spacer(args) {
    this.linesSpace = 1;
    do {
      if (args.array[args.index] === NWL) {
        this.linesSpace = this.linesSpace + 1;
        this.lineNumber = this.lineNumber + 1;
      }
      if (ws(args.array[args.index + 1]) === false)
        break;
      args.index = args.index + 1;
    } while (args.index < args.end);
    return args.index;
  }
}();

// src/utils/regex.ts
var SpaceLead = /^\s+/;
var SpaceEnd = /\s+$/;
var StripLead = /^[\t\v\f\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]+/;
var StripEnd = /[\t\v\f \u00a0\u2000-\u200b\u2028-\u2029\u3000]+$/;
var SpaceOnly = /[\t\v\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]+/g;
var CommControl = /(\/[*/]|{%-?\s*(?:comment\s*-?%}|#)|<!-{2})\s*@prettify\s+/;
var CommIgnoreFile = /(\/[*/]|{%-?\s*(?:comment\s*-?%})|<!-{2})\s*@prettify-ignore\b/;
var CommIgnoreStart = /(\/[*/]|{%-?\s*(?:comment\s*-?%}|#)|<!-{2})\s*@prettify-ignore-start\b/;
var CommIgnoreNext = /(\/[*/]|{%-?\s*(?:comment\s*-?%}|#)|<!-{2})\s*@prettify-ignore-next\b/;
var LiqDelims = /{%-?\s*|\s*-?%}/g;
var CharEscape = /(\/|\\|\||\*|\[|\]|\{|\})/g;

// src/comments/parse.ts
function wrapCommentBlock(config) {
  const { rules: rules2 } = prettify;
  const build = [];
  const second = [];
  const lf = rules2.crlf === true ? "\r\n" : NWL;
  const sanitize = config.begin.replace(CharEscape, sanitizeComment);
  const liqcomm = is(config.begin[0], 123 /* LCB */) && is(config.begin[1], 37 /* PER */);
  const regIgnore = new RegExp(`^(${sanitize}\\s*@prettify-ignore-start)`);
  const regStart = new RegExp(`(${sanitize}\\s*)`);
  const regEnd = liqcomm ? new RegExp(`\\s*${config.ender.replace(LiqDelims, (i) => is(i, 123 /* LCB */) ? "{%-?\\s*" : "\\s*-?%}")}$`) : new RegExp(config.ender.replace(CharEscape, sanitizeComment));
  let a = config.start;
  let b = 0;
  let c = 0;
  let d = 0;
  let len = 0;
  let lines = [];
  let space = NIL;
  let bline = NIL;
  let emptyLine = false;
  let bulletLine = false;
  let numberLine = false;
  let output = NIL;
  let terml = config.ender.length - 1;
  let term = config.ender.charAt(terml);
  let twrap = 0;
  function emptyLines() {
    if (/^\s+$/.test(lines[b + 1]) || lines[b + 1] === NIL) {
      do
        b = b + 1;
      while (b < len && (/^\s+$/.test(lines[b + 1]) || lines[b + 1] === NIL));
    }
    if (b < len - 1)
      second.push(NIL);
  }
  function ignoreComment() {
    let termination = NWL;
    a = a + 1;
    do {
      build.push(config.chars[a]);
      if (build.slice(build.length - 20).join(NIL) === "@prettify-ignore-end") {
        if (liqcomm) {
          const d2 = config.chars.indexOf("{", a);
          if (is(config.chars[d2 + 1], 37 /* PER */)) {
            const ender = config.chars.slice(d2, config.chars.indexOf("}", d2 + 1) + 1).join(NIL);
            if (regEnd.test(ender))
              config.ender = ender;
          }
        }
        a = a + 1;
        break;
      }
      a = a + 1;
    } while (a < config.end);
    b = a;
    terml = config.begin.length - 1;
    term = config.begin.charAt(terml);
    do {
      if (config.begin === "/*" && is(config.chars[b - 1], 47 /* FWS */) && (is(config.chars[b], 42 /* ARS */) || is(config.chars[b], 47 /* FWS */))) {
        break;
      }
      if (config.begin !== "/*" && config.chars[b] === term && config.chars.slice(b - terml, b + 1).join(NIL) === config.begin) {
        break;
      }
      b = b - 1;
    } while (b > config.start);
    if (config.begin === "/*" && is(config.chars[b], 42 /* ARS */)) {
      termination = "*/";
    } else if (config.begin !== "/*") {
      termination = config.ender;
    }
    terml = termination.length - 1;
    term = termination.charAt(terml);
    if (termination !== NWL || config.chars[a] !== NWL) {
      do {
        build.push(config.chars[a]);
        if (termination === NWL && config.chars[a + 1] === NWL)
          break;
        if (config.chars[a] === term && config.chars.slice(a - terml, a + 1).join(NIL) === termination)
          break;
        a = a + 1;
      } while (a < config.end);
    }
    if (config.chars[a] === NWL)
      a = a - 1;
    output = build.join(NIL).replace(StripEnd, NIL);
    return [output, a];
  }
  do {
    build.push(config.chars[a]);
    if (config.chars[a] === NWL)
      parse.lineNumber = parse.lineNumber + 1;
    if (config.chars[a] === term && config.chars.slice(a - terml, a + 1).join(NIL) === config.ender)
      break;
    a = a + 1;
  } while (a < config.end);
  output = build.join(NIL);
  if (regIgnore.test(output) === true)
    return ignoreComment();
  if (liqcomm === true && rules2.liquid.preserveComment === true || liqcomm === false && rules2.markup.preserveComment === true || rules2.wrap < 1 || a === config.end || output.length <= rules2.wrap && output.indexOf(NWL) < 0 || config.begin === "/*" && output.indexOf(NWL) > 0 && output.replace(NWL, NIL).indexOf(NWL) > 0 && /\n(?!(\s*\*))/.test(output) === false) {
    return [output, a];
  }
  b = config.start;
  if (b > 0 && not(config.chars[b - 1], 10 /* NWL */) && ws(config.chars[b - 1])) {
    do
      b = b - 1;
    while (b > 0 && not(config.chars[b - 1], 10 /* NWL */) && ws(config.chars[b - 1]));
  }
  space = config.chars.slice(b, config.start).join(NIL);
  const spaceLine = new RegExp(NWL + space, "g");
  lines = output.replace(/\r\n/g, NWL).replace(spaceLine, NWL).split(NWL);
  len = lines.length;
  lines[0] = lines[0].replace(regStart, NIL);
  lines[len - 1] = lines[len - 1].replace(regEnd, NIL);
  if (len < 2)
    lines = lines[0].split(WSP);
  if (lines[0] === NIL) {
    lines[0] = config.begin;
  } else {
    lines.splice(0, 0, config.begin);
  }
  len = lines.length;
  b = 0;
  do {
    bline = b < len - 1 ? lines[b + 1].replace(StripLead, NIL) : NIL;
    if (/^\s+$/.test(lines[b]) === true || lines[b] === NIL) {
      emptyLines();
    } else if (lines[b].replace(StripLead, NIL).length > rules2.wrap && lines[b].replace(StripLead, NIL).indexOf(WSP) > rules2.wrap) {
      lines[b] = lines[b].replace(StripLead, NIL);
      c = lines[b].indexOf(WSP);
      second.push(lines[b].slice(0, c));
      lines[b] = lines[b].slice(c + 1);
      b = b - 1;
    } else {
      lines[b] = config.begin === "/*" && lines[b].indexOf("/*") !== 0 ? `   ${lines[b].replace(StripLead, NIL).replace(StripEnd, NIL).replace(/\s+/g, WSP)}` : `${lines[b].replace(StripLead, NIL).replace(StripEnd, NIL).replace(/\s+/g, WSP)}`;
      twrap = b < 1 ? rules2.wrap - (config.begin.length + 1) : rules2.wrap;
      c = lines[b].length;
      d = lines[b].replace(StripLead, NIL).indexOf(WSP);
      if (c > twrap && d > 0 && d < twrap) {
        c = twrap;
        do {
          c = c - 1;
          if (ws(lines[b].charAt(c)) && c <= rules2.wrap)
            break;
        } while (c > 0);
        if (/^\s*\d+\.\s/.test(lines[b]) === true && /^\s*\d+\.\s/.test(lines[b + 1]) === false) {
          lines.splice(b + 1, 0, "1. ");
        }
        if (/^\s+$/.test(lines[b + 1]) === true || lines[b + 1] === NIL) {
          second.push(lines[b].slice(0, c));
          lines[b] = lines[b].slice(c + 1);
          emptyLine = true;
          b = b - 1;
        } else if (/^\s*[*-]\s/.test(lines[b + 1])) {
          second.push(lines[b].slice(0, c));
          lines[b] = lines[b].slice(c + 1);
          bulletLine = true;
          b = b - 1;
        } else if (/^\s*\d+\.\s/.test(lines[b + 1])) {
          second.push(lines[b].slice(0, c));
          lines[b] = lines[b].slice(c + 1);
          numberLine = true;
          b = b - 1;
        } else if (lines[b].replace(StripLead, NIL).indexOf(WSP) < rules2.wrap) {
          lines[b + 1] = lines[b].length > rules2.wrap ? lines[b].slice(c + 1) + lf + lines[b + 1] : `${lines[b].slice(c + 1)} ${lines[b + 1]}`;
        }
        if (emptyLine === false && bulletLine === false && numberLine === false) {
          lines[b] = lines[b].slice(0, c);
        }
      } else if (lines[b + 1] !== void 0 && (lines[b].length + bline.indexOf(WSP) > rules2.wrap && bline.indexOf(WSP) > 0 || lines[b].length + bline.length > rules2.wrap && bline.indexOf(WSP) < 0)) {
        second.push(lines[b]);
        b = b + 1;
      } else if (lines[b + 1] !== void 0 && /^\s+$/.test(lines[b + 1]) === false && lines[b + 1] !== NIL && /^\s*(?:[*-]|\d+\.)\s/.test(lines[b + 1]) === false) {
        second.push(lines[b]);
        emptyLine = true;
      } else {
        second.push(lines[b]);
        emptyLine = true;
      }
      bulletLine = false;
      numberLine = false;
    }
    b = b + 1;
  } while (b < len);
  if (second.length > 0) {
    if (second[second.length - 1].length > rules2.wrap - (config.ender.length + 1)) {
      second.push(config.ender);
    } else {
      second.push(config.ender);
    }
    output = second.join(lf);
  } else {
    lines[lines.length - 1] = lines[lines.length - 1] + config.ender;
    output = lines.join(lf);
  }
  return [output, a];
}
function wrapCommentLine(config) {
  const { wrap } = prettify.rules;
  const { preserveComment } = prettify.rules[config.lexer];
  let a = config.start;
  let b = 0;
  let output = NIL;
  let build = [];
  function recurse() {
    let line = NIL;
    do {
      b = b + 1;
      if (is(config.chars[b + 1], 10 /* NWL */))
        return;
    } while (b < config.end && ws(config.chars[b]));
    if (config.chars[b] + config.chars[b + 1] === "//") {
      build = [];
      do {
        build.push(config.chars[b]);
        b = b + 1;
      } while (b < config.end && not(config.chars[b], 10 /* NWL */));
      line = build.join(NIL);
      if (/^\/\/ (?:[*-]|\d+\.)/.test(line) === false && /^\/\/\s*$/.test(line) === false) {
        output = `${output} ${line.replace(/(^\/\/\s*)/, NIL).replace(StripEnd, NIL)}`;
        a = b - 1;
        recurse();
      }
    }
  }
  function wordWrap() {
    const lines = [];
    const record = {
      ender: -1,
      types: "comment",
      lexer: config.lexer,
      lines: parse.linesSpace
    };
    if (parse.count > -1) {
      record.begin = parse.structure[parse.structure.length - 1][1];
      record.stack = parse.structure[parse.structure.length - 1][0];
      record.token = parse.data.token[parse.count];
    } else {
      record.begin = -1;
      record.stack = "global";
      record.token = NIL;
    }
    let c = 0;
    let d = 0;
    output = output.replace(/\s+/g, WSP).replace(StripEnd, NIL);
    d = output.length;
    if (wrap > d)
      return;
    do {
      c = wrap;
      if (not(output[c], 32 /* WSP */)) {
        do
          c = c - 1;
        while (c > 0 && not(output[c], 32 /* WSP */));
        if (c < 3) {
          c = wrap;
          do
            c = c + 1;
          while (c < d - 1 && not(output[c], 32 /* WSP */));
        }
      }
      lines.push(output.slice(0, c));
      output = `// ${output.slice(c).replace(StripLead, NIL)}`;
      d = output.length;
    } while (wrap < d);
    c = 0;
    d = lines.length;
    do {
      record.token = lines[c];
      parse.push(parse.data, record, NIL);
      record.lines = 2;
      parse.linesSpace = 2;
      c = c + 1;
    } while (c < d);
  }
  do {
    build.push(config.chars[a]);
    a = a + 1;
  } while (a < config.end && not(config.chars[a], 10 /* NWL */));
  if (a === config.end) {
    config.chars.push(NWL);
  } else {
    a = a - 1;
  }
  output = build.join(NIL).replace(StripEnd, NIL);
  if (/^(\/\/\s*@prettify-ignore-start\b)/.test(output) === true) {
    let termination = NWL;
    a = a + 1;
    do {
      build.push(config.chars[a]);
      a = a + 1;
    } while (a < config.end && (not(config.chars[a - 1], 100) || is(config.chars[a - 1], 100) && build.slice(build.length - 20).join(NIL) !== "@prettify-ignore-end"));
    b = a;
    do
      ;
    while (b > config.start && is(config.chars[b - 1], 47 /* FWS */) && (is(config.chars[b], 42 /* ARS */) || is(config.chars[b], 47 /* FWS */)));
    if (is(config.chars[b], 42 /* ARS */))
      termination = "*/";
    if (termination !== NWL || not(config.chars[a], 10 /* NWL */)) {
      do {
        build.push(config.chars[a]);
        if (termination === NWL && is(config.chars[a + 1], 10 /* NWL */))
          break;
        a = a + 1;
      } while (a < config.end && (termination === NWL || termination === "*/" && (is(config.chars[a - 1], 42 /* ARS */) || is(config.chars[a], 47 /* FWS */))));
    }
    if (config.chars[a] === NWL)
      a = a - 1;
    output = build.join(NIL).replace(StripEnd, NIL);
    return [output, a];
  }
  if (output === "//" || preserveComment === true)
    return [output, a];
  output = output.replace(/(\/\/\s*)/, "// ");
  if (wrap < 1 || a === config.end - 1 && parse.data.begin[parse.count] < 1)
    return [output, a];
  b = a + 1;
  recurse();
  wordWrap();
  return [output, a];
}

// src/lexers/style.ts
prettify.lexers.style = function StyleLexer(source) {
  const { rules: rules2 } = prettify;
  const { data } = parse;
  const b = source.split(NIL);
  const c = source.length;
  const mapper = [];
  const nosort = [];
  let a = 0;
  let ltype = NIL;
  let ltoke = NIL;
  function push(structure) {
    parse.push(data, {
      begin: parse.structure[parse.structure.length - 1][1],
      ender: -1,
      lexer: "style",
      lines: parse.linesSpace,
      stack: parse.structure[parse.structure.length - 1][0],
      token: ltoke,
      types: ltype
    }, structure);
  }
  function esctest(index) {
    const slashy = index;
    do {
      index = index - 1;
    } while (b[index] === "\\" && index > 0);
    return (slashy - index) % 2 === 1;
  }
  function value(input) {
    const x = input.replace(/\s*!important/, " !important").split(NIL);
    const transition = /-?transition$/.test(data.token[parse.count - 2]);
    const values = [];
    const zerodot = /(\s|\(|,)-?0+\.?\d+([a-z]|\)|,|\s)/g;
    const dot = /(\s|\(|,)-?\.?\d+([a-z]|\)|,|\s)/g;
    let ii = 0;
    let dd = 0;
    let block = NIL;
    let leng = x.length;
    let items = [];
    const colorPush = (value2) => {
      return value2;
    };
    function valueSpace(find) {
      find = find.replace(/\s*/g, NIL);
      return /\/\d/.test(find) && input.indexOf("url(") === 0 ? find : ` ${find.charAt(0)} ${find.charAt(1)}`;
    }
    function zeroFix(find) {
      if (rules2.style.noLeadZero === true) {
        return find.replace(/^-?\D0+(\.|\d)/, (search) => search.replace(/0+/, NIL));
      } else if (/0*\./.test(find)) {
        return find.replace(/0*\./, "0.");
      } else if (/0+/.test(/\d+/.exec(find)[0])) {
        return /^\D*0+\D*$/.test(find) ? find.replace(/0+/, "0") : find.replace(/\d+/.exec(find)[0], /\d+/.exec(find)[0].replace(/^0+/, NIL));
      }
      return find;
    }
    function commaSpace(find) {
      return find.replace(",", ", ");
    }
    function units(dimension) {
      return `${dimension} `;
    }
    function safeSlash() {
      const start = ii - 1;
      let xx = start;
      if (start < 1)
        return true;
      do {
        xx = xx - 1;
      } while (xx > 0 && x[xx] === "\\");
      return (start - xx) % 2 === 1;
    }
    if (ii < leng) {
      do {
        items.push(x[ii]);
        if (x[ii - 1] !== "\\" || safeSlash() === false) {
          if (block === NIL) {
            if (is(x[ii], 34 /* DQO */)) {
              block = '"';
              dd = dd + 1;
            } else if (is(x[ii], 39 /* SQO */)) {
              block = "'";
              dd = dd + 1;
            } else if (is(x[ii], 40 /* LPR */)) {
              block = ")";
              dd = dd + 1;
            } else if (is(x[ii], 91 /* LSB */)) {
              block = "]";
              dd = dd + 1;
            }
          } else if (is(x[ii], 40 /* LPR */) && is(block, 41 /* RPR */) || is(x[ii], 91 /* LSB */) && is(block, 93 /* RSB */)) {
            dd = dd + 1;
          } else if (x[ii] === block) {
            dd = dd - 1;
            if (dd === 0)
              block = NIL;
          }
        }
        if (block === NIL && is(x[ii], 32 /* WSP */)) {
          items.pop();
          values.push(colorPush(items.join(NIL)));
          items = [];
        }
        ii = ii + 1;
      } while (ii < leng);
    }
    values.push(colorPush(items.join(NIL)));
    leng = values.length;
    ii = 0;
    if (ii < leng) {
      do {
        if (rules2.style.noLeadZero === true && /^-?0+\.\d+[a-z]/.test(values[ii]) === true) {
          values[ii] = values[ii].replace(/0+\./, ".");
        } else if (rules2.style.noLeadZero === false && /^-?\.\d+[a-z]/.test(values[ii])) {
          values[ii] = values[ii].replace(".", "0.");
        } else if (zerodot.test(values[ii]) || dot.test(values[ii])) {
          values[ii] = values[ii].replace(zerodot, zeroFix).replace(dot, zeroFix);
        } else if (/^(0+([a-z]{2,3}|%))$/.test(values[ii]) && transition === false) {
          values[ii] = "0";
        } else if (/^(0+)/.test(values[ii])) {
          values[ii] = values[ii].replace(/0+/, "0");
          if (/\d/.test(values[ii].charAt(1)))
            values[ii] = values[ii].substr(1);
        } else if (/^url\((?!('|"))/.test(values[ii]) && values[ii].charCodeAt(values[ii].length - 1) === 41 /* RPR */) {
          block = values[ii].charAt(values[ii].indexOf("url(") + 4);
          if (block !== "@" && not(block, 40 /* LPR */) && not(block, 60 /* LAN */)) {
            if (rules2.style.quoteConvert === "double") {
              values[ii] = values[ii].replace(/url\(/, 'url("').replace(/\)$/, '")');
            } else {
              values[ii] = values[ii].replace(/url\(/, "url('").replace(/\)$/, "')");
            }
          }
        }
        if (/^(\+|-)?\d+(\.\d+)?(e-?\d+)?\D+$/.test(values[ii])) {
          if (!grammar.css.units.has(values[ii].replace(/(\+|-)?\d+(\.\d+)?(e-?\d+)?/, NIL))) {
            values[ii] = values[ii].replace(/(\+|-)?\d+(\.\d+)?(e-?\d+)?/, units);
          }
        }
        if (/^\w+\(/.test(values[ii]) && values[ii].charAt(values[ii].length - 1) === ")" && (values[ii].indexOf("url(") !== 0 || values[ii].indexOf("url(") === 0 && values[ii].indexOf(WSP) > 0)) {
          values[ii] = values[ii].replace(/,\S/g, commaSpace);
        }
        ii = ii + 1;
      } while (ii < leng);
    }
    block = values.join(WSP);
    return block.charAt(0) + block.slice(1).replace(/\s*(\/|\+|\*)\s*(\d|\$)/, valueSpace);
  }
  function buildToken() {
    const block = [];
    const out = [];
    const qc = rules2.style.quoteConvert;
    let aa = a;
    let bb = 0;
    let outy = NIL;
    let func = null;
    let nopush = false;
    function spaceStart() {
      out.push(b[aa]);
      if (ws(b[aa + 1]))
        do {
          aa = aa + 1;
        } while (aa < c && ws(b[aa + 1]));
    }
    if (aa < c) {
      do {
        if (is(b[aa], 34 /* DQO */) || is(b[aa], 39 /* SQO */)) {
          if (func === null)
            func = false;
          if (block[block.length - 1] === b[aa] && (b[aa - 1] !== "\\" || esctest(aa - 1) === false)) {
            block.pop();
            if (qc === "double") {
              b[aa] = '"';
            } else if (qc === "single") {
              b[aa] = "'";
            }
          } else if (not(block[block.length - 1], 34 /* DQO */) && not(block[block.length - 1], 39 /* SQO */) && (not(b[aa - 1], 92 /* BWS */) || esctest(aa - 1) === false)) {
            block.push(b[aa]);
            if (qc === "double") {
              b[aa] = '"';
            } else if (qc === "single") {
              b[aa] = "'";
            }
          } else if (b[aa - 1] === "\\" && qc !== "none") {
            if (esctest(aa - 1) === true) {
              if (qc === "double" && is(b[aa], 39 /* SQO */)) {
                out.pop();
              } else if (qc === "single" && is(b[aa], 34 /* DQO */)) {
                out.pop();
              }
            }
          } else if (qc === "double" && is(b[aa], 34 /* DQO */)) {
            b[aa] = '\\"';
          } else if (qc === "single" && is(b[aa], 39 /* SQO */)) {
            b[aa] = "\\'";
          }
          out.push(b[aa]);
        } else if (b[aa - 1] !== "\\" || esctest(aa - 1) === false) {
          if (is(b[aa], 40 /* LPR */)) {
            if (func === null)
              func = true;
            block.push(")");
            spaceStart();
          } else if (is(b[aa], 91 /* LSB */)) {
            func = false;
            block.push("]");
            spaceStart();
          } else if ((is(b[aa], 35 /* HSH */) || is(b[aa], 64 /* ATT */)) && is(b[aa + 1], 123 /* LCB */)) {
            func = false;
            out.push(b[aa]);
            aa = aa + 1;
            block.push("}");
            spaceStart();
          } else if (b[aa] === block[block.length - 1]) {
            out.push(b[aa]);
            block.pop();
          } else {
            out.push(b[aa]);
          }
        } else {
          out.push(b[aa]);
        }
        if (parse.structure[parse.structure.length - 1][0] === "map" && block.length === 0 && (is(b[aa + 1], 44 /* COM */) || is(b[aa + 1], 41 /* RPR */))) {
          if (is(b[aa + 1], 41 /* RPR */) && is(data.token[parse.count], 40 /* LPR */)) {
            parse.pop(data);
            parse.structure.pop();
            out.splice(0, 0, "(");
          } else {
            break;
          }
        }
        if (is(b[aa + 1], 58 /* COL */)) {
          bb = aa;
          if (ws(b[bb])) {
            do
              bb = bb - 1;
            while (ws(b[bb]));
          }
          outy = b.slice(bb - 6, bb + 1).join(NIL);
          if (outy.indexOf("filter") === outy.length - 6 || outy.indexOf("progid") === outy.length - 6) {
            outy = "filter";
          }
        }
        if (block.length === 0) {
          if (is(b[aa + 1], 59 /* SEM */) && esctest(aa + 1) === true || is(b[aa + 1], 58 /* COL */) && not(b[aa], 58 /* COL */) && not(b[aa + 2], 58 /* COL */) && outy !== "filter" && outy !== "progid" || (is(b[aa + 1], 123 /* LCB */) || is(b[aa + 1], 125 /* RCB */)) || is(b[aa + 1], 47 /* FWS */) && (is(b[aa + 2], 42 /* ARS */) || is(b[aa + 2], 47 /* FWS */))) {
            bb = out.length - 1;
            if (ws(out[bb])) {
              do {
                bb = bb - 1;
                aa = aa - 1;
                out.pop();
              } while (ws(out[bb]));
            }
            break;
          }
          if (is(b[aa + 1], 44 /* COM */))
            break;
        }
        aa = aa + 1;
      } while (aa < c);
    }
    a = aa;
    if (parse.structure[parse.structure.length - 1][0] === "map" && is(out[0], 40 /* LPR */)) {
      mapper[mapper.length - 1] = mapper[mapper.length - 1] - 1;
    }
    ltoke = out.join(NIL).replace(/\s+/g, WSP).replace(/^\s/, NIL).replace(/\s$/, NIL);
    if (func === true) {
      if (grammar.css.atrules.has(ltoke) && rules2.style.atRuleSpace === true) {
        data.token[parse.count] = data.token[parse.count].replace(/\s*\(/g, " (").replace(/\s*\)\s*/g, ") ").replace(/,\(/g, ", (");
      } else {
        ltoke = ltoke.replace(/\s+\(/g, "(").replace(/\s+\)/g, ")").replace(/,\(/g, ", (");
      }
    }
    if (ltype === "colon" && data.types[parse.count - 1] === "start") {
      if (grammar.css.pseudoClasses.has(ltoke)) {
        data.token[parse.count] = ltoke = ":" + ltoke;
        ltype = "pseudo";
        nopush = true;
      }
    } else if (parse.count > -1 && data.token[parse.count].indexOf("extend(") === 0) {
      ltype = "pseudo";
    } else if (func === true && /\d/.test(ltoke.charAt(0)) === false && /^rgba?\(/.test(ltoke) === false && ltoke.indexOf("url(") !== 0 && (ltoke.indexOf(WSP) < 0 || ltoke.indexOf(WSP) > ltoke.indexOf("(")) && ltoke.charAt(ltoke.length - 1) === ")") {
      if (is(data.token[parse.count], 58 /* COL */)) {
        ltype = "value";
      } else {
        ltoke = ltoke.replace(/,\u0020?/g, ", ");
        ltype = "function";
      }
      ltoke = value(ltoke);
    } else if (parse.count > -1 && `"'`.indexOf(data.token[parse.count].charAt(0)) > -1 && data.types[parse.count] === "variable") {
      ltype = "item";
    } else if (is(out[0], 64 /* ATT */) || out[0] === "$") {
      if (data.types[parse.count] === "colon" && rules2.language === "css" && (data.types[parse.count - 1] === "property" || data.types[parse.count - 1] === "variable")) {
        ltype = "value";
      } else if (parse.count > -1) {
        ltype = "item";
        outy = data.token[parse.count];
        aa = outy.indexOf("(");
        if (is(outy[outy.length - 1], 41 /* RPR */) && aa > 0) {
          outy = outy.slice(aa + 1, outy.length - 1);
          data.token[parse.count] = data.token[parse.count].slice(0, aa + 1) + value(outy) + ")";
        }
      }
      ltoke = value(ltoke);
    } else {
      ltype = "item";
    }
    if (nopush === false) {
      push(NIL);
    } else {
      nopush = false;
    }
  }
  function item(type) {
    let aa = parse.count;
    let bb = 0;
    let first = NIL;
    const comsa = [];
    function priors() {
      if (parse.count < 0)
        return;
      if (aa > 0 && (data.types[aa] === "comment" || data.types[aa] === "ignore")) {
        do {
          aa = aa - 1;
          comsa.push(data.token[aa]);
        } while (aa > 0 && data.lexer[aa] === "style" && (data.types[aa] === "comment" || data.types[aa] === "ignore"));
      }
      bb = aa - 1;
      if (bb > 0 && (data.types[bb] === "comment" || data.types[bb] === "ignore")) {
        do
          bb = bb - 1;
        while (bb > 0 && data.lexer[aa] === "style" && (data.types[bb] === "comment" || data.types[bb] === "ignore"));
      }
      if (bb < 0)
        bb = 0;
      if (aa < 0)
        aa = 0;
      first = data.token[aa][0];
    }
    function normalize(input) {
      return input.replace(/\s*&/, " &").replace(/\s*&\s*{/, " & {").replace(/\s*>\s*/g, " > ").replace(/\s*\+\s*/g, " + ");
    }
    function selector(index) {
      let ss = index;
      const dd = data.begin[ss];
      data.token[index] = data.token[index].replace(/\s*&/, " &").replace(/\s*&\s*{/, " & {").replace(/\s*>\s*/g, " > ").replace(/\s*\+\s*/g, " + ").replace(/:\s+/g, ": ").replace(/^\s+/, NIL).replace(/\s+$/, NIL).replace(/\s+::\s+/, "::");
      if (not(data.token[ss], 44 /* COM */) && data.types[ss] !== "comment") {
        data.types[ss] = "selector";
      }
      if (is(data.token[ss - 1], 44 /* COM */) || is(data.token[ss - 1], 58 /* COL */) || data.types[ss - 1] === "comment" || data.types[ss - 1] === "pseudo") {
        if (data.types[ss - 1] === "colon" && (data.types[ss] === "selector" || data.types[ss] === "at_rule") && (data.types[ss - 2] === "template" || data.types[ss - 2] === "template_start" || data.types[ss - 2] === "template_else" || data.types[ss - 2] === "template_end")) {
          data.token[ss - 1] = ":" + data.token[ss] + WSP;
          data.types[ss - 1] = "selector";
          parse.splice({
            data,
            howmany: 1,
            index: ss
          });
        } else if (data.types[ss - 1] === "pseudo") {
          data.token[ss - 1] = `${data.token[ss - 1]}${data.token[ss]}`;
          data.types[ss - 1] = "selector";
          parse.splice({
            data,
            howmany: 1,
            index: ss
          });
        } else if (data.types[ss - 2] === "comment") {
          data.token[ss - 1] = normalize(`${data.token[ss - 1]}${data.token[ss]}`);
          data.types[ss - 1] = "selector";
          parse.splice({
            data,
            howmany: 1,
            index: ss
          });
        } else {
          do {
            ss = ss - 1;
            if (data.begin[ss] === dd) {
              if (is(data.token[ss], 59 /* SEM */))
                break;
              if (not(data.token[ss], 44 /* COM */) && data.types[ss] !== "comment") {
                data.types[ss] = "selector";
              }
              if (data.token[ss] === ":" && not(data.token[ss - 1], 59 /* SEM */)) {
                data.token[ss - 1] = normalize(`${data.token[ss - 1]}:${data.token[ss + 1]}`);
                parse.splice({
                  data,
                  howmany: 2,
                  index: ss
                });
              }
            } else {
              break;
            }
          } while (ss > 0);
        }
      }
      ss = parse.count;
      if (rules2.style.sortSelectors === true && is(data.token[ss - 1], 44 /* COM */)) {
        const store = [data.token[ss]];
        do {
          ss = ss - 1;
          if (data.types[ss] === "comment" || data.types[ss] === "ignore") {
            do
              ss = ss - 1;
            while (ss > 0 && (data.types[ss] === "comment" || data.types[ss] === "ignore"));
          }
          if (is(data.token[ss], 44 /* COM */))
            ss = ss - 1;
          store.push(data.token[ss]);
        } while (ss > 0 && (is(data.token[ss - 1], 44 /* COM */) || data.types[ss - 1] === "selector" || data.types[ss - 1] === "comment" || data.types[ss - 1] === "ignore"));
        store.sort();
        ss = parse.count;
        data.token[ss] = store.pop();
        do {
          ss = ss - 1;
          if (data.types[ss] === "comment" || data.types[ss] === "ignore") {
            do
              ss = ss - 1;
            while (ss > 0 && (data.types[ss] === "comment" || data.types[ss] === "ignore"));
          }
          if (is(data.token[ss], 44 /* COM */))
            ss = ss - 1;
          data.token[ss] = store.pop();
        } while (ss > 0 && (is(data.token[ss - 1], 44 /* COM */) || data.types[ss - 1] === "selector" || data.types[ss - 1] === "comment" || data.types[ss - 1] === "ignore"));
      }
      aa = parse.count;
      priors();
    }
    priors();
    if (type === "start" && (data.types[aa] === "value" || data.types[aa] === "variable")) {
      data.types[aa] = "item";
    }
    if (data.lexer[parse.count - 1] !== "style" || bb < 0) {
      if (type === "colon") {
        if (is(first, 36 /* DOL */) || is(first, 64 /* ATT */)) {
          data.types[aa] = "variable";
        } else if (data.stack[aa] !== "global" && (data.types[aa] !== "comment" || data.types[aa] !== "ignore")) {
          data.types[aa] = "property";
        }
      } else if (data.lexer[aa] === "style") {
        data.types[aa] = "selector";
        selector(aa);
      }
    } else if (type === "start" && data.types[aa] === "function" && data.lexer[aa] === "style") {
      data.types[aa] = "selector";
      selector(aa);
    } else if (data.types[aa] === "item" && data.lexer[aa] === "style") {
      if (type === "start") {
        selector(aa);
        data.types[aa] = "selector";
        if (data.token[aa] === ":")
          data.types[bb] = "selector";
        if (data.token[aa].indexOf("=\u201C") > 0) {
          parse.error = `Invalid Quote (\u201C, \\201c) used on line number ${parse.lineNumber}`;
        } else if (data.token[aa].indexOf("=\u201D") > 0) {
          parse.error = `Invalid Quote (\u201D, \\201d) used on line number ${parse.lineNumber}`;
        }
      } else if (type === "end") {
        if (is(first, 36 /* DOL */) || is(first, 64 /* ATT */)) {
          data.types[aa] = "variable";
        } else {
          data.types[aa] = "value";
        }
        data.token[aa] = value(data.token[aa]);
      } else if (type === "separator") {
        if (data.types[bb] === "colon" || is(data.token[bb], 44 /* COM */) || is(data.token[bb], 123 /* LCB */)) {
          if (not(b[a], 59 /* SEM */) && (data.types[bb] === "selector" || data.types[bb] === "at_rule" || is(data.token[bb], 123 /* LCB */))) {
            data.types[aa] = "selector";
            selector(aa);
          } else if (is(data.token[aa], 36 /* DOL */) || is(data.token[aa], 64 /* ATT */)) {
            data.types[aa] = "variable";
          } else {
            data.types[aa] = "value";
          }
          data.token[aa] = value(data.token[aa]);
          if (data.token[aa].charAt(0) === "\u201C") {
            parse.error = `Invalid Quote (\u201C, \\201c) used on line number ${parse.lineNumber}`;
          } else if (data.token[aa].charAt(0) === "\u201D") {
            parse.error = `Invalid (\u201D, \\201d) used on line number ${parse.lineNumber}`;
          }
        } else {
          if (is(first, 36 /* DOL */) || is(first, 64 /* ATT */)) {
            data.types[aa] = "variable";
          } else if (data.types[bb] === "value" || data.types[bb] === "variable") {
            data.token[bb] = data.token[bb] + data.token[aa];
            parse.pop(data);
          } else {
            data.types[aa] = "value";
          }
        }
      } else if (type === "colon") {
        if (is(first, 36 /* DOL */) || is(first, 64 /* ATT */)) {
          data.types[aa] = "variable";
        } else {
          data.types[aa] = "property";
        }
      } else if (is(data.token[bb], 64 /* ATT */) && (data.types[bb - 2] !== "variable" && data.types[bb - 2] !== "property" || data.types[bb - 1] === "separator")) {
        data.types[bb] = "variable";
        ltype = "variable";
        data.token[bb] = value(data.token[bb]);
      } else if (type === "comment") {
        if (is(first, 46 /* DOT */) || is(first, 35 /* HSH */)) {
          data.types[aa] = "selector";
        }
      }
    }
  }
  function semiComment() {
    let x = parse.count;
    do
      x = x - 1;
    while (x > 0 && data.types[x] === "comment");
    if (data.token[x] === ";")
      return;
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
  }
  function template(open, end) {
    const store = [];
    let quote = NIL;
    let name = NIL;
    let endlen = 0;
    let start = open.length;
    function exit(typeName) {
      const endtype = parse.count > 0 ? data.types[parse.count - 1] : data.types[parse.count];
      if (ltype === "item") {
        if (endtype === "colon") {
          data.types[parse.count] = "value";
        } else {
          item(endtype);
        }
      }
      if (is(b[a + 1], 32 /* WSP */)) {
        data.lines[parse.count] = 1;
      }
      ltype = typeName;
      if (ltype.indexOf("start") > -1 || ltype.indexOf("else") > -1) {
        push(ltoke);
      } else {
        push(NIL);
      }
    }
    nosort[nosort.length - 1] = true;
    if (a < c) {
      do {
        store.push(b[a]);
        if (quote === NIL) {
          if (is(b[a], 34 /* DQO */)) {
            quote = '"';
          } else if (is(b[a], 39 /* SQO */)) {
            quote = "'";
          } else if (is(b[a], 47 /* FWS */)) {
            if (is(b[a + 1], 47 /* FWS */)) {
              quote = "/";
            } else if (is(b[a + 1], 42 /* ARS */)) {
              quote = "*";
            }
          } else if (b[a + 1] === end.charAt(0)) {
            do {
              endlen = endlen + 1;
              a = a + 1;
              store.push(b[a]);
            } while (a < c && endlen < end.length && b[a + 1] === end.charAt(endlen));
            if (endlen === end.length) {
              quote = store.join(NIL);
              if (ws(quote.charAt(start))) {
                do {
                  start = start + 1;
                } while (ws(quote.charAt(start)));
              }
              endlen = start;
              do {
                endlen = endlen + 1;
              } while (endlen < end.length && !ws(quote.charAt(endlen)));
              if (endlen === quote.length)
                endlen = endlen - end.length;
              if (open === "{%") {
                if (is(quote[2], 45 /* DSH */)) {
                  quote = quote.replace(/^{%-\s*/, "{%- ");
                  quote = quote.endsWith("-%}") ? quote.replace(/\s*-%}$/, " -%}") : quote.replace(/\s*%}$/, " %}");
                  name = quote.slice(4);
                } else {
                  quote = quote.replace(/^{%\s*/, "{% ");
                  quote = quote.endsWith("-%}") ? quote.replace(/\s*-%}$/, " -%}") : quote.replace(/\s*%}$/, " %}");
                  name = quote.slice(3);
                }
              }
              if (open === "{{") {
                if (is(quote[2], 45 /* DSH */)) {
                  quote = quote.replace(/^{{-\s*/, "{{- ");
                  quote = quote.endsWith("-}}") ? quote.replace(/\s*-}}$/, " -}}") : quote.replace(/\s*}}$/, " }}");
                } else {
                  quote = quote.replace(/^{{\s*/, "{{ ");
                  quote = quote.endsWith("-}}") ? quote.replace(/\s*-}}$/, " -}}") : quote.replace(/\s*%}}$/, " }}");
                }
              }
              if (ltype === "item" && data.types[parse.count - 1] === "colon" && (data.types[parse.count - 2] === "property" || data.types[parse.count - 2] === "variable")) {
                ltype = "value";
                data.types[parse.count] = "value";
                if (Number.isNaN(Number(data.token[parse.count])) === true && data.token[parse.count].charAt(data.token[parse.count].length - 1) !== ")") {
                  data.token[parse.count] = data.token[parse.count] + quote;
                } else {
                  data.token[parse.count] = data.token[parse.count] + WSP + quote;
                }
                return;
              }
              ltoke = quote;
              if (open === "{%") {
                const templateNames = Array.from(grammar.liquid.tags);
                let namesLen = templateNames.length - 1;
                name = name.slice(0, name.indexOf(WSP));
                if (name.indexOf("(") > 0) {
                  name = name.slice(0, name.indexOf("("));
                }
                if (grammar.liquid.else.has(name)) {
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
                } while (begin < ending && ws(group.charAt(begin)) === false && group.charCodeAt(start) !== 40 /* LPR */);
                group = group.slice(0, begin);
                if (is(group[group.length - 2], 125 /* RCB */))
                  group = group.slice(0, group.length - 2);
                if (group === "end") {
                  exit("template_end");
                  return;
                }
              }
              exit("template");
              return;
            }
            endlen = 0;
          }
        } else if (quote === b[a]) {
          if (is(quote, 34 /* DQO */) || is(quote, 39 /* SQO */)) {
            quote = NIL;
          } else if (is(quote, 47 /* FWS */) && (b[a] === "\r" || is(b[a], 10 /* NWL */))) {
            quote = NIL;
          } else if (is(quote, 42 /* ARS */) && is(b[a + 1], 47 /* FWS */)) {
            quote = NIL;
          }
        }
        a = a + 1;
      } while (a < c);
    }
  }
  function comment2(isLineComment) {
    let comm;
    if (isLineComment) {
      comm = wrapCommentLine({
        chars: b,
        start: a,
        end: c,
        lexer: "style",
        begin: "//",
        ender: "\n"
      });
      ltoke = comm[0];
      ltype = /^(\/\/\s*@prettify-ignore-start)/.test(ltoke) ? "ignore" : "comment";
    } else {
      comm = wrapCommentBlock({
        chars: b,
        start: a,
        end: c,
        lexer: "style",
        begin: "/*",
        ender: "*/"
      });
      ltoke = comm[0];
      ltype = /^(\/\*\s*@prettify-ignore-start)/.test(ltoke) ? "ignore" : "comment";
    }
    push(NIL);
    a = comm[1];
  }
  function marginPadding() {
    const lines = parse.linesSpace;
    const props = {
      data: {
        margin: [
          NIL,
          NIL,
          NIL,
          NIL,
          false
        ],
        padding: [
          NIL,
          NIL,
          NIL,
          NIL,
          false
        ]
      },
      last: {
        margin: 0,
        padding: 0
      },
      removes: []
    };
    const begin = parse.structure[parse.structure.length - 1][1];
    function populate(prop) {
      if (data.token[aa - 2] === prop) {
        const values = data.token[aa].replace(/\s*!important\s*/g, NIL).split(WSP);
        const vlen = values.length;
        if (data.token[aa].indexOf("!important") > -1)
          props.data[prop[4]] = true;
        if (vlen > 3) {
          if (props.data[prop][0] === NIL)
            props.data[prop][0] = values[0];
          if (props.data[prop][1] === NIL)
            props.data[prop][1] = values[1];
          if (props.data[prop][2] === NIL)
            props.data[prop][2] = values[2];
          if (props.data[prop][3] === NIL)
            props.data[prop][3] = values[3];
        } else if (vlen > 2) {
          if (props.data[prop][0] === NIL)
            props.data[prop][0] = values[0];
          if (props.data[prop][1] === NIL)
            props.data[prop][1] = values[1];
          if (props.data[prop][2] === NIL)
            props.data[prop][2] = values[2];
          if (props.data[prop][3] === NIL)
            props.data[prop][3] = values[1];
        } else if (vlen > 1) {
          if (props.data[prop][0] === NIL)
            props.data[prop][0] = values[0];
          if (props.data[prop][1] === NIL)
            props.data[prop][1] = values[1];
          if (props.data[prop][2] === NIL)
            props.data[prop][2] = values[0];
          if (props.data[prop][3] === NIL)
            props.data[prop][3] = values[1];
        } else {
          if (props.data[prop][0] === NIL)
            props.data[prop][0] = values[0];
          if (props.data[prop][1] === NIL)
            props.data[prop][1] = values[0];
          if (props.data[prop][2] === NIL)
            props.data[prop][2] = values[0];
          if (props.data[prop][3] === NIL)
            props.data[prop][3] = values[0];
        }
      } else if (data.token[aa - 2] === `${prop}-bottom`) {
        if (props.data[prop][2] === NIL)
          props.data[prop][2] = data.token[aa];
      } else if (data.token[aa - 2] === `${prop}-left`) {
        if (props.data[prop][3] === NIL)
          props.data[prop][3] = data.token[aa];
      } else if (data.token[aa - 2] === `${prop}-right`) {
        if (props.data[prop][1] === NIL)
          props.data[prop][1] = data.token[aa];
      } else if (data.token[aa - 2] === `${prop}-top`) {
        if (props.data[prop][0] === NIL)
          props.data[prop][0] = data.token[aa];
      } else {
        return;
      }
      props.removes.push([aa, prop]);
      props.last[prop] = aa;
    }
    function removes() {
      let ii = 0;
      let values = NIL;
      const zero = /^(0+([a-z]+|%))/;
      const bb = props.removes.length;
      const tmargin = props.data.margin[0] !== NIL && props.data.margin[1] !== NIL && props.data.margin[2] !== NIL && props.data.margin[3] !== NIL;
      const tpadding = props.data.padding[0] !== NIL && props.data.padding[1] !== NIL && props.data.padding[2] !== NIL && props.data.padding[3] !== NIL;
      function applyValues(prop) {
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
          values = `${values.replace(" !important", NIL)} !important`;
        if (props.last[prop] > parse.count) {
          ii = begin < 1 ? 1 : begin + 1;
          do {
            if (data.begin[ii] === begin && data.types[ii] === "value" && data.token[ii - 2].indexOf(prop) === 0) {
              props.last[prop] = ii;
              break;
            }
            ii = ii + 1;
          } while (ii < parse.count);
        }
        data.token[props.last[prop]] = values;
        data.token[props.last[prop] - 2] = prop;
      }
      if (bb > 1 && (tmargin === true || tpadding === true)) {
        do {
          if (props.removes[ii][0] !== props.last.margin && props.removes[ii][0] !== props.last.padding && (tmargin === true && props.removes[ii][1] === "margin" || tpadding === true && props.removes[ii][1] === "padding")) {
            parse.splice({
              data,
              howmany: data.types[props.removes[ii][0] + 1] === "separator" ? 4 : 3,
              index: props.removes[ii][0] - 2
            });
          }
          ii = ii + 1;
        } while (ii < bb - 1);
      }
      if (tmargin === true)
        applyValues("margin");
      if (tpadding === true)
        applyValues("padding");
      if (endtest === true) {
        if (begin < 0) {
          parse.error = "Brace mismatch. There appears to be more closing braces than starting braces.";
        } else {
          parse.sortCorrect(begin, parse.count + 1);
        }
      }
    }
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
  }
  function parseSpace() {
    parse.linesSpace = 1;
    do {
      if (is(b[a], 10 /* NWL */)) {
        parse.lineStart = a;
        parse.linesSpace = parse.linesSpace + 1;
        parse.lineNumber = parse.lineNumber + 1;
      }
      if (ws(b[a + 1]) === false)
        break;
      a = a + 1;
    } while (a < c);
  }
  do {
    if (ws(b[a])) {
      parseSpace();
    } else if (is(b[a], 47 /* FWS */) && is(b[a + 1], 42 /* ARS */)) {
      comment2(false);
    } else if (is(b[a], 47 /* FWS */) && is(b[a + 1], 47 /* FWS */)) {
      comment2(true);
    } else if (is(b[a], 123 /* LCB */) && is(b[a + 1], 37 /* PER */)) {
      template("{%", "%}");
    } else if (is(b[a], 123 /* LCB */) && is(b[a + 1], 123 /* LCB */)) {
      template("{{", "}}");
    } else if (is(b[a], 123 /* LCB */) || is(b[a], 40 /* LPR */) && is(data.token[parse.count], 58 /* COL */) && data.types[parse.count - 1] === "variable") {
      item("start");
      ltype = "start";
      ltoke = b[a];
      if (is(b[a], 40 /* LPR */)) {
        push("map");
        mapper.push(0);
      } else if (data.types[parse.count] === "at_rule" || data.types[parse.count] === "selector" || data.types[parse.count] === "variable") {
        if (is(data.token[parse.count], 64 /* ATT */)) {
          data.types[parse.count] = "at_rule";
          push(data.token[parse.count]);
        } else {
          push(data.token[parse.count]);
        }
      } else if (data.types[parse.count] === "colon") {
        push(data.token[parse.count - 1]);
      } else {
        push("block");
      }
      nosort.push(false);
    } else if (is(b[a], 125 /* RCB */) || b[a] === ")" && parse.structure[parse.structure.length - 1][0] === "map" && mapper[mapper.length - 1] === 0) {
      if (is(b[a], 125 /* RCB */) && is(data.token[parse.count - 1], 123 /* LCB */) && data.types[parse.count] === "item" && data.token[parse.count - 2] !== void 0 && data.token[parse.count - 2].charCodeAt(data.token[parse.count - 2].length - 1) === 64 /* ATT */) {
        data.token[parse.count - 2] = data.token[parse.count - 2] + "{" + data.token[parse.count] + "}";
        parse.pop(data);
        parse.pop(data);
        parse.structure.pop();
      } else {
        if (is(b[a], 41 /* RPR */))
          mapper.pop();
        item("end");
        if (is(b[a], 125 /* RCB */) && not(data.token[parse.count], 59 /* SEM */)) {
          if (data.types[parse.count] === "value" || data.types[parse.count] === "function" || data.types[parse.count] === "variable" && (is(data.token[parse.count - 1], 58 /* COL */) || is(data.token[parse.count - 1], 59 /* SEM */))) {
            if (rules2.style.correct === true) {
              ltoke = ";";
            } else {
              ltoke = "x;";
            }
            ltype = "separator";
            push(NIL);
          } else if (data.types[parse.count] === "comment") {
            semiComment();
          }
        }
        nosort.pop();
        ltoke = b[a];
        ltype = "end";
        if (is(b[a], 125 /* RCB */))
          marginPadding();
        if (rules2.style.sortProperties === true && is(b[a], 125 /* RCB */))
          parse.sortObject(data);
        push(NIL);
      }
    } else if (is(b[a], 59 /* SEM */) || is(b[a], 44 /* COM */)) {
      if (data.types[parse.count - 1] === "selector" || data.types[parse.count - 1] === "at_rule" || data.types[parse.count] !== "function" && is(data.token[parse.count - 1], 125 /* RCB */)) {
        item("start");
      } else {
        item("separator");
      }
      if (data.types[parse.count] !== "separator" && esctest(a) === true) {
        ltoke = b[a];
        ltype = "separator";
        push(NIL);
      }
    } else if (parse.count > -1 && is(b[a], 58 /* COL */) && data.types[parse.count] !== "end") {
      item("colon");
      ltoke = ":";
      ltype = "colon";
      push(NIL);
    } else {
      if (parse.structure[parse.structure.length - 1][0] === "map" && is(b[a], 40 /* LPR */)) {
        mapper[mapper.length - 1] = mapper[mapper.length - 1] + 1;
      }
      buildToken();
    }
    a = a + 1;
  } while (a < c);
  if (rules2.style.sortProperties === true)
    parse.sortObject(data);
  return data;
};

// src/lexers/script.ts
prettify.lexers.script = function ScriptLexer(source) {
  const { rules: rules2 } = prettify;
  const cloneopts = assign({}, rules2.script);
  if (rules2.language === "json") {
    rules2.script = assign(rules2.script, rules2.json, {
      quoteConvert: "double",
      endComma: "never",
      noSemicolon: true,
      vertical: false
    });
  }
  const { data, references } = parse;
  const c = isArray(source) ? source : source.split(NIL);
  const b = c.length;
  const lword = [];
  const brace = [];
  const classy = [];
  const sourcemap = [0, NIL];
  const tstype = [false];
  const vstore = { count: [], index: [], word: [] };
  let v = -1;
  let a = 0;
  let ltoke = NIL;
  let ltype = NIL;
  let pword = [];
  let lengthb = 0;
  let wtest = -1;
  let paren = -1;
  let fnrefs = [];
  let tstore;
  let pstack;
  let comment2;
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
  function pop() {
    vstore.count.pop();
    vstore.index.pop();
    vstore.word.pop();
    v = v - 1;
  }
  function push(structure = NIL) {
    const record = {
      begin: parse.scope.index,
      ender: -1,
      lexer: "script",
      lines: parse.linesSpace,
      stack: parse.scope.token,
      token: ltoke,
      types: ltype
    };
    parse.push(data, record, structure);
  }
  function peek(len, current) {
    let n = current === true ? a : a + 1;
    let s = NIL;
    if (typeof len !== "number" || len < 1)
      len = 1;
    if (is(c[a], 47 /* FWS */)) {
      if (is(c[a + 1], 47 /* FWS */)) {
        s = NWL;
      } else if (is(c[a + 1], 42 /* ARS */)) {
        s = "/";
      }
    }
    if (n < b) {
      do {
        if (ws(c[n]) === false) {
          if (is(c[n], 47 /* FWS */)) {
            if (s === NIL) {
              if (is(c[n + 1], 47 /* FWS */)) {
                s = NWL;
              } else if (is(c[n + 1], 42 /* ARS */)) {
                s = "/";
              }
            } else if (is(s, 47 /* FWS */) && is(c[n - 1], 42 /* ARS */)) {
              s = NIL;
            }
          }
          if (s === NIL && c[n - 1] + c[n] !== "*/")
            return c.slice(n, n + len).join(NIL);
        } else if (is(s, 10 /* NWL */) && is(c[n], 10 /* NWL */)) {
          s = NIL;
        }
        n = n + 1;
      } while (n < b);
    }
    return NIL;
  }
  function esc(index) {
    const cache = index;
    do
      index = index - 1;
    while (is(c[index], 92 /* BWS */) && index > 0);
    return (cache - index) % 2 === 1;
  }
  function applySemicolon(isEnd) {
    const next = peek(1, false);
    const clist = parse.structure.length === 0 ? NIL : parse.scope.token;
    const record = {
      begin: data.begin[parse.count],
      ender: data.begin[parse.count],
      lexer: data.lexer[parse.count],
      lines: data.lines[parse.count],
      stack: data.stack[parse.count],
      token: data.token[parse.count],
      types: data.types[parse.count]
    };
    if (CommIgnoreStart.test(ltoke)) {
      return;
    }
    if (ltype === "start" || ltype === "type_start") {
      return;
    }
    if (rules2.language === "json") {
      return;
    }
    if (is(next, 123 /* LCB */) || is(record.token, 59 /* SEM */) || is(record.token, 44 /* COM */) || record.stack === "class" || record.stack === "map" || record.stack === "attribute" || data.types[record.begin - 1] === "generic" || clist === "initializer") {
      return;
    }
    if (is(record.token, 125 /* RCB */) && data.stack[record.begin - 1] === "global" && data.types[record.begin - 1] !== "operator" && record.stack === data.stack[parse.count - 1]) {
      return;
    }
    if (record.stack === "array" && not(record.token, 93 /* RSB */)) {
      return;
    }
    if (is(data.token[data.begin[parse.count]], 123 /* LCB */) && record.stack === "data_type") {
      return;
    }
    if (record.types !== void 0 && record.types.indexOf("liquid") > -1 && record.types.indexOf("liquid_string") < 0) {
      return;
    }
    if (is(next, 59 /* SEM */) && isEnd === false) {
      return;
    }
    if (data.lexer[parse.count - 1] !== "script" && (a < b && b === prettify.source.length - 1 || b < prettify.source.length - 1)) {
      return;
    }
    let i = 0;
    if (is(record.token, 125 /* RCB */) && (record.stack === "function" || record.stack === "if" || record.stack === "else" || record.stack === "for" || record.stack === "do" || record.stack === "while" || record.stack === "switch" || record.stack === "class" || record.stack === "try" || record.stack === "catch" || record.stack === "finally" || record.stack === "block")) {
      if (record.stack === "function" && (data.stack[record.begin - 1] === "data_type" || data.types[record.begin - 1] === "type")) {
        i = record.begin;
        do
          i = i - 1;
        while (i > 0 && not(data.token[i], 41 /* RPR */) && data.stack[i] !== "arguments");
        i = data.begin[i];
      } else {
        i = data.begin[record.begin - 1];
      }
      if (is(data.token[i], 40 /* LPR */)) {
        i = i - 1;
        if (data.token[i - 1] === "function")
          i = i - 1;
        if (data.stack[i - 1] === "object" || data.stack[i - 1] === "switch")
          return;
        if (not(data.token[i - 1], 61 /* EQS */) && not(data.token[i - 1], 58 /* COL */) && data.token[i - 1] !== "return")
          return;
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
    if (next !== NIL && "=<>+*?|^:&%~,.()]".indexOf(next) > -1 && isEnd === false)
      return;
    if (record.types === "comment") {
      i = parse.count;
      do
        i = i - 1;
      while (i > 0 && data.types[i] === "comment");
      if (i < 1)
        return;
      record.token = data.token[i];
      record.types = data.types[i];
      record.stack = data.stack[i];
    }
    if (record.token === void 0 || record.types === "start" || record.types === "separator" || record.types === "operator" && record.token !== "++" && record.token !== "--" || record.token === "x}" || record.token === "var" || record.token === "let" || record.token === "const" || record.token === "else" || record.token.indexOf("#!/") === 0 || record.token === "instanceof") {
      return;
    }
    if (record.stack === "method" && (data.token[record.begin - 1] === "function" || data.token[record.begin - 2] === "function")) {
      return;
    }
    if (rules2.script.variableList === "list")
      vstore.index[v] = parse.count;
    ltoke = rules2.script.correct === true ? ";" : "x;";
    ltype = "separator";
    i = parse.linesSpace;
    parse.linesSpace = 0;
    push();
    parse.linesSpace = i;
    applyBrace();
  }
  function cleanSemicolon() {
    let i = parse.count;
    if (data.types[i] === "comment") {
      do
        i = i - 1;
      while (i > 0 && data.types[i] === "comment");
    }
    if (data.token[i] === "from")
      i = i - 2;
    if (data.token[i] === "x;")
      parse.splice({ data, howmany: 1, index: i });
  }
  function braceSemicolon() {
    let i = parse.count;
    do
      i = i - 1;
    while (i > -1 && data.token[i] === "x}");
    if (data.stack[i] === "else")
      return push();
    i = i + 1;
    parse.splice({
      data,
      howmany: 0,
      index: i,
      record: {
        begin: data.begin[i],
        ender: -1,
        lexer: "script",
        lines: parse.linesSpace,
        stack: data.stack[i],
        token: ltoke,
        types: ltype
      }
    });
    push();
  }
  function parseBlockComment() {
    applySemicolon(false);
    if (wtest > -1)
      word();
    comment2 = wrapCommentBlock({
      chars: c,
      end: b,
      lexer: "script",
      begin: "/*",
      start: a,
      ender: "*/"
    });
    a = comment2[1];
    if (data.token[parse.count] === "var" || data.token[parse.count] === "let" || data.token[parse.count] === "const") {
      tstore = parse.pop(data);
      push();
      parse.push(data, tstore, NIL);
      if (data.lines[parse.count - 2] === 0)
        data.lines[parse.count - 2] = data.lines[parse.count];
      data.lines[parse.count] = 0;
    } else if (comment2[0] !== NIL) {
      ltoke = comment2[0];
      ltype = CommIgnoreStart.test(ltoke) ? "ignore" : "comment";
      if (ltoke.indexOf("# sourceMappingURL=") === 2) {
        sourcemap[0] = parse.count + 1;
        sourcemap[1] = ltoke;
      }
      parse.push(data, {
        begin: parse.scope.index,
        ender: -1,
        lexer: "script",
        lines: parse.linesSpace,
        stack: parse.scope.token,
        token: ltoke,
        types: ltype
      }, NIL);
    }
    if (/\/\*\s*global\s+/.test(data.token[parse.count]) && data.types.indexOf("word") < 0) {
      references[0] = data.token[parse.count].replace(/\/\*\s*global\s+/, NIL).replace("*/", NIL).replace(/,\s+/g, ",").split(",");
    }
  }
  function parseLineComment() {
    applySemicolon(false);
    applyBrace();
    if (wtest > -1)
      word();
    comment2 = wrapCommentLine({
      chars: c,
      end: b,
      lexer: "script",
      begin: "//",
      start: a,
      ender: NWL
    });
    a = comment2[1];
    if (comment2[0] !== NIL) {
      ltoke = comment2[0];
      ltype = CommIgnoreStart.test(ltoke) ? "ignore" : "comment";
      if (ltoke.indexOf("# sourceMappingURL=") === 2) {
        sourcemap[0] = parse.count + 1;
        sourcemap[1] = ltoke;
      }
      parse.push(data, {
        begin: parse.scope.index,
        ender: -1,
        lexer: "script",
        lines: parse.linesSpace,
        stack: parse.scope.token,
        token: ltoke,
        types: ltype
      }, NIL);
    }
  }
  function parseRegex() {
    let h = 0;
    let i = 0;
    let n = a + 1;
    let square = false;
    const length = b;
    const build = ["/"];
    if (n < length) {
      do {
        build.push(c[n]);
        if (not(c[n - 1], 92 /* BWS */) || is(c[n - 2], 92 /* BWS */)) {
          if (is(c[n], 91 /* LSB */))
            square = true;
          if (is(c[n], 93 /* RSB */))
            square = false;
        }
        if (is(c[n], 47 /* FWS */) && square === false) {
          if (is(c[n - 1], 92 /* BWS */)) {
            i = 0;
            h = n - 1;
            if (h > 0) {
              do {
                if (is(c[h], 92 /* BWS */))
                  i = i + 1;
                else
                  break;
                h = h - 1;
              } while (h > 0);
            }
            if (i % 2 === 0)
              break;
          } else {
            break;
          }
        }
        n = n + 1;
      } while (n < length);
    }
    if (c[n + 1] === "g" || c[n + 1] === "i" || c[n + 1] === "m" || c[n + 1] === "y" || c[n + 1] === "u") {
      build.push(c[n + 1]);
      if (c[n + 2] !== c[n + 1] && (c[n + 2] === "g" || c[n + 2] === "i" || c[n + 2] === "m" || c[n + 2] === "y" || c[n + 2] === "u")) {
        build.push(c[n + 2]);
        if (c[n + 3] !== c[n + 1] && c[n + 3] !== c[n + 2] && (c[n + 3] === "g" || c[n + 3] === "i" || c[n + 3] === "m" || c[n + 3] === "y" || c[n + 3] === "u")) {
          build.push(c[n + 3]);
          if (c[n + 4] !== c[n + 1] && c[n + 4] !== c[n + 2] && c[n + 4] !== c[n + 3] && (c[n + 4] === "g" || c[n + 4] === "i" || c[n + 4] === "m" || c[n + 4] === "y" || c[n + 4] === "u")) {
            build.push(c[n + 4]);
            if (c[n + 5] !== c[n + 1] && c[n + 5] !== c[n + 2] && c[n + 5] !== c[n + 3] && c[n + 5] !== c[n + 4] && (c[n + 5] === "g" || c[n + 5] === "i" || c[n + 5] === "m" || c[n + 5] === "y" || c[n + 5] === "u")) {
              build.push(c[n + 4]);
              a = n + 5;
            } else {
              a = n + 4;
            }
          } else {
            a = n + 3;
          }
        } else {
          a = n + 2;
        }
      } else {
        a = n + 1;
      }
    } else {
      a = n;
    }
    return build.join(NIL);
  }
  function parseNumbers() {
    const build = [c[a]];
    let i = 0;
    let dot = is(build[0], 46 /* DOT */);
    let exp = /zz/;
    if (a < b - 2 && c[a] === "0") {
      if (c[a + 1] === "x") {
        exp = /[0-9a-fA-F]/;
      } else if (c[a + 1] === "o") {
        exp = /[0-9]/;
      } else if (c[a + 1] === "b") {
        exp = /0|1/;
      }
      if (exp.test(c[a + 2])) {
        build.push(c[a + 1]);
        i = a + 1;
        do {
          i = i + 1;
          build.push(c[i]);
        } while (exp.test(c[i + 1]));
        a = i;
        return build.join(NIL);
      }
    }
    i = a + 1;
    if (i < b) {
      do {
        if (digit(c[i]) || is(c[i], 46 /* DOT */) && dot === false) {
          build.push(c[i]);
          if (is(c[i], 46 /* DOT */))
            dot = true;
        } else {
          break;
        }
        i = i + 1;
      } while (i < b);
    }
    if (i < b - 1 && (digit(c[i - 1]) || digit(c[i - 2]) && (is(c[i - 1], 45 /* DSH */) || is(c[i - 1], 43 /* PLS */))) && (c[i] === "e" || c[i] === "E")) {
      build.push(c[i]);
      if (is(c[i + 1], 45 /* DSH */) || is(c[i + 1], 43 /* PLS */)) {
        build.push(c[i + 1]);
        i = i + 1;
      }
      dot = false;
      i = i + 1;
      if (i < b) {
        do {
          if (digit(c[i]) || is(c[i], 46 /* DOT */) && dot === false) {
            build.push(c[i]);
            if (is(c[i], 46 /* DOT */))
              dot = true;
          } else {
            break;
          }
          i = i + 1;
        } while (i < b);
      }
    }
    a = i - 1;
    return build.join(NIL);
  }
  function parseOperator() {
    let g = 0;
    let h = 0;
    let jj = b;
    let output = NIL;
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
    if (wtest > -1)
      word();
    if (is(c[a], 47 /* FWS */) && (parse.count > -1 && (ltype !== "word" && ltype !== "reference" || ltoke === "typeof" || ltoke === "return" || ltoke === "else") && ltype !== "number" && ltype !== "string" && ltype !== "end")) {
      if (ltoke === "return" || ltoke === "typeof" || ltoke === "else" || ltype !== "word") {
        ltoke = parseRegex();
        ltype = "regex";
      } else {
        ltoke = "/";
        ltype = "operator";
      }
      push();
      return "regex";
    }
    if (is(c[a], 63 /* QWS */) && ("+-*/.?".indexOf(c[a + 1]) > -1 || is(c[a + 1], 58 /* COL */) && syntax.join(NIL).indexOf(c[a + 2]) < 0)) {
      if (is(c[a + 1], 46 /* DOT */) && digit(c[a + 2]) === false) {
        output = "?.";
      } else if (is(c[a + 1], 63 /* QWS */)) {
        output = "??";
      }
      if (output === NIL)
        return "?";
    }
    if (is(c[a], 58 /* COL */) && "+-*/".indexOf(c[a + 1]) > -1)
      return ":";
    if (a < b - 1) {
      if (not(c[a], 60 /* LAN */) && is(c[a + 1], 60 /* LAN */))
        return c[a];
      if (is(c[a], 33 /* BNG */) && is(c[a + 1], 47 /* FWS */))
        return "!";
      if (is(c[a], 45 /* DSH */)) {
        tstype[tstype.length - 1] = false;
        if (is(c[a + 1], 45 /* DSH */)) {
          output = "--";
        } else if (is(c[a + 1], 61 /* EQS */)) {
          output = "-=";
        } else if (is(c[a + 1], 62 /* RAN */)) {
          output = "->";
        }
        if (output === NIL)
          return "-";
      }
      if (is(c[a], 43 /* PLS */)) {
        tstype[tstype.length - 1] = false;
        if (is(c[a + 1], 43 /* PLS */)) {
          output = "++";
        } else if (is(c[a + 1], 61 /* EQS */)) {
          output = "+=";
        }
        if (output === NIL)
          return "+";
      }
      if (is(c[a], 61 /* EQS */) && not(c[a + 1], 61 /* EQS */) && not(c[a + 1], 33 /* BNG */) && not(c[a + 1], 62 /* RAN */)) {
        tstype[tstype.length - 1] = false;
        return "=";
      }
    }
    if (is(c[a], 59 /* SEM */)) {
      if (rules2.language === "typescript") {
        if (data.stack[parse.count] === "arguments") {
          if (data.token[parse.count] === "?") {
            parse.pop(data);
            output = "?:";
            a = a - 1;
          }
          tstype[tstype.length - 1] = true;
        } else if (is(ltoke, 41 /* RPR */) && (data.token[data.begin[parse.count] - 1] === "function" || data.token[data.begin[parse.count] - 2] === "function")) {
          tstype[tstype.length - 1] = true;
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
                tstype[tstype.length - 1] = true;
                break;
              }
            } else {
              if (data.types[g] === "type_end") {
                tstype[tstype.length - 1] = true;
                break;
              }
              g = data.begin[g];
            }
            g = g - 1;
          } while (g > data.begin[parse.count]);
        }
      } else if (data.token[parse.count - 1] === "[" && (data.types[parse.count] === "word" || data.types[parse.count] === "reference")) {
        parse.scope.token = "attribute";
        data.stack[parse.count] = "attribute";
      }
    }
    if (output === NIL) {
      if (is(c[a + 1], 43 /* PLS */) && is(c[a + 2], 43 /* PLS */) || is(c[a + 1], 45 /* DSH */) && is(c[a + 2], 45 /* DSH */)) {
        output = c[a];
      } else {
        const buildout = [c[a]];
        g = a + 1;
        if (g < jj) {
          do {
            if (is(c[g], 43 /* PLS */) && is(c[g + 1], 43 /* PLS */) || is(c[g], 45 /* DSH */) && is(c[g + 1], 45 /* DSH */))
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
        output = buildout.join(NIL);
      }
    }
    a = a + (output.length - 1);
    if (output === "=>" && is(ltoke, 41 /* RPR */)) {
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
  function parseLiteral() {
    const build = [c[a]];
    a = a + 1;
    if (a < b) {
      do {
        build.push(c[a]);
        if (is(c[a], 96 /* TQO */) && (not(c[a - 1], 92 /* BWS */) || !esc(a - 1)))
          break;
        if (is(c[a - 1], 36 /* DOL */) && is(c[a], 123 /* LCB */) && (not(c[a - 2], 92 /* BWS */) || !esc(a - 2)))
          break;
        a = a + 1;
      } while (a < b);
    }
    return build.join(NIL);
  }
  function parseMarkup() {
    let d = 0;
    let curlytest = false;
    let endtag = false;
    let anglecount = 0;
    let curlycount = 0;
    let tagcount = 0;
    let next = NIL;
    let ptoke = NIL;
    let ptype = NIL;
    const output = [];
    const dt = tstype[tstype.length - 1];
    const syntaxnum = "0123456789=<>+-*?|^:&.,;%(){}[]~";
    function applyMarkup() {
      if (is(ltoke, 40 /* LPR */))
        parse.structure.update("paren", parse.count);
      prettify.lexers.markup(output.join(NIL));
    }
    if (wtest > -1)
      word();
    ptoke = parse.count > 0 ? data.token[parse.count - 1] : NIL;
    ptype = parse.count > 0 ? data.types[parse.count - 1] : NIL;
    next = peek(1, false);
    if (rules2.language !== "jsx" && rules2.language !== "tsx" && digit(next) === false && (ltoke === "function" || ptoke === "=>" || ptoke === "void" || ptoke === "." || ltoke === "return" || ltype === "operator" || data.stack[parse.count] === "arguments" || ltype === "type" && ptoke === "type" || ltype === "reference" && (ptype === "operator" || ptoke === "function" || ptoke === "class" || ptoke === "new") || ltype === "type" && ptype === "operator")) {
      const build = [];
      let i = 0;
      let e = 0;
      d = a;
      do {
        build.push(c[d]);
        if (is(c[d], 60 /* LAN */)) {
          i = i + 1;
        } else if (is(c[d], 62 /* RAN */)) {
          i = i - 1;
          if (i < 1)
            break;
        }
        d = d + 1;
      } while (d < b);
      e = a;
      a = d;
      next = peek(1, false);
      if (is(c[d], 62 /* RAN */) && (dt === true || ptoke === "=>" || ptoke === "." || ptype !== "operator" || ptype === "operator" && (is(next, 40 /* LPR */) || is(next, 61 /* EQS */)))) {
        ltype = "generic";
        ltoke = build.join(NIL).replace(/^<\s+/, "<").replace(/\s+>$/, ">").replace(/,\s*/g, ", ");
        push();
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
    if (dt === false && peek(1, false) !== ">" && (not(c[a], 60 /* LAN */) && syntaxnum.indexOf(c[a + 1]) > -1 || data.token[d] === "++" || data.token[d] === "--" || ws(c[a + 1]) === true || digit(c[a + 1]) === true && (ltype === "operator" || ltype === "string" || ltype === "number" || ltype === "reference" || ltype === "word" && ltoke !== "return"))) {
      ltype = "operator";
      ltoke = parseOperator();
      return push();
    }
    if (rules2.language !== "typescript" && (data.token[d] === "return" || data.types[d] === "operator" || data.types[d] === "start" || data.types[d] === "separator" || data.types[d] === "jsx_attribute_start" || is(data.token[d], 125 /* RCB */) && parse.scope.token === "global")) {
      ltype = "markup";
      rules2.language = "jsx";
      do {
        output.push(c[a]);
        if (is(c[a], 123 /* LCB */)) {
          curlycount = curlycount + 1;
          curlytest = true;
        } else if (is(c[a], 125 /* RCB */)) {
          curlycount = curlycount - 1;
          if (curlycount === 0)
            curlytest = false;
        } else if (is(c[a], 60 /* LAN */) && curlytest === false) {
          if (is(c[a + 1], 60 /* LAN */)) {
            do {
              output.push(c[a]);
              a = a + 1;
            } while (a < b && is(c[a + 1], 60 /* LAN */));
          }
          anglecount = anglecount + 1;
          if (peek(1, false) === "/")
            endtag = true;
        } else if (is(c[a], 62 /* RAN */) && curlytest === false) {
          if (is(c[a + 1], 62 /* RAN */)) {
            do {
              output.push(c[a]);
              a = a + 1;
            } while (is(c[a + 1], 62 /* RAN */));
          }
          anglecount = anglecount - 1;
          if (endtag === true) {
            tagcount = tagcount - 1;
          } else if (not(c[a - 1], 47 /* FWS */)) {
            tagcount = tagcount + 1;
          }
          if (anglecount === 0 && curlycount === 0 && tagcount < 1) {
            next = peek(2, false);
            if (not(next, 60 /* LAN */))
              return applyMarkup();
            if (is(next, 60 /* LAN */) && syntaxnum.indexOf(next.charAt(1)) < 0 && ws(next.charAt(1)) === false) {
              d = a + 1;
              do {
                d = d + 1;
                if (is(c[d], 62 /* RAN */) || ws(c[d - 1]) && syntaxnum.indexOf(c[d]) < 0)
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
    ltoke = parseOperator();
    push();
  }
  function parseLogical() {
    let pre = true;
    let toke = "+";
    let tokea = NIL;
    let tokeb = NIL;
    let tokec = NIL;
    let next = NIL;
    let ind = 0;
    let walk = 0;
    let i = 0;
    const store = [];
    function getEnd() {
      walk = data.begin[walk] - 1;
      if (data.types[walk] === "end") {
        getEnd();
      } else if (is(data.token[walk - 1], 46 /* DOT */)) {
        getPeriod();
      }
    }
    function getPeriod() {
      walk = walk - 2;
      if (data.types[walk] === "end") {
        getEnd();
      } else if (is(data.token[walk - 1], 46 /* DOT */)) {
        getPeriod();
      }
    }
    function applyStore() {
      let n = 0;
      if (n < store.length) {
        do {
          parse.push(data, store[n], NIL);
          n = n + 1;
        } while (n < store.length);
      }
    }
    function getRecord(index) {
      return {
        begin: data.begin[index],
        ender: data.ender[index],
        lexer: data.lexer[index],
        lines: data.lines[index],
        stack: data.stack[index],
        token: data.token[index],
        types: data.types[index]
      };
    }
    tokea = data.token[parse.count];
    tokeb = data.token[parse.count - 1];
    tokec = data.token[parse.count - 2];
    if (tokea !== "++" && tokea !== "--" && tokeb !== "++" && tokeb !== "--") {
      walk = parse.count;
      if (data.types[walk] === "end") {
        getEnd();
      } else if (is(data.token[walk - 1], 46 /* DOT */)) {
        getPeriod();
      }
    }
    if (data.token[walk - 1] === "++" || data.token[walk - 1] === "--") {
      if ("startendoperator".indexOf(data.types[walk - 2]) > -1)
        return;
      i = walk;
      if (i < parse.count + 1) {
        do {
          store.push(getRecord(i));
          i = i + 1;
        } while (i < parse.count + 1);
        parse.splice({ data, howmany: parse.count - walk, index: walk });
      }
    } else {
      if (rules2.script.correct === false || tokea !== "++" && tokea !== "--" && tokeb !== "++" && tokeb !== "--") {
        return;
      }
      next = peek(1, false);
      if ((tokea === "++" || tokea === "--") && (is(c[a], 59 /* SEM */) || is(next, 59 /* SEM */) || is(c[a], 125 /* RCB */) || is(next, 125 /* RCB */) || is(c[a], 41 /* RPR */) || is(next, 41 /* RPR */))) {
        toke = data.stack[parse.count];
        if (toke === "array" || toke === "method" || toke === "object" || toke === "paren" || toke === "notation" || data.token[data.begin[parse.count] - 1] === "while" && toke !== "while") {
          return;
        }
        i = parse.count;
        do {
          i = i - 1;
          if (data.token[i] === "return")
            return;
          if (data.types[i] === "end") {
            do
              i = data.begin[i] - 1;
            while (data.types[i] === "end" && i > 0);
          }
        } while (i > 0 && (is(data.token[i], 46 /* DOT */) || data.types[i] === "word" || data.types[i] === "reference" || data.types[i] === "end"));
        if (is(data.token[i], 44 /* COM */) && not(c[a], 59 /* SEM */) && not(next, 59 /* SEM */) && not(c[a], 125 /* RCB */) && not(next, 125 /* RCB */) && not(c[a], 41 /* RPR */) && not(next, 41 /* RPR */)) {
          return;
        }
        if (data.types[i] === "operator") {
          if (data.stack[i] === "switch" && is(data.token[i], 58 /* COL */)) {
            do {
              i = i - 1;
              if (data.types[i] === "start") {
                ind = ind - 1;
                if (ind < 0)
                  break;
              } else if (data.types[i] === "end") {
                ind = ind + 1;
              }
              if (is(data.token[i], 63 /* QWS */) && ind === 0)
                return;
            } while (i > 0);
          } else {
            return;
          }
        }
        pre = false;
        toke = tokea === "--" ? "-" : "+";
      } else if (is(tokec, 91 /* LSB */) || is(tokec, 59 /* SEM */) || is(tokec, 123 /* LCB */) || is(tokec, 125 /* RCB */) || is(tokec, 40 /* LPR */) || is(tokec, 41 /* RPR */) || is(tokec, 44 /* COM */) || tokec === "return" || tokec === "x;") {
        if (tokea === "++" || tokea === "--") {
          if (is(tokec, 91 /* LSB */) || is(tokec, 40 /* LPR */) || is(tokec, 44 /* COM */) || tokec === "return")
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
        tstore = parse.pop(data);
      walk = parse.count;
      if (data.types[walk] === "end") {
        getEnd();
      } else if (is(data.token[walk - 1], 46 /* DOT */)) {
        getPeriod();
      }
      i = walk;
      if (i < parse.count + 1) {
        do {
          store.push(getRecord(i));
          i = i + 1;
        } while (i < parse.count + 1);
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
      push();
      applyStore();
      ltoke = toke;
      ltype = "operator";
      push();
      ltoke = "1";
      ltype = "number";
      push();
    } else {
      ltoke = "=";
      ltype = "operator";
      push();
      applyStore();
      ltoke = toke;
      ltype = "operator";
      push();
      ltoke = "1";
      ltype = "number";
      push();
    }
    ltoke = data.token[parse.count];
    ltype = data.types[parse.count];
    if (is(next, 125 /* RCB */) && not(c[a], 59 /* SEM */))
      applySemicolon(false);
  }
  function parseTokens(starting, ending, type) {
    let ee = 0;
    let escape = false;
    let ext = false;
    let build = [starting];
    let temp;
    const ender = ending.split(NIL);
    const endlen = ender.length;
    const start2 = a;
    const base = a + starting.length;
    const qc = rules2.script.quoteConvert;
    function cleanUp() {
      let linesSpace = 0;
      build = [];
      ltype = type;
      ee = a;
      if (type === "string" && ws(c[ee + 1])) {
        linesSpace = 1;
        do {
          ee = ee + 1;
          if (c[ee] === NWL)
            linesSpace = linesSpace + 1;
        } while (ee < b && ws(c[ee + 1]));
        parse.linesSpace = linesSpace;
      }
    }
    function finish() {
      let str = NIL;
      function bracketSpace(input) {
        if (rules2.language !== "javascript" && rules2.language !== "typescript" && rules2.language !== "jsx" && rules2.language !== "tsx") {
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
      if (is(starting, 34 /* DQO */) && qc === "single") {
        build[0] = "'";
        build[build.length - 1] = "'";
      } else if (is(starting, 39 /* SQO */) && qc === "double") {
        build[0] = '"';
        build[build.length - 1] = '"';
      } else if (escape === true) {
        str = build[build.length - 1];
        build.pop();
        build.pop();
        build.push(str);
      }
      a = ee;
      if (ending === NWL) {
        a = a - 1;
        build.pop();
      }
      ltoke = build.join(NIL);
      if (is(starting, 34 /* DQO */) || is(starting, 39 /* SQO */) || starting === "{{" || starting === "{%") {
        ltoke = bracketSpace(ltoke);
      }
      if (starting === "{%" || starting === "{{") {
        temp = tname(ltoke);
        ltype = temp[0];
        push(temp[1]);
        return;
      }
      if (type === "string") {
        ltype = "string";
        if (rules2.language === "json") {
          ltoke = ltoke.replace(/\u0000/g, "\\u0000").replace(/\u0001/g, "\\u0001").replace(/\u0002/g, "\\u0002").replace(/\u0003/g, "\\u0003").replace(/\u0004/g, "\\u0004").replace(/\u0005/g, "\\u0005").replace(/\u0006/g, "\\u0006").replace(/\u0007/g, "\\u0007").replace(/\u0008/g, "\\u0008").replace(/\u0009/g, "\\u0009").replace(/\u000a/g, "\\u000a").replace(/\u000b/g, "\\u000b").replace(/\u000c/g, "\\u000c").replace(/\u000d/g, "\\u000d").replace(/\u000e/g, "\\u000e").replace(/\u000f/g, "\\u000f").replace(/\u0010/g, "\\u0010").replace(/\u0011/g, "\\u0011").replace(/\u0012/g, "\\u0012").replace(/\u0013/g, "\\u0013").replace(/\u0014/g, "\\u0014").replace(/\u0015/g, "\\u0015").replace(/\u0016/g, "\\u0016").replace(/\u0017/g, "\\u0017").replace(/\u0018/g, "\\u0018").replace(/\u0019/g, "\\u0019").replace(/\u001a/g, "\\u001a").replace(/\u001b/g, "\\u001b").replace(/\u001c/g, "\\u001c").replace(/\u001d/g, "\\u001d").replace(/\u001e/g, "\\u001e").replace(/\u001f/g, "\\u001f");
        } else if (starting.indexOf("#!") === 0) {
          ltoke = ltoke.slice(0, ltoke.length - 1);
          parse.linesSpace = 2;
        } else if (parse.scope.token !== "object" || parse.scope.token === "object" && not(peek(1, false), 58 /* COL */) && not(data.token[parse.count], 44 /* COM */) && not(data.token[parse.count], 123 /* LCB */)) {
          if (ltoke.length > rules2.wrap && rules2.wrap > 0 || rules2.wrap !== 0 && is(data.token[parse.count], 43 /* PLS */) && (is(data.token[parse.count - 1], 46 /* DOT */) || is(data.token[parse.count - 1], 39 /* SQO */))) {
            let item = ltoke;
            let segment = NIL;
            let q = qc === "double" ? '"' : qc === "single" ? "'" : item.charAt(0);
            const limit = rules2.wrap;
            const uchar = /u[0-9a-fA-F]{4}/;
            const xchar = /x[0-9a-fA-F]{2}/;
            item = item.slice(1, item.length - 1);
            if (is(data.token[parse.count], 43 /* PLS */) && (is(data.token[parse.count - 1], 46 /* DOT */) || is(data.token[parse.count - 1], 39 /* SQO */))) {
              parse.pop(data);
              q = data.token[parse.count].charAt(0);
              item = data.token[parse.count].slice(1, data.token[parse.count].length - 1) + item;
              parse.pop(data);
            }
            if (item.length > limit && limit > 0) {
              do {
                segment = item.slice(0, limit);
                if (is(segment[limit - 5], 92 /* BWS */) && uchar.test(item.slice(limit - 4, limit + 1))) {
                  segment = segment.slice(0, limit - 5);
                } else if (is(segment[limit - 4], 92 /* BWS */) && uchar.test(item.slice(limit - 3, limit + 2))) {
                  segment = segment.slice(0, limit - 4);
                } else if (is(segment[limit - 3], 92 /* BWS */) && (uchar.test(item.slice(limit - 2, limit + 3)) || xchar.test(item.slice(limit - 2, limit + 1)))) {
                  segment = segment.slice(0, limit - 3);
                } else if (is(segment[limit - 2], 92 /* BWS */) && (uchar.test(item.slice(limit - 1, limit + 4)) || xchar.test(item.slice(limit - 1, limit + 2)))) {
                  segment = segment.slice(0, limit - 2);
                } else if (is(segment[limit - 1], 92 /* BWS */)) {
                  segment = segment.slice(0, limit - 1);
                }
                segment = q + segment + q;
                item = item.slice(segment.length - 2);
                ltoke = segment;
                ltype = "string";
                push(NIL);
                parse.linesSpace = 0;
                ltoke = "+";
                ltype = "operator";
                push(NIL);
              } while (item.length > limit);
            }
            ltoke = item === NIL ? q + q : q + item + q;
            ltype = "string";
          }
        }
      } else if (/\{\s*\?>$/.test(ltoke)) {
        ltype = "liquid_start";
      } else {
        ltype = type;
      }
      if (ltoke.length > 0)
        push(NIL);
    }
    if (wtest > -1)
      word();
    if (is(c[a - 1], 92 /* BWS */) && esc(a - 1) === true && (is(c[a], 34 /* DQO */) || is(c[a], 39 /* SQO */))) {
      parse.pop(data);
      if (is(data.token[0], 123 /* LCB */)) {
        if (is(c[a], 34 /* DQO */)) {
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
        if (is(c[a], 34 /* DQO */)) {
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
        if (not(data.token[0], 123 /* LCB */) && not(data.token[0], 91 /* LSB */) && qc !== "none" && (is(c[ee], 34 /* DQO */) || is(c[ee], 39 /* SQO */))) {
          if (is(c[ee - 1], 92 /* BWS */)) {
            if (esc(ee - 1) === true) {
              if (qc === "double" && is(c[ee], 39 /* SQO */)) {
                build.pop();
              } else if (qc === "single" && is(c[ee], 34 /* DQO */)) {
                build.pop();
              }
            }
          } else if (qc === "double" && is(c[ee], 34 /* DQO */) && is(c[a], 39 /* SQO */)) {
            c[ee] = '\\"';
          } else if (qc === "single" && is(c[ee], 39 /* SQO */) && is(c[a], 34 /* DQO */)) {
            c[ee] = "\\'";
          }
          build.push(c[ee]);
        } else if (ee > start2) {
          ext = true;
          if (is(c[ee], 123 /* LCB */) && is(c[ee + 1], 37 /* PER */) && c[ee + 2] !== starting) {
            finish();
            parseTokens("{%", "%}", "liquid");
            cleanUp();
          } else if (is(c[ee], 123 /* LCB */) && is(c[ee + 1], 123 /* LCB */) && c[ee + 2] !== starting) {
            finish();
            parseTokens("{{", "}}", "liquid");
            cleanUp();
          } else {
            ext = false;
            build.push(c[ee]);
          }
        } else {
          build.push(c[ee]);
        }
        if (rules2.language !== "json" && rules2.language !== "javascript" && (is(starting, 34 /* DQO */) || is(starting, 39 /* SQO */)) && (ext === true || ee > start2) && not(c[ee - 1], 92 /* BWS */) && not(c[ee], 34 /* DQO */) && not(c[ee], 39 /* SQO */) && (is(c[ee], 10 /* NWL */) || ee === b - 1 === true)) {
          parse.error = "Unterminated string in script on line number " + parse.lineNumber;
          break;
        }
        if (c[ee] === ender[endlen - 1] && (not(c[ee - 1], 92 /* BWS */) || esc(ee - 1) === false)) {
          if (endlen === 1)
            break;
          if (build[ee - base] === ender[0] && build.slice(ee - base - endlen + 2).join(NIL) === ending)
            break;
        }
        ee = ee + 1;
      } while (ee < b);
    }
    finish();
  }
  function applyBrace() {
    let name = NIL;
    const next = peek(5, false);
    const g = parse.count;
    const lines = parse.linesSpace;
    if (rules2.language === "json" || brace.length < 1 || brace[brace.length - 1].charAt(0) !== "x" || /^x?(;|\}|\))$/.test(ltoke) === false) {
      return;
    }
    if (data.stack[parse.count] === "do" && next === "while" && is(data.token[parse.count], 125 /* RCB */)) {
      return;
    }
    if (is(ltoke, 59 /* SEM */) && data.token[g - 1] === "x{") {
      name = data.token[data.begin[g - 2] - 1];
      if (data.token[g - 2] === "do" || is(data.token[g - 2], 41 /* RPR */) && "ifforwhilecatch".indexOf(name) > -1) {
        tstore = parse.pop(data);
        ltoke = rules2.script.correct === true ? "}" : "x}";
        ltype = "end";
        pstack = parse.structure.scope;
        push();
        brace.pop();
        parse.linesSpace = lines;
        return;
      }
      tstore = parse.pop(data);
      ltoke = rules2.script.correct === true ? "}" : "x}";
      ltype = "end";
      pstack = parse.structure.scope;
      push();
      brace.pop();
      ltoke = ";";
      ltype = "end";
      parse.push(data, tstore, NIL);
      parse.linesSpace = lines;
      return;
    }
    ltoke = rules2.script.correct === true ? "}" : "x}";
    ltype = "end";
    if (data.token[parse.count] === "x}")
      return;
    if (next === "else" && data.stack[parse.count] === "if" && (is(data.token[parse.count], 59 /* SEM */) || data.token[parse.count] === "x;")) {
      pstack = parse.structure.scope;
      push();
      brace.pop();
      parse.linesSpace = lines;
      return;
    }
    do {
      pstack = parse.structure.scope;
      push();
      brace.pop();
      if (data.stack[parse.count] === "do")
        break;
    } while (brace[brace.length - 1] === "x{");
    parse.linesSpace = lines;
  }
  function getCommaComment() {
    let x = parse.count;
    if (data.stack[x] === "object" && rules2.script.objectSort === true) {
      ltoke = ",";
      ltype = "separator";
      cleanSemicolon();
      push();
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
      push();
    }
  }
  function end(x) {
    let insert = false;
    let newarr = false;
    const next = peek(1, false);
    const count = is(data.token[parse.count], 40 /* LPR */) ? parse.count : data.begin[parse.count];
    function newarray() {
      let arraylen = 0;
      const ar = data.token[count - 1] === "Array";
      const startar = ar === true ? "[" : "{";
      const endar = ar === true ? "]" : "}";
      const namear = ar === true ? "array" : "object";
      if (ar === true && data.types[parse.count] === "number") {
        arraylen = Number(data.token[parse.count]);
        tstore = parse.pop(data);
      }
      tstore = parse.pop(data);
      tstore = parse.pop(data);
      tstore = parse.pop(data);
      parse.structure.pop();
      ltoke = startar;
      ltype = "start";
      push(namear);
      if (arraylen > 0) {
        ltoke = ",";
        ltype = "separator";
        do {
          push();
          arraylen = arraylen - 1;
        } while (arraylen > 0);
      }
      ltoke = endar;
      ltype = "end";
      push();
    }
    if (wtest > -1)
      word();
    if (classy.length > 0) {
      if (classy[classy.length - 1] === 0) {
        classy.pop();
      } else {
        classy[classy.length - 1] = classy[classy.length - 1] - 1;
      }
    }
    if (is(x, 41 /* RPR */) || x === "x)" || is(x, 93 /* RSB */)) {
      if (rules2.script.correct === true)
        parseLogical();
      cleanSemicolon();
    }
    if (is(x, 41 /* RPR */) || x === "x)")
      applySemicolon(false);
    if (v > -1) {
      if (is(x, 125 /* RCB */) && (rules2.script.variableList === "list" && vstore.count[v] === 0 || data.token[parse.count] === "x;" && rules2.script.variableList === "each")) {
        pop();
      }
      vstore.count[v] = vstore.count[v] - 1;
      if (vstore.count[v] < 0)
        pop();
    }
    if (is(ltoke, 44 /* COM */) && data.stack[parse.count] !== "initializer" && (is(x, 93 /* RSB */) && is(data.token[parse.count - 1], 91 /* LSB */) || is(x, 125 /* RCB */))) {
      tstore = parse.pop(data);
    }
    if (is(x, 41 /* RPR */) || x === "x)") {
      ltoke = x;
      if (lword.length > 0) {
        pword = lword[lword.length - 1];
        if (pword.length > 1 && not(next, 123 /* LCB */) && (pword[0] === "if" || pword[0] === "for" || pword[0] === "with" || pword[0] === "while" && data.stack[pword[1] - 2] !== void 0 && data.stack[pword[1] - 2] !== "do")) {
          insert = true;
        }
      }
    } else if (is(x, 93 /* RSB */)) {
      ltoke = "]";
    } else if (is(x, 125 /* RCB */)) {
      if (not(ltoke, 44 /* COM */) && rules2.script.correct === true) {
        parseLogical();
      }
      if (parse.structure.length > 0 && parse.scope.token !== "object") {
        applySemicolon(true);
      }
      if (parse.scope.token === "object" && (rules2.script.objectSort === true || rules2.language === "json" && rules2.json.objectSort === true)) {
        parse.sortObject(data);
      }
      if (ltype === "comment") {
        ltoke = data.token[parse.count];
        ltype = data.types[parse.count];
      }
      ltoke = "}";
    }
    if (parse.scope.token === "data_type") {
      ltype = "type_end";
    } else {
      ltype = "end";
    }
    lword.pop();
    pstack = parse.structure.scope;
    if (is(x, 41 /* RPR */) && rules2.script.correct === true && count - parse.count < 2 && (is(data.token[parse.count], 40 /* LPR */) || data.types[parse.count] === "number") && (data.token[count - 1] === "Array" || data.token[count - 1] === "Object") && data.token[count - 2] === "new") {
      newarray();
      newarr = true;
    }
    if (brace[brace.length - 1] === "x{" && is(x, 125 /* RCB */)) {
      applyBrace();
      brace.pop();
      if (data.stack[parse.count] !== "try") {
        if (not(next, 58 /* COL */) && not(next, 59 /* SEM */) && data.token[data.begin[a] - 1] !== "?")
          applyBrace();
      }
      ltoke = "}";
    } else {
      brace.pop();
    }
    if (rules2.script.endComma !== void 0 && rules2.script.endComma !== "none" && parse.scope.token === "array" || parse.scope.token === "object" || parse.scope.token === "data_type") {
      if (rules2.script.endComma === "always" && not(data.token[parse.count], 44 /* COM */)) {
        const begin = parse.scope.index;
        let y = parse.count;
        do {
          if (data.begin[y] === begin) {
            if (is(data.token[y], 44 /* COM */))
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
          push();
          ltoke = toke;
          ltype = type;
        }
      } else if (rules2.script.endComma === "never" && is(data.token[parse.count], 44 /* COM */)) {
        parse.pop(data);
      }
    }
    if (newarr === false) {
      push();
      if (is(ltoke, 125 /* RCB */) && data.stack[parse.count] !== "object" && data.stack[parse.count] !== "class" && data.stack[parse.count] !== "data_type") {
        references.pop();
        applyBrace();
      }
    }
    if (insert === true) {
      ltoke = rules2.script.correct === true ? "{" : "x{";
      ltype = "start";
      push(pword[0]);
      brace.push("x{");
      pword[1] = parse.count;
    }
    tstype.pop();
    if (parse.scope.token !== "data_type")
      tstype[tstype.length - 1] = false;
  }
  function start(x) {
    let aa = parse.count;
    let wordx = NIL;
    let wordy = NIL;
    let stack = NIL;
    let func = false;
    brace.push(x);
    if (is(x, 123 /* LCB */) && (data.types[parse.count] === "type" || data.types[parse.count] === "type_end" || data.types[parse.count] === "generic")) {
      let begin = 0;
      if (data.types[parse.count] === "type_end")
        aa = data.begin[parse.count];
      begin = aa;
      do {
        aa = aa - 1;
        if (data.begin[aa] !== begin && data.begin[aa] !== -1)
          break;
        if (is(data.token[aa], 58 /* COL */))
          break;
      } while (aa > data.begin[aa]);
      if (is(data.token[aa], 58 /* COL */) && data.stack[aa - 1] === "arguments") {
        tstype.push(false);
        func = true;
      } else {
        tstype.push(tstype[tstype.length - 1]);
      }
      aa = parse.count;
    } else if (is(x, 91 /* LSB */) && data.types[parse.count] === "type_end") {
      tstype.push(true);
    } else {
      tstype.push(tstype[tstype.length - 1]);
    }
    if (wtest > -1) {
      word();
      aa = parse.count;
    }
    if (v > -1)
      vstore.count[v] = vstore.count[v] + 1;
    if (data.token[aa - 1] === "function") {
      lword.push(["function", aa + 1]);
    } else {
      lword.push([ltoke, aa + 1]);
    }
    ltoke = x;
    if (tstype[tstype.length - 1] === true) {
      ltype = "type_start";
    } else {
      ltype = "start";
    }
    if (is(x, 40 /* LPR */) || x === "x(") {
      cleanSemicolon();
    } else if (is(x, 91 /* LSB */)) {
      if (paren > -1) {
        if (data.begin[paren - 1] === data.begin[data.begin[aa] - 1] || data.token[data.begin[aa]] === "x(") {
          paren = -1;
          if (rules2.script.correct === true) {
            end(")");
          } else {
            end("x)");
          }
          cleanSemicolon();
          ltoke = "{";
          ltype = "start";
        }
      } else if (is(ltoke, 41 /* RPR */)) {
        cleanSemicolon();
      }
      if (ltype === "comment" && is(data.token[aa - 1], 41 /* RPR */)) {
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
    wordy = data.stack[aa] === void 0 ? NIL : (() => {
      let bb = parse.count;
      if (data.types[bb] === "comment") {
        do
          bb = bb - 1;
        while (bb > 0 && data.types[bb] === "comment");
      }
      return data.token[data.begin[bb] - 1];
    })();
    if (is(ltoke, 123 /* LCB */) && (data.types[aa] === "word" || is(data.token[aa], 93 /* RSB */))) {
      let bb = aa;
      if (is(data.token[bb], 93 /* RSB */)) {
        do
          bb = data.begin[bb] - 1;
        while (is(data.token[bb], 93 /* RSB */));
      }
      do {
        if (data.types[bb] === "start" || data.types[bb] === "end" || data.types[bb] === "operator")
          break;
        bb = bb - 1;
      } while (bb > 0);
      if (is(data.token[bb], 58 /* COL */) && data.stack[bb - 1] === "arguments") {
        stack = "function";
        references.push(fnrefs);
        fnrefs = [];
      }
    }
    if (ltype === "type_start") {
      stack = "data_type";
    } else if (stack === NIL && (is(ltoke, 123 /* LCB */) || ltoke === "x{")) {
      if (wordx === "else" || wordx === "do" || wordx === "try" || wordx === "finally" || wordx === "switch") {
        stack = wordx;
      } else if (classy[classy.length - 1] === 0 && wordx !== "return") {
        classy.pop();
        stack = "class";
      } else if (data.token[aa - 1] === "class") {
        stack = "class";
      } else if (is(data.token[aa], 93 /* RSB */) && is(data.token[aa - 1], 91 /* LSB */)) {
        stack = "array";
      } else if ((data.types[aa] === "word" || data.types[aa] === "reference") && (data.types[aa - 1] === "word" || data.types[aa - 1] === "reference" || data.token[aa - 1] === "?" && (data.types[aa - 2] === "word" || data.types[aa - 2] === "reference")) && data.token[aa] !== "in" && data.token[aa - 1] !== "export" && data.token[aa - 1] !== "import") {
        stack = "map";
      } else if (data.stack[aa] === "method" && data.types[aa] === "end" && (data.types[data.begin[aa] - 1] === "word" || data.types[data.begin[aa] - 1] === "reference") && data.token[data.begin[aa] - 2] === "new") {
        stack = "initializer";
      } else if (is(ltoke, 123 /* LCB */) && (is(wordx, 41 /* RPR */) || wordx === "x)") && (data.types[data.begin[aa] - 1] === "word" || data.types[data.begin[aa] - 1] === "reference" || data.token[data.begin[aa] - 1] === "]")) {
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
      } else if (is(ltoke, 123 /* LCB */) && (is(wordx, 59 /* SEM */) || wordx === "x;")) {
        stack = "block";
      } else if (is(ltoke, 123 /* LCB */) && is(data.token[aa], 58 /* COL */) && data.stack[aa] === "switch") {
        stack = "block";
      } else if (data.token[aa - 1] === "import" || data.token[aa - 2] === "import" || data.token[aa - 1] === "export" || data.token[aa - 2] === "export") {
        stack = "object";
      } else if (is(wordx, 41 /* RPR */) && (pword[0] === "function" || pword[0] === "if" || pword[0] === "for" || pword[0] === "class" || pword[0] === "while" || pword[0] === "switch" || pword[0] === "catch")) {
        stack = pword[0];
      } else if (data.stack[aa] === "notation") {
        stack = "function";
      } else if ((data.types[aa] === "number" || data.types[aa] === "string" || data.types[aa] === "word" || data.types[aa] === "reference") && (data.types[aa - 1] === "word" || data.types[aa - 1] === "reference") && data.token[data.begin[aa] - 1] !== "for") {
        stack = "function";
      } else if (parse.structure.length > 0 && not(data.token[aa], 58 /* COL */) && parse.scope.token === "object" && (is(data.token[data.begin[aa] - 2], 123 /* LCB */) || is(data.token[data.begin[aa] - 2], 44 /* COM */))) {
        stack = "function";
      } else if (data.types[pword[1] - 1] === "markup" && data.token[pword[1] - 3] === "function") {
        stack = "function";
      } else if (wordx === "=>") {
        stack = "function";
      } else if (func === true || data.types[parse.count] === "type_end" && data.stack[data.begin[parse.count] - 2] === "arguments") {
        stack = "function";
      } else if (is(wordx, 41 /* RPR */) && data.stack[aa] === "method" && (data.types[data.begin[aa] - 1] === "word" || data.types[data.begin[aa] - 1] === "property" || data.types[data.begin[aa] - 1] === "reference")) {
        stack = "function";
      } else if (is(ltoke, 123 /* LCB */) && data.types[aa] === "word" && data.token[aa] !== "return" && data.token[aa] !== "in" && data.token[aa] !== "import" && data.token[aa] !== "const" && data.token[aa] !== "let" && data.token[aa] !== NIL) {
        stack = "block";
      } else if (is(ltoke, 123 /* LCB */) && "if|else|for|while|function|class|switch|catch|finally".indexOf(data.stack[aa]) > -1 && (data.token[aa] === "x}" || is(data.token[aa], 125 /* RCB */))) {
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
          if (is(data.token[aa], 59 /* SEM */)) {
            stack = "object";
            break;
          }
        } while (aa > data.begin[parse.count]);
      } else {
        stack = "object";
      }
      if (stack !== "object" && stack !== "class") {
        if (stack === "function") {
          references.push(fnrefs);
          fnrefs = [];
        } else {
          references.push([]);
        }
      }
    } else if (is(ltoke, 91 /* LSB */)) {
      stack = "array";
    } else if (is(ltoke, 40 /* LPR */) || ltoke === "x(") {
      if (wordx === "function" || data.token[aa - 1] === "function" || data.token[aa - 1] === "function*" || data.token[aa - 2] === "function") {
        stack = "arguments";
      } else if (is(data.token[aa - 1], 46 /* DOT */) || is(data.token[data.begin[aa] - 2], 46 /* DOT */)) {
        stack = "method";
      } else if (data.types[aa] === "generic") {
        stack = "method";
      } else if (is(data.token[aa], 125 /* RCB */) && data.stack[aa] === "function") {
        stack = "method";
      } else if (wordx === "if" || wordx === "for" || wordx === "class" || wordx === "while" || wordx === "catch" || wordx === "finally" || wordx === "switch" || wordx === "with") {
        stack = "expression";
      } else if (data.types[aa] === "word" || data.types[aa] === "property" || data.types[aa] === "reference") {
        stack = "method";
      } else {
        stack = "paren";
      }
    }
    push(stack);
    if (classy.length > 0)
      classy[classy.length - 1] = classy[classy.length - 1] + 1;
  }
  function tname(x) {
    let sn = 2;
    let en = 0;
    let name = NIL;
    const st = x.slice(0, 2);
    const len = x.length;
    if (is(x[2], 45 /* DSH */))
      sn = sn + 1;
    if (ws(x.charAt(sn)) === true) {
      do {
        sn = sn + 1;
      } while (ws(x.charAt(sn)) === true && sn < len);
    }
    en = sn;
    do {
      en = en + 1;
    } while (ws(x.charAt(en)) === false && x.charAt(en) !== "(" && en < len);
    if (en === len)
      en = x.length - 2;
    name = x.slice(sn, en);
    if (name === "else" || st === "{%" && (name === "elseif" || name === "when" || name === "elif" || name === "elsif")) {
      return ["liquid_else", `liquid_${name}`];
    }
    if (st === "{{") {
      if (name === "end")
        return ["liquid_end", NIL];
      if (name === "define" || name === "form" || name === "if" || name === "unless" || name === "range" || name === "with") {
        return ["liquid_start", `liquid_${name}`];
      }
      return ["liquid", NIL];
    }
    en = namelist.length - 1;
    if (en > -1) {
      do {
        if (name === namelist[en] && name !== "block") {
          return ["liquid_start", `liquid_${name}`];
        }
        if (name === "end" + namelist[en]) {
          return [
            "liquid_end",
            NIL
          ];
        }
        en = en - 1;
      } while (en > -1);
    }
    return ["liquid", NIL];
  }
  function word() {
    let f = wtest;
    let g = 1;
    let output = NIL;
    let next = NIL;
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
      if (is(c[f], 92 /* BWS */)) ;
      f = f + 1;
    } while (f < a);
    if (ltoke.charAt(0) === "\u201C") {
      parse.error = `Quote looking character (\u201C, \\u201c) used instead of actual quotes on line number ${parse.lineNumber}`;
    } else if (ltoke.charAt(0) === "\u201D") {
      parse.error = `Quote looking character (\u201D, \\u201d) used instead of actual quotes on line number ${parse.lineNumber}`;
    }
    output = lex.join(NIL);
    wtest = -1;
    if (parse.count > 0 && output === "function" && is(data.token[parse.count], 40 /* LPR */) && (is(data.token[parse.count - 1], 123 /* LCB */) || data.token[parse.count - 1] === "x{")) {
      data.types[parse.count] = "start";
    }
    if (parse.count > 1 && output === "function" && is(ltoke, 40 /* LPR */) && (is(data.token[parse.count - 1], 125 /* RCB */) || data.token[parse.count - 1] === "x}")) {
      if (is(data.token[parse.count - 1], 125 /* RCB */)) {
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
        if (is(data.token[f], 123 /* LCB */) && is(data.token[f - 1], 41 /* RPR */)) {
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
    if (rules2.script.correct === true && (output === "Object" || output === "Array") && is(c[a + 1], 40 /* LPR */) && is(c[a + 2], 41 /* RPR */) && is(data.token[parse.count - 1], 61 /* EQS */) && data.token[parse.count] === "new") {
      if (output === "Object") {
        data.token[parse.count] = "{";
        ltoke = "}";
        data.stack[parse.count] = "object";
        parse.scope.token = "object";
      } else {
        data.token[parse.count] = "[";
        ltoke = "]";
        data.stack[parse.count] = "array";
        parse.scope.token = "array";
      }
      data.types[parse.count] = "start";
      ltype = "end";
      c[a + 1] = NIL;
      c[a + 2] = NIL;
      a = a + 2;
    } else {
      g = parse.count;
      f = g;
      if (rules2.script.variableList !== "none" && (output === "var" || output === "let" || output === "const")) {
        if (data.types[g] === "comment") {
          do {
            g = g - 1;
          } while (g > 0 && data.types[g] === "comment");
        }
        if (rules2.script.variableList === "list" && v > -1 && vstore.index[v] === g && output === vstore.word[v]) {
          ltoke = ",";
          ltype = "separator";
          data.token[g] = ltoke;
          data.types[g] = ltype;
          vstore.count[v] = 0;
          vstore.index[v] = g;
          vstore.word[v] = output;
          return;
        }
        v = v + 1;
        vstore.count.push(0);
        vstore.index.push(g);
        vstore.word.push(output);
        g = f;
      } else if (v > -1 && output !== vstore.word[v] && parse.count === vstore.index[v] && is(data.token[vstore.index[v]], 59 /* SEM */) && ltoke !== vstore.word[v] && rules2.script.variableList === "list") {
        pop();
      }
      if (output === "from" && data.token[parse.count] === "x;" && is(data.token[parse.count - 1], 125 /* RCB */)) {
        cleanSemicolon();
      }
      if (output === "while" && data.token[parse.count] === "x;" && is(data.token[parse.count - 1], 125 /* RCB */)) {
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
              if (is(data.token[e], 123 /* LCB */) && data.token[e - 1] === "do")
                cleanSemicolon();
              return;
            }
            e = e - 1;
          } while (e > -1);
        }
      }
      if (typel === "comment") {
        let d = parse.count;
        do
          d = d - 1;
        while (d > 0 && data.types[d] === "comment");
        typel = data.types[d];
        tokel = data.token[d];
      }
      next = peek(2, false);
      if (output === "void") {
        if (tokel === ":" && data.stack[parse.count - 1] === "arguments") {
          ltype = "type";
        } else {
          ltype = "word";
        }
      } else if ((parse.scope.token === "object" || parse.scope.token === "class" || parse.scope.token === "data_type") && (is(data.token[parse.count], 123 /* LCB */) || (is(data.token[data.begin[parse.count]], 123 /* LCB */) && is(data.token[parse.count], 44 /* COM */) || data.types[parse.count] === "liquid_end" && (is(data.token[data.begin[parse.count] - 1], 123 /* LCB */) || is(data.token[data.begin[parse.count] - 1], 44 /* COM */))))) {
        if (output === "return" || output === "break") {
          ltype = "word";
        } else {
          ltype = "property";
        }
      } else if (tstype[tstype.length - 1] === true || (rules2.language === "typescript" || rules2.language === "flow") && tokel === "type") {
        ltype = "type";
      } else if (references.length > 0 && (tokel === "function" || tokel === "class" || tokel === "const" || tokel === "let" || tokel === "var" || tokel === "new" || tokel === "void")) {
        ltype = "reference";
        references[references.length - 1].push(output);
        if (rules2.language === "javascript" || rules2.language === "jsx" || rules2.language === "typescript" || rules2.language === "tsx") {
          if (tokel === "var" || tokel === "function" && data.types[parse.count - 1] !== "operator" && data.types[parse.count - 1] !== "start" && data.types[parse.count - 1] !== "end") {
            hoisting(parse.count, output, true);
          } else {
            hoisting(parse.count, output, false);
          }
        } else {
          hoisting(parse.count, output, false);
        }
      } else if (parse.scope.token === "arguments" && ltype !== "operator") {
        ltype = "reference";
        fnrefs.push(output);
      } else if (is(tokel, 44 /* COM */) && data.stack[parse.count] !== "method" && (data.stack[parse.count] !== "expression" || data.token[data.begin[parse.count] - 1] === "for")) {
        let d = parse.count;
        const e = parse.scope.index;
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
          if (rules2.language === "javascript" || rules2.language === "jsx" || rules2.language === "typescript" || rules2.language === "tsx") {
            hoisting(d, output, true);
          } else {
            hoisting(d, output, false);
          }
        } else if (references.length > 0 && (data.token[d] === "let" || data.token[d] === "const" || data.token[d] === "type" && (rules2.language === "typescript" || rules2.language === "tsx"))) {
          ltype = "reference";
          references[references.length - 1].push(output);
          hoisting(d, output, false);
        } else {
          ltype = "word";
        }
      } else if (parse.scope.token !== "object" || parse.scope.token === "object" && ltoke !== "," && ltoke !== "{") {
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
        cleanSemicolon();
    }
    push();
    if (output === "class")
      classy.push(0);
    if (output === "do") {
      next = peek(1, true);
      if (next !== "{") {
        ltoke = rules2.script.correct === true ? "{" : "x{";
        ltype = "start";
        brace.push("x{");
        push("do");
      }
    }
    if (output === "else") {
      next = peek(2, true);
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
                token: rules2.script.correct === true ? "}" : "x}",
                types: "end"
              }
            });
            if (parse.structure.length > 1) {
              parse.structure.splice(parse.structure.length - 2, 1);
              parse.scope.index = parse.count;
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
      if (next !== "if" && not(next, 123 /* LCB */)) {
        ltoke = rules2.script.correct === true ? "{" : "x{";
        ltype = "start";
        brace.push("x{");
        push("else");
      }
    }
    if ((output === "for" || output === "if" || output === "switch" || output === "catch") && data.token[parse.count - 1] !== ".") {
      next = peek(1, true);
      if (next !== "(") {
        paren = parse.count;
        if (rules2.script.correct === true) {
          start("(");
        } else {
          start("x(");
        }
      }
    }
  }
  function parseSpace() {
    parse.linesSpace = 1;
    do {
      if (is(c[a], 10 /* NWL */)) {
        parse.lineStart = a;
        parse.linesSpace = parse.linesSpace + 1;
        parse.lineNumber = parse.lineNumber + 1;
      }
      if (ws(c[a + 1]) === false)
        break;
      a = a + 1;
    } while (a < b);
  }
  do {
    if (ws(c[a])) {
      if (wtest > -1)
        word();
      parseSpace();
      if (parse.linesSpace > 1 && lengthb < parse.count && not(c[a + 1], 59 /* SEM */) && not(c[a + 1], 125 /* RCB */)) {
        applySemicolon(false);
        lengthb = parse.count;
      }
    } else if (is(c[a], 123 /* LCB */) && is(c[a + 1], 37 /* PER */)) {
      parseTokens("{%", "%}", "liquid");
    } else if (is(c[a], 123 /* LCB */) && is(c[a + 1], 123 /* LCB */)) {
      parseTokens("{{", "}}", "liquid");
    } else if (is(c[a], 60 /* LAN */) && is(c[a + 1], 33 /* BNG */) && is(c[a + 2], 45 /* DSH */) && is(c[a + 3], 45 /* DSH */)) {
      parseTokens("<!--", "-->", "comment");
    } else if (is(c[a], 60 /* LAN */)) {
      parseMarkup();
    } else if (is(c[a], 47 /* FWS */) && (a === b - 1 || is(c[a + 1], 42 /* ARS */))) {
      parseBlockComment();
    } else if ((parse.count < 0 || data.lines[parse.count] > 0) && is(c[a], 35 /* HSH */) && is(c[a + 1], 33 /* BNG */) && (is(c[a + 2], 47 /* FWS */) || is(c[a + 3], 91 /* LSB */))) {
      parseTokens("#!" + c[a + 2], NWL, "string");
    } else if (is(c[a], 47 /* FWS */) && (a === b - 1 || is(c[a + 1], 47 /* FWS */))) {
      parseLineComment();
    } else if (is(c[a], 96 /* TQO */) || is(c[a], 125 /* RCB */) && parse.scope.token === "liquid_string") {
      if (wtest > -1)
        word();
      ltoke = parseLiteral();
      if (is(ltoke, 125 /* RCB */) && ltoke.slice(ltoke.length - 2) === "${") {
        ltype = "liquid_string_else";
        push("liquid_string");
      } else if (ltoke.slice(ltoke.length - 2) === "${") {
        ltype = "liquid_string_start";
        push("liquid_string");
      } else if (is(ltoke[0], 125 /* RCB */)) {
        ltype = "liquid_string_end";
        push();
      } else {
        ltype = "string";
        push();
      }
    } else if (is(c[a], 34 /* DQO */) || is(c[a + 1], 39 /* SQO */)) {
      parseTokens(c[a], c[a], "string");
    } else if (is(c[a], 45 /* DSH */) && (a < b - 1 && not(c[a + 1], 61 /* EQS */) && not(c[a + 1], 45 /* DSH */)) && (ltype === "number" || ltype === "word" || ltype === "reference") && ltoke !== "return" && (ltype === "word" || ltype === "reference" || ltype === "number" || is(ltoke, 41 /* RPR */) || is(ltoke, 93 /* RSB */))) {
      if (wtest > -1)
        word();
      ltoke = "-";
      ltype = "operator";
      push();
    } else if (wtest === -1 && (c[a] !== "0" || c[a] === "0" && c[a + 1] !== "b") && (digit(c[a]) || a !== b - 2 && is(c[a], 45 /* DSH */) && is(c[a + 1], 46 /* DOT */) && digit(c[a + 2]) || a !== b - 1 && (is(c[a], 45 /* DSH */) || is(c[a], 46 /* DOT */)) && digit(c[a + 1]))) {
      if (wtest > -1)
        word();
      if (ltype === "end" && is(c[a], 45 /* DSH */)) {
        ltoke = "-";
        ltype = "operator";
      } else {
        ltoke = parseNumbers();
        ltype = "number";
      }
      push();
    } else if (is(c[a], 58 /* COL */) && is(c[a + 1], 58 /* COL */)) {
      if (wtest > -1)
        word();
      if (rules2.script.correct === true)
        parseLogical();
      cleanSemicolon();
      a = a + 1;
      ltoke = "::";
      ltype = "separator";
      push();
    } else if (is(c[a], 44 /* COM */)) {
      if (wtest > -1)
        word();
      if (rules2.script.correct === true)
        parseLogical();
      if (tstype[tstype.length - 1] === true && data.stack[parse.count].indexOf("type") < 0) {
        tstype[tstype.length - 1] = false;
      }
      if (ltype === "comment") {
        getCommaComment();
      } else if (v > -1 && vstore.count[v] === 0 && rules2.script.variableList === "each") {
        cleanSemicolon();
        ltoke = ";";
        ltype = "separator";
        push();
        ltoke = vstore.word[v];
        ltype = "word";
        push();
        vstore.index[v] = parse.count;
      } else {
        ltoke = ",";
        ltype = "separator";
        cleanSemicolon();
        push();
      }
    } else if (is(c[a], 46 /* DOT */)) {
      if (wtest > -1)
        word();
      tstype[tstype.length - 1] = false;
      if (is(c[a + 1], 46 /* DOT */) && is(c[a + 2], 46 /* DOT */)) {
        ltoke = "...";
        ltype = "operator";
        a = a + 2;
      } else {
        cleanSemicolon();
        ltoke = ".";
        ltype = "separator";
      }
      if (ws(c[a - 1]))
        parse.linesSpace = 1;
      push();
    } else if (is(c[a], 59 /* SEM */)) {
      if (wtest > -1)
        word();
      if (tstype[tstype.length - 1] === true && data.stack[parse.count].indexOf("type") < 0) {
        tstype[tstype.length - 1] = false;
      }
      if (classy[classy.length - 1] === 0)
        classy.pop();
      if (v > -1 && vstore.count[v] === 0) {
        if (rules2.script.variableList === "each") {
          pop();
        } else {
          vstore.index[v] = parse.count + 1;
        }
      }
      if (rules2.script.correct === true)
        parseLogical();
      ltoke = ";";
      ltype = "separator";
      if (data.token[parse.count] === "x}") {
        braceSemicolon();
      } else {
        push();
      }
      applyBrace();
    } else if (is(c[a], 40 /* LPR */) || is(c[a], 91 /* LSB */) || is(c[a], 123 /* LCB */)) {
      start(c[a]);
    } else if (is(c[a], 41 /* RPR */) || is(c[a], 93 /* RSB */) || is(c[a], 125 /* RCB */)) {
      end(c[a]);
    } else if (wtest < 0 && data.stack[parse.count] === "object" && is(c[a], 42 /* ARS */) && not(c[a + 1], 61 /* EQS */) && digit(c[a + 1]) === false && ws(c[a + 1]) === false) {
      wtest = a;
    } else if (is(c[a], 61 /* EQS */) || is(c[a], 38 /* AND */) || is(c[a], 60 /* LAN */) || is(c[a], 62 /* RAN */) || is(c[a], 43 /* PLS */) || is(c[a], 45 /* DSH */) || is(c[a], 42 /* ARS */) || is(c[a], 47 /* FWS */) || is(c[a], 33 /* BNG */) || is(c[a], 63 /* QWS */) || is(c[a], 124 /* PIP */) || is(c[a], 94 /* UPP */) || is(c[a], 58 /* COL */) || is(c[a], 37 /* PER */) || is(c[a], 94 /* SDH */)) {
      ltoke = parseOperator();
      if (ltoke === "regex") {
        ltoke = data.token[parse.count];
      } else if (is(ltoke, 42 /* ARS */) && data.token[parse.count] === "function") {
        data.token[parse.count] = "function*";
      } else {
        ltype = "operator";
        if (not(ltoke, 33 /* BNG */) && ltoke !== "++" && ltoke !== "--")
          cleanSemicolon();
        push();
      }
    } else if (wtest < 0 && c[a] !== NIL) {
      wtest = a;
    }
    if (v > -1 && parse.count === vstore.index[v] + 1 && is(data.token[vstore.index[v]], 59 /* SEM */) && ltoke !== vstore.word[v] && ltype !== "comment" && rules2.script.variableList === "list") {
      pop();
    }
    a = a + 1;
  } while (a < b);
  if (wtest > -1)
    word();
  if ((not(data.token[parse.count], 125 /* RCB */) && is(data.token[0], 123 /* LCB */) || not(data.token[0], 123 /* LCB */)) && (not(data.token[parse.count], 93 /* RSB */) && is(data.token[0], 91 /* LSB */) || not(data.token[0], 91 /* LSB */))) {
    applySemicolon(false);
  }
  if (sourcemap[0] === parse.count) {
    ltoke = NWL + sourcemap[1];
    ltype = "string";
    push();
  }
  if (data.token[parse.count] === "x;" && (is(data.token[parse.count - 1], 125 /* RCB */) || is(data.token[parse.count - 1], 93 /* RSB */)) && data.begin[parse.count - 1] === 0) {
    parse.pop(data);
  }
  rules2.script = cloneopts;
  return data;
};

// src/parse/external.ts
function determine(tag, ref, attrs) {
  if (ref === "html") {
    if (!(tag in grammar.html.embed))
      return false;
    const token = grammar.html.embed[tag];
    if (token.attr.size > 0) {
      for (const attribute of token.attr.values()) {
        if (attribute.attr.has(attrs[0]) && attribute.attr.get(attrs[0]).value.has(attrs[1])) {
          return attribute.attr.get(attrs[0]);
        }
      }
    }
    return token.attr.has(attrs[0]) ? token.attr.get(attrs[0]).attr.has(attrs[1]) ? token.attr.get(attrs[0]).attr.get(attrs[1]) : token.attr.get(attrs[0]) : token;
  } else if (ref === "liquid") {
    if (!(tag in grammar.liquid.embed))
      return false;
    const token = grammar.liquid.embed[tag];
    if (token.args.size > 0) {
      for (const [match, key] of token.args) {
        if (match instanceof RegExp && match.test(attrs))
          return key;
      }
    }
    return token;
  }
}
function detect2(tag, language2) {
  if (typeof language2 !== "undefined")
    return tag in grammar[language2].embed;
  return tag in grammar.html.embed || tag in grammar.liquid.embed;
}

// src/lexers/markup.ts
prettify.lexers.markup = function MarkupLexer(source) {
  const { rules: rules2 } = prettify;
  const { data } = parse;
  const jsx = rules2.language === "jsx" || rules2.language === "tsx";
  const markup = rules2.language === "html" || rules2.language === "liquid";
  const ig = new Set(rules2.liquid.ignoreTagList);
  const asl = rules2.markup.attributeSortList.length;
  const b = isArray(source) ? source : source.split(NIL);
  const c = b.length;
  let a = 0;
  let embed = false;
  let language2;
  let html = markup ? rules2.language : "html";
  let within = 0;
  function push(record, structure = NIL, param) {
    if (typeof structure === "string" && param === void 0) {
      parse.push(data, record, NIL);
    } else if (typeof structure === "object" && !structure.length) {
      assign(record, structure);
      parse.push(data, record, NIL);
    } else if (isArray(structure)) {
      for (const entry of structure) {
        assign(record, entry);
        parse.push(data, record, NIL);
      }
    } else if (param) {
      assign(record, param);
      parse.push(data, record, structure);
    } else {
      console.log("isssue");
    }
  }
  function inner(input) {
    if (!(markup === true && jsx === false))
      return input;
    if (/(?:{[=#/]|%[>\]])|\}%[>\]]/.test(input))
      return input;
    if (!isLiquid(input, 3))
      return input;
    const end = input.length - 3;
    if (rules2.liquid.delimiterTrims === "force") {
      if (is(input[1], 37 /* PER */)) {
        if (not(input[2], 45 /* DSH */))
          input = input.replace(/^{%/, "{%-");
        if (not(input[end], 45 /* DSH */))
          input = input.replace(/%}$/, "-%}");
      } else {
        if (not(input[2], 45 /* DSH */))
          input = input.replace(/^{{/, "{{-");
        if (not(input[end], 45 /* DSH */))
          input = input.replace(/}}$/, "-}}");
      }
    } else if (rules2.liquid.delimiterTrims === "strip") {
      input = input.replace(/^{%-/, "{%").replace(/-%}$/, "%}").replace(/^{{-/, "{{").replace(/-}}$/, "}}");
    } else if (rules2.liquid.delimiterTrims === "tags" && is(input[1], 37 /* PER */)) {
      if (not(input[2], 45 /* DSH */))
        input = input.replace(/^{%/, "{%-");
      if (not(input[end], 45 /* DSH */))
        input = input.replace(/%}$/, "-%}");
    } else if (rules2.liquid.delimiterTrims === "outputs" && is(input[1], 123 /* LCB */)) {
      if (not(input[2], 45 /* DSH */))
        input = input.replace(/^{{/, "{{-");
      if (not(input[end], 45 /* DSH */))
        input = input.replace(/}}$/, "-}}");
    }
    if (rules2.liquid.correct === false)
      return input;
    if (/^{%-?\s*#/.test(input) || /^{%-?\s*comment/.test(input))
      return input;
    if (/{%-?\s*(?:liquid)/.test(input))
      return input;
    let t;
    let q = 0;
    return input.split(/(["']{1})/).map((char, idx, arr) => {
      const quotation = is(char[0], 34 /* DQO */) || is(char[0], 39 /* SQO */);
      if (q > 0 || quotation && q === 0 && not(arr[idx - 1], 92 /* BWS */) || quotation) {
        if (q === 0)
          t = char.charCodeAt(0);
        if (q === 1 && not(arr[idx - 1], 92 /* BWS */)) {
          if (t === char.charCodeAt(0))
            q = 2;
          return char;
        }
        if (q !== 2) {
          q = q === 0 ? 1 : q === 1 ? is(arr[idx - 1], 92 /* BWS */) ? 1 : 2 : 0;
          return char;
        }
        q = 0;
      }
      return char.replace(SpaceOnly, WSP).replace(/^({[{%]-?)/, "$1 ").replace(/([!=]=|[<>]=?)/g, " $1 ").replace(new RegExp(" +(?=[|[\\],:.])|(?<=[[.]) +", "g"), NIL).replace(new RegExp("(\\||(?<=[^=!<>])(?:(?<=assign[^=]+)=(?=[^=!<>])|=$))", "g"), " $1 ").replace(/([:,]$|[:,](?=\S))/g, "$1 ").replace(/(-?[%}]})$/, " $1").replace(SpaceOnly, WSP);
    }).join(NIL);
  }
  function esc(idx) {
    let x = idx;
    do
      x = x - 1;
    while (is(b[x], 92 /* BWS */));
    x = idx - x;
    return x % 2 === 1;
  }
  function parseError(ref) {
    if (typeof ref === "object") {
      parse.diagnostic.line = ref.lineNumber;
      parse.diagnostic.character = ref.lineSpace || parse.linesSpace;
      return join(
        `Parse Error (line ${ref.lineNumber}):
`,
        typeof ref.message === "string" ? ref.message : join(...ref.message),
        ...ref.sample || []
      );
    } else if (typeof ref === "string") {
      parse.diagnostic.line = parse.lineNumber;
      parse.diagnostic.character = parse.linesSpace;
      return join(
        `Parse Error (line ${parse.lineNumber}):
`,
        ref
      );
    } else {
      parse.diagnostic.line = parse.lineNumber;
      parse.diagnostic.character = parse.linesSpace;
      return "Parse Error:\n" + parse.error;
    }
  }
  function parseToken(end) {
    const record = {
      lexer: "markup",
      lines: parse.linesSpace,
      stack: parse.scope.token !== "global" ? getTagName(parse.scope.token) : "global",
      begin: parse.scope.index,
      token: NIL,
      types: NIL,
      ender: -1
    };
    let token = NIL;
    let lchar = NIL;
    let ltype = NIL;
    let tname = NIL;
    let start = NIL;
    let nowalk = false;
    let ignore = false;
    let icount = 0;
    let jscomm = false;
    let nosort = false;
    let preserve = false;
    let basic = false;
    let attrs = [];
    function attrname(x, withQuotes = true) {
      const eq = x.indexOf("=");
      if (eq > 0) {
        const dq = x.indexOf('"');
        if (eq < dq && dq > 0) {
          return withQuotes ? [x.slice(0, eq), x.slice(eq + 1)] : [x.slice(0, eq), x.slice(eq + 2, -1)];
        }
        const sq = x.indexOf("'");
        if (eq < sq && sq > 0) {
          return withQuotes ? [x.slice(0, eq), x.slice(eq + 1)] : [x.slice(0, eq), x.slice(eq + 2, -1)];
        }
      }
      return [x, NIL];
    }
    function cdata() {
      if (ltype !== "cdata")
        return attribute();
      const { stack } = record;
      if (stack === "script" || stack === "style") {
        let begin = parse.count;
        let ender = parse.count;
        if (data.types[ender] === "attribute") {
          do {
            begin = begin - 1;
            ender = ender - 1;
          } while (data.types[ender] === "attribute" && ender > -1);
        }
        token = token.replace(/^(\s*<!\[cdata\[)/i, NIL).replace(/(\]{2}>\s*)$/, NIL);
        push(record, {
          begin,
          token: "<![CDATA[",
          types: "cdata_start"
        });
        parse.structure.push(["cdata", parse.count]);
        prettify.lexers[stack](token);
        push(record, {
          begin: parse.scope.index,
          token: "]]>",
          types: "cdata_end"
        });
        parse.structure.pop();
      }
      return attribute();
    }
    function template() {
      if (record.types.indexOf("liquid") === -1)
        return cdata();
      if (is(token[0], 123 /* LCB */) && is(token[1], 37 /* PER */)) {
        if (grammar.liquid.else.has(tname)) {
          record.types = "liquid_else";
        } else if (grammar.liquid.tags.has(tname)) {
          record.types = "liquid_start";
        } else if (tname.startsWith("end")) {
          const name = tname.slice(3);
          if (grammar.liquid.tags.has(name)) {
            record.types = "liquid_end";
          } else {
            record.stack = name;
            record.types = "liquid_end";
            let i = 0;
            do {
              if (data.types[i] === "liquid" && data.stack[i] === name) {
                data.types[i] = "liquid_start";
                break;
              }
              i = data.stack.indexOf(name, i + 1);
            } while (i > -1);
          }
        } else {
          record.stack = tname;
        }
      }
      if (rules2.liquid.quoteConvert === "double") {
        record.token = record.token.replace(/'/g, '"');
      } else if (rules2.liquid.quoteConvert === "single") {
        record.token = record.token.replace(/"/g, "'");
      }
      return cdata();
    }
    function singular() {
      if (basic && ignore === false && ltype !== "xml") {
        if (grammar.html.voids.has(tname)) {
          record.types = ltype = "singleton";
          if (rules2.markup.correct === true && not(token[token.length - 2], 47 /* FWS */)) {
            record.token = token = /\/\s+>$/.test(token) ? `${token.slice(0, token.lastIndexOf("/"))}${rules2.markup.selfCloseSpace ? "/>" : " />"}` : `${token.slice(0, -1)}${rules2.markup.selfCloseSpace ? "/>" : " />"}`;
          }
        } else if (is(token[token.length - 2], 47 /* FWS */) && is(token[token.length - 1], 62 /* RAN */)) {
          record.types = ltype = "singleton";
        } else {
          record.types = ltype = "start";
        }
      }
      return ignored();
    }
    function ignored() {
      let ender = NIL;
      if (CommIgnoreNext.test(data.token[parse.count])) {
        ignore = true;
        preserve = false;
        if (ltype.indexOf("liquid") > 0 && grammar.liquid.tags.has(tname)) {
          ender = `end${tname}`;
        } else if (grammar.html.voids.has(tname)) {
          ender = null;
        }
      } else if (grammar.html.voids.has(tname)) {
        ender = null;
      } else if (detect2(tname, "liquid") !== false && ig.has(tname) === true) {
        ender = null;
      }
      if (ender !== null && preserve === false && ignore === true && (end === ">" || end === "%}" || end === "}}")) {
        const tags = [];
        {
          preserve = true;
          if (ltype !== "json_preserve" && ltype !== "script_preserve" && ltype !== "style_preserve" && ltype !== "liquid_json_preserve" && ltype !== "liquid_script_preserve" && ltype !== "liquid_style_preserve") {
            ltype = "ignore";
          }
          a = a + 1;
          if (a < c) {
            let delim = NIL;
            let ee = 0;
            let ff = 0;
            let endtag = false;
            do {
              if (is(b[a], 10 /* NWL */))
                parse.lineNumber = parse.lineNumber + 1;
              tags.push(b[a]);
              if (delim === NIL) {
                delim = is(b[a], 34 /* DQO */) ? '"' : is(b[a], 39 /* SQO */) ? "'" : NIL;
                if (not(tags[0], 123 /* LCB */) && is(b[a], 123 /* LCB */) && (is(b[a + 1], 123 /* LCB */) || is(b[a + 1], 37 /* PER */))) {
                  delim = b[a + 1] + "}";
                } else if (is(b[a], 60 /* LAN */) && basic === true) {
                  endtag = is(b[a + 1], 47 /* FWS */);
                } else if (b[a] === lchar && not(b[a - 1], 47 /* FWS */)) {
                  if (endtag === true) {
                    icount = icount - 1;
                    if (icount < 0)
                      break;
                  } else {
                    icount = icount + 1;
                  }
                }
              } else if (is(b[a], delim.charCodeAt(delim.length - 1))) {
                ff = 0;
                ee = delim.length - 1;
                if (is(delim[ee], 125 /* RCB */)) {
                  if (b.slice(a + (is(b[a + 2], 45 /* DSH */) ? 3 : 2), b.indexOf("%", a + 2)).join(NIL).trim().startsWith(ender))
                    break;
                } else if (ee > -1) {
                  do {
                    if (not(b[a - ff], delim.charCodeAt(ee)))
                      break;
                    ff = ff + 1;
                    ee = ee - 1;
                  } while (ee > -1);
                }
                if (ee < 0)
                  delim = NIL;
              }
              a = a + 1;
            } while (a < c);
          }
        }
        if (ltype === "ignore") {
          token = token + tags.join(NIL);
          token = token.replace(">", ` ${attrs.map(([value]) => value).join(WSP)}>`);
          attrs = [];
          record.types = "content_preserve";
        } else {
          if (ltype.startsWith("liquid_")) ; else {
            record.types = "start";
            attribute(true);
            const close = tags.lastIndexOf("<");
            push(record, [
              {
                lexer: "markup",
                types: ltype,
                token: tags.slice(0, close).join(NIL)
              },
              {
                lexer: "markup",
                types: "end",
                token: tags.slice(close).join(NIL)
              }
            ]);
            embed = false;
            language2 = html;
            return script();
          }
        }
      }
      return template();
    }
    function embedded() {
      if (is(token, 60 /* LAN */) && is(token[1], 47 /* FWS */))
        return singular();
      if (is(token, 60 /* LAN */) && is(token[1], 47 /* FWS */) || (detect2(tname) === false || detect2(tname, "liquid") && ig.has(tname))) {
        return singular();
      }
      let item = attrs.length - 1;
      if (is(token, 60 /* LAN */)) {
        if (item > -1) {
          do {
            const q = determine(tname, "html", attrname(attrs[item][0], false));
            if (q !== false) {
              if (q.language === "json" && rules2.markup.ignoreJSON) {
                ltype = "json_preserve";
                ignore = true;
                break;
              } else if (q.language === "javascript" && rules2.markup.ignoreJS) {
                ltype = "script_preserve";
                ignore = true;
                break;
              } else if (q.language === "css" && rules2.markup.ignoreCSS) {
                ltype = "style_preserve";
                ignore = true;
                break;
              } else {
                language2 = q.language;
                ltype = "start";
                embed = true;
                break;
              }
            }
            item = item - 1;
          } while (item > -1);
        }
      } else if (isLiquidStart(token, true)) {
        const q = determine(tname, "liquid", token);
        if (q !== false) {
          if (ig.has(tname)) {
            ignore = true;
            preserve = false;
            return ignored();
          }
          embed = true;
          language2 = q.language;
        }
      }
      if (embed === true) {
        item = a + 1;
        if (item < c) {
          do {
            if (/\s/.test(b[item]) === false) {
              if (b[item] === "<") {
                if (b.slice(item + 1, item + 4).join("") === "!--") {
                  item = item + 4;
                  if (item < c) {
                    do {
                      if (/\s/.test(b[item]) === false) {
                        embed = false;
                        break;
                      }
                      if (b[item] === "\n" || b[item] === "\r") {
                        break;
                      }
                      item = item + 1;
                    } while (item < c);
                  }
                } else {
                  embed = false;
                }
              }
              break;
            }
            item = item + 1;
          } while (item < c);
        }
      }
      return singular();
    }
    function attribute(advance = false) {
      push(record);
      const begin = parse.count;
      const stack = tname.replace(/\/$/, NIL);
      const qc = rules2.markup.quoteConvert;
      let idx = 0;
      let eq = 0;
      let dq = 0;
      let sq = 0;
      let name = NIL;
      let value = NIL;
      let len = attrs.length;
      function quotes() {
        if (parse.attributes.has(begin)) {
          if (idx + 1 === len && not.last(record.token, 62 /* RAN */)) {
            record.token = record.token + ">";
          }
        }
        let lq = isLiquid(record.token, 5);
        if (ignore === true || qc === "none" || record.types.indexOf("attribute") < 0 || lq === false && qc === "single" && record.token.indexOf('"') < 0 || lq === false && qc === "double" && record.token.indexOf("'") < 0) {
          push(record);
        } else {
          let ee = 0;
          let ex = false;
          const ch = record.token.split(NIL);
          const eq2 = record.token.indexOf("=");
          const ln = ch.length - 1;
          if (not(ch[eq2 + 1], 34 /* DQO */) && not(ch[ch.length - 1], 34 /* DQO */) && qc === "single" && lq === false) {
            push(record, NIL);
          } else if (not(ch[eq2 + 1], 39 /* SQO */) && not(ch[ch.length - 1], 39 /* SQO */) && qc === "double" && lq === false) {
            push(record, NIL);
          } else {
            ee = eq2 + 2;
            if (lq === false) {
              if (qc === "double") {
                if (record.token.slice(eq2 + 2, ln).indexOf('"') > -1)
                  ex = true;
                ch[eq2 + 1] = '"';
                ch[ch.length - 1] = '"';
              } else if (qc === "single") {
                if (record.token.slice(eq2 + 2, ln).indexOf("'") > -1)
                  ex = true;
                ch[eq2 + 1] = "'";
                ch[ch.length - 1] = "'";
              }
            }
            if (ex === true || lq === true) {
              lq = false;
              do {
                if (is(ch[ee - 1], 123 /* LCB */) && (is(ch[ee], 37 /* PER */) || is(ch[ee], 123 /* LCB */))) {
                  lq = true;
                } else if (is(ch[ee], 125 /* RCB */) && (is(ch[ee - 1], 37 /* PER */) || is(ch[ee - 1], 125 /* RCB */))) {
                  lq = false;
                }
                if (lq === true) {
                  if (is(ch[ee], 34 /* DQO */) && qc === "double") {
                    ch[ee] = "'";
                  } else if (is(ch[ee], 39 /* SQO */) && qc === "single") {
                    ch[ee] = '"';
                  }
                } else {
                  if (is(ch[ee], 39 /* SQO */) && qc === "double") {
                    ch[ee] = '"';
                  } else if (is(ch[ee], 34 /* DQO */) && qc === "single") {
                    ch[ee] = "'";
                  }
                }
                ee = ee + 1;
              } while (ee < ln);
            }
            push(record, {
              token: ch.join(NIL)
            });
          }
        }
      }
      function sorting() {
        if (!(!jsx && !jscomm && !nosort))
          return;
        if (asl === 0) {
          attrs = parse.sortSafe(attrs, NIL, false);
          return;
        }
        const tempstore = [];
        dq = 0;
        eq = 0;
        len = attrs.length;
        do {
          eq = 0;
          do {
            name = attrs[eq][0].split("=")[0];
            if (rules2.markup.attributeSortList[dq] === name) {
              tempstore.push(attrs[eq]);
              attrs.splice(eq, 1);
              len = len - 1;
              break;
            }
            eq = eq + 1;
          } while (eq < len);
          dq = dq + 1;
        } while (dq < asl);
        attrs = parse.sortSafe(attrs, NIL, false);
        attrs = tempstore.concat(attrs);
        len = attrs.length;
      }
      function jsxattr() {
        push(record, "jsx_attribute", {
          token: `${name}={`,
          types: "jsx_attribute_start"
        });
        prettify.lexers.script(value.slice(1, value.length - 1));
        record.begin = parse.count;
        if (/\s\}$/.test(value)) {
          value = value.slice(0, value.length - 1);
          value = SpaceEnd.exec(value)[0];
          record.lines = value.indexOf("\n") < 0 ? 1 : value.split("\n").length;
        } else {
          record.lines = 0;
        }
        record.begin = parse.scope.index;
        record.stack = parse.scope.token;
        record.token = "}";
        record.types = "jsx_attribute_end";
        quotes();
      }
      function liqattr() {
        if (isLiquidLine(attrs[idx][0])) {
          record.types = "attribute";
          record.token = attrs[idx][0];
        } else if (isLiquidEnd(attrs[idx][0])) {
          record.token = attrs[idx][0];
          record.types = "liquid_attribute_end";
          record.ender = record.begin;
        } else if (isLiquidStart(attrs[idx][0])) {
          record.types = "liquid_attribute_start";
          record.begin = parse.count;
          record.token = attrs[idx][0];
        } else if (isLiquidElse(attrs[idx][0])) {
          record.types = "liquid_attribute_else";
          record.token = attrs[idx][0];
        } else {
          record.types = "attribute";
          record.token = attrs[idx][0];
        }
        quotes();
      }
      if (attrs.length < 1) {
        if (advance !== true)
          return;
        return script();
      }
      if (is(attrs[attrs.length - 1][0], 47 /* FWS */)) {
        attrs.pop();
        token = token.replace(/>$/, "/>");
      }
      eq = attrs.length;
      dq = 1;
      if (dq < eq) {
        do {
          name = attrs[dq - 1][0];
          if (is(name[name.length - 1], 61 /* EQS */) && attrs[dq][0].indexOf("=") < 0) {
            attrs[dq - 1][0] = name + attrs[dq][0];
            attrs.splice(dq, 1);
            eq = eq - 1;
            dq = dq - 1;
          }
          dq = dq + 1;
        } while (dq < eq);
      }
      if (rules2.markup.attributeSort)
        sorting();
      record.begin = begin;
      record.stack = stack;
      record.types = "attribute";
      if (idx < len) {
        do {
          if (attrs[idx] === void 0)
            break;
          record.lines = attrs[idx][1];
          attrs[idx][0] = attrs[idx][0].replace(SpaceEnd, NIL);
          if (jsx === true && /^\/[/*]/.test(attrs[idx][0])) {
            record.types = "comment_attribute";
            record.token = attrs[idx][0];
            quotes();
            idx = idx + 1;
            continue;
          }
          if (attrs[idx][1] <= 1 && isLiquidLine(attrs[idx][0])) {
            if (!isValueLiquid(attrs[idx][0])) {
              record.types = "attribute";
              record.token = attrs[idx][0];
              quotes();
              idx = idx + 1;
              continue;
            }
          }
          eq = attrs[idx][0].indexOf("=");
          dq = attrs[idx][0].indexOf('"');
          sq = attrs[idx][0].indexOf("'");
          if (eq < 0) {
            record.types = "attribute";
            if (is(attrs[idx][0], 35 /* HSH */) || is(attrs[idx][0], 91 /* LSB */) || is(attrs[idx][0], 123 /* LCB */) || is(attrs[idx][0], 40 /* LPR */) || jsx === true) {
              record.token = attrs[idx][0];
            } else {
              record.token = rules2.markup.attributeCasing === "preserve" ? attrs[idx][0] : attrs[idx][0].toLowerCase();
            }
            quotes();
          } else {
            name = attrs[idx][0].slice(0, eq);
            value = attrs[idx][0].slice(eq + 1);
            if (rules2.markup.attributeCasing === "lowercase-name") {
              name = name.toLowerCase();
              attrs[idx][0] = name + "=" + value;
            } else if (rules2.markup.attributeCasing === "lowercase-value") {
              value = value.toLowerCase();
              attrs[idx][0] = name + "=" + value;
            } else if (rules2.markup.attributeCasing === "lowercase") {
              name = name.toLowerCase();
              value = value.toLowerCase();
              attrs[idx][0] = name + "=" + value;
            }
            if (rules2.markup.correct === true && not(value, 60 /* LAN */) && not(value, 123 /* LCB */) && not(value, 61 /* EQS */) && not(value, 34 /* DQO */) && not(value, 39 /* SQO */)) {
              value = '"' + value + '"';
            }
            if (jsx === true && /^\s*{/.test(value)) {
              jsxattr();
              record.types = "attribute";
              record.begin = begin;
              record.stack = stack;
            } else if (isLiquidStart(value) && (rules2.liquid.valueForce === "always" || (rules2.liquid.valueForce === "intent" || rules2.liquid.valueForce === "wrap") && rules2.wrap > 0 && Math.abs(a - parse.lineStart) >= rules2.wrap || value.indexOf(NWL) > 0 && (rules2.liquid.valueForce === "newline" || rules2.liquid.valueForce === "intent")) && (is(value[0], 34 /* DQO */) || is(value[0], 39 /* SQO */))) {
              parse.attributes.set(begin, grammar.html.voids.has(record.stack));
              push(record, {
                token: `${name}=${sq > -1 ? "'" : '"'}`,
                types: "attribute"
              });
              if (idx + 1 === len) {
                MarkupLexer(value.slice(1, -1));
                data.token[parse.count] = `${data.token[parse.count]}${sq > -1 ? "'" : '"'}>`;
                break;
              }
              if (rules2.markup.forceIndent === true) {
                const q = value.lastIndexOf(value[0]);
                if (is(value[q], 34 /* DQO */) || is(value[q], 39 /* SQO */)) {
                  MarkupLexer(value.slice(1, q));
                  data.token[parse.count] = `${data.token[parse.count]}${sq > -1 ? "'" : '"'}`;
                } else {
                  MarkupLexer(value.slice(1));
                }
              } else {
                MarkupLexer(value.slice(1));
              }
              record.types = "attribute";
              record.stack = stack;
              record.begin = begin;
            } else {
              if (isLiquid(name, 5)) {
                liqattr();
              } else {
                record.types = "attribute";
                record.token = attrs[idx][0];
                quotes();
              }
            }
          }
          idx = idx + 1;
        } while (idx < len);
      }
      if (!advance)
        return script();
    }
    function exclude(tag, from) {
      tag = tag.trimStart().split(/\s/)[0];
      if (tag === "comment" || ig.has(tag)) {
        const idx1 = source.indexOf("{%", from);
        let idx2 = idx1;
        if (b[idx1 + 1].charCodeAt(0) === 45 /* DSH */)
          idx2 = idx1 + 1;
        idx2 = source.indexOf(`end${tag}`, idx2);
        if (idx2 > 0) {
          idx2 = b.indexOf("}", idx2);
          if (idx2 > 0 && b[idx2 - 1].charCodeAt(0) === 37 /* PER */) {
            if (tag !== "comment") {
              ltype = "ignore";
              ignore = true;
              start = b.slice(a, from + 1).join(NIL);
              end = b.slice(idx1, idx2 + 1).join(NIL);
            } else {
              ltype = "comment";
              start = b.slice(a, from + 1).join(NIL);
              end = b.slice(idx1, idx2 + 1).join(NIL);
            }
          }
        }
      }
    }
    function comments(lineComment) {
      const comm = lineComment === true ? wrapCommentLine({
        chars: b,
        end: c,
        lexer: "markup",
        begin: start,
        start: a,
        ender: end
      }) : wrapCommentBlock({
        chars: b,
        end: c,
        lexer: "markup",
        begin: start,
        start: a,
        ender: end
      });
      token = comm[0];
      a = comm[1];
      if (token.replace(start, NIL).trimStart().startsWith("@prettify-ignore-start")) {
        push(record, { token, types: "ignore" });
      } else {
        if (is(token[0], 123 /* LCB */) && is(token[1], 37 /* PER */) && lineComment === false) {
          const begin = token.indexOf("%}", 2) + 2;
          const last = token.lastIndexOf("{%");
          token = inner(token.slice(0, begin)) + token.slice(begin, last) + inner(token.slice(last));
        }
        record.token = token;
        record.types = "comment";
        return embedded();
      }
    }
    function delimiter() {
      if (end === "---") {
        start = "---";
        ltype = "ignore";
        preserve = true;
      } else if (is(b[a], 60 /* LAN */)) {
        if (is(b[a + 1], 47 /* FWS */)) {
          ltype = "end";
          end = ">";
        } else if (is(b[a + 1], 33 /* BNG */)) {
          if ((is(b[a + 2], 100) || is(b[a + 2], 68)) && (is(b[a + 3], 111) || is(b[a + 3], 79)) && (is(b[a + 4], 99) || is(b[a + 4], 67)) && (is(b[a + 5], 116) || is(b[a + 5], 84)) && (is(b[a + 6], 121) || is(b[a + 6], 89)) && (is(b[a + 7], 112) || is(b[a + 7], 80)) && (is(b[a + 8], 101) || is(b[a + 8], 69))) {
            end = ">";
            ltype = "doctype";
            preserve = true;
          } else if (is(b[a + 2], 45 /* DSH */) && is(b[a + 3], 45 /* DSH */)) {
            end = "-->";
            start = "<!--";
            ltype = "comment";
          } else if (is(b[a + 2], 91 /* LSB */) && b[a + 3].charCodeAt(0) === 67 && b[a + 4].charCodeAt(0) === 68 && b[a + 5].charCodeAt(0) === 65 && b[a + 6].charCodeAt(0) === 84 && b[a + 7].charCodeAt(0) === 65 && is(b[a + 8], 91 /* LSB */)) {
            end = "]]>";
            ltype = "cdata";
            preserve = true;
          }
        } else if (b[a + 1] === "?") {
          end = "?>";
          if (b[a + 2].charCodeAt(0) === 120 && b[a + 3].charCodeAt(0) === 109 && b[a + 4].charCodeAt(0) === 109) {
            ltype = "xml";
            basic = true;
          } else {
            preserve = true;
            ltype = "liquid";
          }
        } else if (is(b[a + 1], 112) && is(b[a + 2], 114) && is(b[a + 3], 101) && (is(b[a + 4], 62 /* RAN */) || ws(b[a + 4]))) {
          end = "</pre>";
          ltype = "ignore";
          preserve = true;
        } else {
          basic = true;
          end = ">";
        }
      } else if (is(b[a], 123 /* LCB */)) {
        if (jsx) {
          embed = true;
          nowalk = true;
          parse.structure.push(["script", parse.count]);
          push(record, {
            token: "{",
            types: "script_start"
          });
          return;
        }
        if (is(b[a + 1], 123 /* LCB */)) {
          preserve = true;
          end = "}}";
          ltype = "liquid";
        } else if (is(b[a + 1], 37 /* PER */)) {
          preserve = true;
          end = "%}";
          ltype = "liquid";
          const from = b.indexOf("}", a + 2);
          if (is(b[from - 1], 37 /* PER */)) {
            let tag = b.slice(a + 2, from - 1).join(NIL);
            if (is(tag, 45 /* DSH */)) {
              start = "{%-";
              tag = tag.slice(1).trimStart();
            } else {
              start = "{%";
              tag = tag.trimStart();
            }
            if (is(tag[tag.length - 1], 45 /* DSH */)) {
              end = "-%}";
              tag = tag.slice(0, tag.length - 1).trimEnd();
            } else {
              end = "%}";
              tag = tag.trimEnd();
            }
            exclude(tag, from);
            if (is(tag, 35 /* HSH */)) {
              ltype = "comment";
              end = "%}";
              lchar = end.charAt(end.length - 1);
              return comments(true);
            }
          } else {
            preserve = true;
            end = "%}";
            ltype = "liquid";
          }
        } else {
          preserve = true;
          end = b[a + 1] + "}";
          ltype = "liquid";
        }
      }
      if (rules2.markup.preserveAttributes === true)
        preserve = true;
      if (nowalk)
        return embedded();
      lchar = end.charAt(end.length - 1);
      if (ltype === "comment" && (is(b[a], 60 /* LAN */) || is(b[a], 123 /* LCB */) && is(b[a + 1], 37 /* PER */))) {
        return comments();
      } else if (a < c) {
        return traverse();
      }
      return embedded();
    }
    function traverse() {
      const lexed = [];
      let e = 0;
      let f = 0;
      let acount = 0;
      let bcount = 0;
      let pcount = 0;
      let lines = 0;
      let quote = NIL;
      let jsxquote = NIL;
      let jsxparen = 0;
      let isliq = false;
      let stest = false;
      let qattr = false;
      let qtest = false;
      let store = [];
      function tokenize(quotes) {
        let each;
        let attr = NIL;
        if (quotes === true) {
          attr = store.join(NIL);
          each = attrname(attr);
          quote = NIL;
          if (each[0] === "data-prettify-ignore")
            ignore = true;
        } else {
          attr = store.join(NIL);
          if (jsx === false || jsx && !is(attr[attr.length - 1], 125 /* RCB */))
            attr = attr.replace(/\s+/g, WSP);
          each = attrname(attr);
          if (each[0] === "data-prettify-ignore")
            ignore = true;
          if (jsx && is(store[0], 123 /* LCB */) && is(store[store.length - 1], 125 /* RCB */))
            jsxparen = 0;
        }
        if (is(attr[0], 123 /* LCB */) && is(attr[1], 37 /* PER */))
          nosort = true;
        if (quotes === false) {
          if (isLiquidStart(attr))
            within = within + 1;
          if (isLiquidEnd(attr))
            within = within - 1;
        }
        attr = attr.replace(/^\u0020/, NIL).replace(/\u0020$/, NIL);
        store = attr.replace(/\r\n/g, NWL).split(NWL);
        if (!store.length)
          store[0] = store[0].replace(/\s+$/, NIL);
        attr = rules2.crlf === true ? inner(store.join("\r\n")) : inner(store.join(NWL));
        if (within > 0 || isLiquid(attr, 1)) {
          if (isLiquid(attr, 5) === false) {
            lines = 0;
            if (is(b[a + 1], 10 /* NWL */) || is(b[a], 10 /* NWL */))
              lines = 2;
            if (is(b[a], 32 /* WSP */) && not(b[a + 1], 32 /* WSP */))
              lines = 1;
          } else {
            if (is(b[a + 1], 10 /* NWL */)) {
              lines = 2;
            } else if (is(b[a + 1], 32 /* WSP */)) {
              lines = 1;
            } else if (lines >= 1) {
              lines = 0;
            }
          }
        } else {
          if (is(b[a + 1], 10 /* NWL */)) {
            lines = 2;
          } else if (is(b[a + 1], 32 /* WSP */)) {
            lines = 1;
          }
        }
        if (attrs.length > 0) {
          const ln = attrs.length - 1;
          if (is(attr, 61 /* EQS */) || is(attr, 45 /* DSH */)) {
            attrs[ln][0] = attrs[ln][0] + attr;
            attrs[ln][1] = lines;
            attr = NIL;
          } else if (lines === 0 && attrs[ln][1] === 0) {
            attrs[ln][0] = attrs[ln][0] + attr;
            attrs[ln][1] = lines;
            attr = NIL;
          } else if (lines > 0 && attrs[ln][1] === 0 && isLiquidEnd(attr) === true) {
            attrs[ln][0] = attrs[ln][0] + attr;
            attrs[ln][1] = lines;
            attr = NIL;
          } else if (lines > 0 && attrs[ln][1] === 0 && isLiquid(attrs[ln][0], 4)) {
            attrs[ln][0] = attrs[ln][0] + attr;
            attr = NIL;
          } else if (attrs[ln][1] > 0 && lines === 0 && isLiquidControl(attr) === false) {
            lines = attrs[ln][1];
          } else if (attrs[ln][1] > 0 && lines > 0 && isLiquidEnd(attr) && !isLiquid(attr, 6)) {
            const i = attr.indexOf("{%");
            attrs.push([attr.slice(0, i), lines]);
            attr = attr.slice(i);
          }
        }
        if (attr !== NIL && attr !== WSP)
          attrs.push([attr, lines]);
        if (attrs.length > 0) {
          const [value] = attrs[attrs.length - 1];
          if (value.indexOf("=\u201C") > 0) {
            parse.error = parseError("Invalid quote character (\u201C, &#x201c) used.");
          } else if (value.indexOf("=\u201D") > 0) {
            parse.error = parseError("Invalid quote character (\u201D, &#x201d) used.");
          }
        }
        store = [];
        lines = is(b[a], 10 /* NWL */) ? 2 : 1;
      }
      if (parse.error)
        return;
      do {
        if (is(b[a], 10 /* NWL */)) {
          lines = lines + 1;
          parse.lineNumber = parse.lineNumber + 1;
        }
        if (start === "---" && end === "---" && ltype === "ignore") {
          lexed.push(b[a]);
          if (a > 3 && is(b[a], 45 /* DSH */) && is(b[a - 1], 45 /* DSH */) && is(b[a - 2], 45 /* DSH */))
            break;
          a = a + 1;
          continue;
        }
        if (preserve === true || (ws(b[a]) === false && not(quote, 125 /* RCB */) || is(quote, 125 /* RCB */))) {
          lexed.push(b[a]);
          if (isliq === false && is(b[a - 1], 123 /* LCB */) && (is(b[a], 123 /* LCB */) || is(b[a], 37 /* PER */))) {
            isliq = true;
          } else if (isliq === true && is(b[a], 125 /* RCB */) && (is(b[a - 1], 125 /* RCB */) || is(b[a - 1], 37 /* PER */))) {
            isliq = false;
          }
          if (ltype === "end" && lexed.length > 2 && is(lexed[0], 60 /* LAN */) && is(lexed[1], 47 /* FWS */) && (is(lexed[lexed.length - 1], 47 /* FWS */) || is(lexed[lexed.length - 1], 60 /* LAN */))) {
            if (rules2.markup.correct) {
              lexed.pop();
              lexed.push(">");
            } else {
              parse.error = parseError({
                lineNumber: parse.lineNumber,
                message: [
                  `Missing closing delimiter character: ${lexed.join(NIL)}`,
                  "\nTIP",
                  "Prettify can autofix these issues when the correct rule is enabled"
                ]
              });
              return;
            }
            break;
          }
          if (is(lexed[0], 60 /* LAN */) && is(lexed[1], 62 /* RAN */) && is(end, 62 /* RAN */)) {
            return push(record, "(empty)", {
              token: "<>",
              types: "start"
            });
          }
          if (is(lexed[0], 60 /* LAN */) && is(lexed[1], 47 /* FWS */) && is(lexed[2], 62 /* RAN */) && is(end, 62 /* RAN */)) {
            return push(record, {
              token: "</>",
              types: "end"
            });
          }
        }
        if (ltype === "cdata" && is(b[a], 62 /* RAN */) && is(b[a - 1], 93 /* RSB */) && not(b[a - 2], 93 /* RSB */)) {
          parse.error = parseError(`CDATA tag (${lexed.join(NIL)}) not properly terminated with "]]>`);
          break;
        }
        if (ltype === "comment") {
          quote = NIL;
          if (b[a] === lchar && lexed.length > end.length + 1) {
            f = lexed.length;
            e = end.length - 1;
            if (e > -1) {
              do {
                f = f - 1;
                if (not(lexed[f], end.charCodeAt(e)))
                  break;
                e = e - 1;
              } while (e > -1);
            }
            if (e < 0)
              break;
          }
        } else {
          if (quote === NIL) {
            if (is(lexed[0], 60 /* LAN */) && is(lexed[1], 33 /* BNG */) && ltype !== "cdata") {
              if (ltype === "doctype" && is(b[a], 62 /* RAN */))
                break;
              if (is(b[a], 91 /* LSB */)) {
                if (is(b[a + 1], 60 /* LAN */)) {
                  ltype = "start";
                  break;
                }
                if (ws(b[a + 1])) {
                  do {
                    a = a + 1;
                    if (is(b[a], 10 /* NWL */))
                      lines = lines + 1;
                  } while (a < c - 1 && ws(b[a + 1]));
                }
                if (is(b[a + 1], 60 /* LAN */)) {
                  ltype = "start";
                  break;
                }
              }
            }
            if (jsx) {
              if (is(b[a], 123 /* LCB */)) {
                jsxparen = jsxparen + 1;
              } else if (is(b[a], 125 /* RCB */)) {
                jsxparen = jsxparen - 1;
              }
            }
            if (is(b[a], 60 /* LAN */) && basic === true && preserve === false && lexed.length > 1 && />{2,3}/.test(end) === false) {
              parse.error = parseError(`Invalid structure detected ${b.slice(a, a + 8).join(NIL)}`);
              break;
            }
            if (ws(b[a]) === false && stest === true && b[a] !== lchar) {
              stest = false;
              icount = 0;
              quote = jsxquote;
              lexed.pop();
              if (a < c) {
                do {
                  if (is(b[a], 10 /* NWL */))
                    parse.lineNumber = parse.lineNumber + 1;
                  if (rules2.markup.preserveAttributes === true) {
                    lexed.push(b[a]);
                  } else {
                    store.push(b[a]);
                  }
                  if (not(quote, 34 /* DQO */) || not(quote, 39 /* SQO */)) {
                    if (is(b[a - 1], 123 /* LCB */) && (is(b[a], 37 /* PER */) || is(b[a], 123 /* LCB */))) {
                      isliq = true;
                    } else if ((is(b[a - 1], 125 /* RCB */) || is(b[a - 1], 37 /* PER */)) && is(b[a], 125 /* RCB */)) {
                      isliq = false;
                    }
                  }
                  if (jsx === false && qattr === false && isliq === true && rules2.markup.preserveAttributes === false) {
                    while (a < c) {
                      a = a + 1;
                      if (is(b[a], 10 /* NWL */)) {
                        parse.lineNumber = parse.lineNumber + 1;
                        if (is(store[0], 61 /* EQS */)) {
                          isliq = false;
                          quote = NIL;
                          tokenize(false);
                          break;
                        }
                      }
                      store.push(b[a]);
                      if (is(store[0], 61 /* EQS */) && is(b[a + 1], 62 /* RAN */)) {
                        isliq = false;
                        attrs[attrs.length - 1][0] += store.join(NIL);
                        store = [];
                        quote = NIL;
                        break;
                      }
                      if (is(store[0], 61 /* EQS */) === false && is(b[a], 125 /* RCB */) && (is(b[a - 1], 125 /* RCB */) || is(b[a - 1], 37 /* PER */))) {
                        isliq = false;
                        quote = NIL;
                        tokenize(false);
                        break;
                      }
                    }
                  }
                  if (jsx === false && (is(b[a], 60 /* LAN */) || is(b[a], 62 /* RAN */)) && (quote === NIL || is(quote, 62 /* RAN */))) {
                    if (quote === NIL && is(b[a], 60 /* LAN */)) {
                      quote = ">";
                      acount = 1;
                    } else if (is(quote, 62 /* RAN */)) {
                      if (is(b[a], 60 /* LAN */)) {
                        acount = acount + 1;
                      } else if (is(b[a], 62 /* RAN */)) {
                        acount = acount - 1;
                        if (acount === 0) {
                          quote = NIL;
                          icount = 0;
                          tokenize(false);
                          break;
                        }
                      }
                    }
                  } else if (quote === NIL) {
                    if (b[a + 1] === lchar) {
                      if (is(store[store.length - 1], 47 /* FWS */) || is(store[store.length - 1], 63 /* QWS */) && ltype === "xml") {
                        store.pop();
                        if (preserve === true)
                          lexed.pop();
                        a = a - 1;
                      }
                      if (store.length > 0)
                        tokenize(false);
                      break;
                    }
                    if (jsx === false && is(b[a], 123 /* LCB */) && is(b[a - 1], 61 /* EQS */)) {
                      quote = "}";
                    } else if (is(b[a], 34 /* DQO */) || is(b[a], 39 /* SQO */)) {
                      quote = b[a];
                      if (qattr === false && isliq === false)
                        qattr = true;
                      if (is(b[a - 1], 61 /* EQS */) && (is(b[a + 1], 60 /* LAN */) || is(b[a + 1], 123 /* LCB */) && is(b[a + 2], 37 /* PER */) || ws(b[a + 1]) && not(b[a - 1], 61 /* EQS */))) {
                        icount = a;
                      }
                    } else if (is(b[a], 40 /* LPR */)) {
                      quote = ")";
                      pcount = 1;
                    } else if (jsx) {
                      if ((is(b[a - 1], 61 /* EQS */) || ws(b[a - 1])) && is(b[a], 123 /* LCB */)) {
                        quote = "}";
                        bcount = 1;
                      } else if (is(b[a], 47 /* FWS */)) {
                        if (is(b[a + 1], 42 /* ARS */)) {
                          quote = "*/";
                        } else if (is(b[a + 1], 47 /* FWS */)) {
                          quote = NWL;
                        }
                      }
                    } else if (is(lexed[0], 123 /* LCB */) && is(b[a], 123 /* LCB */) && (is(b[a + 1], 123 /* LCB */) || is(b[a + 1], 37 /* PER */))) {
                      quote = is(b[a + 1], 123 /* LCB */) ? "}}" : b[a + 1] + "}";
                    }
                    if (ws(b[a]) && quote === NIL) {
                      if (is(store[store.length - 2], 61 /* EQS */)) {
                        e = a + 1;
                        if (e < c) {
                          do {
                            if (ws(b[e]) === false) {
                              if (is(b[e], 34 /* DQO */) || is(b[e], 39 /* SQO */)) {
                                a = e - 1;
                                qtest = true;
                                store.pop();
                              }
                              break;
                            }
                            e = e + 1;
                          } while (e < c);
                        }
                      }
                      if (qtest === true) {
                        qtest = false;
                      } else if (jsxparen === 0 || jsxparen === 1 && is(store[0], 123 /* LCB */)) {
                        store.pop();
                        if (store.length > 0)
                          tokenize(false);
                        stest = true;
                        break;
                      }
                    }
                  } else if (is(b[a], 40 /* LPR */) && is(quote, 41 /* RPR */)) {
                    pcount = pcount + 1;
                  } else if (is(b[a], 41 /* RPR */) && is(quote, 41 /* RPR */)) {
                    pcount = pcount - 1;
                    if (pcount === 0) {
                      quote = NIL;
                      if (is(b[a + 1], end.charCodeAt(0))) {
                        tokenize(false);
                        break;
                      }
                    }
                  } else if (jsx === true && (is(quote, 125 /* RCB */) || is(quote, 10 /* NWL */) && is(b[a], 10 /* NWL */) || quote === "*/" && is(b[a - 1], 42 /* ARS */) && is(b[a], 47 /* FWS */))) {
                    if (is(b[a], 96 /* TQO */)) {
                      a = a + 1;
                      do {
                        store.push(b[a]);
                        if (is(b[a], 96 /* TQO */))
                          break;
                        a = a + 1;
                      } while (a < b.length);
                    }
                    if (is(quote, 125 /* RCB */)) {
                      if (is(b[a], 125 /* RCB */) && b[a] !== quote) {
                        bcount = bcount + 1;
                      } else if (b[a] === quote) {
                        bcount = bcount - 1;
                        if (bcount === 0) {
                          jsxparen = 0;
                          quote = NIL;
                          token = store.join(NIL);
                          if (rules2.markup.preserveAttributes === false) {
                            if (jsx) {
                              if (!/^\s*$/.test(token))
                                attrs.push([token, lines]);
                            } else {
                              token = token.replace(/\s+/g, WSP);
                              if (token !== WSP)
                                attrs.push([token, lines]);
                            }
                          }
                          store = [];
                          lines = 1;
                          break;
                        }
                      }
                    } else {
                      jsxquote = NIL;
                      jscomm = true;
                      token = store.join(NIL);
                      if (token !== WSP)
                        attrs.push([token, lines]);
                      store = [];
                      lines = is(quote, 10 /* NWL */) ? 2 : 1;
                      quote = NIL;
                      break;
                    }
                  } else if (is(b[a], 123 /* LCB */) && is(b[a + 1], 37 /* PER */) && is(b[icount - 1], 61 /* EQS */) && (is(quote, 34 /* DQO */) || is(quote, 39 /* SQO */))) {
                    quote = quote + "{%";
                    icount = 0;
                  } else if (is(b[a - 1], 37 /* PER */) && is(b[a], 125 /* RCB */) && (quote === '"{%' || quote === "'{%")) {
                    quote = quote[0];
                    icount = 0;
                  } else if (is(b[a], 60 /* LAN */) && is(end, 62 /* RAN */) && is(b[icount - 1], 61 /* EQS */) && (is(quote, 34 /* DQO */) || is(quote, 39 /* SQO */))) {
                    quote = quote + "<";
                    icount = 0;
                  } else if (is(b[a], 62 /* RAN */) && (quote === '"<' || quote === "'<")) {
                    quote = quote.charAt(0);
                    icount = 0;
                  } else if (icount === 0 && not(quote, 62 /* RAN */) && (quote.length < 2 || not(quote, 34 /* DQO */) && not(quote, 39 /* SQO */))) {
                    f = 0;
                    e = quote.length - 1;
                    if (e > -1) {
                      do {
                        if (not(b[a - f], quote.charCodeAt(e)))
                          break;
                        f = f + 1;
                        e = e - 1;
                      } while (e > -1);
                    }
                    if (e < 0 && isliq === false && qattr === true) {
                      qattr = false;
                      tokenize(true);
                      if (b[a + 1] === lchar)
                        break;
                    }
                    if (e === 0 && is(b[a], 62 /* RAN */) && qattr === true && isliq === false) {
                      parse.error = "missing quotataion";
                      break;
                    }
                  } else if (icount > 0 && ws(b[a]) === false) {
                    icount = 0;
                  }
                  a = a + 1;
                } while (a < c);
              }
            } else if (is(end, 10 /* NWL */) === false && (is(b[a], 34 /* DQO */) || is(b[a], 39 /* SQO */))) {
              quote = b[a];
            } else if (ltype !== "comment" && not(end, 10 /* NWL */) && is(b[a], 60 /* LAN */) && is(b[a + 1], 33 /* BNG */) && is(b[a + 2], 45 /* DSH */) && is(b[a + 3], 45 /* DSH */) && data.types[parse.count] !== "conditional") {
              quote = "-->";
            } else if (is(b[a], 123 /* LCB */) && not(lexed[0], 123 /* LCB */) && not(end, 10 /* NWL */) && (is(b[a + 1], 123 /* LCB */) || is(b[a + 1], 37 /* PER */))) {
              if (is(b[a + 1], 123 /* LCB */)) {
                quote = "}}";
              } else {
                quote = b[a + 1] + "}";
                if (store.length < 1 && (attrs.length < 1 || ws(b[a - 1]))) {
                  lexed.pop();
                  do {
                    if (is(b[a], 10 /* NWL */))
                      lines = lines + 1;
                    store.push(b[a]);
                    a = a + 1;
                  } while (a < c && b[a - 1] + b[a] !== quote);
                  store.push("}");
                  attrs.push([store.join(NIL), lines]);
                  store = [];
                  lines = 1;
                  quote = NIL;
                }
              }
              if (quote === end)
                quote = NIL;
            } else if (basic && not(end, 10 /* NWL */) && ws(b[a]) && not(b[a - 1], 60 /* LAN */)) {
              stest = true;
            } else if (basic && jsx && is(b[a], 47 /* FWS */) && (is(b[a + 1], 42 /* ARS */) || is(b[a + 1], 47 /* FWS */))) {
              stest = true;
              lexed[lexed.length - 1] = WSP;
              jsxquote = is(b[a + 1], 42 /* ARS */) ? "*/" : NWL;
              store.push(b[a]);
            } else if (isliq === false && (b[a] === lchar || is(end, 10 /* NWL */) && is(b[a + 1], 60 /* LAN */)) && (lexed.length > end.length + 1 || is(lexed[0], 93 /* RSB */)) && (jsx === false || jsxparen === 0)) {
              if (is(end, 10 /* NWL */)) {
                if (ws(lexed[lexed.length - 1])) {
                  do {
                    lexed.pop();
                    a = a - 1;
                  } while (ws(lexed[lexed.length - 1]));
                }
                break;
              }
              f = lexed.length;
              e = end.length - 1;
              if (e > -1) {
                do {
                  f = f - 1;
                  if (lexed[f] !== end.charAt(e))
                    break;
                  e = e - 1;
                } while (e > -1);
              }
              if (e < 0) {
                if (is(lexed[f], 62 /* RAN */) && is(b[a], 62 /* RAN */) && attrs.length > 0) {
                  if (attrs[attrs.length - 1][1] === 0 && is(b[a - 1], 125 /* RCB */) && ws(b[a + 1])) {
                    attrs[attrs.length - 1][1] = is(b[a + 1], 32 /* WSP */) ? 1 : 2;
                  }
                }
                break;
              }
            }
          } else if (is(b[a], quote.charCodeAt(quote.length - 1)) && (jsx === true && is(end, 125 /* RCB */) && (not(b[a - 1], 92 /* BWS */) || esc(a) === false) || (jsx === false || not(end, 125 /* RCB */)))) {
            f = 0;
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
              quote = NIL;
          }
        }
        a = a + 1;
      } while (a < c);
      icount = 0;
      token = lexed.join(NIL);
      tname = getTagName(token);
      if (ignore === false)
        token = inner(token);
      if (tname === "xml") {
        html = "xml";
      } else if (html === NIL && tname === "html") {
        html = "html";
      }
      record.token = token;
      record.types = ltype;
      if (preserve === false && jsx === false) {
        token = token.replace(/\s+/g, WSP);
      }
      return embedded();
    }
    function script() {
      if (rules2.wrap > 0 && jsx === true) {
        let clength = 0;
        let bb = parse.count;
        let cc2 = 0;
        if (data.types[bb].indexOf("attribute") > -1) {
          do {
            clength = clength + data.token[bb].length + 1;
            bb = bb - 1;
          } while (data.lexer[bb] !== "markup" || data.types[bb].indexOf("attribute") > -1);
          if (data.lines[bb] === 1)
            clength = clength + data.token[bb].length + 1;
        } else if (data.lines[bb] === 1) {
          clength = data.token[bb].length + 1;
        }
        cc2 = bb - 1;
        if (clength > 0 && data.types[cc2] !== "script_end") {
          if (data.types[cc2].indexOf("attribute") > -1) {
            do {
              clength = clength + data.token[cc2].length + 1;
              cc2 = cc2 - 1;
            } while (data.lexer[cc2] !== "markup" || data.types[cc2].indexOf("attribute") > -1);
            if (data.lines[cc2] === 1)
              clength = clength + data.token[cc2].length + 1;
          } else if (data.lines[cc2] === 1) {
            clength = data.token[cc2].length + 1;
          }
        }
      }
      parse.linesSpace = 0;
    }
    return delimiter();
  }
  function parseContent() {
    const now = a;
    const jsxbrace = jsx === true && is(data.token[parse.count], 123 /* LCB */);
    let lex = [];
    let ltoke = NIL;
    let liner = parse.linesSpace;
    let name = NIL;
    if (embed === true) {
      if (jsxbrace === true) {
        name = "script";
      } else if (parse.scope.index > -1) {
        name = getTagName(data.token[parse.scope.index]);
      } else if (data.begin[parse.count] > 1) {
        name = getTagName(data.token[data.begin[parse.count]]);
      } else {
        name = getTagName(data.token[data.begin[parse.count]]);
      }
    }
    const record = {
      begin: parse.scope.index,
      ender: -1,
      lexer: "markup",
      lines: liner,
      stack: getTagName(parse.scope.token) || "global",
      token: NIL,
      types: "content"
    };
    function sgml() {
      return data.types[parse.count] === "liquid_start" && data.token[parse.count].indexOf("<!") === 0 && data.token[parse.count].indexOf("<![") < 0 && data.token[parse.count].charCodeAt(data.token[parse.count].length - 1) === 91 /* LSB */;
    }
    function esctest() {
      let aa = a - 1;
      let bb = 0;
      if (not(b[a - 1], 92 /* BWS */))
        return false;
      if (aa > -1) {
        do {
          if (not(b[aa], 92 /* BWS */))
            break;
          bb = bb + 1;
          aa = aa - 1;
        } while (aa > -1);
      }
      return bb % 2 === 1;
    }
    if (a < c) {
      let end = NIL;
      let quote = NIL;
      let output = NIL;
      let quotes = 0;
      do {
        if (is(b[a], 10 /* NWL */))
          parse.lineNumber = parse.lineNumber + 1;
        if (embed === true) {
          if (quote === NIL) {
            if (is(b[a], 47 /* FWS */)) {
              if (is(b[a + 1], 42 /* ARS */)) {
                quote = "*";
              } else if (is(b[a + 1], 47 /* FWS */)) {
                quote = "/";
              } else if (name === "script" && "([{!=,;.?:&<>".indexOf(b[a - 1]) > -1) {
                if (jsx === false || not(b[a - 1], 60 /* LAN */))
                  quote = "reg";
              }
            } else if ((is(b[a], 34 /* DQO */) || is(b[a], 39 /* SQO */) || is(b[a], 96 /* TQO */)) && esctest() === false) {
              quote = b[a];
            } else if (is(b[a], 123 /* LCB */) && jsxbrace === true) {
              quotes = quotes + 1;
            } else if (is(b[a], 125 /* RCB */) && jsxbrace === true) {
              if (quotes === 0) {
                output = lex.join(NIL).replace(SpaceLead, NIL).replace(SpaceEnd, NIL);
                prettify.lexers.script(output);
                parse.scope.index += 1;
                if (data.types[parse.count] === "end" && data.lexer[data.begin[parse.count] - 1] === "script") {
                  push(record, {
                    lexer: "script",
                    types: "separator",
                    token: rules2.markup.correct === true ? ";" : "x;"
                  });
                  record.lexer = "markup";
                }
                push(record, { token: "}", types: "script_end" });
                parse.structure.pop();
                break;
              }
              quotes = quotes - 1;
            }
            if (isLiquid(data.token[parse.count], 3) === false) {
              end = b.slice(a, a + 10).join(NIL).toLowerCase();
              if (name === "script") {
                end = a === c - 9 ? end.slice(0, end.length - 1) : end.slice(0, end.length - 2);
                if (end === "<\/script") {
                  output = lex.join(NIL).replace(SpaceLead, NIL).replace(SpaceEnd, NIL);
                  a = a - 1;
                  if (lex.length < 1)
                    break;
                  if (/^<!--+/.test(output) && /--+>$/.test(output)) {
                    push(record, { token: "<!--", types: "comment" });
                    output = output.replace(/^<!--+/, NIL).replace(/--+>$/, NIL);
                    prettify.lexers.script(output);
                    push(record, { token: "-->" });
                  } else {
                    parse.external.set(parse.count + 1, { language: language2, lexer: "script" });
                    console.log(parse.external);
                    rules2.language = language2;
                    prettify.lexers.script(lex);
                    rules2.language = "liquid";
                  }
                  break;
                }
              }
            } else {
              if (detect2(name, "liquid") && ig.has(name) === false) {
                const match = new RegExp(`\\s*{%-?\\s*end${name}`);
                const inner2 = b.slice(a).join(NIL);
                const ender = inner2.search(match);
                lex = b.slice(a, a + ender);
                output = lex.join(NIL);
                parse.lexer(output, language2);
                a = a + lex.length;
                console.log("embedded here", embed, a, data);
                embed = false;
                break;
              }
            }
          } else if (quote === b[a] && esctest() === false && (is(quote, 34 /* DQO */) || is(quote, 39 /* SQO */) || is(quote, 96 /* TQO */) || is(quote, 42 /* ARS */) && is(b[a + 1], 47 /* FWS */))) {
            quote = NIL;
          } else if (is(quote, 96 /* TQO */) && is(b[a], 36 /* DOL */) && is(b[a + 1], 123 /* LCB */) && esctest() === false) {
            quote = "}";
          } else if (is(quote, 125 /* RCB */) && is(b[a], 125 /* RCB */) && esctest() === false) {
            quote = "`";
          } else if (is(quote, 47 /* FWS */) && (is(b[a], 10 /* NWL */) || is(b[a], 13 /* CAR */))) {
            quote = NIL;
          } else if (quote === "reg" && is(b[a], 47 /* FWS */) && esctest() === false) {
            quote = NIL;
          } else if (is(quote, 47 /* FWS */) && is(b[a], 60 /* LAN */) && is(b[a - 1], 45 /* DSH */) && is(b[a - 2], 45 /* DSH */)) {
            end = b.slice(a + 1, a + 11).join(NIL).toLowerCase();
            end = end.slice(0, end.length - 2);
            if (name === "script" && end === "<\/script")
              quote = NIL;
            end = end.slice(0, end.length - 1);
            if (name === "style" && end === "</style")
              quote = NIL;
          }
        }
        if (sgml() === true && is(b[a], 93 /* RSB */)) {
          a = a - 1;
          liner = 0;
          ltoke = lex.join(NIL);
          ltoke = ltoke.replace(SpaceEnd, NIL);
          push(record, { token: ltoke });
          break;
        }
        if (embed === false && lex.length > 0 && (is(b[a], 60 /* LAN */) && not(b[a + 1], 61 /* EQS */) && !/[\s\d]/.test(b[a + 1]) || is(b[a], 91 /* LSB */) && is(b[a + 1], 37 /* PER */) || is(b[a], 123 /* LCB */) && (jsx === true || is(b[a + 1], 123 /* LCB */) || is(b[a + 1], 37 /* PER */)))) {
          a = a - 1;
          ltoke = parse.scope.token === "comment" ? lex.join(NIL) : lex.join(NIL).replace(SpaceEnd, NIL);
          liner = 0;
          record.token = ltoke;
          if (rules2.wrap > 0 && rules2.markup.preserveText === false) {
            let wrapper2 = function() {
              if (is(ltoke[width], 32 /* WSP */)) {
                store.push(ltoke.slice(0, width));
                ltoke = ltoke.slice(width + 1);
                chars = ltoke.length;
                width = rules2.wrap;
                return;
              }
              do
                width = width - 1;
              while (width > 0 && not(ltoke[width], 32 /* WSP */));
              if (width > 0) {
                store.push(ltoke.slice(0, width));
                ltoke = ltoke.slice(width + 1);
                chars = ltoke.length;
                width = rules2.wrap;
              } else {
                width = rules2.wrap;
                do
                  width = width + 1;
                while (width < chars && not(ltoke[width], 32 /* WSP */));
                store.push(ltoke.slice(0, width));
                ltoke = ltoke.slice(width + 1);
                chars = ltoke.length;
                width = rules2.wrap;
              }
            };
            let width = rules2.wrap;
            let chars = ltoke.length;
            const store = [];
            if (data.token[data.begin[parse.count]] === "<a>" && data.token[data.begin[data.begin[parse.count]]] === "<li>" && data.lines[data.begin[parse.count]] === 0 && parse.linesSpace === 0 && ltoke.length < rules2.wrap) {
              push(record);
              break;
            }
            if (chars < rules2.wrap) {
              push(record);
              break;
            }
            if (parse.linesSpace < 1 && parse.count > -1) {
              let count = parse.count;
              do {
                width = width - data.token[count].length;
                if (data.types[count].indexOf("attribute") > -1)
                  width = width - 1;
                if (data.lines[count] > 0 && data.types[count].indexOf("attribute") < 0)
                  break;
                count = count - 1;
              } while (count > 0 && width > 0);
              if (width < 1)
                width = ltoke.indexOf(WSP);
            }
            ltoke = lex.join(NIL).replace(SpaceLead, NIL).replace(SpaceEnd, NIL).replace(/\s+/g, WSP);
            do
              wrapper2();
            while (width < chars);
            if (ltoke !== NIL && not(ltoke, 32 /* WSP */))
              store.push(ltoke);
            ltoke = rules2.crlf === true ? store.join("\r\n") : store.join("\n");
            ltoke = NIL + ltoke + NIL;
          } else {
            const nwl = ltoke.indexOf(NWL);
            if (nwl > -1) {
              push(record, { token: ltoke.slice(0, nwl) });
              ltoke = ltoke.slice(nwl);
              const m = ltoke.match(/^\n+/);
              if (m === null) {
                record.lines = 1;
              } else {
                record.lines = 2;
                ltoke = ltoke.replace(SpaceLead, NIL);
              }
            }
          }
          liner = 0;
          push(record, { token: ltoke });
          break;
        }
        lex.push(b[a]);
        a = a + 1;
      } while (a < c);
    }
    if (a > now && a < c) {
      if (ws(b[a])) {
        let x = a;
        parse.linesSpace = parse.linesSpace + 1;
        do {
          if (is(b[x], 10 /* NWL */))
            parse.lineNumber = parse.lineNumber + 1;
          x = x - 1;
        } while (x > now && ws(b[x]));
      } else {
        parse.linesSpace = 0;
      }
    } else if (a !== now || a === now && embed === false) {
      ltoke = lex.join(NIL).replace(SpaceEnd, NIL);
      liner = 0;
      if (record.token !== ltoke) {
        push(record, { token: ltoke });
        parse.linesSpace = 0;
      }
    }
    embed = false;
  }
  function parseSpace() {
    parse.linesSpace = 1;
    do {
      if (is(b[a], 10 /* NWL */)) {
        parse.lineStart = a;
        parse.linesSpace = parse.linesSpace + 1;
        parse.lineNumber = parse.lineNumber + 1;
      }
      if (ws(b[a + 1]) === false)
        break;
      a = a + 1;
    } while (a < c);
  }
  if (rules2.language === "html" || rules2.language === "liquid")
    html = "html";
  do {
    if (parse.error)
      return data;
    if (ws(b[a])) {
      parseSpace();
    } else if (is(b[a], 60 /* LAN */)) {
      parseToken(NIL);
    } else if (is(b[a], 123 /* LCB */) && (jsx || is(b[a + 1], 123 /* LCB */) || is(b[a + 1], 37 /* PER */))) {
      parseToken(NIL);
    } else if (is(b[a], 45 /* DSH */) && is(b[a + 1], 45 /* DSH */) && is(b[a + 2], 45 /* DSH */)) {
      parseToken("---");
    } else {
      parseContent();
    }
    a = a + 1;
  } while (a < c);
  return data;
};

// src/beautify/markup.ts
prettify.beautify.markup = function MarkupBeautify(rules2) {
  let a = prettify.start;
  let comstart = -1;
  let next = 0;
  let count = 0;
  let indent = isNaN(rules2.indentLevel) ? 0 : Number(rules2.indentLevel);
  const data = parse.data;
  const c = prettify.end < 1 || prettify.end > data.token.length ? data.token.length : prettify.end + 1;
  const extidx = {};
  const jsx = rules2.language === "jsx" || rules2.language === "tsx";
  const lf = rules2.crlf === true ? String.fromCharCode(13, 10) : String.fromCharCode(10);
  const attrs = rules2.markup.forceAttribute;
  const delim = /* @__PURE__ */ new Map();
  const level = prettify.start > 0 ? Array(prettify.start).fill(0, 0, prettify.start) : [];
  const levels = getLevels();
  const ind = spaces();
  const build = [];
  function isType(index, name) {
    return data.types[index] === name;
  }
  function isToken(index, tag) {
    return data.token[index] === tag;
  }
  function isIndex(index, name) {
    return index > -1 && (data.types[index] || NIL).indexOf(name);
  }
  function nl(tabs) {
    const linesout = [];
    const pres = rules2.preserveLine + 1;
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
    return linesout.join(NIL);
  }
  function ml() {
    let lines = data.token[a].split(lf);
    const line = data.lines[a + 1];
    if (isType(a, "comment") && (is(data.token[a][1], 37 /* PER */) && rules2.liquid.preserveComment === false || is(data.token[a][1], 37 /* PER */) === false && rules2.markup.preserveComment === false)) {
      lines = lines.map((l) => l.trimStart());
    }
    const lev = levels[a - 1] > -1 ? isType(a, "attribute") ? levels[a - 1] + 1 : levels[a - 1] : (() => {
      let bb = a - 1;
      let start = bb > -1 && isIndex(bb, "start") > -1;
      if (levels[a] > -1 && isType(a, "attribute"))
        return levels[a] + 1;
      do {
        bb = bb - 1;
        if (levels[bb] > -1)
          return isType(a, "content") && start === false ? levels[bb] : levels[bb] + 1;
        if (isIndex(bb, "start") > -1)
          start = true;
      } while (bb > 0);
      return bb === -2 ? 0 : 1;
    })();
    let aa = 0;
    data.lines[a + 1] = 0;
    const len = lines.length - 1;
    do {
      if (isType(a, "comment")) {
        if (aa === 0 && (is(data.token[a][1], 37 /* PER */) && rules2.liquid.commentNewline === true || is(data.token[a][1], 37 /* PER */) === false && rules2.markup.commentNewline === true)) {
          if (rules2.preserveLine === 0) {
            build.push(nl(lev));
          } else {
            if (build.length > 0 && build[build.length - 1].lastIndexOf(NWL) + 1 < 2) {
              build.push(nl(lev));
            }
          }
        }
        if (lines[aa] !== NIL) {
          if (aa > 0 && (is(data.token[a][1], 37 /* PER */) && rules2.liquid.commentIndent === true || is(data.token[a][1], 37 /* PER */) === false && rules2.markup.commentIndent === true)) {
            build.push(ind);
          }
          if (lines[aa + 1].trimStart() !== NIL) {
            build.push(lines[aa], nl(lev));
          } else {
            build.push(lines[aa], NWL);
          }
        } else {
          if (lines[aa + 1].trimStart() === NIL) {
            build.push(NWL);
          } else {
            build.push(nl(lev));
          }
        }
      } else {
        build.push(lines[aa]);
        build.push(nl(lev));
      }
      aa = aa + 1;
    } while (aa < len);
    data.lines[a + 1] = line;
    build.push(lines[len]);
    if (isType(a, "comment") && (isType(a + 1, "liquid_end") || isType(a - 1, "liquid_end"))) {
      build.push(nl(levels[a]));
    } else if (levels[a] === -10) {
      build.push(WSP);
    } else if (levels[a] > 1) {
      build.push(nl(levels[a]));
    } else if (levels[a] === 0 && a === 0 && isType(a, "comment")) {
      build.push(nl(levels[a]));
    } else if (isType(a, "comment") && levels[a] === 0 && (isType(a + 1, "liquid_start") || isType(a + 1, "ignore"))) {
      build.push(nl(levels[a]));
    }
  }
  function spaces() {
    const indc = [rules2.indentChar];
    const size2 = rules2.indentSize - 1;
    let aa = 0;
    if (aa < size2) {
      do {
        indc.push(rules2.indentChar);
        aa = aa + 1;
      } while (aa < size2);
    }
    return indc.join(NIL);
  }
  function forward() {
    let x = a + 1;
    let y = 0;
    if (isType(x, void 0))
      return x - 1;
    if (isType(x, "comment") || a < c - 1 && isIndex(x, "attribute") > -1) {
      do {
        if (isType(x, "jsx_attribute_start")) {
          y = x;
          do {
            if (isType(x, "jsx_attribute_end") && data.begin[x] === y)
              break;
            x = x + 1;
          } while (x < c);
        } else if (isType(x, "comment") === false && isIndex(x, "attribute") < 0)
          return x;
        x = x + 1;
      } while (x < c);
    }
    return x;
  }
  function onAttributeEnd() {
    const regend = /(?!=)\/?>$/;
    const parent = data.token[a];
    const end = regend.exec(parent);
    if (end === null)
      return;
    let y = a + 1;
    let isjsx = false;
    let space = rules2.markup.selfCloseSpace === true && end !== null && end[0] === "/>" ? WSP : NIL;
    data.token[a] = parent.replace(regend, NIL);
    do {
      if (isType(y, "jsx_attribute_end") && data.begin[data.begin[y]] === a) {
        isjsx = false;
      } else if (data.begin[y] === a) {
        if (isType(y, "jsx_attribute_start")) {
          isjsx = true;
        } else if (isIndex(y, "attribute") < 0 && isjsx === false) {
          break;
        }
      } else if (isjsx === false && (data.begin[y] < a || isIndex(y, "attribute") < 0)) {
        break;
      }
      y = y + 1;
    } while (y < c);
    if (isType(y - 1, "comment_attribute"))
      space = nl(levels[y - 2] - 1);
    if (!parse.attributes.has(a)) {
      data.token[y - 1] = `${data.token[y - 1]}${space}${end[0]}`;
    }
    if (isType(y, "comment") && data.lines[a + 1] < 2)
      levels[a] = -10;
  }
  function onDelimiterForce() {
    if (parse.attributes.has(a) && is(data.token[a], 60 /* LAN */) && not.last(data.token[a], 62 /* RAN */)) {
      delim.set(a, 2);
    } else if (isType(a, "end") === false && not(data.token[a], 60 /* LAN */) && delim.get(data.begin[a]) >= 2 && is.last(data.token[a], 62 /* RAN */)) {
      delim.delete(data.begin[a]);
      const newline = nl(levels[a - 1] - 1).replace(/\n+/, NWL);
      const replace = `${data.token[a].slice(0, -1)}${newline}>`;
      if (isType(data.begin[a], "singleton")) {
        if (is(data.token[a][data.token[a].length - 2], 47 /* FWS */)) {
          data.token[a] = `${data.token[a].slice(0, -2)}${newline}/>`;
        } else {
          data.token[a] = replace;
        }
      } else {
        data.token[a] = replace;
      }
    }
  }
  function onAnchorList() {
    const stop = data.begin[a];
    let aa = a;
    do {
      aa = aa - 1;
      if (isToken(aa, "</li>") && isToken(aa - 1, "</a>") && data.begin[data.begin[aa]] === stop && data.begin[aa - 1] === data.begin[aa] + 1) {
        aa = data.begin[aa];
      } else {
        return;
      }
    } while (aa > stop + 1);
    aa = a;
    do {
      aa = aa - 1;
      if (isType(aa + 1, "attribute")) {
        level[aa] = -10;
      } else if (isToken(aa, "</li>") === false) {
        level[aa] = -20;
      }
    } while (aa > stop + 1);
  }
  function onComment() {
    let x = a;
    let test = false;
    if (data.lines[a + 1] === 0 && rules2.markup.forceIndent === false) {
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
      if (isType(data.begin[x] - 1, "liquid")) {
        level[data.begin[x] - 1] = indent;
      }
      const ind2 = isType(next, "end") || isType(next, "liquid_end") ? indent + 1 : indent;
      do {
        level.push(ind2);
        x = x - 1;
      } while (x > comstart);
      if (ind2 === indent + 1)
        level[a] = indent;
      if (isType(x, "attribute") || isType(x, "liquid_attribute") || isType(x, "jsx_attribute_start")) {
        level[data.begin[x]] = ind2;
      } else {
        level[x] = ind2;
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
  function onContent() {
    let ind2 = indent;
    if (rules2.markup.forceIndent === true || rules2.markup.forceAttribute === true) {
      level.push(indent);
      return;
    }
    if (next < c && (isIndex(next, "end") > -1 || isIndex(next, "start") > -1) && data.lines[next] > 0) {
      level.push(indent);
      ind2 = ind2 + 1;
      if (a > 0 && isType(a, "singleton") && isIndex(a - 1, "attribute") > -1 && isType(data.begin[a - 1], "singleton")) {
        if (data.begin[a] < 0 || isType(data.begin[a - 1], "singleton") && data.begin[data.ender[a] - 1] !== a) {
          level[a - 1] = indent;
        } else {
          level[a - 1] = indent + 1;
        }
      }
    } else if (a > 0 && isType(a, "singleton") && isIndex(a - 1, "attribute") > -1) {
      level[a - 1] = indent;
      count = data.token[a].length;
      level.push(-10);
    } else if (data.lines[next] === 0) {
      level.push(-20);
    } else if ((rules2.wrap === 0 || a < c - 2 && data.token[a] !== void 0 && data.token[a + 1] !== void 0 && data.token[a + 2] !== void 0 && data.token[a].length + data.token[a + 1].length + data.token[a + 2].length + 1 > rules2.wrap && isIndex(a + 2, "attribute") > -1 || data.token[a] !== void 0 && data.token[a + 1] !== void 0 && data.token[a].length + data.token[a + 1].length > rules2.wrap) && (isType(a + 1, "singleton") || isType(a + 1, "liquid"))) {
      level.push(indent);
    } else {
      count = count + 1;
      level.push(-10);
    }
    if (a > 0 && isIndex(a - 1, "attribute") > -1 && data.lines[a] < 1) {
      level[a - 1] = -20;
    }
    if (count > rules2.wrap) {
      let d = a;
      let e = Math.max(data.begin[a], 0);
      if (isType(a, "content") && rules2.markup.preserveText === false) {
        let countx = 0;
        const chars = data.token[a].replace(/\s+/g, WSP).split(WSP);
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
          if (chars[d].length + countx > rules2.wrap) {
            chars[d] = lf + chars[d];
            countx = chars[d].length;
          } else {
            chars[d] = ` ${chars[d]}`;
            countx = countx + chars[d].length;
          }
          d = d + 1;
        } while (d < e);
        if (is(chars[0], 32 /* WSP */)) {
          data.token[a] = chars.join(NIL).slice(1);
        } else {
          level[a - 1] = ind2;
          data.token[a] = chars.join(NIL).replace(lf, NIL);
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
          if (isIndex(d, "start") > -1) {
            count = 0;
            return;
          }
          if (data.lines[d + 1] > 0 && (isType(d, "attribute") === false || isType(d, "attribute") && isType(d + 1, "attribute"))) {
            if (isType(d, "singleton") === false || isType(d, "attribute") && isType(d + 1, "attribute")) {
              count = data.token[a].length;
              if (data.lines[a + 1] > 0)
                count = count + 1;
              break;
            }
          }
        } while (d > e);
        level[d] = ind2;
      }
    }
  }
  function onEmbedded() {
    const skip = a;
    if (data.types[skip - 1] === "script_start" && is(data.token[skip - 1], 123 /* LCB */)) {
      level[skip - 1] = -20;
    }
    do {
      if (data.lexer[a + 1] === "markup" && data.begin[a + 1] < skip && isType(a + 1, "start") === false && isType(a + 1, "singleton") === false)
        break;
      level.push(0);
      a = a + 1;
    } while (a < c);
    extidx[skip] = a;
    if (data.types[a + 1] === "script_end" && data.token[a + 1] === "}") {
      level.push(-20);
    } else {
      if (data.types[a + 1] === "liquid_end") {
        console.log(data.types[a + 1]);
        level.push(indent);
      } else {
        level.push(indent - 1);
      }
    }
    next = forward();
    if (data.lexer[next] === "markup" && data.stack[a].indexOf("attribute") < 0 && (data.types[next] === "end" || data.types[next] === "liquid_end")) {
      indent = indent - 1;
    }
  }
  function onAttributeWrap(index) {
    const item = data.token[index].replace(/\s+/g, WSP).split(WSP);
    const size2 = item.length;
    let bb = 1;
    let acount = item[0].length;
    do {
      if (acount + item[bb].length > rules2.wrap) {
        acount = item[bb].length;
        item[bb] = lf + item[bb];
      } else {
        item[bb] = ` ${item[bb]}`;
        acount = acount + item[bb].length;
      }
      bb = bb + 1;
    } while (bb < size2);
    data.token[index] = item.join(NIL);
  }
  function onAttribute() {
    const parent = a - 1;
    let w = a;
    let plural = false;
    let attrstart = false;
    let attcount = data.types.indexOf("end", parent + 1);
    let len = data.token[parent].length + 1;
    let lev = (() => {
      if (isIndex(a, "start") > 0) {
        let x = a;
        do {
          if (isType(x, "end") && data.begin[x] === a) {
            if (x < c - 1 && isIndex(x + 1, "attribute") > -1) {
              plural = true;
              break;
            }
          }
          x = x + 1;
        } while (x < c);
      } else if (a < c - 1 && isIndex(a + 1, "attribute") > -1) {
        plural = true;
      }
      if (isType(next, "end") || isType(next, "liquid_end")) {
        return indent + (isType(parent, "singleton") ? 2 : 1);
      }
      if (isType(parent, "singleton"))
        return indent + 1;
      return indent;
    })();
    if (plural === false && isType(a, "comment_attribute")) {
      level.push(indent);
      level[parent] = data.types[parent] === "singleton" ? indent + 1 : indent;
      return;
    }
    if (lev < 1)
      lev = 1;
    attcount = 0;
    do
      attcount = attcount + 1;
    while (isIndex(a + attcount, "attribute") > -1 && (isType(a + attcount, "end") === false || isType(a + attcount, "singleton") === false || isType(a + attcount, "start") === false || isType(a + attcount, "comment") === false));
    do {
      count = count + data.token[a].length + 1;
      if (data.types[a].indexOf("attribute") > 0) {
        if (isType(a, "comment_attribute")) {
          level.push(lev);
        } else if (isIndex(a, "start") > 0 && isIndex(a, "liquid") < 0) {
          attrstart = true;
          if (a < c - 2 && data.types[a + 2].indexOf("attribute") > 0) {
            level.push(-20);
            a = a + 1;
            extidx[a] = a;
          } else {
            if (parent === a - 1 && plural === false) {
              if (jsx) {
                level.push(-20);
              } else {
                level.push(lev);
              }
            } else {
              if (jsx) {
                level.push(-20);
              } else {
                level.push(lev + 1);
              }
            }
            if (data.lexer[a + 1] !== "markup") {
              a = a + 1;
              onEmbedded();
            }
          }
        } else if (isIndex(a, "end") > 0) {
          if (level[a - 1] !== -20)
            level[a - 1] = level[data.begin[a]] - 1;
          if (data.lexer[a + 1] !== "markup") {
            level.push(-20);
          } else {
            level.push(lev);
          }
        } else {
          level.push(lev);
        }
      } else if (isType(a, "attribute")) {
        len = len + data.token[a].length + 1;
        if (rules2.markup.preserveAttributes === true) {
          level.push(-10);
        } else if (rules2.markup.forceAttribute === true || rules2.markup.forceAttribute >= 1 || attrstart === true || a < c - 1 && isIndex(a + 1, "attribute") > 0) {
          if (rules2.markup.forceAttribute === false && data.lines[a] === 1) {
            level.push(-10);
          } else {
            if (rules2.markup.forceAttribute === true) {
              level.push(lev);
            } else {
              level.push(-10);
            }
          }
        } else {
          level.push(-10);
        }
      } else if (data.begin[a] < parent + 1) {
        break;
      }
      a = a + 1;
    } while (a < c);
    a = a - 1;
    if (isIndex(a, "liquid") < 0 && isIndex(a, "end") > 0 && isIndex(a, "attribute") > 0 && isType(parent, "singleton") === false && level[a - 1] > 0 && plural === true) {
      level[a - 1] = level[a - 1] - 1;
    }
    if (level[a] !== -20) {
      if (jsx === true && isIndex(parent, "start") > -1 && isType(a + 1, "script_start")) {
        level[a] = lev;
      } else {
        if (isToken(a, "/") && level[a - 1] !== 10) {
          level[a - 1] = -10;
        } else {
          level[a] = level[parent];
        }
      }
    }
    if (rules2.markup.forceAttribute === true) {
      count = 0;
      level[parent] = lev;
      if (attcount >= 2 && rules2.markup.delimiterForce === true) {
        delim.set(parent, attcount);
      }
    } else if (rules2.markup.forceAttribute >= 1) {
      if (attcount >= rules2.markup.forceAttribute) {
        level[parent] = lev;
        let fa = a - 1;
        do {
          if (isType(fa, "liquid") && level[fa] === -10) {
            level[fa] = lev;
          } else if (isType(fa, "attribute") && level[fa] === -10) {
            level[fa] = lev;
          }
          fa = fa - 1;
        } while (fa > parent);
        if (rules2.markup.delimiterForce === true && attcount >= 2) {
          delim.set(parent, attcount);
        }
      } else {
        level[parent] = -10;
      }
    } else {
      level[parent] = -10;
    }
    if (rules2.markup.preserveAttributes === true || isToken(parent, "<%xml%>") || isToken(parent, "<?xml?>")) {
      count = 0;
      return;
    }
    w = a;
    if (w > parent + 1) {
      if (rules2.markup.selfCloseSpace === false)
        len = len - 1;
      if (len > rules2.wrap && rules2.wrap > 0 && rules2.markup.forceAttribute === false) {
        if (rules2.markup.forceLeadAttribute === true) {
          level[parent] = lev;
          w = w - 1;
        }
        count = data.token[a].length;
        do {
          if (data.token[w].length > rules2.wrap && ws(data.token[w]))
            onAttributeWrap(w);
          if (isIndex(w, "liquid") > -1 && level[w] === -10) {
            level[w] = lev;
          } else if (isType(w, "attribute") && level[w] === -10) {
            level[w] = lev;
          }
          w = w - 1;
        } while (w > parent);
      }
    } else if (rules2.wrap > 0 && isType(a, "attribute") && data.token[a].length > rules2.wrap && ws(data.token[a])) {
      onAttributeWrap(a);
    }
  }
  function onLiquidTag(indent2, token) {
    let idx = 1;
    let name = NIL;
    let toke = NIL;
    let ind2 = indent2;
    do {
      toke = token[idx].trimStart();
      if (idx === token.length - 1) {
        token[idx] = indent2.slice(2) + toke;
        break;
      }
      if (toke.indexOf(WSP) > -1) {
        name = toke.slice(0, toke.indexOf(WSP));
      } else {
        name = toke.trimEnd();
      }
      if (grammar.liquid.tags.has(name)) {
        token[idx] = ind2 + toke;
        ind2 += repeatChar(rules2.indentSize);
      } else if (grammar.liquid.else.has(name)) {
        token[idx] = ind2.slice(rules2.indentSize) + toke;
      } else if (toke.startsWith("end")) {
        ind2 = ind2.slice(rules2.indentSize);
        token[idx] = ind2 + toke;
      } else {
        token[idx] = ind2 + toke;
      }
      idx = idx + 1;
    } while (idx < token.length);
    data.token[a] = token.join(NWL);
  }
  function onLineBreak() {
    const token = data.token[a].split(NWL);
    const trims = is(data.token[a][2], 45 /* DSH */);
    let offset = 0;
    let idx = 0;
    let nls = 0;
    let tok = NIL;
    let chr = NIL;
    if (level.length >= 2) {
      offset = level[level.length - 2] + 1;
    } else if (level.length === 1) {
      offset = level[level.length - 1] + 1;
    }
    let ind2 = trims ? repeatChar(offset * rules2.indentSize) : repeatChar(offset * rules2.indentSize - 1);
    if (getTagName(data.token[a]) === "liquid")
      return onLiquidTag(ind2, token);
    do {
      if (idx === 0) {
        tok = token[idx].trimEnd();
        if (tok.endsWith(",")) {
          chr = "," + WSP;
          token[idx] = tok.slice(0, -1);
        } else if (tok.endsWith("|")) {
          chr = "|" + WSP;
          token[idx] = tok.slice(0, -1);
        } else if (/^{[{%]-?$/.test(tok)) {
          token[idx] = tok;
          idx = idx + 1;
          do {
            tok = token[idx].trim();
            if (tok.length > 0)
              break;
            token.splice(idx, 1);
            if (idx > token.length)
              break;
          } while (idx < token.length);
          const close = token[token.length - 1].trim();
          if (/^-?[%}]}$/.test(close)) {
            nls = 1;
            if (trims) {
              token[idx] = ind2 + tok;
              token[token.length - 1] = ind2.slice(2) + close;
              ind2 = ind2.slice(2) + repeatChar(rules2.indentSize);
            } else {
              token[idx] = ind2 + repeatChar(rules2.indentSize) + tok;
              token[token.length - 1] = ind2.slice(1) + close;
              ind2 = ind2 + repeatChar(rules2.indentSize);
            }
          } else {
            token[idx] = ind2 + repeatChar(rules2.indentSize) + tok;
          }
        } else if (tok.endsWith(",") === false && is(token[idx + 1].trimStart(), 44 /* COM */) && rules2.liquid.lineBreakSeparator === "after") {
          token[idx] = tok + ",";
        }
        idx = idx + 1;
        continue;
      }
      tok = token[idx].trim();
      if (is(tok, 44 /* COM */) && rules2.liquid.lineBreakSeparator === "after") {
        if (tok.endsWith("%}")) {
          tok = WSP + tok.slice(1);
        } else {
          tok = WSP + tok.slice(1) + ",";
        }
      }
      if (tok.length === 0) {
        token.splice(idx, 1);
        continue;
      }
      if (idx === token.length - 1 && nls === 1)
        break;
      if (tok.endsWith(",") && rules2.liquid.lineBreakSeparator === "before") {
        token[idx] = ind2 + chr + tok.slice(0, -1);
        chr = "," + WSP;
      } else if (tok.endsWith("|")) {
        token[idx] = ind2 + chr + tok.slice(0, -1);
        chr = ind2 + "|" + WSP;
      } else {
        token[idx] = ind2 + chr + tok;
        chr = NIL;
      }
      idx = idx + 1;
    } while (idx < token.length);
    if (rules2.liquid.normalizeSpacing === true) {
      data.token[a] = token.join(NWL).replace(/\s*-?[%}]}$/, (m) => m.replace(/\s*/, WSP));
    } else {
      const space = repeatChar(data.lines[a] - 1 === -1 ? rules2.indentSize : data.lines[a] - 1);
      data.token[a] = token.join(NWL).replace(/\s*-?[%}]}$/, (m) => m.replace(StripEnd, space));
    }
  }
  function isLineBreak(idx) {
    return isType(idx, "liquid") && data.token[idx].indexOf(lf) > 0;
  }
  function onContainedControls(last) {
    if (isType(a - 1, "liquid_start") && isType(a, "start") && isType(a + 1, "liquid_end")) ; else if (isType(a, "liquid_start") && isType(a + 1, "end") && isType(data.ender[a + 1] + 1, "liquid_end")) ;
  }
  function getLevels() {
    do {
      if (data.lexer[a] === "markup") {
        if (isType(a, "doctype"))
          level[a - 1] = indent;
        if (isIndex(a, "attribute") > -1) {
          if (parse.attributes.has(data.begin[a]) && attrs !== true) {
            rules2.markup.forceAttribute = true;
          } else if (attrs !== rules2.markup.forceAttribute) {
            rules2.markup.forceAttribute = attrs;
          }
          onAttribute();
        } else if (isType(a, "comment")) {
          if (comstart < 0)
            comstart = a;
          if (isType(a + 1, "comment") === false || a > 0 && isIndex(a - 1, "end") > -1) {
            onComment();
          }
        } else if (isType(a, "comment") === false) {
          next = forward();
          if (isType(next, "end") || isType(next, "liquid_end")) {
            indent = indent - 1;
            if (isType(next, "liquid_end") && isType(data.begin[next] + 1, "liquid_else")) {
              indent = indent - 1;
            }
            if (isToken(a, "</ol>") || isToken(a, "</ul>") || isToken(a, "</dl>")) {
              onAnchorList();
            }
          }
          if (isType(a, "script_end") && isType(next, "end")) {
            if (data.lines[next] < 1) {
              level.push(-20);
            } else if (data.lines[next] > 1) {
              level.push(indent);
            } else {
              level.push(-10);
            }
          } else if ((rules2.markup.forceIndent === false || rules2.markup.forceIndent === true && isType(next, "script_start")) && (isType(a, "content") || isType(a, "singleton") || isType(a, "liquid"))) {
            count = count + data.token[a].length;
            if (data.lines[next] > 0 && isType(next, "script_start")) {
              level.push(-10);
            } else if (rules2.wrap > 0 && (isIndex(a, "liquid") < 0 || next < c && isIndex(a, "liquid") > -1 && isIndex(next, "liquid") < 0)) {
              onContent();
            } else if (next < c && (isIndex(next, "end") > -1 || isIndex(next, "start") > -1) && (data.lines[next] > 0 || isIndex(a, "liquid_") > -1)) {
              level.push(indent);
              if (isLineBreak(a))
                onLineBreak();
            } else if (data.lines[next] === 0) {
              level.push(-20);
              if (isLineBreak(a))
                onLineBreak();
            } else if (data.lines[next] === 1) {
              level.push(-10);
            } else {
              level.push(indent);
              if (isLineBreak(a))
                onLineBreak();
            }
          } else if (isType(a, "start") || isType(a, "liquid_start")) {
            indent = indent + 1;
            if (isType(a, "liquid_start") && isType(next, "liquid_else")) {
              indent = indent + 1;
            }
            if (jsx === true && isToken(a + 1, "{")) {
              if (data.lines[next] === 0) {
                level.push(-20);
              } else if (data.lines[next] > 1) {
                level.push(indent);
              } else {
                level.push(-10);
              }
            } else if (isType(a, "start") && isType(next, "end") || isType(a, "liquid_start") && isType(next, "liquid_end")) {
              level.push(-20);
            } else if (isType(a, "start") && isType(next, "script_start")) {
              level.push(-10);
            } else if (rules2.markup.forceIndent === true) {
              level.push(indent);
            } else if (data.lines[next] === 0 && (isType(next, "content") || isType(next, "singleton") || isType(a, "start") && isType(next, "liquid"))) {
              level.push(-20);
            } else {
              level.push(indent);
            }
          } else if (rules2.markup.forceIndent === false && data.lines[next] === 0 && (isType(next, "content") || isType(next, "singleton"))) {
            level.push(-20);
          } else if (isType(a + 2, "script_end")) {
            level.push(-20);
          } else if (isType(a, "liquid_else")) {
            level[a - 1] = indent - 1;
            if (isType(next, "liquid_end")) {
              level[a - 1] = indent - 1;
            }
            level.push(indent);
          } else if (rules2.markup.forceIndent === true && (isType(a, "content") && (isType(next, "liquid") || isType(next, "content")) || isType(a, "liquid") && (isType(next, "content") || isType(next, "liquid")))) {
            if (data.lines[next] < 1) {
              level.push(-20);
            } else if (data.lines[next] > 1) {
              level.push(indent);
            } else {
              level.push(-10);
            }
          } else {
            level.push(indent);
          }
        }
        if (isType(a, "content") === false && isType(a, "singleton") === false && isType(a, "liquid") === false && isType(a, "attribute") === false) {
          count = 0;
        }
      } else {
        count = 0;
        onEmbedded();
      }
      a = a + 1;
    } while (a < c);
    return level;
  }
  function beautify() {
    a = prettify.start;
    let lastLevel = rules2.indentLevel;
    do {
      if (data.lexer[a] === "markup") {
        if ((isType(a, "start") || isType(a, "singleton") || isType(a, "xml")) && isIndex(a, "attribute") < 0 && a < c - 1 && data.types[a + 1] !== void 0 && isIndex(a + 1, "attribute") > -1) {
          onAttributeEnd();
        }
        if (isToken(a, void 0) === false && data.token[a].indexOf(lf) > 0 && (isType(a, "content") && rules2.markup.preserveText === false || isType(a, "comment") || isType(a, "attribute"))) {
          ml();
        } else if (isType(a, "comment") && (is(data.token[a][1], 37 /* PER */) && rules2.liquid.preserveComment === false && rules2.liquid.commentNewline === true || is(data.token[a][1], 37 /* PER */) === false && rules2.markup.preserveComment === false && rules2.markup.commentNewline === true) && (rules2.preserveLine === 0 || build.length > 0 && build[build.length - 1].lastIndexOf(NWL) + 1 < 2)) {
          build.push(
            nl(levels[a]),
            data.token[a],
            nl(levels[a])
          );
        } else {
          if (rules2.markup.delimiterForce === true)
            onDelimiterForce();
          onContainedControls();
          build.push(data.token[a]);
          if (levels[a] === -10 && a < c - 1) {
            build.push(WSP);
          } else if (levels[a] > -1) {
            lastLevel = levels[a];
            build.push(nl(levels[a]));
          }
        }
      } else {
        prettify.start = a;
        prettify.end = extidx[a];
        console.log(prettify);
        const external = parse.beautify(lastLevel);
        console.log(external);
        if (rules2.language === "jsx" && (data.types[a - 1] === "liquid_string_end" || data.types[a - 1] === "jsx_attribute_start" || data.types[a - 1] === "script_start")) {
          build.push(external.beautify);
        } else {
          build.push(external.beautify);
          if (rules2.markup.forceIndent === true || levels[prettify.iterator] > -1 && a in extidx && extidx[a] > a) {
            build.push(nl(levels[prettify.iterator]));
          }
        }
        a = prettify.iterator;
        external.reset();
      }
      a = a + 1;
    } while (a < c);
    prettify.iterator = c - 1;
    if (build[0] === lf || is(build[0], 32 /* WSP */))
      build[0] = NIL;
    return build.join(NIL);
  }
  return beautify();
};

// src/beautify/style.ts
prettify.beautify.style = function StyleBeautify(rules2) {
  const build = [];
  const data = prettify.data;
  const lf = rules2.crlf === true ? "\r\n" : "\n";
  const len = prettify.end > 0 ? prettify.end + 1 : data.token.length;
  const pres = rules2.preserveLine + 1;
  const tab = (() => {
    let aa = 0;
    const bb = [];
    do {
      bb.push(rules2.indentChar);
      aa = aa + 1;
    } while (aa < rules2.indentSize);
    return bb.join(NIL);
  })();
  let indent = rules2.indentLevel;
  let a = prettify.start;
  let when = [NIL, NIL];
  function isType(index, name) {
    return data.types[index] === name;
  }
  function newline(tabs) {
    const linesout = [];
    const total = (() => {
      if (a === len - 1)
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
    build.push(linesout.join(NIL));
  }
  do {
    if (isType(a + 1, "end") || isType(a + 1, "liquid_end") || isType(a + 1, "liquid_else")) {
      indent = indent - 1;
    }
    if (isType(a, "liquid") && data.lines[a] > 0) {
      build.push(data.token[a]);
      if (not(data.token[a + 1], 59 /* SEM */) && grammar.css.units.has(data.token[a + 1]) === false) {
        newline(indent);
      }
    } else if (isType(a - 1, "selector") && isType(a, "liquid") && isType(a + 1, "selector")) {
      build.push(data.token[a]);
      if (is.last(data.token[a - 1], 45 /* DSH */) && (is(data.token[a + 1], 46 /* DOT */) || is(data.token[a + 1], 35 /* HSH */) || is(data.token[a + 1], 38 /* AND */))) {
        build.push(WSP);
      }
    } else if (isType(a, "liquid_else")) {
      build.push(data.token[a]);
      indent = indent + 1;
      newline(indent);
    } else if (isType(a, "start") || isType(a, "liquid_start")) {
      indent = indent + 1;
      build.push(data.token[a]);
      if (isType(a + 1, "end") === false && isType(a + 1, "liquid_end") === false) {
        newline(indent);
      }
    } else if (is(data.token[a], 59 /* SEM */) || (isType(a, "end") || isType(a, "liquid_end") || isType(a, "comment"))) {
      build.push(data.token[a]);
      if (isType(a + 1, "value")) {
        if (data.lines[a + 1] === 1) {
          build.push(WSP);
        } else if (data.lines[a + 1] > 1) {
          newline(indent);
        }
      } else if (isType(a + 1, "separator") === false) {
        if (isType(a + 1, "comment") === false || isType(a + 1, "comment") && data.lines[a + 1] > 1) {
          newline(indent);
        } else {
          build.push(WSP);
        }
      }
    } else if (is(data.token[a], 58 /* COL */)) {
      build.push(data.token[a]);
      if (isType(a + 1, "selector") === false && not(data.token[a + 1], 44 /* COM */)) {
        build.push(WSP);
      }
    } else if (isType(a, "selector") || isType(a, "at_rule")) {
      if (rules2.style.classPadding === true && isType(a - 1, "end") && data.lines[a] < 3) {
        build.push(lf);
      }
      if (data.token[a].indexOf("and(") > 0) {
        data.token[a] = data.token[a].replace(/and\(/, "and (");
        build.push(data.token[a]);
      } else if (data.token[a].indexOf("when(") > 0) {
        when = data.token[a].split("when(");
        build.push(when[0].replace(/\s+$/, NIL));
        newline(indent + 1);
        build.push(`when (${when[1]}`);
      } else {
        build.push(data.token[a]);
      }
      if (isType(a + 1, "start")) {
        build.push(WSP);
      }
    } else if (is(data.token[a], 44 /* COM */)) {
      if (isType(a + 1, "value")) {
        newline(indent);
        build.push(data.token[a]);
      } else {
        build.push(data.token[a]);
      }
      if (isType(a + 1, "selector") || isType(a + 1, "property")) {
        newline(indent);
      } else {
        build.push(WSP);
      }
    } else if (data.stack[a] === "map" && is(data.token[a + 1], 41 /* RPR */) && a - data.begin[a] > 5) {
      build.push(data.token[a]);
      newline(indent);
    } else if (data.token[a] === "x;") {
      newline(indent);
    } else if ((isType(a, "variable") || isType(a, "function")) && rules2.style.classPadding === true && isType(a - 1, "end") && data.lines[a] < 3) {
      build.push(lf);
      build.push(data.token[a]);
    } else if (not(data.token[a], 59 /* SEM */)) {
      build.push(data.token[a]);
    }
    a = a + 1;
  } while (a < len);
  prettify.iterator = len - 1;
  return build.join(NIL);
};

// src/beautify/script.ts
prettify.beautify.script = function ScriptBeautify(rules2) {
  const externalIndex = {};
  const data = prettify.data;
  const lexer = "script";
  const b = prettify.end < 1 || prettify.end > data.token.length ? data.token.length : prettify.end + 1;
  const levels = (() => {
    let a = prettify.start;
    let indent = isNaN(rules2.indentLevel) ? 0 : Number(rules2.indentLevel);
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
      const ind = rules2.script.commentIndent === true ? indent : 0;
      if (notcomment === false && /\/\u002a\s*global\s/.test(data.token[a])) {
        const globallist = data.token[a].replace(/\/\u002a\s*global\s+/, "").replace(/\s*\u002a\/$/, "").split(",");
        let aa = globallist.length;
        do {
          aa = aa - 1;
          globallist[aa] = globallist[aa].replace(/\s+/g, "");
          if (globallist[aa] !== "")
            parse.scopes.push([globallist[aa], -1]);
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
          let bb = parse.scopes.length;
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
              if (parse.scopes[bb][1] === aa) {
                parse.scopes[bb][1] = a;
              } else if (parse.scopes[bb][1] < a) {
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
          if (rules2.script.commentIndent === true && level[a] > -1 && data.lines[a] < 3) {
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
      if (rules2.script.commentNewline === true && ctoke.startsWith("//") === false && data.lines[a] >= 3) {
        data.lines[a] = 2;
      }
    }
    function destructfix(listFix, override) {
      let c = a - 1;
      let d = listFix === true ? 0 : 1;
      const ei = extraindent[extraindent.length - 1] === void 0 ? [] : extraindent[extraindent.length - 1];
      const arrayCheck = override === false && data.stack[a] === "array" && listFix === true && ctoke !== "[";
      if (destruct[destruct.length - 1] === false || data.stack[a] === "array" && rules2.script.arrayFormat === "inline" || data.stack[a] === "object" && rules2.script.objectIndent === "inline") {
        return;
      }
      destruct[destruct.length - 1] = false;
      do {
        if (data.types[c] === "end") {
          d = d + 1;
        } else if (data.types[c] === "start") {
          d = d - 1;
        }
        if (data.stack[c] === "global")
          break;
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
        let markup2 = false;
        const begin = data.begin[aa];
        do {
          aa = aa - 1;
          if (data.lexer[aa] === "markup") {
            markup2 = true;
            break;
          }
          if (data.begin[aa] !== begin)
            aa = data.begin[aa];
        } while (aa > begin);
        if (markup2 === true) {
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
        if (ctoke === "}" && data.stack[a] === "switch" && rules2.script.noCaseIndent === false) {
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
      if (rules2.script.bracePadding === false && ctoke !== "}" && ltype !== "markup") {
        level[a - 1] = -20;
      }
      if (rules2.script.bracePadding === true && ltype !== "start" && ltoke !== ";" && (level[data.begin[a]] < -9 || destruct[destruct.length - 1] === true)) {
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
        if (countx > 0 && (rules2.language !== "jsx" || rules2.language === "jsx" && data.token[data.begin[a] - 1] !== "render")) {
          const wrap = rules2.wrap;
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
          const wrap = rules2.wrap;
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
        } else if (rules2.language === "jsx") {
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
        if (rules2.language === "jsx") {
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
        if (list[list.length - 1] === true && destruct[destruct.length - 1] === false && rules2.script.arrayFormat !== "inline" || ltoke === "]" && level[a - 2] === indent + 1) {
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
        } else if (rules2.language === "jsx") {
          markuplist();
        }
        if (rules2.script.arrayFormat === "inline") {
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
    function markup() {
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
        if (rules2.wrap < 1) {
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
          if (line > rules2.wrap - 1)
            break;
          if (level[c] > -9)
            break;
          if (data.types[c] === "operator" && data.token[c] !== "=" && data.token[c] !== "+" && data.begin[c] === data.begin[a]) {
            break;
          }
          line = line + data.token[c].length;
          if (c === data.begin[a] && data.token[c] === "[" && line < rules2.wrap - 1) {
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
        if (line > rules2.wrap - 1 && level[c] < -9) {
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
        if (line + next < rules2.wrap) {
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
          line = line - rules2.indentSize * rules2.indentChar.length * 2;
        }
        if (meth > 0) {
          c = rules2.wrap - meth;
        } else {
          c = rules2.wrap - line;
        }
        if (c > 0 && c < 5) {
          level.push(ind);
          if (data.token[a].charAt(0) === '"' || data.token[a].charAt(0) === "'") {
            a = a + 1;
            level.push(-10);
          }
          return;
        }
        if (data.token[data.begin[a]] !== "(" || meth > rules2.wrap - 1 || meth === 0) {
          if (meth > 0)
            line = meth;
          if (line - aa.length < rules2.wrap - 1 && (aa.charAt(0) === '"' || aa.charAt(0) === "'")) {
            a = a + 1;
            line = line + 3;
            if (line - aa.length > rules2.wrap - 4) {
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
        if (rules2.script.ternaryLine === true) {
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
                if (rules2.script.ternaryLine === true)
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
          if (rules2.script.caseSpace === true) {
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
        if (rules2.wrap < 1 || data.token[data.begin[a]] === "x(") {
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
          parse.scopes.push([data.token[a], -1]);
        } else {
          if (data.stack[func + 1] !== "function") {
            do {
              func = data.begin[func];
            } while (func > -1 && data.stack[func + 1] !== "function");
          }
          parse.scopes.push([data.token[a], func]);
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
        parse.scopes.push([data.token[a], a]);
      } else if (ltoke === "let" || ltoke === "const") {
        parse.scopes.push([data.token[a], a]);
      } else if (data.stack[a] === "arguments") {
        parse.scopes.push([data.token[a], a]);
      } else if (ltoke === ",") {
        let index = a;
        do {
          index = index - 1;
        } while (index > data.begin[a] && data.token[index] !== "var" && data.token[index] !== "let" && data.token[index] !== "const");
        if (data.token[index] === "var") {
          hoist();
        } else if (data.token[index] === "let" || data.token[index] === "const") {
          parse.scopes.push([data.token[a], a]);
        }
      }
      level.push(-10);
    }
    function separator() {
      const ei = extraindent[extraindent.length - 1] === void 0 ? [] : extraindent[extraindent.length - 1];
      const propertybreak = () => {
        if (rules2.script.methodChain > 0) {
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
          if (z.length < rules2.script.methodChain) {
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
        if (rules2.script.methodChain === 0) {
          level[a - 1] = -20;
        } else if (rules2.script.methodChain < 0) {
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
        if (data.stack[a] === "array" && rules2.script.arrayFormat === "indent") {
          level[a - 1] = -20;
          level.push(indent);
          return;
        }
        if (data.stack[a] === "array" && rules2.script.arrayFormat === "inline") {
          level[a - 1] = -20;
          level.push(-10);
          return;
        }
        if (data.stack[a] === "object" && rules2.script.objectIndent === "indent") {
          level[a - 1] = -20;
          level.push(indent);
          return;
        }
        if (data.stack[a] === "object" && rules2.script.objectIndent === "inline") {
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
        if ((data.token[data.begin[a]] === "(" || data.token[data.begin[a]] === "x(") && rules2.language !== "jsx" && data.stack[a] !== "global" && (data.types[a - 1] !== "string" && data.types[a - 1] !== "number" || data.token[a - 2] !== "+" || data.types[a - 1] === "string" && data.types[a - 1] !== "number" && data.token[a - 2] === "+" && data.types[a - 3] !== "string" && data.types[a - 3] !== "number")) {
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
      if (rules2.script.neverFlatten === true || deep === "array" && rules2.script.arrayFormat === "indent" || deep === "attribute" || ltype === "generic" || deep === "class" && ltoke !== "(" && ltoke !== "x(" || ctoke === "[" && data.token[a + 1] === "function") {
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
          } else if (rules2.script.braceAllman === true && ltype !== "operator" && ltoke !== "return") {
            level[a - 1] = indent - 1;
          } else if (data.stack[a + 1] !== "block" && (deep === "function" || ltoke === ")" || ltoke === "x)" || ltoke === "," || ltoke === "}" || ltype === "markup")) {
            level[a - 1] = -10;
          } else if (ltoke === "{" || ltoke === "x{" || ltoke === "[" || ltoke === "}" || ltoke === "x}") {
            level[a - 1] = indent - 1;
          }
        }
        if (deep === "object") {
          if (rules2.script.objectIndent === "indent") {
            destruct[destruct.length - 1] = false;
            level.push(indent);
            return;
          }
          if (rules2.script.objectIndent === "inline") {
            destruct[destruct.length - 1] = true;
            level.push(-20);
            return;
          }
        }
        if (deep === "switch") {
          if (rules2.script.noCaseIndent === true) {
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
        if (rules2.wrap > 0 && ctoke === "(" && data.token[a + 1] !== ")") {
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
          if (ltoke === "import" || ltoke === "in" || rules2.script.functionNameSpace === true) {
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
        if (ltoke === "-" && (a < 2 || data.token[a - 2] !== ")" && data.token[a - 2] !== "x)" && data.token[a - 2] !== "]" && data.types[a - 2] !== "reference" && data.types[a - 2] !== "string" && data.types[a - 2] !== "number") || rules2.script.functionSpace === false && ltoke === "function") {
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
        if (rules2.script.arrayFormat === "indent") {
          destruct[destruct.length - 1] = false;
          level.push(indent);
          return;
        }
        if (rules2.script.arrayFormat === "inline") {
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
      } else if (ltype !== "template" && data.types[a + 1] !== "template") {
        level.push(-10);
      }
      if ((ltoke === "," || ltype === "start") && (data.stack[a] === "object" || data.stack[a] === "array") && destruct[destruct.length - 1] === false && a > 0) {
        level[a - 1] = indent;
      }
    }
    function template() {
      if (rules2.language !== "json" && data.types[a - 1] !== "string") {
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
        if (rules2.script.bracePadding === true) {
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
        if (rules2.script.braceAllman === true || rules2.script.elseNewline === true) {
          level[a - 1] = indent;
        }
      }
      if (ctoke === "new" && grammar.js.keywords.has(data.token[a + 1]))
        ;
      if (ctoke === "from" && ltype === "end" && a > 0 && (data.token[data.begin[a - 1] - 1] === "import" || data.token[data.begin[a - 1] - 1] === ",")) {
        level[a - 1] = -10;
      }
      if (ctoke === "function") {
        if (rules2.script.functionSpace === false && a < b - 1 && (data.token[a + 1] === "(" || data.token[a + 1] === "x(")) {
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
      } else if (ctoke === "in" || (ctoke === "else" && rules2.script.elseNewline === false && rules2.script.braceAllman === false || ctoke === "catch") && (ltoke === "}" || ltoke === "x}")) {
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
      if (rules2.script.bracePadding === false && a < b - 1 && data.token[a + 1].charAt(0) === "}") {
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
          markup();
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
            count[count.length - 1] = rules2.wrap + 1;
          } else if (level[a] > -1 || data.token[a].charAt(0) === "`" && data.token[a].indexOf(NWL) > 0) {
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
      const ch = rules2.indentChar;
      let index = rules2.indentSize;
      if (typeof index !== "number" || index < 1)
        return "";
      do {
        tabby.push(ch);
        index = index - 1;
      } while (index > 0);
      return tabby.join("");
    })();
    const lf = rules2.crlf === true ? "\r\n" : NWL;
    const pres = rules2.preserveLine + 1;
    const invisibles = ["x;", "x}", "x{", "x(", "x)"];
    let a = prettify.start;
    let external = "";
    let lastLevel = rules2.indentLevel;
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
      return linesout.join(NIL);
    }
    if (rules2.script.vertical === true) {
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
                    complex = complex + rules2.indentSize * rules2.indentChar.length;
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
                    complex = complex + rules2.indentSize * rules2.indentChar.length;
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
                data.token[list[aa][0]] = data.token[list[aa][0]] + WSP;
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
        if (data.types[a] === "comment" && rules2.script.commentIndent === true) {
          if (/\n/.test(data.token[a])) {
            const space = data.begin[a] > -1 ? data.token[a].charAt(2) === "*" ? repeatChar(levels[a], tab) + rules2.indentChar : repeatChar(levels[a], tab) : rules2.indentChar;
            const comm = data.token[a].split(/\n/);
            let i = 1;
            do {
              comm[i] = space + comm[i].trimStart();
              i = i + 1;
            } while (i < comm.length);
            data.token.splice(a, 1, comm.join(NWL));
          }
        }
        if (invisibles.indexOf(data.token[a]) < 0) {
          if (data.token[a] !== ";" || rules2.script.noSemicolon === false) {
            build.push(data.token[a]);
          } else if (levels[a] < 0 && data.types[a + 1] !== "comment") {
            build.push(";");
          }
        }
        if (a < b - 1 && data.lexer[a + 1] !== lexer && data.begin[a] === data.begin[a + 1] && data.types[a + 1].indexOf("end") < 0 && data.token[a] !== ",") {
          build.push(WSP);
        } else if (levels[a] > -1) {
          if ((levels[a] > -1 && data.token[a] === "{" || levels[a] > -1 && data.token[a + 1] === "}") && data.lines[a] < 3 && rules2.script.braceNewline === true) {
            if (data.lines[a + 1] < 3)
              build.push(nl(0));
          }
          build.push(nl(levels[a]));
          lastLevel = levels[a];
        } else if (levels[a] === -10) {
          build.push(WSP);
          if (data.lexer[a + 1] !== lexer)
            lastLevel = lastLevel + 1;
        }
      } else {
        if (externalIndex[a] === a) {
          build.push(data.token[a]);
        } else {
          prettify.end = externalIndex[a];
          prettify.start = a;
          const ex = parse.beautify(lastLevel);
          external = ex.output.replace(StripEnd, NIL);
          build.push(external);
          a = prettify.iterator;
          if (levels[a] === -10) {
            build.push(WSP);
          } else if (levels[a] > -1) {
            build.push(nl(levels[a]));
          }
          ex.reset();
        }
      }
      a = a + 1;
    } while (a < b);
    prettify.iterator = b - 1;
    return build.join(NIL);
  })();
  return output;
};

// src/shared/events.ts
var events = new class EventHooks {
  constructor() {
    this.before = [];
    this.after = [];
    this.language = [];
    this.rules = [];
  }
  dispatch(name, ...args) {
    if (this[name].length > 0) {
      for (const callback of this[name]) {
        if (callback(args) === false)
          return false;
      }
    }
  }
}();

// src/shared/rules.ts
var rules = new class Rules {
  constructor() {
    this.language = "auto";
    this.crlf = false;
    this.endNewline = false;
    this.indentChar = " ";
    this.indentLevel = 0;
    this.indentSize = 2;
    this.preserveLine = 2;
    this.wrap = 0;
    this.liquid = {
      commentNewline: false,
      commentIndent: true,
      delimiterTrims: "preserve",
      ignoreTagList: [],
      lineBreakSeparator: "default",
      normalizeSpacing: true,
      preserveComment: false,
      quoteConvert: "none",
      valueForce: "intent"
    };
    this.markup = {
      attributeCasing: "preserve",
      attributeSort: false,
      attributeSortList: [],
      correct: false,
      commentNewline: false,
      commentIndent: true,
      delimiterForce: false,
      forceAttribute: 3,
      forceLeadAttribute: true,
      forceIndent: false,
      ignoreCSS: false,
      ignoreJS: true,
      ignoreJSON: false,
      preserveComment: false,
      preserveText: false,
      preserveAttributes: false,
      selfCloseSpace: true,
      quoteConvert: "none"
    };
    this.style = {
      correct: false,
      atRuleSpace: true,
      classPadding: false,
      noLeadZero: false,
      sortSelectors: false,
      sortProperties: false,
      quoteConvert: "none"
    };
    this.script = {
      arrayFormat: "default",
      braceNewline: false,
      bracePadding: false,
      braceStyle: "none",
      braceAllman: false,
      caseSpace: false,
      commentIndent: false,
      commentNewline: false,
      correct: false,
      elseNewline: false,
      endComma: "never",
      functionNameSpace: false,
      functionSpace: false,
      methodChain: 4,
      neverFlatten: false,
      noCaseIndent: false,
      noSemicolon: false,
      objectSort: false,
      objectIndent: "default",
      preserveComment: false,
      quoteConvert: "none",
      styleGuide: "none",
      ternaryLine: false,
      variableList: "none",
      vertical: false
    };
    this.json = assign({}, this.script, {
      arrayFormat: "default",
      braceAllman: false,
      bracePadding: false,
      objectIndent: "default",
      objectSort: false
    }, {
      quoteConvert: "double",
      endComma: "never",
      noSemicolon: true,
      vertical: false
    });
  }
}();

// src/shared/stats.ts
var stats = new class Stats {
}();

// src/shared/language.ts
var language = new class Language {
  constructor() {
    this.maps = Object.freeze({
      id: {
        auto: 1 /* Auto */,
        html: 2 /* HTML */,
        liquid: 3 /* Liquid */,
        xml: 11 /* XML */,
        jsx: 12 /* JSX */,
        tsx: 13 /* TSX */,
        json: 4 /* JSON */,
        yaml: 6 /* YAML */,
        css: 7 /* CSS */,
        scss: 8 /* SCSS */,
        sass: 9 /* SASS */,
        less: 10 /* LESS */,
        javascript: 14 /* JavaScript */,
        typescript: 15 /* TypeScript */
      },
      lexer: {
        auto: "text",
        markup: "markup",
        html: "markup",
        liquid: "markup",
        xml: "markup",
        javascript: "script",
        typescript: "script",
        jsx: "script",
        tsx: "script",
        json: "script",
        less: "style",
        scss: "style",
        sass: "style",
        css: "style",
        text: "text",
        yaml: "markup"
      },
      name: {
        auto: "Plain Text",
        html: "HTML",
        xhtml: "XHTML",
        liquid: "Liquid",
        xml: "XML",
        jsx: "JSX",
        tsx: "TSX",
        json: "JSON",
        yaml: "YAML",
        css: "CSS",
        scss: "SCSS",
        sass: "SASS",
        less: "LESS",
        text: "Plain Text",
        javascript: "JavaScript",
        typescript: "TypeScript"
      },
      external: {
        [1 /* Auto */]: "auto",
        [2 /* HTML */]: "html",
        [3 /* Liquid */]: "liquid",
        [11 /* XML */]: "xml",
        [12 /* JSX */]: "jsx",
        [13 /* TSX */]: "tsx",
        [4 /* JSON */]: "json",
        [6 /* YAML */]: "yaml",
        [7 /* CSS */]: "css",
        [8 /* SCSS */]: "scss",
        [9 /* SASS */]: "sass",
        [10 /* LESS */]: "less",
        [14 /* JavaScript */]: "javascript",
        [15 /* TypeScript */]: "typescript"
      }
    });
    this.id = 1 /* Auto */;
    this.lexer = "text";
    this.name = "Plain Text";
  }
  is(language2) {
    return this.maps.id[language2] === this.id;
  }
  get(id) {
    const name = this.maps.external[id];
    return {
      id,
      name,
      lexer: this.maps.lexer[name]
    };
  }
  set(language2) {
    if (rules.language !== language2) {
      rules.language = language2;
      this.id = this.maps.id[language2];
      this.name = this.maps.name[language2];
      this.lexer = this.maps.lexer[language2];
    }
  }
}();

// src/shared/definitions.ts
var definitions = {
  global: {
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
    preserveLine: {
      default: 2,
      description: "The maximum number of consecutive empty lines to retain.",
      lexer: "all",
      type: "number"
    },
    wrap: {
      default: 0,
      description: "Character width limit before applying word wrap. A 0 value disables this option. A negative value concatenates script strings.",
      lexer: "all",
      type: "number"
    }
  },
  liquid: {
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
    correct: {
      default: false,
      description: "Automatically correct some sloppiness in code.",
      lexer: "markup",
      type: "boolean"
    },
    delimiterTrims: {
      default: "preserve",
      description: "How delimiter whitespace trim dashes should handled on Liquid tokens. You should avoid setting this to force in order to avoid stripping whitespace between text content.",
      lexer: "markup",
      type: "select",
      values: [
        {
          rule: "preserve",
          description: "All trim dash occurances of trims intact"
        },
        {
          rule: "strip",
          description: "Removes all trim dash occurances for tags and output tokens"
        },
        {
          rule: "force",
          description: "Applies trime dashes to all tags and output tokens"
        },
        {
          rule: "tags",
          description: "Applies trim dashes to tags tokens only"
        },
        {
          rule: "output",
          description: "Applies trim dashes to output object tokens only"
        }
      ]
    },
    ignoreTagList: {
      default: [],
      description: "A list of liquid tag to ignore",
      lexer: "liquid",
      type: "array"
    },
    preserveComment: {
      default: false,
      description: "Prevent comment reformatting due to option wrap.",
      lexer: "markup",
      type: "boolean"
    },
    normalizeSpacing: {
      default: true,
      description: "Whether or not to normalize the distributed spacing contained in Liquid tokens.",
      lexer: "markup",
      type: "boolean"
    },
    lineBreakSeparator: {
      default: "default",
      description: "Controls the placement of Liquid tag separator type characters in newline structures.",
      lexer: "markup",
      type: "select",
      values: [
        {
          rule: "default",
          description: "Leave line break character intace"
        },
        {
          rule: "before",
          description: "Place line break character at the start of expressions"
        },
        {
          rule: "after",
          description: "Place line break character at the end of expressions"
        }
      ]
    },
    quoteConvert: {
      lexer: "all",
      description: "If the quotes should be converted to single quotes or double quotes.",
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
    valueForce: {
      default: "intent",
      description: "Controls force indentation applied in accordance with the attribute value expressions. This rule is Liquid specific.",
      lexer: "markup",
      type: "select",
      values: [
        {
          rule: "wrap",
          description: "Apply by wrap"
        },
        {
          rule: "newline",
          description: "Apply when newlines"
        },
        {
          rule: "intent",
          description: "Apply on either newline or wrap"
        },
        {
          rule: "always",
          description: "Always apply"
        },
        {
          rule: "never",
          description: "Never apply"
        }
      ]
    }
  },
  markup: {
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
    attributeCasing: {
      default: "preserve",
      description: "Controls the casing of attribute values and keys.",
      type: "select",
      lexer: "markup",
      values: [
        {
          rule: "preserve",
          description: "All tag attribute keys/values are preserved and left intact."
        },
        {
          rule: "lowercase",
          description: "All tag attribute keys/values are converted to lowercase"
        },
        {
          rule: "lowercase-name",
          description: "Only attribute keys are converted to lowercase"
        },
        {
          rule: "lowercase-value",
          description: "Only attribute values are converted to lowercase"
        }
      ]
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
    correct: {
      default: false,
      description: "Automatically correct some sloppiness in code.",
      lexer: "markup",
      type: "boolean"
    },
    delimiterForce: {
      description: "Whether or not ending HTML tag delimiters should be forced onto a newline. This will emulate the style of Prettier's singleAttributePerLine formatting option, wherein the last > delimiter character breaks itself onto a new line",
      default: false,
      lexer: "markup",
      type: "boolean"
    },
    forceAttribute: {
      default: false,
      description: "If all markup attributes should be indented each onto their own line. This option accepts either a boolean or number value, depending on your preferences you can either force attributes based a count limit, disable forcing or always enable enforcing.",
      lexer: "markup",
      type: ["number", "boolean"],
      multi: {
        number: {
          default: 1,
          description: "Optionally define an attribute force threshold. When the number of attributes exceeds this limit then they will be forced, otherwise they will be left intact."
        },
        boolean: {
          default: false,
          description: "Whether or not to enforce the rule. A value of true will always force attributes, whereas a value of false will never force attributes."
        }
      }
    },
    forceLeadAttribute: {
      default: false,
      description: "Forces leading attribute onto a newline when using wrap based indentation.",
      lexer: "markup",
      type: "boolean"
    },
    forceIndent: {
      default: false,
      description: "Will force indentation upon all content and tags without regard for the creation of new text nodes.",
      lexer: "markup",
      type: "boolean"
    },
    ignoreJS: {
      default: false,
      description: "Whether to ignore embedded regions of tags identified to contain JavaScript",
      lexer: "markup",
      type: "boolean"
    },
    ignoreCSS: {
      default: false,
      description: "Whether to ignore embedded regions of tags identified to contain CSS",
      lexer: "markup",
      type: "boolean"
    },
    ignoreJSON: {
      default: false,
      description: "Whether HTML <script> tags annotated with a JSON identifiable attribute should be ignored from beautification.",
      lexer: "markup",
      type: "boolean"
    },
    preserveAttributes: {
      default: false,
      description: "If markup tags should have their insides preserved. This option is only available to markup and does not support child tokens that require a different lexer.",
      lexer: "markup",
      type: "boolean"
    },
    preserveComment: {
      default: false,
      description: "Prevent comment reformatting due to option wrap.",
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
    quoteConvert: {
      lexer: "all",
      description: "If the quotes should be converted to single quotes or double quotes.",
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
    }
  },
  style: {
    correct: {
      default: false,
      description: "Automatically correct some sloppiness in code.",
      lexer: "style",
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
    atRuleSpace: {
      default: true,
      description: "Insert a single whitespace character betwen @ rules.",
      type: "boolean",
      lexer: "style"
    },
    quoteConvert: {
      lexer: "style",
      description: "If the quotes should be converted to single quotes or double quotes.",
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
    }
  },
  script: {
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
    caseSpace: {
      default: false,
      type: "boolean",
      description: "If the colon separating a case's expression (of a switch/case block) from its statement should be followed by a space instead of indentation thereby keeping the case on a single line of code.",
      lexer: "script"
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
    correct: {
      default: false,
      description: "Automatically correct some sloppiness in code.",
      lexer: "markup",
      type: "boolean"
    },
    elseNewline: {
      lexer: "script",
      default: false,
      type: "boolean",
      description: 'If keyword "else" is forced onto a new line.'
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
    preserveComment: {
      default: false,
      description: "Prevent comment reformatting due to option wrap.",
      lexer: "markup",
      type: "boolean"
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
    noCaseIndent: {
      lexer: "script",
      description: "If the colon separating a case's expression (of a switch/case block) from its statement should be followed by a space instead of indentation, thereby keeping the case on a single line of code.",
      default: false,
      type: "boolean"
    },
    noSemicolon: {
      lexer: "script",
      description: "Removes semicolons that would be inserted by ASI. This option is in conflict with option `attemptCorrection` and takes precedence over conflicting features. Use of this option is a possible security/stability risk.",
      default: false,
      type: "boolean"
    },
    quoteConvert: {
      lexer: "style",
      description: "If the quotes should be converted to single quotes or double quotes.",
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
    }
  }
};

// src/parse/comment.ts
function comment(prettify2) {
  const sindex = prettify2.source.search(CommControl);
  const signore = prettify2.source.search(CommIgnoreFile);
  const k = keys(definitions);
  const len = k.length;
  let a = 0;
  if (signore > -1 && prettify2.source.slice(0, signore).trimStart() === NIL)
    return false;
  if (sindex > -1 && (sindex === 0 || `"':`.indexOf(prettify2.source.charAt(sindex - 1)) < 0)) {
    let esc2 = function() {
      if (is(source[a2 - 1], 92 /* BWS */))
        return false;
      let x = a2;
      do
        x = x - 1;
      while (x > 0 && is(source[x], 92 /* BWS */));
      return (a2 - x) % 2 === 0;
    };
    const ops = [];
    const pdcom = sindex;
    const source = prettify2.source;
    const len2 = source.length;
    let a2 = pdcom;
    let b2 = 0;
    let quote = NIL;
    let item = NIL;
    let lang = NIL;
    let lex = NIL;
    let valkey = [];
    let op = [];
    let rcb;
    let comment2;
    if (is(source[a2], 60 /* LAN */)) {
      comment2 = "<!--";
    } else if (is(source[a2 + 1], 47 /* FWS */)) {
      comment2 = "//";
    } else if (is(source[a2 + 1], 37 /* PER */)) {
      rcb = source.indexOf("}", a2 + 1);
      if (is(source[rcb - 1], 37 /* PER */))
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
        if (quote === NIL) {
          if (is(source[a2], 34 /* DQO */) || is(source[a2], 39 /* SQO */) || is(source[a2], 96 /* TQO */)) {
            quote = source.charAt(a2);
            if (ops.length > 0 && is.last(ops[ops.length - 1], 58 /* COL */))
              b2 = a2;
          } else if (/\s/.test(source.charAt(a2)) === false && b2 === 0) {
            b2 = a2;
          } else if (is(source[a2], 44 /* COM */) || ws(source.charAt(a2)) && b2 > 0) {
            item = source.slice(b2, a2);
            if (ops.length > 0) {
              if (ops.length > 0 && is(item, 58 /* COL */) && ops[ops.length - 1].indexOf(":") < 0) {
                ops[ops.length - 1] = ops[ops.length - 1] + item;
                b2 = a2;
              } else if (ops.length > 0 && is.last(ops[ops.length - 1], 58 /* COL */)) {
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
          quote = NIL;
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
        quote = quote.replace(/\s*-+>$/, NIL);
      else if (comment2 === "//")
        quote = quote.replace(/\s+$/, NIL);
      else
        quote = quote.replace(/\s*\u002a\/$/, NIL);
      ops.push(quote);
    }
    a2 = ops.length;
    if (a2 > 0) {
      do {
        a2 = a2 - 1;
        if (ops[a2].indexOf(":") > 0) {
          op = [ops[a2].slice(0, ops[a2].indexOf(":")), ops[a2].slice(ops[a2].indexOf(":") + 1)];
        } else if (definitions[ops[a2]] !== void 0 && definitions[ops[a2]].type === "boolean") {
          prettify2.rules[ops[a2]] = true;
        }
        if (op.length === 2 && definitions[op[0]] !== void 0) {
          if (op[1].charCodeAt(op[1].length - 1) === op[1].charCodeAt(0) && (is(op[1], 34 /* DQO */) || is(op[1], 39 /* SQO */) || is(op[1], 96 /* TQO */))) {
            op[1] = op[1].slice(1, op[1].length - 1);
          }
          if (definitions[op[0]].type === "number" && isNaN(Number(op[1])) === false) {
            prettify2.rules[op[0]] = Number(op[1]);
          } else if (definitions[op[0]].type === "boolean") {
            prettify2.rules[op[0]] = op[1] === "true";
          } else {
            if (definitions[op[0]].values !== void 0) {
              valkey = keys(definitions[op[0]].values);
              b2 = valkey.length;
              do {
                b2 = b2 - 1;
                if (valkey[b2] === op[1]) {
                  prettify2.rules[op[0]] = op[1];
                  break;
                }
              } while (b2 > 0);
            } else {
              if (op[0] === "language") {
                lang = op[1];
              } else if (op[0] === "lexer") {
                lex = op[1];
              }
              prettify2.rules[op[0]] = op[1];
            }
          }
        }
      } while (a2 > 0);
      if (lex === NIL && lang !== NIL)
        lex = setLexer(lang);
    }
  }
  if (prettify2.lexer === "script") {
    if (prettify2.rules.script.styleGuide !== void 0) {
      switch (prettify2.rules.script.styleGuide) {
        case "airbnb":
          prettify2.rules.wrap = 80;
          prettify2.rules.indentChar = " ";
          prettify2.rules.indentSize = 2;
          prettify2.rules.preserveLine = 1;
          prettify2.rules.script.correct = true;
          prettify2.rules.script.quoteConvert = "single";
          prettify2.rules.script.variableList = "each";
          prettify2.rules.script.endComma = "always";
          prettify2.rules.script.bracePadding = true;
          break;
        case "crockford":
          prettify2.rules.indentChar = " ";
          prettify2.rules.indentSize = 4;
          prettify2.rules.script.correct = true;
          prettify2.rules.script.bracePadding = false;
          prettify2.rules.script.elseNewline = false;
          prettify2.rules.script.endComma = "never";
          prettify2.rules.script.noCaseIndent = true;
          prettify2.rules.script.functionSpace = true;
          prettify2.rules.script.variableList = "each";
          prettify2.rules.script.vertical = false;
          break;
        case "google":
          prettify2.rules.wrap = -1;
          prettify2.rules.indentChar = " ";
          prettify2.rules.indentSize = 4;
          prettify2.rules.preserveLine = 1;
          prettify2.rules.script.correct = true;
          prettify2.rules.script.quoteConvert = "single";
          prettify2.rules.script.vertical = false;
          break;
        case "jquery":
          prettify2.rules.wrap = 80;
          prettify2.rules.indentChar = "	";
          prettify2.rules.indentSize = 1;
          prettify2.rules.script.correct = true;
          prettify2.rules.script.bracePadding = true;
          prettify2.rules.script.quoteConvert = "double";
          prettify2.rules.script.variableList = "each";
          break;
        case "jslint":
          prettify2.rules.indentChar = " ";
          prettify2.rules.indentSize = 4;
          prettify2.rules.script.correct = true;
          prettify2.rules.script.bracePadding = false;
          prettify2.rules.script.elseNewline = false;
          prettify2.rules.script.endComma = "never";
          prettify2.rules.script.noCaseIndent = true;
          prettify2.rules.script.functionSpace = true;
          prettify2.rules.script.variableList = "each";
          prettify2.rules.script.vertical = false;
          break;
        case "standard":
          prettify2.rules.wrap = 0;
          prettify2.rules.indentChar = " ";
          prettify2.rules.indentSize = 2;
          prettify2.rules.endNewline = false;
          prettify2.rules.preserveLine = 1;
          prettify2.rules.script.correct = true;
          prettify2.rules.script.noSemicolon = true;
          prettify2.rules.script.endComma = "never";
          prettify2.rules.script.braceNewline = false;
          prettify2.rules.script.bracePadding = false;
          prettify2.rules.script.braceAllman = false;
          prettify2.rules.script.quoteConvert = "single";
          prettify2.rules.script.functionSpace = true;
          prettify2.rules.script.ternaryLine = false;
          prettify2.rules.script.variableList = "each";
          prettify2.rules.script.vertical = false;
          break;
        case "yandex":
          prettify2.rules.script.correct = true;
          prettify2.rules.script.bracePadding = false;
          prettify2.rules.script.quoteConvert = "single";
          prettify2.rules.script.variableList = "each";
          prettify2.rules.script.vertical = false;
          break;
      }
    }
    if (prettify2.rules.script.braceStyle !== void 0) {
      switch (prettify2.rules.script.braceStyle) {
        case "collapse":
          prettify2.rules.script.braceNewline = false;
          prettify2.rules.script.bracePadding = false;
          prettify2.rules.script.braceAllman = false;
          prettify2.rules.script.objectIndent = "indent";
          prettify2.rules.script.neverFlatten = true;
          break;
        case "collapse-preserve-inline":
          prettify2.rules.script.braceNewline = false;
          prettify2.rules.script.bracePadding = true;
          prettify2.rules.script.braceAllman = false;
          prettify2.rules.script.objectIndent = "indent";
          prettify2.rules.script.neverFlatten = false;
          break;
        case "expand":
          prettify2.rules.script.braceNewline = false;
          prettify2.rules.script.bracePadding = false;
          prettify2.rules.script.braceAllman = true;
          prettify2.rules.script.objectIndent = "indent";
          prettify2.rules.script.neverFlatten = true;
          break;
      }
    }
    if (prettify2.rules.language === "json")
      prettify2.rules.wrap = 0;
  }
  do {
    if (prettify2.rules[keys[a]] !== void 0) {
      definitions[keys[a]].lexer.length;
    }
    a = a + 1;
  } while (a < len);
}

// src/parse/mode.ts
function parser({
  source,
  lexers,
  lexer,
  rules: rules2,
  rules: {
    language: language2
  }
}) {
  if (typeof lexers[lexer] === "function") {
    lexers[lexer](`${source} `);
  } else {
    parse.error = `Specified lexer, ${lexer}, is not a function.`;
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
    if (lexer === "script" && (language2 === "json" && rules2.json.objectSort === true || rules2.language !== "json" && rules2.script.objectSort === true)) {
      parse.sortCorrect(0, parse.count + 1);
    } else if (lexer === "style" && rules2.style.sortProperties === true) {
      parse.sortCorrect(0, parse.count + 1);
    }
  }
  return parse.data;
}
function stats2(language2) {
  const store = { language: language2, chars: 0 };
  const start = Date.now();
  return (output) => {
    const time = +(Date.now() - start).toFixed(0);
    store.time = time > 1e3 ? `${time}s` : `${time}ms`;
    store.chars = output;
    store.size = size(output);
    return store;
  };
}
function blank(prettify2) {
  const { languageName } = reference(prettify2.rules.language);
  const crlf = prettify2.rules.crlf === true ? "\r\n" : "\n";
  const input = prettify2.source.match(/\n/g);
  const timer = stats2(languageName);
  let output = NIL;
  if (input === null) {
    if (prettify2.rules.endNewline)
      output = crlf;
    prettify2.stats = timer(output.length);
  } else {
    output = input[0].length > prettify2.rules.preserveLine ? repeatChar(prettify2.rules.preserveLine, crlf) : repeatChar(input[0].length, crlf);
    if (prettify2.rules.endNewline)
      output += crlf;
    prettify2.stats = timer(output.length);
  }
  return output;
}
function execute(prettify2) {
  prettify2.data = parse.full();
  if (!/\S/.test(prettify2.source))
    return blank(prettify2);
  if (prettify2.rules.language === "text") {
    prettify2.rules.language = "text";
    prettify2.rules.languageName = "Plain Text";
    prettify2.lexer = "markup";
  } else if (prettify2.lexer === "auto" && prettify2.rules.language !== "text") {
    prettify2.lexer = setLexer(prettify2.rules.language);
    prettify2.rules.languageName = setLanguageName(prettify2.rules.language);
  } else if (prettify2.rules.language === "auto" || prettify2.rules.language === void 0) {
    const { lexer, language: language2, languageName } = detect(prettify2.source);
    if (language2 === "unknown") {
      console.warn("Prettify: unknown and/or unsupport language");
      console.info("Prettify: define a support language (fallback is HTML)");
    }
    prettify2.lexer = lexer;
    prettify2.rules.language = language2;
    prettify2.rules.languageName = languageName;
  } else {
    const { lexer, language: language2, languageName } = reference(prettify2.rules.language);
    if (language2 === "unknown") {
      console.warn(`Prettify: unsupport ${prettify2.rules.language}`);
      console.info("Prettify: language is not supported (fallback is HTML)");
    }
    prettify2.lexer = lexer;
    prettify2.rules.language = language2;
    prettify2.rules.languageName = languageName;
  }
  const crlf = prettify2.rules.crlf === true ? "\r\n" : "\n";
  const time = stats2(prettify2.rules.languageName);
  if (comment(prettify2) === false) {
    prettify2.stats = time(prettify2.source.length);
    return prettify2.source;
  }
  prettify2.data = parser(prettify2);
  if (prettify2.mode === "parse") {
    prettify2.stats = time(prettify2.source.length);
    return parse.data;
  }
  const beautify = prettify2.beautify[prettify2.lexer](prettify2.rules);
  const output = prettify2.rules.endNewline === true ? beautify.replace(/\s*$/, crlf) : beautify.replace(/\s+$/, NIL);
  prettify2.stats = time(output.length);
  prettify2.end = 0;
  prettify2.start = 0;
  //console.log(parse);
  return output;
}

// src/prettify.ts
var prettify_default = function() {
  defineProperties(format, {
    stats: {
      get() {
        return prettify.stats;
      }
    },
    after: {
      value(callback) {
        events.after.push(callback);
      }
    },
    before: {
      value(callback) {
        events.before.push(callback);
      }
    },
    sync: {
      value: format.bind({ sync: true })
    }
  });
  function format(source, options) {

    console.time('start')
    prettify.source = source;
    prettify.mode = "beautify";
    if (typeof this.language === "string" && this.language !== rules.language) {
      rules.language = this.language;
    }
    if (typeof options === "object")
      ruleOptions(options);
    if (events.dispatch("before", rules, source) === false)
      return source;
    const output = execute(prettify);
    if (events.dispatch("after", output, rules) === false)
      return source;
    if (this.sync === true) {
      if (parse.error.length)
        throw new Error(parse.error);
      return output;
    }

    console.timeEnd('start')
    return new Promise((resolve, reject) => {
      if (parse.error.length)
        return reject(parse.error);
      return resolve(output);
    });
  }
  defineProperties(ruleOptions, {
    listen: {
      value(callback) {
        events.rules.push(callback);
      }
    }
  });
  function ruleOptions(options) {
    if (typeof options === "undefined")
      return rules;
    let changes;
    if (events.rules.length > 0) {
      changes = assign({}, rules);
    }
    for (const rule in options) {
      if (rule === "wrap") {
        rules.wrap = options[rule];
      } else if (rule === "language") {
        language.set(options[rule]);
      } else if (rule === "indentLevel") {
        rules.indentLevel = options[rule];
      } else if (rule === "endNewline") {
        rules.endNewline = options[rule];
      } else if (rule === "indentChar") {
        rules.indentChar = options[rule];
      } else if (rule === "indentSize") {
        rules.indentSize = options[rule];
      } else if (rule === "preserveLine") {
        rules.preserveLine = options[rule];
      } else if (rule === "crlf") {
        rules.crlf = options[rule];
      } else if (rule === "liquid") {
        assign(rules.liquid, options[rule]);
      } else if (rule === "markup") {
        assign(rules.markup, options[rule]);
      } else if (rule === "script") {
        assign(rules.script, options[rule]);
      } else if (rule === "style") {
        assign(rules.style, options[rule]);
      } else if (rule === "json") {
        assign(rules.json, options[rule]);
      }
      if (changes) {
        const diff = {};
        for (const rule2 in options) {
          if (rule2 !== "liquid" && rule2 !== "markup" && rule2 !== "script" && rule2 !== "style" && rule2 !== "json") {
            if (changes[rule2] !== options[rule2]) {
              diff[rule2] = { from: changes[rule2], to: options[rule2] };
            }
          } else {
            for (const prop in options[rule2]) {
              if (changes[rule2][prop] !== options[rule2][prop]) {
                if (!(rule2 in diff))
                  diff[rule2] = {};
                diff[rule2][prop] = { from: changes[rule2][prop], to: options[rule2][prop] };
              }
            }
          }
        }
        for (const cb of events.rules)
          cb(diff, prettify.rules);
      }
    }
    return rules;
  }
  defineProperties(parse2, {
    stats: {
      get() {
        return stats;
      }
    },
    sync: {
      value: parse2.bind({ sync: true })
    }
  });
  function parse2(source, options) {
    prettify.source = source;
    prettify.mode = "parse";
    if (typeof options === "object")
      ruleOptions(options);
    const parsed = execute(prettify);
    if (this.sync === true) {
      if (parse.error.length)
        throw new Error(parse.error);
      return parsed;
    }
    return new Promise((resolve, reject) => {
      if (parse.error.length)
        return reject(parse.error);
      return resolve(parsed);
    });
  }
  return {
    parse: parse2,
    format,
    liquid: format.bind({ language: "liquid" }),
    html: format.bind({ language: "html" }),
    css: format.bind({ language: "css" }),
    json: format.bind({ language: "json" }),
    get rules() {
      return ruleOptions;
    },
    get error() {
      return parse.error.length ? prettify.error : null;
    },
    get language() {
      return detect;
    },
    get grammar() {
      return grammar.extend;
    }
  };
}();

export { prettify_default as default };
