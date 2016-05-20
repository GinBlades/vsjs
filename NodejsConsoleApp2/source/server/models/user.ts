import mongoose = require("mongoose");
import bcrypt = require("bcrypt-nodejs");
import ModelBase = require("./model_base");

class User {
    private static saltFactor = 10;
    public static mongooseModel: MongooseModel<UserProperties> = mongoose.model("User", User.userSchema());

    public static get(id: number) {
        return ModelBase.get(User.mongooseModel, id);
    }

    public static save(user) {
        return ModelBase.save(user);
    };

    private static noop = () => {
        return undefined;
    }

    private static userSchema() {
        let _userSchema = mongoose.Schema({
            bio: String,
            createdAt: { type: Date, default: Date.now },
            displayName: String,
            password: { type: String, required: true },
            username: { type: String, required: true, unique: true }
        });

        _userSchema.methods.name = function() {
            return this.displayName || this.username;
        };

        // a pre-save function
        _userSchema.pre("save", function (done) {
            let user = this;
            if (!user.isModified("password")) {
                return done();
            }

            // Generate a salt
            bcrypt.genSalt(User.saltFactor, (err, salt) => {
                if (err) { return done(err); }

                bcrypt.hash(user.password, salt, User.noop, (err, hashedPassword) => {
                    if (err) { return done(err); }
                    user.password = hashedPassword;
                    done();
                });
            });
        });

        // Check hashed password
        _userSchema.methods.checkPassword = function (guess, done) {
            // Use `compare` instead of `===` to prevent a *timing attack*
            bcrypt.compare(guess, this.password, (err, isMatch) => {
                done(err, isMatch);
            });
        };

        return _userSchema;
    }
}

export = User;