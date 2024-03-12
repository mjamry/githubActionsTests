// DESCRIPTION
// Script to update app version
// ARGS:
//  1 - file name to
//  2 - field name

const fs = require('fs');
const readline = require('readline');

// Read the file name from command line arguments
const fileName = process.argv[2];
let fieldName = process.argv[3];

if(fileName === undefined || fileName === null){
  console.error('ERROR: File name not provided');
  process.exit(1);
}

if(fieldName === undefined || fieldName === null){
  console.error('ERROR: Field name not provided');
  process.exit(1);
}

let version = undefined;

const rl = readline.createInterface({
  input: fs.createReadStream(fileName),
  output: process.stdout,
  terminal: false
});


rl.on('line', (line) => {
  if (line.includes(fieldName)) {
    var match = line.match(/(`"${fieldName}"`:\s*")(\d+(\.\d+){2})(")/);
    if(match) {
      version = match[2];
      console.log(match[2]);
    }
  }
});
