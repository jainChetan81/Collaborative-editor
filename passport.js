const passport = require("passport"),
    localStrategy = require("passport-local").Strategy,
    facebookStrategy = require("passport-facebook").Strategy,
    config = require("./config");

passport.serializeUser((user, done) => {
    console.log("serialize : ", user);
    done(null, user._id);
});
passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }, (err, user) => {
        console.log("deserialize : ", user);
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
passport.use(
    new facebookStrategy(
        {
            clientID: config.facebook.appId,
            clientSecret: config.facebook.appSecret,
            callbackURL: "http://localhost:3000/auth/facebook/callback",
            profileFields: ["id", "displayName", "email"]
        },
        (token, refreshToken, profile, done) => {
            User.findOne({ facebookId: profile.id }, (err, user) => {
                console.log("user : ", user);
                if (err) return done(err);
                if (user) {
                    return done(null, user, {
                        message: "login complete"
                    });
                } else {
                    User.findOne(
                        { email: profile.emails[0].value },
                        (err, user) => {
                            if (user) {
                                user.facebookId = profile.id;
                                return user.save(err => {
                                    if (err) return;
                                    done(
                                        null,
                                        false({ message: "Cant save user" })
                                    );
                                    return done(null, user);
                                });
                            }
                            var user = new User();
                            user.name = profile.displayName;
                            user.email = profile.emails[0].value;
                            user.facebookId = profile.id;
                            user.save(err => {
                                if (err)
                                    return done(null, false, {
                                        message: "Cant save the user model"
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
