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

function removeBuildingStudent(res, mysql, name, complete){
	var sql = "UPDATE student SET building = NULL WHERE building= ?"
	var inserts = [name];
	mysql.pool.query(sql,inserts,function(error,results,fields){
	   if (error){
		console.log(JSON.stringify(error));
		res.write(JSON.stringify(error));
		res.end();
	   } else{
		complete();
	   }
	})
}


function removeBuildingProfessor(res, mysql, name, complete){
	var sql = "UPDATE professor SET building = NULL WHERE building= ?"
	var inserts = [name];
	mysql.pool.query(sql,inserts,function(error,results,fields){
	   if (error){
		console.log(JSON.stringify(error));
		res.write(JSON.stringify(error));
		res.end();
	   } else{
		complete();
	   }
	})
}


function removeBuildingClass(res, mysql, name, complete){
	var sql = "UPDATE class SET building_name = NULL WHERE building_name = ?"
	var inserts = [name];
	mysql.pool.query(sql,inserts,function(error,results,fields){
	   if (error){
		console.log(JSON.stringify(error));
		res.write(JSON.stringify(error));
		res.end();
	   } else{
		complete();
	   }
	})
}

//render buildings.handlebars page
router.get('/', function(req, res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["deleteBuildings.js"];
    var mysql = req.app.get('mysql');
    getBuildings(res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >=1){
            res.render('buildings', context);
        }
    }
});

router.post('/add', function(req, res){
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

router.delete('/:name', function(req, res){
    var callbackCount = 0;
    var mysql = req.app.get('mysql');
    removeBuildingStudent(res, mysql, req.params.name, complete);
    removeBuildingProfessor(res, mysql, req.params.name, complete);
    removeBuildingClass(res, mysql, req.params.name, complete);
    var sql = "DELETE FROM buildings WHERE name = ?"
    var inserts = [req.params.name];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
        if (error) {
            //console.log(JSON.stringify(error));
            res.write(JSON.stringify(error));
            res.status(400);
            res.end();
        } else {
            complete();
        }
    });
    function complete() {
        callbackCount++;
        if(callbackCount >= 4) {
            res.status(202).end();
        }
    }
})

module.exports = router;
