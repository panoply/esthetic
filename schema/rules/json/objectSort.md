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
