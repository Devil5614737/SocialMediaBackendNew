const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middlewares/auth");

// uploading functionality
router.post("/post", auth, async (req, res) => {
  const { caption, image } = req.body;
  const newPost = new Post({
    caption,
    image,
    postedBy: req.user._id,
  });

  try {
    const post = await newPost.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

// getting all the posts
router.get("/allpost", auth, async (req, res) => {
  try {
    const posts = await Post.find().populate("likes","_id uesrname").populate("postedBy", "_id username pic").populate("comments.postedBy","_id username pic");
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(400).send(error);
  }
});

//getting specific user post
router.get("/my-post", auth, async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "_id username"
    );
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(400).send(error);
  }
});

// like a post
router.put("/like", auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: {
          likes: req.user._id,
        },
      },
      { new: true }
    );
    return res.status(200).json(post);
  } catch (error) {
    return res.status(400).send(error);
  }
});

// unlike a post
router.put("/unlike", auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: {
          likes: req.user._id,
        },
      },
      { new: true }
    );
    return res.status(200).json(post);
  } catch (error) {
    return res.status(400).send(error);
  }
});
// comment in a post
router.put("/comment", auth, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id username")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

module.exports = router;
