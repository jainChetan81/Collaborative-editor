const nodemailer = require("nodemailer"),
    express = require("express"),
    router = express.Router(),
    config = require("../config");
/* GET home page. */
router.get("/", function(req, res, next) {
    res.render("index", { title: "Express" });
});
router.get("/about", (req, res, next) => {
    res.render("about", { title: "abou page of codeshare" });
});
router.get("/login", (req, res, next) => {
    res.render("login", { title: "login page of codeshare" });
});
router.get("/register", (req, res, next) => {
    res.render("register", { title: "register page of codeshare" });
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
        } else {
            var mailOptions = {
                from: "chetan jain <no-reply@gmail.com>",
                to: "dangerxkills@gmail.com",
                subject: "you got a new message from visitor",
                text: req.body.message
            };
            const transporter = nodemailer.createTransport(config.mailer);
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log("error in sending mail : ", error);
                }
                res.render("thank", { title: "post of contact" });
            });
        }
        //todo : if no errors are found
    });

module.exports = router;
