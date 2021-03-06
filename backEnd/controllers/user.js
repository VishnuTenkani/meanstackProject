const bycrpt = require("bcrypt")
const jwt = require("jsonwebtoken");
const User = require("../model/user")

exports.createUser = (req, res, next) => {
    bycrpt.hash(req.body.password, 10).then((hash) => {
        const user = new User({
            userName: req.body.userName,
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
                message: "Invalid login"
            })
        }
        fectchedUser = user;
        return bycrpt.compare(req.body.password, user.password)

    }).then((result) => {
        if (!result) {
            return res.status(401).json({
                message: "Invalid login"
            })
        }
        const token = jwt.sign({ email: fectchedUser.email, userId: fectchedUser._id }, process.env.JWT_KEY,
            { expiresIn: "1h" });
        res.status(200).json({
            message: "Auth successfuly!",
            token: token,
            expiresIn: 3600,
            userId: fectchedUser._id,
            userName: fectchedUser.email
        })
    }).catch((err) => {
        return res.status(401).json({
            message: "Invalid login"
        })
    });

}