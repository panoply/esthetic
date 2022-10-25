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
