import Benchmark from 'benchmark';
import Esthetic from 'esthetic';
import PrettyDiff from 'prettydiff';
import path from 'path';
import fs from 'fs';

const html = fs.readFileSync(path.join(process.cwd(), 'changes', '/samples/doctype.txt')).toString();

const suite = new Benchmark.Suite();

suite.add('PrettyDiff', function () {

  PrettyDiff.options.mode = 'beautify';
  PrettyDiff.options.lexer = 'markup';
  PrettyDiff.options.source = html;
  PrettyDiff.options.wrap = 80;

  return PrettyDiff();

}, {
  async: false
});

suite.add('Æsthetic', function () {

  return Prettify.format(html, {
    language: 'html',
    lexer: 'markup',
    wrap: 80
  });
}, {
  async: true
});

suite.on('cycle', function (event) {
  console.log(String(event.target));
});

suite.on('complete', async function () {

  console.log('\nSlowest is ' + this.filter('slowest').map('name'));
  console.log('Fastest is ' + this.filter('fastest').map('name'));

  console.log('\nBeautification Times:', '\n');

  console.time('PrettyDiff');

  PrettyDiff.options.mode = 'beautify';
  PrettyDiff.options.lexer = 'markup';
  PrettyDiff.options.source = html;
  PrettyDiff.options.wrap = 80;
  PrettyDiff();

  console.timeEnd('PrettyDiff');

  console.time('Æsthetic');

  Esthetic.format(html, {
    language: 'html',
    lexer: 'markup',
    wrap: 80
  });

  console.timeEnd('Æsthetic');
});

suite.run();
