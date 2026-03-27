import fs from 'fs';
import { globSync } from 'glob';
import path from 'path';

function concatFiles(inputFiles, output, filesToIgnore) {
  // Initialize an empty string to hold the file contents
  const directories = globSync(inputFiles, {ignore: filesToIgnore});
  let content = '';

  // Loop over the file paths
  for (let filePath of directories) {
    // Read the file and append its contents to the string
    content += fs.readFileSync(path.resolve(filePath), 'utf-8');
  }

    // Create directory if it does not exist
    const outputPath = path.resolve(output);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  // Write the concatenated contents to the output file
  fs.writeFileSync(path.resolve(output), content);
}

console.time("Created Js Bundles")
const config = JSON.parse(fs.readFileSync(path.resolve('./appsettings.json'), 'utf-8'))
concatFiles(config.bundling.bgl.inputFiles, config.bundling.bgl.outputFile, config.bundling.bgl.ignore)
concatFiles(config.bundling.external.inputFiles, config.bundling.external.outputFile, config.bundling.external.ignore)
console.timeEnd("Created Js Bundles")
