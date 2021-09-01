const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.use(express.static("./views"))
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    title = "Create new account"
    res.render("register",{title})
})


app.get('/login', (req, res) => {
title = "User Login"
 res.render("login",{title})
})



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
