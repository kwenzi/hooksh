import {resolve} from 'path';
import commander from 'commander';
import Config from './config';

commander
  .version('0.1.0')
  .usage('<configFile>')
  .parse(process.argv);

if (commander.args.length === 0) commander.help();

const configFile = resolve(process.cwd(), commander.args[0]);
const config = new Config(configFile);

export default config;
/*
console.log('read', configFile);

const configContent = fs.readFileSync(
  configFile,
  {encoding : 'utf8'}
);

const decodedContent = yaml.eval(configContent);

export default decodedContent;

const Config = class {
  constructor(file) {
    this.config = {};
    watch(file, function(f) {
      console.log(`${f} changed.`);
      const fileContent = fs.readFileSync(f, {encoding : 'utf8'});
      try {
        this.config = yaml.eval(fileContent);
      } catch (error) {
        console.error(`invalid config file`);
      }
    });
  }

  get(name) {
    return this.config[name];
  }
};

export default Config;
*/
