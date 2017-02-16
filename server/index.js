import express from 'express';

const app = express();

app.use(
  (req, res) => {
    res.send('hello');
  }
);

const port = 3000;

const server = app.listen(
  port,
  () => {
    console.log('server started');
});
