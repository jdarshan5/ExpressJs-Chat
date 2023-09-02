import dotenv, { DotenvConfigOutput } from 'dotenv';

let _env: DotenvConfigOutput;

if (process.env.NODE_ENV === 'development') {
  _env = dotenv.config({
    path: './.env.dev',
  });
} else if (process.env.NODE_ENV === 'production') {
  _env = dotenv.config({
    path: './.env.prod',
  });
}

if(_env.error) {
  process.exit();
}
