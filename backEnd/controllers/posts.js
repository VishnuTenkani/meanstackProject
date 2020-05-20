const Post = require("../model/post");
const user = require("../model/user");

exports.createPost = (req, res, next) => {
    const url= req.protocol + '://' + req.get("host");
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator:req.userData.userId 
      });
      //console.log(req.userData);
      //return res.status(200).json({});
      post.save().then(createdPost => {
        res.status(201).json({
          message: "Post added successfully",
          post:{
            ...createdPost,
            id:createdPost._id
          }
        });
      });
    }
exports.getPostById = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    });
  }

exports.updatePosts = (req, res, next) =>{
    let imagePath = req.body.imagePath;
    if(req.file){
      const url= req.protocol + '://' + req.get("host");
      imagePath = url + '/images/' + req.file.filename
    }
    const post = new Post({
      _id:  req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator:req.userData.userId,
    });
    Post.updateOne({_id:  req.params.id},post).then(result =>{
      //console.log(post);
      
      res.status(200).json({ message: "Post update successful!" });
    })
  }

  exports.like = (req,res,next)=>{
    
    Post.findOne({_id:req.body.id},(err,posts)=>{
      if(!posts){
        console.log(posts)
        res.status(201).json({message:"faild to postfid"})
      }else{
        user.findOne({_id :req.userData.userId}, (err,finduser)=>{
          //console.log("vt",finduser);
          if(finduser._id == req.userData.userId){
            posts.likescount++;
            posts.likevalue.push(finduser._id);
            //finduser.save();
            posts.save((err)=>{
              if(err){
                res.status(201).json({message:"liked failed"})
              }else{
                res.status(200).json({message:"liked successFully"})
              }
            })
          }
          else{
            res.status(201).json({message:"Cannot like your own post. "})
          }
        })
        //console.log('vv',posts)
          
      }
    })
    

  }
exports.dislike = (req,res,next)=>{
 /// console.log(Post,req.body.id)
  Post.findOne({_id : req.body.id},(err, posts)=>{
    if(!posts){
     // console.log('vv',err)
      res.status(201).json({message:"faild to postfid"})
    }else{
      user.findOne({_id :req.userData.userId}, (err,finduser)=>{
       // console.log("vt1",finduser);
        if(finduser._id == req.userData.userId){
          posts.likescount--;
          posts.likevalue.push(finduser._id);
          //finduser.save();
          posts.save((err)=>{
            if(err){
              res.status(201).json({message:"liked failed"})
            }else{
              res.status(200).json({message:"disliked successFully"})
            }
          })
        }
        else{
          res.status(201).json({message:"Cannot like your own post. "})
        }
      })
      //console.log('vv',posts)
        
    }
  })
 

}

  exports.getAllPosts = (req, res, next) => {
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
  }

  exports.deletePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
      //console.log(result);
      res.status(200).json({ message: "Post deleted!" });
    });
  }