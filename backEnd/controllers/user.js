const bycrpt = require("bcrypt")
const jwt = require("jsonwebtoken");
const User = require("../model/user")

exports.createUser = (req, res, next) => {
    bycrpt.hash(req.body.password, 10).then((hash) => {
        const user = new User({
            email: req.body.email,
            password: hash
        })
        user.save().then((result) => {
            res.status(201).json({
                message: "User created!",
                result: result
            })
        }).catch((err) => {
            res.status(501).json({
                message: "Email id already exists!",
            })
        })
    })
}

exports.loginUser = (req, res, next) => {
    let fectchedUser;
    User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
            return res.status(401).json({
                message: "Please login"
            })
        }
        fectchedUser = user;
        return bycrpt.compare(req.body.password, user.password)

    }).then((result) => {
        if (!result) {
            return res.status(401).json({
                message: "Please login"
            })
        }
        const token = jwt.sign({ email: fectchedUser.email, userId: fectchedUser._id }, "seceret_web_token_should_be_loger",
            { expiresIn: "1h" });
        res.status(200).json({
            message: "Auth successfuly!",
            token: token,
            expiresIn: 3600,
            userId: fectchedUser._id,
            likevalue: fectchedUser.likevalue
        })
    }).catch((err) => {
        return res.status(401).json({
            message: "Please login"
        })
    });

}