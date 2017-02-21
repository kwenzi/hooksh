# hookSh

Webhook for shell scripts.

## How to use

### Setup

`config.yaml`:

```
pull:
  command: git
  args:
    - 'pull'
  cwd: '/Users/dral/Git/kwenzi/hooksh'
```

### Launch the server

```
npm install
NODE_ENV=production npm run build
NODE_ENV=production npm start
```

### Trigger a command

```
curl -vX POST localhost:3000/pull -vv
> POST /pull HTTP/1.1
< HTTP/1.1 200 OK
363f6350-f81e-11e6-9cba-dfc9161f5816
```

### Inspect a command

```
curl -v localhost:3000/363f6350-f81e-11e6-9cba-dfc9161f5816
> GET /363f6350-f81e-11e6-9cba-dfc9161f5816 HTTP/1.1
< HTTP/1.1 200 OK
{
  "description":{
    "command":"git",
    "args":["pull"],
    "options":{
      "cwd":"/Users/dral/Git/kwenzi/deploy"
    }
  },
  "status":"ERROR",
  "errors":[],
  "started":1487671932421,
  "duration":22,
  "exitCode":128,
  "exitSignal":null,
  "io":[
    {
      "timeStamp":1487671932443,
      "io":"stderr",
      "data":"fatal: Not a git repository (or any of the parent directories): .git\n"
    }
  ]
}
```
note: response has been formatted.

### Get all executed commands

```
curl -v localhost:3000
> GET / HTTP/1.1
< HTTP/1.1 200 OK
["31aff020-f81e-11e6-9cba-dfc9161f5816","363f6350-f81e-11e6-9cba-dfc9161f5816"]
```


### Stop a running command

Equivalent of sending a SIGTERM signal.

```
curl -vX DELETE localhost:3000/363f6350-f81e-11e6-9cba-dfc9161f5816
> DELETE /363f6350-f81e-11e6-9cba-dfc9161f5816 HTTP/1.1
< HTTP/1.1 500 Internal Server Error
Internal Server Error
```

### Send a signal to a running command

```
curl -vX PATCH localhost:3000/363f6350-f81e-11e6-9cba-dfc9161f5816/SIGKILL
> PATCH /363f6350-f81e-11e6-9cba-dfc9161f5816/SIGKILL HTTP/1.1
< HTTP/1.1 500 Internal Server Error
Internal Server Error%
```
