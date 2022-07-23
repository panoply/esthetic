import test from 'ava';

const chars = {
  ATT: 64, // @
  HSH: 35, // #
  LPR: 40, // (
  RPR: 41, // )
  LCB: 123, // {
  RCB: 125, // }
  LSB: 91, // []
  RSB: 93, // ]
  LAN: 60, // <
  RAN: 62, // >
  BNG: 33, // !
  DSH: 45, // -
  PER: 37, // %
  EQS: 61, // =
  DQO: 34, // "
  SQO: 39, // '
  TQO: 96, // `
  WSP: 32, //
  NWL: 10, // \n
  FWS: 47, // /
  QWS: 63, // ?
  ARS: 42, // *
  COL: 58, // :
  SEM: 59, // ;
  COM: 44, // ,
  PLS: 43 // +
};

test('Unit: Characted Codes (Enum) Maps', t => {

  t.is('@'.charCodeAt(0), chars.ATT);
  t.log('ATT @ 64');

  t.is('#'.charCodeAt(0), chars.HSH);
  t.log('HSH # 35');

  t.is('('.charCodeAt(0), chars.LPR);
  t.log('LPR (');

  t.is(')'.charCodeAt(0), chars.RPR);
  t.log('RPR )');

  t.is('{'.charCodeAt(0), chars.LCB);
  t.log('LCB {');

  t.is('}'.charCodeAt(0), chars.RCB);
  t.log('RCB }');

  t.is('['.charCodeAt(0), chars.LSB);
  t.log('LSB [');

  t.is(']'.charCodeAt(0), chars.RSB);
  t.log('RSB ]');

  t.is('<'.charCodeAt(0), chars.LAN);
  t.log('LAN <');

  t.is('>'.charCodeAt(0), chars.RAN);
  t.log('RAN >');

  t.is('!'.charCodeAt(0), chars.BNG);
  t.log('BNG !');

  t.is('-'.charCodeAt(0), chars.DSH);
  t.log('DSH -');

  t.is('%'.charCodeAt(0), chars.PER);
  t.log('PER %');

  t.is('='.charCodeAt(0), chars.EQS);
  t.log('EQS =');

  t.is('"'.charCodeAt(0), chars.DQO);
  t.log('DQO "');

  t.is("'".charCodeAt(0), chars.SQO);
  t.log("SQO '");

  t.is('`'.charCodeAt(0), chars.TQO);
  t.log('TQO `');

  t.is(' '.charCodeAt(0), chars.WSP);
  t.log('WSP \\s');

  t.is('\n'.charCodeAt(0), chars.NWL);
  t.log('NWL \\n');

  t.is('/'.charCodeAt(0), chars.FWS);
  t.log('FWS /');

  t.is('?'.charCodeAt(0), chars.QWS);
  t.log('QWS ?');

  t.is('*'.charCodeAt(0), chars.ARS);
  t.log('ARS *');

  t.is(':'.charCodeAt(0), chars.COL);
  t.log('COL :');

  t.is(';'.charCodeAt(0), chars.SEM);
  t.log('SEM ;');

  t.is(','.charCodeAt(0), chars.COM);
  t.log('COM ,');

  t.is('+'.charCodeAt(0), chars.PLS);
  t.log('PLS +');
});
