import yaml from 'yaml';
import fs from 'fs';
import chokidar from 'chokidar';

const Config = class {
  constructor(path) {
    this.path = path;
    this.config = {};
    this.monitor();
  }

  monitor() {
    console.log(`monitoring ${this.file}`);

    chokidar.watch(this.path)
    .on('add', path => this.read('add', path))
    .on('change', path => this.read('change', path))
    .on('unlink', path => this.remove(path));
  }

  remove(file) {
    this.config[file] = undefined;
  }

  read(event, file) {
    const fileContent = fs.readFileSync(file, {encoding : 'utf8'});
    try {
      console.log(`${event}ed config: ${file}`);
      this.config[file] = yaml.eval(fileContent);
    } catch (error) {
      this.config[file] = undefined;
      console.error(`invalid config: ${file}. Ignoring file.`);
    }
  }

  get(name) {
    return this.config[name];
  }
};

export default Config;
