const express = require("express");
const router = express.Router();
const { postCreate, stroePost,post } = require("../controller/postController");

const { auth } = require("../middleware/auth");


router.get("/createPost",auth,postCreate)
router.post("/createPost",auth,stroePost)
router.get("/post/:page",auth,post)

module.exports=router;