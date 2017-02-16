import del from 'del';

const clean = (dest) => () => (
  del(dest)
);

export default clean;
