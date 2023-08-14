import test from 'ava';
import { css, forSample } from '@liquify/ava/esthetic';

test.skip('Nested Test: Structural handling of CSS stylesheets', t => {

  forSample([
    css`
      header-drawer {
        justify-self: start;
        margin-left: -1.2rem;
      }

      {%- if section.settings.sticky_header_type == 'reduce-logo-size' -%}
        .scrolled-past-header .header__heading-logo-wrapper {
          width: 75%;
        }
      {%- endif -%}

      {%- if section.settings.menu_type_desktop != "drawer" -%}
        @media screen and (min-width: 990px) {
          header-drawer {
            display: none;
          }
        }
      {%- endif -%}

      .menu-drawer-container {
        display: flex;
      }

      .list-menu {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .list-menu--inline {
        display: inline-flex;
        flex-wrap: wrap;
      }

      summary.list-menu__item {
        padding-right: 2.7rem;
      }

      .list-menu__item {
        display: flex;
        align-items: center;
        line-height: calc(1 + 0.3 / var(--font-body-scale));
      }

      .list-menu__item--link {
        text-decoration: none;
        padding-bottom: 1rem;
        padding-top: 1rem;
        line-height: calc(1 + 0.8 / var(--font-body-scale));
      }

      @media screen and (min-width: 750px) {
        .list-menu__item--link {
          padding-bottom: 0.5rem;
          padding-top: 0.5rem;
        }
      }
      `

  ]);

});
