#!/usr/bin/env node
import commander from 'commander';

import { Delimiter } from '../lib/generators/code-snippet-generators';
import { convertToSingleFile } from '../lib/converters/single-file.converter';
import { convertToMultipleFiles } from '../lib/converters/multiple-files.converter';

import * as packgeJSON from '../../package.json';

export interface ConvertionOptions {
  delimiter: Delimiter;
  typeName: string;
  prefix: string;
  fileName: string;
  interfaceName: string;
  srcFiles: string[];
  outputDirectory: string;
  modelOutputPath: string;
  modelFileName: string;
}

const DEFAULTS = {
  fileName: 'my-icons',
  delimiter: Delimiter.SNAKE,
  interfaceName: 'MyIcon',
  outputDirectory: './dist',
  prefix: 'myIcon',
  sourceFilesRegex: ['*.svg'],
  typeName: 'myIcons',
  optimizeForLazyLoading: false
};

function collect(value, previous) {
  return previous.concat([value]);
}

commander
  .version(packgeJSON.version)
  .option('-t --typeName <string>', 'name of the generated enumeration type', DEFAULTS.typeName)
  .option('-f --fileName <string>', 'name of the generated file', DEFAULTS.fileName)
  .option(
    '-d --delimiter <Delimiter>',
    `delimiter which is used to generate the types and name properties (${Object.values(Delimiter).join(',')})`,
    DEFAULTS.delimiter
  )
  .option('-p --prefix <string>', 'prefix for the generated svg constants', DEFAULTS.prefix)
  .option('-i --interfaceName <string>', 'name for the generated interface', DEFAULTS.interfaceName)
  .option('-s --srcFiles <value>', 'name of the source directory', collect, [])
  .option('-o --outputDirectory <string>', 'name of the output directory', DEFAULTS.outputDirectory)
  .option('--optimizeForLazyLoading <boolean>', 'optimize the output for lazyloading', DEFAULTS.optimizeForLazyLoading)
  .option('--modelOutputPath <string>', 'Output path for the types file')
  .option('--modelFileName <string>', 'FileName of the model file')
  .parse(process.argv);

const {
  delimiter,
  fileName,
  interfaceName,
  outputDirectory,
  prefix,
  typeName,
  modelFileName,
  modelOutputPath
} = commander;

// Because of commander adding default value to params
// See: https://stackoverflow.com/questions/30238654/commander-js-collect-multiple-options-always-include-default
let srcFiles = commander.srcFiles;
if (srcFiles.length === 0) {
  srcFiles = DEFAULTS.sourceFilesRegex;
}
const optimizeForLazyLoading = commander.optimizeForLazyLoading;

const convertionOptions = {
  delimiter,
  typeName,
  fileName,
  prefix,
  interfaceName,
  srcFiles,
  outputDirectory,
  modelOutputPath,
  modelFileName
};

if (optimizeForLazyLoading) {
  convertToMultipleFiles(convertionOptions);
} else {
  convertToSingleFile(convertionOptions);
}
