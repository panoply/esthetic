import type { LanguagePattern } from 'types/language';

export const yaml: LanguagePattern[] = [
  {
    pattern: /^( )*([A-Za-z0-9_. ]+):( )?(.*)?$/,
    type: 'keyword'
  },
  {
    pattern: /^( )*-( )([A-Za-z0-9_. ]+):( )?(.*)?$/,
    type: 'keyword'
  },
  {
    pattern: /^( )*-( )(.*)$/,
    type: 'keyword'
  },
  {
    pattern: /^( )*([A-Za-z0-9_. ]+):( )!!binary( )?(|)?$/,
    type: 'constant.type'
  },
  {
    pattern: /^( )*([A-Za-z0-9_. ]+):( )\|$/,
    type: 'keyword'
  },
  {
    pattern: /^( )*([A-Za-z0-9_. ]+):( )>$/,
    type: 'keyword'
  },
  {
    pattern: /^( )*\?( )(.*)$/,
    type: 'keyword'
  },
  {
    pattern: /^( )*\?( )\|$/,
    type: 'constant.type'
  },
  {
    pattern: /^( )*<<:( )(\*)(.*)?$/,
    type: 'constant.type'
  },
  {
    pattern: /^( )*([A-Za-z0-9_. ]+):(.*)?( )?{$/,
    type: 'not'
  },
  {
    pattern: /^( )*([A-Za-z0-9_. ]+):(.*)?( )?,$/,
    type: 'not'
  }
];
