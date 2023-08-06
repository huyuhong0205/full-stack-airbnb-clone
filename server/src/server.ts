// Third-part library
import mongoose from 'mongoose';

// Configuration environment variable
import './config-env/config.js'; // !important need to import before own modules

// Own modules
import app from './app.js';

/* eslint-disable no-console */

///////////////////////////////////////////////////////////////////
process.on('uncaughtException', (error) => {
  console.log('Uncaught exception error! server shutting down...');
  console.log(error.name, error.message);
  // Close server and exit process
  process.exit(1); // 0 stands for success, 1 stands for error
});
///////////////////////////////////////////////////////////////////

// Connect to mongodb cloud DB
const database = process.env.DB.replace('<password>', process.env.DB_PASS);
mongoose.set('strictQuery', false);
mongoose
  .connect(database)
  .then(() => {
    console.log('DB connection successful');
  })
  .catch((err) => {
    console.log('Connect to database error, log from server.ts', err);
  });

// Start server
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

///////////////////////////////////////////////////////////////////
process.on('unhandledRejection', (error) => {
  console.log('unhandled rejection error! server shutting down...');
  console.log(error);
  // Close server and exit process
  server.close(() => {
    process.exit(1); // 0 stands for success, 1 stands for error
  });
});
///////////////////////////////////////////////////////////////////
