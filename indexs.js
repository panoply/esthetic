'use strict';

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
var prettify2 = function(rules3) {
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
  let parse4;
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
      return rules3;
    },
    get data() {
      return parse4;
    },
    set data(data2) {
      parse4 = data2;
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
    set stats(data2) {
      assign(data2, stats3);
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
    extend(rules3) {
      for (const rule in rules3) {
        if (isArray(rules3[rule])) {
          for (const tag of rules3[rule]) {
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
          if (typeof rules3[rule] === "object") {
            embed(rules3[rule]);
          }
        }
      }
    }
  };
  function embed(rules3) {
    for (const tag in rules3) {
      for (const { language: language2, argument = null } of rules3[tag]) {
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
    extend(rules3) {
      for (const rule in rules3) {
        if (isArray(rules3[rule])) {
          for (const tag of rules3[rule]) {
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
          if (typeof rules3[rule] === "object") {
            embed(rules3[rule]);
          }
        }
      }
    }
  };
  function embed(rules3) {
    for (const tag in rules3) {
      if (!(tag in EMBEDDED))
        EMBEDDED[tag] = { tag, attr: /* @__PURE__ */ new Map() };
      for (const { language: language2, attribute } of rules3[tag]) {
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
    extend(rules3) {
      for (const rule in rules3) {
        if (isArray(rules3[rule])) {
          for (const tag of rules3[rule]) {
            if (rule === "units" && !UNITS.has(tag)) {
              grammar2[rule].push(tag);
              UNITS.add(tag);
            } else if (rule === "atrules" && !ATRULES.has(tag)) {
              grammar2[rule].push(tag);
              ATRULES.add(tag);
            }
          }
        }
        if (typeof rules3[rule] === "object") {
          for (const prop in rules3[rule]) {
            if (isArray(rules3[rule][prop])) {
              for (const tag of rules3[rule][prop]) {
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
    extend(rules3) {
      for (const rule in rules3) {
        if (isArray(rules3[rule])) {
          for (const tag of rules3[rule]) {
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
  if (prettify2.events.language.length > 0) {
    for (const hook of prettify2.events.language) {
      const langhook = hook(result);
      if (typeof langhook === "object")
        assign(result, langhook);
    }
  }
  return result;
}
detect.reference = reference;
detect.listen = function(callback) {
  prettify2.events.language.push(callback);
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
    return prettify2.source;
  }
  get current() {
    return this.get(this.count);
  }
  get(index) {
    const { data: data2 } = this;
    return {
      get begin() {
        return data2.begin[index];
      },
      get ender() {
        return data2.ender[index];
      },
      get lexer() {
        return data2.lexer[index];
      },
      get lines() {
        return data2.lines[index];
      },
      get stack() {
        return data2.stack[index];
      },
      get token() {
        return data2.token[index];
      },
      get types() {
        return data2.types[index];
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
  pushEnder(data2) {
    let a = this.count;
    const begin = data2.begin[a];
    if (data2.lexer[a] === "style" && prettify2.rules.style.sortProperties === true || data2.lexer[a] === "script" && (prettify2.rules.script.objectSort === true || prettify2.rules.json.objectSort === true)) {
      return;
    }
    do {
      if (data2.begin[a] === begin || data2.begin[data2.begin[a]] === begin && data2.types[a].indexOf("attribute") > -1 && data2.types[a].indexOf("attribute_end") < 0) {
        data2.ender[a] = this.count;
      } else {
        a = data2.begin[a];
      }
      a = a - 1;
    } while (a > begin);
    if (a > -1)
      data2.ender[a] = this.count;
  }
  lexers(output, language2) {
    const { rules: rules3 } = prettify2;
    const mode = lexmap[language2];
    const curr = rules3.language;
    rules3.language = language2;
    rules3.languageName = setLanguageName(language2);
    if (language2 === "json") {
      const json = assign({}, rules3.json);
      const clone = assign({}, rules3.script);
      assign(rules3.script, rules3.json, {
        quoteConvert: "double",
        endComma: "never",
        noSemicolon: true,
        vertical: false
      });
      prettify2.lexers[mode](output);
      if (rules3.json.objectSort)
        this.sortCorrect(0, this.count + 1);
      rules3.language = curr;
      rules3.languageName = setLanguageName(curr);
      rules3.json = json;
      rules3.script = clone;
    } else {
      prettify2.lexers[mode](output);
      if (language2 === "javascript" && rules3.script.objectSort === true || (language2 === "css" || language2 === "scss") && rules3.style.sortProperties === true) {
        this.sortCorrect(0, this.count + 1);
      }
      rules3.language = curr;
      rules3.languageName = setLanguageName(curr);
    }
  }
  beautify(indent) {
    const { rules: rules3 } = prettify2;
    const language2 = rules3.language;
    const external = this.external.get(prettify2.start);
    rules3.indentLevel = indent;
    return {
      reset() {
        rules3.language = language2;
        rules3.languageName = setLanguageName(external.language);
        rules3.indentLevel = 0;
      },
      get beautify() {
        return prettify2.beautify[external.lexer](rules3);
      }
    };
  }
  push(data2, record, structure = NIL) {
    data2.begin.push(record.begin);
    data2.ender.push(record.ender);
    data2.lexer.push(record.lexer);
    data2.stack.push(record.stack);
    data2.token.push(record.token);
    data2.types.push(record.types);
    data2.lines.push(record.lines);
    if (data2 === this.data) {
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
        if (this.structure.length > 2 && (data2.types[this.structure[length - 1][1]] === "else" || data2.types[this.structure[length - 1][1]].indexOf("_else") > 0) && (data2.types[this.structure[length - 2][1]] === "start" || data2.types[this.structure[length - 2][1]].indexOf("_start") > 0) && (data2.types[this.structure[length - 2][1] + 1] === "else" || data2.types[this.structure[length - 2][1] + 1].indexOf("_else") > 0)) {
          this.structure.pop();
          const [token, index] = this.structure.scope;
          data2.begin[this.count] = index;
          data2.stack[this.count] = token;
          data2.ender[this.count - 1] = this.count;
          ender = data2.ender[data2.begin[this.count] + 1];
        }
        this.pushEnder(data2);
        if (ender > 0)
          data2.ender[data2.begin[this.count] + 1] = ender;
        this.structure.pop();
      } else if (record.types === "else" || record.types.indexOf("_else") > 0) {
        if (structure === NIL)
          structure = "else";
        if (this.count > 0 && (data2.types[this.count - 1] === "start" || data2.types[this.count - 1].indexOf("_start") > 0)) {
          this.structure.push([structure, this.count]);
        } else {
          this.pushEnder(data2);
          this.structure.update(structure === NIL ? "else" : structure, this.count);
        }
      }
    }
  }
  pop(data2) {
    if (data2 === this.data)
      this.count = this.count - 1;
    return {
      begin: data2.begin.pop(),
      ender: data2.ender.pop(),
      lexer: data2.lexer.pop(),
      lines: data2.lines.pop(),
      stack: data2.stack.pop(),
      token: data2.token.pop(),
      types: data2.types.pop()
    };
  }
  concat(data2, record) {
    data2.begin = data2.begin.concat(record.begin);
    data2.ender = data2.ender.concat(record.ender);
    data2.lexer = data2.lexer.concat(record.lexer);
    data2.stack = data2.stack.concat(record.stack);
    data2.token = data2.token.concat(record.token);
    data2.types = data2.types.concat(record.types);
    data2.lines = data2.lines.concat(record.lines);
    if (data2 === this.data)
      this.count = data2.token.length - 1;
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
  sortObject(data2) {
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
    const json = prettify2.rules.language === "json";
    const global = data2.lexer[cc2] === "style" && struc === "global";
    const style2 = data2.lexer[cc2] === "style";
    const delim = style2 === true ? [";", "separator"] : [",", "separator"];
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
      if (data2.types[xx] === "comment") {
        do
          xx = xx + 1;
        while (xx < length && data2.types[xx] === "comment");
        if (data2.token[xx] === void 0)
          return 1;
      }
      if (data2.types[yy] === "comment") {
        do
          yy = yy + 1;
        while (yy < length && data2.types[yy] === "comment");
        if (data2.token[yy] === void 0)
          return 1;
      }
      if (style2 === true) {
        if (data2.token[xx].indexOf("@import") === 0 || data2.token[yy].indexOf("@import") === 0) {
          return xx < yy ? -1 : 1;
        }
        if (data2.types[xx] !== data2.types[yy]) {
          if (data2.types[xx] === "function")
            return 1;
          if (data2.types[xx] === "variable")
            return -1;
          if (data2.types[xx] === "selector")
            return 1;
          if (data2.types[xx] === "property" && data2.types[yy] !== "variable")
            return -1;
          if (data2.types[xx] === "mixin" && data2.types[yy] !== "property" && data2.types[yy] !== "variable")
            return -1;
        }
      }
      if (data2.token[xx].toLowerCase() > data2.token[yy].toLowerCase())
        return 1;
      return -1;
    };
    behind = cc2;
    do {
      if (data2.begin[cc2] === dd || global === true && cc2 < behind && is(data2.token[cc2], 125 /* RCB */) && data2.begin[data2.begin[cc2]] === -1) {
        if (data2.types[cc2].indexOf("liquid") > -1)
          return;
        if (data2.token[cc2] === delim[0] || style2 === true && is(data2.token[cc2], 125 /* RCB */) && not(data2.token[cc2 + 1], 59 /* SEM */)) {
          comma = true;
          front = cc2 + 1;
        } else if (style2 === true && is(data2.token[cc2 - 1], 125 /* RCB */)) {
          comma = true;
          front = cc2;
        }
        if (front === 0 && data2.types[0] === "comment") {
          do
            front = front + 1;
          while (data2.types[front] === "comment");
        } else if (data2.types[front] === "comment" && data2.lines[front] < 2) {
          front = front + 1;
        }
        if (comma === true && (data2.token[cc2] === delim[0] || style2 === true && is(data2.token[cc2 - 1], 125 /* RCB */)) && front <= behind) {
          if (style2 === true && "};".indexOf(data2.token[behind]) < 0) {
            behind = behind + 1;
          } else if (style2 === false && not(data2.token[behind], 44 /* COM */)) {
            behind = behind + 1;
          }
          keys2.push([front, behind]);
          if (style2 === true && is(data2.token[front], 125 /* RCB */)) {
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
      if (data2.types[ee] === "comment" && data2.lines[ee] > 1) {
        do
          ee = ee - 1;
        while (ee > 0 && data2.types[ee] === "comment");
        keys2[keys2.length - 1][0] = ee + 1;
      }
      if (data2.types[cc2 + 1] === "comment" && cc2 === -1) {
        do
          cc2 = cc2 + 1;
        while (data2.types[cc2 + 1] === "comment");
      }
      keys2.push([cc2 + 1, ee]);
    }
    if (keys2.length > 1) {
      if (json === true || style2 === true || is(data2.token[cc2 - 1], 61 /* EQS */) || is(data2.token[cc2 - 1], 58 /* COL */) || is(data2.token[cc2 - 1], 40 /* LPR */) || is(data2.token[cc2 - 1], 91 /* LSB */) || is(data2.token[cc2 - 1], 44 /* COM */) || data2.types[cc2 - 1] === "word" || cc2 === 0) {
        keys2.sort(sort);
        keylen = keys2.length;
        comma = false;
        dd = 0;
        do {
          keyend = keys2[dd][1];
          if (style2 === true) {
            gg = keyend;
            if (data2.types[gg] === "comment")
              gg = gg - 1;
            if (is(data2.token[gg], 125 /* RCB */)) {
              keyend = keyend + 1;
              delim[0] = "}";
              delim[1] = "end";
            } else {
              delim[0] = ";";
              delim[1] = "separator";
            }
          }
          ee = keys2[dd][0];
          if (style2 === true && data2.types[keyend - 1] !== "end" && data2.types[keyend] === "comment" && data2.types[keyend + 1] !== "comment" && dd < keylen - 1) {
            keyend = keyend + 1;
          }
          if (ee < keyend) {
            do {
              if (style2 === false && dd === keylen - 1 && ee === keyend - 2 && is(data2.token[ee], 44 /* COM */) && data2.lexer[ee] === "script" && data2.types[ee + 1] === "comment") {
                ff = ff + 1;
              } else {
                this.push(store, {
                  begin: data2.begin[ee],
                  ender: data2.ender[ee],
                  lexer: data2.lexer[ee],
                  lines: data2.lines[ee],
                  stack: data2.stack[ee],
                  token: data2.token[ee],
                  types: data2.types[ee]
                });
                ff = ff + 1;
              }
              if (data2.token[ee] === delim[0] && (style2 === true || data2.begin[ee] === data2.begin[keys2[dd][0]])) {
                comma = true;
              } else if (data2.token[ee] !== delim[0] && data2.types[ee] !== "comment") {
                comma = false;
              }
              ee = ee + 1;
            } while (ee < keyend);
          }
          if (comma === false && store.token[store.token.length - 1] !== "x;" && (style2 === true || dd < keylen - 1)) {
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
        this.splice({ data: data2, howmany: ff, index: cc2 + 1 });
        this.linesSpace = lines;
        this.concat(data2, store);
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
    const data2 = this.data;
    const ends = [];
    const structure = this.structure.length < 2 ? [-1] : [this.structure[this.structure.length - 2][1]];
    do {
      if (a > 0 && data2.types[a].indexOf("attribute") > -1 && data2.types[a].indexOf("end") < 0 && data2.types[a - 1].indexOf("start") < 0 && data2.types[a - 1].indexOf("attribute") < 0 && data2.lexer[a] === "markup") {
        structure.push(a - 1);
      }
      if (a > 0 && data2.types[a - 1].indexOf("attribute") > -1 && data2.types[a].indexOf("attribute") < 0 && data2.lexer[structure[structure.length - 1]] === "markup" && data2.types[structure[structure.length - 1]].indexOf("start") < 0) {
        structure.pop();
      }
      if (data2.begin[a] !== structure[structure.length - 1]) {
        data2.begin[a] = structure.length > 0 ? structure[structure.length - 1] : -1;
      }
      if (data2.types[a].indexOf("else") > -1) {
        if (structure.length > 0) {
          structure[structure.length - 1] = a;
        } else {
          structure.push(a);
        }
      }
      if (data2.types[a].indexOf("end") > -1)
        structure.pop();
      if (data2.types[a].indexOf("start") > -1)
        structure.push(a);
      a = a + 1;
    } while (a < end);
    a = end;
    do {
      a = a - 1;
      if (data2.types[a].indexOf("end") > -1) {
        ends.push(a);
        endslen = endslen + 1;
      }
      data2.ender[a] = endslen > -1 ? ends[endslen] : -1;
      if (data2.types[a].indexOf("start") > -1) {
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
var CommControl = /(\/[*/]|{%-?\s*(?:comment\s*-?%}|#)|<!-{2})\s*@prettify\s+/;
var CommIgnoreFile = /(\/[*/]|{%-?\s*(?:comment\s*-?%})|<!-{2})\s*@prettify-ignore\b/;

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
var rules2 = new class Rules {
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
        markup: 1 /* Markup */,
        html: 1 /* Markup */,
        liquid: 1 /* Markup */,
        xml: 1 /* Markup */,
        javascript: 2 /* Script */,
        typescript: 2 /* Script */,
        jsx: 2 /* Script */,
        tsx: 2 /* Script */,
        json: 2 /* Script */,
        less: 3 /* Style */,
        scss: 3 /* Style */,
        sass: 3 /* Style */,
        css: 3 /* Style */,
        text: "text",
        yaml: 1 /* Markup */
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
    if (rules2.language !== language2) {
      rules2.language = language2;
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
function comment(prettify3) {
  const sindex = prettify3.source.search(CommControl);
  const signore = prettify3.source.search(CommIgnoreFile);
  const k = keys(definitions);
  const len = k.length;
  let a = 0;
  if (signore > -1 && prettify3.source.slice(0, signore).trimStart() === NIL)
    return false;
  if (sindex > -1 && (sindex === 0 || `"':`.indexOf(prettify3.source.charAt(sindex - 1)) < 0)) {
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
    const source = prettify3.source;
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
          prettify3.rules[ops[a2]] = true;
        }
        if (op.length === 2 && definitions[op[0]] !== void 0) {
          if (op[1].charCodeAt(op[1].length - 1) === op[1].charCodeAt(0) && (is(op[1], 34 /* DQO */) || is(op[1], 39 /* SQO */) || is(op[1], 96 /* TQO */))) {
            op[1] = op[1].slice(1, op[1].length - 1);
          }
          if (definitions[op[0]].type === "number" && isNaN(Number(op[1])) === false) {
            prettify3.rules[op[0]] = Number(op[1]);
          } else if (definitions[op[0]].type === "boolean") {
            prettify3.rules[op[0]] = op[1] === "true";
          } else {
            if (definitions[op[0]].values !== void 0) {
              valkey = keys(definitions[op[0]].values);
              b2 = valkey.length;
              do {
                b2 = b2 - 1;
                if (valkey[b2] === op[1]) {
                  prettify3.rules[op[0]] = op[1];
                  break;
                }
              } while (b2 > 0);
            } else {
              if (op[0] === "language") {
                lang = op[1];
              } else if (op[0] === "lexer") {
                lex = op[1];
              }
              prettify3.rules[op[0]] = op[1];
            }
          }
        }
      } while (a2 > 0);
      if (lex === NIL && lang !== NIL)
        lex = setLexer(lang);
    }
  }
  if (prettify3.lexer === "script") {
    if (prettify3.rules.script.styleGuide !== void 0) {
      switch (prettify3.rules.script.styleGuide) {
        case "airbnb":
          prettify3.rules.wrap = 80;
          prettify3.rules.indentChar = " ";
          prettify3.rules.indentSize = 2;
          prettify3.rules.preserveLine = 1;
          prettify3.rules.script.correct = true;
          prettify3.rules.script.quoteConvert = "single";
          prettify3.rules.script.variableList = "each";
          prettify3.rules.script.endComma = "always";
          prettify3.rules.script.bracePadding = true;
          break;
        case "crockford":
          prettify3.rules.indentChar = " ";
          prettify3.rules.indentSize = 4;
          prettify3.rules.script.correct = true;
          prettify3.rules.script.bracePadding = false;
          prettify3.rules.script.elseNewline = false;
          prettify3.rules.script.endComma = "never";
          prettify3.rules.script.noCaseIndent = true;
          prettify3.rules.script.functionSpace = true;
          prettify3.rules.script.variableList = "each";
          prettify3.rules.script.vertical = false;
          break;
        case "google":
          prettify3.rules.wrap = -1;
          prettify3.rules.indentChar = " ";
          prettify3.rules.indentSize = 4;
          prettify3.rules.preserveLine = 1;
          prettify3.rules.script.correct = true;
          prettify3.rules.script.quoteConvert = "single";
          prettify3.rules.script.vertical = false;
          break;
        case "jquery":
          prettify3.rules.wrap = 80;
          prettify3.rules.indentChar = "	";
          prettify3.rules.indentSize = 1;
          prettify3.rules.script.correct = true;
          prettify3.rules.script.bracePadding = true;
          prettify3.rules.script.quoteConvert = "double";
          prettify3.rules.script.variableList = "each";
          break;
        case "jslint":
          prettify3.rules.indentChar = " ";
          prettify3.rules.indentSize = 4;
          prettify3.rules.script.correct = true;
          prettify3.rules.script.bracePadding = false;
          prettify3.rules.script.elseNewline = false;
          prettify3.rules.script.endComma = "never";
          prettify3.rules.script.noCaseIndent = true;
          prettify3.rules.script.functionSpace = true;
          prettify3.rules.script.variableList = "each";
          prettify3.rules.script.vertical = false;
          break;
        case "standard":
          prettify3.rules.wrap = 0;
          prettify3.rules.indentChar = " ";
          prettify3.rules.indentSize = 2;
          prettify3.rules.endNewline = false;
          prettify3.rules.preserveLine = 1;
          prettify3.rules.script.correct = true;
          prettify3.rules.script.noSemicolon = true;
          prettify3.rules.script.endComma = "never";
          prettify3.rules.script.braceNewline = false;
          prettify3.rules.script.bracePadding = false;
          prettify3.rules.script.braceAllman = false;
          prettify3.rules.script.quoteConvert = "single";
          prettify3.rules.script.functionSpace = true;
          prettify3.rules.script.ternaryLine = false;
          prettify3.rules.script.variableList = "each";
          prettify3.rules.script.vertical = false;
          break;
        case "yandex":
          prettify3.rules.script.correct = true;
          prettify3.rules.script.bracePadding = false;
          prettify3.rules.script.quoteConvert = "single";
          prettify3.rules.script.variableList = "each";
          prettify3.rules.script.vertical = false;
          break;
      }
    }
    if (prettify3.rules.script.braceStyle !== void 0) {
      switch (prettify3.rules.script.braceStyle) {
        case "collapse":
          prettify3.rules.script.braceNewline = false;
          prettify3.rules.script.bracePadding = false;
          prettify3.rules.script.braceAllman = false;
          prettify3.rules.script.objectIndent = "indent";
          prettify3.rules.script.neverFlatten = true;
          break;
        case "collapse-preserve-inline":
          prettify3.rules.script.braceNewline = false;
          prettify3.rules.script.bracePadding = true;
          prettify3.rules.script.braceAllman = false;
          prettify3.rules.script.objectIndent = "indent";
          prettify3.rules.script.neverFlatten = false;
          break;
        case "expand":
          prettify3.rules.script.braceNewline = false;
          prettify3.rules.script.bracePadding = false;
          prettify3.rules.script.braceAllman = true;
          prettify3.rules.script.objectIndent = "indent";
          prettify3.rules.script.neverFlatten = true;
          break;
      }
    }
    if (prettify3.rules.language === "json")
      prettify3.rules.wrap = 0;
  }
  do {
    if (prettify3.rules[keys[a]] !== void 0) {
      definitions[keys[a]].lexer.length;
    }
    a = a + 1;
  } while (a < len);
}

// src/parse/mode.ts
function parser({
  source,
  lexers: lexers2,
  lexer,
  rules: rules3,
  rules: {
    language: language2
  }
}) {
  if (typeof lexers2[lexer] === "function") {
    lexers2[lexer](`${source} `);
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
    if (lexer === "script" && (language2 === "json" && rules3.json.objectSort === true || rules3.language !== "json" && rules3.script.objectSort === true)) {
      parse.sortCorrect(0, parse.count + 1);
    } else if (lexer === "style" && rules3.style.sortProperties === true) {
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
function blank(prettify3) {
  const { languageName } = reference(prettify3.rules.language);
  const crlf = prettify3.rules.crlf === true ? "\r\n" : "\n";
  const input = prettify3.source.match(/\n/g);
  const timer = stats2(languageName);
  let output = NIL;
  if (input === null) {
    if (prettify3.rules.endNewline)
      output = crlf;
    prettify3.stats = timer(output.length);
  } else {
    output = input[0].length > prettify3.rules.preserveLine ? repeatChar(prettify3.rules.preserveLine, crlf) : repeatChar(input[0].length, crlf);
    if (prettify3.rules.endNewline)
      output += crlf;
    prettify3.stats = timer(output.length);
  }
  return output;
}
function execute(prettify3) {
  prettify3.data = parse.full();
  if (!/\S/.test(prettify3.source))
    return blank(prettify3);
  if (prettify3.rules.language === "text") {
    prettify3.rules.language = "text";
    prettify3.rules.languageName = "Plain Text";
    prettify3.lexer = "markup";
  } else if (prettify3.lexer === "auto" && prettify3.rules.language !== "text") {
    prettify3.lexer = setLexer(prettify3.rules.language);
    prettify3.rules.languageName = setLanguageName(prettify3.rules.language);
  } else if (prettify3.rules.language === "auto" || prettify3.rules.language === void 0) {
    const { lexer, language: language2, languageName } = detect(prettify3.source);
    if (language2 === "unknown") {
      console.warn("Prettify: unknown and/or unsupport language");
      console.info("Prettify: define a support language (fallback is HTML)");
    }
    prettify3.lexer = lexer;
    prettify3.rules.language = language2;
    prettify3.rules.languageName = languageName;
  } else {
    const { lexer, language: language2, languageName } = reference(prettify3.rules.language);
    if (language2 === "unknown") {
      console.warn(`Prettify: unsupport ${prettify3.rules.language}`);
      console.info("Prettify: language is not supported (fallback is HTML)");
    }
    prettify3.lexer = lexer;
    prettify3.rules.language = language2;
    prettify3.rules.languageName = languageName;
  }
  const crlf = prettify3.rules.crlf === true ? "\r\n" : "\n";
  const time = stats2(prettify3.rules.languageName);
  if (comment(prettify3) === false) {
    prettify3.stats = time(prettify3.source.length);
    return prettify3.source;
  }
  prettify3.data = parser(prettify3);
  if (prettify3.mode === "parse") {
    prettify3.stats = time(prettify3.source.length);
    return parse.data;
  }
  const beautify = prettify3.beautify[prettify3.lexer](prettify3.rules);
  const output = prettify3.rules.endNewline === true ? beautify.replace(/\s*$/, crlf) : beautify.replace(/\s+$/, NIL);
  prettify3.stats = time(output.length);
  prettify3.end = 0;
  prettify3.start = 0;
  console.log(parse);
  return output;
}

// src/prettify.ts
var prettify_default = function() {
  defineProperties(format2, {
    stats: {
      get() {
        return prettify2.stats;
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
      value: format2.bind({ sync: true })
    }
  });
  function format2(source, options) {
    console.time("time");
    prettify2.source = source;
    prettify2.mode = "beautify";
    if (typeof this.language === "string" && this.language !== rules2.language) {
      rules2.language = this.language;
    }
    if (typeof options === "object")
      ruleOptions(options);
    if (events.dispatch("before", rules2, source) === false)
      return source;
    const output = execute(prettify2);
    if (events.dispatch("after", output, rules2) === false)
      return source;
    if (this.sync === true) {
      if (parse.error.length)
        throw new Error(parse.error);
      return output;
    }
    console.timeEnd("time");
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
      return rules2;
    let changes;
    if (events.rules.length > 0) {
      changes = assign({}, rules2);
    }
    for (const rule in options) {
      if (rule === "wrap") {
        rules2.wrap = options[rule];
      } else if (rule === "language") {
        language.set(options[rule]);
      } else if (rule === "indentLevel") {
        rules2.indentLevel = options[rule];
      } else if (rule === "endNewline") {
        rules2.endNewline = options[rule];
      } else if (rule === "indentChar") {
        rules2.indentChar = options[rule];
      } else if (rule === "indentSize") {
        rules2.indentSize = options[rule];
      } else if (rule === "preserveLine") {
        rules2.preserveLine = options[rule];
      } else if (rule === "crlf") {
        rules2.crlf = options[rule];
      } else if (rule === "liquid") {
        assign(rules2.liquid, options[rule]);
      } else if (rule === "markup") {
        assign(rules2.markup, options[rule]);
      } else if (rule === "script") {
        assign(rules2.script, options[rule]);
      } else if (rule === "style") {
        assign(rules2.style, options[rule]);
      } else if (rule === "json") {
        assign(rules2.json, options[rule]);
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
          cb(diff, prettify2.rules);
      }
    }
    return rules2;
  }
  defineProperties(parse4, {
    stats: {
      get() {
        return stats;
      }
    },
    sync: {
      value: parse4.bind({ sync: true })
    }
  });
  function parse4(source, options) {
    prettify2.source = source;
    prettify2.mode = "parse";
    if (typeof options === "object")
      ruleOptions(options);
    const parsed = execute(prettify2);
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
    parse: parse4,
    format: format2,
    liquid: format2.bind({ language: "liquid" }),
    html: format2.bind({ language: "html" }),
    css: format2.bind({ language: "css" }),
    json: format2.bind({ language: "json" }),
    get rules() {
      return ruleOptions;
    },
    get error() {
      return parse.error.length ? prettify2.error : null;
    },
    get language() {
      return detect;
    },
    get grammar() {
      return grammar.extend;
    }
  };
}();

module.exports = prettify_default;
