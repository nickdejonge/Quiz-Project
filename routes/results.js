const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const auth = require('../middleware/auth');
const bodyParser = require('body-parser');
const moment = require('moment-timezone');
router.use(bodyParser.json());

// ROUTES

// Get quiz results by key
router.get('/:employerID/quizResult/:key', auth, async (req, res, next) => {
  const pool = req.app.get('mysql_pool');
  const key = mysql.escape(req.params.key);
  try {
    const results = await getQuizQuestionsAndAnswersByKey(key, pool);
    if (results.length <= 0) {
      return res.status(200).send({
        msg: 'Key does not exist in database',
      });
    } else {
      return res.status(200).send(results);
    }
  } catch (error) {
    return res.status(500).send({
      error: 'Database error',
    });
  }
});

// Get all quiz results by quizID
// router.get('/:employerID/allQuizResults/:quiz', auth, async (req, res, next) => {
//     const pool = req.app.get('mysql_pool');
//     const quiz = mysql.escape(req.params.quiz);
//     try {
//         const results = await getQuizKeyInfoByQuizID(quiz, pool);
//         if(results.length <= 0){
//             return res.status(200).send({
//                 msg: "Quiz does not exist in database"
//             })
//         } else {
//             return res.status(200).send(results);
//         }
//     } catch (error) {
//         return res.status(500).send({
//             error: "Database error",
//         });
//     }
// })

// Get all quiz results by employerID
router.get('/:employerID/allQuizResults', auth, async (req, res, next) => {
  const pool = req.app.get('mysql_pool');
  const employerID = mysql.escape(req.params.employerID);
  try {
    const results = await getQuizResultsInfoByEmployerID(employerID, pool);
    results.forEach((element) => {
      element.quizStart = moment(element.quizStart).format(
        'MMM Do YYYY - h:mm:ssA'
      );
      element.quizFinish = moment(element.quizFinish).format(
        'MMM Do YYYY - h:mm:ssA'
      );
    });
    return res.status(200).send(results);
  } catch (error) {
    return res.status(500).send({
      error: 'Database error',
    });
  }
});

// Utility Functions

// Fetches quiz key info by key - returns it or an error.
async function getQuizKeyInfoByKey(key, pool) {
  return new Promise((resolve, reject) => {
    let query =
      //If database error, return rejection with error, otherwise return resolution with results.
      pool.query(query, (error, results) =>
        error ? reject(error) : resolve(results)
      );
  });
}

async function getQuizQuestionsAndAnswersByKey(key, pool) {
  return new Promise((resolve, reject) => {
    let query =
      'SELECT Quizzes.quizName, Quizzes.quizTimeLimit, Quizzes.quizQuestions, ' +
      'QuizKeys.quizAnswers, ' +
      'Candidates.candidateEmail ' +
      'FROM Quizzes ' +
      'LEFT JOIN QuizKeys ON Quizzes.quizID=QuizKeys.quizID ' +
      'LEFT JOIN Candidates ON QuizKeys.candidateID=Candidates.candidateID ' +
      'WHERE QuizKeys.keyID = ' +
      key +
      ';';
    //If database error, return rejection with error, otherwise return resolution with results.
    pool.query(query, (error, results) =>
      error ? reject(error) : resolve(results)
    );
  });
}

// Fetches quiz key info by quizID - returns it or an error.
// async function getQuizKeyInfoByQuizID(quizID, pool) {
//     return new Promise((resolve, reject) => {
//         let query =
//             'SELECT * FROM `QuizKeys` WHERE quizID = ' + quizID + ';';
//         //If database error, return rejection with error, otherwise return resolution with results.
//         pool.query(query, (error, results) =>
//             (error ? reject(error) : resolve(results)));
//     });
// }

// Fetches quiz key info by employerID - returns it or an error.
async function getQuizResultsInfoByEmployerID(employerID, pool) {
  return new Promise((resolve, reject) => {
    let query =
      'SELECT Quizzes.quizID, Quizzes.quizName, ' +
      'QuizKeys.keyID, QuizKeys.quizScore, QuizKeys.quizAnswers, QuizKeys.quizStart, QuizKeys.quizFinish, ' +
      'Candidates.candidateEmail, ' +
      '(RANK() OVER (PARTITION BY QuizKeys.quizID ORDER BY QuizKeys.quizScore DESC)) as r ' + 
      'FROM Quizzes LEFT JOIN QuizKeys ON Quizzes.quizID=QuizKeys.quizID ' +
      'LEFT JOIN Candidates ON QuizKeys.candidateID=Candidates.candidateID ' +
      'WHERE Quizzes.employerID = ' +
      employerID +
      ' ' +
      'AND QuizKeys.quizScore IS NOT NULL ORDER BY Quizzes.quizName, QuizKeys.quizScore DESC, TIMESTAMPDIFF(SECOND, QuizKeys.quizStart, QuizKeys.quizFinish) ASC;';
    //If database error, return rejection with error, otherwise return resolution with results.
    pool.query(query, (error, results) =>
      error ? reject(error) : resolve(results)
    );
  });
}

module.exports = router;
