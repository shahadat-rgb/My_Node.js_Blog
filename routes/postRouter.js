const express = require("express");
const router = express.Router();
const { postCreate, stroePost,post, details, updateForm, postUpdate, postValidations, deletePost } = require("../controller/postController");

const { auth } = require("../middleware/auth");


router.get("/createPost",auth,postCreate)
router.post("/createPost",auth,stroePost)
router.get("/post/:page",auth,post)
router.get("/details/:id",auth,details)
router.get("/update/:id",auth,updateForm)
router.post('/update',[postValidations,auth],postUpdate)
router.post('/delete',auth,deletePost)

module.exports=router;