const Post = require("../model/post");

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