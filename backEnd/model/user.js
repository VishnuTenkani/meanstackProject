const mongose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator")



const userSchema = mongose.Schema({
    userName: { type: String, require: true, },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

})

userSchema.plugin(uniqueValidator)
module.exports = mongose.model("User", userSchema);

