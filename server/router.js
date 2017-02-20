import express from 'express';
import {spawn} from 'child_process';
import decodedContent from './readConfig';
import {v1} from 'uuid';

const router = express.Router();

const executions = {};
const allIds = [];

const launch = (command, args, options) => {
  const id = v1();
  allIds.push(id);
  executions[id] = {
    command,
    args,
    options,
    launchError: null,
    executionError: null,
    log: [],
    startTime: Date.now(),
    endDate: null,
    exitCode: null,
    signal: null,
    child: null,
  }

  const execution = executions[id];
  try {
    execution.child = spawn(command, args, options);

    execution.child.stdout.on('data', (data) => {
      execution.log.push({
        time: Date.now(),
        io: 'stdout',
        data: data.toString(),
      })
    });

    execution.child.stderr.on('data', (data) => {
      execution.log.push({
        time: Date.now(),
        io: 'stderr',
        data: data.toString(),
      })
    });

    // emitted when the stdio streams of a child process have been closed.
    /*
    cmdSpawn.on('close', (code, signal) => {
      console.log(`command ${command} closed with code ${code}, terminated by signal ${signal}`);
    });
    */

    // emitted after the child process ends.
    execution.child.on('exit', (code, signal) => {
      execution.endDate = Date.now();
      execution.exitCode = code;
      execution.signal = signal;
    });

    execution.child.on('error', (error) => {
      execution.endDate = Date.now();
      execution.executionError = error;
    });
  } catch (error) {
    execution.endDate = Date.now();
    execution.launchError = error;
  }

  return id;
}

/**
 * Launch a new unique command execution.
 * Return command execution id.
 */
router.post('/:cmd', (req, res, next) => {
  const {cmd} = req.params;
  const description = decodedContent[cmd];
  if (description) {
    const {
      command,
      args = [],
      ...options
    } = description;

    const id = launch(command, args, options);
    res.send(id);
  } else {
    return next();
  }
})

/**
 * Inspect command execution :
 * - command description
 * - stdio,
 * - running status,
 *   - failed launching
 *   - running
 *   - finished
 *     - success
 *     - error
 *     - terminated
 * - exit code, signal if terminated
 * - start time, end time, running time
 */
router.get('/:id', (req, res, next) => {
  const {id} = req.params;
  const execution = executions[id];
  if (execution){
    const {child, ...rest} = execution;
    return res.json(rest);
  }
  return next();
});

/**
 * List command execution instances.
 */
router.get('/', (req, res, next) => {
  return res.json(allIds);
})

/**
 * Kill command execution (with a specific signal), or
 * remove finished process.
 */
router.delete('/:id/:signal?', (req, res, next) => {
  const {id, signal} = req.params;
  const execution = executions[id];
  if (execution){
    try {
      execution.child.kill(signal);
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  }
  return next();
});

export default router;
