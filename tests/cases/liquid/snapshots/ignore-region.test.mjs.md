# Snapshot report for `tests/cases/liquid/ignore-region.test.mjs`

The actual snapshot is saved in `ignore-region.test.mjs.snap`.

Generated by [AVA](https://avajs.dev).

## Ignore Region (Block Comment) - Newlines and indentation

> <h3>Rules</h3>
> 
> ```js
> {
>   "language": "liquid"
> }
> ```

    `{% # 1 newline following comment is respected %}␊
    ␊
    <div>␊
      1 NEWLINE FOLLOWING COMMENT␊
    </div>␊
    ␊
    {% comment %} esthetic-ignore-start {% endcomment %}␊
    <main>␊
                                   <h1>            </h1>␊
    </main>␊
    {% comment %} esthetic-ignore-end {% endcomment %}`

> <h3>Rules</h3>
> 
> ```js
> {
>   "language": "liquid"
> }
> ```

    `{% # 2 newlines following comment are respected %}␊
    ␊
    <div>␊
      2 NEWLINES FOLLOWING COMMENT␊
    </div>␊
    ␊
    {% comment %} esthetic-ignore-start {% endcomment %}␊
    ␊
                      <main>␊
             <h1>     ignored       </h1>␊
                      </main>␊
    {% comment %} esthetic-ignore-end {% endcomment %}`

> <h3>Rules</h3>
> 
> ```js
> {
>   "language": "liquid"
> }
> ```

    `{% # 3 newlines following comment are respected %}␊
    ␊
    <div>␊
      3 NEWLINES FOLLOWING COMMENT␊
    </div>␊
    ␊
    {% comment %} esthetic-ignore-start {% endcomment %}␊
    ␊
    ␊
    <main>␊
             <h1>     ignored       </h1>␊
    </main>␊
    {% comment %} esthetic-ignore-end {% endcomment %}`

> <h3>Rules</h3>
> 
> ```js
> {
>   "language": "liquid"
> }
> ```

    `{% # Respect Spacing of contained ignore content %}␊
    ␊
    {% comment %} esthetic-ignore-start {% endcomment %}␊
    <main>␊
    ␊
    <h1>␊
    ␊
    EXTRANEOUS INDENTATION␊
    ␊
    </h1>␊
    ␊
      <div>␊
        LEFT SIDE SINGLE INDENTATION␊
      </div>␊
                                    <div>␊
                                      FAR RIGHT INDENTATION␊
    ␊
                CENTER INDENTATION␊
    ␊
                                    </div>␊
              <div>␊
                FAR RIGHT INDENTATION␊
              </div>␊
    ␊
    <div>␊
      LEFT SIDE NO INDENTATION␊
    </div>␊
    ␊
    </main>␊
    {% comment %} esthetic-ignore-end {% endcomment %}␊
    ␊
    <footer>␊
      <ul>␊
        <li>␊
          SPACING IS RESPECTED AFTER IGNORE␊
        </li>␊
      </ul>␊
    </footer>`

> <h3>Rules</h3>
> 
> ```js
> {
>   "language": "liquid"
> }
> ```

    `{% # Respecting ignored indentation and newlines %}␊
    ␊
    <header>␊
      <ul>␊
        <li>␊
          CONTENT BEFORE WILL FORMAT␊
        </li>␊
      </ul>␊
    </header>␊
                              {% comment %} esthetic-ignore-start {% endcomment %}␊
                              <div>␊
    ␊
    ␊
    ␊
    ␊
    ␊
    ␊
                                THIS WILL BE IGNORED␊
    ␊
    ␊
    ␊
    ␊
    ␊
    ␊
                              </div>␊
                              {% comment %} esthetic-ignore-end {% endcomment %}␊
    ␊
    <main>␊
    ␊
      FORMAT WILL BE APPLIED HERE␊
    ␊
      <ul>␊
        <li>␊
          FORMAT WILL RESPECT␊
        </li>␊
        <li>␊
          FORMAT WILL RESPECT␊
        </li>␊
        <li>␊
          FORMAT WILL RESPECT␊
        </li>␊
        <li>␊
          FORMAT WILL RESPECT␊
        </li>␊
      </ul>␊
    ␊
                              {%- comment -%}␊
                              esthetic-ignore-start␊
                              {%- endcomment -%}␊
                              <div>␊
    ␊
    ␊
    ␊
    ␊
    ␊
    ␊
                                THIS WILL BE IGNORED␊
    ␊
    ␊
    ␊
    ␊
    ␊
    ␊
                              </div>␊
                              {%- comment -%}␊
                               esthetic-ignore-end␊
                              {%- endcomment -%}␊
    ␊
    </main>␊
    ␊
    <footer>␊
      <ul>␊
        <li>␊
          CONTENT AFTER WILL FORMAT␊
        </li>␊
      </ul>␊
    </footer>`

## Ignore Region (Block Comment) - Edge cases

> <h3>Rules</h3>
> 
> ```js
> {
>   "language": "liquid"
> }
> ```

    `{% # Extraneous spacing and newlines following the ignore comment %}␊
    ␊
    <header>␊
      <ul>␊
        <li>␊
          CONTENT BEFORE FORMAT␊
        </li>␊
      </ul>␊
    </header>␊
    ␊
    {% comment %} esthetic-ignore-start {% endcomment %}␊
    ␊
    <main␊
    id  ="xxx" data - = passes␊
    >␊
    ␊
    <h1>  Ignored Content   </h1>   <p id="ignore-attrs"  data - = passes  >␊
    ␊
    </p  >␊
    ␊
    </main␊
    >␊
    {% comment %} esthetic-ignore-end {% endcomment %}␊
    ␊
    <footer>␊
      <ul>␊
        <li>␊
          CONTENT AFTER WILL FORMAT␊
        </li>␊
      </ul>␊
    </footer>`

> <h3>Rules</h3>
> 
> ```js
> {
>   "language": "liquid"
> }
> ```

    `{% # Invalid characters in following start tag %}␊
    ␊
    <header>␊
      <ul>␊
        <li>␊
          CONTENT BEFORE FORMAT␊
        </li>␊
      </ul>␊
    </header>␊
    ␊
    {% comment %} esthetic-ignore-start {% endcomment %}␊
    ␊
      <main ~~~%#!>␊
    ␊
    <#>  Ignored Content  </#>␊
    ␊
    <p  >   </ p  >␊
    ␊
      </main >␊
    {% comment %} esthetic-ignore-end {% endcomment %}␊
    ␊
    <footer>␊
      <ul>␊
        <li>␊
          CONTENT AFTER WILL FORMAT␊
        </li>␊
      </ul>␊
    </footer>`

## Ignore Region (Block Comment) - Followed by markup

> <h3>Rules</h3>
> 
> ```js
> {
>   "language": "liquid"
> }
> ```

    `{% # HTML structure within before and after content %}␊
    ␊
    <header>␊
      <ul>␊
        <li>␊
          CONTENT BEFORE FORMAT␊
        </li>␊
      </ul>␊
    </header>␊
    ␊
    {% comment %} esthetic-ignore-start {% endcomment %}␊
    <main    id="xxx"  data - = passes   >␊
    ␊
    <h1>  Ignored Content   </h1>␊
    ␊
    <p id="ignore-attrs"  data - = passes  >␊
    ␊
    All this content contained between the main tags will be ignored␊
    ␊
    </p  >␊
    ␊
    </main>␊
    {% comment %} esthetic-ignore-end {% endcomment %}␊
    ␊
    <div>␊
      <footer>␊
        <ul>␊
          <li>␊
            CONTENT AFTER WILL FORMAT␊
          </li>␊
        </ul>␊
      </footer>␊
    </div>`

> <h3>Rules</h3>
> 
> ```js
> {
>   "language": "liquid"
> }
> ```

    `{% # HTML with nested tags matching first tag name %}␊
    ␊
    {% comment %} esthetic-ignore-start {% endcomment %}␊
    <div id="1">␊
    <div id="2">␊
    <div id="3">␊
    ␊
    All tags contained in 1 will be ignored until closing of 1␊
    <div>␊
      <div></div>␊
    </div>␊
    ␊
    </div>␊
    </div>␊
    </div>␊
    <div>␊
    {% comment %} esthetic-ignore-end {% endcomment %}␊
    ␊
    <footer>␊
      <ul>␊
        <li>␊
          CONTENT AFTER WILL FORMAT␊
        </li>␊
      </ul>␊
    </footer></div>`

> <h3>Rules</h3>
> 
> ```js
> {
>   "language": "liquid"
> }
> ```

    `{% # HTML sub-nested structures %}␊
    ␊
    <main>␊
      <div>␊
        <ul>␊
          <li>␊
    ␊
    {% comment %}␊
    esthetic-ignore-start␊
    {% endcomment %}␊
    <div id="1">␊
    All tags contained in 1 will be ignored until closing of 1␊
    </div>␊
    {% comment %}␊
      esthetic-ignore-end␊
    {% endcomment %}␊
    ␊
          </li>␊
        </ul>␊
      </div>␊
    </main>`

> <h3>Rules</h3>
> 
> ```js
> {
>   "language": "liquid"
> }
> ```

    `{% # HTML void tag exclusion %}␊
    ␊
    <ul>␊
      <li>␊
        CONTENT BEFORE FORMAT␊
      </li>␊
    </ul>␊
    ␊
    {% comment %}␊
    esthetic-ignore-start␊
    {% endcomment %}␊
    ␊
    <input  type="text" >␊
    ␊
    {% comment %}␊
      esthetic-ignore-end␊
    {% endcomment %}␊
    ␊
    <ul>␊
      <li>␊
        CONTENT AFTER FORMAT␊
      </li>␊
    </ul>`

> <h3>Rules</h3>
> 
> ```js
> {
>   "language": "liquid"
> }
> ```

    `{% # HTML void tag exclusion %}␊
    ␊
    <ul>␊
      <li>␊
        CONTENT BEFORE FORMAT␊
      </li>␊
    </ul>␊
    <div>␊
      <form>␊
    ␊
        <label>␊
          <small>␊
            WILL FORMAT #1␊
          </small>␊
        </label>␊
    ␊
    {%- comment -%} esthetic-ignore-start {%- endcomment -%}␊
    ␊
    <input␊
            type="text" name = "1"   data-attr="WILL NOT FORMAT"   >␊
    ␊
    {%- comment -%} esthetic-ignore-end {%- endcomment -%}␊
    ␊
        <input␊
          type="text"␊
          name="2"␊
          data-attr="WILL FORMAT">␊
    ␊
        <label>␊
          <small>␊
            WILL FORMAT #2␊
          </small>␊
        </label>␊
    ␊
    {% comment %} esthetic-ignore-start {% endcomment %}␊
    <input␊
            type="text"   >␊
    {% comment %} esthetic-ignore-end {% endcomment %}␊
    ␊
        <ul>␊
          <li>␊
            FORMAT␊
          </li>␊
          <li>␊
            FORMAT␊
          </li>␊
        {% comment %} esthetic-ignore-start {% endcomment %}␊
        <li> DO NOT FORMAT </li>␊
        {% comment %} esthetic-ignore-end {% endcomment %}␊
          <li>␊
            FORMAT␊
          </li>␊
          <li>␊
            FORMAT␊
          </li>␊
        </ul>␊
    ␊
      </form>␊
    ␊
    </div>␊
    <ul>␊
      <li>␊
        CONTENT AFTER FORMAT␊
      </li>␊
    </ul>`

## Ignore Region (Block Comment) - Followed by liquid

> <h3>Rules</h3>
> 
> ```js
> {
>   "language": "liquid",
>   "preserveLine": 3
> }
> ```

    `{% # HTML structure within before and after content %}␊
    ␊
    <header>␊
      <ul>␊
        <li>␊
          CONTENT BEFORE FORMAT␊
        </li>␊
      </ul>␊
    </header>␊
    ␊
    {% comment %}␊
    esthetic-ignore-start␊
    {% endcomment %}␊
    {% if xxx %}␊
    ␊
    <h1>  Ignored Content   </h1>␊
    ␊
    <p id="ignore-attrs"  data - = passes  >␊
    ␊
    All this content contained between the if tags will be ignored␊
    ␊
    </p  >␊
    ␊
    {% endif %}␊
    {% comment %}␊
      esthetic-ignore-end␊
    {% endcomment %}␊
    ␊
    <div>␊
      <footer>␊
        <ul>␊
          <li>␊
            CONTENT AFTER WILL FORMAT␊
          </li>␊
        </ul>␊
      </footer>␊
    </div>`

> <h3>Rules</h3>
> 
> ```js
> {
>   "language": "liquid",
>   "preserveLine": 3
> }
> ```

    `{% # HTML with nested tags matching first tag name %}␊
    ␊
    {% comment %} esthetic-ignore-start {% endcomment %}␊
    {% for one in array %}␊
    <div id="xxx">␊
    {%␊
      for two in array␊
    %}␊
    ␊
    All this content will be ignored until closing of "for one"␊
    ␊
    {%   for    two    in    array %}␊
      <div></ div>␊
    {% endfor %}␊
    ␊
    {% endfor %}␊
    </div>␊
    {% endfor %}␊
    ␊
    {% comment %} esthetic-ignore-end {% endcomment %}␊
    ␊
    <div>␊
      <footer>␊
        <ul>␊
          <li>␊
            CONTENT AFTER WILL FORMAT␊
          </li>␊
        </ul>␊
      </footer>␊
    </div>`

> <h3>Rules</h3>
> 
> ```js
> {
>   "language": "liquid",
>   "preserveLine": 3
> }
> ```

    `{% # HTML sub-nested structures with extraneous spacing %}␊
    ␊
    <main>␊
      <div>␊
        <ul>␊
          <li>␊
    ␊
          {% comment %}␊
          esthetic-ignore-start␊
          {% endcomment %}␊
    ␊
          {% unless condition %}␊
          {{  this.␊
            content .␊
            is .ignored  }}␊
          {% endunless    %}␊
    ␊
          {% comment %}␊
            esthetic-ignore-end␊
          {% endcomment %}␊
    ␊
          </li>␊
        </ul>␊
      </div>␊
    </main>`
