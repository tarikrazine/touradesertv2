const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT REJECTION, shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

let server;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful');

    // Start the server After connection of database
    const port = process.env.PORT || 8000;
    server = app.listen(port, () => {
      console.log(`App running on port ${port}...`);
    });
  });

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION, shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
