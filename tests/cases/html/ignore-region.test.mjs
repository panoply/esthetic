import test from 'ava';
import { forSample, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('HTML Ignore Comment Region - Newlines and indentation', async t => {

  await forSample(
    [
      liquid`{% # 1 newline following comment is respected %}

        <div>
        1 NEWLINE FOLLOWING COMMENT
        </div>

        <!-- esthetic-ignore-start -->
        <main>
          <h1></h1>
        </main>
        <!-- esthetic-ignore-end -->

      `,
      liquid`{% # 2 newlines following comment are respected %}

        <div>
        2 NEWLINES FOLLOWING COMMENT
        </div>

        <!-- esthetic-ignore-start -->

        <main>
                 <h1>     ignored       </h1>
        </main>
        <!-- esthetic-ignore-end -->
      `,
      liquid`{% # 3 newlines following comment are respected %}

        <div>
        3 NEWLINES FOLLOWING COMMENT
        </div>

        <!-- esthetic-ignore-start -->


        <main>
                 <h1>     ignored       </h1>
        </main>
        <!-- esthetic-ignore-end -->
      `,
      liquid`{% # Respect Spacing of contained ignore content %}

        <!-- esthetic-ignore-start -->
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
        <!-- esthetic-ignore-end -->

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
                                  <!-- esthetic-ignore-start -->
                                  <div>






                                    THIS WILL BE IGNORED






                                  </div>
                                  <!-- esthetic-ignore-end -->

                                  <main>

                                    FORMAT WILL BE APPLIED HERE

                                            <ul>
                                <li> FORMAT WILL RESPECT </li>
                      <li> FORMAT WILL RESPECT </li>
                                <li> FORMAT WILL RESPECT </li>
                      <li> FORMAT WILL RESPECT </li>
                                            </ul>

                                  <!-- esthetic-ignore-start -->
                                  <div>






                                    THIS WILL BE IGNORED






                                  </div>
                                  <!-- esthetic-ignore-end -->

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

    const input = esthetic.format(source, rules);

    t.snapshot(input, label);

  });

});

test('HTML Ignore Comment Region - Edge cases', async t => {

  await forSample(
    [

      liquid`{% # Extraneous spacing and newlines following the ignore comment %}

        <header>
        <ul>
        <li> CONTENT BEFORE FORMAT </li>
        </ul>
        </header>

        <!-- esthetic-ignore-start -->

        <main
        id  ="xxx" data - = passes
        >

        <h1>  Ignored Content   </h1>   <p id="ignore-attrs"  data - = passes  >

        </p  >

        </main
        >
        <!-- esthetic-ignore-end -->

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

        <!-- esthetic-ignore-start -->

          <main ~~~%#!>

        <#>  Ignored Content  </#>

        <p  >   </ p  >

          </main >
        <!-- esthetic-ignore-end -->

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

    const input = esthetic.format(source, rules);

    t.snapshot(input, label);

  });

});

test('HTML Ignore Comment Region - Followed by markup', async t => {

  await forSample(
    [

      liquid`{% # HTML structure within before and after content %}

        <header>
        <ul>
        <li> CONTENT BEFORE FORMAT </li>
        </ul>
        </header>

        <!-- esthetic-ignore-start -->
        <main    id="xxx"  data - = passes   >

        <h1>  Ignored Content   </h1>

        <p id="ignore-attrs"  data - = passes  >

        All this content contained between the main tags will be ignored

        </p  >

        </main>
        <!-- esthetic-ignore-end -->

        <div>
        <footer>
        <ul>
        <li> CONTENT AFTER WILL FORMAT </li>
        </ul>
        </footer>
        </div>

      `,
      liquid`{% # HTML with nested tags matching first tag name %}

        <!-- esthetic-ignore-start -->
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
        <!-- esthetic-ignore-end -->

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

        <!-- esthetic-ignore-start -->
        <div id="1">
        All tags contained in 1 will be ignored until closing of 1
        <!-- esthetic-ignore-end -->

        </li>
        </ul>
        </div>
        </main>
      `,
      liquid`{% # HTML void tag exclusion %}

        <ul>
        <li> CONTENT BEFORE FORMAT </li>
        </ul>

        <!-- esthetic-ignore-start -->
        <input  type="text" >
        <!-- esthetic-ignore-end -->

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

        <!-- esthetic-ignore-start -->
        <input
                type="text" name = "1"   data-attr="WILL NOT FORMAT"   >
        <!-- esthetic-ignore-end -->

        <input type="text"    name = "2" data-attr="WILL FORMAT"  >

        <label> <small> WILL FORMAT #2 </small>  </label>

        <!-- esthetic-ignore-start -->
        <input
                type="text"   >
        <!-- esthetic-ignore-end -->

        <ul>
          <li> FORMAT </li>
          <li> FORMAT </li>
            <!-- esthetic-ignore-start -->
            <li> DO NOT FORMAT </li>
            <!-- esthetic-ignore-end -->
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

    const input = esthetic.format(source, rules);

    t.snapshot(input, label);

  });

});

test('HTML Ignore Comment Region - Followed by liquid', async t => {

  await forSample(
    [

      liquid`{% # HTML structure within before and after content %}

        <header>
        <ul>
        <li> CONTENT BEFORE FORMAT </li>
        </ul>
        </header>

        <!-- esthetic-ignore-start -->
        {% if xxx %}

        <h1>  Ignored Content   </h1>

        <p id="ignore-attrs"  data - = passes  >

        All this content contained between the if tags will be ignored

        </p  >

        {% endif %}
        <!-- esthetic-ignore-end -->

        <div>
        <footer>
        <ul>
        <li> CONTENT AFTER WILL FORMAT </li>
        </ul>
        </footer>
        </div>

      `,
      liquid`{% # HTML with nested tags matching first tag name %}

        <!-- esthetic-ignore-end -->
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

        <!-- esthetic-ignore-end -->

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

              <!-- esthetic-ignore-start -->

              {% unless condition %}
              {{  this.
                content .
                is .ignored  }}
              {% endunless    %}

              <!-- esthetic-ignore-end -->

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

    const input = esthetic.format(source, rules);

    t.snapshot(input, label);

  });

});
