var express = require("express");
var router = express.Router();

router.get("/createTask", (req, res) => {
    var newTask = new Task();
    newTask.save(function(err, data) {
        if (err) {
            console.log(err);
            res.render("error");
        } else {
            res.redirect("/task/" + data._id);
        }
    });
});

router.get("/task/:id", (req, res) => {
    if (req.params.id) {
        Task.findOne({ _id: req.params.id }, (err, data) => {
            if (err) {
                console.log(err);
                res.render("error");
            }
            if (data) {
                res.render("task", { data: data });
            } else {
                res.render("error");
            }
        });
    } else {
        res.render("error");
    }
});

module.exports = router;
