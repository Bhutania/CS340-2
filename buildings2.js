var express = require('express');
var router = express.Router();

function getBuildings(res, mysql, context, complete) {
    var sql = "SELECT B.name as Name, B.rooms as Rooms FROM buildings B"
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


function deleteBuilding(res, mysql, name, complete) {
   var sql = "DELETE FROM buildings WHERE building_name = ?"
    var inserts = [name];
    mysql.pool.query(sql, inserts, function(error, results, fields){
        if (error) {
            console.log(JSON.stringify(error));
            res.write(JSON.stringify(error));
            res.end();
        } else {
            complete();
        }
    })
}


//render buildings.handlebars page
router.get('/', function(req, res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["deleteBuildings.js"]; //?
    var mysql = req.app.get('mysql');
    getBuildings(res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >=2){
            res.render('buildings', context);
        }
    }
});


router.get('/modify/:name', function(req, res) {
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get('mysql');
    getBuilding(res, mysql, context, complete);
    function complete() {
        callbackCount++;
        if(callbackCount >= 3) {
            res.render('building-page', context);
        }
    }
})

//not in building page
/*router.get('/:name', function(req, res){
    callbackCount = 0;
    var context = {};
    context.jsscripts = ["deletePC.js"];
    var mysql = req.app.get('mysql');
    getProfessor(res, mysql, req.params.id, context, complete);
    getClasses(res, mysql, req.params.id, context, complete);
    getProfessors(res, mysql, context, complete);
    getBuildings(res, mysql, context, complete);
    getClass(res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 5){
            if(context.professor.tenured == 0) {
                context.professor.tenured = "Untenured";
            } else {
                context.professor.tenured = "Tenured";
            }
            res.render('professor-page', context);
        }
    }
});
*/

router.post('/', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO buildings (name, rooms) VALUES (?, ?)";
    var inserts = [req.body.building_creation_name, req.body.building_creation_rooms];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        else {
            res.redirect('/buildings');
        }
    });
});
/*
router.post('/Classes', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "UPDATE class SET professor = ? WHERE course_id = ?"
    var inserts = [req.body.professor_id, req.body.professor_class];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
        if (error) {
            res.write(JSON.stringify(error));
            res.status(400);
            res.end();
        } else {
            res.redirect('/professors/'+req.body.professor_id);
        }
    });
});*/

router.delete('/:name', function(req, res){
    var callBackCount = 0;
    var mysql = req.app.get('mysql');
    removeProfessorClasses(res, mysql, req.params.pid, complete);
    var sql = "DELETE FROM building WHERE name = ?"
    var inserts = [req.params.name];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
        if (error) {
            console.log(JSON.stringify(error));
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
/*
router.delete('/:cid/:pid', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "UPDATE class SET professor = NULL WHERE course_id=?";
    var inserts = [req.params.cid];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
        if (error) {
            res.write(JSON.stringify(error));
            res.status(400);
            res.end();
        } else {
            res.status(202).end();
        }
    });
});*/


module.exports = router;
