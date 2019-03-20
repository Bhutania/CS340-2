INSERT INTO `student` (`id`, `name`, `major`, `building`)
VALUES (`:sid`,`:sname`,`:smajor`,`sbuilding`);

INSERT INTO `professor` (`id`, `name`,`college`,`tenured`, `building`, `boss`)
VALUES (`:pid`, `:pname`,`:pcollege`,`:ptenured`, `:pbuilding`, `:pboss`);

INSERT INTO `class` (`course_id`, `course_name`, `college`, `professor`,`building_name`)
VALUES (`:ccourse_id`, `:ccourse_name`, `:ccollege`, `:cprofessor`,`:cbuilding_name`);

INSERT INTO `students_classes` (`student_id`,`class_id`)
VALUES (`:sid`,`:ccorse_id`);

INSERT INTO `buildings` (`name`,`rooms`)
VALUES (`:bnameInput`, `:brooms`);

-- used in project:
--students.js
--Get classes
SELECT C.course_name AS Name, C.course_id AS id FROM class C INNER JOIN students_classes SC ON SC.class_id = C.course_id WHERE SC.student_id = ?

--get  all students
SELECT S.id as id, S.name AS Name, S.major AS Major, S.building AS Building FROM student S

-- get student 
SELECT S.id AS id, S.name AS name, S.major AS major, S.building AS building FROM student S WHERE S.id = ?

-- get buildings
SELECT B.name as Name FROM buildings B

-- get classes
SELECT C.course_name as Name, C.course_id AS id FROM class C

--delete student classes
DELETE FROM students_classes WHERE student_id = ?

--Post /
INSERT INTO student (name, major, building) VALUES (?, ?, ?)

-- Post /AddCourse
INSERT INTO students_classes VALUES (?, ?)

--Post /Modify
UPDATE student SET name = ?, major = ?, building = ? WHERE id = ?

--delete student
DELETE FROM student WHERE student.id = ?

-- delete student and class
DELETE FROM students_classes WHERE student_id = ? AND class_id = ?

-- ------ Professors --------
--get all profs
SELECT P.id as id, P.name AS name, P.college AS college, P.tenured AS tenured, P.building as building, P.boss AS boss FROM professor P

--get professor
SELECT P.id as id, P.name AS name, P.college AS college, P.tenured AS tenured, P.building as building, P.boss AS boss FROM professor P  WHERE P.id = ?

--remove professor classes
UPDATE class SET professor = NULL WHERE professor = ?

--post /
INSERT INTO professor (name, college, tenured, building, boss) VALUES (?, ?, ?, ?, ?)

--post /Classes
UPDATE class SET professor = ? WHERE course_id = ?

--delete /:pid  removeProfessorClasses +
DELETE FROM professor WHERE id = ?

--delete /:cid/:pid
UPDATE class SET professor = NULL WHERE course_id=?

-- --------- Classes ------------------
-- getClasses
SELECT C.course_name AS name, C.college AS college, P.name AS professor, C.building_name AS location FROM class C INNER JOIN professor P ON P.id = C.professor

--getClass
SELECT C.course_id AS id, C.course_name AS name, C.college AS college, P.name AS professor, C.building_name AS location FROM class C LEFT JOIN professor P ON P.id = C.professor WHERE C.course_id = ?

--deleteStudentClasses
DELETE FROM students_classes WHERE class_id = ?

--getClassesLike
SELECT C.course_id AS id, C.course_name AS name, C.college AS college, P.name AS professor, C.building_name AS location FROM class C LEFT JOIN professor P ON P.id = C.professor WHERE C.course_name LIKE + mysql.pool.escape(req.params.id + '%')

-- add class
INSERT INTO class (course_name, college, professor, building_name) VALUES (?, ?, ?, ?)

--modify id
UPDATE class SET course_name = ?, college = ?, professor = ?, building_name = ? WHERE course_id = ?

--delete class
DELETE FROM class WHERE course_id = ?

-- ----------- Buildings -----------------
--removeBuildingStudent
UPDATE student SET building = NULL WHERE building= ?

--removeBuildingProfessor
UPDATE professor SET building = NULL WHERE building= ?

--removeBuildingClass
UPDATE class SET building_name = NULL WHERE building_name = ?

--Add building
INSERT INTO buildings (name, rooms) VALUES (?, ?)

--delete building
DELETE FROM buildings WHERE name = ?




