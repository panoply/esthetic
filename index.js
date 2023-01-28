'use strict';

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// src/lexical/chars.ts
var NIL = "";
var DQO = '"';
var SQO = "'";
var WSP = " ";
var NWL = "\n";
var CNL = "\r\n";

// src/utils/maps.ts
function getLanguageName(language) {
  if (typeof language === "string") {
    return {
      html: "HTML",
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
      javascript: "JavaScript",
      typescript: "TypeScript"
    }[language];
  }
}
function getLexerName(language) {
  if (typeof language === "string") {
    return {
      text: "ignore",
      auto: "ignore",
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
      css: "style"
    }[language];
  }
}
function getLexerType(language) {
  if (typeof language === "string") {
    return {
      text: 4 /* Ignore */,
      auto: 4 /* Ignore */,
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
      css: 3 /* Style */
    }[language];
  }
}

// src/utils/helpers.ts
function stats(language, lexer) {
  const store = {
    lexer,
    language: getLanguageName(language),
    chars: 0
  };
  const start = Date.now();
  return (output) => {
    const time = +(Date.now() - start).toFixed(0);
    store.time = time > 1e3 ? `${time}s` : `${time}ms`;
    store.chars = output;
    store.size = size(output);
    return store;
  };
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
function isLast(string, code) {
  return is(string[string.length - 1], code);
}
function not(string, code) {
  return is(string, code) === false;
}
function notLast(string, code) {
  return isLast(string, code) === false;
}
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

// src/utils/native.ts
var assign = Object.assign;
var defineProperties = Object.defineProperties;
var isArray = Array.isArray;

// src/parse/sorting.ts
function sortObject(data) {
  let cc2 = parse.count;
  let dd = parse.stack.index;
  let ee = 0;
  let ff = 0;
  let gg = 0;
  let behind = 0;
  let front = 0;
  let keyend = 0;
  let keylen = 0;
  let comma = true;
  const { count } = parse;
  const token = parse.stack.token;
  const begin = parse.stack.index;
  const lines = parse.lineOffset;
  const style3 = data.lexer[count] === "style";
  const global = style3 && token === "global";
  const delim = style3 ? [";", "separator"] : [",", "separator"];
  const keys2 = [];
  const store = {
    begin: [],
    ender: [],
    lexer: [],
    lines: [],
    stack: [],
    token: [],
    types: []
  };
  function sort(x, y) {
    let xx = x[0];
    let yy = y[0];
    if (data.types[xx] === "comment") {
      do
        xx = xx + 1;
      while (xx < count && data.types[xx] === "comment");
      if (data.token[xx] === void 0)
        return 1;
    }
    if (data.types[yy] === "comment") {
      do
        yy = yy + 1;
      while (yy < count && data.types[yy] === "comment");
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
  behind = cc2;
  do {
    if (data.begin[cc2] === dd || global && cc2 < behind && is(data.token[cc2], 125 /* RCB */) && data.begin[data.begin[cc2]] === -1) {
      if (data.types[cc2].indexOf("liquid") > -1)
        return;
      if (data.token[cc2] === delim[0] || style3 === true && is(data.token[cc2], 125 /* RCB */) && not(data.token[cc2 + 1], 59 /* SEM */)) {
        comma = true;
        front = cc2 + 1;
      } else if (style3 === true && is(data.token[cc2 - 1], 125 /* RCB */)) {
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
      if (comma === true && (data.token[cc2] === delim[0] || style3 === true && is(data.token[cc2 - 1], 125 /* RCB */)) && front <= behind) {
        if (style3 === true && "};".indexOf(data.token[behind]) < 0) {
          behind = behind + 1;
        } else if (style3 === false && not(data.token[behind], 44 /* COM */)) {
          behind = behind + 1;
        }
        keys2.push([front, behind]);
        if (style3 === true && is(data.token[front], 125 /* RCB */)) {
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
    if (style3 === true || parse.language === "json" || is(data.token[cc2 - 1], 61 /* EQS */) || is(data.token[cc2 - 1], 58 /* COL */) || is(data.token[cc2 - 1], 40 /* LPR */) || is(data.token[cc2 - 1], 91 /* LSB */) || is(data.token[cc2 - 1], 44 /* COM */) || data.types[cc2 - 1] === "word" || cc2 === 0) {
      keys2.sort(sort);
      keylen = keys2.length;
      comma = false;
      dd = 0;
      do {
        keyend = keys2[dd][1];
        if (style3 === true) {
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
        if (style3 === true && data.types[keyend - 1] !== "end" && data.types[keyend] === "comment" && data.types[keyend + 1] !== "comment" && dd < keylen - 1) {
          keyend = keyend + 1;
        }
        if (ee < keyend) {
          do {
            if (style3 === false && dd === keylen - 1 && ee === keyend - 2 && is(data.token[ee], 44 /* COM */) && data.lexer[ee] === "script" && data.types[ee + 1] === "comment") {
              ff = ff + 1;
            } else {
              parse.push(store, {
                begin: data.begin[ee],
                ender: data.begin[ee],
                lexer: data.lexer[ee],
                lines: data.lines[ee],
                stack: data.stack[ee],
                token: data.token[ee],
                types: data.types[ee]
              }, NIL);
              ff = ff + 1;
            }
            if (data.token[ee] === delim[0] && (style3 === true || data.begin[ee] === data.begin[keys2[dd][0]])) {
              comma = true;
            } else if (data.token[ee] !== delim[0] && data.types[ee] !== "comment") {
              comma = false;
            }
            ee = ee + 1;
          } while (ee < keyend);
        }
        if (comma === false && store.token[store.token.length - 1] !== "x;" && (style3 === true || dd < keylen - 1)) {
          ee = store.types.length - 1;
          if (store.types[ee] === "comment") {
            do
              ee = ee - 1;
            while (ee > 0 && store.types[ee] === "comment");
          }
          ee = ee + 1;
          parse.splice({
            data: store,
            howmany: 0,
            index: ee,
            record: {
              begin,
              stack: global ? "global" : token,
              ender: parse.count,
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
      parse.splice({ data, howmany: ff, index: cc2 + 1 });
      parse.lineOffset = lines;
      parse.concat(data, store);
    }
  }
}
function sortSafe(array, operation, recursive) {
  if (isArray(array) === false)
    return array;
  if (operation === "normal") {
    return safeSortNormal.call({ array, recursive }, array);
  }
  if (operation === "descend")
    return safeSortDescend.call({ recursive }, array);
  return safeSortAscend.call({ recursive }, array);
}
function sortCorrect(start, end) {
  let a = start;
  let endslen = -1;
  const { data } = parse;
  const ends = [];
  const structure = parse.stack.length < 2 ? [-1] : [parse.stack[parse.stack.length - 2][1]];
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
function safeSortAscend(item) {
  let c = 0;
  const len = item.length;
  const storeb = item;
  const ascendChild = () => {
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
  const ascendRecurse = (value = NIL) => {
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
      ascendRecurse();
    } else {
      if (this.recursive === true)
        ascendChild();
      item = storeb;
    }
    return value;
  };
  ascendRecurse();
  return item;
}
function safeSortDescend(item) {
  let c = 0;
  const len = item.length;
  const storeb = item;
  const descendChild = () => {
    const lenc = storeb.length;
    let a = 0;
    if (a < lenc) {
      do {
        if (isArray(storeb[a]))
          storeb[a] = safeSortDescend.apply(this, storeb[a]);
        a = a + 1;
      } while (a < lenc);
    }
  };
  const descendRecurse = (value = "") => {
    let a = c;
    let b = 0;
    let d = 0;
    let e = 0;
    let key = storeb[c];
    let ind = [];
    let tstore = NIL;
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
      descendRecurse();
    } else {
      if (this.recursive === true)
        descendChild();
      item = storeb;
    }
    return value;
  };
  descendRecurse();
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

// src/parse/grammar.ts
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
    extend(rules) {
      for (const rule in rules) {
        if (isArray(rules[rule])) {
          for (const tag of rules[rule]) {
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
        } else if (rule === "embedded") {
          if (typeof rules[rule] === "object") {
            embed(rules[rule]);
          }
        }
      }
    }
  };
  function embed(rules) {
    for (const tag in rules) {
      for (const { language, argument = null } of rules[tag]) {
        if (!(tag in EMBEDDED)) {
          EMBEDDED[tag] = {
            tag,
            language,
            args: /* @__PURE__ */ new Map([[/* @__PURE__ */ new Set(), { tag, language }]])
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
function SVGGrammar(grammar2 = {
  tags: [
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
  ]
}) {
  const TAGS = new Set(grammar2.tags);
  return {
    get grammar() {
      return grammar2;
    },
    get tags() {
      return TAGS;
    },
    extend(rules) {
      for (const rule in rules) {
        if (isArray(rules[rule])) {
          for (const tag of rules[rule]) {
            if (rule === "tags" && TAGS.has(tag) === false) {
              grammar2.tags.push(tag);
              TAGS.add(tag);
            }
          }
        }
      }
    }
  };
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
  const TAGS = new Set(grammar2.tags);
  const VOIDS = new Set(grammar2.voids);
  const EMBEDDED = {};
  embed(grammar2.embedded);
  return {
    get grammar() {
      return grammar2;
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
    extend(rules) {
      for (const rule in rules) {
        if (isArray(rules[rule])) {
          for (const tag of rules[rule]) {
            if (rule === "tags" && TAGS.has(tag) === false) {
              grammar2.tags.push(tag);
              TAGS.add(tag);
            } else if (rule === "voids" && VOIDS.has(tag) === false) {
              grammar2.voids.push(tag);
              VOIDS.add(tag);
            }
          }
        } else if (rule === "embedded") {
          if (typeof rules[rule] === "object") {
            embed(rules[rule]);
          }
        }
      }
    }
  };
  function embed(rules) {
    for (const tag in rules) {
      if (!(tag in EMBEDDED))
        EMBEDDED[tag] = { tag, attr: /* @__PURE__ */ new Map() };
      for (const { language, attribute } of rules[tag]) {
        if (!("language" in EMBEDDED[tag]))
          EMBEDDED[tag].language = language;
        if (!EMBEDDED[tag].attr.has(language)) {
          EMBEDDED[tag].attr.set(language, { tag, language, attr: /* @__PURE__ */ new Map() });
        }
        if (attribute) {
          const entry = EMBEDDED[tag].attr.get(language);
          for (const attr in attribute) {
            if (!entry.attr.has(attr)) {
              entry.attr.set(attr, {
                tag,
                language,
                attr,
                value: /* @__PURE__ */ new Set()
              });
            }
            const curr = EMBEDDED[tag].attr.get(language).attr.get(attr);
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
    atrules(token) {
      return ATRULES.has(token.slice(0, token.indexOf("(")).trim());
    },
    extend(rules) {
      for (const rule in rules) {
        if (isArray(rules[rule])) {
          for (const tag of rules[rule]) {
            if (rule === "units" && !UNITS.has(tag)) {
              grammar2[rule].push(tag);
              UNITS.add(tag);
            } else if (rule === "atrules" && !ATRULES.has(tag)) {
              grammar2[rule].push(tag);
              ATRULES.add(tag);
            }
          }
        }
        if (typeof rules[rule] === "object") {
          for (const prop in rules[rule]) {
            if (isArray(rules[rule][prop])) {
              for (const tag of rules[rule][prop]) {
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
    extend(rules) {
      for (const rule in rules) {
        if (isArray(rules[rule])) {
          for (const tag of rules[rule]) {
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
var grammar = function() {
  const css = CSSGrammar();
  const liquid = LiquidGrammar();
  const js = JavaScriptGrammar();
  const html = HTMLGrammar();
  const svg = SVGGrammar();
  return {
    html,
    liquid,
    js,
    css,
    svg,
    extend(options) {
      if (typeof options === "object") {
        for (const language in options) {
          if (language === "liquid") {
            liquid.extend(options.liquid);
          } else if (language === "html") {
            html.extend(options.html);
          } else if (language === "css") {
            css.extend(options.css);
          } else if (language === "js") {
            js.extend(options.js);
          } else if (language === "svg") {
            js.extend(options.js);
          }
        }
      }
      return {
        get html() {
          return html.grammar;
        },
        get liquid() {
          return liquid.grammar;
        },
        get js() {
          return js.grammar;
        },
        get css() {
          return css.grammar;
        },
        get svg() {
          return css.grammar;
        }
      };
    }
  };
}();

// src/lexical/regex.ts
var SpaceLead = /^\s+/;
var SpaceEnd = /\s+$/;
var StripLead = /^[\t\v\f\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]+/;
var StripEnd = /[\t\v\f \u00a0\u2000-\u200b\u2028-\u2029\u3000]+$/;
var SpaceOnly = /[\t\v\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]+/g;
var CommIgnoreStart = /(\/[*/]|{%-?\s*(?:comment\s*-?%}|#)|<!-{2})\s*esthetic-ignore-start\b/;
var CommLineIgnoreStart = /^\/\/\s*esthetic-ignore-start\b/;
var CommBlockIgnoreStart = /^\/\*{1,2}(?:\s*|\n\s*\*\s*)esthetic-ignore-start\b/;
var CommIgnoreNext = /(\/[*/]|{%-?\s*(?:comment\s*-?%}|#)|<!-{2})\s*esthetic-ignore-next\b/;
var LiquidDelimiters = /{%-?|-?%}/g;
var LiquidTag = /^{%-?\s*liquid\b/;
var LiquidComment = /^{%-?\s*(?:#|comment\b)/;
var CharEscape = /(\/|\\|\||\*|\[|\]|\{|\})/g;

// src/comments/block.ts
function commentBlock(config) {
  const { rules } = parse;
  const build = [];
  const second = [];
  const sanitize = config.begin.replace(CharEscape, sanitizeComment);
  const isliquid = is(config.begin[0], 123 /* LCB */) && is(config.begin[1], 37 /* PER */);
  const expignore = new RegExp(`^(${sanitize}\\s*esthetic-ignore-start)`);
  const expstart = new RegExp(`(${sanitize}\\s*)`);
  const regEnd = isliquid ? new RegExp(`\\s*${config.ender.replace(LiquidDelimiters, (i) => is(i, 123 /* LCB */) ? "{%-?\\s*" : "\\s*-?%}")}$`) : new RegExp(config.ender.replace(CharEscape, sanitizeComment));
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
  function parseEmptyLines() {
    if (/^\s+$/.test(lines[b + 1]) || lines[b + 1] === NIL) {
      do
        b = b + 1;
      while (b < len && (/^\s+$/.test(lines[b + 1]) || lines[b + 1] === NIL));
    }
    if (b < len - 1)
      second.push(NIL);
  }
  function parseIgnoreComment() {
    let termination = NWL;
    a = a + 1;
    do {
      build.push(config.chars[a]);
      if (build.slice(build.length - 19).join(NIL) === "esthetic-ignore-end") {
        if (isliquid) {
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
    if (config.chars[a] === NWL) {
      parse.lineNumber = parse.lineNumber + 1;
      parse.lineOffset = parse.lineOffset + 1;
    }
    if (config.chars[a] === term && config.chars.slice(a - terml, a + 1).join(NIL) === config.ender)
      break;
    a = a + 1;
  } while (a < config.end);
  output = build.join(NIL);
  if (expignore.test(output) === true)
    return parseIgnoreComment();
  if (isliquid === true && rules.liquid.preserveComment === true || isliquid === false && rules.markup.preserveComment === true || parse.lexer === "style" && rules.style.preserveComment === true || parse.lexer === "script" && rules.style.preserveComment === true || rules.wrap < 1 || a === config.end || output.length <= rules.wrap && output.indexOf(NWL) < 0 || config.begin === "/*" && output.indexOf(NWL) > 0 && output.replace(NWL, NIL).indexOf(NWL) > 0 && /\n(?!(\s*\*))/.test(output) === false) {
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
  lines[0] = lines[0].replace(expstart, NIL);
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
      parseEmptyLines();
    } else if (lines[b].replace(StripLead, NIL).length > rules.wrap && lines[b].replace(StripLead, NIL).indexOf(WSP) > rules.wrap) {
      lines[b] = lines[b].replace(StripLead, NIL);
      c = lines[b].indexOf(WSP);
      second.push(lines[b].slice(0, c));
      lines[b] = lines[b].slice(c + 1);
      b = b - 1;
    } else {
      lines[b] = config.begin === "/*" && lines[b].indexOf("/*") !== 0 ? `   ${lines[b].replace(StripLead, NIL).replace(StripEnd, NIL).replace(/\s+/g, WSP)}` : `${lines[b].replace(StripLead, NIL).replace(StripEnd, NIL).replace(/\s+/g, WSP)}`;
      twrap = b < 1 ? rules.wrap - (config.begin.length + 1) : rules.wrap;
      c = lines[b].length;
      d = lines[b].replace(StripLead, NIL).indexOf(WSP);
      if (c > twrap && d > 0 && d < twrap) {
        c = twrap;
        do {
          c = c - 1;
          if (ws(lines[b].charAt(c)) && c <= rules.wrap)
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
        } else if (lines[b].replace(StripLead, NIL).indexOf(WSP) < rules.wrap) {
          lines[b + 1] = lines[b].length > rules.wrap ? lines[b].slice(c + 1) + parse.crlf + lines[b + 1] : `${lines[b].slice(c + 1)} ${lines[b + 1]}`;
        }
        if (emptyLine === false && bulletLine === false && numberLine === false) {
          lines[b] = lines[b].slice(0, c);
        }
      } else if (lines[b + 1] !== void 0 && (lines[b].length + bline.indexOf(WSP) > rules.wrap && bline.indexOf(WSP) > 0 || lines[b].length + bline.length > rules.wrap && bline.indexOf(WSP) < 0)) {
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
    if (second[second.length - 1].length > rules.wrap - (config.ender.length + 1)) {
      second.push(config.ender);
    } else {
      second.push(config.ender);
    }
    output = second.join(parse.crlf);
  } else {
    lines[lines.length - 1] = lines[lines.length - 1] + config.ender;
    output = lines.join(parse.crlf);
  }
  return [output, a];
}

// src/comments/line.ts
function commentLine(config) {
  const { wrap } = parse.rules;
  const { preserveComment } = parse.rules[parse.lexer];
  let a = config.start;
  let b = 0;
  let output = NIL;
  let build = [];
  function traverse() {
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
        traverse();
      }
    }
  }
  function wordwrap() {
    const lines = [];
    const record = {
      ender: -1,
      types: "comment",
      lexer: config.lexer,
      lines: parse.lineOffset
    };
    if (parse.count > -1) {
      record.begin = parse.stack.index;
      record.stack = parse.stack.token;
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
      parse.lineOffset = 2;
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
  if (CommLineIgnoreStart.test(output) === true) {
    let termination = NWL;
    a = a + 1;
    do {
      build.push(config.chars[a]);
      a = a + 1;
    } while (a < config.end && (not(config.chars[a - 1], 100) || is(config.chars[a - 1], 100) && build.slice(build.length - 19).join(NIL) !== "esthetic-ignore-end"));
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
  traverse();
  wordwrap();
  return [output, a];
}

// src/parse/definitions.ts
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
    indentAttributes: {
      default: false,
      description: "Whether or not markup tags with Liquid contained attributes should apply indentation",
      lexer: "liquid",
      type: "boolean"
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
    selfCloseSVG: {
      default: true,
      description: "Whether or not SVG type tags should be converted to self closing void types.",
      lexer: "markup",
      type: "boolean"
    },
    stripAttributeLines: {
      default: false,
      description: "Whether or not newlines contained within tag attributes should be removed or preserved.",
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
    preserveComment: {
      default: false,
      description: "Prevent comment reformatting due to option wrap.",
      lexer: "markup",
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

// src/lexical/lexing.ts
function getTagName(tag, slice = NaN) {
  if (typeof tag !== "string")
    return NIL;
  if (not(tag, 60 /* LAN */) && not(tag, 123 /* LCB */))
    return tag;
  if (is(tag, 60 /* LAN */)) {
    const next = tag.search(/[\s>]/);
    const name2 = tag.slice(is(tag[1], 47 /* FWS */) ? 2 : 1, next);
    return is(name2, 63 /* QWS */) && isLast(name2, 63 /* QWS */) ? "xml" : isNaN(slice) ? name2 : name2.slice(slice);
  }
  const name = is(tag[2], 45 /* DSH */) ? tag.slice(3).trimStart() : tag.slice(2).trimStart();
  const tname = name.slice(0, name.search(/[\s=|!<>,.[]|-?[%}]}/));
  return isNaN(slice) ? tname : tname.slice(slice);
}

// src/lexical/liquid.ts
function isOutput(input) {
  const begin = input.indexOf("{");
  return is(input[begin + 1], 123 /* LCB */);
}
function isControl(input) {
  const begin = input.indexOf("{");
  if (is(input[begin + 1], 37 /* PER */)) {
    let token;
    token = input.slice(begin + (is(input[begin + 2], 45 /* DSH */) ? 3 : 2)).trimStart();
    token = token.slice(0, token.search(/[\s=|!<>,.[]|-?[%}]}/));
    return token.startsWith("end") ? false : grammar.liquid.control.has(token);
  }
  return false;
}
function isElse(input) {
  const begin = input.indexOf("{");
  if (is(input[begin + 1], 37 /* PER */)) {
    let token;
    token = input.slice(begin + (is(input[begin + 2], 45 /* DSH */) ? 3 : 2)).trimStart();
    token = token.slice(0, token.search(/[\s=|!<>,.[]|-?[%}]}/));
    return token.startsWith("end") ? false : grammar.liquid.else.has(token);
  }
  return false;
}
function isValue(input) {
  const eq = input.indexOf("=");
  if (eq > -1) {
    if (is(input[eq + 1], 34 /* DQO */) || is(input[eq + 1], 39 /* SQO */)) {
      return /{%-?\s*end[a-z]+/.test(input.slice(eq, input.lastIndexOf(input[eq + 1])));
    }
  }
  return false;
}
function isChain(input) {
  if (isStart(input))
    return /{%-?\s*end\w+/.test(input);
  return false;
}
function isStart(input, strict = false) {
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
function isEnd(input) {
  let token = input;
  if (Array.isArray(input))
    token = input.join(NIL);
  const begin = token.indexOf("{");
  if (is(token[begin + 1], 37 /* PER */)) {
    if (is(token[begin + 2], 45 /* DSH */))
      return token.slice(begin + 3).trimStart().startsWith("end");
    return token.slice(begin + 2).trimStart().startsWith("end");
  }
  return false;
}
function isType(input, type) {
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

// src/parse/external.ts
function determine(tag, ref, attrs) {
  if (ref === "html") {
    if (!(tag in grammar.html.embed))
      return false;
    const token = grammar.html.embed[tag];
    if (token.attr.size > 0) {
      for (const attribute of token.attr.values()) {
        if (!attrs)
          return attribute;
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
    if (token.args.size > 0 && attrs) {
      const arg = attrs.slice(attrs.indexOf(tag) + tag.length).match(/\s*(.*)(?=\s)/)[0];
      for (const [match, key] of token.args) {
        if (match.has(arg)) {
          return key;
        } else {
          for (const test of match) {
            if (test instanceof RegExp && test.test(arg))
              return key;
          }
        }
      }
    }
    return token;
  }
}
function detect(tag, language) {
  if (typeof language !== "undefined")
    return tag in grammar[language].embed;
  return tag in grammar.html.embed || tag in grammar.liquid.embed;
}

// src/lexers/markup.ts
function markup(input) {
  const { data, rules } = parse;
  const source = input || parse.source;
  const jsx = rules.language === "jsx" || rules.language === "tsx";
  const ignored = new Set(rules.liquid.ignoreTagList);
  const asl = rules.markup.attributeSortList.length;
  const b = isArray(source) ? source : source.split(NIL);
  const c = b.length;
  const svg = {
    tname: [],
    index: []
  };
  let a = 0;
  let language;
  let embed = false;
  let html = markup ? rules.language : "html";
  let within = 0;
  function push(record, structure = NIL, param) {
    if (structure === NIL && param === void 0) {
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
  function inner(input2) {
    if (parse.language !== "html" && parse.language !== "liquid" && jsx === false)
      return input2;
    if (/(?:{[=#/]|%[>\]])|\}%[>\]]/.test(input2))
      return input2;
    if (!isType(input2, 3))
      return input2;
    const end = input2.length - 3;
    if (rules.liquid.delimiterTrims === "force") {
      if (is(input2[1], 37 /* PER */)) {
        if (not(input2[2], 45 /* DSH */))
          input2 = input2.replace(/^{%/, "{%-");
        if (not(input2[end], 45 /* DSH */))
          input2 = input2.replace(/%}$/, "-%}");
      } else {
        if (not(input2[2], 45 /* DSH */))
          input2 = input2.replace(/^{{/, "{{-");
        if (not(input2[end], 45 /* DSH */))
          input2 = input2.replace(/}}$/, "-}}");
      }
    } else if (rules.liquid.delimiterTrims === "strip") {
      input2 = input2.replace(/^{%-/, "{%").replace(/-%}$/, "%}").replace(/^{{-/, "{{").replace(/-}}$/, "}}");
    } else if (rules.liquid.delimiterTrims === "tags" && is(input2[1], 37 /* PER */)) {
      if (not(input2[2], 45 /* DSH */))
        input2 = input2.replace(/^{%/, "{%-");
      if (not(input2[end], 45 /* DSH */))
        input2 = input2.replace(/%}$/, "-%}");
    } else if (rules.liquid.delimiterTrims === "outputs" && is(input2[1], 123 /* LCB */)) {
      if (not(input2[2], 45 /* DSH */))
        input2 = input2.replace(/^{{/, "{{-");
      if (not(input2[end], 45 /* DSH */))
        input2 = input2.replace(/}}$/, "-}}");
    }
    if (rules.liquid.normalizeSpacing === false)
      return input2;
    if (LiquidComment.test(input2) || LiquidTag.test(input2))
      return input2;
    let t;
    let q = 0;
    return input2.split(/(["']{1})/).map((char, idx, arr) => {
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
  function selfclose(token) {
    if (rules.markup.correct === false || is(token[token.length - 2], 47 /* FWS */))
      return token;
    return /\/\s+>$/.test(token) ? `${token.slice(0, token.lastIndexOf("/"))}${rules.markup.selfCloseSpace ? "/>" : " />"}` : `${token.slice(0, -1)}${rules.markup.selfCloseSpace ? "/>" : " />"}`;
  }
  function attrname(x, withQuotes = true) {
    const eq = x.indexOf("=");
    if (eq > 0) {
      const dq = x.indexOf(DQO);
      if (eq < dq && dq > 0) {
        return withQuotes ? [x.slice(0, eq), x.slice(eq + 1)] : [x.slice(0, eq), x.slice(eq + 2, -1)];
      }
      const sq = x.indexOf(SQO);
      if (eq < sq && sq > 0) {
        return withQuotes ? [x.slice(0, eq), x.slice(eq + 1)] : [x.slice(0, eq), x.slice(eq + 2, -1)];
      }
    }
    return [x, NIL];
  }
  function parseError(ref) {
    console.log(ref);
  }
  function parseToken(end) {
    const record = {
      lexer: "markup",
      lines: parse.lineOffset,
      stack: parse.stack.token !== "global" ? parse.stack.token : "global",
      begin: parse.stack.index,
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
    function cdata() {
      if (ltype !== "cdata")
        return parseAttribute();
      return parseAttribute();
    }
    function parseLiquid() {
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
      if (rules.liquid.quoteConvert === "double") {
        record.token = record.token.replace(/'/g, DQO);
      } else if (rules.liquid.quoteConvert === "single") {
        record.token = record.token.replace(/"/g, SQO);
      }
      return cdata();
    }
    function parseSVG() {
      if (grammar.svg.tags.has(tname)) {
        if (record.types === "start") {
          record.types = "singleton";
          svg.tname.push(tname);
          svg.index.push(parse.count + 1);
        } else if (record.types === "end") {
          const i = svg.tname.indexOf(tname);
          const e = svg.tname.lastIndexOf(tname);
          if (i > -1) {
            if (e === i) {
              data.types[svg.index[e]] = "start";
              svg.tname.splice(e, 1);
              svg.index.splice(e, 1);
            } else {
              if (data.begin[parse.count] === svg.index[i]) {
                data.types[data.begin[parse.count]] = "start";
                svg.tname.splice(i, 1);
                svg.index.splice(i, 1);
              } else {
                data.types[svg.index[e]] = "start";
              }
            }
          }
        }
      }
      return parseLiquid();
    }
    function parseSingular() {
      if (basic && ignore === false && ltype !== "xml") {
        if (grammar.html.voids.has(tname)) {
          record.types = ltype = "singleton";
          if (not(token[token.length - 2], 47 /* FWS */)) {
            record.token = selfclose(token);
          }
        } else if (is(token[token.length - 2], 47 /* FWS */) && is(token[token.length - 1], 62 /* RAN */)) {
          record.types = ltype = "singleton";
        } else {
          record.types = ltype = "start";
        }
      }
      return parseSVG();
    }
    function parseIgnore() {
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
      } else if (detect(tname, "liquid") !== false && ignored.has(tname) === true) {
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
              if (is(b[a], 10 /* NWL */)) {
                parse.lineNumber = parse.lineNumber + 1;
                parse.lineIndex = a;
              }
              tags.push(b[a]);
              if (delim === NIL) {
                delim = is(b[a], 34 /* DQO */) ? DQO : is(b[a], 39 /* SQO */) ? SQO : NIL;
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
          data.types[parse.count] = "ignore";
          record.types = "ignore";
          record.token = token;
        } else {
          if (ltype.startsWith("liquid_")) ; else {
            record.types = "start";
            parseAttribute(true);
            const close = tags.lastIndexOf("<");
            const inner2 = tags.slice(0, close).join(NIL);
            if (!/\S/.test(inner2)) {
              push(record, [
                {
                  lexer: "markup",
                  types: "end",
                  token: tags.slice(close).join(NIL).trim()
                }
              ]);
            } else {
              push(record, [
                {
                  lexer: "markup",
                  types: ltype,
                  token: inner2
                },
                {
                  lexer: "markup",
                  types: "end",
                  token: tags.slice(close).join(NIL).trim()
                }
              ]);
            }
            embed = false;
            language = html;
            return parseScript();
          }
        }
      }
      return parseSingular();
    }
    function parseExternal() {
      if (is(token, 60 /* LAN */) && is(token[1], 47 /* FWS */))
        return parseIgnore();
      let item = attrs.length - 1;
      if (is(token, 60 /* LAN */)) {
        if (item > -1) {
          do {
            const q = determine(tname, "html", attrname(attrs[item][0], false));
            if (q !== false) {
              if (q.language === "json" && rules.markup.ignoreJSON) {
                ltype = "json_preserve";
                ignore = true;
                break;
              } else if (q.language === "javascript" && rules.markup.ignoreJS) {
                ltype = "script_preserve";
                ignore = true;
                break;
              } else if (q.language === "css" && rules.markup.ignoreCSS) {
                ltype = "style_preserve";
                ignore = true;
                break;
              } else {
                language = q.language;
                ltype = "start";
                embed = true;
                break;
              }
            }
            item = item - 1;
          } while (item > -1);
        } else {
          const q = determine(tname, "html");
          if (q !== false) {
            if (q.language === "json" && rules.markup.ignoreJSON) {
              ltype = "json_preserve";
              ignore = true;
            } else if (q.language === "javascript" && rules.markup.ignoreJS) {
              ltype = "script_preserve";
              ignore = true;
            } else if (q.language === "css" && rules.markup.ignoreCSS) {
              ltype = "style_preserve";
              ignore = true;
            } else {
              language = q.language;
              ltype = "start";
              embed = true;
            }
          }
        }
      } else if (isStart(token, true)) {
        const q = determine(tname, "liquid", token);
        if (q !== false) {
          if (ignored.has(tname)) {
            ignore = true;
            preserve = false;
            return parseIgnore();
          }
          embed = true;
          language = q.language;
        }
      }
      if (embed === true) {
        item = a + 1;
        if (item < c) {
          do {
            if (ws(b[item]) === false) {
              if (b[item] === "<") {
                if (b.slice(item + 1, item + 4).join(NIL) === "!--") {
                  item = item + 4;
                  if (item < c) {
                    do {
                      if (ws(b[item]) === false) {
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
      return parseIgnore();
    }
    function parseAttribute(advance = false) {
      push(record);
      const begin = parse.count;
      const stack = tname.replace(/\/$/, NIL);
      const qc = rules.markup.quoteConvert;
      let idx = 0;
      let eq = 0;
      let dq = 0;
      let name = NIL;
      let value = NIL;
      let len = attrs.length;
      function quotes() {
        if (parse.attributes.has(begin)) {
          if (idx + 1 === len && notLast(record.token, 62 /* RAN */)) {
            record.token = record.token + ">";
          }
        }
        let liq = record.types.indexOf("liquid_attribute") > -1;
        if (ignore === true || qc === "none" || record.types.indexOf("attribute") < 0 || liq === false && qc === "single" && record.token.indexOf(DQO) < 0 || liq === false && qc === "double" && record.token.indexOf(SQO) < 0) {
          push(record);
        } else {
          let ee = 0;
          let ex = false;
          const ch = record.token.split(NIL);
          const eq2 = record.token.indexOf("=");
          const ln = ch.length - 1;
          if (not(ch[eq2 + 1], 34 /* DQO */) && not(ch[ch.length - 1], 34 /* DQO */) && qc === "single" && liq === false) {
            push(record);
          } else if (not(ch[eq2 + 1], 39 /* SQO */) && not(ch[ch.length - 1], 39 /* SQO */) && qc === "double" && liq === false) {
            push(record);
          } else {
            ee = eq2 + 2;
            if (liq === false) {
              if (qc === "double") {
                if (record.token.slice(eq2 + 2, ln).indexOf(DQO) > -1)
                  ex = true;
                ch[eq2 + 1] = DQO;
                ch[ch.length - 1] = DQO;
              } else if (qc === "single") {
                if (record.token.slice(eq2 + 2, ln).indexOf(SQO) > -1)
                  ex = true;
                ch[eq2 + 1] = SQO;
                ch[ch.length - 1] = SQO;
              }
            }
            if (ex === true || liq === true) {
              liq = false;
              do {
                if (is(ch[ee - 1], 123 /* LCB */) && (is(ch[ee], 37 /* PER */) || is(ch[ee], 123 /* LCB */))) {
                  liq = true;
                } else if (is(ch[ee], 125 /* RCB */) && (is(ch[ee - 1], 37 /* PER */) || is(ch[ee - 1], 125 /* RCB */))) {
                  liq = false;
                }
                if (liq === true) {
                  if (is(ch[ee], 34 /* DQO */) && qc === "double") {
                    ch[ee] = SQO;
                  } else if (is(ch[ee], 39 /* SQO */) && qc === "single") {
                    ch[ee] = DQO;
                  }
                } else {
                  if (is(ch[ee], 39 /* SQO */) && qc === "double") {
                    ch[ee] = DQO;
                  } else if (is(ch[ee], 34 /* DQO */) && qc === "single") {
                    ch[ee] = SQO;
                  }
                }
                ee = ee + 1;
              } while (ee < ln);
            }
            push(record, { token: ch.join(NIL) });
          }
        }
      }
      function sorting() {
        if (!(!jsx && !jscomm && !nosort))
          return;
        if (asl === 0) {
          attrs = sortSafe(attrs, NIL, false);
          return;
        }
        const tstore = [];
        dq = 0;
        eq = 0;
        len = attrs.length;
        do {
          eq = 0;
          do {
            name = attrs[eq][0].split("=")[0];
            if (rules.markup.attributeSortList[dq] === name) {
              tstore.push(attrs[eq]);
              attrs.splice(eq, 1);
              len = len - 1;
              break;
            }
            eq = eq + 1;
          } while (eq < len);
          dq = dq + 1;
        } while (dq < asl);
        attrs = sortSafe(attrs, NIL, false);
        attrs = tstore.concat(attrs);
        len = attrs.length;
      }
      function jsxattr() {
        push(record, "jsx_attribute", {
          token: `${name}={`,
          types: "jsx_attribute_start"
        });
        parse.external("jsx", value.slice(1, value.length - 1));
        record.begin = parse.count;
        if (/\s\}$/.test(value)) {
          value = value.slice(0, value.length - 1);
          value = SpaceEnd.exec(value)[0];
          record.lines = value.indexOf("\n") < 0 ? 1 : value.split("\n").length;
        } else {
          record.lines = 0;
        }
        record.begin = parse.stack.index;
        record.stack = parse.stack.token;
        record.token = "}";
        record.types = "jsx_attribute_end";
        quotes();
      }
      function liqattr() {
        if (isChain(attrs[idx][0])) {
          record.types = "liquid_attribute_chain";
          record.token = attrs[idx][0];
        } else if (isEnd(attrs[idx][0])) {
          record.token = attrs[idx][0];
          record.types = "liquid_attribute_end";
          record.ender = record.begin;
        } else if (isStart(attrs[idx][0], true)) {
          record.types = "liquid_attribute_start";
          record.begin = parse.count;
          record.token = attrs[idx][0];
          quotes();
          return true;
        } else if (isElse(attrs[idx][0])) {
          record.types = "liquid_attribute_else";
          record.token = attrs[idx][0];
        } else {
          record.types = "attribute";
          record.token = attrs[idx][0];
        }
        quotes();
        return false;
      }
      if (attrs.length < 1) {
        if (advance !== true)
          return;
        return parseScript();
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
      if (rules.markup.attributeSort)
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
          if (attrs[idx][1] <= 1 && isChain(attrs[idx][0])) {
            if (!isValue(attrs[idx][0])) {
              record.types = "liquid_attribute_chain";
              record.token = attrs[idx][0];
              quotes();
              idx = idx + 1;
              continue;
            }
          }
          eq = attrs[idx][0].indexOf("=");
          dq = attrs[idx][0].indexOf(DQO);
          attrs[idx][0].indexOf(SQO);
          if (eq < 0) {
            if (isEnd(attrs[idx][0])) {
              record.token = attrs[idx][0];
              record.types = "liquid_attribute_end";
              record.ender = record.begin;
            } else if (isStart(attrs[idx][0], true)) {
              record.types = "liquid_attribute_start";
              record.begin = parse.count;
              record.token = attrs[idx][0];
            } else if (isElse(attrs[idx][0])) {
              record.types = "liquid_attribute_else";
              record.token = attrs[idx][0];
            } else if (isOutput(attrs[idx][0])) {
              record.types = "liquid_attribute";
              record.token = attrs[idx][0];
            } else if (is(attrs[idx][0], 35 /* HSH */) || is(attrs[idx][0], 91 /* LSB */) || is(attrs[idx][0], 123 /* LCB */) || is(attrs[idx][0], 40 /* LPR */) || jsx === true) {
              record.token = attrs[idx][0];
            } else {
              record.token = rules.markup.attributeCasing === "preserve" ? attrs[idx][0] : attrs[idx][0].toLowerCase();
            }
            quotes();
          } else if (isType(attrs[idx][0], 6)) {
            liqattr();
          } else {
            name = attrs[idx][0].slice(0, eq);
            value = attrs[idx][0].slice(eq + 1);
            if (rules.markup.attributeCasing === "lowercase-name") {
              name = name.toLowerCase();
              attrs[idx][0] = name + "=" + value;
            } else if (rules.markup.attributeCasing === "lowercase-value") {
              value = value.toLowerCase();
              attrs[idx][0] = name + "=" + value;
            } else if (rules.markup.attributeCasing === "lowercase") {
              name = name.toLowerCase();
              value = value.toLowerCase();
              attrs[idx][0] = name + "=" + value;
            }
            if (rules.markup.correct === true && not(value, 60 /* LAN */) && not(value, 123 /* LCB */) && not(value, 61 /* EQS */) && not(value, 34 /* DQO */) && not(value, 39 /* SQO */)) {
              value = DQO + value + DQO;
            }
            if (jsx === true && /^\s*{/.test(value)) {
              jsxattr();
              record.types = "attribute";
              record.begin = begin;
              record.stack = stack;
            } else {
              if (isType(name, 6)) {
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
        return parseScript();
    }
    function parseExclude(tag, from) {
      tag = tag.trimStart().split(/\s/)[0];
      if (tag === "comment" || ignored.has(tag)) {
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
    function parseComments(lineComment) {
      const comm = lineComment === true ? commentLine({
        chars: b,
        end: c,
        lexer: "markup",
        begin: start,
        start: a,
        ender: end
      }) : commentBlock({
        chars: b,
        end: c,
        lexer: "markup",
        begin: start,
        start: a,
        ender: end
      });
      token = comm[0];
      a = comm[1];
      if (token.replace(start, NIL).trimStart().startsWith("esthetic-ignore-start")) {
        push(record, { token, types: "ignore" });
      } else {
        if (is(token[0], 123 /* LCB */) && is(token[1], 37 /* PER */) && lineComment === false) {
          const begin = token.indexOf("%}", 2) + 2;
          const last = token.lastIndexOf("{%");
          token = inner(token.slice(0, begin)) + token.slice(begin, last) + inner(token.slice(last));
        }
        record.token = token;
        record.types = "comment";
        return parseExternal();
      }
    }
    function parseBadLiquid(offset) {
      const from = a;
      let i = a + offset;
      do {
        if (is(b[i], 62 /* RAN */)) {
          a = i;
          return b.slice(from, i + 1).join(NIL);
        }
        i = i + 1;
      } while (i < c);
    }
    function parseDelimiter() {
      if (end === "---") {
        start = "---";
        ltype = "ignore";
        preserve = true;
      } else if (is(b[a], 60 /* LAN */)) {
        if (is(b[a + 1], 123 /* LCB */) && (is(b[a + 2], 123 /* LCB */) || is(b[a + 2], 37 /* PER */))) {
          const x = parseBadLiquid(3);
          nowalk = true;
          parse.stack.push(["liquid_bad", parse.count]);
          push(record, { token: x, types: "liquid_start_bad" });
          return;
        } else if (is(b[a + 1], 47 /* FWS */)) {
          if (is(b[a + 2], 123 /* LCB */) && (is(b[a + 3], 123 /* LCB */) || is(b[a + 3], 37 /* PER */))) {
            const x = parseBadLiquid(3);
            push(record, { token: x, types: "liquid_end_bad" });
            return;
          } else {
            ltype = "end";
            end = ">";
          }
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
        } else if (is(b[a + 1], 63 /* QWS */)) {
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
          parse.stack.push(["script", parse.count]);
          push(record, { token: "{", types: "script_start" });
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
            parseExclude(tag, from);
            if (is(tag, 35 /* HSH */)) {
              ltype = "comment";
              end = "%}";
              lchar = end.charAt(end.length - 1);
              return parseComments(true);
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
      if (rules.markup.preserveAttributes)
        preserve = true;
      if (nowalk)
        return parseExternal();
      lchar = end.charAt(end.length - 1);
      if (ltype === "comment" && (is(b[a], 60 /* LAN */) || is(b[a], 123 /* LCB */) && is(b[a + 1], 37 /* PER */))) {
        return parseComments();
      } else if (a < c) {
        return traverse();
      }
      return parseExternal();
    }
    function parseScript() {
      if (rules.wrap > 0 && jsx === true) {
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
      parse.lineOffset = 0;
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
          if (each[0] === "data-esthetic-ignore")
            ignore = true;
        } else {
          attr = store.join(NIL);
          if (jsx === false || jsx && !is(attr[attr.length - 1], 125 /* RCB */))
            attr = attr.replace(/\s+/g, WSP);
          each = attrname(attr);
          if (each[0] === "data-esthetic-ignore")
            ignore = true;
          if (jsx && is(store[0], 123 /* LCB */) && is(store[store.length - 1], 125 /* RCB */))
            jsxparen = 0;
        }
        if (is(attr[0], 123 /* LCB */) && is(attr[1], 37 /* PER */))
          nosort = true;
        if (quotes === false) {
          if (isStart(attr))
            within = within + 1;
          if (isEnd(attr))
            within = within - 1;
        }
        attr = attr.replace(/^\u0020/, NIL).replace(/\u0020$/, NIL);
        store = attr.replace(/\r\n/g, NWL).split(NWL);
        if (!store.length)
          store[0] = store[0].replace(/\s+$/, NIL);
        attr = rules.crlf === true ? inner(store.join("\r\n")) : inner(store.join(NWL));
        if (within > 0 || isType(attr, 1)) {
          if (isType(attr, 5) === false) {
            lines = 0;
            if (is(b[a + 1], 10 /* NWL */) || is(b[a], 10 /* NWL */))
              lines = 2;
            if (is(b[a], 32 /* WSP */) && not(b[a + 1], 32 /* WSP */))
              lines = 1;
          } else {
            if (lines <= 2 && is(b[a + 1], 10 /* NWL */)) {
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
          } else if (lines > 0 && attrs[ln][1] === 0 && isEnd(attr) === true) {
            attrs[ln][0] = attrs[ln][0] + attr;
            attrs[ln][1] = lines;
            attr = NIL;
          } else if (lines > 0 && attrs[ln][1] === 0 && isType(attrs[ln][0], 4)) {
            attrs[ln][0] = attrs[ln][0] + attr;
            attr = NIL;
          } else if (attrs[ln][1] > 0 && lines === 0 && isControl(attr) === false) {
            lines = attrs[ln][1];
          } else if (attrs[ln][1] > 0 && lines > 0 && isEnd(attr) && !isType(attr, 6)) {
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
          parse.lineIndex = a;
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
            if (rules.markup.correct) {
              lexed.pop();
              lexed.push(">");
            } else {
              parse.error = parseError({
                lineNumber: parse.lineNumber,
                message: [
                  `Missing closing delimiter character: ${lexed.join(NIL)}`,
                  "\nTIP",
                  "esthetic can autofix these issues when the correct rule is enabled"
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
                  if (rules.markup.preserveAttributes === true) {
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
                  if (jsx === false && qattr === false && isliq === true && rules.markup.preserveAttributes === false) {
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
                          if (rules.markup.preserveAttributes === false) {
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
                    if (e === 0 && is(b[a], 62 /* RAN */) && qattr === true && isliq === false) ;
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
      return parseExternal();
    }
    return parseDelimiter();
  }
  function parseContent() {
    const now = a;
    const jsxbrace = jsx === true && is(data.token[parse.count], 123 /* LCB */);
    const regex = "([{!=,;.?:&<>";
    let lexed = [];
    let ltoke = NIL;
    let liner = parse.lineOffset;
    let name = NIL;
    if (embed === true) {
      if (jsxbrace === true) {
        name = "script";
      } else if (parse.stack.index > -1) {
        name = getTagName(data.token[parse.stack.index]);
      } else {
        name = getTagName(data.token[data.begin[parse.count]]);
      }
    }
    const record = {
      begin: parse.stack.index,
      ender: -1,
      lexer: "markup",
      lines: liner,
      stack: getTagName(parse.stack.token) || "global",
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
      let lq = -1;
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
              } else if (!jsx && name === "script" && not(b[a - 1], 60 /* LAN */) && regex.indexOf(b[a - 1]) > -1) {
                quote = "r";
              }
            } else if (esctest() === false && (is(b[a], 34 /* DQO */) || is(b[a], 39 /* SQO */) || is(b[a], 96 /* TQO */))) {
              quote = b[a];
            } else if (is(b[a], 123 /* LCB */) && jsxbrace === true) {
              quotes = quotes + 1;
            } else if (is(b[a], 125 /* RCB */) && jsxbrace === true) {
              if (quotes === 0) {
                output = lexed.join(NIL).replace(SpaceLead, NIL).replace(SpaceEnd, NIL);
                parse.external(language, output);
                parse.stack.update(parse.stack.index + 1);
                if (data.types[parse.count] === "end" && data.lexer[data.begin[parse.count] - 1] === "script") {
                  push(record, {
                    lexer: "script",
                    types: "separator",
                    token: rules.markup.correct === true ? ";" : "x;"
                  });
                  record.lexer = "markup";
                }
                push(record, {
                  token: "}",
                  types: "script_end"
                });
                parse.stack.pop();
                break;
              }
              quotes = quotes - 1;
            }
            if (data.types[parse.count] === "liquid_start") {
              lq = b.indexOf("%", a);
              if (is(b[lq - 1], 123 /* LCB */)) {
                end = is(b[lq + 1], 45 /* DSH */) ? b.slice(lq + 2, b.indexOf("%", lq + 3)).join(NIL).trimStart() : b.slice(lq + 1, b.indexOf("%", lq + 2)).join(NIL).trimStart();
                if (end.startsWith(`end${name}`)) {
                  lexed = b.slice(a, lq - 2);
                  if (lexed.length < 1)
                    break;
                  output = lexed.join(NIL).replace(SpaceLead, NIL).replace(SpaceEnd, NIL);
                  parse.external(language, output);
                  a = a + lexed.length;
                  end = b.slice(a, b.indexOf("}", a) + 1).join(NIL).replace(SpaceLead, NIL).replace(SpaceEnd, NIL);
                  a = a + end.length;
                  push(record, {
                    types: "liquid_end",
                    token: inner(end)
                  });
                  break;
                }
              }
            } else {
              if (name === "script") {
                end = b.slice(a + 1, a + 9).join(NIL).toLowerCase();
                if (end === "<\/script") {
                  output = lexed.join(NIL).replace(SpaceLead, NIL).replace(SpaceEnd, NIL);
                  if (lexed.length < 1)
                    break;
                  if (/^<!--+/.test(output) && /--+>$/.test(output)) {
                    push(record, { token: "<!--", types: "comment" });
                    output = output.replace(/^<!--+/, NIL).replace(/--+>$/, NIL);
                    parse.external("javascript", output);
                    push(record, { token: "-->" });
                  } else {
                    parse.external(language, output);
                    end = b.slice(a, b.indexOf(">", a + 9) + 1).join(NIL).replace(SpaceLead, NIL).replace(SpaceEnd, NIL);
                    a = a + end.length;
                    push(record, { types: "end", token: end });
                  }
                  break;
                }
              } else if (name === "style") {
                if (is(b[a + 1], 60 /* LAN */) && is(b[a + 2], 47 /* FWS */)) {
                  end = b.slice(a + 1, a + 8).join(NIL).toLowerCase();
                  if (end === "</style") {
                    output = lexed.join(NIL).replace(SpaceLead, NIL).replace(SpaceEnd, NIL);
                    if (lexed.length < 1)
                      break;
                    if (/^<!--+/.test(output) && /--+>$/.test(output)) {
                      push(record, { token: "<!--", types: "comment" });
                      output = output.replace(/^<!--+/, NIL).replace(/--+>$/, NIL);
                      parse.external("css", output);
                      push(record, { token: "-->" });
                    } else {
                      parse.external(language, output);
                      end = b.slice(a, b.indexOf(">", a + 8) + 1).join(NIL).replace(SpaceLead, NIL).replace(SpaceEnd, NIL);
                      a = a + end.length;
                      push(record, { types: "end", token: end });
                      break;
                    }
                  }
                }
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
          } else if (quote === "r" && is(b[a], 47 /* FWS */) && esctest() === false) {
            quote = NIL;
          } else if (is(quote, 47 /* FWS */) && is(b[a], 62 /* RAN */) && is(b[a - 1], 45 /* DSH */) && is(b[a - 2], 45 /* DSH */)) {
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
          ltoke = lexed.join(NIL).replace(SpaceEnd, NIL);
          push(record, { token: ltoke });
          break;
        }
        if (embed === false && lexed.length > 0 && (is(b[a], 60 /* LAN */) && not(b[a + 1], 61 /* EQS */) && digit(b[a + 1]) === false && ws(b[a + 1]) === false || is(b[a], 91 /* LSB */) && is(b[a + 1], 37 /* PER */) || is(b[a], 123 /* LCB */) && (jsx === true || is(b[a + 1], 123 /* LCB */) || is(b[a + 1], 37 /* PER */)))) {
          a = a - 1;
          liner = 0;
          ltoke = parse.stack.token === "comment" ? lexed.join(NIL) : lexed.join(NIL).replace(SpaceEnd, NIL);
          record.token = ltoke;
          if (rules.wrap > 0 && rules.markup.preserveText === false) {
            let wrapper2 = function() {
              if (is(ltoke[width], 32 /* WSP */)) {
                store.push(ltoke.slice(0, width));
                ltoke = ltoke.slice(width + 1);
                chars = ltoke.length;
                width = rules.wrap;
                return;
              }
              do
                width = width - 1;
              while (width > 0 && not(ltoke[width], 32 /* WSP */));
              if (width > 0) {
                store.push(ltoke.slice(0, width));
                ltoke = ltoke.slice(width + 1);
                chars = ltoke.length;
                width = rules.wrap;
              } else {
                width = rules.wrap;
                do
                  width = width + 1;
                while (width < chars && not(ltoke[width], 32 /* WSP */));
                store.push(ltoke.slice(0, width));
                ltoke = ltoke.slice(width + 1);
                chars = ltoke.length;
                width = rules.wrap;
              }
            };
            let width = rules.wrap;
            let chars = ltoke.length;
            const store = [];
            if (data.token[data.begin[parse.count]] === "<a>" && data.token[data.begin[data.begin[parse.count]]] === "<li>" && data.lines[data.begin[parse.count]] === 0 && parse.lineOffset === 0 && ltoke.length < rules.wrap) {
              push(record);
              break;
            }
            if (chars < rules.wrap) {
              push(record);
              break;
            }
            if (parse.lineOffset < 1 && parse.count > -1) {
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
            ltoke = lexed.join(NIL).replace(SpaceLead, NIL).replace(SpaceEnd, NIL).replace(/\s+/g, WSP);
            do
              wrapper2();
            while (width < chars);
            if (ltoke !== NIL && not(ltoke, 32 /* WSP */))
              store.push(ltoke);
            ltoke = store.join(parse.crlf);
            ltoke = NIL + ltoke + NIL;
          } else {
            const at = ltoke.indexOf(NWL);
            if (at > -1) {
              push(record, { token: ltoke.slice(0, at) });
              ltoke = ltoke.slice(at);
              if (/^\n+/.test(ltoke)) {
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
        lexed.push(b[a]);
        a = a + 1;
      } while (a < c);
    }
    if (a > now && a < c) {
      if (ws(b[a])) {
        let x = a;
        parse.lineOffset = parse.lineOffset + 1;
        do {
          if (is(b[x], 10 /* NWL */)) {
            parse.lineNumber = parse.lineNumber + 1;
            parse.lineOffset = parse.lineOffset + 1;
          }
          x = x - 1;
        } while (x > now && ws(b[x]));
      } else {
        parse.lineOffset = 0;
      }
    } else if (a !== now || a === now && embed === false) {
      ltoke = lexed.join(NIL).replace(SpaceEnd, NIL);
      liner = 0;
      if (record.token !== ltoke) {
        push(record, { token: ltoke });
        parse.lineOffset = 0;
      }
    }
    embed = false;
  }
  function parseSpace() {
    parse.lineOffset = 1;
    do {
      if (is(b[a], 10 /* NWL */)) {
        parse.lineIndex = a;
        parse.lineOffset = parse.lineOffset + 1;
        parse.lineNumber = parse.lineNumber + 1;
      }
      if (ws(b[a + 1]) === false)
        break;
      a = a + 1;
    } while (a < c);
  }
  if (rules.language === "html" || rules.language === "liquid")
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
}

// src/lexers/script.ts
function script() {
  const { data, references, rules, source } = parse;
  const option = parse.language === "json" ? rules.json : rules.script;
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
  let comment;
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
      begin: parse.stack.index,
      ender: -1,
      lexer: "script",
      lines: parse.lineOffset,
      stack: parse.stack.token,
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
  function applySemicolon(isEnd2) {
    const next = peek(1, false);
    const clist = parse.stack.length === 0 ? NIL : parse.stack.token;
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
    if (rules.language === "json") {
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
    if (record.types !== void 0 && record.types.indexOf("liquid") > -1 && record.types.indexOf("template_string") < 0) {
      return;
    }
    if (is(next, 59 /* SEM */) && isEnd2 === false) {
      return;
    }
    if (data.lexer[parse.count - 1] !== "script" && (a < b && b === source.length - 1 || b < source.length - 1)) {
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
    if (record.types === "comment" || clist === "method" || clist === "paren" || clist === "expression" || clist === "array" || clist === "object" || clist === "switch" && record.stack !== "method" && is(data.token[data.begin[parse.count]], 40 /* LPR */) && data.token[data.begin[parse.count] - 1] !== "return" && data.types[data.begin[parse.count] - 1] !== "operator") {
      return;
    }
    if (data.stack[parse.count] === "expression" && (data.token[data.begin[parse.count] - 1] !== "while" || data.token[data.begin[parse.count] - 1] === "while" && data.stack[data.begin[parse.count] - 2] !== "do")) {
      return;
    }
    if (next !== NIL && "=<>+*?|^:&%~,.()]".indexOf(next) > -1 && isEnd2 === false)
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
    if (option.variableList === "list")
      vstore.index[v] = parse.count;
    ltoke = option.correct === true ? ";" : "x;";
    ltype = "separator";
    i = parse.lineOffset;
    parse.lineOffset = 0;
    push();
    parse.lineOffset = i;
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
        lines: parse.lineOffset,
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
    comment = commentBlock({
      chars: c,
      end: b,
      lexer: "script",
      begin: "/*",
      start: a,
      ender: "*/"
    });
    a = comment[1];
    if (data.token[parse.count] === "var" || data.token[parse.count] === "let" || data.token[parse.count] === "const") {
      tstore = parse.pop(data);
      push();
      parse.push(data, tstore, NIL);
      if (data.lines[parse.count - 2] === 0)
        data.lines[parse.count - 2] = data.lines[parse.count];
      data.lines[parse.count] = 0;
    } else if (comment[0] !== NIL) {
      ltoke = comment[0];
      ltype = CommIgnoreStart.test(ltoke) ? "ignore" : "comment";
      if (ltoke.indexOf("# sourceMappingURL=") === 2) {
        sourcemap[0] = parse.count + 1;
        sourcemap[1] = ltoke;
      }
      parse.push(data, {
        begin: parse.stack.index,
        ender: -1,
        lexer: "script",
        lines: parse.lineOffset,
        stack: parse.stack.token,
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
    comment = commentLine({
      chars: c,
      end: b,
      lexer: "script",
      begin: "//",
      start: a,
      ender: NWL
    });
    a = comment[1];
    if (comment[0] !== NIL) {
      ltoke = comment[0];
      ltype = CommIgnoreStart.test(ltoke) ? "ignore" : "comment";
      if (ltoke.indexOf("# sourceMappingURL=") === 2) {
        sourcemap[0] = parse.count + 1;
        sourcemap[1] = ltoke;
      }
      parse.push(data, {
        begin: parse.stack.index,
        ender: -1,
        lexer: "script",
        lines: parse.lineOffset,
        stack: parse.stack.token,
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
      if (rules.language === "typescript") {
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
        parse.stack.update("attribute");
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
        parse.stack.update("paren", parse.count);
      parse.external("html", output.join(NIL));
    }
    if (wtest > -1)
      word();
    ptoke = parse.count > 0 ? data.token[parse.count - 1] : NIL;
    ptype = parse.count > 0 ? data.types[parse.count - 1] : NIL;
    next = peek(1, false);
    if (rules.language !== "jsx" && rules.language !== "tsx" && digit(next) === false && (ltoke === "function" || ptoke === "=>" || ptoke === "void" || ptoke === "." || ltoke === "return" || ltype === "operator" || data.stack[parse.count] === "arguments" || ltype === "type" && ptoke === "type" || ltype === "reference" && (ptype === "operator" || ptoke === "function" || ptoke === "class" || ptoke === "new") || ltype === "type" && ptype === "operator")) {
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
    if (rules.language !== "typescript" && (data.token[d] === "return" || data.types[d] === "operator" || data.types[d] === "start" || data.types[d] === "separator" || data.types[d] === "jsx_attribute_start" || is(data.token[d], 125 /* RCB */) && parse.stack.token === "global")) {
      ltype = "markup";
      rules.language = "jsx";
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
          if (is(peek(1, false), 47 /* FWS */))
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
      if (option.correct === false || tokea !== "++" && tokea !== "--" && tokeb !== "++" && tokeb !== "--") {
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
    const qc = option.quoteConvert;
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
        parse.lineOffset = linesSpace;
      }
    }
    function finish() {
      let str = NIL;
      function bracketSpace(input) {
        if (rules.language !== "javascript" && rules.language !== "typescript" && rules.language !== "jsx" && rules.language !== "tsx") {
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
        build[0] = SQO;
        build[build.length - 1] = SQO;
      } else if (is(starting, 39 /* SQO */) && qc === "double") {
        build[0] = DQO;
        build[build.length - 1] = DQO;
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
        if (rules.language === "json") {
          ltoke = ltoke.replace(/\u0000/g, "\\u0000").replace(/\u0001/g, "\\u0001").replace(/\u0002/g, "\\u0002").replace(/\u0003/g, "\\u0003").replace(/\u0004/g, "\\u0004").replace(/\u0005/g, "\\u0005").replace(/\u0006/g, "\\u0006").replace(/\u0007/g, "\\u0007").replace(/\u0008/g, "\\u0008").replace(/\u0009/g, "\\u0009").replace(/\u000a/g, "\\u000a").replace(/\u000b/g, "\\u000b").replace(/\u000c/g, "\\u000c").replace(/\u000d/g, "\\u000d").replace(/\u000e/g, "\\u000e").replace(/\u000f/g, "\\u000f").replace(/\u0010/g, "\\u0010").replace(/\u0011/g, "\\u0011").replace(/\u0012/g, "\\u0012").replace(/\u0013/g, "\\u0013").replace(/\u0014/g, "\\u0014").replace(/\u0015/g, "\\u0015").replace(/\u0016/g, "\\u0016").replace(/\u0017/g, "\\u0017").replace(/\u0018/g, "\\u0018").replace(/\u0019/g, "\\u0019").replace(/\u001a/g, "\\u001a").replace(/\u001b/g, "\\u001b").replace(/\u001c/g, "\\u001c").replace(/\u001d/g, "\\u001d").replace(/\u001e/g, "\\u001e").replace(/\u001f/g, "\\u001f");
        } else if (starting.indexOf("#!") === 0) {
          ltoke = ltoke.slice(0, ltoke.length - 1);
          parse.lineOffset = 2;
        } else if (parse.stack.token !== "object" || parse.stack.token === "object" && not(peek(1, false), 58 /* COL */) && not(data.token[parse.count], 44 /* COM */) && not(data.token[parse.count], 123 /* LCB */)) {
          if (ltoke.length > rules.wrap && rules.wrap > 0 || rules.wrap !== 0 && is(data.token[parse.count], 43 /* PLS */) && (is(data.token[parse.count - 1], 46 /* DOT */) || is(data.token[parse.count - 1], 39 /* SQO */))) {
            let item = ltoke;
            let segment = NIL;
            let q = qc === "double" ? DQO : qc === "single" ? SQO : item.charAt(0);
            const limit = rules.wrap;
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
                parse.lineOffset = 0;
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
          starting = DQO;
          ending = '\\"';
          build = [DQO];
        } else {
          starting = SQO;
          ending = "\\'";
          build = [SQO];
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
            c[ee] = DQO;
          } else if (qc === "single" && is(c[ee], 39 /* SQO */) && is(c[a], 34 /* DQO */)) {
            c[ee] = SQO;
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
        if (rules.language !== "json" && rules.language !== "javascript" && (is(starting, 34 /* DQO */) || is(starting, 39 /* SQO */)) && (ext === true || ee > start2) && not(c[ee - 1], 92 /* BWS */) && not(c[ee], 34 /* DQO */) && not(c[ee], 39 /* SQO */) && (is(c[ee], 10 /* NWL */) || ee === b - 1 === true)) {
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
    const lines = parse.lineOffset;
    if (rules.language === "json" || brace.length < 1 || brace[brace.length - 1].charAt(0) !== "x" || /^x?(;|\}|\))$/.test(ltoke) === false) {
      return;
    }
    if (data.stack[parse.count] === "do" && next === "while" && is(data.token[parse.count], 125 /* RCB */)) {
      return;
    }
    if (is(ltoke, 59 /* SEM */) && data.token[g - 1] === "x{") {
      name = data.token[data.begin[g - 2] - 1];
      if (data.token[g - 2] === "do" || is(data.token[g - 2], 41 /* RPR */) && "ifforwhilecatch".indexOf(name) > -1) {
        tstore = parse.pop(data);
        ltoke = option.correct === true ? "}" : "x}";
        ltype = "end";
        pstack = parse.stack.entry;
        push();
        brace.pop();
        parse.lineOffset = lines;
        return;
      }
      tstore = parse.pop(data);
      ltoke = option.correct === true ? "}" : "x}";
      ltype = "end";
      pstack = parse.stack.entry;
      push();
      brace.pop();
      ltoke = ";";
      ltype = "end";
      parse.push(data, tstore, NIL);
      parse.lineOffset = lines;
      return;
    }
    ltoke = option.correct === true ? "}" : "x}";
    ltype = "end";
    if (data.token[parse.count] === "x}")
      return;
    if (next === "else" && data.stack[parse.count] === "if" && (is(data.token[parse.count], 59 /* SEM */) || data.token[parse.count] === "x;")) {
      pstack = parse.stack.entry;
      push();
      brace.pop();
      parse.lineOffset = lines;
      return;
    }
    do {
      pstack = parse.stack.entry;
      push();
      brace.pop();
      if (data.stack[parse.count] === "do")
        break;
    } while (brace[brace.length - 1] === "x{");
    parse.lineOffset = lines;
  }
  function getCommaComment() {
    let x = parse.count;
    if (data.stack[x] === "object" && option.objectSort === true) {
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
          lines: parse.lineOffset,
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
      const startar = ar ? "[" : "{";
      const endar = ar ? "]" : "}";
      const namear = ar ? "array" : "object";
      if (ar === true && data.types[parse.count] === "number") {
        arraylen = Number(data.token[parse.count]);
        tstore = parse.pop(data);
      }
      tstore = parse.pop(data);
      tstore = parse.pop(data);
      tstore = parse.pop(data);
      parse.stack.pop();
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
      if (option.correct === true)
        parseLogical();
      cleanSemicolon();
    }
    if (is(x, 41 /* RPR */) || x === "x)")
      applySemicolon(false);
    if (v > -1) {
      if (is(x, 125 /* RCB */) && (option.variableList === "list" && vstore.count[v] === 0 || data.token[parse.count] === "x;" && option.variableList === "each")) {
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
      if (not(ltoke, 44 /* COM */) && option.correct === true) {
        parseLogical();
      }
      if (parse.stack.length > 0 && parse.stack.token !== "object") {
        applySemicolon(true);
      }
      if (option.objectSort === true && parse.stack.token === "object") {
        sortObject(data);
      }
      if (ltype === "comment") {
        ltoke = data.token[parse.count];
        ltype = data.types[parse.count];
      }
      ltoke = "}";
    }
    if (parse.stack.token === "data_type") {
      ltype = "type_end";
    } else {
      ltype = "end";
    }
    lword.pop();
    pstack = parse.stack.entry;
    if (is(x, 41 /* RPR */) && option.correct === true && count - parse.count < 2 && (is(data.token[parse.count], 40 /* LPR */) || data.types[parse.count] === "number") && (data.token[count - 1] === "Array" || data.token[count - 1] === "Object") && data.token[count - 2] === "new") {
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
    if (option.endComma !== void 0 && option.endComma !== "none" && parse.stack.token === "array" || parse.stack.token === "object" || parse.stack.token === "data_type") {
      if (option.endComma === "always" && not(data.token[parse.count], 44 /* COM */)) {
        const begin = parse.stack.index;
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
      } else if (option.endComma === "never" && is(data.token[parse.count], 44 /* COM */)) {
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
      ltoke = option.correct === true ? "{" : "x{";
      ltype = "start";
      push(pword[0]);
      brace.push("x{");
      pword[1] = parse.count;
    }
    tstype.pop();
    if (parse.stack.token !== "data_type")
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
          if (option.correct === true) {
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
      } else if (parse.stack.length > 0 && not(data.token[aa], 58 /* COL */) && parse.stack.token === "object" && (is(data.token[data.begin[aa] - 2], 123 /* LCB */) || is(data.token[data.begin[aa] - 2], 44 /* COM */))) {
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
    if (option.correct === true && (output === "Object" || output === "Array") && is(c[a + 1], 40 /* LPR */) && is(c[a + 2], 41 /* RPR */) && is(data.token[parse.count - 1], 61 /* EQS */) && data.token[parse.count] === "new") {
      if (output === "Object") {
        data.token[parse.count] = "{";
        ltoke = "}";
        data.stack[parse.count] = "object";
        parse.stack.update("object");
      } else {
        data.token[parse.count] = "[";
        ltoke = "]";
        data.stack[parse.count] = "array";
        parse.stack.update("array");
      }
      data.types[parse.count] = "start";
      ltype = "end";
      c[a + 1] = NIL;
      c[a + 2] = NIL;
      a = a + 2;
    } else {
      g = parse.count;
      f = g;
      if (option.variableList !== "none" && (output === "var" || output === "let" || output === "const")) {
        if (data.types[g] === "comment") {
          do {
            g = g - 1;
          } while (g > 0 && data.types[g] === "comment");
        }
        if (option.variableList === "list" && v > -1 && vstore.index[v] === g && output === vstore.word[v]) {
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
      } else if (v > -1 && output !== vstore.word[v] && parse.count === vstore.index[v] && is(data.token[vstore.index[v]], 59 /* SEM */) && ltoke !== vstore.word[v] && option.variableList === "list") {
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
      } else if ((parse.stack.token === "object" || parse.stack.token === "class" || parse.stack.token === "data_type") && (is(data.token[parse.count], 123 /* LCB */) || (is(data.token[data.begin[parse.count]], 123 /* LCB */) && is(data.token[parse.count], 44 /* COM */) || data.types[parse.count] === "liquid_end" && (is(data.token[data.begin[parse.count] - 1], 123 /* LCB */) || is(data.token[data.begin[parse.count] - 1], 44 /* COM */))))) {
        if (output === "return" || output === "break") {
          ltype = "word";
        } else {
          ltype = "property";
        }
      } else if (tstype[tstype.length - 1] === true || (rules.language === "typescript" || rules.language === "flow") && tokel === "type") {
        ltype = "type";
      } else if (references.length > 0 && (tokel === "function" || tokel === "class" || tokel === "const" || tokel === "let" || tokel === "var" || tokel === "new" || tokel === "void")) {
        ltype = "reference";
        references[references.length - 1].push(output);
        if (rules.language === "javascript" || rules.language === "jsx" || rules.language === "typescript" || rules.language === "tsx") {
          if (tokel === "var" || tokel === "function" && data.types[parse.count - 1] !== "operator" && data.types[parse.count - 1] !== "start" && data.types[parse.count - 1] !== "end") {
            hoisting(parse.count, output, true);
          } else {
            hoisting(parse.count, output, false);
          }
        } else {
          hoisting(parse.count, output, false);
        }
      } else if (parse.stack.token === "arguments" && ltype !== "operator") {
        ltype = "reference";
        fnrefs.push(output);
      } else if (is(tokel, 44 /* COM */) && data.stack[parse.count] !== "method" && (data.stack[parse.count] !== "expression" || data.token[data.begin[parse.count] - 1] === "for")) {
        let d = parse.count;
        const e = parse.stack.index;
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
          if (rules.language === "javascript" || rules.language === "jsx" || rules.language === "typescript" || rules.language === "tsx") {
            hoisting(d, output, true);
          } else {
            hoisting(d, output, false);
          }
        } else if (references.length > 0 && (data.token[d] === "let" || data.token[d] === "const" || data.token[d] === "type" && (rules.language === "typescript" || rules.language === "tsx"))) {
          ltype = "reference";
          references[references.length - 1].push(output);
          hoisting(d, output, false);
        } else {
          ltype = "word";
        }
      } else if (parse.stack.token !== "object" || parse.stack.token === "object" && ltoke !== "," && ltoke !== "{") {
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
        ltoke = option.correct === true ? "{" : "x{";
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
                token: option.correct === true ? "}" : "x}",
                types: "end"
              }
            });
            if (parse.stack.length > 1) {
              parse.stack.splice(parse.stack.length - 2, 1);
              parse.stack.update(parse.count);
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
        ltoke = option.correct === true ? "{" : "x{";
        ltype = "start";
        brace.push("x{");
        push("else");
      }
    }
    if ((output === "for" || output === "if" || output === "switch" || output === "catch") && data.token[parse.count - 1] !== ".") {
      next = peek(1, true);
      if (next !== "(") {
        paren = parse.count;
        if (option.correct === true) {
          start("(");
        } else {
          start("x(");
        }
      }
    }
  }
  function parseSpace() {
    parse.lineOffset = 1;
    do {
      if (is(c[a], 10 /* NWL */)) {
        parse.lineOffset = a;
        parse.lineOffset = parse.lineOffset + 1;
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
      if (parse.lineOffset > 1 && lengthb < parse.count && not(c[a + 1], 59 /* SEM */) && not(c[a + 1], 125 /* RCB */)) {
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
    } else if (is(c[a], 96 /* TQO */) || is(c[a], 125 /* RCB */) && parse.stack.token === "template_string") {
      if (wtest > -1)
        word();
      ltoke = parseLiteral();
      if (is(ltoke, 125 /* RCB */) && ltoke.slice(ltoke.length - 2) === "${") {
        ltype = "template_string_else";
        push("template_string");
      } else if (ltoke.slice(ltoke.length - 2) === "${") {
        ltype = "template_string_start";
        push("template_string");
      } else if (is(ltoke[0], 125 /* RCB */)) {
        ltype = "template_string_end";
        push();
      } else {
        ltype = "string";
        push();
      }
    } else if (is(c[a], 34 /* DQO */) || is(c[a], 39 /* SQO */)) {
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
      if (option.correct === true)
        parseLogical();
      cleanSemicolon();
      a = a + 1;
      ltoke = "::";
      ltype = "separator";
      push();
    } else if (is(c[a], 44 /* COM */)) {
      if (wtest > -1)
        word();
      if (option.correct === true)
        parseLogical();
      if (tstype[tstype.length - 1] === true && data.stack[parse.count].indexOf("type") < 0) {
        tstype[tstype.length - 1] = false;
      }
      if (ltype === "comment") {
        getCommaComment();
      } else if (v > -1 && vstore.count[v] === 0 && option.variableList === "each") {
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
        parse.lineOffset = 1;
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
        if (option.variableList === "each") {
          pop();
        } else {
          vstore.index[v] = parse.count + 1;
        }
      }
      if (option.correct === true)
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
    if (v > -1 && parse.count === vstore.index[v] + 1 && is(data.token[vstore.index[v]], 59 /* SEM */) && ltoke !== vstore.word[v] && ltype !== "comment" && option.variableList === "list") {
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
  if (option.objectSort && data.begin.length > 0) {
    sortCorrect(0, parse.count + 1);
  }
  return data;
}

// src/lexers/style.ts
function style() {
  const { data, rules, source } = parse;
  const b = source.split(NIL);
  const c = source.length;
  const mapper = [];
  const nosort = [];
  let a = 0;
  let ltype = NIL;
  let ltoke = NIL;
  function push(structure) {
    parse.push(data, {
      begin: parse.stack.index,
      ender: -1,
      lexer: "style",
      lines: parse.lineOffset,
      stack: parse.stack.token,
      token: ltoke,
      types: ltype
    }, structure);
  }
  function esctest(index) {
    const slash = index;
    do
      index = index - 1;
    while (is(b[index], 92 /* BWS */) && index > 0);
    return (slash - index) % 2 === 1;
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
      if (rules.style.noLeadZero === true) {
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
      do
        xx = xx - 1;
      while (xx > 0 && is(x[xx], 92 /* BWS */));
      return (start - xx) % 2 === 1;
    }
    if (ii < leng) {
      do {
        items.push(x[ii]);
        if (not(x[ii - 1], 92 /* BWS */) || safeSlash() === false) {
          if (block === NIL) {
            if (is(x[ii], 34 /* DQO */)) {
              block = DQO;
              dd = dd + 1;
            } else if (is(x[ii], 39 /* SQO */)) {
              block = SQO;
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
        if (rules.style.noLeadZero === true && /^-?0+\.\d+[a-z]/.test(values[ii]) === true) {
          values[ii] = values[ii].replace(/0+\./, ".");
        } else if (rules.style.noLeadZero === false && /^-?\.\d+[a-z]/.test(values[ii])) {
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
            if (rules.style.quoteConvert === "double") {
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
    const qc = rules.style.quoteConvert;
    let aa = a;
    let bb = 0;
    let outy = NIL;
    let func = null;
    let nopush = false;
    function spaceStart() {
      out.push(b[aa]);
      if (ws(b[aa + 1])) {
        do
          aa = aa + 1;
        while (aa < c && ws(b[aa + 1]));
      }
    }
    if (aa < c) {
      do {
        if (is(b[aa], 34 /* DQO */) || is(b[aa], 39 /* SQO */)) {
          if (func === null)
            func = false;
          if (block[block.length - 1] === b[aa] && (not(b[aa - 1], 92 /* BWS */) || esctest(aa - 1) === false)) {
            block.pop();
            if (qc === "double") {
              b[aa] = DQO;
            } else if (qc === "single") {
              b[aa] = SQO;
            }
          } else if (not(block[block.length - 1], 34 /* DQO */) && not(block[block.length - 1], 39 /* SQO */) && (not(b[aa - 1], 92 /* BWS */) || esctest(aa - 1) === false)) {
            block.push(b[aa]);
            if (qc === "double") {
              b[aa] = DQO;
            } else if (qc === "single") {
              b[aa] = SQO;
            }
          } else if (is(b[aa - 1], 92 /* BWS */) && qc !== "none") {
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
        } else if (not(b[aa - 1], 92 /* BWS */) || esctest(aa - 1) === false) {
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
        if (parse.stack.token === "map" && block.length === 0 && (is(b[aa + 1], 44 /* COM */) || is(b[aa + 1], 41 /* RPR */))) {
          if (is(b[aa + 1], 41 /* RPR */) && is(data.token[parse.count], 40 /* LPR */)) {
            parse.pop(data);
            parse.stack.pop();
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
    if (parse.stack.token === "map" && is(out[0], 40 /* LPR */)) {
      mapper[mapper.length - 1] = mapper[mapper.length - 1] - 1;
    }
    ltoke = out.join(NIL).replace(/\s+/g, WSP).replace(/^\s/, NIL).replace(/\s$/, NIL);
    if (func === true) {
      if (grammar.css.atrules(ltoke) && rules.style.atRuleSpace === true) {
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
    } else if (func === true && digit(ltoke.charAt(0)) === false && /^rgba?\(/.test(ltoke) === false && ltoke.indexOf("url(") !== 0 && (ltoke.indexOf(WSP) < 0 || ltoke.indexOf(WSP) > ltoke.indexOf("(")) && ltoke.charAt(ltoke.length - 1) === ")") {
      if (is(data.token[parse.count], 58 /* COL */)) {
        ltype = "value";
      } else {
        ltoke = ltoke.replace(/,\u0020?/g, ", ");
        ltype = "function";
      }
      ltoke = value(ltoke);
    } else if (parse.count > -1 && SQO.indexOf(data.token[parse.count].charAt(0)) > -1 && data.types[parse.count] === "variable") {
      ltype = "item";
    } else if (is(out[0], 64 /* ATT */) || out[0] === "$") {
      if (data.types[parse.count] === "colon" && rules.language === "css" && (data.types[parse.count - 1] === "property" || data.types[parse.count - 1] === "variable")) {
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
  function parseToken(type) {
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
        if (data.types[ss - 1] === "colon" && (data.types[ss] === "selector" || data.types[ss] === "at_rule") && (data.types[ss - 2] === "template" || data.types[ss - 2] === "liquid_start" || data.types[ss - 2] === "liquid_else" || data.types[ss - 2] === "liquid_end")) {
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
      if (rules.style.sortSelectors === true && is(data.token[ss - 1], 44 /* COM */)) {
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
  function parseSeparatorComment() {
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
        begin: parse.stack.index,
        ender: -1,
        lexer: "style",
        lines: parse.lineOffset,
        stack: parse.stack.token,
        token: ";",
        types: "separator"
      }
    });
  }
  function parseLiquid(open, end) {
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
          parseToken(endtype);
        }
      }
      if (is(b[a + 1], 32 /* WSP */)) {
        console.log(parse.lineOffset);
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
            quote = DQO;
          } else if (is(b[a], 39 /* SQO */)) {
            quote = SQO;
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
                  exit("liquid_else");
                  return;
                }
                namesLen = templateNames.length - 1;
                if (namesLen > -1) {
                  do {
                    if (name === templateNames[namesLen]) {
                      exit("liquid_start");
                      return;
                    }
                    if (name === "end" + templateNames[namesLen]) {
                      exit("liquid_end");
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
                  exit("liquid_end");
                  return;
                }
              }
              exit("liquid");
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
  function parseComment(isLineComment) {
    let comm;
    if (isLineComment) {
      comm = commentLine({
        chars: b,
        start: a,
        end: c,
        lexer: "style",
        begin: "//",
        ender: NWL
      });
      ltoke = comm[0];
      ltype = CommLineIgnoreStart.test(ltoke) ? "ignore" : "comment";
    } else {
      comm = commentBlock({
        chars: b,
        start: a,
        end: c,
        lexer: "style",
        begin: "/*",
        ender: "*/"
      });
      ltoke = comm[0];
      ltype = CommBlockIgnoreStart.test(ltoke) ? "ignore" : "comment";
    }
    push(NIL);
    a = comm[1];
  }
  function marginPadding() {
    const lines = parse.lineOffset;
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
    const begin = parse.stack.index;
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
          sortCorrect(begin, parse.count + 1);
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
    parse.lineOffset = lines;
  }
  function parseSpace() {
    parse.lineOffset = 1;
    do {
      if (is(b[a], 10 /* NWL */)) {
        parse.lineIndex = a;
        parse.lineOffset = parse.lineOffset + 1;
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
      parseComment(false);
    } else if (is(b[a], 47 /* FWS */) && is(b[a + 1], 47 /* FWS */)) {
      parseComment(true);
    } else if (is(b[a], 123 /* LCB */) && is(b[a + 1], 37 /* PER */)) {
      parseLiquid("{%", "%}");
    } else if (is(b[a], 123 /* LCB */) && is(b[a + 1], 123 /* LCB */)) {
      parseLiquid("{{", "}}");
    } else if (is(b[a], 123 /* LCB */) || is(b[a], 40 /* LPR */) && is(data.token[parse.count], 58 /* COL */) && data.types[parse.count - 1] === "variable") {
      parseToken("start");
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
    } else if (is(b[a], 125 /* RCB */) || b[a] === ")" && parse.stack.token === "map" && mapper[mapper.length - 1] === 0) {
      if (is(b[a], 125 /* RCB */) && is(data.token[parse.count - 1], 123 /* LCB */) && data.types[parse.count] === "item" && data.token[parse.count - 2] !== void 0 && data.token[parse.count - 2].charCodeAt(data.token[parse.count - 2].length - 1) === 64 /* ATT */) {
        data.token[parse.count - 2] = data.token[parse.count - 2] + "{" + data.token[parse.count] + "}";
        parse.pop(data);
        parse.pop(data);
        parse.stack.pop();
      } else {
        if (is(b[a], 41 /* RPR */))
          mapper.pop();
        parseToken("end");
        if (is(b[a], 125 /* RCB */) && not(data.token[parse.count], 59 /* SEM */)) {
          if (data.types[parse.count] === "value" || data.types[parse.count] === "function" || data.types[parse.count] === "variable" && (is(data.token[parse.count - 1], 58 /* COL */) || is(data.token[parse.count - 1], 59 /* SEM */))) {
            if (rules.style.correct === true) {
              ltoke = ";";
            } else {
              ltoke = "x;";
            }
            ltype = "separator";
            push(NIL);
          } else if (data.types[parse.count] === "comment") {
            parseSeparatorComment();
          }
        }
        nosort.pop();
        ltoke = b[a];
        ltype = "end";
        if (is(b[a], 125 /* RCB */))
          marginPadding();
        if (rules.style.sortProperties === true && is(b[a], 125 /* RCB */))
          sortObject(data);
        push(NIL);
      }
    } else if (is(b[a], 59 /* SEM */) || is(b[a], 44 /* COM */)) {
      if (data.types[parse.count - 1] === "selector" || data.types[parse.count - 1] === "at_rule" || data.types[parse.count] !== "function" && is(data.token[parse.count - 1], 125 /* RCB */)) {
        parseToken("start");
      } else {
        parseToken("separator");
      }
      if (data.types[parse.count] !== "separator" && esctest(a) === true) {
        ltoke = b[a];
        ltype = "separator";
        push(NIL);
      }
    } else if (parse.count > -1 && is(b[a], 58 /* COL */) && data.types[parse.count] !== "end") {
      parseToken("colon");
      ltoke = ":";
      ltype = "colon";
      push(NIL);
    } else {
      if (parse.stack.token === "map" && is(b[a], 40 /* LPR */)) {
        mapper[mapper.length - 1] = mapper[mapper.length - 1] + 1;
      }
      buildToken();
    }
    a = a + 1;
  } while (a < c);
  if (rules.style.sortProperties === true)
    sortObject(data);
  return data;
}

// src/lexers/index.ts
function lexers(lexer) {
  if (lexer === 1 /* Markup */)
    return markup();
  if (lexer === 3 /* Style */)
    return style();
  if (lexer === 2 /* Script */)
    return script();
}

// src/format/markup.ts
function markup2() {
  const { rules } = parse;
  let a = parse.start;
  let comstart = -1;
  let next = 0;
  let count = 0;
  let indent = isNaN(rules.indentLevel) ? 0 : Number(rules.indentLevel);
  const data = parse.data;
  const c = parse.ender < 1 || parse.ender > data.token.length ? data.token.length : parse.ender + 1;
  const extidx = {};
  const jsx = rules.language === "jsx" || rules.language === "tsx";
  const delim = /* @__PURE__ */ new Map();
  const level = parse.start > 0 ? Array(parse.start).fill(0, 0, parse.start) : [];
  const levels = getLevels();
  const ind = spaces();
  const build = [];
  function isType2(index, name) {
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
    const pres = rules.preserveLine + 1;
    const total = Math.min(data.lines[a + 1] - 1, pres);
    let index = 0;
    if (tabs < 0)
      tabs = 0;
    do {
      linesout.push(parse.crlf);
      index = index + 1;
    } while (index < total);
    if (data.types[a] !== "ignore" || data.types[a] === "ignore" && data.types[a + 1] !== "ignore") {
      if (tabs > 0) {
        index = 0;
        do {
          linesout.push(ind);
          index = index + 1;
        } while (index < tabs);
      }
    }
    return linesout.join(NIL);
  }
  function ml() {
    let lines = data.token[a].split(parse.crlf);
    const line = data.lines[a + 1];
    if (isType2(a, "comment") && (is(data.token[a][1], 37 /* PER */) && rules.liquid.preserveComment === false || is(data.token[a][1], 37 /* PER */) === false && rules.markup.preserveComment === false)) {
      lines = lines.map((l) => l.trimStart());
    }
    const lev = levels[a - 1] > -1 ? isType2(a, "attribute") ? levels[a - 1] + 1 : levels[a - 1] : (() => {
      let bb = a - 1;
      let start = bb > -1 && isIndex(bb, "start") > -1;
      if (levels[a] > -1 && isType2(a, "attribute"))
        return levels[a] + 1;
      do {
        bb = bb - 1;
        if (levels[bb] > -1) {
          return isType2(a, "content") && start === false ? levels[bb] : levels[bb] + 1;
        }
        if (isIndex(bb, "start") > -1)
          start = true;
      } while (bb > 0);
      return bb === -2 ? 0 : 1;
    })();
    let aa = 0;
    data.lines[a + 1] = 0;
    const len = lines.length - 1;
    do {
      if (isType2(a, "comment")) {
        if (aa === 0 && (is(data.token[a][1], 37 /* PER */) && rules.liquid.commentNewline === true || is(data.token[a][1], 37 /* PER */) === false && rules.markup.commentNewline === true)) {
          if (rules.preserveLine === 0) {
            build.push(nl(lev));
          } else {
            if (build.length > 0 && build[build.length - 1].lastIndexOf(NWL) + 1 < 2) {
              build.push(nl(lev));
            }
          }
        }
        if (lines[aa] !== NIL) {
          if (aa > 0 && (is(data.token[a][1], 37 /* PER */) && rules.liquid.commentIndent === true || is(data.token[a][1], 37 /* PER */) === false && rules.markup.commentIndent === true)) {
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
    if (isType2(a, "comment") && (isType2(a + 1, "liquid_end") || isType2(a - 1, "liquid_end"))) {
      build.push(nl(levels[a]));
    } else if (levels[a] === -10) {
      build.push(WSP);
    } else if (levels[a] > 1) {
      build.push(nl(levels[a]));
    } else if (levels[a] === 0 && a === 0 && isType2(a, "comment")) {
      build.push(nl(levels[a]));
    } else if (isType2(a, "comment") && levels[a] === 0 && (isType2(a + 1, "liquid_start") || isType2(a + 1, "ignore"))) {
      build.push(nl(levels[a]));
    }
  }
  function spaces() {
    const indc = [rules.indentChar];
    const size2 = rules.indentSize - 1;
    let aa = 0;
    if (aa < size2) {
      do {
        indc.push(rules.indentChar);
        aa = aa + 1;
      } while (aa < size2);
    }
    return indc.join(NIL);
  }
  function forward() {
    let x = a + 1;
    let y = 0;
    if (isType2(x, void 0))
      return x - 1;
    if (isType2(x, "comment") || a < c - 1 && isIndex(x, "attribute") > -1) {
      do {
        if (isType2(x, "jsx_attribute_start")) {
          y = x;
          do {
            if (isType2(x, "jsx_attribute_end") && data.begin[x] === y)
              break;
            x = x + 1;
          } while (x < c);
        } else if (isType2(x, "comment") === false && isIndex(x, "attribute") < 0)
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
    let space = rules.markup.selfCloseSpace === true && end !== null && end[0] === "/>" ? WSP : NIL;
    data.token[a] = parent.replace(regend, NIL);
    do {
      if (isType2(y, "jsx_attribute_end") && data.begin[data.begin[y]] === a) {
        isjsx = false;
      } else if (data.begin[y] === a) {
        if (isType2(y, "jsx_attribute_start")) {
          isjsx = true;
        } else if (isIndex(y, "attribute") < 0 && isjsx === false) {
          break;
        }
      } else if (isjsx === false && (data.begin[y] < a || isIndex(y, "attribute") < 0)) {
        break;
      }
      y = y + 1;
    } while (y < c);
    if (isType2(y - 1, "comment_attribute"))
      space = nl(levels[y - 2] - 1);
    data.token[y - 1] = `${data.token[y - 1]}${space}${end[0]}`;
    if (isType2(y, "comment") && data.lines[a + 1] < 2) {
      levels[a] = -10;
    }
  }
  function onDelimiterForce() {
    if (isType2(a, "end") === false && not(data.token[a], 60 /* LAN */) && delim.get(data.begin[a]) >= 2 && isLast(data.token[a], 62 /* RAN */)) {
      delim.delete(data.begin[a]);
      const newline = nl(levels[a - 1] - 1).replace(/\n+/, NWL);
      const replace = `${data.token[a].slice(0, -1)}${newline}>`;
      if (isType2(data.begin[a], "singleton")) {
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
      if (isType2(aa + 1, "attribute")) {
        level[aa] = -10;
      } else if (isToken(aa, "</li>") === false) {
        level[aa] = -20;
      }
    } while (aa > stop + 1);
  }
  function onComment() {
    let x = a;
    let test = false;
    if (data.lines[a + 1] === 0 && rules.markup.forceIndent === false) {
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
      if (isType2(data.begin[x] - 1, "liquid")) {
        level[data.begin[x] - 1] = indent;
      }
      const ind2 = isType2(next, "end") || isType2(next, "liquid_end") ? indent + 1 : indent;
      do {
        level.push(ind2);
        x = x - 1;
      } while (x > comstart);
      if (ind2 === indent + 1)
        level[a] = indent;
      if (isType2(x, "attribute") || isType2(x, "liquid_attribute") || isType2(x, "jsx_attribute_start")) {
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
    if (rules.markup.forceIndent === true || rules.markup.forceAttribute === true) {
      level.push(indent);
      return;
    }
    if (next < c && (isIndex(next, "end") > -1 || isIndex(next, "start") > -1) && data.lines[next] > 0) {
      level.push(indent);
      ind2 = ind2 + 1;
      if (a > 0 && isType2(a, "singleton") && isIndex(a - 1, "attribute") > -1 && isType2(data.begin[a - 1], "singleton")) {
        if (data.begin[a] < 0 || isType2(data.begin[a - 1], "singleton") && data.begin[data.ender[a] - 1] !== a) {
          level[a - 1] = indent;
        } else {
          level[a - 1] = indent + 1;
        }
      }
    } else if (a > 0 && isType2(a, "singleton") && isIndex(a - 1, "attribute") > -1) {
      level[a - 1] = indent;
      count = data.token[a].length;
      level.push(-10);
    } else if (data.lines[next] === 0) {
      level.push(-20);
    } else if ((rules.wrap === 0 || a < c - 2 && data.token[a] !== void 0 && data.token[a + 1] !== void 0 && data.token[a + 2] !== void 0 && data.token[a].length + data.token[a + 1].length + data.token[a + 2].length + 1 > rules.wrap && isIndex(a + 2, "attribute") > -1 || data.token[a] !== void 0 && data.token[a + 1] !== void 0 && data.token[a].length + data.token[a + 1].length > rules.wrap) && (isType2(a + 1, "singleton") || isType2(a + 1, "liquid"))) {
      level.push(indent);
    } else {
      count = count + 1;
      level.push(-10);
    }
    if (a > 0 && isIndex(a - 1, "attribute") > -1 && data.lines[a] < 1) {
      level[a - 1] = -20;
    }
    if (count > rules.wrap) {
      let d = a;
      let e = Math.max(data.begin[a], 0);
      if (isType2(a, "content") && rules.markup.preserveText === false) {
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
          if (chars[d].length + countx > rules.wrap) {
            chars[d] = parse.crlf + chars[d];
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
          data.token[a] = chars.join(NIL).replace(parse.crlf, NIL);
        }
        if (data.token[a].indexOf(parse.crlf) > 0) {
          count = data.token[a].length - data.token[a].lastIndexOf(parse.crlf);
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
          if (data.lines[d + 1] > 0 && (isType2(d, "attribute") === false || isType2(d, "attribute") && isType2(d + 1, "attribute"))) {
            if (isType2(d, "singleton") === false || isType2(d, "attribute") && isType2(d + 1, "attribute")) {
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
      if (data.lexer[a + 1] === "markup" && data.begin[a + 1] < skip && isType2(a + 1, "start") === false && isType2(a + 1, "singleton") === false)
        break;
      level.push(0);
      a = a + 1;
    } while (a < c);
    extidx[skip] = a;
    if (data.types[a + 1] === "script_end" && data.token[a + 1] === "}") {
      level.push(-20);
    } else {
      if (data.types[a + 1] === "liquid_end") {
        level.push(indent - 1);
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
      if (acount + item[bb].length > rules.wrap) {
        acount = item[bb].length;
        item[bb] = parse.crlf + item[bb];
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
    let attstart = false;
    let attcount = data.types.indexOf("end", parent + 1);
    let length = data.token[parent].length + 1;
    let levliq = 0;
    let levatt = (() => {
      if (isIndex(a, "start") > 0) {
        let x = a;
        do {
          if (isType2(x, "end") && data.begin[x] === a) {
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
      if (isType2(next, "end") || isType2(next, "liquid_end")) {
        return isType2(parent, "singleton") ? indent + 2 : indent + 1;
      }
      if (isType2(parent, "singleton"))
        return indent + 1;
      return indent;
    })();
    if (plural === false && isType2(a, "comment_attribute")) {
      level.push(indent);
      level[parent] = data.types[parent] === "singleton" ? indent + 1 : indent;
      return;
    }
    function doAttributeForce() {
      if (rules.markup.forceAttribute === false && data.lines[a] === 1) {
        level.push(-10);
      } else {
        if (rules.markup.forceAttribute === true || rules.markup.forceAttribute >= 1) {
          if (rules.liquid.indentAttributes === true) {
            if (isType2(a - 1, "liquid_attribute_start")) {
              level[a - 1] = levatt + levliq;
            }
            level.push(levatt + levliq);
          } else {
            level.push(levatt);
          }
        } else {
          level.push(-10);
        }
      }
    }
    if (levatt < 1)
      levatt = 1;
    attcount = 0;
    do
      attcount = attcount + 1;
    while (isIndex(a + attcount, "attribute") > -1 && (isType2(a + attcount, "end") === false || isType2(a + attcount, "singleton") === false || isType2(a + attcount, "start") === false || isType2(a + attcount, "comment") === false));
    do {
      count = count + data.token[a].length + 1;
      if (data.types[a].indexOf("attribute") > 0) {
        if (isType2(a, "comment_attribute")) {
          level.push(levatt);
        } else if (isIndex(a, "start") > 0 && isIndex(a, "liquid") < 0) {
          attstart = true;
          if (a < c - 2 && data.types[a + 2].indexOf("attribute") > 0) {
            level.push(-20);
            a = a + 1;
            extidx[a] = a;
          } else {
            if (parent === a - 1 && plural === false) {
              if (jsx) {
                level.push(-20);
              } else {
                level.push(levatt);
              }
            } else {
              if (jsx) {
                level.push(-20);
              } else {
                level.push(levatt + 1);
              }
            }
            if (data.lexer[a + 1] !== "markup") {
              a = a + 1;
              onEmbedded();
            }
          }
        } else if (rules.liquid.indentAttributes === true) {
          if (isType2(a, "liquid_attribute_start")) {
            if (levliq > 0) {
              level.push(levatt + levliq);
            } else {
              level.push(levatt);
            }
            levliq = levliq + 1;
          } else if (isType2(a, "liquid_attribute_else")) {
            level[a - 1] = levatt + levliq - 1;
          } else if (isType2(a, "liquid_attribute_end")) {
            levliq = levliq - 1;
            level[a - 1] = levatt + levliq;
          } else {
            doAttributeForce();
          }
        } else if (isIndex(a, "end") > 0 && isType2(a, "liquid_attribute_end") === false) {
          if (level[a - 1] !== -20)
            level[a - 1] = level[data.begin[a]] - 1;
          if (data.lexer[a + 1] !== "markup") {
            level.push(-20);
          } else {
            level.push(levatt);
          }
        } else if (isIndex(a, "liquid_attribute") > -1) {
          length = length + data.token[a].length + 1;
          if (rules.markup.preserveAttributes === true) {
            level.push(-10);
          } else if (rules.markup.forceAttribute === true || rules.markup.forceAttribute >= 1 || attstart === true || a < c - 1 && isIndex(a + 1, "attribute") > -1) {
            doAttributeForce();
          } else {
            level.push(-10);
          }
        } else {
          level.push(levatt);
        }
      } else if (isType2(a, "attribute")) {
        length = length + data.token[a].length + 1;
        if (rules.markup.preserveAttributes === true) {
          level.push(-10);
        } else if (rules.markup.forceAttribute === true || rules.markup.forceAttribute >= 1 || attstart === true || a < c - 1 && isIndex(a + 1, "attribute") > -1) {
          doAttributeForce();
        } else {
          level.push(-10);
        }
      } else if (data.begin[a] < parent + 1) {
        break;
      }
      if (rules.wrap === 0) {
        data.token[a] = data.token[a].replace(/ +/g, WSP).replace(/\n+/g, NWL);
      }
      a = a + 1;
    } while (a < c);
    a = a - 1;
    if (isIndex(a, "liquid") < 0 && isIndex(a, "end") > -1 && isIndex(a, "attribute") > 0 && isType2(parent, "singleton") === false && level[a - 1] > 0 && plural === true) {
      level[a - 1] = level[a - 1] - 1;
    }
    if (level[a] !== -20) {
      if (jsx === true && isIndex(parent, "start") > -1 && isType2(a + 1, "script_start")) {
        level[a] = levatt;
      } else {
        if (isToken(a, "/") && level[a - 1] !== 10) {
          level[a - 1] = -10;
        } else {
          level[a] = level[parent];
        }
      }
    }
    if (rules.markup.forceAttribute === true) {
      count = 0;
      level[parent] = levatt;
      if (attcount >= 2 && rules.markup.delimiterForce === true) {
        delim.set(parent, attcount);
      }
    } else if (rules.markup.forceAttribute >= 1) {
      if (attcount >= rules.markup.forceAttribute) {
        level[parent] = levatt;
        let fa = a - 1;
        do {
          if (isType2(fa, "liquid") && level[fa] === -10) {
            level[fa] = levatt;
          } else if (isType2(fa, "attribute") && level[fa] === -10) {
            level[fa] = levatt;
          }
          fa = fa - 1;
        } while (fa > parent);
        if (rules.markup.delimiterForce === true && attcount >= 2) {
          delim.set(parent, attcount);
        }
      } else {
        level[parent] = -10;
      }
    } else {
      level[parent] = -10;
    }
    if (rules.markup.preserveAttributes === true || isToken(parent, "<%xml%>") || isToken(parent, "<?xml?>")) {
      count = 0;
      return;
    }
    w = a;
    if (w > parent + 1) {
      if (rules.markup.selfCloseSpace === false)
        length = length - 1;
      if (length > rules.wrap && rules.wrap > 0 && rules.markup.forceAttribute === false) {
        if (rules.markup.forceLeadAttribute === true) {
          level[parent] = levatt;
          w = w - 1;
        }
        count = data.token[a].length;
        do {
          if (data.token[w].length > rules.wrap && ws(data.token[w]))
            onAttributeWrap(w);
          if (isIndex(w, "liquid") > -1 && level[w] === -10) {
            level[w] = levatt;
          } else if (isType2(w, "attribute") && level[w] === -10) {
            level[w] = levatt;
          }
          w = w - 1;
        } while (w > parent);
      }
    } else if (rules.wrap > 0 && isType2(a, "attribute") && data.token[a].length > rules.wrap && ws(data.token[a])) {
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
      JSON.stringify(token[idx]);
      if (idx === token.length - 1) {
        token[idx] = ind2.slice(1) + toke;
        break;
      }
      if (toke.indexOf(WSP) > -1) {
        name = toke.slice(0, toke.indexOf(WSP));
      } else {
        name = toke.trimEnd();
      }
      if (grammar.liquid.tags.has(name)) {
        token[idx] = ind2 + toke;
        ind2 += repeatChar(rules.indentSize);
      } else if (grammar.liquid.else.has(name)) {
        token[idx] = ind2.slice(rules.indentSize) + toke;
      } else if (toke.startsWith("end")) {
        ind2 = ind2.slice(rules.indentSize);
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
    let arg = false;
    if (level.length >= 2) {
      if (level[level.length - 2] < 0) {
        offset = level[level.length - 1] + 1;
        console.log(offset);
      } else {
        offset = level[level.length - 2] + 1;
      }
    } else if (level.length === 1) {
      offset = level[level.length - 1] + 1;
    }
    let ind2 = trims ? repeatChar(offset * rules.indentSize) : repeatChar(offset * rules.indentSize - 1);
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
              ind2 = ind2.slice(2) + repeatChar(rules.indentSize);
            } else {
              token[idx] = ind2 + repeatChar(rules.indentSize) + tok;
              token[token.length - 1] = ind2.slice(1) + close;
              ind2 = ind2 + repeatChar(rules.indentSize);
            }
          } else {
            token[idx] = ind2 + repeatChar(rules.indentSize) + tok;
          }
        } else if (tok.endsWith(",") === false && is(token[idx + 1].trimStart(), 44 /* COM */) && rules.liquid.lineBreakSeparator === "after") {
          token[idx] = tok + ",";
        }
        idx = idx + 1;
        continue;
      }
      tok = token[idx].trim();
      if (is(tok, 44 /* COM */) && rules.liquid.lineBreakSeparator === "after") {
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
      if (tok.endsWith(",") && rules.liquid.lineBreakSeparator === "before") {
        if (arg && is(token[idx - 1].trimStart(), 124 /* PIP */)) {
          token[idx] = ind2 + WSP + WSP + tok.slice(0, -1);
          chr = WSP + WSP + "," + WSP;
        } else {
          if (arg) {
            token[idx] = ind2 + chr + tok.slice(0, -1);
            chr = WSP + WSP + "," + WSP;
            if (token[idx + 1].trim().startsWith("|"))
              arg = false;
          } else {
            token[idx] = ind2 + chr + tok.slice(0, -1);
            chr = "," + WSP;
          }
        }
      } else if (tok.endsWith("|")) {
        token[idx] = ind2 + chr + tok.slice(0, -1);
        chr = ind2 + "|" + WSP;
      } else if (tok.endsWith(":")) {
        if (token[idx + 1].endsWith(","))
          arg = true;
        token[idx] = ind2 + chr + tok;
        chr = NIL;
      } else {
        if (arg) {
          token[idx] = ind2 + chr + tok;
          chr = NIL;
          if (token[idx + 1].trim().startsWith("|"))
            arg = false;
        } else {
          token[idx] = ind2 + chr + tok;
          chr = NIL;
        }
      }
      idx = idx + 1;
    } while (idx < token.length);
    if (rules.liquid.normalizeSpacing === true) {
      data.token[a] = token.join(NWL).replace(/\s*-?[%}]}$/, (m) => m.replace(/\s*/, WSP));
    } else {
      const space = repeatChar(data.lines[a] - 1 === -1 ? rules.indentSize : data.lines[a] - 1);
      data.token[a] = token.join(NWL).replace(/\s*-?[%}]}$/, (m) => m.replace(StripEnd, space));
    }
  }
  function isLineBreak(idx) {
    return isType2(idx, "liquid") && data.token[idx].indexOf(parse.crlf) > 0;
  }
  function getLevels() {
    do {
      if (data.lexer[a] === "markup") {
        if (isType2(a, "doctype"))
          level[a - 1] = indent;
        if (isIndex(a, "attribute") > -1) {
          onAttribute();
        } else if (isType2(a, "comment")) {
          if (comstart < 0)
            comstart = a;
          if (isType2(a + 1, "comment") === false || a > 0 && isIndex(a - 1, "end") > -1) {
            onComment();
          }
        } else if (isType2(a, "comment") === false) {
          next = forward();
          if (isType2(next, "end") || isType2(next, "liquid_end")) {
            indent = indent - 1;
            if (isType2(next, "liquid_end") && isType2(data.begin[next] + 1, "liquid_else")) {
              indent = indent - 1;
            }
            if (isToken(a, "</ol>") || isToken(a, "</ul>") || isToken(a, "</dl>")) {
              onAnchorList();
            }
          }
          if (isType2(a, "script_end") && isType2(next, "end")) {
            if (data.lines[next] < 1) {
              level.push(-20);
            } else if (data.lines[next] > 1) {
              level.push(indent);
            } else {
              level.push(-10);
            }
          } else if ((rules.markup.forceIndent === false || rules.markup.forceIndent === true && isType2(next, "script_start")) && (isType2(a, "content") || isType2(a, "singleton") || isType2(a, "liquid"))) {
            count = count + data.token[a].length;
            if (data.lines[next] > 0 && isType2(next, "script_start")) {
              level.push(-10);
            } else if (rules.wrap > 0 && (isIndex(a, "liquid") < 0 || next < c && isIndex(a, "liquid") > -1 && isIndex(next, "liquid") < 0)) {
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
          } else if (isType2(a, "start") || isType2(a, "liquid_start")) {
            indent = indent + 1;
            if (jsx === true && isToken(a + 1, "{")) {
              if (data.lines[next] === 0) {
                level.push(-20);
              } else if (data.lines[next] > 1) {
                level.push(indent);
              } else {
                level.push(-10);
              }
            } else if (isType2(a, "start") && isType2(next, "end") || isType2(a, "liquid_start") && isType2(next, "liquid_end")) {
              level.push(-20);
            } else if (isType2(a, "start") && isType2(next, "script_start")) {
              level.push(-10);
            } else if (rules.markup.forceIndent === true) {
              level.push(indent);
            } else if (data.lines[next] === 0 && (isType2(next, "content") || isType2(next, "singleton") || isType2(a, "start") && isType2(next, "liquid"))) {
              level.push(-20);
            } else {
              level.push(indent);
            }
          } else if (rules.markup.forceIndent === false && data.lines[next] === 0 && (isType2(next, "content") || isType2(next, "singleton"))) {
            level.push(-20);
          } else if (isType2(a + 2, "script_end")) {
            console.log(data.token[next], indent);
            level.push(-20);
          } else if (isType2(a, "liquid_else")) {
            level[a - 1] = indent - 1;
            if (isType2(next, "liquid_end")) {
              level[a - 1] = indent - 1;
            }
            level.push(indent);
          } else if (rules.markup.forceIndent === true && (isType2(a, "content") && (isType2(next, "liquid") || isType2(next, "content")) || isType2(a, "liquid") && (isType2(next, "content") || isType2(next, "liquid")))) {
            if (data.lines[next] < 1) {
              level.push(-20);
            } else if (data.lines[next] > 1) {
              level.push(indent);
            } else {
              level.push(-10);
            }
          } else if (isType2(a, "liquid_start_bad")) {
            indent = indent + 1;
            level.push(indent);
          } else if (isType2(next, "liquid_end_bad")) {
            indent = indent - 1;
            level.push(indent);
          } else if (isType2(a, "ignore") && isType2(next, "end")) {
            level.push(indent);
          } else {
            if (isType2(a, "liquid") && isLineBreak(a))
              onLineBreak();
            level.push(indent);
          }
        }
        if (isType2(a, "content") === false && isType2(a, "singleton") === false && isType2(a, "liquid") === false && isType2(a, "attribute") === false) {
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
  function format2() {
    a = parse.start;
    let lastLevel = rules.indentLevel;
    do {
      if (data.lexer[a] === "markup") {
        if ((isType2(a, "start") || isType2(a, "singleton") || isType2(a, "xml")) && isIndex(a, "attribute") < 0 && a < c - 1 && data.types[a + 1] !== void 0 && isIndex(a + 1, "attribute") > -1) {
          onAttributeEnd();
        }
        if (isToken(a, void 0) === false && data.token[a].indexOf(parse.crlf) > 0 && (isType2(a, "content") && rules.markup.preserveText === false || isType2(a, "comment") || isType2(a, "attribute"))) {
          ml();
        } else if (isType2(a, "comment") && (is(data.token[a][1], 37 /* PER */) && rules.liquid.preserveComment === false && rules.liquid.commentNewline === true || is(data.token[a][1], 37 /* PER */) === false && rules.markup.preserveComment === false && rules.markup.commentNewline === true) && (rules.preserveLine === 0 || build.length > 0 && build[build.length - 1].lastIndexOf(NWL) + 1 < 2)) {
          build.push(
            nl(levels[a]),
            data.token[a],
            nl(levels[a])
          );
        } else if (isIndex(a, "_preserve") > -1) {
          build.push(data.token[a]);
        } else {
          if (rules.markup.delimiterForce === true)
            onDelimiterForce();
          build.push(data.token[a]);
          if (levels[a] === -10 && a < c - 1) {
            build.push(WSP);
          } else if (levels[a] > -1) {
            lastLevel = levels[a];
            if (isIndex(a + 1, "_preserve") < 0) {
              build.push(nl(levels[a]));
            }
          }
        }
      } else {
        parse.start = a;
        parse.ender = extidx[a];
        const external = parse.external(lastLevel);
        if (rules.language === "jsx" && (data.types[a - 1] === "template_string_end" || data.types[a - 1] === "jsx_attribute_start" || data.types[a - 1] === "script_start")) {
          build.push(external);
        } else {
          build.push(external);
          if (rules.markup.forceIndent === true || levels[parse.iterator] > -1 && a in extidx && extidx[a] > a) {
            build.push(nl(levels[parse.iterator]));
          }
        }
        a = parse.iterator;
      }
      a = a + 1;
    } while (a < c);
    parse.iterator = c - 1;
    if (build[0] === parse.crlf || is(build[0], 32 /* WSP */))
      build[0] = NIL;
    return rules.endNewline === true ? build.join(NIL).replace(/\s*$/, parse.crlf) : build.join(NIL).replace(/\s+$/, NIL);
  }
  return format2();
}

// src/format/script.ts
function script2() {
  const { data, rules } = parse;
  const option = parse.language === "json" ? rules.json : rules.script;
  const exidx = {};
  const lexer = "script";
  const b = parse.ender < 1 || parse.ender > data.token.length ? data.token.length : parse.ender + 1;
  const levels = (() => {
    let a = parse.start;
    let indent = rules.indentLevel;
    let notcomment = false;
    let lastlist = false;
    let ctype = NIL;
    let ctoke = NIL;
    let ltype = data.types[0];
    let ltoke = data.token[0];
    const vindex = [-1];
    const commas = [];
    const level = parse.start > 0 ? Array(parse.start).fill(0, 0, parse.start) : [];
    const ternary = [];
    const extraindent = [[]];
    const arrbreak = [];
    const destruct = [];
    const itemcount = [];
    const assignlist = [false];
    const wordlist = [];
    const count = [];
    function comment() {
      destructfix(false, false);
      const ind = option.commentIndent === true ? indent : 0;
      if (notcomment === false && /\/\u002a\s*global\s/.test(data.token[a])) {
        const glist = data.token[a].replace(/\/\u002a\s*global\s+/, NIL).replace(/\s*\u002a\/$/, NIL).split(",");
        let aa = glist.length;
        do {
          aa = aa - 1;
          glist[aa] = glist[aa].replace(/\s+/g, NIL);
          if (glist[aa] !== NIL)
            parse.scopes.push([glist[aa], -1]);
        } while (aa > 0);
      }
      if (data.types[a - 1] === "comment" || data.types[a + 1] === "comment") {
        level[a - 1] = ind;
      } else if (data.lines[a] < 2) {
        let aa = a + 1;
        if (data.types[aa] === "comment") {
          do
            aa = aa + 1;
          while (aa < b && data.types[aa] === "comment");
        }
        if (a < b - 1 && data.stack[aa] !== "block" && (is(data.token[aa], 123 /* LCB */) || data.token[aa] === "x{")) {
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
              if (data.types[bb] === "end")
                break;
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
          if (option.commentIndent === true && level[a] > -1 && data.lines[a] < 3) {
            data.lines[a] = 3;
          }
        }
        if (data.types[a + 1] !== "comment")
          notcomment = true;
        return;
      } else if (is(data.token[a - 1], 44 /* COM */)) {
        level[a - 1] = ind;
      } else if (is(ltoke, 61 /* EQS */) && data.types[a - 1] !== "comment" && /^\/\*{2}\s*@[A-Za-z_]+/.test(ctoke) === true) {
        level[a - 1] = -10;
      } else if (is(ltoke, 123 /* LCB */) && data.types[a - 1] !== "comment" && data.lines[0] < 2) {
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
      if (is(data.token[data.begin[a]], 40 /* LPR */)) {
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
      if (option.commentNewline === true && ctoke.startsWith("//") === false && data.lines[a] >= 3) {
        data.lines[a] = 2;
      }
    }
    function destructfix(listFix, override) {
      let c = a - 1;
      let d = listFix === true ? 0 : 1;
      const ei = extraindent[extraindent.length - 1] === void 0 ? [] : extraindent[extraindent.length - 1];
      const arrayCheck = override === false && data.stack[a] === "array" && listFix === true && not(ctoke, 91 /* LSB */);
      if (destruct[destruct.length - 1] === false || data.stack[a] === "array" && option.arrayFormat === "inline" || data.stack[a] === "object" && option.objectIndent === "inline") {
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
          if (data.stack[a] === "class" || data.stack[a] === "map" || arrayCheck === false && (listFix === false && data.token[c] !== "(" && data.token[c] !== "x(" || listFix === true && is(data.token[c], 44 /* COM */))) {
            if (data.types[c + 1] === "liquid_start") {
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
            if (is(data.token[c], 44 /* COM */))
              level[c] = indent;
            if (c === data.begin[a])
              break;
          }
          if (listFix === false)
            break;
        }
        if (d < 0) {
          if (data.types[c + 1] === "liquid_start" || data.types[c + 1] === "template_string_start") {
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
            } else if (is(data.token[aa], 44 /* COM */)) {
              level[aa] = indent + 1;
            }
          } while (aa > begin);
          level[begin] = indent + 1;
          level[a - 1] = indent;
        } else {
          level[a - 1] = -20;
        }
      };
      if (is(ctoke, 41 /* RPR */) && is(data.token[a + 1], 46 /* DOT */) && not(data.token[ei[0]], 58 /* COL */) && ei[ei.length - 1] > -1) {
        let c = data.begin[a];
        let d = false;
        let e = false;
        do
          c = c - 1;
        while (c > 0 && level[c] < -9);
        d = level[c] === indent;
        c = a + 1;
        do {
          c = c + 1;
          if (is(data.token[c], 123 /* LCB */)) {
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
      if (is(data.token[a + 1], 58 /* COL */) && (data.stack[a] === "object" || data.stack[a] === "array")) {
        destructfix(true, false);
      }
      if (is(data.token[data.begin[a] - 1], 44 /* COM */) && (is(data.token[a + 1], 125 /* RCB */) || is(data.token[a + 1], 93 /* RSB */)) && (data.stack[a] === "object" || data.stack[a] === "array")) {
        destructfix(true, false);
      }
      if (data.stack[a] !== "attribute") {
        if (not(ctoke, 41 /* RPR */) && ctoke !== "x)" && (data.lexer[a - 1] !== "markup" || data.lexer[a - 1] === "markup" && data.token[a - 2] !== "return")) {
          indent = indent - 1;
        }
        if (is(ctoke, 125 /* RCB */) && data.stack[a] === "switch" && option.noCaseIndent === false) {
          indent = indent - 1;
        }
      }
      if (is(ctoke, 125 /* RCB */) || ctoke === "x}") {
        if (data.types[a - 1] !== "comment" && ltoke !== "{" && ltoke !== "x{" && ltype !== "end" && ltype !== "string" && ltype !== "number" && ltype !== "separator" && ltoke !== "++" && ltoke !== "--" && (a < 2 || data.token[a - 2] !== ";" || data.token[a - 2] !== "x;" || ltoke === "break" || ltoke === "return")) {
          let c = a - 1;
          let assign2 = false;
          const begin = data.begin[a];
          const listlen = commas.length;
          do {
            if (data.begin[c] === begin) {
              if (is(data.token[c], 61 /* EQS */) || is(data.token[c], 59 /* SEM */) || data.token[c] === "x;") {
                assign2 = true;
              }
              if (is(data.token[c], 46 /* DOT */) && level[c - 1] > -1) {
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
              if (is(data.token[c], 58 /* COL */) && ternary.length === 0 || is(data.token[c], 44 /* COM */) && assign2 === false) {
                break;
              }
              if (c === 0 || data.token[c - 1] === "{" || data.token[c - 1] === "x{" || data.token[c] === "for" || data.token[c] === "if" || data.token[c] === "do" || data.token[c] === "function" || data.token[c] === "while" || data.token[c] === "var" || data.token[c] === "let" || data.token[c] === "const" || data.token[c] === "with") {
                if (commas[listlen - 1] === false && listlen > 1 && (a === b - 1 || data.token[a + 1] !== ")" && data.token[a + 1] !== "x)") && data.stack[a] !== "object") {
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
        vindex.pop();
      }
      if (option.bracePadding === false && ctoke !== "}" && ltype !== "markup") {
        level[a - 1] = -20;
      }
      if (option.bracePadding === true && ltype !== "start" && ltoke !== ";" && (level[data.begin[a]] < -9 || destruct[destruct.length - 1] === true)) {
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
      } else if ((data.stack[a] === "object" || data.begin[a] === 0 && is(ctoke, 125 /* RCB */)) && ei.length > 0) {
        endExtraInd();
        destruct[destruct.length - 1] = false;
        level[data.begin[a]] = indent + 1;
        level[a - 1] = indent;
        level.push(-20);
      } else if (ctoke === ")" || ctoke === "x)") {
        const countx = ctoke === ")" && not(ltoke, 40 /* LPR */) && count.length > 0 ? count.pop() + 1 : 0;
        const countif = data.token[data.begin[a] - 1] === "if" ? (() => {
          let bb = a;
          do {
            bb = bb - 1;
            if (data.token[bb] === ")" && level[bb - 1] > -1)
              return countx;
          } while (bb > data.begin[a]);
          return countx + 5;
        })() : countx;
        if (countx > 0 && (rules.language !== "jsx" || rules.language === "jsx" && data.token[data.begin[a] - 1] !== "render")) {
          const wrap = rules.wrap;
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
          const wrap = rules.wrap;
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
            if (len > wrap - 1 && wrap > 0 && not(ltoke, 40 /* LPR */) && short !== -1 && destruct[destruct.length - 2] === false) {
              if (data.token[open - 1] === "if" && commas[commas.length - 1] === true || data.token[open - 1] !== "if") {
                level[open] = ind;
                if (data.token[open - 1] === "for") {
                  aa = open;
                  do {
                    aa = aa + 1;
                    if (is(data.token[aa], 59 /* SEM */) && data.begin[aa] === open) {
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
              } else if (is(data.token[aa], 44 /* COM */) && comma === false) {
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
                  if (data.types[aa] === "end" || is(data.token[aa], 44 /* COM */) || is(data.token[aa], 59 /* SEM */)) {
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
                } else if (is(data.token[aa], 44 /* COM */)) {
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
        } else if (rules.language === "jsx") {
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
        if (rules.language === "jsx") {
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
      } else if (data.types[a - 1] !== "comment" && (is(ltoke, 123 /* LCB */) && is(ctoke, 125 /* RCB */) || is(ltoke, 91 /* LSB */) && ctoke === "]")) {
        level[a - 1] = -20;
        level.push(-20);
      } else if (ctoke === "]") {
        if (commas[commas.length - 1] === true && destruct[destruct.length - 1] === false && option.arrayFormat !== "inline" || is(ltoke, 93 /* RSB */) && level[a - 2] === indent + 1) {
          level[a - 1] = indent;
          level[data.begin[a]] = indent + 1;
        } else if (level[a - 1] === -10) {
          level[a - 1] = -20;
        }
        if (data.token[data.begin[a] + 1] === "function") {
          level[a - 1] = indent;
        } else if (commas[commas.length - 1] === false) {
          if (is(ltoke, 125 /* RCB */) || ltoke === "x}")
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
        } else if (rules.language === "jsx") {
          markuplist();
        }
        if (option.arrayFormat === "inline") {
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
      } else if (is(ctoke, 125 /* RCB */) || ctoke === "x}" || commas[commas.length - 1] === true) {
        if (is(ctoke, 125 /* RCB */) && ltoke === "x}" && data.token[a + 1] === "else") {
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
      lastlist = commas[commas.length - 1];
      commas.pop();
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
      if (c < 1 && ei[c] < 0 && (is(ctoke, 59 /* SEM */) || ctoke === "x;" || ctoke === ")" || ctoke === "x)" || is(ctoke, 125 /* RCB */) || ctoke === "x}")) {
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
      exidx[skip] = a;
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
        if (rules.wrap < 1) {
          level.push(-10);
          return;
        }
        do {
          c = c - 1;
          if (is(data.token[data.begin[a]], 40 /* LPR */)) {
            if (c === data.begin[a]) {
              meth = line;
            }
            if (is(data.token[c], 44 /* COM */) && data.begin[c] === data.begin[a] && commas[commas.length - 1] === true) {
              break;
            }
          }
          if (line > rules.wrap - 1)
            break;
          if (level[c] > -9)
            break;
          if (data.types[c] === "operator" && data.token[c] !== "=" && data.token[c] !== "+" && data.begin[c] === data.begin[a]) {
            break;
          }
          line = line + data.token[c].length;
          if (c === data.begin[a] && data.token[c] === "[" && line < rules.wrap - 1) {
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
        if (line > rules.wrap - 1 && level[c] < -9) {
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
        if (line + next < rules.wrap) {
          level.push(-10);
          return;
        }
        if (is(data.token[data.begin[a]], 40 /* LPR */) && (data.token[ei[0]] === ":" || data.token[ei[0]] === "?")) {
          ind = indent + 3;
        } else if (data.stack[a] === "method") {
          level[data.begin[a]] = indent;
          if (commas[commas.length - 1] === true) {
            ind = indent + 3;
          } else {
            ind = indent + 1;
          }
        } else if (data.stack[a] === "object" || data.stack[a] === "array") {
          destructfix(true, false);
        }
        if (data.token[c] === "var" || data.token[c] === "let" || data.token[c] === "const") {
          line = line - rules.indentSize * rules.indentChar.length * 2;
        }
        if (meth > 0) {
          c = rules.wrap - meth;
        } else {
          c = rules.wrap - line;
        }
        if (c > 0 && c < 5) {
          level.push(ind);
          if (data.token[a].charAt(0) === '"' || data.token[a].charAt(0) === "'") {
            a = a + 1;
            level.push(-10);
          }
          return;
        }
        if (data.token[data.begin[a]] !== "(" || meth > rules.wrap - 1 || meth === 0) {
          if (meth > 0)
            line = meth;
          if (line - aa.length < rules.wrap - 1 && (aa.charAt(0) === '"' || aa.charAt(0) === "'")) {
            a = a + 1;
            line = line + 3;
            if (line - aa.length > rules.wrap - 4) {
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
              if (is(data.token[c], 44 /* COM */) || is(data.token[c], 59 /* SEM */) || data.types[c] === "end" || is(data.token[c], 58 /* COL */)) {
                ei.pop();
                indent = indent - 1;
                break;
              }
              if (data.token[c] === "?" || is(data.token[c], 58 /* COL */)) {
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
        if (is(ltoke, 125 /* RCB */) || ltoke === "x}")
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
          if (data.types[a + 1] === "word" || data.types[a + 1] === "reference" || (is(data.token[a + 1], 40 /* LPR */) || data.token[a + 1] === "x(") && data.token[a - 2] === "new") {
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
        if (option.ternaryLine === true) {
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
          if (is(data.token[data.begin[a]], 40 /* LPR */) && (ei.length < 2 || ei[0] === ei[1])) {
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
              if (is(data.token[c], 44 /* COM */) || is(data.token[c], 59 /* SEM */)) {
                level[a - 1] = -20;
                break;
              }
              if (data.token[c] === "?") {
                ternary.pop();
                endExtraInd();
                if (option.ternaryLine === true)
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
        if ((is(ltoke, 41 /* RPR */) || ltoke === "x)") && data.token[data.begin[a - 1] - 2] === "function") {
          level[a - 1] = -20;
          level.push(-10);
          return;
        }
        if (data.stack[a] === "attribute") {
          level[a - 1] = -20;
          level.push(-10);
          return;
        }
        if (data.token[data.begin[a]] !== "(" && data.token[data.begin[a]] !== "x(" && (ltype === "reference" || is(ltoke, 41 /* RPR */) || is(ltoke, 93 /* RSB */) || ltoke === "?") && (data.stack[a] === "map" || data.stack[a] === "class" || data.types[a + 1] === "reference") && (ternary.length === 0 || ternary[ternary.length - 1] < data.begin[a]) && ("mapclassexpressionmethodglobalparen".indexOf(data.stack[a]) > -1 || data.types[a - 2] === "word" && data.stack[a] !== "switch")) {
          level[a - 1] = -20;
          level.push(-10);
          return;
        }
        if (data.stack[a] === "switch" && (ternary.length < 1 || ternary[ternary.length - 1] < data.begin[a])) {
          level[a - 1] = -20;
          if (option.caseSpace === true) {
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
        if (rules.wrap < 1 || data.token[data.begin[a]] === "x(") {
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
        if (is(ltoke, 40 /* LPR */)) {
          level[a - 1] = -20;
        } else if (ctoke === "*" && data.stack[a] === "object" && data.types[a + 1] === "reference" && (is(ltoke, 123 /* LCB */) || is(ltoke, 44 /* COM */))) {
          level[a - 1] = indent;
        } else if (ctoke !== "?" || ternary.length === 0) {
          level[a - 1] = -10;
        }
      }
      if (ctoke.indexOf("=") > -1 && ctoke !== "==" && ctoke !== "===" && ctoke !== "!=" && ctoke !== "!==" && ctoke !== ">=" && ctoke !== "<=" && ctoke !== "=>" && data.stack[a] !== "method" && data.stack[a] !== "object") {
        let c = a + 1;
        let d = 0;
        let e = false;
        let f = NIL;
        if ((is(data.token[data.begin[a]], 40 /* LPR */) || data.token[data.begin[a]] === "x(") && data.token[a + 1] !== "function") {
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
              if (data.types[c] === "operator" || is(data.token[c], 59 /* SEM */) || data.token[c] === "x;" || data.token[c] === "?" || data.token[c] === "var" || data.token[c] === "let" || data.token[c] === "const") {
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
      if (ctoke === "-" && ltoke === "return" || is(ltoke, 61 /* EQS */)) {
        level.push(-20);
        return;
      }
      if (ltype === "operator" && data.types[a + 1] === "reference" && ltoke !== "--" && ltoke !== "++" && ctoke !== "&&" && ctoke !== "||") {
        level.push(-20);
        return;
      }
      return opWrap();
    }
    function reference() {
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
      } else if (is(ltoke, 44 /* COM */)) {
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
        if (option.methodChain > 0) {
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
          if (z.length < option.methodChain) {
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
        if (option.methodChain === 0) {
          level[a - 1] = -20;
        } else if (option.methodChain < 0) {
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
        if (commas[commas.length - 1] === false && (data.stack[a] === "object" || data.stack[a] === "array" || data.stack[a] === "paren" || data.stack[a] === "expression" || data.stack[a] === "method")) {
          commas[commas.length - 1] = true;
          if (is(data.token[data.begin[a]], 40 /* LPR */)) {
            let aa = a;
            do {
              aa = aa - 1;
              if (data.begin[aa] === data.begin[a] && data.token[aa] === "+" && level[aa] > -9) {
                level[aa] = level[aa] + 2;
              }
            } while (aa > data.begin[a]);
          }
        }
        if (data.stack[a] === "array" && option.arrayFormat === "indent") {
          level[a - 1] = -20;
          level.push(indent);
          return;
        }
        if (data.stack[a] === "array" && option.arrayFormat === "inline") {
          level[a - 1] = -20;
          level.push(-10);
          return;
        }
        if (data.stack[a] === "object" && option.objectIndent === "indent") {
          level[a - 1] = -20;
          level.push(indent);
          return;
        }
        if (data.stack[a] === "object" && option.objectIndent === "inline") {
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
        if ((is(data.token[data.begin[a]], 40 /* LPR */) || data.token[data.begin[a]] === "x(") && rules.language !== "jsx" && data.stack[a] !== "global" && (data.types[a - 1] !== "string" && data.types[a - 1] !== "number" || data.token[a - 2] !== "+" || data.types[a - 1] === "string" && data.types[a - 1] !== "number" && is(data.token[a - 2], 43 /* PLS */) && data.types[a - 3] !== "string" && data.types[a - 3] !== "number")) {
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
              if (is(data.token[c], 44 /* COM */) && data.types[c + 1] !== "comment") {
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
                if (is(data.token[aa], 44 /* COM */))
                  break;
                if (is(data.token[aa], 58 /* COL */)) {
                  destructfix(true, false);
                  break;
                }
              }
              aa = aa - 1;
            } while (aa > bb);
          }
        }
        if (destruct[destruct.length - 1] === false || is(data.token[a - 2], 43 /* PLS */) && (ltype === "string" || ltype === "number") && level[a - 2] > 0 && (is(ltoke, 34 /* DQO */) || is(ltoke, 39 /* SQO */))) {
          if (data.stack[a] === "method") {
            if (is(data.token[a - 2], 43 /* PLS */) && (is(ltoke, 34 /* DQO */) || is(ltoke, 39 /* SQO */)) && (data.token[a - 3].charAt(0) === '"' || data.token[a - 3].charAt(0) === "'")) {
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
      if (is(ctoke, 59 /* SEM */) || ctoke === "x;") {
        fixchain();
        if (data.token[a + 1] !== void 0 && data.types[a + 1].indexOf("attribute") > 0 && data.types[a + 1].indexOf("end") > 0) {
          level[a - 1] = -20;
          level.push(indent - 1);
          return;
        }
        if (vindex[vindex.length - 1] > -1 && data.stack[vindex[vindex.length - 1]] !== "expression") {
          let aa = a;
          do {
            aa = aa - 1;
            if (is(data.token[aa], 59 /* SEM */))
              break;
            if (is(data.token[aa], 44 /* COM */)) {
              indent = indent - 1;
              break;
            }
            if (data.types[aa] === "end")
              aa = data.begin[aa];
          } while (aa > 0 && aa > data.begin[a]);
        }
        vindex[vindex.length - 1] = -1;
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
      if (is(ltoke, 41 /* RPR */) || not(ltoke, 93 /* RSB */) && (deeper === "object" || deeper === "array")) {
        if (deep !== "method" || deep === "method" && not(data.token[a + 1], 41 /* RPR */) && not(data.token[a + 2], 41 /* RPR */)) {
          if (is(ltoke, 41 /* RPR */) && (deep !== "function" || is(data.token[data.begin[data.begin[a - 1] - 1]], 40 /* LPR */) || data.token[data.begin[data.begin[a - 1] - 1]] === "x(")) {
            destructfix(false, false);
          } else if (data.types[a + 1] !== "end" && data.types[a + 2] !== "end") {
            destructfix(true, false);
          }
        }
      }
      commas.push(false);
      extraindent.push([]);
      assignlist.push(false);
      arrbreak.push(false);
      wordlist.push(false);
      itemcount.push(0);
      if (option.neverFlatten === true || deep === "attribute" || ltype === "generic" || option.arrayFormat === "indent" && deep === "array" || deep === "class" && not(ltoke, 40 /* LPR */) && ltoke !== "x(" || is(ctoke, 91 /* LSB */) && data.token[a + 1] === "function") {
        destruct.push(false);
      } else {
        if (deep === "expression" || deep === "method") {
          destruct.push(true);
        } else if ((deep === "object" || deep === "class") && (is(ltoke, 40 /* LPR */) || ltoke === "x(" || ltype === "word" || ltype === "reference")) {
          destruct.push(true);
        } else if (deep === "array" || is(ctoke, 40 /* LPR */) || ctoke === "x(") {
          destruct.push(true);
        } else if (is(ctoke, 123 /* LCB */) && deep === "object" && ltype !== "operator" && ltype !== "start" && ltype !== "string" && ltype !== "number" && deeper !== "object" && deeper !== "array" && a > 0) {
          destruct.push(true);
        } else {
          destruct.push(false);
        }
      }
      if (not(ctoke, 40 /* LPR */) && ctoke !== "x(" && data.stack[a + 1] !== "attribute") {
        indent = indent + 1;
      }
      if (is(ctoke, 123 /* LCB */) || ctoke === "x{") {
        vindex.push(-1);
        if (data.types[a - 1] !== "comment") {
          if (ltype === "markup") {
            level[a - 1] = indent;
          } else if (option.braceAllman === true && ltype !== "operator" && ltoke !== "return") {
            level[a - 1] = indent - 1;
          } else if (data.stack[a + 1] !== "block" && (deep === "function" || is(ltoke, 41 /* RPR */) || ltoke === "x)" || is(ltoke, 44 /* COM */) || is(ltoke, 125 /* RCB */) || ltype === "markup")) {
            level[a - 1] = -10;
          } else if (is(ltoke, 123 /* LCB */) || ltoke === "x{" || is(ltoke, 91 /* LSB */) || is(ltoke, 125 /* RCB */) || ltoke === "x}") {
            level[a - 1] = indent - 1;
          }
        }
        if (deep === "object") {
          if (option.objectIndent === "indent") {
            destruct[destruct.length - 1] = false;
            level.push(indent);
            return;
          }
          if (option.objectIndent === "inline") {
            destruct[destruct.length - 1] = true;
            level.push(-20);
            return;
          }
        }
        if (deep === "switch") {
          if (option.noCaseIndent === true) {
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
      if (is(ctoke, 40 /* LPR */) || ctoke === "x(") {
        if (rules.wrap > 0 && is(ctoke, 40 /* LPR */) && data.token[a + 1] !== ")") {
          count.push(1);
        }
        if (is(ltoke, 45 /* DSH */) && (is(data.token[a - 2], 40 /* LPR */) || data.token[a - 2] === "x(")) {
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
          if (ltoke === "import" || ltoke === "in" || option.functionNameSpace === true) {
            level[a - 1] = -10;
          } else if (is(ltoke, 125 /* RCB */) && data.stack[a - 1] === "function" || ltype === "word" || ltype === "reference" || ltype === "property") {
            level[a - 1] = -20;
          } else if (deeper !== "method" && deep !== "method") {
            level[a - 1] = indent;
          }
        }
        if (is(ltoke, 43 /* PLS */) && (is(data.token[a - 2], 34 /* DQO */) || is(data.token[a - 2], 39 /* SQO */))) {
          level.push(indent);
          return;
        }
        if (is(ltoke, 125 /* RCB */) || ltoke === "x}") {
          level.push(-20);
          return;
        }
        if (is(ltoke, 45 /* DSH */) && (a < 2 || not(data.token[a - 2], 41 /* RPR */) && not(data.token[a - 2], 93 /* RSB */) && data.token[a - 2] !== "x)" && data.types[a - 2] !== "reference" && data.types[a - 2] !== "string" && data.types[a - 2] !== "number") || option.functionSpace === false && ltoke === "function") {
          level[a - 1] = -20;
        }
        level.push(-20);
        return;
      }
      if (is(ctoke, 91 /* LSB */)) {
        if (is(ltoke, 91 /* LSB */))
          commas[commas.length - 2] = true;
        if (ltoke === "return" || ltoke === "var" || ltoke === "let" || ltoke === "const") {
          level[a - 1] = -10;
        } else if (data.types[a - 1] !== "comment" && data.stack[a - 1] !== "attribute" && (ltype === "end" || ltype === "word" || ltype === "reference")) {
          level[a - 1] = -20;
        } else if (is(ltoke, 91 /* LSB */) || is(ltoke, 123 /* LCB */) || ltoke === "x{") {
          level[a - 1] = indent - 1;
        }
        if (data.stack[a] === "attribute") {
          level.push(-20);
          return;
        }
        if (option.arrayFormat === "indent") {
          destruct[destruct.length - 1] = false;
          level.push(indent);
          return;
        }
        if (option.arrayFormat === "inline") {
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
          if (is(data.token[c], 93 /* RSB */)) {
            level.push(-20);
            return;
          }
          if (is(data.token[c], 44 /* COM */)) {
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
      } else if (ltype !== "liquid" && data.types[a + 1] !== "liquid") {
        level.push(-10);
      }
      if ((is(ltoke, 44 /* COM */) || ltype === "start") && (data.stack[a] === "object" || data.stack[a] === "array") && destruct[destruct.length - 1] === false && a > 0) {
        level[a - 1] = indent;
      }
    }
    function template() {
      if (rules.language !== "json" && data.types[a - 1] !== "string") {
        if (ctype === "liquid_else") {
          level[a - 1] = indent - 1;
          level.push(indent);
        } else if (ctype === "liquid_start") {
          indent = indent + 1;
          if (data.lines[a - 1] < 1)
            level[a - 1] = -20;
          if (data.lines[a] > 0 || ltoke.length === 1 && ltype === "string") {
            level.push(indent);
          } else {
            level.push(-20);
          }
        } else if (ctype === "liquid_end") {
          indent = indent - 1;
          if (ltype === "liquid_start" || data.lines[a - 1] < 1) {
            level[a - 1] = -20;
          } else {
            level[a - 1] = indent;
          }
          if (data.lines[a] > 0) {
            level.push(indent);
          } else {
            level.push(-20);
          }
        } else if (ctype === "liquid") {
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
        if (option.bracePadding === true) {
          level[a - 2] = -10;
          level[a - 1] = -10;
        } else {
          level[a - 2] = -20;
          level[a - 1] = -20;
        }
      }
    }
    function types() {
      if (is(data.token[a - 1], 44 /* COM */) || is(data.token[a - 1], 58 /* COL */) && data.stack[a - 1] !== "data_type") {
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
      if ((is(ltoke, 41 /* RPR */) || ltoke === "x)") && data.stack[a] === "class" && (data.token[data.begin[a - 1] - 1] === "static" || data.token[data.begin[a - 1] - 1] === "final" || data.token[data.begin[a - 1] - 1] === "void")) {
        level[a - 1] = -10;
        level[data.begin[a - 1] - 1] = -10;
      }
      if (is(ltoke, 93 /* RSB */))
        level[a - 1] = -10;
      if (ctoke === "else" && is(ltoke, 125 /* RCB */)) {
        if (data.token[a - 2] === "x}")
          level[a - 3] = level[a - 3] - 1;
        if (option.braceAllman === true || option.elseNewline === true) {
          level[a - 1] = indent;
        }
      }
      if (ctoke === "new" && grammar.js.keywords.has(data.token[a + 1]))
        ;
      if (ctoke === "from" && ltype === "end" && a > 0 && (data.token[data.begin[a - 1] - 1] === "import" || is(data.token[data.begin[a - 1] - 1], 44 /* COM */))) {
        level[a - 1] = -10;
      }
      if (ctoke === "function") {
        if (option.functionSpace === false && a < b - 1 && (is(data.token[a + 1], 40 /* LPR */) || data.token[a + 1] === "x(")) {
          level.push(-20);
          return;
        }
        level.push(-10);
        return;
      }
      if (is(ltoke, 45 /* DSH */) && a > 1) {
        if (data.types[a - 2] === "operator" || is(data.token[a - 2], 44 /* COM */)) {
          level[a - 1] = -20;
        } else if (data.types[a - 2] === "start") {
          level[a - 2] = -20;
          level[a - 1] = -20;
        }
      } else if (ctoke === "while" && (is(ltoke, 125 /* RCB */) || ltoke === "x}")) {
        let c = a - 1;
        let d = 0;
        do {
          if (is(data.token[c], 125 /* RCB */) || data.token[c] === "x}")
            d = d + 1;
          if (is(data.token[c], 123 /* LCB */) || data.token[c] === "x{")
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
      } else if (ctoke === "in" || (is(ltoke, 125 /* RCB */) || ltoke === "x}") && (ctoke === "catch" || ctoke === "else" && option.elseNewline === false && option.braceAllman === false)) {
        level[a - 1] = -10;
      } else if (ctoke === "var" || ctoke === "let" || ctoke === "const") {
        vindex[vindex.length - 1] = a;
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
            if (d < 0 || d === 0 && (is(data.token[c], 59 /* SEM */) || is(data.token[c], 44 /* COM */)))
              break;
            c = c + 1;
          } while (c < b);
          if (is(data.token[c], 44 /* COM */))
            indent = indent + 1;
        }
        level.push(-10);
        return;
      }
      if (ltype !== "word" && data.stack[a] === "switch" && (ctoke === "default" || ctoke === "case")) {
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
      if (option.bracePadding === false && a < b - 1 && is(data.token[a + 1], 125 /* RCB */)) {
        level.push(-20);
        return;
      }
      if (data.stack[a] === "object" && (is(ltoke, 123 /* LCB */) || is(ltoke, 44 /* COM */)) && (is(data.token[a + 1], 40 /* LPR */) || data.token[a + 1] === "x(")) {
        level.push(-20);
        return;
      }
      if (data.types[a - 1] === "comment" && is(data.token[data.begin[a]], 40 /* LPR */)) {
        level[a - 1] = indent + 1;
      }
      level.push(-10);
    }
    do {
      if (data.lexer[a] === lexer) {
        ctype = data.types[a];
        ctoke = data.token[a];
        if (ctype === "comment") {
          comment();
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
          reference();
        } else if (ctype === "markup") {
          markup3();
        } else if (ctype.indexOf("liquid") === 0) {
          template();
        } else if (ctype === "generic") {
          if (not(ltoke, 35 /* HSH */) && ltoke !== "return" && ltype !== "operator" && ltoke !== "public" && ltoke !== "private" && ltoke !== "static" && ltoke !== "final" && ltoke !== "implements" && ltoke !== "class" && ltoke !== "void") {
            level[a - 1] = -20;
          }
          if (is(data.token[a + 1], 40 /* LPR */) || data.token[a + 1] === "x(") {
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
            count[count.length - 1] = rules.wrap + 1;
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
      const chars = rules.indentChar;
      let index = rules.indentSize;
      if (typeof index !== "number" || index < 1)
        return NIL;
      do {
        tabby.push(chars);
        index = index - 1;
      } while (index > 0);
      return tabby.join(NIL);
    })();
    const pres = rules.preserveLine + 1;
    const invisibles = [
      "x;",
      "x}",
      "x{",
      "x(",
      "x)"
    ];
    let a = parse.start;
    let lastLevel = rules.indentLevel;
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
        linesout.push(parse.crlf);
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
    if (option.vertical === true) {
      let vertical2 = function(end) {
        let longest = 0;
        let complex = 0;
        let aa = end - 1;
        let bb = 0;
        let cc2 = 0;
        const begin = data.begin[a];
        const list = [];
        do {
          if ((data.begin[aa] === begin || is(data.token[aa], 93 /* RSB */) || is(data.token[aa], 41 /* RPR */)) && (is(data.token[aa + 1], 61 /* EQS */) || is(data.token[aa + 1], 59 /* SEM */) && data.stack[aa] === "object")) {
            bb = aa;
            complex = 0;
            do {
              if (data.begin[bb] === begin) {
                if (is(data.token[bb], 58 /* COL */) || is(data.token[bb], 59 /* SEM */) || data.token[bb] === "x;" || levels[bb] > -1 && data.types[bb] !== "comment") {
                  if (is(data.token[bb + 1], 46 /* DOT */)) {
                    complex = complex + rules.indentSize * rules.indentChar.length;
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
            if (is(data.token[cc2], 44 /* COM */) && is(data.token[aa + 1], 61 /* EQS */)) {
              do {
                if (data.types[cc2] === "end")
                  cc2 = data.begin[cc2];
                if (data.begin[cc2] === begin) {
                  if (is(data.token[cc2], 59 /* SEM */) || data.token[cc2] === "x;")
                    break;
                  if (data.token[cc2] === "var" || data.token[cc2] === "const" || data.token[cc2] === "let") {
                    complex = complex + rules.indentSize * rules.indentChar.length;
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
        if (data.lexer[a] === "script" && is(data.token[a], 125 /* RCB */) && not(data.token[a - 1], 123 /* LCB */) && levels[data.begin[a]] > 0) {
          vertical2(a);
        } else {
          a = data.begin[a];
        }
      } while (a > 0);
    }
    a = parse.start;
    do {
      if (data.lexer[a] === lexer) {
        if (data.types[a] === "comment" && option.commentIndent === true) {
          if (/\n/.test(data.token[a])) {
            const space = data.begin[a] > -1 ? is(data.token[a][2], 42 /* ARS */) ? repeatChar(levels[a], tab) + rules.indentChar : repeatChar(levels[a], tab) : rules.indentChar;
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
          if (not(data.token[a], 59 /* SEM */) || option.noSemicolon === false) {
            build.push(data.token[a]);
          } else if (levels[a] < 0 && data.types[a + 1] !== "comment") {
            build.push(";");
          }
        }
        if (a < b - 1 && data.lexer[a + 1] !== lexer && data.begin[a] === data.begin[a + 1] && data.types[a + 1].indexOf("end") < 0 && not(data.token[a], 44 /* COM */)) {
          build.push(WSP);
        } else if (levels[a] > -1) {
          if ((levels[a] > -1 && is(data.token[a], 123 /* LCB */) || levels[a] > -1 && is(data.token[a + 1], 125 /* RCB */)) && data.lines[a] < 3 && option.braceNewline === true) {
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
        if (exidx[a] === a) {
          build.push(data.token[a]);
        } else {
          parse.ender = exidx[a];
          parse.start = a;
          const output2 = parse.external(lastLevel);
          build.push(output2);
          a = parse.iterator;
          if (levels[a] === -10) {
            build.push(WSP);
          } else if (levels[a] > -1) {
            build.push(nl(levels[a]));
          }
        }
      }
      a = a + 1;
    } while (a < b);
    parse.iterator = b - 1;
    return build.join(NIL);
  })();
  return output;
}

// src/format/style.ts
function style2() {
  const build = [];
  const { data, rules, crlf } = parse;
  const len = parse.ender > 0 ? parse.ender + 1 : data.token.length;
  const pres = rules.preserveLine + 1;
  const tab = (() => {
    let aa = 0;
    const bb = [];
    do {
      bb.push(rules.indentChar);
      aa = aa + 1;
    } while (aa < rules.indentSize);
    return bb.join(NIL);
  })();
  let indent = rules.indentLevel;
  let a = parse.start;
  let when = [NIL, NIL];
  function isType2(index, name) {
    return data.types[index] === name;
  }
  function newline(tabs) {
    const lines = [];
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
      lines.push(crlf);
      index = index + 1;
    } while (index < total);
    if (tabs > 0) {
      index = 0;
      do {
        lines.push(tab);
        index = index + 1;
      } while (index < tabs);
    }
    build.push(lines.join(NIL));
  }
  do {
    if (isType2(a + 1, "end") || isType2(a + 1, "liquid_end") || isType2(a + 1, "liquid_else")) {
      indent = indent - 1;
    }
    if (isType2(a, "liquid") && data.lines[a] > 0) {
      build.push(data.token[a]);
      if (not(data.token[a + 1], 59 /* SEM */) && grammar.css.units.has(data.token[a + 1]) === false) {
        newline(indent);
      }
    } else if (isType2(a - 1, "selector") && isType2(a, "liquid") && isType2(a + 1, "selector")) {
      build.push(data.token[a]);
      if (isLast(data.token[a - 1], 45 /* DSH */) && (is(data.token[a + 1], 46 /* DOT */) || is(data.token[a + 1], 35 /* HSH */) || is(data.token[a + 1], 38 /* AND */))) {
        build.push(WSP);
      }
    } else if (isType2(a, "liquid_else")) {
      build.push(data.token[a]);
      indent = indent + 1;
      newline(indent);
    } else if (isType2(a, "start") || isType2(a, "liquid_start")) {
      indent = indent + 1;
      build.push(data.token[a]);
      if (isType2(a + 1, "end") === false && isType2(a + 1, "liquid_end") === false) {
        newline(indent);
      }
    } else if (is(data.token[a], 59 /* SEM */) || (isType2(a, "end") || isType2(a, "liquid_end") || isType2(a, "comment"))) {
      build.push(data.token[a]);
      if (isType2(a + 1, "value")) {
        if (data.lines[a + 1] === 1) {
          build.push(WSP);
        } else if (data.lines[a + 1] > 1) {
          newline(indent);
        }
      } else if (isType2(a + 1, "separator") === false) {
        if (isType2(a + 1, "comment") === false || isType2(a + 1, "comment") && data.lines[a + 1] > 1) {
          newline(indent);
        } else {
          build.push(WSP);
        }
      } else if (isType2(a, "comment") && isType2(a + 1, "comment") === false) {
        if (data.lines[a] > 1) {
          newline(indent);
        }
      }
    } else if (is(data.token[a], 58 /* COL */)) {
      build.push(data.token[a]);
      if (isType2(a + 1, "selector") === false && not(data.token[a + 1], 44 /* COM */)) {
        build.push(WSP);
      }
    } else if (isType2(a, "selector") || isType2(a, "at_rule")) {
      if (rules.style.classPadding === true && isType2(a - 1, "end") && data.lines[a] < 3) {
        newline(indent);
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
      if (isType2(a + 1, "start")) {
        build.push(WSP);
      }
    } else if (is(data.token[a], 44 /* COM */)) {
      if (isType2(a + 1, "value")) {
        newline(indent);
        build.push(data.token[a]);
      } else {
        build.push(data.token[a]);
      }
      if (isType2(a + 1, "selector") || isType2(a + 1, "property")) {
        newline(indent);
      } else {
        build.push(WSP);
      }
    } else if (data.stack[a] === "map" && is(data.token[a + 1], 41 /* RPR */) && a - data.begin[a] > 5) {
      build.push(data.token[a]);
      newline(indent);
    } else if (data.token[a] === "x;") {
      newline(indent);
    } else if ((isType2(a, "variable") || isType2(a, "function")) && rules.style.classPadding === true && isType2(a - 1, "end") && data.lines[a] < 3) {
      build.push(crlf);
      build.push(data.token[a]);
    } else if (not(data.token[a], 59 /* SEM */)) {
      build.push(data.token[a]);
    }
    a = a + 1;
  } while (a < len);
  parse.iterator = len - 1;
  if (build[0] === parse.crlf || is(build[0], 32 /* WSP */))
    build[0] = NIL;
  return rules.endNewline === true ? build.join(NIL).replace(/\s*$/, parse.crlf) : build.join(NIL).replace(/\s+$/, NIL);
}

// src/format/index.ts
function format(lexer) {
  if (lexer === 1 /* Markup */)
    return markup2();
  if (lexer === 3 /* Style */)
    return style2();
  if (lexer === 2 /* Script */)
    return script2();
}

// src/parse/parser.ts
var Stack = class extends Array {
  get entry() {
    return this[this.length - 1];
  }
  get token() {
    return this[this.length - 1][0];
  }
  get index() {
    return this[this.length - 1][1];
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
        this[i][1] = index;
      }
      return this[i];
    } else {
      this.push([token, index]);
      return this[i + 1];
    }
  }
  pop() {
    const i = this.length - 1;
    const x = this[i];
    if (i > 0)
      this.splice(i, 1);
    return x;
  }
};
var _Parser = class {
  constructor() {
    this.hooks = { parse: null, format: null };
    this.env = typeof process !== "undefined" && process.versions != null ? "node" : "browser";
    this.start = 0;
    this.ender = 0;
    this.iterator = 0;
    this.scopes = [];
    this.attributes = /* @__PURE__ */ new Map();
    this.regions = /* @__PURE__ */ new Map();
    this.pairs = /* @__PURE__ */ new Map();
    this.error = NIL;
    this.crlf = "\n";
    this.references = [[]];
    this.count = -1;
    this.lineColumn = 0;
    this.lineNumber = 1;
    this.lineOffset = 1;
    this.lineIndex = 0;
    this.rules = {
      crlf: false,
      defaults: "none",
      language: "auto",
      endNewline: false,
      indentChar: " ",
      indentLevel: 0,
      indentSize: 2,
      preserveLine: 2,
      wrap: 0,
      liquid: {
        commentNewline: false,
        commentIndent: true,
        correct: false,
        delimiterTrims: "preserve",
        ignoreTagList: [],
        indentAttributes: false,
        lineBreakSeparator: "default",
        normalizeSpacing: true,
        preserveComment: false,
        quoteConvert: "none"
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
        selfCloseSVG: true,
        stripAttributeLines: false,
        quoteConvert: "none"
      },
      json: assign({
        arrayFormat: "default",
        braceAllman: false,
        bracePadding: false,
        objectIndent: "default",
        objectSort: false
      }, {
        braceStyle: "none",
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
        preserveComment: false,
        quoteConvert: "none",
        styleGuide: "none",
        ternaryLine: false,
        variableList: "none",
        vertical: false
      }, {
        quoteConvert: "double",
        endComma: "never",
        noSemicolon: true,
        vertical: false
      }),
      style: {
        commentIndent: false,
        commentNewline: false,
        correct: false,
        atRuleSpace: true,
        classPadding: false,
        noLeadZero: false,
        preserveComment: false,
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
    };
    this.data = {
      begin: [],
      ender: [],
      lexer: [],
      lines: [],
      stack: [],
      token: [],
      types: []
    };
  }
  get source() {
    if (this.mode === 2 /* Embed */)
      return _Parser.region;
    return this.env === "node" && Buffer.isBuffer(_Parser.input) ? _Parser.input.toString() : _Parser.input;
  }
  set source(source) {
    _Parser.input = this.env === "node" ? Buffer.isBuffer(source) ? source : Buffer.from(source) : source;
  }
  get current() {
    return {
      begin: this.data.begin[this.count],
      ender: this.data.ender[this.count],
      lexer: this.data.lexer[this.count],
      lines: this.data.lines[this.count],
      stack: this.data.stack[this.count],
      token: this.data.token[this.count],
      types: this.data.types[this.count]
    };
  }
  reset() {
    this.error = NIL;
    this.count = -1;
    this.start = 0;
    this.ender = 0;
    this.mode = 1 /* Parse */;
    this.data.begin = [];
    this.data.ender = [];
    this.data.lexer = [];
    this.data.lines = [];
    this.data.stack = [];
    this.data.token = [];
    this.data.types = [];
    this.references = [[]];
    this.scopes = [];
    this.stack = new Stack(["global", -1]);
    if (this.pairs.size > 0)
      this.pairs.clear();
    if (this.attributes.size > 0)
      this.attributes.clear();
    if (this.regions.size > 0)
      this.regions.clear();
  }
  get(index) {
    return {
      begin: this.data.begin[index],
      ender: this.data.ender[index],
      lexer: this.data.lexer[index],
      lines: this.data.lines[index],
      stack: this.data.stack[index],
      token: this.data.token[index],
      types: this.data.types[index]
    };
  }
  document(lexer, mode = 3 /* Format */) {
    this.reset();
    lexers(lexer);
    if (mode === 1 /* Parse */)
      return this.data;
    this.mode = 3 /* Format */;
    return format(lexer);
  }
  external(ref, input) {
    if (this.mode === 1 /* Parse */) {
      this.mode = 2 /* Embed */;
      const lexer = getLexerType(ref);
      _Parser.region = input;
      this.language = ref;
      this.lexer = getLexerName(this.language);
      this.regions.set(this.count + 1, { lexer, id: this.language });
      lexers(lexer);
      this.mode = 1 /* Parse */;
      this.lexer = getLexerName(this.rules.language);
      this.language = this.rules.language;
    } else {
      const { id, lexer } = this.regions.get(this.start);
      this.language = id;
      this.rules.indentLevel = ref;
      const beautify = format(lexer);
      this.rules.indentLevel = 0;
      this.language = this.rules.language;
      this.lexer = getLexerName(this.language);
      return beautify;
    }
  }
  final(data) {
    let a = this.count;
    const begin = data.begin[a];
    if (data.lexer[a] === "style" && this.rules.style.sortProperties || data.lexer[a] === "script" && (this.rules.script.objectSort || this.rules.json.objectSort)) {
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
  push(data, record, structure = NIL) {
    data.begin.push(record.begin);
    data.ender.push(record.ender);
    data.lexer.push(record.lexer);
    data.stack.push(record.stack);
    data.token.push(record.token);
    data.types.push(record.types);
    data.lines.push(record.lines);
    if (data !== this.data)
      return;
    this.lineOffset = 0;
    this.count = this.count + 1;
    if (record.lexer !== "style" && structure.replace(/[{}@<>%#]/g, NIL) === NIL) {
      structure = record.types === "else" ? "else" : getTagName(record.token);
    }
    if (record.types === "start" || record.types.indexOf("_start") > 0) {
      this.stack.push([structure, this.count]);
    } else if (record.types === "end" || record.types.indexOf("_end") > 0) {
      let ender = 0;
      const length = this.stack.length;
      if (length > 2 && (data.types[this.stack[length - 1][1]] === "else" || data.types[this.stack[length - 1][1]].indexOf("_else") > 0) && (data.types[this.stack[length - 2][1]] === "start" || data.types[this.stack[length - 2][1]].indexOf("_start") > 0) && (data.types[this.stack[length - 2][1] + 1] === "else" || data.types[this.stack[length - 2][1] + 1].indexOf("_else") > 0)) {
        this.stack.pop();
        data.begin[this.count] = this.stack.index;
        data.stack[this.count] = this.stack.token;
        data.ender[this.count - 1] = this.count;
        ender = data.ender[data.begin[this.count] + 1];
      }
      this.final(data);
      if (ender > 0)
        data.ender[data.begin[this.count] + 1] = ender;
      this.stack.pop();
    } else if (record.types === "else" || record.types.indexOf("_else") > 0) {
      if (structure === NIL)
        structure = "else";
      if (this.count > 0 && (data.types[this.count - 1] === "start" || data.types[this.count - 1].indexOf("_start") > 0)) {
        this.stack.push([structure, this.count]);
      } else {
        this.final(data);
        this.stack.update(structure === NIL ? "else" : structure, this.count);
      }
    }
    if (this.hooks.parse !== null) {
      this.hooks.parse[0].call({
        line: this.lineNumber,
        stack: this.stack.entry,
        language: this.language
      }, record, this.count);
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
          this.lineOffset = 0;
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
        this.lineOffset = 0;
      }
    }
  }
  spacer(args) {
    this.lineOffset = 1;
    do {
      if (args.array[args.index] === NWL) {
        this.lineOffset = this.lineOffset + 1;
        this.lineNumber = this.lineNumber + 1;
      }
      if (ws(args.array[args.index + 1]) === false)
        break;
      args.index = args.index + 1;
    } while (args.index < args.end);
    return args.index;
  }
};
var Parser = _Parser;
Parser.input = NIL;
Parser.region = NIL;
var parse = new Parser();

// src/parse/detection.ts
function detect2(sample) {
  let b = [];
  let c = 0;
  const vtest = /(((var)|(let)|(const)|(function)|(import))\s+(\w|\$)+[a-zA-Z0-9]*)/.test(sample) && /@import/.test(sample) === false;
  const stest = /((((final)|(public)|(private))\s+static)|(static\s+void))/.test(sample);
  function Style() {
    if (/\n\s*#+\s+/.test(sample) || /^#+\s+/.test(sample)) {
      return {
        language: "markdown",
        lexer: "markup"
      };
    }
    if (/\$[a-zA-Z]/.test(sample) || /\{\s*(\w|\.|\$|#)+\s*\{/.test(sample) || /^[.#]?[\w][\w-]+\s+\{(?:\s+[a-z][a-z-]+:\s*\S+;)+\s+[&>+]?\s+[.#:]?[\w][\w-]\s+\{/.test(sample) && /:\s*@[a-zA-Z];/.test(sample) === false) {
      return {
        language: "scss",
        lexer: "style"
      };
    }
    if (/@[a-zA-Z]:/.test(sample) || /\.[a-zA-Z]\(\);/.test(sample)) {
      return {
        language: "less",
        lexer: "style"
      };
    }
    return {
      language: "css",
      lexer: "style"
    };
  }
  function NotMarkup() {
    let d = 1;
    let join = NIL;
    let flaga = false;
    let flagb = false;
    const pp = /((public)|(private))\s+(static\s+)?(((v|V)oid)|(class)|(final))/.test(sample);
    function Script() {
      if (sample.indexOf("(") > -1 || sample.indexOf("=") > -1 || sample.indexOf(";") > -1 && sample.indexOf("{") > -1) {
        if (stest === true || /\w<\w+(,\s+\w+)*>/.test(sample) || /(?:var|let|const)\s+\w+\s*:/.test(sample) || /=\s*<\w+/.test(sample)) {
          return {
            language: "typescript",
            lexer: "script"
          };
        }
        return {
          language: "javascript",
          lexer: "script"
        };
      }
      return {
        language: "unknown",
        lexer: "text"
      };
    }
    function ScriptOrStyle() {
      if (/:\s*(?:number|string|boolean|any|unknown)(?:\[\])?/.test(sample) || /(?:public|private)\s+/.test(sample) || /(?:export|declare)\s+type\s+\w+\s*=/.test(sample) || /(?:namespace|interface|enum|implements|declare)\s+\w+/.test(sample) || /(?:typeof|keyof|as)\s+\w+/.test(sample) || /\w+\s+as\s+\w+/.test(sample) || /\[\w+(?:(?::\s*\w+)|(?:\s+in\s+\w+))\]:/.test(sample) || /\):\s*\w+(?:\[\])?\s*(?:=>|\{)\s+/.test(sample) || /(var|const|let)\s+\w+:\s*(string|number|boolean|string|any)(\[\])?/.test(sample)) {
        return {
          language: "typescript",
          lexer: "script"
        };
      }
      if (/\s(class|var|const|let)\s+\w/.test(sample) === false && /<[a-zA-Z](?:-[a-zA-Z])?/.test(sample) && /<\/[a-zA-Z-](?:-[a-zA-Z])?/.test(sample) && (/\s?\{%/.test(sample) || /{{/.test(sample))) {
        return {
          language: "liquid",
          lexer: "markup"
        };
      }
      if (/^(\s*[$@])/.test(sample) === false && /([}\]];?\s*)$/.test(sample) && (/^\s*import\s+\*\s+as\s+\w+\s+from\s+['"]/.test(sample) || /module\.export\s+=\s+/.test(sample) || /export\s+default\s+\{/.test(sample) || /[?:]\s*[{[]/.test(sample) || /^(?:\s*return;?(?:\s+[{[])?)/.test(sample))) {
        return {
          language: "javascript",
          lexer: "script"
        };
      }
      if (/{%/.test(sample) && /{{/.test(sample) && /<\w/.test(sample)) {
        return {
          language: "liquid",
          lexer: "markup"
        };
      }
      if (/{\s*(?:\w|\.|@|#)+\s*\{/.test(sample)) {
        return {
          language: "less",
          lexer: "style"
        };
      }
      if (/\$(\w|-)/.test(sample)) {
        return {
          language: "scss",
          lexer: "style"
        };
      }
      if (/[;{:]\s*@\w/.test(sample) === true) {
        return {
          language: "less",
          lexer: "style"
        };
      }
      return {
        language: "css",
        lexer: "style"
      };
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
    join = b.join(NIL);
    if (/\s\/\//.test(sample) === false && /\/\/\s/.test(sample) === false && /^(\s*(\{|\[)(?!%))/.test(sample) === true && /((\]|\})\s*)$/.test(sample) && sample.indexOf(",") !== -1) {
      return {
        language: "json",
        lexer: "script"
      };
    }
    if (/((\}?(\(\))?\)*;?\s*)|([a-z0-9]("|')?\)*);?(\s*\})*)$/i.test(sample) === true && (vtest === true || pp === true || /console\.log\(/.test(sample) === true || /export\s+default\s+class\s+/.test(sample) === true || /export\s+(const|var|let|class)s+/.test(sample) === true || /document\.get/.test(sample) === true || /((=|(\$\())\s*function)|(\s*function\s+(\w*\s+)?\()/.test(sample) === true || sample.indexOf("{") === -1 || /^(\s*if\s+\()/.test(sample) === true))
      return Script();
    if (sample.indexOf("{") > -1 && (/^(\s*[\u007b\u0024\u002e#@a-z0-9])/i.test(sample) || /^(\s*\/(\*|\/))/.test(sample) || /^(\s*\*\s*\{)/.test(sample)) && /^(\s*if\s*\()/.test(sample) === false && /=\s*(\{|\[|\()/.test(join) === false && (/(\+|-|=|\?)=/.test(join) === false || /\/\/\s*=+/.test(join) || /=+('|")?\)/.test(sample) && /;\s*base64/.test(sample)) && /function(\s+\w+)*\s*\(/.test(join) === false)
      return ScriptOrStyle();
    return sample.indexOf("{%") > -1 ? {
      language: "liquid",
      lexer: "markup"
    } : {
      language: "unknown",
      lexer: "text"
    };
  }
  function Markup() {
    function HTML() {
      return /{%-?\s*(schema|for|if|unless|render|include)/.test(sample) || /{%-?\s*end\w+/.test(sample) || /{{-?\s*content_for/.test(sample) || /{{-?\s*[a-zA-Z0-9_'".[\]]+\s*-?}}/.test(sample) || /{%/.test(sample) && /%}/.test(sample) && /{{/.test(sample) && /}}/.test(sample) ? {
        language: "liquid",
        lexer: "markup"
      } : {
        language: "html",
        lexer: "markup"
      };
    }
    return /^(\s*<!doctype\s+html>)/i.test(sample) || /^(\s*<html)/i.test(sample) || /<form\s/i.test(sample) && /<label\s/i.test(sample) && /<input\s/i.test(sample) || (/<img(\s+\w+=['"]?\S+['"]?)*\s+src\s*=/.test(sample) || /<a(\s+\w+=['"]?\S+['"]?)*\s+href\s*=/.test(sample)) || /<ul\s/i.test(sample) && /<li\s/i.test(sample) && /<\/li>/i.test(sample) && /<\/ul>/i.test(sample) || /<head\s*>/.test(sample) && /<\/head>/.test(sample) || /^(\s*<!DOCTYPE\s+((html)|(HTML))\s+PUBLIC\s+)/.test(sample) && /XHTML\s+1\.1/.test(sample) === false && /XHTML\s+1\.0\s+(S|s)((trict)|(TRICT))/.test(sample) === false ? HTML() : /\s?{[{%]-?/.test(sample) ? {
      language: "liquid",
      lexer: "markup"
    } : {
      language: "xml",
      lexer: "markup"
    };
  }
  if (sample === null || sample.replace(/\s+/g, NIL) === NIL) {
    return {
      language: "unknown",
      lexer: "text"
    };
  }
  if ((/\n\s*#{1,6}\s+/.test(sample) || /\n\s*(?:\*|-|(?:\d+\.))\s/.test(sample)) && (/\[( |x|X)\]/.test(sample) || /\s[*_~]{1,2}\w+[*_~]{1,2}/.test(sample) || /\n\s*```[a-zA-Z]*?\s+/.test(sample) || /-+\|(-+\|)+/.test(sample))) {
    return {
      language: "markdown",
      lexer: "text"
    };
  }
  if (/^(\s*<!DOCTYPE\s+html>)/i.test(sample))
    return Markup();
  if (/^\s*@(?:charset|import|include|keyframes|media|namespace|page)\b/.test(sample))
    return Style();
  if (stest === false && /=(>|=|-|\+|\*)/.test(sample) === false && /^(?:\s*((if)|(for)|(function))\s*\()/.test(sample) === false && /(?:\s|;|\})((if)|(for)|(function\s*\w*))\s*\(/.test(sample) === false && vtest === false && /return\s*\w*\s*(;|\})/.test(sample) === false && (sample === void 0 || /^(?:\s*#(?!(!\/)))/.test(sample) || /\n\s*(\.|@)\w+(\(|(\s*:))/.test(sample) && />\s*<\w/.test(sample) === false || (/^\s*:root\s*\{/.test(sample) || /-{2}\w+\s*\{/.test(sample) || /^\s*(?:body|button|hr|section|h[1-6]|p|strong|\*)\s+\{\s+/.test(sample))))
    return Style();
  b = sample.replace(/\[[a-zA-Z][\w-]*=['"]?[a-zA-Z][\w-]*['"]?\]/g, NIL).split(NIL);
  c = b.length;
  if (/^(\s*({{|{%|<))/.test(sample))
    return Markup();
  if (stest === true || /^(?:[\s\w-]*<)/.test(sample) === false && /(?:>[\s\w-]*)$/.test(sample) === false)
    return NotMarkup();
  return (/^(?:\s*<\?xml)/.test(sample) || /(?:>[\w\s:]*)?<(?:\/|!|#)?[\w\s:\-[]+/.test(sample) || /^\s*</.test(sample) && /<\/\w+(\w|\d)+>\s*$/.test(sample)) && (/^(?:[\s\w]*<)/.test(sample) || /(?:>[\s\w]*)$/.test(sample)) || /^(?:\s*<s((cript)|(tyle)))/i.test(sample) && /(?:<\/s((cript)|(tyle))>\s*)$/i.test(sample) ? /^(?:[\s\w]*<)/.test(sample) === false || /(?:>[\s\w]*)$/.test(sample) === false ? NotMarkup() : Markup() : {
    language: "unknown",
    lexer: "text"
  };
}

// src/esthetic.ts
var _Instance = class {
  get data() {
    return parse.data;
  }
  get grammar() {
    return grammar.extend;
  }
  get definitions() {
    return definitions;
  }
  get detect() {
    return detect2;
  }
  on(name, callback) {
    _Instance.events[name].push(callback);
  }
  hook(name, callback) {
    parse.hooks[name] = [callback];
  }
  format(source, options) {
    parse.source = source;
    if (typeof this.language === "string" && this.language !== parse.language) {
      parse.language = this.language;
      parse.lexer = getLexerName(parse.language);
    } else {
      this.language = options.language;
      this.lexer = getLexerName(options.language);
    }
    if (typeof options === "object")
      this.rules(options);
    const invoke = getLexerType(this.language);
    const action = stats(this.language, this.lexer);
    const output = parse.document(invoke);
    this.stats = action(output.length);
    if (_Instance.events.format.length > 0) {
      for (const cb of _Instance.events.format) {
        if (cb.bind({ parsed: parse.data })(source, parse.rules) === false) {
          return source;
        }
      }
    }
    if (!this.async) {
      if (parse.error.length)
        throw new Error(parse.error);
      return output;
    }
    return new Promise((resolve, reject) => {
      var _a, _b;
      if ((_b = (_a = parse) == null ? void 0 : _a.error) == null ? void 0 : _b.length)
        return reject(parse.error);
      return resolve(output);
    });
  }
  parse(source, options) {
    parse.source = source;
    if (typeof options === "object")
      this.rules(options);
    this.lexer = getLexerName(parse.language);
    const invoke = getLexerType(this.language);
    const action = stats(this.language, this.lexer);
    const parsed = parse.document(invoke, 1 /* Parse */);
    this.stats = action(parse.count);
    if (_Instance.events.parse.length > 0) {
      for (const cb of _Instance.events.parse) {
        if (cb.bind({ parsed: parse.data })(source, parse.rules) === false) {
          return source;
        }
      }
    }
    if (!this.async) {
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
  rules(options) {
    if (typeof options === "undefined")
      return parse.rules;
    let changes;
    if (_Instance.events.rules.length > 0)
      changes = __spreadValues({}, parse.rules);
    for (const rule in options) {
      if (rule in parse.rules) {
        if (typeof parse.rules[rule] === "object") {
          if (parse.rules[rule] !== options[rule]) {
            parse.rules[rule] = __spreadValues(__spreadValues({}, parse.rules[rule]), options[rule]);
          }
        } else {
          if (rule === "crlf") {
            parse.rules[rule] = options[rule];
            parse.crlf = parse.rules[rule] ? CNL : NWL;
          } else if (rule === "language") {
            parse.rules[rule] = options[rule];
            if (parse.language !== parse.rules[rule]) {
              parse.language = options[rule];
              parse.lexer = getLexerName(parse.language);
            }
          } else {
            parse.rules[rule] = options[rule];
          }
        }
      }
      if (changes) {
        const diff = {};
        for (const rule2 in options) {
          if (rule2 !== "liquid" && rule2 !== "markup" && rule2 !== "script" && rule2 !== "style" && rule2 !== "json") {
            if (changes[rule2] !== options[rule2])
              diff[rule2] = { from: changes[rule2], to: options[rule2] };
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
        if (_Instance.events.rules.length > 0) {
          for (const cb of _Instance.events.rules) {
            cb(diff, parse.rules);
          }
        }
      }
    }
    return parse.rules;
  }
};
var Instance = _Instance;
Instance.events = {
  format: [],
  language: [],
  rules: [],
  parse: []
};
var Esthetic = class extends Instance {
  liquid(source, options) {
    return this.format(source, options);
  }
  html(source, options) {
    return this.format(source, options);
  }
  xml(source, options) {
    return this.format(source, options);
  }
  css(source, options) {
    return this.format(source, options);
  }
  json(source, options) {
    return this.format(source, options);
  }
};
var esthetic_default = function(binding) {
  const prettify = new Esthetic();
  for (const language of binding) {
    defineProperties(prettify[language], {
      sync: {
        value(source, options) {
          prettify.async = false;
          prettify.language = language;
          prettify.lexer = getLexerName(language);
          return prettify[language](source, options);
        }
      }
    });
  }
  defineProperties(prettify.format, {
    sync: {
      value(source, options) {
        prettify.async = false;
        return prettify.format(source, options);
      }
    }
  });
  return prettify;
}([
  "liquid",
  "html",
  "xml",
  "json",
  "css"
]);

module.exports = esthetic_default;
