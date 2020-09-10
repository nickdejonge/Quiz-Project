const database = {
  host: 'classmysql.engr.oregonstate.edu',
  user: 'cs467_group1',
  password: '3FfEpiDsJoX60BVp',
  database: 'cs467_group1',
  connectionLimit: 20,
};

const timezone = 'America/Los_Angeles';
const saltRounds = 10;
const jwtSecret = 'teamQuizSecret';
const email = 'programming.quiz.team@gmail.com';
const password = '3FfEpiDsJoX60BVp';

module.exports = {
  database: database,
  saltRounds: saltRounds,
  jwtSecret: jwtSecret,
  email: email,
  password: password,
  timezone: timezone,
};
