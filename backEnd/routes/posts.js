const express = require("express");
const Post = require("../model/post");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth")

const MIME_TYPE_MAP={
  "image/png":"png",
  "image/jpeg":"jpg",
  "image/jpg":"jpg"
}

const fileStorage = multer.diskStorage({
  destination: (req,file, cb) =>{
    const isVaild = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isVaild){
      error = null;
      
    }
    
    cb(error,"backEnd/images")
  },
  filename: (req, file, cb) =>{
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext)

  }
})

router.post("/api/posts", checkAuth, multer({storage:fileStorage}).single("image"),(req, res, next) => {
  const url= req.protocol + '://' + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + '/images/' + req.file.filename, 
    });
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post:{
          ...createdPost,
          id:createdPost._id
        }
      });
    });
  });
  
  router.get("/api/posts/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    });
  });
  
  router.put("/api/posts/:id",checkAuth,multer({storage:fileStorage}).single("image"),(req, res, next) =>{
    let imagePath = req.body.imagePath;
    if(req.file){
      const url= req.protocol + '://' + req.get("host");
      imagePath = url + '/images/' + req.file.filename
    }
    const post = new Post({
      _id:  req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    Post.updateOne({_id:  req.params.id},post).then(result =>{
      //console.log(post);
      
      res.status(200).json({ message: "Post update successful!" });
    })
  })
  
  router.get("/api/posts", (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const Currentpage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPost;
    if(pageSize && Currentpage){
      postQuery.skip(pageSize * (Currentpage - 1))
      .limit(pageSize);
    }
    postQuery.then(documents => {
      fetchedPost = documents
     return Post.count()
    }).then(count =>{
      res.status(200).json({
        message: "Posts fetched successfully!",
        post: fetchedPost,
        maxPosts:count
      });
    });
  });
  
  router.delete("/api/posts/:id",checkAuth ,(req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
      //console.log(result);
      res.status(200).json({ message: "Post deleted!" });
    });
  });
  
  module.exports = router;