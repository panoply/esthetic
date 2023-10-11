import test from 'ava';
import { liquid, forAssert, forRule } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Liquid inline line  Comments - commentIndent: true', t => {

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
        liquid`
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
      liquid: {
        commentIndent: true,
        commentNewline: false,
        preserveComment: false
      },
      markup: {

      }
    });

    t.deepEqual(actual, expect);

  });

});

test('Liquid Multiline Line Comments - commentIndent: true', t => {

  forAssert(
    [
      [
        liquid`
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
        liquid`
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
        preserveComment: false,
        delimiterPlacement: 'preserve'
      },
      markup: {

      }
    });

    t.deepEqual(actual, expect);

  });

});

test('Liquid Multiline Line Comments - commentIndent: false', t => {

  forAssert(
    [
      [
        liquid`
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
      crlf: false,
      indentSize: 2,
      liquid: {
        commentIndent: false,
        commentNewline: false,
        preserveComment: false,
        delimiterPlacement: 'preserve'
      },
      markup: {

      }
    });

    t.deepEqual(actual, expect);

  });

});

test('Liquid Multiline Line Comments - Wrap newlines and hash prefix', t => {

  forRule(
    [
      `
      {%
        # Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et leo duis ut diam quam nulla porttitor massa id. Nullam eget felis eget nunc lobortis mattis aliquam faucibus purus. In est ante in nibh. Dolor sed viverra ipsum nunc. A lacus vestibulum sed arcu non. Vitae semper quis lectus nulla at volutpat. Lorem mollis aliquam ut porttitor leo a. Enim ut sem viverra aliquet eget sit amet. Congue eu consequat ac felis donec et odio pellentesque.

        Quisque egestas diam in arcu. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Egestas sed sed risus pretium quam vulputate. Faucibus vitae aliquet nec ullamcorper sit amet risus. Gravida arcu ac tortor dignissim convallis aenean et tortor. Dui id ornare arcu odio ut. Ornare quam viverra orci sagittis eu volutpat.

        Tellus molestie nunc non blandit massa enim nec. Mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Praesent elementum facilisis leo vel fringilla est ullamcorper.
       %}
      `,
      `
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
        wrap: 0,
        liquid: {
          commentIndent: true,
          commentNewline: false
        }
      },
      {
        language: 'liquid',
        wrap: 50,
        liquid: {
          commentIndent: true,
          commentNewline: false
        }
      },
      {
        language: 'liquid',
        wrap: 30,
        liquid: {
          commentIndent: true,
          commentNewline: false
        }
      },
      {
        language: 'liquid',
        wrap: 80,
        liquid: {
          commentIndent: true,
          commentNewline: false
        }
      },
      {
        language: 'liquid',
        wrap: 80,
        liquid: {
          commentIndent: false,
          commentNewline: false
        }
      },
      {
        language: 'liquid',
        wrap: 100,
        liquid: {
          commentIndent: true,
          commentNewline: false
        }
      }

    ]
  )(function (sample, rules, label) {

    const result = esthetic.format(sample, rules);

    // t.log(result);
    t.snapshot(result, label);

  });

});
