const express = require("express"),
    path = require("path"),
    favicon = require("serve-favicon"),
    logger = require("morgan"),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    expressValidator = require("express-validator"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    session = require("express-session"),
    indexRoute = require("./routes/index"),
    authRoute = require("./routes/auth"),
    taskRoute = require("./routes/task"),
    config = require("./config"),
    app = express();
require("./passport");

mongoose.connect(config.dbConnstring, () => {
    console.log("mongodb is connected");
});
global.User = require("./models/user");
global.Task = require("./models/Task");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(
    session({
        secret: config.sessionKey,
        resave: false,
        saveUninitialized: true
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));
app.use(function(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("user on th app.js is : ", req.user);
        res.locals.user = req.user;
    }
    next();
});

app.use("/", indexRoute);
app.use("/", authRoute);
app.use("/", taskRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
