import express from 'express';
import Store from './processStore';
import decodedContent from './readConfig';

const router = express.Router();
const store = new Store();

// TODO: manage authorization tokens

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

    const id = store.new(command, args, options);
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
  const execution = store.get(id);
  if (execution){
    return res.json(execution.getInfo());
  }
  return next();
});

/**
 * List command execution instances.
 * TODO: filter on status, on date.
 */
router.get('/', (req, res, next) => {
  return res.json(store.getAll());
})

/**
 * Kill command execution.
 */
router.delete('/:id', (req, res, next) => {
  const {id} = req.params;
  const execution = store.get(id);
  if (execution){
    try {
      execution.terminate();
    } catch (error) {
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  }
  return next();
});

/**
 * Send a signal to a given command execution.
 */
router.patch('/:id/:signal?', (req, res, next) => {
   const {id, signal} = req.params;
   const execution = store.get(id);
   if (execution){
     try {
       execution.terminate(signal);
     } catch (error) {
       return res.sendStatus(500);
     }
     return res.sendStatus(200);
   }
   return next();
});

export default router;
