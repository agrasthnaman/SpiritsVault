import { app } from './server';

/**
 * Application entry point
 * This file imports the server and starts the application
 */

// Start the server
app.start().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});
