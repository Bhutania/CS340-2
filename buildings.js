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

function deleteBuilding(res, mysql, name, complete){
	var sql = "DELETE FROM buildings WHERE building_name = ?"
	var inserts = [Name];
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

module.exports = router;
