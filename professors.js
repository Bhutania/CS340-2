var express = require('express');
var router = express.Router();

function getProfessors(res, mysql, context, complete) {
    var sql = "SELECT P.name AS name, P.college AS college, P.tenured AS tenured, P.building as building, P.boss AS boss FROM professors P"
    mysql.pool.query(sql, function(error, results, fields){
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        } else {
            context.Professors=results;
            complete();
        }
    });
}

function getProfessor(res, mysql, id, context, complete) {
    var sql = "SELECT P.name AS name P.college AS college, P.tenured AS tenured, P.building as building, P.boss AS boss FROM professors P WHERE P.id = ?"
    var inserts = [id];
    mysql.pool.query(sql, insert, function(error, results, fields){
        if (error) {
            res.write(JSON.stringify(erorr));
            res.end();
        } else {
            context.professor = results;
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
    function complete(){
        callbackCount++;
        if(callbackCount >=1){
            res.render('professors', context);
        }
    }
});

router.get('/login', function(req, res){
    callbackCount = 0;
    var context = {};
    context.jsscripts = ["deleteSC.js"];
    var mysql = req.app.get('mysql');
    getProfessor(res, mysql, id, context, complete)
    function complete(){
        callbackCount++;
        if(callbackCount >= 3){
            res.render('professor-page', context);
        }
    }
});

router.post('/', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO professor (name, college, tenured, building, boss) VALUES (?, ?, ?, ?, ?)";
    var inserts = [];
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


module.exports = router;