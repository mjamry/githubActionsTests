// DESCRIPTION
// Script to update app version
// ARGS:
//  1 - file name to
//  2 - update type = 'minor' | 'major'

const fs = require('fs');
const readline = require('readline');

// Read the file name from command line arguments
const fileName = process.argv[2];
let updateType = process.argv[3];

if(fileName === undefined || fileName === null){
    console.error('ERROR: File name not provided');
    process.exit(1);
}

if(updateType !== 'minor' && updateType !== 'major'){
    updateType = 'minor';
}

let currentVersion = "";
let newVersion = "";

const increaseVersion = (data) => {
  return data.replace(/("version":\s*")(\d+(\.\d+){2})(")/, (match, p1, p2, p3, p4) => {
    currentVersion = p2;
    const version = p2.split('.').map(Number);
    if(updateType === 'minor'){
      version[2]++;
    } else if (updateType === 'major')
    {
      version[1]++;
      version[2] = 0;
    }
    newVersion = version.join('.');
    return p1 + newVersion + p4;
  });
};

const rl = readline.createInterface({
  input: fs.createReadStream(fileName),
  output: process.stdout,
  terminal: false
});

let updatedContent = '';

rl.on('line', (line) => {
  if (line.includes("version")) {
    const updatedLine = increaseVersion(line);
    updatedContent += updatedLine + '\n';
  } else {
    updatedContent += line + '\n';
  }
});

rl.on('close', () => {
  fs.writeFile(fileName, updatedContent, (err) => {
    if(err){
      console.log(`Error while writing to file: ${err}`);
    } else {
      console.log(`App version updated: ${currentVersion} -> ${newVersion}`);
    }
  });
});
