const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Set app variables
app.use(bodyParser.json());

//Load routes
const employer = require('./routes/employers');
const quizzes = require('./routes/quizzes');
const candidates = require('./routes/candidates');
const results = require('./routes/results');

///Load database config and give it to the app to make it available everywhere.
const config = require('./config/config.js');
app.set('config', config);

//Create pool of mysql server connections, pass to app
const pool = mysql.createPool(config.database);
app.set('mysql_pool', pool);

//Test database connection
pool.getConnection(function (err, connection) {
  if (err) {
    throw err;
  }
  console.log('Server has successfully connected to database!');
  connection.release();
});

// Routes for API
app.use('/api/employers', employer);
app.use('/api/employers', quizzes);
app.use('/api/employers', results);
app.use('/api/candidates', candidates);

// Listen to the App Engine-specified port, or 8000 otherwise
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
