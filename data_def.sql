START TRANSACTION;

DROP TABLE IF EXISTS Candidates;
DROP TABLE IF EXISTS Employers;
DROP TABLE IF EXISTS Quizzes;
DROP TABLE IF EXISTS QuizKeys;
CREATE TABLE Employers (
    employerID INT(11) NOT NULL AUTO_INCREMENT,
    employerName VARCHAR(255) NOT NULL,
	employerEmail VARCHAR(255) NOT NULL,
	employerPassword VARCHAR(255) NOT NULL, 
    PRIMARY KEY(employerID)
);
CREATE TABLE Candidates (
    candidateID INT(11) NOT NULL AUTO_INCREMENT,
	candidateEmail VARCHAR(255),
    PRIMARY KEY(candidateID)
);
CREATE TABLE Quizzes (
    quizID INT(11) NOT NULL AUTO_INCREMENT,
    quizName VARCHAR(255) NOT NULL,
    quizTimeLimit INT,
    quizQuestions TEXT,
    employerID INT(11) NOT NULL,
    FOREIGN KEY(employerID) REFERENCES Employers(employerID),
    PRIMARY KEY(quizID)
);
CREATE TABLE QuizKeys (
    keyID VARCHAR(36) NOT NULL UNIQUE,
    quizID INT(11) NOT NULL,
	candidateID INT(11),
    quizAnswers TEXT,
    quizScore FLOAT,
    quizStart TIMESTAMP,
    quizFinish TIMESTAMP,
    PRIMARY KEY(keyID),
    FOREIGN KEY(candidateID) REFERENCES Candidates(candidateID) ON DELETE CASCADE,
    FOREIGN KEY(quizID) REFERENCES Quizzes(quizID) ON DELETE CASCADE
);

COMMIT;