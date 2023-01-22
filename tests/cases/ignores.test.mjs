import test from 'ava';
import { forSample, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('HTML type comment: esthetic-ignore-next - Newlines and indentation', async t => {

  await forSample(
    [
      liquid`

        {% # Ensuring single newline following comment is respected %}

        <div>
        BELOW NEWLINES EQUAL 1
        </div>

        <!-- esthetic-ignore-next -->
        <main>
          <h1></h1>
        </main>

      `,
      liquid`

        {% # Ensuring 2 newlines following comment are respected  %}

        <div>
        BELOW NEWLINES EQUAL 2
        </div>

        <!-- esthetic-ignore-next -->

        <main>
          <h1></h1>
        </main>

      `,
      liquid`

        {% # Ensuring a newline is forced when ignore next comment is on same line %}

         <div>
          BELOW NEWLINES EQUAL 1
         </div>

         <!-- esthetic-ignore-next --><main>
           <h1></h1>
         </main>

       `,
      liquid`

        {% # Respect Spacing of contained ignore content %}

        <!-- esthetic-ignore-next -->
        <main>

        <h1>

        Span Multiple Lines

        </h1>

                                        <div>
                                          FAR RIGHT INDENTATION
                                        </div>
                  <div>
                    FAR RIGHT INDENTATION
                  </div>

        </main>

        <footer>
        <ul>
        <li> SPACING IS RESPECTED AFTER IGNORE </li>
        </ul>
        </footer>
      `,
      liquid`

        {% # Invalid characters in following start tag %}

        <header>
        <ul>
        <li> CONTENT BEFORE FORMAT </li>
        </ul>
        </header>

        <!-- esthetic-ignore-next -->

          <main ~~~%#!>

        <#>  Ignored Content  </#>

        <p  >   </ p  >

          </main >

        <footer>
        <ul>
        <li> CONTENT AFTER WILL FORMAT </li>
        </ul>
        </footer>
      `
    ]
  )(
    {
      language: 'liquid'
    }
  )(async function (source, rules, label) {

    const input = await esthetic.format(source, rules);

    t.snapshot(input, label);

  });

});

test('HTML type comment: esthetic-ignore-next - edge cases', async t => {

  await forSample(
    [

      liquid`

        {% # Extraneous spacing and newlines following the ignore next comment %}

        <header>
        <ul>
        <li> CONTENT BEFORE FORMAT </li>
        </ul>
        </header>

        <!-- esthetic-ignore-next -->

        <main
        id  ="xxx" data - = passes
        >

        <h1>  Ignored Content   </h1>   <p id="ignore-attrs"  data - = passes  >

        </p  >

        </main
        >

        <footer>
        <ul>
        <li> CONTENT AFTER WILL FORMAT </li>
        </ul>
        </footer>
      `,
      liquid`

        {% # Invalid characters in following start tag %}

        <header>
        <ul>
        <li> CONTENT BEFORE FORMAT </li>
        </ul>
        </header>

        <!-- esthetic-ignore-next -->

          <main ~~~%#!>

        <#>  Ignored Content  </#>

        <p  >   </ p  >

          </main >

        <footer>
        <ul>
        <li> CONTENT AFTER WILL FORMAT </li>
        </ul>
        </footer>
      `
    ]
  )(
    {
      language: 'liquid'
    }
  )(async function (source, rules, label) {

    const input = await esthetic.format(source, rules);

    t.snapshot(input, label);

  });

});

test('HTML type comment: esthetic-ignore-next - followed by markup', async t => {

  await forSample(
    [

      liquid`

        {% # HTML structure within before and after content %}

        <header>
        <ul>
        <li> CONTENT BEFORE FORMAT </li>
        </ul>
        </header>

        <!-- esthetic-ignore-next -->
        <main    id="xxx"  data - = passes   >

        <h1>  Ignored Content   </h1>

        <p id="ignore-attrs"  data - = passes  >

        All this content contained between the main tags will be ignored

        </p  >

        </main>


        <div>
        <footer>
        <ul>
        <li> CONTENT AFTER WILL FORMAT </li>
        </ul>
        </footer>
        </div>

      `,
      liquid`

        {% # HTML with nested tags matching first tag name %}

        <!-- esthetic-ignore-next -->
        <div id="1">
        <div id="2">
        <div id="3">

        All tags contained in 1 will be ignored until closing of 1
        <div>
          <div></div>
        </div>

        </div>
        </div>
        </div>

        <div>
        <footer>
        <ul>
        <li> CONTENT AFTER WILL FORMAT </li>
        </ul>
        </footer>
        </div>
      `,
      liquid`

        {% # HTML sub-nested structures %}

        <main>
        <div>
        <ul>
        <li>

        <!-- esthetic-ignore-next -->
        <div id="1">
        All tags contained in 1 will be ignored until closing of 1
        </div>

        </li>
        </ul>
        </div>
        </main>
      `,
      liquid`

        {% # HTML void tag exclusion %}

        <ul>
        <li> CONTENT BEFORE FORMAT </li>
        </ul>

        <!-- esthetic-ignore-next -->
        <input  type="text" >

        <ul>
        <li> CONTENT AFTER FORMAT </li>
        </ul>
      `,
      liquid`

        {% # HTML void tag exclusion %}

        <ul>
        <li> CONTENT BEFORE FORMAT </li>
        </ul>
        <div>
        <form>

        <label> <small> WILL FORMAT #1 </small>  </label>

        <!-- esthetic-ignore-next -->
        <input
                type="text" name = "1"   data-attr="WILL NOT FORMAT"   >
        <input type="text"    name = "2" data-attr="WILL FORMAT"  >

        <label> <small> WILL FORMAT #2 </small>  </label>

        <!-- esthetic-ignore-next -->
        <input
                type="text"   >

        <ul>
          <li> FORMAT </li>
          <li> FORMAT </li>
            <!-- esthetic-ignore-next -->
            <li> DO NOT FORMAT </li>
          <li> FORMAT </li>
          <li> FORMAT </li>
        </ul>

        </form>

        </div>
        <ul>
        <li> CONTENT AFTER FORMAT </li>
        </ul>

      `

    ]
  )(
    {
      language: 'liquid'
    }
  )(async function (source, rules, label) {

    const input = await esthetic.format(source, rules);

    t.snapshot(input, label);

  });

});

test('HTML type comment: esthetic-ignore-next - followed by liquid', async t => {

  await forSample(
    [

      liquid`

        {% # HTML structure within before and after content %}

        <header>
        <ul>
        <li> CONTENT BEFORE FORMAT </li>
        </ul>
        </header>

        <!-- esthetic-ignore-next -->
        {% if xxx %}

        <h1>  Ignored Content   </h1>

        <p id="ignore-attrs"  data - = passes  >

        All this content contained between the if tags will be ignored

        </p  >

        {% endif %}

        <div>
        <footer>
        <ul>
        <li> CONTENT AFTER WILL FORMAT </li>
        </ul>
        </footer>
        </div>

      `,
      liquid`

        {% # HTML with nested tags matching first tag name %}

        <!-- esthetic-ignore-next -->
        {% for one in array %}
        <div id="xxx">
        {%
          for two in array
        %}

        All this content will be ignored until closing of "for one"

        {%   for    two    in    array %}
          <div></ div>
        {% endfor %}

        {% endfor %}
        </div>
        {% endfor %}

        <div>
        <footer>
        <ul>
        <li> CONTENT AFTER WILL FORMAT </li>
        </ul>
        </footer>
        </div>
      `,
      liquid`

        {% # HTML sub-nested structures with extraneous spacing %}

        <main>
        <div>
        <ul>
        <li>

        <!-- esthetic-ignore-next -->
              {% unless condition %}
              {{  this.
                content .
                is .ignored  }}
              {% endunless    %}

        </li>
        </ul>
        </div>
        </main>
      `
    ]
  )(
    {
      language: 'liquid',
      preserveLine: 3
    }
  )(async function (source, rules, label) {

    const input = await esthetic.format(source, rules);

    // if (this.index === this.size - 1) {
    //   t.log(input);
    // }

    t.snapshot(input, label);

  });

});
