var passport = require("passport"),
    localStrategy = require("passport-local").Strategy,
    facebookStrategy = require("passport-facebook").Strategy,
    config = require("./config");

passport.serializeUser((user, done) => {
    console.log("serialze : ", user.name);
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }, (err, user) => {
        console.log("deserialze : ", user.name);
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
                        message: "Incorrect username or password"
                    });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, {
                        message: "Incorrect username or password"
                    });
                }
                return done(null, user);
            });
        }
    )
);

passport.use(
    new facebookStrategy(
        {
            clientID: config.facebook.appId,
            clientSecret: config.facebook.appSecret,
            callbackURL: "http://localhost:3000/auth/facebook/callback",
            profileFields: ["id", "displayName", "email"]
        },
        function(token, refreshToken, profile, done) {
            User.findOne({ facebookId: profile.id }, (err, user) => {
                if (err) return done(err);

                if (user) {
                    return done(null, user);
                } else {
                    User.findOne(
                        { email: profile.emails[0].value },
                        (err, user) => {
                            if (user) {
                                user.facebookId = profile.id;
                                return user.save(err => {
                                    if (err)
                                        return done(null, false, {
                                            message: "Can't save user info"
                                        });
                                    return done(null, user);
                                });
                            }

                            var user = new User();
                            user.name = profile.displayName;
                            user.email = profile.emails[0].value;
                            user.facebookId = profile.idea;
                            user.save(err => {
                                if (err)
                                    return done(null, false, {
                                        message: "Can't save user info"
                                    });
                                return done(null, user);
                            });
                        }
                    );
                }
            });
        }
    )
);
