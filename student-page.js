//UNUSED FILE, CODE COMMENTED OUT IN CASE FUNCTIONS NEED TO BE USED

// var express = require('express');
// var router = express.Router();

// function getClasses(res, mysql, id, context, complete) {
//     sql = "SELECT student_id, class_id FROM students_classes WHERE student_id = ?";
//     insert = [id];
//     mysql.pool.query(sql, insert, function(error, results, fields){
//         if(error) {
//             res.write(JSON.stringify(error));
//             res.end();
//         }
//         context.class = results;
//         complete();
//     })
// }

// function getStudent(res, mysql, id, context, complete) {
//     sql = "SELECT S.student_id, S.name, S.major, S.building FROM students S WHERE S.id = ?";
//     insert = [id];
//     mysql.pool.query(sql, insert, function(error, results, fields){
//         if (error) {
//             res.write(JSON.stringify(error));
//             res.end();
//         }
//         context.student = results;
//         complete();
//     });
// }


// router.post('/', function(req, res){
//     var mysql = rep.app.get('mysql');
//     var sql = "INSERT INTO `students_classes` (`student_id`,`class_id`) VALUES (?,?);"
//     var inserts = [req.body.student_id, req.body.course_id]
//     sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
//         if(error) {
//             console.log(JSON.stringify(error));
//             res.write(JSON.stringify(error));
//             res.end();
//         }
//         else {
//             res.redirect('student-page')
//         }
//     });
// });

// router.get('/', function(req,res){
//     console.log("test3");
//     var callbackCount = 0;
//     var context = {};
//     context
//     var mysql = rep.app.get('mysql');
//     getClasses(res, mysql, req.body.id, context, complete);
//     getStudent(res, mysql, req.body.id, context, complete);
//     function complete(){
//         callbackCount++;
//         if(callbackCount >= 1) {
//             res.render('student-page', context);
//         }
//     }
// });

// module.exports = router;