/**
 * Worker (Asset Assembly)
 */

// Load Environment
require('./src/env.loader');

// Start API Server
require(`./${process.env.SRC_DIR_NAME}/assembler`); // eslint-disable-line
