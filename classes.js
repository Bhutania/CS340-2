var express = require('express');
var router = express.Router();

function getClasses(res, mysql, context, complete) {
    var sql = "SELECT C.course_id AS id, C.course_name AS name, C.college AS college, P.name AS professor, C.building_name AS location FROM class C LEFT JOIN professor P ON P.id = C.professor";
    mysql.pool.query(sql, function(error, results, fields){
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        } else {
            context.classes = results;
            complete();
        }
    });
};

function getClass(res, mysql, id, context, complete) {
    var sql = "SELECT C.course_id AS id, C.course_name AS name, C.college AS college, P.name AS professor, C.building_name AS location FROM class C LEFT JOIN professor P ON P.id = C.professor WHERE C.course_id = ?";
    var inserts = [id];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        } else {
            context.class = results[0];
            complete();
        }
    })
}

function getBuilding(res, mysql, context, complete) {
    var sql = "SELECT B.name AS name FROM buildings B"
    mysql.pool.query(sql, function(error, results, fields){
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        } else {
            context.buildings = results;
            complete();
        }
    })
}

function getProfessors(res, mysql, context, complete) {
    var sql = "SELECT P.name AS name, P.id AS id FROM professor P"
    mysql.pool.query(sql, function(error,results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        } else {
            context.professors = results;
            complete();
        }
    })
}

function deleteStudentClasses(res, mysql, id, complete) {
    var sql = "DELETE FROM students_classes WHERE class_id = ?"
    var inserts=[id];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
        if(error) {
            res.write(JSON.stringify(error));
            res.end();
        } else {
            complete();
        }
    })
}

router.get('/', function(req, res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["deleteClass.js"];
    var mysql = req.app.get('mysql');
    getClasses(res, mysql, context, complete);
    getBuilding(res, mysql, context, complete);
    getProfessors(res, mysql, context, complete);
    function complete() {
        callbackCount++;
        if (callbackCount >= 3) {
            res.render('classes', context);
        }
    }
});

router.get('/modify/:id', function(req, res) {
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get('mysql');
    getClass(res, mysql, req.params.id, context, complete);
    getBuilding(res, mysql, context, complete);
    getProfessors(res, mysql, context, complete);
    function complete() {
        callbackCount++;
        if(callbackCount >= 3) {
            res.render('class-page', context);
        }
    }
})

router.post('/add', function(req, res){
    var mysql = req.app.get('mysql');

    var sql = "INSERT INTO class (course_name, college, professor, building_name) VALUES (?, ?, ?, ?)"
    var inserts = [req.body.course_creation_name, req.body.course_creation_department, req.body.course_creation_professor, req.body.course_creation_building];
    if (req.body.course_creation_professor = "NULL") {
        sql = "INSERT INTO class (course_name, college, professor, building_name) VALUES (?, ?, NULL, ?)"
        inserts = [req.body.course_creation_name, req.body.course_creation_department, req.body.course_creation_building];

    }
    sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.redirect('/classes');
        }
    });
});

router.post('/modify/:id', function(req, res) {
    var mysql = req.app.get('mysql');
    var sql = "UPDATE class SET course_name = ?, college = ?, professor = ?, building_name = ? WHERE course_id = ?"
    var inserts = [req.body.course_modification_name, req.body.course_modification_department, req.body.course_modification_professor, req.body.course_modification_building, req.params.id];
    if(req.body.course_modification_professor = 'NULL') {
        sql = "UPDATE class SET course_name = ?, college = ?, professor = NULL, building_name = ? WHERE course_id = ?";
        inserts = [req.body.course_modification_name, req.body.course_modification_department, req.body.course_modification_building, req.params.id];
        if (req.body.course_modification_building = 'NULL') {
            sql = "UPDATE class SET course_name = ?, college = ?, professor = NULL, building_name = NULL WHERE course_id = ?"
            inserts = [req.body.course_modification_name, req.body.course_modification_department, req.params.id];
        }
    } else if (req.body.course_modification_building = 'NULL') {
        sql = "UPDATE class SET course_name = ?, college = ?, professor = ?, building_name = NULL WHERE course_id = ?"
        inserts = [req.body.course_modification_name, req.body.course_modification_professor, req.body.course_modification_department, req.params.id];
    }
    mysql.pool.query(sql, inserts, function(error, results, fields) {
        if(error) {
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.redirect('/classes');
        }
    })
})

router.delete('/:id', function(req, res){
    var callBackCount = 0;
    var mysql = req.app.get('mysql');
    deleteStudentClasses(res, mysql, req.params.id, complete)
    var sql = 'DELETE FROM class WHERE course_id = ?';
    var inserts = [req.params.id];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
        if (error) {
            console.log(error);
            res.write(JSON.stringify(error));
            res.status(400);
            res.end();
        } else {
            complete();
        }
    });
    function complete() {
        callBackCount++;
        if(callBackCount >= 2) {
            res.status(202).end();
        }
    }
})

module.exports = router;