import { forAssert, forRule, liquid } from '@liquify/ava/esthetic';
import test from 'ava';
import esthetic from 'esthetic';

test.skip('Liquid inline line Comments - commentIndent: true', t => {

  forAssert(
    [
      [
        liquid`
        {% # inline comment %}
        `,
        liquid`
        {% # inline comment %}
        `
      ],
      [
        liquid`
        {% # inline comment as start delimiter is not forced
        %}
        `,
        liquid`
        {% # inline comment as start delimiter is not forced %}
        `
      ],
      [
        html`
        {%
          # forced comment %}
        `,
        liquid`
        {%
          # forced comment
        %}
        `
      ],
      [
        liquid`
        {%#spacing%}
        `,
        liquid`
        {% # spacing %}
        `
      ],
      [
        liquid`
        {%-#spacing trims%}
        {%#spacing trims-%}
        `,
        liquid`
        {%- # spacing trims %}
        {% # spacing trims -%}
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      crlf: false,
      indentSize: 2,
      commentIndent: true,
      commentPreserve: false,
      markup: {

      }
    });

    t.deepEqual(actual, expect);

  });

});

test.skip('Liquid Multiline Line Comments - commentIndent: true', t => {

  forAssert(
    [
      [
        html`
        {%
          # inline comment %}
        `,
        liquid`
        {%
          # inline comment
        %}
        `
      ],
      [
        liquid`
        {% # inline comment as start delimiter is not forced
        %}
        `,
        liquid`
        {% # inline comment as start delimiter is not forced %}
        `
      ],
      [
        liquid`
        {%
          # inline delimiters on multiline comments without trims
          # inline delimiters on multiline comments without trims
          # inline delimiters on multiline comments without trims
        %}
        `,
        liquid`
        {%
          # inline delimiters on multiline comments without trims
          # inline delimiters on multiline comments without trims
          # inline delimiters on multiline comments without trims
        %}
        `
      ],
      [
        html`
        {%- #
          # inline delimiters on multiline comments using trims
          # inline delimiters on multiline comments using trims
          # inline delimiters on multiline comments using trims
        %}

        {%-
          # inline delimiters on multiline comments using trims
          # inline delimiters on multiline comments using trims
          # inline delimiters on multiline comments using trims -%}
        `,
        liquid`
        {%-
          # inline delimiters on multiline comments using trims
          # inline delimiters on multiline comments using trims
          # inline delimiters on multiline comments using trims
        %}

        {%-
          # inline delimiters on multiline comments using trims
          # inline delimiters on multiline comments using trims
          # inline delimiters on multiline comments using trims
        -%}
        `
      ],
      [
        liquid`
        {%- #
          #
          # inline delimiters on multiline comments using trims

          # foo
          # inline delimiters on multiline comments using trims
          # inline delimiters on multiline comments using trims
        %}
        `,
        liquid`
         {%-
          # inline delimiters on multiline comments using trims

          # foo
          # inline delimiters on multiline comments using trims
          # inline delimiters on multiline comments using trims
        %}
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      crlf: false,
      indentSize: 2,
      liquid: {
        commentIndent: true,
        commentNewline: false,
        commentPreserve: false,
        delimiterPlacement: 'preserve'
      },
      markup: {

      }
    });

    t.deepEqual(actual, expect);

  });

});

test.skip('Liquid Multiline Line Comments - commentIndent: false', t => {

  forAssert(
    [
      [
        html`
        {%
          # inline comment %}
        `,
        html`
        {%
         # inline comment
        %}
        `
      ],
      [
        liquid`
        {% # inline comment as start delimiter is not forced
        %}
        `,
        liquid`
        {% # inline comment as start delimiter is not forced %}
        `
      ],
      [
        liquid`
        {%
        # 100 inline delimiters on multiline comments without trims
        # 200 inline delimiters on multiline comments without trims
        # 300 inline delimiters on multiline comments without trims
        %}
        `,
        liquid`
        {%
         # 100 inline delimiters on multiline comments without trims
         # 200 inline delimiters on multiline comments without trims
         # 300 inline delimiters on multiline comments without trims
        %}
        `
      ],
      [
        liquid`
        {%- #
             # 1 inline delimiters on multiline comments using trims
          # 2 inline delimiters on multiline comments using trims
              # 3 inline delimiters on multiline comments using trims
        %}

        {%-# 4 inline delimiters on multiline comments using trims
          # 5 inline delimiters on multiline comments using trims
              # 6 inline delimiters on multiline comments using trims -%}
        `,
        liquid`
        {%-
         # 1 inline delimiters on multiline comments using trims
         # 2 inline delimiters on multiline comments using trims
         # 3 inline delimiters on multiline comments using trims
        %}

        {%-
         # 4 inline delimiters on multiline comments using trims
         # 5 inline delimiters on multiline comments using trims
         # 6 inline delimiters on multiline comments using trims
        -%}
        `
      ],
      [
        liquid`
        {%- #
          #
          # inline delimiters on multiline comments using trims

          # foo
          # inline delimiters on multiline comments using trims
          # inline delimiters on multiline comments using trims
           #
         # xxxx
         #
         #
        %}
        `,
        liquid`
        {%-
         # inline delimiters on multiline comments using trims

         # foo
         # inline delimiters on multiline comments using trims
         # inline delimiters on multiline comments using trims
         #
         # xxxx
        %}
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      indentSize: 2,
      commentIndent: false,
      commentPreserve: false,
      delimiterPlacement: 'preserve'
    });

    t.deepEqual(actual, expect);

  });

});

test.skip('Liquid Multiline Line Comments - Wrap newlines and hash prefix', t => {

  forRule(
    [
      html`
      {%
        # Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et leo duis ut diam quam nulla porttitor massa id. Nullam eget felis eget nunc lobortis mattis aliquam faucibus purus. In est ante in nibh. Dolor sed viverra ipsum nunc. A lacus vestibulum sed arcu non. Vitae semper quis lectus nulla at volutpat. Lorem mollis aliquam ut porttitor leo a. Enim ut sem viverra aliquet eget sit amet. Congue eu consequat ac felis donec et odio pellentesque.

        Quisque egestas diam in arcu. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Egestas sed sed risus pretium quam vulputate. Faucibus vitae aliquet nec ullamcorper sit amet risus. Gravida arcu ac tortor dignissim convallis aenean et tortor. Dui id ornare arcu odio ut. Ornare quam viverra orci sagittis eu volutpat.

        Tellus molestie nunc non blandit massa enim nec. Mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Praesent elementum facilisis leo vel fringilla est ullamcorper.
       %}
      `,
      html`
      {%
        # Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et leo duis ut diam quam nulla porttitor massa id. Nullam eget felis eget nunc lobortis mattis aliquam faucibus purus. In est ante in nibh. Dolor sed viverra ipsum nunc. A lacus vestibulum sed arcu non. Vitae semper quis lectus nulla at volutpat. Lorem mollis aliquam ut porttitor leo a. Enim ut sem viverra aliquet eget sit amet. Congue eu consequat ac felis donec et odio pellentesque.

        Quisque egestas diam in arcu. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Egestas sed sed risus pretium quam vulputate. Faucibus vitae aliquet nec ullamcorper sit amet risus. Gravida arcu ac tortor dignissim convallis aenean et tortor. Dui id ornare arcu odio ut. Ornare quam viverra orci sagittis eu volutpat.

        Tellus molestie nunc non blandit massa enim nec. Mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Praesent elementum facilisis leo vel fringilla est ullamcorper.
       %}
      `,
      liquid`
      <div>
        <main>
          <section>
          {% #
        # Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et leo duis ut diam quam nulla porttitor massa id. Nullam eget felis eget nunc lobortis mattis aliquam faucibus purus. In est ante in nibh. Dolor sed viverra ipsum nunc. A lacus vestibulum sed arcu non. Vitae semper quis lectus nulla at volutpat. Lorem mollis aliquam ut porttitor leo a. Enim ut sem viverra aliquet eget sit amet. Congue eu consequat ac felis donec et odio pellentesque.

        Quisque egestas diam in arcu. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Egestas sed sed risus pretium quam vulputate. Faucibus vitae aliquet nec ullamcorper sit amet risus. Gravida arcu ac tortor dignissim convallis aenean et tortor. Dui id ornare arcu odio ut. Ornare quam viverra orci sagittis eu volutpat.

        Tellus molestie nunc non blandit massa enim nec. Mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Praesent elementum facilisis leo vel fringilla est ullamcorper.
       %}
          <div>
          {% # Lorem ipsum dolor sit amet, consectetur adipiscing elit %}
          </div>
          </section>
        </main>
      </div>
      `
    ]
  )(
    [
      {
        language: 'liquid',
        wordWrap: 0,
        commentIndent: true
      },
      {
        language: 'liquid',
        wordWrap: 50,
        commentIndent: true
      },
      {
        language: 'liquid',
        wordWrap: 30,
        commentIndent: true
      },
      {
        language: 'liquid',
        wordWrap: 80,
        commentIndent: true
      },
      {
        language: 'liquid',
        wordWrap: 80,
        commentIndent: false
      },
      {
        language: 'liquid',
        wordWrap: 100,
        commentIndent: true
      }

    ]
  )(function (sample, rules, label) {

    const result = esthetic.format(sample, rules);

    // t.log(result);
    t.snapshot(result, label);

  });

});
