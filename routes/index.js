var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
    res.render("index", { title: "Express" });
});
router.get("/about", (req, res, next) => {
    res.render("about", { title: "abou page of codeshare" });
});
router
    .route("/contact")
    .get((req, res, next) => {
        res.render("contact", { title: "contact page of codeshare" });
    })
    .post((req, res, next) => {
        req.checkBody("name", "Empty Name").notEmpty();
        req.checkBody("email", "Invalid Email").notEmpty();
        req.checkBody("message", "Empty Message").notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            res.render("contact", {
                title: "contact page of codeshare",
                name: req.body.name,
                email: req.body.email,
                message: req.body.message,
                errorMessages: errors
            });
        }

        res.render("thank", { title: "post of contact" });
    });

module.exports = router;
