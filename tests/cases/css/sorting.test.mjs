import test from 'ava';
import { css, forAssert } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Sorting selector names', t => {

  forAssert(
    [
      [
        css`

          .v,
          .z,
          .y,
          .a,
          .g,
          .u,
          .x > .a > .b,
          .x > .c > .d,
          .c > .d > .x,
          .f,
          .e,
          .n,
          .r,
          .t > .v > .x,
          .w,
          .b,
          .h,
          .j,
          .m,
          .k,
          .o,
          .ö,
          .ä {

            background-image: url("barn.jpg");
            z-index: 999;
            color: #fff;
            width: 200px;
            background-repeat: no-repeat;
            background-position: right top;
            background-attachment: fixed;
            font-weight: 100;
            font-style: bold;
            margin-top: 100px;
            display: flex;
            position: absolute;
            float: right;
            margin-left: 100px;
            padding-right: 25px;
            transition: ease-in;
            visibility: visible;
            padding-bottom: 40px;
            font-weight: 100;
            font-style: bold;
            padding-left: 25px;
            visibility: collapse;
            min-inline-size: inherit;

          }

        `,
        css`

          .a,
          .b,
          .c > .d > .x,
          .e,
          .f,
          .g,
          .h,
          .j,
          .k,
          .m,
          .n,
          .o,
          .r,
          .t > .v > .x,
          .u,
          .v,
          .w,
          .x > .a > .b,
          .x > .c > .d,
          .y,
          .z,
          .ä,
          .ö {

            background-image: url("barn.jpg");
            z-index: 999;
            color: #fff;
            width: 200px;
            background-repeat: no-repeat;
            background-position: right top;
            background-attachment: fixed;
            font-weight: 100;
            font-style: bold;
            margin-top: 100px;
            display: flex;
            position: absolute;
            float: right;
            margin-left: 100px;
            padding-right: 25px;
            transition: ease-in;
            visibility: visible;
            padding-bottom: 40px;
            font-weight: 100;
            font-style: bold;
            padding-left: 25px;
            visibility: collapse;
            min-inline-size: inherit;

          }

        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format.sync(source, {
      language: 'css',
      style: {
        sortSelectors: true
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('Sorting class properties', t => {

  forAssert(
    [
      [
        css`

          body {
            background-image: url("barn.jpg");
            z-index: 999;
            color: #fff;
            width: 200px;
            background-repeat: no-repeat;
            background-position: right top;
            background-attachment: fixed;
            font-weight: 100;
            font-style: bold;
            margin-top: 100px;
            display: flex;
            position: absolute;
            float: right;
            margin-left: 100px;
            padding-right: 25px;
            transition: ease-in;
            visibility: visible;
            padding-bottom: 40px;
            font-weight: 100;
            font-style: bold;
            padding-left: 25px;
            visibility: collapse;
            min-inline-size: inherit;
          }

        `,
        css`

          body {
            background-attachment: fixed;
            background-image: url("barn.jpg");
            background-position: right top;
            background-repeat: no-repeat;
            color: #fff;
            display: flex;
            float: right;
            font-style: bold;
            font-style: bold;
            font-weight: 100;
            font-weight: 100;
            margin-left: 100px;
            margin-top: 100px;
            min-inline-size: inherit;
            padding-bottom: 40px;
            padding-left: 25px;
            padding-right: 25px;
            position: absolute;
            transition: ease-in;
            visibility: visible;
            visibility: collapse;
            width: 200px;
            z-index: 999;
          }

        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format.sync(source, {
      language: 'css',
      style: {
        sortSelectors: false,
        sortProperties: true
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('Sorting selector and properties', t => {

  forAssert(
    [
      [
        css`

          .v,
          .z,
          .y,
          .a,
          .g,
          .u,
          .x > .a > .b,
          .x > .c > .d,
          .c > .d > .x,
          .f,
          .e,
          .n,
          .r,
          .t > .v > .x,
          .w,
          .b,
          .h,
          .j,
          .m,
          .k,
          .o,
          .ö,
          .ä {

            background-image: url("barn.jpg");
            z-index: 999;
            color: #fff;
            width: 200px;
            background-repeat: no-repeat;
            background-position: right top;
            background-attachment: fixed;
            font-weight: 100;
            font-style: bold;
            margin-top: 100px;
            display: flex;
            position: absolute;
            float: right;
            margin-left: 100px;
            padding-right: 25px;
            transition: ease-in;
            visibility: visible;
            padding-bottom: 40px;
            font-weight: 100;
            font-style: bold;
            padding-left: 25px;
            visibility: collapse;
            min-inline-size: inherit;

          }

        `,
        css`

          .a,
          .b,
          .c > .d > .x,
          .e,
          .f,
          .g,
          .h,
          .j,
          .k,
          .m,
          .n,
          .o,
          .r,
          .t > .v > .x,
          .u,
          .v,
          .w,
          .x > .a > .b,
          .x > .c > .d,
          .y,
          .z,
          .ä,
          .ö {
            background-attachment: fixed;

            background-image: url("barn.jpg");
            background-position: right top;
            background-repeat: no-repeat;
            color: #fff;
            display: flex;
            float: right;
            font-style: bold;
            font-style: bold;
            font-weight: 100;
            font-weight: 100;
            margin-left: 100px;
            margin-top: 100px;
            min-inline-size: inherit;
            padding-bottom: 40px;
            padding-left: 25px;
            padding-right: 25px;
            position: absolute;
            transition: ease-in;
            visibility: visible;
            visibility: collapse;
            width: 200px;
            z-index: 999;

          }

        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format.sync(source, {
      language: 'css',
      style: {
        sortSelectors: true,
        sortProperties: true
      }
    });

    t.deepEqual(actual, expect);

  });

});
