import yaml from 'yaml';
import fs from 'fs';
import {join} from 'path';

const configFile = join(__dirname, '..', 'config', 'config.yaml');
console.log('read', configFile);

const configContent = fs.readFileSync(
  configFile,
  {encoding : 'utf8'}
);

const decodedContent = yaml.eval(configContent);

export default decodedContent;
