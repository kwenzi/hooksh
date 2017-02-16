import gulp from 'gulp';
import clean from './clean';
//import copy from './assets';
//import favicons from './favicons';
//import * as css from './css';
//import * as views from './views';
import * as babelify from './babelify';
//import * as browserify from './browserify';

// TODO chose dev/prod task based on NODE_ENV

const tasks = [
  {
    name: 'server',
    src: ['server/**/*.js'],
    prod: babelify.prod,
    dev: babelify.dev,
  },
  {
    name: 'lib',
    src: ['lib/**/*.js'],
    prod: babelify.prod,
    dev: babelify.dev,
  },
]

const buildFolder = './build';
gulp.task('clean', clean([buildFolder]));

const build = [];
const prod = [];
const watch = [];
const cleanAll = [];

tasks.forEach(task => {
  task.dest = `${buildFolder}/${task.name}`;

  const devTask = task.name;
  const prodTask = `${task.name}-prod`;
  const watchTask = `${task.name}-watch`;
  const cleanTask = `${task.name}-clean`;

  gulp.task(cleanTask, clean(task.dest));
  gulp.task(devTask,  [cleanTask], task.dev(task.src, task.dest));
  gulp.task(prodTask, [cleanTask], task.prod(task.src, task.dest));
  gulp.task(watchTask, [devTask], () => {
    gulp.watch(task.src, [devTask]);
  });

  cleanAll.push(cleanTask);
  build.push(devTask);
  prod.push(prodTask);
  watch.push(watchTask)
})

const paths = {
  client: ['client/index.jsx'],
};

gulp.task('prod', prod);
gulp.task('build', build);
gulp.task('watch', watch);
gulp.task('clean', cleanAll);
