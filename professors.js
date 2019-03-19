var express = require('express');
var router = express.Router();

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
};

function getProfessors(res, mysql, context, complete) {
    var sql = "SELECT P.id as id, P.name AS name, P.college AS college, P.tenured AS tenured, P.building as building, P.boss AS boss FROM professor P"
    mysql.pool.query(sql, function(error, results, fields){
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        } else {
            context.professors=results;
            complete();
        }
    });
}

function getProfessor(res, mysql, id, context, complete) {
    var sql = "SELECT P.id as id, P.name AS name, P.college AS college, P.tenured AS tenured, P.building as building, P.boss AS boss FROM professor P  WHERE P.id = ?"
    var inserts = [id];
    mysql.pool.query(sql, inserts, function(error, results, fields){
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        } else {
            context.professor = results[0];
            complete();
        }
    });
}

function getClasses(res, mysql, id, context, complete) {
    var sql = "SELECT C.course_id as id, C.course_name as name FROM class C INNER JOIN professor P ON P.id = C.professor"
    var inserts =[id];
    mysql.pool.query(sql, inserts, function(error, results, fields){
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        } else {
            context.class = results;
            complete();
        }
    });
}




router.get('/', function(req, res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = [];
    var mysql = req.app.get('mysql');
    getProfessors(res, mysql, context, complete);
    getBuildings(res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >=2){
            res.render('professors', context);
        }
    }
});

router.get('/:id', function(req, res){
    callbackCount = 0;
    var context = {};
    context.jsscripts = ["deletePC.js"];
    var mysql = req.app.get('mysql');
    getProfessor(res, mysql, req.params.id, context, complete);
    getClasses(res, mysql, req.params.id, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 2){
            if(context.professor.tenured == 0) {
                context.professor.tenured = "Untenured";
            } else {
                context.professor.tenured = "Tenured";
            }
            res.render('professor-page', context);
        }
    }
});

router.post('/', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO professor (name, college, tenured, building, boss) VALUES (?, ?, ?, ?, ?)";
    var inserts = [req.body.professor_signup_name, req.body.professor_signup_major, req.body.professor_tenure_status, req.body.professor_signup_building, req.body.professor_signup_boss];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        else {
            res.redirect('/professors');
        }
    });
});

router.delete('/:cid/:pid', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "UPDATE class SET professor = NULL WHERE id=?";
    var inserts = [req.params.cid];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
        if (error) {
            res.write(JSON.stringify(error));
            res.status(400);
            res.end();
        } else {
            res.status(202).end();
        }
    })
})


module.exports = router;