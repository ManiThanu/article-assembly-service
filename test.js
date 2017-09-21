import glob   from 'glob';
import Mocha  from 'mocha';

// Ensure Testing Env
process.env.NODE_ENV = 'testing';

// Load Environment
require('./src/env.loader');

// Create New Mocha Instance
const mocha = new Mocha({ reporter: 'spec' });

// Run Suite
glob('tests/**/*.js', (err, files) => {
  files.forEach(f => mocha.addFile(f));
  mocha.run(failures => process.exit(failures));
});
