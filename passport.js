const passport = require("passport"),
    localStrategy = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }, (err, user) => {
        done(err, user);
    });
});
passport.use(
    new localStrategy(
        {
            usernameField: "email"
        },
        (username, password, done) => {
            console.log("useername :", username, password);
            User.findOne({ email: username }, (err, user) => {
                console.log("user : ", user);
                if (err) return done(err);
                if (!user) {
                    console.log("Incorrrect Username");
                    return done(null, false, {
                        message: "Incorrrect Username or password"
                    });
                }
                if (password !== user.password) {
                    console.log("incorrect password");
                    return done(null, false, {
                        message: "incorrect password"
                    });
                }
                return done(null, user);
            });
        }
    )
);
