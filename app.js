const express = require('express')
const session = require("express-session")
const mongoDBstore = require("connect-mongodb-session")(session)
const flash = require("express-flash")
require('dotenv').config()
const connection = require("./models/mongodb")
const userRouter =require('./routes/userRoutes')
const profileRouter = require("./routes/profileRoutes")
const postRouter = require("./routes/postRouter")

const app = express()
const port = process.env.PORT || 4000;

// db connection
connection();



// express-session middleware for keep the secret information.
const store = new mongoDBstore({
  uri : process.env.DB,
  collection : "sessions"
})

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: true,
  saveUninitialized: true,
  cookie:{
    maxAge : 7 * 24 * 60 * 60 * 1000
  },
  store :store
}))


// express-flash middleware for seen the success & error message 
app.use(flash());
app.use((req,res,next)=>{
   res.locals.message = req.flash();
   next();
})

app.use(express.static("./views"))
app.use(express.urlencoded({extended:true}));

app.set('view engine', 'ejs');

// userRouter 
app.use(userRouter)
// userProfileRoute
app.use(profileRouter)
// postRouter
app.use(postRouter)
  



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
