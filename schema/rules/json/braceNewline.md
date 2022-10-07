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
