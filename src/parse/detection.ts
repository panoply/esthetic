import type { LanguageName, LexerName } from 'types';

export function detection (sample: string): {
  language: LanguageName,
  lexer: LexerName
} {

  const JSON = /^\s*(?:\/\/.*$|\/\*[\s\S]*?\*\/|\s)*(?:\{[\s\S]*\}|\[[\s\S]*\])\s*(?:\/\/.*$|\/\*[\s\S]*?\*\/|\s)*$/m;
  const HTML = /<!(?:doctype|--)\s|<[a-z-]+\b[^>]*>|<\/[a-z-]+>/i;
  const LIQUID = /{%-?\s*[a-z_]+\b[^%]*-?%}|{{-?\s*[\w.]+(?:\s*\|\s*\w+(?:\s*:\s*[\w"']+)*)*\s*-?}}/;
  const XML = /^\s*<\?xml\s+version\s*=|<\w+(?:\s+[\w:]+\s*=\s*"[^"]*")*\s+xmlns\s*=|<\w+:[^>]+>|<\/\w+:[^>]+>/i;

  // Improved plaintext - more restrictive
  const PLAINTEXT = /^[\w\s.,!?;:()\-'"]+$/;

  if (HTML.test(sample)) {

    return LIQUID.test(sample)
      ? { language: 'liquid', lexer: 'markup' }
      : XML.test(sample) ? { language: 'xml', lexer: 'markup' } : { language: 'html', lexer: 'markup' };

  } else if (LIQUID.test(sample)) {

    return { language: 'liquid', lexer: 'markup' };

  } else if (JSON.test(sample)) {

    return { language: 'json', lexer: 'json' };

  } else if (PLAINTEXT.test(sample)) {

    return { language: 'plaintext', lexer: 'ignore' };

  }

  return { language: 'unknown', lexer: 'ignore' };
}
