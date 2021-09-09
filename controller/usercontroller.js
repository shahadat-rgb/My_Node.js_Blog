const {check,validationResult} = require("express-validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Users = require("../models/user")

const loadSignup = (req, res) => {
    const title = "create new account";
    const errors =[];
    res.render("register",{title,errors,inputs:{},login : false})
}

const loadLogin =  (req, res) => {
    const title = "User Login"
    res.render("login",{title,errors:[],inputs:{},login:false})
   }

 const loginValidations = [
    check('email').not().isEmpty().withMessage('Valid email is required'),
    check('password').not().isEmpty().withMessage('Password is required')
]

   const postLogin = async (req,res)=>{
     const {email,password} = req.body;
    const errors = validationResult(req);
     if (!errors.isEmpty()) {
      res.render("login", {title:"user login", errors: errors.array(),inputs:req.body,login:false})

     }else{
        const checkEmail = await Users.findOne({email})
        if (checkEmail !== null) {
           const  id = checkEmail._id;
           const  dbPassword = checkEmail.password;
           const  verifyPassword = await bcrypt.compare(password,dbPassword);
        if ( verifyPassword) {
             const token = jwt.sign({userId:id},process.env.JWT_SECRET_KEY,{
               expiresIn : "7d"
             })
            
            //  create session variable
            req.session.user = token;
            res.redirect("/profile")
        }else{
          res.render("login", {title:"user login", errors:[{msg:"password is not correct"}],inputs:req.body,login:false})
        }

        }else{
          res.render("login", {title:"user login", errors:[{msg:"email is not found"}],inputs:req.body,login:false})
        }
     }
  
  }


 const registerValidation = [
   check("name").isLength({min:5}).withMessage("Name is required & must be 5 characters long ."),
   check("email").isEmail().withMessage("Enter a valid email address"),
   check("password").isLength({min:6}).withMessage("password must be 6 characters long")

]

const postRegister = async (req,res) =>{
    const {name,email,password} = req.body;
    const errors = validationResult(req);
     if (!errors.isEmpty()) {
         const title = "Create new account"
         res.render("register", {title, errors: errors.array(),inputs:req.body,login:false})
     }else{
       try {
        const userEmail = await Users.findOne({email})
         if (userEmail === null) {
           const salt = await bcrypt.genSalt(10)
           const hashed = await bcrypt.hash(password, salt)
          
              const newUser = new Users({
                name:name,
                email:email,
                password : hashed
              })
             try {
               const createdUser = await newUser.save();
               req.flash('success',"your account has been created successfully")
               res.redirect("/login") 
             } catch (error) {
               console.log(error.message);
             }
          
         }else{
          res.render("register", 
          {title:"Create new account", errors: [{msg:"Email address already exist"}],inputs:req.body,login:false})
         }
       } catch (error) {
         console.log(error.message);
       }
     }       
  
  }
module.exports ={
    loadSignup,
    loadLogin,
    registerValidation,
    postRegister,
    postLogin,
    loginValidations
}