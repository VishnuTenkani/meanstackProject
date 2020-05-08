const jwt = require("jsonwebtoken");

module.exports = (req, res, next)=>{
    try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token,"seceret_web_token_should_be_loger")
    }catch(err){
        res.status(401).json({
            message:"auth failed!"
        })
    };
    next();
    
}