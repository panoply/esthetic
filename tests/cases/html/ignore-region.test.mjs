import test from 'ava';
import { forSample, forAssert, html } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('HTML Ignore Comment Region - Various structure tests', t => {

  forAssert(
    [
      [
        html`
        <div>
        IGNORE START WILL FORCE
        </div><section><!-- esthetic-ignore-start --><main>
                    <h1>                   </h1>
        </main><!-- esthetic-ignore-end --></section>
        `
        ,
        html`
        <div>
          IGNORE START WILL FORCE
        </div>
        <section>
        <!-- esthetic-ignore-start --><main>
                    <h1>                   </h1>
        </main><!-- esthetic-ignore-end -->
        </section>
        `
      ],
      [
        html`
        <div>
        IGNORE START WILL FORCE
        </div>

        <aside><!-- esthetic-ignore-start -->
        <main>
                    <h1>                   </h1>
        </main><!-- esthetic-ignore-end -->
        </aside>
        `
        ,
        html`
        <div>
          IGNORE START WILL FORCE
        </div>

        <aside>
        <!-- esthetic-ignore-start -->
        <main>
                    <h1>                   </h1>
        </main><!-- esthetic-ignore-end -->
        </aside>
        `
      ],
      [
        html`
        <div>
        FORCING INLINE IGNORE WITH SIBLINGS
        </div>

        <!-- esthetic-ignore-start --><main>
                    <h1>                   </h1>
        </main>
        <!-- esthetic-ignore-end -->
        <section>
              <ul>
                  <li>TEST INDENTATION</li>
              </ul>
        </section>
        `
        ,
        html`
        <div>
          FORCING INLINE IGNORE WITH SIBLINGS
        </div>

        <!-- esthetic-ignore-start --><main>
                    <h1>                   </h1>
        </main>
        <!-- esthetic-ignore-end -->
        <section>
          <ul>
            <li>TEST INDENTATION</li>
          </ul>
        </section>
        `
      ],
      [
        html`
        <div>
        1 NEWLINE FOLLOWING COMMENT
        </div>

        <!-- esthetic-ignore-start -->
        <main>
                    <h1>                   </h1>
        </main>
        <!-- esthetic-ignore-end -->
        `
        ,
        html`
        <div>
          1 NEWLINE FOLLOWING COMMENT
        </div>

        <!-- esthetic-ignore-start -->
        <main>
                    <h1>                   </h1>
        </main>
        <!-- esthetic-ignore-end -->
        `
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      markup: {
        commentNewline: false
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('HTML Ignore Comment Region - Newlines and indentation', t => {

  forSample(
    [
      html`<!-- 1 newline following comment is respected -->

      <div>
      1 NEWLINE FOLLOWING COMMENT
      </div>

      <!-- esthetic-ignore-start -->
      <main>
        <h1>                   </h1>
      </main>
      <!-- esthetic-ignore-end -->

      `,
      html`<!-- 1 newline following comment is respected -->

        <div>
          1 NEWLINE FOLLOWING COMMENT
        </div>

        <!-- esthetic-ignore-start -->
        <main>
          <h1>                   </h1>
        </main>
        <!-- esthetic-ignore-end -->

      `,
      html`<!-- 2 newlines following comment are respected -->

        <div>
          2 NEWLINES FOLLOWING COMMENT
        </div>

        <!-- esthetic-ignore-start -->

        <main>
                 <h1>     ignored       </h1>
        </main>
        <!-- esthetic-ignore-end -->
      `,
      html`<!-- 3 newlines following comment are respected -->

        <div>
          3 NEWLINES FOLLOWING COMMENT
        </div>

        <!-- esthetic-ignore-start -->


        <main>
                 <h1>     ignored       </h1>
        </main>
        <!-- esthetic-ignore-end -->
      `,
      html`<!-- Respect Spacing of contained ignore content -->

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
            <li>
              SPACING IS RESPECTED AFTER IGNORE
            </li>
          </ul>
        </footer>
      `,
      html`<!-- Respecting ignored indentation and newlines -->

        <header>
          <ul>
        <li>
              CONTENT BEFORE WILL FORMAT
            </li>
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
          <li>
          FORMAT WILL RESPECT
          </li>
          <li>      FORMAT WILL RESPECT
          </li>
          <li>                   FORMAT WILL RESPECT
          </li>
                      <li>
            FORMAT WILL RESPECT          </li>
          </ul>
                                  <!-- esthetic-ignore-start -->
                                  <div>






                                    THIS WILL BE IGNORED






                                  </div>
                                  <!-- esthetic-ignore-end -->

        </main>

        <footer>
        <ul>
        <li>
        CONTENT AFTER WILL FORMAT
        </li>
        </ul>
        </footer>
      `
    ]
  )(
    {
      language: 'html'
    }
  )(function (source, rules, label) {

    const input = esthetic.format(source, rules);

    t.snapshot(input, label);

  });

});

test('HTML Ignore Comment Region - Edge cases', t => {

  forSample(
    [

      html`<!-- Extraneous spacing and newlines following the ignore comment -->

        <header>
          <ul>
            <li>
          CONTENT BEFORE FORMAT
            </li>
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
                          <li>
        CONTENT AFTER WILL FORMAT
            </li>
                                            </ul>
        </footer>
      `,
      html`<!-- Invalid characters in following start tag -->

        <header>
          <ul>
                              <li>
          CONTENT BEFORE FORMAT
            </li>
          </ul>
        </header>

        <!-- esthetic-ignore-start -->

          <main ~~~%#!>

        <#>  Ignored Content  </#>

        <p  >   </ p  >

          </main >
        <!-- esthetic-ignore-end -->

        <footer>         <ul>
            <li>            CONTENT AFTER WILL FORMAT
            </li>
                          </ul>
                                   </footer>
      `
    ]
  )(
    {
      language: 'html'
    }
  )(function (source, rules, label) {

    const input = esthetic.format(source, rules);

    t.snapshot(input, label);

  });

});

test('HTML Ignore Comment Region - Followed by markup', t => {

  forSample(
    [

      html`<!-- HTML structure within before and after content -->

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
      html`<!-- HTML with nested tags matching first tag name -->

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
      html`<!-- HTML sub-nested structures -->

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
      html`<!-- HTML void tag exclusion -->

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
      html`<!-- HTML void tag exclusion -->

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
      language: 'html'
    }
  )(function (source, rules, label) {

    const input = esthetic.format(source, rules);

    t.snapshot(input, label);

  });

});
