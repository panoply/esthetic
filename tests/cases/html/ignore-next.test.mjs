import test from 'ava';
import { forSample, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('HTML Ignore Comment Next - Newlines and indentation', async t => {

  await forSample(
    [
      liquid`{% # 1 newline following comment is respected %}

        <div>
        1 NEWLINE FOLLOWING COMMENT
        </div>

        <!-- esthetic-ignore-next -->
        <main>
                    <h1>                   </h1>
        </main>


      `,
      liquid`{% # 2 newlines following comment are respected %}

        <div>
        2 NEWLINES FOLLOWING COMMENT
        </div>

        <!-- esthetic-ignore-next -->

        <main>
                 <h1>     ignored       </h1>
        </main>

      `,
      liquid`{% # 3 newlines following comment are respected %}

        <div>
        3 NEWLINES FOLLOWING COMMENT
        </div>

        <!-- esthetic-ignore-next -->


        <main>
                 <h1>     ignored       </h1>
        </main>

      `,
      liquid`{% # Apply newline forced when comment on same line %}

        <div>
         1 NEWLINE IS FORCED FOLLOW COMMENT
        </div>

        <aside>
        <!-- esthetic-ignore-next --><main>

                 <h1>     ignored       </h1>
        </main>


        <nav>
            <h1> NEWLINE WILL BE APPLIED </h1><!-- esthetic-ignore-next --><div>THIS WILL BE IGNORED</div>
        </nav>

                   <!-- esthetic-ignore-next --> <div>   THIS WILL BE IGNORED   </div>
        </aside>

       `,
      liquid`{% # Respect Spacing of contained ignore content %}

        <!-- esthetic-ignore-next -->
        <main>

        <h1>

        EXTRANEOUS INDENTATION

        </h1>

          <div>
            LEFT SIDE SINGLE INDENTATION
          </div>
                                        <div>
                                          FAR RIGHT INDENTATION

                    CENTER INDENTATION

                                        </div>
                  <div>
                    FAR RIGHT INDENTATION
                  </div>

        <div>
          LEFT SIDE NO INDENTATION
        </div>

        </main>


        <footer>
        <ul>
        <li> SPACING IS RESPECTED AFTER IGNORE </li>
        </ul>
        </footer>
      `,
      liquid`{% # Respecting ignored indentation and newlines %}

        <header>
        <ul>
        <li> CONTENT BEFORE WILL FORMAT </li>
        </ul>
        </header>
                                  <!-- esthetic-ignore-next -->
                                  <div>






                                    THIS WILL BE IGNORED






                                  </div>


                                  <main>

                                    FORMAT WILL BE APPLIED HERE

                                            <ul>
                                <li> FORMAT WILL RESPECT </li>
                      <li> FORMAT WILL RESPECT </li>
                                <li> FORMAT WILL RESPECT </li>
                      <li> FORMAT WILL RESPECT </li>
                                            </ul>

                                  <!-- esthetic-ignore-next -->
                                  <div>






                                    THIS WILL BE IGNORED






                                  </div>


                                  </main>

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

test('HTML Ignore Comment Next - Edge cases', async t => {

  await forSample(
    [

      liquid`{% # Extraneous spacing and newlines following the ignore comment %}

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
      liquid`{% # Invalid characters in following start tag %}

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

test('HTML Ignore Comment Next - Followed by Markup', async t => {

  await forSample(
    [

      liquid`{% # HTML structure within before and after content %}

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
      liquid`{% # HTML with nested tags matching first tag name %}

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
      liquid`{% # HTML sub-nested structures %}

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
      liquid`{% # HTML void tag exclusion %}

        <ul>
        <li> CONTENT BEFORE FORMAT </li>
        </ul>

        <!-- esthetic-ignore-next -->
        <input  type="text" >

        <ul>
        <li> CONTENT AFTER FORMAT </li>
        </ul>
      `,
      liquid`{% # HTML void tag exclusion %}

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

test('HTML Ignore Comment Next - Followed by Liquid', async t => {

  await forSample(
    [

      liquid`{% # HTML structure within before and after content %}

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
      liquid`{% # HTML with nested tags matching first tag name %}

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
      liquid`{% # HTML sub-nested structures with extraneous spacing %}

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

    t.snapshot(input, label);

  });

});
