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
0f7b5910-f821-11e6-ac11-257a8674981b
```

### Inspect a command

```
curl -v localhost:3000/0f7b5910-f821-11e6-ac11-257a8674981b
> GET /0f7b5910-f821-11e6-ac11-257a8674981b HTTP/1.1
< HTTP/1.1 200 OK
{
  "description":{
    "command":"git",
    "args":["pull"],
    "options":{
      "cwd":"/Users/dral/Git/kwenzi/hooksh"
    }
  },
  "status":"SUCCESS",
  "errors":[],
  "started":1487673155874,
  "duration":1053,
  "exitCode":0,
  "exitSignal":null,
  "io":[
  {
    "timeStamp":1487673156925,
    "io":"stdout",
    "data":"Already up-to-date.\n"
  }]
}
```
note: response has been formatted.

### Get all executed commands

```
curl -v localhost:3000
> GET / HTTP/1.1
< HTTP/1.1 200 OK
["0f7b5910-f821-11e6-ac11-257a8674981b"]
```


### Stop a running command

Equivalent of sending a SIGTERM signal.

```
curl -vX DELETE localhost:3000/0f7b5910-f821-11e6-ac11-257a8674981b
> DELETE /0f7b5910-f821-11e6-ac11-257a8674981b HTTP/1.1
< HTTP/1.1 200 OK
OK
```

### Send a signal to a running command

```
curl -vX PATCH localhost:3000/0f7b5910-f821-11e6-ac11-257a8674981b/SIGKILL
> PATCH /0f7b5910-f821-11e6-ac11-257a8674981b/SIGKILL HTTP/1.1
< HTTP/1.1 200 OK
OK
```
