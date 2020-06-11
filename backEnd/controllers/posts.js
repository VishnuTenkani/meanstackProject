const Post = require("../model/post");
const user = require("../model/user");

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  let Loggeduser;
  user.findOne({ _id: req.userData.userId }, (err, finduser) => {
    Loggeduser = finduser;
    //console.log(Loggeduser);



    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + '/images/' + req.file.filename,
      creator: req.userData.userId,
      creatorName: Loggeduser.email

    });
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    });
  });
  //console.log(req.userData);
  //return res.status(200).json({});

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

exports.updatePosts = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + '/images/' + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    //console.log(post);

    res.status(200).json({ message: "Post update successful!" });
  })
}

exports.like = (req, res, next) => {

  Post.findOne({ _id: req.body.id }, (err, posts) => {
    if (!posts) {
      console.log(posts)
      res.status(201).json({ message: "faild to postfid" })
    } else {
      user.findOne({ _id: req.userData.userId }, (err, finduser) => {
        //console.log("vt",finduser);
        if (finduser._id == req.userData.userId) {
          if (posts.likevalue.includes(finduser._id)) {
            posts.likescount--; // Reduce the total number of dislikes
            const arrayIndex = posts.likevalue.indexOf(finduser._id); // Get the index of the username in the array for removal
            posts.likevalue.splice(arrayIndex, 1); // Remove user from array
            posts.likescount++; // Increment likes
            posts.likevalue.push(finduser._id); // Add username to the array of likedBy array
            // Save blog post data
            posts.save((err) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
              } else {
                res.json({ success: true, message: 'Blog liked!' }); // Return success message
              }
            });
          } else {
            posts.likescount++;
            //posts.likevalueBool = true;
            posts.likevalue.push(finduser._id);
            //finduser.save();
            posts.save((err) => {
              if (err) {
                res.status(201).json({ message: "liked failed" })
              } else {
                res.status(200).json({ message: "liked successFully" })
              }
            })
          }
        }
        else {
          res.status(201).json({ message: "Cannot like your own post. " })
        }
      })
      //console.log('vv',posts)

    }
  })


}
exports.dislike = (req, res, next) => {
  /// console.log(Post,req.body.id)
  Post.findOne({ _id: req.body.id }, (err, posts) => {
    if (!posts) {
      // console.log('vv',err)
      res.status(201).json({ message: "faild to postfid" })
    } else {
      user.findOne({ _id: req.userData.userId }, (err, finduser) => {
        // console.log("vt1",finduser);
        if (finduser._id == req.userData.userId) {
          posts.likescount--;
          const arrayIndex = posts.likevalue.indexOf(finduser._id)
          posts.likevalue.splice(arrayIndex, 1);
          //finduser.save();
          posts.save((err) => {
            if (err) {
              res.status(201).json({ message: "liked failed" })
            } else {
              res.status(200).json({ message: "disliked successFully" })
            }
          })
        }
        else {
          res.status(201).json({ message: "Cannot like your own post. " })
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
  if (pageSize && Currentpage) {
    postQuery.skip(pageSize * (Currentpage - 1))
      .limit(pageSize);
  }
  postQuery.then(documents => {
    fetchedPost = documents
    return Post.count()
  }).then(count => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      post: fetchedPost,
      maxPosts: count
    });
  });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    //console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
}