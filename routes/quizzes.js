const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const auth = require('../middleware/auth');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
router.use(bodyParser.json());

async function addQuizKey(key, id, pool) {
  return new Promise((resolve, reject) => {
    let query =
      'INSERT INTO `QuizKeys`(`keyID`, `quizID`) VALUES (' +
      key +
      ', ' +
      id +
      ');';
    pool.query(query, function (error, results) {
      // Report database connection errors
      return error ? reject(error) : resolve(results);
    });
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

async function getQuizByEmployerID(id, pool) {
  return new Promise((resolve, reject) => {
    let query =
      'SELECT `quizID`, `quizName`, `quizTimeLimit`, `quizQuestions` FROM `Quizzes` WHERE employerID = ' +
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

// Add a quiz to the database
async function addQuizToDatabase(name, time, questions, id, pool) {
  return new Promise((resolve, reject) => {
    let query =
      'INSERT INTO `Quizzes`(`quizName`, `quizTimeLimit`, `quizQuestions`, `employerID`) VALUES (' +
      name +
      ', ' +
      time +
      ', ' +
      questions +
      ', ' +
      id +
      ');';
    pool.query(query, function (error, results, fields) {
      //Report database connection errors
      if (error) {
        return reject(error);
      } else {
        return resolve(results);
      }
    });
  });
}

// Adds a quiz to the database
async function editQuiz(name, time, questions, id, pool) {
  return new Promise((resolve, reject) => {
    let query =
      'UPDATE `Quizzes` SET `quizName` = ' +
      name +
      ', `quizTimeLimit` = ' +
      time +
      ', `quizQuestions` = ' +
      questions +
      ' WHERE `quizID` = ' +
      id +
      ';';
    pool.query(query, function (error, results, fields) {
      //Report database connection errors
      if (error) {
        return reject(error);
      } else {
        return resolve(results);
      }
    });
  });
}

// Delete a quiz
async function deleteQuizByID(id, pool) {
  return new Promise((resolve, reject) => {
    let query = 'DELETE FROM `Quizzes` WHERE quizID = ' + id + ';';
    pool.query(query, function (error, results, fields) {
      //Report database connection errors
      if (error) {
        return reject(error);
      } else {
        return resolve(true);
      }
    });
  });
}

// Get all keys of a quiz
async function getKeys(id, pool) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM `QuizKeys` WHERE quizID = ' + id + ';';
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

// Delete a key
async function deleteKey(id, pool) {
  return new Promise((resolve, reject) => {
    let query = 'DELETE FROM `QuizKeys` WHERE keyID = ' + id + ';';
    pool.query(query, function (error, results, fields) {
      //Report database connection errors
      if (error) {
        return reject(error);
      } else {
        return resolve(true);
      }
    });
  });
}

// Check if key exists
async function checkKeyExist(key, pool) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM `QuizKeys` WHERE keyID = ' + key + ';';
    pool.query(query, function (error, results, fields) {
      //Report database connection errors
      if (error) {
        return reject(error);
      } else {
        return resolve(results);
      }
    });
  });
}

// Get candidate by id
async function getCandidate(id, pool) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM `Candidates` WHERE candidateID = ' + id + ';';
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
router.post('/:employerID/quizzes', auth, async (req, res, next) => {
  // If request body has an invalid number of properties, err 400 and send message
  if (Object.keys(req.body).length != 3) {
    return res.status(400).send({
      error:
        'The request object does not contain the correct number of attributes',
    });
    //If request body has undefined necessary properties, err 400 and send message
  } else if (
    req.body.name == undefined ||
    req.body.time == undefined ||
    req.body.questions == undefined
  ) {
    return res.status(400).send({
      error:
        'The request object is missing at least one of the required attributes',
    });
    //Otherwise, we've got a properly formed request body
  } else if (parseInt(req.body.time, 10) <= 0) {
    return res.status(400).send({
      error: 'Invalid time',
    });
  } else {
    // Check questions
    // console.log(req.body.questions);
    // const qs = req.body.questions.map(q, q.JSON.parse);
    const qs = req.body.questions;
    for (q in qs) {
      if (
        qs[q].question == undefined ||
        qs[q].correct == undefined ||
        qs[q].answers == undefined
      ) {
        return res.status(400).send({
          error:
            'The question objects does not contain the correct number of attributes',
        });
      } else if (
        isNaN(parseInt(qs[q].correct, 10)) ||
        qs[q].answers.length <= 0 ||
        parseInt(qs[q].correct, 10) > qs[q].answers.length - 1
      ) {
        return res.status(400).send({
          error: 'Invalid answers',
        });
      }
    }

    // Grab connection from pool
    const pool = req.app.get('mysql_pool');

    //Escape data for security things
    const name = mysql.escape(req.body.name);
    const time = mysql.escape(req.body.time);
    const questions = mysql.escape(JSON.stringify(req.body.questions));
    const id = mysql.escape(req.params.employerID);

    // Add quiz to database
    try {
      await addQuizToDatabase(name, time, questions, id, pool);
      return res.status(201).send({
        name: name,
        time: time,
        questions: questions,
      });
    } catch (error) {
      return res.status(500).send({
        error: 'Database error',
      });
    }
  }
});

// Get all quizzes belong to this user
router.get('/:employerID/quizzes', auth, async (req, res, next) => {
  // Grab connection from pool
  const pool = req.app.get('mysql_pool');
  const id = mysql.escape(req.params.employerID);
  // Find quizes
  try {
    const results = await getQuizByEmployerID(id, pool);
    return res.status(200).send(results);
  } catch (error) {
    return res.status(500).send({
      error: 'Database error',
    });
  }
});

// Get quiz by id
router.get('/:employerID/quizzes/:quizID', auth, async (req, res, next) => {
  // Grab connection from pool
  const pool = req.app.get('mysql_pool');
  const id = mysql.escape(req.params.quizID);
  // Find quiz
  try {
    const results = await getQuizByID(id, pool);
    if (results[0].employerID !== parseInt(req.params.employerID, 10)) {
      return res.status(401).send({
        error: 'This quiz belongs to another user',
      });
    } else {
      const quiz = {
        quizName: results[0].quizName,
        quizTimeLimit: results[0].quizTimeLimit,
        quizQuestions: results[0].quizQuestions,
      };
      return res.status(200).send(quiz);
    }
  } catch (error) {
    return res.status(500).send({
      error: 'Database error',
    });
  }
});

// Edit quiz
router.put('/:employerID/quizzes/:quizID', auth, async (req, res, next) => {
  // Find quiz
  // Grab connection from pool
  const pool = req.app.get('mysql_pool');
  const id = mysql.escape(req.params.quizID);
  try {
    const results = await getQuizByID(id, pool);
    if (results[0].employerID !== parseInt(req.params.employerID, 10)) {
      return res.status(401).send({
        error: 'This quiz belongs to another user',
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: 'Database error',
    });
  }
  // If request body has an invalid number of properties, err 400 and send message
  if (Object.keys(req.body).length != 3) {
    return res.status(400).send({
      error:
        'The request object does not contain the correct number of attributes',
    });
    //If request body has undefined necessary properties, err 400 and send message
  } else if (
    req.body.name == undefined ||
    req.body.time == undefined ||
    req.body.questions == undefined
  ) {
    return res.status(400).send({
      error:
        'The request object is missing at least one of the required attributes',
    });
    //Otherwise, we've got a properly formed request body
  } else if (parseInt(req.body.time, 10) <= 0) {
    return res.status(400).send({
      error: 'Invalid time',
    });
  } else {
    const qs = req.body.questions;
    // Check questions
    for (q in qs) {
      if (
        qs[q].question == undefined ||
        qs[q].correct == undefined ||
        qs[q].answers == undefined
      ) {
        return res.status(400).send({
          error:
            'The question objects does not contain the correct number of attributes',
        });
      } else if (
        qs[q].answers.length <= 0 ||
        parseInt(qs[q].correct, 10) > qs[q].answers.length - 1
      ) {
        return res.status(400).send({
          error: 'Invalid answers',
        });
      }
    }

    //Escape data for security things
    const name = mysql.escape(req.body.name);
    const time = mysql.escape(req.body.time);
    const questions = mysql.escape(JSON.stringify(req.body.questions));

    // Add quizz to database
    try {
      await editQuiz(name, time, questions, id, pool);
      return res.status(200).send({
        name: name,
        time: time,
        questions: questions,
      });
    } catch (error) {
      return res.status(500).send({
        error: 'Database error',
      });
    }
  }
});

// Delete quiz
router.delete('/:employerID/quizzes/:quizID', auth, async (req, res, next) => {
  // Find quiz
  // Grab connection from pool
  const pool = req.app.get('mysql_pool');
  const id = mysql.escape(req.params.quizID);
  try {
    const results = await getQuizByID(id, pool);
    if (results[0].employerID !== parseInt(req.params.employerID, 10)) {
      return res.status(401).send({
        error: 'This quiz belongs to another user',
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: 'Database error',
    });
  }

  // Delete quiz
  try {
    const result = await deleteQuizByID(id, pool);
    if (result) {
      return res.status(200).send({
        msg: 'Quiz deleted',
      });
    } else {
      return res.status(500).send({
        error: 'Database error',
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: 'Database error',
    });
  }
});

// Generate quizKey
router.post(
  '/:employerID/quizzes/:quizID/quizKeys',
  auth,
  async (req, res, next) => {
    // If request parameters has an invalid number of properties, err 400 and send message
    if (Object.keys(req.params).length != 2) {
      return res.status(400).send({
        error:
          'The request object does not contain the correct number of attributes',
      });
      //If request body has undefined necessary properties, err 400 and send message
    } else if (
      !Number.isInteger(parseInt(req.params.employerID)) ||
      !Number.isInteger(parseInt(req.params.quizID))
    ) {
      return res.status(400).send({
        error: 'The request object is malformed',
      });
      //Otherwise, we've got a properly formed request body
    } else {
      // Grab connection from pool
      const pool = req.app.get('mysql_pool');
      // Escape data for security things
      const quizID = mysql.escape(req.params.quizID);
      let exist = true;
      let quizKey = '';
      let key = '';
      // Generate key
      while (exist) {
        quizKey = uuidv4();
        // Check if key already exist
        key = mysql.escape(quizKey);
        try {
          let result = await checkKeyExist(key, pool);
          if (result.length <= 0) {
            exist = false;
          }
        } catch (error) {
          return res.status(500).send({
            error: 'Database error',
          });
        }
      }
      try {
        await addQuizKey(key, quizID, pool);
      } catch (error) {
        return res.status(500).send({
          error: 'Database error',
        });
      }
      return res.status(201).send({
        key: quizKey,
      });
    }
  }
);

// Get all keys for a quiz
router.get(
  '/:employerID/quizzes/:quizID/keys',
  auth,
  async (req, res, next) => {
    // Grab connection from pool
    const pool = req.app.get('mysql_pool');
    const id = mysql.escape(req.params.quizID);
    let finalKeys = [];
    // Find quizes
    try {
      const keys = await getKeys(id, pool);
      for (key in keys) {
        let candidates = await getCandidate(keys[key].candidateID, pool);
        let candidateEmail = null;
        if (candidates.length > 0) {
          candidateEmail = candidates[0].candidateEmail;
        }
        let k = {
          keyID: keys[key].keyID,
          candidateEmail: candidateEmail,
        };
        finalKeys.push(k);
      }
      return res.status(200).send(finalKeys);
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        error: 'Database error',
      });
    }
  }
);

// Delete key
router.delete(
  '/:employerID/quizzes/:quizID/keys/:keyID',
  auth,
  async (req, res, next) => {
    // Find quiz
    // Grab connection from pool
    const pool = req.app.get('mysql_pool');
    const id = mysql.escape(req.params.keyID);
    try {
      const results = await checkKeyExist(id, pool);
      if (results.length > 0) {
        const result = await deleteKey(id, pool);
        if (result) {
          return res.status(200).send({
            msg: 'Key deleted',
          });
        } else {
          return res.status(500).send({
            error: 'Database error',
          });
        }
      } else {
        return res.status(404).send({
          error: 'This key does not exist',
        });
      }
    } catch (error) {
      return res.status(500).send({
        error: 'Database error',
      });
    }
  }
);

module.exports = router;
