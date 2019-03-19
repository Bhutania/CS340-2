var express = require('express');
var router = express.Router();

function getClasses(res, mysql, context, complete) {
    var sql = "SELECT C.course_name AS name, C.college AS college, P.name AS professor, C.building_name AS location FROM class C INNER JOIN professor P ON P.id = C.professor";
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

router.get('/', function(req, res){
    var callbackCount = 0;
    var context = [];
    context.jsscripts = {};
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

module.exports = router;