const express = require('express')
const {check,validationResult} = require("express-validator")
const app = express()
const port = process.env.PORT || 4000;

app.use(express.static("./views"))
app.use(express.urlencoded({extended:true}));

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    const title = "create new account";
    const errors =[];
    res.render("register",{title,errors})
})


app.get('/login', (req, res) => {
 const title = "User Login"
 res.render("login",{title})
})

app.post("/register", [
 
    check("name").isLength({min:5}).withMessage("Name is required & must be 5 characters long"),
    check("email").isEmail().withMessage("Enter a valid email address"),
    check("password").isLength({min:6}).withMessage("password must be 6 characters long")

], (req,res) =>{

  const errors = validationResult(req);
   if (!errors.isEmpty()) {
       const title = "Create new account"
       res.render("register", {title, errors: errors.array()})
   }else{
    res.send("form submitted")
   }

})


  



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
