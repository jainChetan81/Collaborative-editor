const express = require("express"),
    router = express.Router(),
    passport = require("passport");
router
    .route("/login")
    .get((req, res, next) => {
        res.render("login", { title: "login page of codeshare" });
    })
    .post(
        passport.authenticate("local", {
            failureRedirect: "/login"
        }),
        (req, res) => {
            res.redirect("/");
        }
    );

router
    .route("/register")
    .get((req, res, next) => {
        res.render("register", { title: "register your new account" });
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
            // user.setPassword(req.body.password);
            // let obj = user.setPassword(req.body.password);
            // user.salt = obj.salt;
            // user.hash = obj.hash;
            user.password = req.body.password;
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
router.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: "email" })
);
router.get(
    "/auth/faceboook/callback",
    passport.authenticate("facebook", {
        successRedirect: "/",
        failureRedirect: "/"
    })
);
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});
module.exports = router;
