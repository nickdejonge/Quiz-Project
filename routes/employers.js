const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const bodyParser = require('body-parser');
router.use(bodyParser.json());

// Fetches the user's info from the database by email, and returns it (or an error)
async function getUserInfoByEmail(email, pool) {
  return new Promise((resolve, reject) => {
    let query =
      'SELECT * FROM `Employers` WHERE employerEmail = ' + email + ';';
    pool.query(query, function (error, results, fields) {
      // Report database connection errors
      if (error) {
        return reject(error);
      } else {
        return resolve(results);
      }
    });
  });
}

// Fetches the user's info from the database by ID, and returns it (or an error)
async function getUserInfoByID(id, pool) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM `Employers` WHERE employerID = ' + id + ';';
    pool.query(query, function (error, results, fields) {
      // Report database connection errors
      if (error) {
        return reject(error);
      } else {
        return resolve(results);
      }
    });
  });
}

// Adds a user to the database and returns success or error.
async function addUserToDatabase(name, email, hash, pool) {
  return new Promise((resolve, reject) => {
    let query =
      'INSERT INTO `Employers`(`employerName`, `employerEmail`, `employerPassword`) VALUES (' +
      name +
      ', ' +
      email +
      ", '" +
      hash +
      "');";
    pool.query(query, function (error, results, fields) {
      // Report database connection errors
      if (error) {
        return reject(error);
      } else {
        return resolve(results);
      }
    });
  });
}

/* ROUTES */
router.post('/signup', async (req, res) => {
  // If request body has an invalid number of properties, err 400 and send message
  if (Object.keys(req.body).length != 3) {
    return res.status(400).send({
      error:
        'The request object does not contain the correct number of attributes',
    });
    // If request body has undefined necessary properties, err 400 and send message
  } else if (
    req.body.name == undefined ||
    req.body.email == undefined ||
    req.body.passphrase == undefined
  ) {
    return res.status(400).send({
      error:
        'The request object is missing at least one of the required attributes',
    });
    // Otherwise, we've got a properly formed request body
  } else {
    // Grab connection from pool
    let pool = req.app.get('mysql_pool');
    let config = req.app.get('config');

    // Escape data for security things
    let name = mysql.escape(req.body.name);
    let email = mysql.escape(req.body.email);
    let passphrase = mysql.escape(req.body.passphrase);

    // Check to see if email exists in database
    try {
      let results = await getUserInfoByEmail(email, pool);
      if (results.length > 0) {
        //If database already contains username, notify user
        return res.status(403).send({
          error: 'Email already exists in database',
        });
      } else {
        // Hash password
        return bcrypt.hash(passphrase, config.saltRounds, async (err, hash) => {
          if (err) {
            return res.status(500).send({
              error: 'Bcrypt error',
            });
          } else {
            // Do SQL stuff with created hash
            try {
              await addUserToDatabase(name, email, hash, pool);
              return res.status(201).send({
                name: name,
                email: email,
              });
            } catch (error) {
              return res.status(500).send({
                error: 'Database error',
              });
            }
          }
        });
      }
    } catch (error) {
      return res.status(500).send({
        error: 'Database error',
      });
    }
  }
});

// Logs in the user with the supplied credentials
router.post('/login', async (req, res) => {
  //If request body has an invalid number of properties, err 400 and send message
  if (Object.keys(req.body).length != 2) {
    return res.status(400).send({
      error:
        'The request object does not contain the correct number of attributes',
    });
    //If request body has undefined necessary properties, err 400 and send message
  } else if (req.body.email == undefined || req.body.passphrase == undefined) {
    return res.status(400).send({
      error:
        'The request object is missing at least one of the required attributes',
    });
    // Otherwise, we've got a properly formed request body
  } else {
    // Escape check data for security things
    let email = mysql.escape(req.body.email);
    let passphrase = mysql.escape(req.body.passphrase);
    // Grab connection from pool
    let pool = req.app.get('mysql_pool');
    let config = req.app.get('config');

    try {
      //Check to see if email exists in database
      let results = await getUserInfoByEmail(email, pool);
      if (results.length > 0) {
        // Check password
        const isMatch = await bcrypt.compare(
          passphrase,
          results[0].employerPassword
        );
        // Send error if invalid password
        if (!isMatch) {
          return res.status(400).send({
            error: 'Invalid password',
          });
        }
        // Create payload for JWT from database query
        const payload = {
          user: {
            id: results[0].employerID,
            email: email,
            name: results[0].employerName,
          },
        };
        // Create JWT and returns it to the user.
        return jwt.sign(
          payload,
          config.jwtSecret,
          { expiresIn: '15m' },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
        // Handle invalid email error
      } else {
        return res.status(404).send({
          error: 'User does not exist',
        });
      }
      // Catch errors returned by promises.
    } catch (error) {
      return res.status(500).send({
        error: 'Database error',
      });
    }
  }
});

// Read employers by ID
router.get('/:employerID', auth, function (req, res) {
  // Grab connection from pool
  let pool = req.app.get('mysql_pool');
  // Escape employee ID
  let employerID = mysql.escape(req.params.employerID);
  // Write query
  let sql =
    'SELECT employerID, employerName, employerEmail FROM Employers WHERE employerID = ' +
    employerID +
    ';';
  pool.query(sql, function (error, results) {
    // Report database connection errors
    if (error) {
      return res.status(500).send({
        error: 'Database error',
      });
    } else {
      // No results
      if (results[0] == undefined) {
        return res.status(404).send({
          error: 'User does not exist',
        });
        // Results
      } else {
        return res.status(200).send({
          id: results[0].employerID,
          name: results[0].employerName,
          email: results[0].employerEmail,
        });
      }
    }
  });
});

// Update employer by ID
router.put('/:employerID', auth, async function (req, res) {
  // Grab connection from pool
  let pool = req.app.get('mysql_pool');
  let config = req.app.get('config');
  // Check for proper length of body
  if (Object.keys(req.body).length != 3) {
    return res.status(400).send({
      error:
        'The request object does not contain the correct number of attributes',
    });
    // If request body has undefined necessary properties, err 400 and send message
  } else if (
    req.body.name == undefined ||
    req.body.email == undefined ||
    req.body.passphrase == undefined
  ) {
    return res.status(400).send({
      error:
        'The request object is missing at least one of the required attributes',
    });
    // Otherwise, we've got a properly formed request body
  } else {
    // Escape data
    let employerID = mysql.escape(req.params.employerID);
    let employerName = mysql.escape(req.body.name);
    let employerEmail = mysql.escape(req.body.email);
    let employerPassword = mysql.escape(req.body.passphrase);
    try {
      // Get info by ID to ensure user exists
      let result = await getUserInfoByID(employerID, pool);
      if (result.length > 0) {
        // Hash password
        bcrypt.hash(employerPassword, config.saltRounds, (err, hash) => {
          // Do SQL stuff with created hash
          var sql =
            'UPDATE Employers SET employerName=' +
            employerName +
            ', employerEmail=' +
            employerEmail +
            ", employerPassword='" +
            hash +
            "' WHERE employerID=" +
            employerID +
            ';';
          pool.query(sql, function (error, results, fields) {
            // Report database connection errors
            if (error) {
              return res.status(500).send({
                error: 'Database error.',
              });
              // Send status reflecting updated account.
            } else {
              return res.status(200).send({
                msg: 'Account updated',
              });
            }
          });
        });
        // Handle invalid ID (No user with given ID exists)
      } else {
        return res.status(404).send({
          error: 'User does not exist',
        });
      }
      // Catch promise rejection
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        error: 'Database error',
      });
    }
  }
});

// Delete employer by ID
router.delete('/:employerID', auth, async function (req, res) {
  // Grab connection from pool
  let pool = req.app.get('mysql_pool');
  // Escape employee ID
  let employerID = mysql.escape(req.params.employerID);
  try {
    // Get user info by ID to ensure user exists
    let result = await getUserInfoByID(employerID, pool);
    if (result.length > 0) {
      // Write query
      var sql = 'DELETE FROM Employers WHERE employerID = ' + employerID + ';';
      pool.query(sql, function (error, results, fields) {
        // Report database connection errors
        if (error) {
          console.log(error);

          return res.status(500).send({
            error: 'Database error with delete',
          });
          // Send account status to user
        } else {
          return res.status(202).send({
            msg: 'Account deleted',
          });
        }
      });
      // No data, user does not exist
    } else {
      return res.status(404).send({
        error: 'User does not exist',
      });
    }
    // Handle database errors from rejected promise
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error: 'Database error with find',
    });
  }
});

module.exports = router;
