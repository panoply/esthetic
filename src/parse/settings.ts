import { ISettings } from 'types';
import { LogLevel } from 'lexical/enum';
/**
 * Global Settings
 *
 * This export is responsible for handling the
 * global settings for Æsthetic.
 */
export const settings = new class Settings implements ISettings {

  public editorConfig = false;
  public throwErrors = true;
  public persistRules = true;
  public logLevel = LogLevel.Standard;
  public logColors = true;
  public resolveConfig = 'package.json';

}();
