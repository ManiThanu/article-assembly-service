require('babel-polyfill');
const chalk = require('chalk');

const ENV = process.env.NODE_ENV;

// Ensure Explicit NODE_ENV
if (!ENV) {
  throw new Error('NODE_ENV not set.');
}

// Load Environment Variables
require('dotenv').config({
  path: `config/.env.${ENV}`,
});

// Load Logger
if (ENV !== 'testing') {
  ['log', 'warn', 'error', 'info'].forEach((method) => {
    const logger = console[method];
    console[method] = (...args) => logger(chalk.yellow(`[${(new Date()).toISOString()}]`), ...args);
  });
}
