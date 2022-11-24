const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middlewares/auth");

// logged in user profile
router.get("/my-profile", auth, async (req, res) => {
  try {
    const userProfile = await User.findById({ _id: req.user._id }).select(
      "-password"
    );
    return res.status(200).json(userProfile);
  } catch (error) {
    return res.status(400).send(error);
  }
});

// other users
// db.inventory.find( { quantity: { $ne: 20 } } )
router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find({
      _id: {
        $ne: {
          _id: req.user._id,
        },
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).send(error);
  }
});

// add a friend
router.put("/add-friend", auth, async (req, res) => {
  const { userId } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      $push: {
        friends: userId,
      },
    },
    { new: true },
    (error, result) => {
      if (error) {
        return res.status(400).send(error);
      }
      User.findByIdAndUpdate(
        { _id: userId },
        {
          $push: {
            friends: req.user._id,
          },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

// remove a friend
router.put("/remove-friend", auth, async (req, res) => {
  const { userId } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      $pull: {
        friends: userId,
      },
    },
    { new: true },
    (error, result) => {
      if (error) {
        return res.status(400).send(error);
      }
      User.findByIdAndUpdate(
        { _id: userId },
        {
          $pull: {
            friends: req.user._id,
          },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

module.exports = router;
