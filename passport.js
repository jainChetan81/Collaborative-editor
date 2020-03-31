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
            User.findOne({ email: username }, (err, user) => {
                if (err) return done(err);
                if (!user) {
                    return done(null, false, {
                        message: "Incorrrect Username"
                    });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, {
                        message: "incorrect password"
                    });
                }
                return done(null, user);
            });
        }
    )
);
