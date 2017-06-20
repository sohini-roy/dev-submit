/**
 * Created by varun on 5/24/17.
 */
const express = require('express');
const db = require('../Utils/db');

const router = express.Router();


//TODO add echo support

//tested
router.post('/new', function (req, res) {
    db.addCourse(req.body.name, req.body.teacher, req.body.startdate, req.body.enddate, function (data) {
        res.send(data);
    });
});



//tested
router.get('/', (req, res) => {
    let onlyActive = req.query.active;
    var options = {};
    if (onlyActive) options.isActive = JSON.parse(onlyActive);
    let name = req.query.name;
    let teacher = req.query.teacher;


    if (name) {
        options.name = name;
    }
    else if (teacher) {
        options.teacher = teacher
    }

    db.getCourses(options, (data) => {
        res.send(data);
    });

});


//tested
router.get('/:courseId', function (req, res) {
    let options = {};
    options.id = req.params.courseId;
    db.getCourses(options, function (data) {
        res.send(data);
    });
});


//tested
router.get('/:courseId/students', (req, res) => {
    db.getAllStudentsInCourse(req.params.courseId, (data) => {
        console.log("done");
        res.send(data);
    });
});

//tested
router.put('/:courseId', function (req, res) {

    db.editCourse(req.params.courseId, req.body.name, req.body.teacher, req.body.endDate, (data) => {
        res.send(data);
    });
});

//tested
router.put('/:courseId/end', (req, res) => {
    db.endCourse(req.params.courseId, (data) => {
        res.send(data);
    });
});


//TODO cascade delete not working
router.delete('/:courseId', (req, res) => {
    db.deleteCourse(req.params.courseId, (data) => {
        if (req.query.echo) res.send(data);
        else res.send("success");
    });
});


// TODO Error check
router.post('/:courseId/enroll', function (req, res) {
    let dataType = req.body.studentAttribute;
    let studentArray = req.body.students;
    // if (studentArray) studentArray = JSON.parse(studentArray);
    let courseId = req.params.courseId;
    let retval = [];

    for (var i = 0; i < studentArray.length; i++) {
        db.enrollStudentInCourse(dataType, studentArray[i], courseId, function (data) {
            retval.push(data);
            if (retval.length == studentArray.length)
                res.send(retval);
        });
    }
});


module.exports = router;