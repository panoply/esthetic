# JSON

Prettify supports beautification of JSON structures. The exposed rules are forwarded to the `script` lexer for handling. Below is the different styles that can be produced with the available formatting options.

### Rule Configuration

```js
{
  json: {
    arrayFormat: 'default',
    braceAllman: false,
    bracePadding: false,
    braceNewline: false,
    objectIndent: false,
    objectSort: false
  }
}
```

### Beautification Options

- [Array Format](#array-format)
- [Brace Allman](#brace-allman)
- [Brace Padding](#brace-padding)
- [Brace Newline](#brace-newline)
- [Object Indent](#object-sort)
- [Object Sort](#object-sort)

# Array Format

The `arrayFormat` rule controls how arrays on objects are formatted. This rules will determines if all array indexes should be indented, never indented, or left to the default.

### Rule

This defaults to `default`, ie: left intact and format according to the input style.

```typescript
{
  json: {
    arrayFormat?: 'default' | 'indent' | 'inline';
  }
}
```

## Default

<!--prettier-ignore-->
```json
{
  "array": [ 1, 2,
    3,
    4,
    5 ]
}
```

## Indent

<!--prettier-ignore-->
```json
{
  "array": [
    1,
    2,
    3,
    4,
    5
  ]
}
```

## Inline

<!--prettier-ignore-->
```json
{
  "array": [ 1, 2, 3, 4, 5 ]
}
```

# Brace Allman

The `braceAllman` rule puts JSON braces onto new lines, producing an [Allman Style](https://en.wikipedia.org/wiki/Indentation_style#Allman_style) output.

### Rule

This defaults to `false`, ie: disabled.

```typescript
{
  json: {
    braceAllman?: boolean;
  }
}
```

## Disabled

<!--prettier-ignore-->
```json
[
  { "prop": "value" },
  { "prop": "value" },
  { "prop": "value" }
]
```

## Enabled

<!--prettier-ignore-->
```json
[
  {
    "prop": "value"
  },
  {
    "prop": "value"
  },
  {
    "prop": "value"
  }
]
```

# Brace Padding

The `bracePadding` rule applies additional spacing to structures.

### Rule

This defaults to `false`, ie: disabled.

```typescript
{
  json: {
    bracePadding?:: boolean;
  }
}
```

## Disabled

<!--prettier-ignore-->
```json
[
  {"prop": "value"},
  {"prop": "value"},
  {"prop": "value"}
]
```

## Enabled

<!--prettier-ignore-->
```json
[
  { "prop": "value" },
  { "prop": "value" },
  { "prop": "value" }
]
```

# Brace Newline

The `braceNewline` rule will insert newlines at the top and bottom of nested properties.

### Rule

This defaults to `false`, ie: disabled.

```typescript
{
  json: {
    braceNewline?: boolean;
  }
}
```

## Disabled

<!--prettier-ignore-->
```json
{
 "one": {
    "xx": {
      "xx": false
    }
  },
  "two": {
    "xx": {
      "xx": false
    }
  }
}
```

## Enabled

<!--prettier-ignore-->
```json
{
 "one": {

    "xx": {

      "xx": false

    }

  },
  "two": {

    "xx": {

      "xx": false

    }

  }
}
```

# Object Indent

The `objectSort` rule will control how object keys should be handled. You can apply indented, never indented, or left to the default. Typically, you will want to leave this option to the default to prevent unreadable objects.

### Rule

This defaults to `false`, ie: disabled.

```typescript
{
  json: {
    objectSort?:: 'default' | 'indent' | 'inline'
  }
}
```

## Default

```json
{
  "foo": {
    "bar": { "bax": true }
  }
}
```

## Indent

```json
{
  "foo": {
    "bar": {
      "bax": true
    }
  }
}
```

## Inline

```json
{
  "foo": { "bar": { "bax": true } }
}
```

# Object Sort

The `objectSort` rules will alphanumerically sort object properties.

### Rule

This defaults to `false`, ie: disabled.

```typescript
{
  json: {
    objectSort?:: boolean;
  }
}
```

## Input

```json
{
  "e": "5",
  "b": "2",
  "d": "4",
  "a": "1",
  "f": "6",
  "c": "3"
}
```

## Output

```json
{
  "a": "1",
  "b": "2",
  "c": "3",
  "d": "4",
  "e": "5",
  "f": "6"
}
```
