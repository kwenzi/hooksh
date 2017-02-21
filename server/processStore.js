import {spawn} from 'child_process';
import {v1} from 'uuid';

// TODO: auto remove old/finished processes. limit io storage..
const Store = class {
  constructor() {
    this.executions = {};
    this.allIds = [];
  }

  new(command, args, options) {
    const execution = new Execution(command, args, options);
    const id = v1();
    this.allIds.push(id);
    this.executions[id] = execution;
    execution.launch();
    return id;
  }

  get(id) {
    return this.executions[id];
  }

  getAll() {
    return this.allIds;
  }
};

const Execution = class {
  constructor(command, args, options) {
    this.command = command;
    this.args = args;
    this.options = options;

    this.launchError = [];
    this.executionError = [];
    this.log = [];
    this.startTime = null;
    this.endTime = null;
    this.exitCode = null;
    this.exitSignal = null;
    this.child = null;
  }

  logIo (io,data) {
    const timeStamp = Date.now();
    this.log.push({
      timeStamp,
      io,
      data: data.toString(),
    });
  }

  exit(code,signal) {
    const timeStamp = Date.now();
    this.endTime = timeStamp;
    this.exitCode = code;
    this.exitSignal = signal;
  }

  setExecutionError(error) {
    const timeStamp = Date.now();
    this.endTime = timeStamp;
    this.executionError.push({
      timeStamp,
      error
    });
  };

  setLaunchError(error) {
    const timeStamp = Date.now();
    this.endTime = timeStamp;
    this.launchError.push({
      timeStamp,
      error
    });
  };

  /**
  *   - failed launching
  *   - running
  *   - finished
  *     - success
  *     - error
  *     - terminated
  */
  getStatus() {
    let status = null;
    if (this.launchError.length > 0) {
      status = 'FAILED';
    } else if (this.startTime && !this.endTime) {
      status = 'RUNNING';
    } else if (this.exitCode == 0){
      status = 'SUCCESS';
    } else if (this.signal) {
      status = 'TERMINATED';
    } else {
      status = 'ERROR';
    }
    return status;
  }

  getInfo() {
    return {
      description: {
        command: this.command,
        args: this.args,
        options: this.options,
      },
      status: this.getStatus(),
      errors: [...this.launchError, ...this.executionError],
      started: this.startTime,
      duration: this.startTime ? this.endTime - this.startTime : 0,
      exitCode: this.exitCode,
      exitSignal: this.exitSignal,
      io: this.log
    }
  }

  terminate(signal) {
    try {
      this.child.kill(signal);
    } catch (error) {
      this.setExecutionError(error)
      throw error;
    }
  }

  launch() {
    try {
      this.startTime = Date.now();
      this.child = spawn(
        this.command,
        this.args,
        this.options
      );

      this.child.stdout.on('data', (data) => {
        this.logIo('stdout',data)
      });

      this.child.stderr.on('data', (data) => {
        this.logIo('stderr',data)
      });

      // emitted after the child process ends.
      this.child.on('exit', (code, signal) => {
        this.exit(code, signal)
      });

      this.child.on('error', (error) => {
        this.setExecutionError(error);
      });
    } catch (error) {
      this.setLaunchError(error);
    }
  }
};

export default Store;
