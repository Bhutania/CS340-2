var express = require('express');
var router = express.Router();

//screen multiplexer

function getStudentClasses(res, mysql, context, id, complete) {
    var sql = "SELECT C.course_name AS Name, C.course_id AS id FROM class C INNER JOIN students_classes SC ON SC.class_id = C.course_id WHERE SC.student_id = ?"
    var inserts = [id];
    mysql.pool.query(sql, inserts, function(error, results, fields) {
        if(error) {
            res.write(JSON.stringify(error));
            res.end();  
        }
        else {
            context.classes = results;
            complete();
        }
    });
}


function getStudents(res, mysql, context, complete) {
    var sql = "SELECT S.id as id, S.name AS Name, S.major AS Major, S.building AS Building FROM student S"
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
    var sql = "SELECT C.course_name as Name, C.course_id AS id FROM class C";
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

function deleteStudentClasses(res, mysql, id, complete) {
    var sql = "DELETE FROM students_classes WHERE student_id = ?"
    var inserts = [id];
    mysql.pool.query(sql, inserts, function(error, results, fields) {
        if(error) {
            console.log(error);
            res.write(JSON.stringify(error));
            res.end();
        } else {
            complete();
        }
    });
}

router.get('/', function(req, res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["deleteStudent.js"];
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
    context.jsscripts = ["deleteSC.js"];
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

router.post('/', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO student (name, major, building) VALUES (?, ?, ?)";
    var inserts = [req.body.student_signup_name, req.body.student_signup_major, req.body.student_signup_building];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        else {
            res.redirect('/students');
        }
    });
});

router.post('/AddCourse', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO students_classes VALUES (?, ?)"
    var inserts = [req.body.student_id, req.body.course_id]
    sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.redirect('/students/login?student_login_id_value=' + req.body.student_id);
        }
    });
});

router.post('/Modify', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = 'UPDATE student SET name = ?, major = ?, building = ? WHERE id = ?'
    var inserts = [req.body.student_name, req.body.student_major, req.body.stu_residence, req.body.student_id];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.redirect('/students/login?student_login_id_value=' + req.body.student_id);
        }
    })
})

router.delete('/:id', function(req, res){
    var callbackCount = 0;
    var mysql = req.app.get('mysql');
    deleteStudentClasses(res, mysql, req.params.id, complete);
    var sql = "DELETE FROM student WHERE student.id = ?"
    var inserts = [req.params.id];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.status(400);
            res.end();
        } else {
            complete();
        }
    });
    function complete() {
        callbackCount++;
        if(callbackCount>=2) {
            res.status(202).end();
        }
    }
});

router.delete('/login/:cid/:sid', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "DELETE FROM students_classes WHERE student_id = ? AND class_id = ?"
    var inserts = [req.params.sid,req.params.cid];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
        if (error) {
            console.log(error);
            res.write(JSON.stringify(error));
            res.status(400);
            res.end();
        } else {
            res.status(202).end();
        }
    });
});
module.exports = router;