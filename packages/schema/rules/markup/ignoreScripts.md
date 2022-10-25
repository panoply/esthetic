**Default** `true`

💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `false`

Whether or not to format regions of code that are identified to be JavaScript. Tags such as `<script>` and `{% javascript %}` can contain JavaScript and by default beautification is applied using the `script` rules. When ignored (ie: `true`) Prettify will not apply formatting to these regions.

**Note**

Currently scripts are ignored from formatting by default. This is because language support of JavaScript is not yet production ready. Use with caution and be aware of defects.
