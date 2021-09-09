const jwt = require("jsonwebtoken");

const auth =(req,res,next)=>{
   if (req.session.user) {
       const token = req.session.user;
       const verified   = jwt.verify(token,process.env.JWT_SECRET_KEY)
       if (!verified) {
       return res.redirect("/login")
       }else{
        req.id = verified.userId;
       }
    }else{
     return  res.redirect("/login")
   }
   next();
}  


const stopLogin =(req,res,next)=>{
    if (req.session.user) {
        const token = req.session.user;
        const verified   = jwt.verify(token,process.env.JWT_SECRET_KEY)
        if (!verified) {
            return  res.redirect("/profile")
           }
    }
    next()
}

module.exports= {
    auth,
    stopLogin
}