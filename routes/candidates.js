const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
router.use(bodyParser.json());
const config = require('../config/config');
const e = require('express');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email,
    pass: config.password,
  },
});

/* ROUTES */
router.patch('/startquiz', async (req, res) => {
  // If request body has an invalid number of properties, err 400 and send message
  if (Object.keys(req.body).length != 2) {
    return res.status(400).send({
      error:
        'The request object does not contain the correct number of attributes',
    });
    // If request body has undefined necessary properties, err 400 and send message
  } else if (req.body.email == undefined || req.body.key == undefined) {
    return res.status(400).send({
      error:
        'The request object is missing at least one of the required attributes',
    });
    // Otherwise, we've got a properly formed request body
  } else {
    // Grab connection from pool
    let pool = req.app.get('mysql_pool');
    // Escape data for security things
    let email = mysql.escape(req.body.email);
    let key = mysql.escape(req.body.key);
    // Check to see if key has been used before
    try {
      let results = await getQuizKeyInfo(key, pool);
      if (results.length > 0) {
        //If database already contains an id, notify user
        if (results[0].candidateID != null) {
          return res.status(403).send({
            error: 'Key has already been used.',
          });
        } else {
          let quizID = results[0].quizID;
          let candidates = null;
          try {
            // Check if candidate exists
            candidates = await getCandidate(email, pool);
            if (candidates.length <= 0) {
              // Create candidate
              await addCandidate(email, pool);
              candidates = await getCandidate(email, pool);
            }
            let candidateID = candidates[0].candidateID;
            // Try to update key with an email
            await updateQuizKeyWithCandidateID(key, candidateID, pool);
            return res.status(200).send({
              key: req.body.key,
              candidateID: candidateID,
              quizID: quizID,
            });
          } catch (error) {
            return res.status(500).send({
              error: 'Database error',
            });
          }
        }
      } else {
        return res.status(404).send({
          error: 'Key does not exist',
        });
      }
    } catch (error) {
      return res.status(500).send({
        error: 'Database error',
      });
    }
  }
});

// Get quiz by id
router.get('/:candidateID/quizzes/:quizID', async (req, res, next) => {
  // Grab connection from pool
  const pool = req.app.get('mysql_pool');
  const id = mysql.escape(req.params.quizID);
  // Find quiz
  try {
    const results = await getQuizByID(id, pool);
    if (results.length > 0) {
      const quiz = {
        quizName: results[0].quizName,
        quizTimeLimit: results[0].quizTimeLimit,
        quizQuestions: results[0].quizQuestions,
      };
      // Update quizScore

      return res.status(200).send(quiz);
    } else {
      return res.status(404).send({
        error: 'This quiz does not exist',
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: 'Database error',
    });
  }
});

// Update end time
router.put('/:candidateID/quizzes/:quizID', async (req, res, next) => {
  // If request body has an invalid number of properties, err 400 and send message
  if (req.body.answers == undefined || req.body.key == undefined) {
    return res.status(400).send({
      error:
        'The request object is missing at least one of the required attributes',
    });
    // Otherwise, we've got a properly formed request body
  } else {
    // Grab connection from pool
    const pool = req.app.get('mysql_pool');
    const key = mysql.escape(req.body.key);
    const answers = mysql.escape('[' + req.body.answers.map(String) + ']');
    const quizID = mysql.escape(req.params.quizID);
    const score = await calculateScore(quizID, pool, req.body.answers);
    // Find quiz
    try {
      const results = await getQuizKeyInfo(key, pool);
      if (results.length > 0) {
        await updateQuizEndTimeAndScore(key, answers, score, pool);
        // Email employer
        await emailEmployer(quizID, key, pool);
        return res.status(200).send({
          msg: 'Updated',
        });
      } else {
        return res.status(404).send({
          error: 'Key does not exist',
        });
      }
    } catch (error) {
      return res.status(500).send({
        error: 'Database error',
      });
    }
  }
});

module.exports = router;

// Utility functions

// Fetches quiz key info by key - returns it or an error.
async function getQuizKeyInfo(key, pool) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM `QuizKeys` WHERE keyID = ' + key + ';';
    //If database error, return rejection with error, otherwise return resolution with results.
    pool.query(query, (error, results) =>
      error ? reject(error) : resolve(results)
    );
  });
}

async function addCandidate(email, pool) {
  return new Promise((resolve, reject) => {
    let query =
      'INSERT INTO `Candidates`(`candidateEmail`) VALUES (' + email + ');';
    //If database error, return rejection with error, otherwise return resolution with results.
    pool.query(query, (error, results) =>
      error ? reject(error) : resolve(results)
    );
  });
}

async function getCandidate(email, pool) {
  return new Promise((resolve, reject) => {
    let query =
      'SELECT * FROM `Candidates` WHERE candidateEmail = ' + email + ';';
    //If database error, return rejection with error, otherwise return resolution with results.
    pool.query(query, (error, results) =>
      error ? reject(error) : resolve(results)
    );
  });
}

async function getQuizByID(id, pool) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM `Quizzes` WHERE quizID = ' + id + ';';
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

async function updateQuizKeyWithCandidateID(key, id, pool) {
  return new Promise((resolve, reject) => {
    let query =
      'UPDATE QuizKeys SET candidateID=' +
      id +
      ', quizStart=UTC_TIMESTAMP() WHERE keyID=' +
      key +
      ';';
    //If database error, return rejection with error, otherwise return resolution with results.
    pool.query(query, (error, results) =>
      error ? reject(error) : resolve(results)
    );
  });
}

async function updateQuizEndTimeAndScore(key, quizAnswers, score, pool) {
  return new Promise((resolve, reject) => {
    let query =
      'UPDATE QuizKeys SET quizFinish=UTC_TIMESTAMP()' +
      ', quizAnswers=' +
      quizAnswers +
      ', quizScore=' +
      score +
      ' WHERE keyID=' +
      key +
      ';';
    //If database error, return rejection with error, otherwise return resolution with results.
    pool.query(query, (error, results) =>
      error ? reject(error) : resolve(results)
    );
  });
}

// Calculate score
async function calculateScore(id, pool, answers) {
  let score = 0;
  if (answers) {
    const results = await getQuizByID(id, pool);
    const questions = JSON.parse(results[0].quizQuestions);
    for (q in questions) {
      if (answers[q] == questions[q].correct) {
        score += 1;
      }
    }
    return score / questions.length;
  } else {
    return null;
  }
}

// Email employer
async function emailEmployer(quizID, key, pool) {
  const employer = await getEmployerFromQuizID(quizID, pool);
  const employerEmail = employer[0].employerEmail;
  const candidate = await getCandidateFromKey(key, pool);
  const candidateEmail = candidate[0].candidateEmail;
  const mailOptions = {
    from: employerEmail,
    to: employerEmail,
    subject:
      'Result of ' + employer[0].quizName + ' from Candidate ' + candidateEmail,
    text:
      'Quiz Score: ' +
      candidate[0].quizScore * 100 +
      '%.\nPlease login to your Programming Quiz account to view detail result.',
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return error;
    } else {
      return 'Email sent: ' + info.response;
    }
  });
}

async function getEmployerFromQuizID(id, pool) {
  return new Promise((resolve, reject) => {
    let query =
      'SELECT * FROM `Quizzes` INNER JOIN `Employers` ON Quizzes.employerID = Employers.employerID WHERE quizID = ' +
      id +
      ';';
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

async function getCandidateFromKey(key, pool) {
  return new Promise((resolve, reject) => {
    let query =
      'SELECT * FROM `Candidates` INNER JOIN `QuizKeys` ON Candidates.candidateID = QuizKeys.candidateID WHERE keyID = ' +
      key +
      ';';
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
