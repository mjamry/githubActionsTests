const fs = require('fs');
const { program, Option } = require('commander');

program
  .description(`This script updates a specified field in a javascript or JSON file representing a version number according to the chosen update type ('minor' or 'major'). It provides flexibility in updating different version fields and supports custom file paths. Additionally, it outputs the original and updated versions after modification.`)
  .requiredOption('-f, --file <type>', 'File name to update')
  .addOption(new Option('-u, --update <type>', 'Type of version update')
    .choices(['minor', 'major'])
    .default('minor'))
  .option('--field <type>', 'Field in file to update', 'version')
  .parse(process.argv);

const options = program.opts();
console.log(options, options.first, options.file, options.field);


let currentVersion = undefined;
let newVersion = undefined;

fs.readFile(options.file, 'utf8', (err, data) => {
  if (err) {
      console.error('Error reading file:', err);
      process.exit(1);
  }

  const regexPattern = new RegExp(`("${options.field}":\\s*")(\\d+(\\.\\d+){2})(")`);
  const newData = data.replace(regexPattern, (match, p1, p2, p3, p4) => {
    currentVersion = p2;
    const version = p2.split('.').map(Number);
    if(options.update === 'minor'){
      version[2]++;
    } else {
      version[1]++;
      version[2] = 0;
    }
    newVersion = version.join('.');
    return p1 + newVersion + p4;
  });

  if(currentVersion === undefined && newVersion === undefined) {
    console.error(`Cannot find field ${options.field} in the file ${options.file}`);
    process.exit(1);
  }

  fs.writeFile(options.file, newData, 'utf8', (err) => {
      if (err) {
          console.error('Error writing to file:', err);
          process.exit(1);
      }
      console.log(`${currentVersion} -> ${newVersion}`);
      process.exit(0);
  });
});
