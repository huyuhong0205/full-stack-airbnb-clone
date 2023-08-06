import dotenv from 'dotenv';

// Use __dirname in ESmodule
import { dirname } from 'path';
import { fileURLToPath } from 'url';

/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: `${__dirname}/../../env/config.env` });

console.log('Configure environment variables');
