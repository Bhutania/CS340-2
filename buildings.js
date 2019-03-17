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

router.get('/', function(req, res){
    var callbackCount = 0;
    var content = {};
    context.jsscripts = [];
    var mysql = req.app.get('mysql');
    getBuildings(res, mysql, context, complete);
    function complete() {
        callbackCount++;
        if (callbackCount >= 1) {
            res.render('buildings', context);
        }
    }
});

module.exports = router;