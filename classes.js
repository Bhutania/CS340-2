var express = require('express');
var router = express.Router();

function getClasses(res, mysql, context, complete) {
    var sql = "SELECT C.name AS name, C.college AS college, P.professor AS professor, C.building_name AS location FROM class C INNER JOIN professor P ON P.id = C.professor";
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

router.get('/', function(req, res){
    var callbackCount = 0;
    var context = [];
    context.jsscripts = {};
    var sql = req.app.get('mysql');
    getClasses(res, mysql, context, complete);
    function complete() {
        callbackCount++;
        if (callbackCount >= 1) {
            res.render('classes');
        }
    }
});

module.exports = router;