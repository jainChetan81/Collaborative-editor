const mongoose = require("mongoose");
var crypto = require("crypto");
var userSchema = mongoose.Schema({
    email: { type: String, unique: true, required: true },
    name: {
        type: String,
        required: true
    },
    hash: {
        type: String
        // required: true
    },
    salt: {
        type: String
        // required: true
    }
});
userSchema.methods.setPassword = password => {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, "sha1")
        .toString("hex");
    let obj = {
        hash: this.hash,
        salt: this.salt
    };
    return obj;
};
userSchema.methods.validPassword = password => {
    var hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, "sha1")
        .toString("hex");
    return this.hash === hash;
};
module.exports = mongoose.model("User", userSchema);
