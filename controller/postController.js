const {check,validationResult} = require("express-validator")


const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const Users = require("../models/user")
const Post = require("../models/post");
var dateFormat = require("dateformat");

const postCreate = (req,res)=>{
 res.render('createPost', { title: 'user created post', login: true,errors:[], input_title:'',body:'' })
}

const stroePost = (req,res)=>{
    const form = formidable();
    form.parse(req,(err,fields,files)=>{
        const errors =[]
        const {title,body} = fields;
        if (title.length === 0   ) {
              errors.push({msg:"Title is required"})
        }
        if (body.length === 0) {
            errors.push({msg:"body is required"})
         }
         
         const imageName = files.image.name;
         const split = imageName.split(".");
         const imageExt = split[split.length -  1].toUpperCase();

         if (files.image.name.length === 0) {
            errors.push({msg:"image is required"})
        }else if (imageExt !== "JPG" && imageExt !== "PNG" && imageExt !== "JFIF") {
             errors.push({msg:"Only jpg and png are allowed"})
          }
         
         if (errors.length !== 0 ) {
            res.render('createPost', { title: 'user created new post', login: true ,errors,
            input_title:title,body})

         }else{
                files.image.name = uuidv4() + "." + imageExt;
                const oldPath = files.image.path;
                const newPath = __dirname + "/../views/assests/img/" + files.image.name;
                fs.readFile(oldPath,(err,data)=>{ 
                    if (!err) {
                         fs.writeFile(newPath,data,(err) =>{
                             if (!err) {
                                 fs.unlink(oldPath, async (err)=>{
                                     if (!err) {
                                         const id = req.id;
                                         try {
                                         const user = await Users.findOne({_id : id})
                                         const name = user.name;
                                         const newPost = new Post({
                                             userId : id,
                                             title,
                                             body,
                                             image:files.image.name,
                                             userName : name
                                         })
                                         try {
                                              const result = await newPost.save();
                                              if (result) {
                                                  req.flash("success",'your post has been added successfully')
                                                res.redirect('/post/1')
                                            }
                                         } catch (err) {
                                              res.send(err.msg)
                                         }

                                         } catch (error) {
                                             res.send(error.msg)
                                         }
                                     }
                                 })
                             }
                         })
                    }
                })
         }
    })
    
}



const post = async(req,res)=>{
    const id = req.id;
    let currentPage = 1;
    let page = req.params.page;
    if (page) {
        currentPage = page;
    }
    const perPage =  4;
    const skip = (currentPage - 1) * perPage
    const allPost = await Post.find({userId:id})
                                 .skip(skip)
                                 .limit(perPage)
                                 .sort({updatedAt: -1});
    const count = await Post.find({userId:id}).countDocuments();

    res.render("post",{title:"post", login:true, posts :allPost, formate:dateFormat,count,perPage,currentPage})
}

const details = async(req,res)=>{
    const id = req.params.id;
    try {
        const details = await Post.findOne({_id:id})
        res.render('details',{title:'Post Details',login:true,details})
    } catch (err) {
        res.send(err)
    }
   
}

const updateForm =async(req,res)=>{
    const id = req.params.id;
     try {
        const post = await Post.findOne({_id:id})
        res.render('update',{title:'update post',login:true,errors:[],post})
     } catch (error) {
          res.send(error)
     }
}
  

const postValidations = [
    check('title').not().isEmpty().withMessage('title is required'),
    check('body').not().isEmpty().withMessage('body is required')
]


const postUpdate = async (req,res)=>{
  
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        const id = req.body.hiddenID;
        const post = await Post.findOne({_id:id})
        res.render('update',{title:'update post',login:true,errors:errors.array(),post})
    }else{
        const {hiddenID,title,body}= req.body;
        try {
            const updateResult = await Post.findByIdAndUpdate(hiddenID,{title,body})
            if (updateResult) {
                    req.flash("success",'your post has been updated successfully')   
                    res.redirect('/post/1')

            }
        } catch (err) {
            res.send(err)
        }
    }
 


}

const deletePost = async (req, res) => {
    const id = req.body.deleteID;
    try {
        const response = await Post.findByIdAndRemove(id)
        if (response) {
            req.flash('success', "Your post has been deleted successfully")
            res.redirect('/post/1')
        }
    } catch (err) {
        res.send(err)
    }
}

  module.exports={
      postCreate,
      stroePost,
      post,
      details,
      updateForm,
      postUpdate,
      postValidations,
      deletePost,
  }