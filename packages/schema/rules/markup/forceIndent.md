**Default** `false`

💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `true`

Will force indentation upon all content and tags without regard for the text nodes. To some degree this rule emulates a result similar to that you'd expect in the Prettier uniform.

**Note**

Inline preservation is respected in cases where a Liquid output object token is encapsulated between text nodes. In such scenarios the text content will only force indent the start and end portions.

---

#### Example

_Below is an example of how this rule works if it's enabled, ie: `true`. Notice how text type node are indented onto newlines, which is typically going to result in better readability overall._

```html

<!-- Before Formatting -->
<ul>
 <li>Hello</li>
 <li>World</li>
</ul>

<!-- After Formatting -->
<ul>
  <li>
    Hello
  </li>
  <li>
    World
  </li>
</ul>

```
