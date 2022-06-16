import type { DetectedLanguage, LanguagePattern, PatternTypes, LanguagePoints } from 'types/language';
import { css } from '../languages/css';
import { html } from '../languages/html';
import { liquid } from '../languages/liquid';
import { json } from '../languages/json';
import { yaml } from '../languages/yaml';
import { javascript } from '../languages/javascript';
import { typescript } from '../languages/typescript';
import { markdown } from '../languages/markdown';
import { keys } from '@utils/native';

export const shebangMap: Record<string, string> = {
  node: 'javascript',
  jsc: 'javascript',
  deno: 'typescript'
};

const languages: Record<string, LanguagePattern[]> = {
  css,
  html,
  liquid,
  javascript,
  typescript,
  json,
  markdown,
  yaml
};

/**
 * Language Detection from code sample.
 */
export function detect (sample: string): DetectedLanguage {

  let linesOfCode = sample
    .replace(/\r\n?/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .split('\n');

  if (linesOfCode.length > 500) {
    linesOfCode = linesOfCode.filter((_, index) => {
      if (nearTop(index, linesOfCode)) return true;
      return index % Math.ceil(linesOfCode.length / 500) === 0;
    });
  }

  // Shebang check
  if (linesOfCode[0].startsWith('#!')) {
    if (linesOfCode[0].startsWith('#!/usr/bin/env')) {
      let language = linesOfCode[0].split(' ').slice(1).join(' ');
      language = shebangMap[language] || language.charAt(0).toUpperCase() + language.slice(1);
      return {
        language,
        statistics: {},
        linesOfCode: linesOfCode.length
      };
    }

    if (linesOfCode[0].startsWith('#!/bin/bash')) {
      return {
        language: 'bash',
        statistics: {},
        linesOfCode: linesOfCode.length
      };
    }
  }

  const pairs = keys(languages).map((key) => ({ language: key, checkers: languages[key] }));
  const results: LanguagePoints[] = [];

  for (let i = 0; i < pairs.length; i++) {

    const { language, checkers } = pairs[i];

    let points = 0;

    for (let j = 0; j < linesOfCode.length; j++) {

      // fast return if the current line of code is empty or contains only spaces
      if (/^\s*$/.test(linesOfCode[j])) continue;

      if (!nearTop(j, linesOfCode)) {
        points += getPoints(linesOfCode[j], checkers.filter((checker) => !checker.nearTop));
      } else {
        points += getPoints(linesOfCode[j], checkers);
      }
    }

    results.push({ language, points });
  }

  const bestResult = results.reduce((a, b) => a.points >= b.points ? a : b, { points: 0, language: '' });
  const statistics: Record<string, number> = {};

  for (let i = 0; i < results.length; i++) statistics[results[i].language] = results[i].points;

  return {
    language: bestResult.language,
    statistics,
    linesOfCode: linesOfCode.length
  };
}

function parsePoint (type: PatternTypes) {
  switch (type) {
    case 'keyword.print':
    case 'meta.import':
    case 'meta.module':
      return 5;
    case 'keyword.function':
    case 'constant.null':
      return 4;
    case 'constant.type':
    case 'constant.string':
    case 'constant.numeric':
    case 'constant.boolean':
    case 'constant.dictionary':
    case 'constant.array':
    case 'keyword.variable':
      return 3;
    case 'section.scope':
    case 'keyword.other':
    case 'keyword.operator':
    case 'keyword.control':
    case 'keyword.visibility':
    case 'keyword':
      return 2;
    case 'comment.block':
    case 'comment.line':
    case 'comment.documentation':
    case 'macro':
      return 1;
    case 'not':
    default:
      return -20;
  }
}

/**
 * Get points from a language using regular expressions.
 */
export function getPoints (lineOfCode: string, checkers: LanguagePattern[]): number {

  const checker: number[] = checkers.map((o) => {
    if (o.pattern.test(lineOfCode)) return parsePoint(o.type);
    return 0;
  });

  return checker.reduce((memo, num) => memo + num, 0);

}

/**
 * Checks if a given string is near top of the code or not.
 */
export function nearTop (index: number, linesOfCode: string[]): boolean {

  if (linesOfCode.length <= 10) return true;
  return index < linesOfCode.length / 10;

}
