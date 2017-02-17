import express from 'express';
import yaml from 'yaml';
import fs from 'fs';
import {join} from 'path';
import {spawn} from 'child_process';

const router = express.Router();

const configFile = join(__dirname, '..', 'config', 'config.yaml');
console.log('read', configFile);

const configContent = fs.readFileSync(
  configFile,
  {encoding : 'utf8'}
);

const decodedContent = yaml.eval(configContent);

//console.log(decodedContent);

const cmdMiddleware = (description) => (req, res) => {
  const {
    command,
    args = [],
    ...options
  } = description;

  const cmdSpawn = spawn(command, args, options);
  cmdSpawn.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  cmdSpawn.stderr.on('data', (data) => {
    console.log(data.toString());
  });
  cmdSpawn.on('exit', (code) => {
    console.log(`command ${description.command} exited with code ${code}`);
  })

  cmdSpawn.on('error', (error) => {
    console.log(`Error executing ${description.command} : ${error}`);
  })
  res.json(description);
}

for (let path in decodedContent) {
  if (decodedContent.hasOwnProperty(path)) {
    let commandDescription = decodedContent[path];
    router.use(`/${path}`, cmdMiddleware(commandDescription));
    console.log(`added path ${path}`);
  }
}

export default router;
