const mongose = require("mongoose");

const postSchema =mongose.Schema({
    title: {type:String, required:true},
    content: {type:String, required:true},
    imagePath:{type : String, required : true},
    creator:{type: mongose.Schema.Types.ObjectId, ref:"User", required: true},
    likescount:{type:Number, default:0},
    likevalue:{type: Array}

})

module.exports = mongose.model("Post",postSchema);

