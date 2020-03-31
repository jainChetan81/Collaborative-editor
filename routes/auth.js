const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    config = require("../config");
router.get("/login", (req, res, next) => {
    res.render("login", { title: "login page of codeshare" });
});
router
    .route("/register")
    .get((req, res, next) => {
        res.render("register", { title: "register page of codeshare" });
    })
    .post((req, res, nex) => {
        req.checkBody("name", "Empty Name").notEmpty();
        req.checkBody("email", "Invalid Email").notEmpty();
        req.checkBody("password", "Empty Password").notEmpty();
        req.checkBody("password", "Password do not match")
            .equals(req.body.confirmPassword)
            .notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            res.render("register", {
                name: req.body.name,
                email: req.body.email,
                errorMessages: errors
            });
        } else {
            var user = new User();
            user.name = req.body.name;
            user.email = req.body.email;
            let obj = user.setPassword(req.body.password);
            user.salt = obj.salt;
            user.hash = obj.hash;
            console.log("user in register:", user);
            user.save(err => {
                if (err) {
                    console.log("err :", err);
                    res.render("register", { errorMessages: err });
                } else {
                    res.redirect("/login");
                }
            });
        }
    });
module.exports = router;
