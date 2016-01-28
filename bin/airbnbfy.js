#!/usr/bin/env node

const fs = require('fs');
const airbnbfy = require('../dist/airbnbfier.js');
const usage = `usage:

    airbnbfy.js src [--write] [formatter...]

Options:

    --write     Overwrite the source file
    --all       Use all the formatters
    --except    Ignore the declared formatters
`;


function run() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    throw Error(usage);
  }

  const src = args[0];
  if (!fs.existsSync(src)) {
    throw Error('`' + src + '` does not exist.');
  }

  const methods = args.slice(1);
  const str = fs.readFileSync(src).toString();
  const updatedStr = airbnbfy(str, methods);
  if (methods.indexOf('--write') === -1) {
    process.stdout.write(updatedStr);
  } else {
    process.stdout.write('Writing to: ' + src + '\n');
    fs.writeFileSync(src, updatedStr);
  }
}


run();
