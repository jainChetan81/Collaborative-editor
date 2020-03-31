const mongoose = require("mongoose"),
    createError = require("http-errors"),
    express = require("express"),
    path = require("path"),
    cookieParser = require("cookie-parser"),
    logger = require("morgan"),
    config = require("./config"),
    expressValidator = require("express-validator"),
    indexRoute = require("./routes/index"),
    authRoute = require("./routes/auth"),
    passport = require("passport"),
    session = require("express-session"),
    app = express();
require("./passport");

// view engine setup
mongoose.connect(config.dbMlab, () => {
    console.log("mongodb is connected");
});
global.User = require("./models/User");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(
    session({
        secret: config.sessionKey,
        resave: false,
        saveUninitialized: true
    })
);
app.use((req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
});
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRoute);
app.use("/", authRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
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
