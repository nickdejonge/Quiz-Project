START TRANSACTION;
INSERT INTO `Employers` (`employerID`, `employerName`, `employerEmail`, `employerPassword`)
	VALUES
	(NULL, 'Nick', 'dejongpe@oregonstate', 'password'),
	(NULL, 'Ben', 'steelebe@oregonstate.edu', 'password'),
	(NULL, 'Thuong', 'huynhthu@oregonstate.edu', 'password');
	
INSERT INTO `Candidates` (`candidateID`, `candidateEmail`)
	VALUES
	(NULL, 'john@gmail.com'),
	(NULL, 'jane@gmail.com'),
	(NULL, 'lana@gmail.com'),
	(NULL, 'alex@gmail.com'),
	(NULL, 'sara@gmail.com'),
	(NULL, 'bill@gmail.com');
INSERT INTO `Quizzes` (`quizID`, `quizName`, `quizTimeLimit`, `quizQuestions`, `employerID`)
	VALUES
	(NULL, 'Quiz 60min', '60', '[{"question":"Test","answers":["test"],"correct":0}]', '1'),
	(NULL, 'Quiz 30min', '30', '[{"question":"Test","answers":["test"],"correct":0}]', '2'),
	(NULL, 'Quiz 15min', '15', '[{"question":"Test","answers":["test"],"correct":0}]', '3'),
	(NULL, 'Quiz Java ', '25', '[{"question":"Q1","answers":["1","2"],"correct":1},{"question":"Q2","answers":["1"],"correct":0}]' , '1'),
	(NULL, 'Quiz C/C++', '60', '[{"question":"Q1","answers":["1","2"],"correct":1},{"question":"Q2","answers":["1"],"correct":0}]' , '1'),
	(NULL, 'Quiz Easy ', '30', '[{"question":"Q1","answers":["1","2","3"],"correct":2},{"question":"Q2","answers":["1","2"],"correct":0},{"question":"Q3","answers":["1","2"],"correct":1}]' , '2'),
	(NULL, 'Quiz Hard ', '15', '[{"question":"Q1","answers":["1","2","3"],"correct":2},{"question":"Q2","answers":["1","2"],"correct":0},{"question":"Q3","answers":["1","2"],"correct":1}]' , '3');
INSERT INTO `QuizKeys` (`keyID`, `quizID`, `candidateID`, `quizAnswers`,`quizScore`, `quizStart`, `quizFinish`)
	VALUES 
	('145d8cda-5a7e-4f07-afc3-bd5d2c17cff4', '1', '1', '["0"]', '90', '2020-07-28 00:00:00', '2020-07-28 00:00:25'),
	('16ff03fa-4bfd-4e3e-8f9a-03867616a002', '2', '1', '["0"]', '100', '2020-07-28 00:00:00', '2020-07-28 00:00:25'),
	('325e9e8f-f32c-4d03-9822-94d10b9a0cd4', '3', '2', '["0"]', '66', '2020-07-28 00:00:00', '2020-07-28 00:00:25'),
	('4e6e55f7-5a4c-4e3a-990f-06bec794210a', '4', '3', '["1","0"]', '0', '2020-07-28 00:00:00', '2020-07-28 00:00:25'),
	('af59395b-4c51-4802-b689-ba3609cd193d', '5', '4', '["1","0"]', '1', '2020-07-28 00:00:00', '2020-07-28 00:00:25'),
	('e18ac54d-e23d-4285-89e6-6094d2dabb16', '6', '5', '["2","0","1"]', '95', '2020-07-28 00:00:00', '2020-07-28 00:00:25'),
	('f942c25a-a903-46d0-8367-099854be6899', '7', '6', '["2","0","1"]', '100', '2020-07-28 00:00:00', '2020-07-28 00:00:25');

COMMIT;