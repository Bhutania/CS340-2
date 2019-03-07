var express = require('express');
var router = express.Router();

//screen multiplexer

function getStudentClasses(res, mysql, context, id, complete) {
    var sql = "SELECT C.course_name AS Name, C.course_id AS `Course Reference Number` FROM class C INNER JOIN students_classes SC ON SC.class_id = C.course_id WHERE SC.student_id = ?"
    var inserts = [id];
    mysql.pool.query(sql, inserts, function(error, results, fields) {
        if(error) {
            res.write(JSON.stringify(error));
            res.end();  
        }
        else {
            context.classes = results[0];
            complete();
        }
    });
}


function getStudents(res, mysql, context, complete) {
    var sql = "SELECT S.name AS Name, S.major AS Major, S.building AS Building FROM student S"
    mysql.pool.query(sql, function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        else {
        context.students = results;
        complete();
        }
    });
}

function getStudent(res, mysql, context, id, complete) {
    sql = "SELECT S.id AS id, S.name AS name, S.major AS major, S.building AS building FROM student S WHERE S.id = ?";
    insert = [id];
    mysql.pool.query(sql, insert, function(error, results, fields){
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        } 
        else {
        context.student = results[0];
        complete();
        }
    });
}

function getBuildings(res, mysql, context, complete) {
    var sql = "SELECT B.name as Name FROM buildings B"
    mysql.pool.query(sql, function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        else {
        context.buildings = results;
        complete();
        }
    });
}

function getClasses(res, mysql, id, context, complete) {
    sql = "SELECT SC.student_id as student_id, SC.class_id as id, C.course_name as Name FROM students_classes SC INNER JOIN class C ON C.course_id = SC.class_id WHERE student_id = ?";
    insert = [id];
    mysql.pool.query(sql, insert, function(error, results, fields){
        if(error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        else {
        context.class = results;
        complete();
        }
    })
}


router.get('/', function(req, res){
    var callbackCount = 0;
    var context = {};
    // context.jsscripts
    var mysql = req.app.get('mysql');
    getStudents(res, mysql, context, complete);
    getBuildings(res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >=2){
            res.render('students', context);
        }
    }
});

    /* Display one person for the specific purpose of updating people */

router.get('/login', function(req, res){
    callbackCount = 0;
    var context = {};
    var mysql = req.app.get('mysql');
    getStudentClasses(res, mysql, context, req.query.student_login_id_value, complete);
    getStudent(res, mysql, context, req.query.student_login_id_value, complete);
    getClasses(res, mysql, req.query.student_login_id_value, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 3){
            res.render('student-page', context);
        }
    }
});

console.log("test");
router.post('/', function(req, res){
    console.log('test1');
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO student (name, major, building) VALUES (?, ?, ?)";
    var inserts = [req.body.student_signup_name, req.body.student_signup_major, req.body.student_signup_building];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error));
            res.write(JSON.stringify(error));
            res.end();
        }
        else {
            console.log('test2');
            res.redirect('/students');
        }
    });
});
console.log("test3");
module.exports = router;