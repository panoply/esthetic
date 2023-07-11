import { IConfigInternal } from 'types';
import { LogLevel } from 'lexical/enum';

/**
 * Global Settings
 *
 * This export is responsible for handling global settings for Æsthetic.
 */
export const config: IConfigInternal = {
  // @ts-ignore
  version: VERSION,
  env: typeof process !== 'undefined' && process.versions != null ? 'node' : 'browser',
  lastUpdate: new Date().toDateString(),
  cwd: null,
  reportStats: true,
  editorConfig: false,
  throwErrors: true,
  globalThis: true,
  persistRules: true,
  logLevel: LogLevel.Standard,
  logColors: true,
  resolveConfig: 'package.json'
};
