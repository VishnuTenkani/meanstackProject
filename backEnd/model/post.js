const mongose = require("mongoose");

const postSchema =mongose.Schema({
    title: {type:String, required:true},
    content: {type:String, required:true},
})

module.exports = mongose.model("Post",postSchema);

