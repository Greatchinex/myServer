const express = require("express");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

// DB Connection
require("./config/db");

// DB Collections
const User = require("./models/user");
const Post = require("./models/post");

// Auth Middleware
const auth = require("./config/middleware");

const app = express();
app.use(express.json());
const port = process.env.PORT;

app.get("/test", function (req, res, next) {
  res.json({
    msg: "Ok"
  });
});

app.post("/register", async (req, res, next) => {
  try {
    const findUser = await User.findOne({ email: req.body.email });

    // console.log(findUser);
    if (findUser) {
      return res.json({ msg: "User with email already exist" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const newUser = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      password: hashedPassword
    });

    // console.log(newUser);
    const savedUser = await newUser.save();

    // console.log(savedUser);
    // console.log(savedUser._id);

    const token = await jwt.sign(
      { userId: savedUser._id },
      "mysuperdupersecret"
    );

    res.json({
      msg: "User created successfully",
      userToken: token,
      user: savedUser
    });
  } catch (err) {
    res.json({ msg: err });
  }
});

app.post("/login", async (req, res, next) => {
  try {
    const userEmail = await User.findOne({ email: req.body.email });

    if (!userEmail) {
      return res.json({ msg: "Incorrect login details" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      userEmail.password
    );

    if (!passwordMatch) {
      return res.json({ msg: "Incorrect login details" });
    }

    const token = await jwt.sign(
      { userId: userEmail._id },
      "mysuperdupersecret"
    );

    res.json({
      msg: token,
      user: userEmail
    });
  } catch (err) {
    // res.json({ msg: err });
    throw err;
  }
});

app.get("/allusers", auth, async (req, res, next) => {
  try {
    const allusers = await User.find();

    if (allusers.length === 0) {
      return res.json({ msg: "No users found" });
    }

    res.json({
      users: allusers
    });
  } catch (err) {
    res.json({ msg: err });
  }
});

app.get("/getuserbyemail", async (req, res, next) => {
  try {
    const userEmail = await User.findOne({ email: req.body.email });

    if (!userEmail) {
      return res.json({ msg: "User not found" });
    }

    res.json({ user: userEmail });
  } catch (err) {
    res.json({ msg: err });
  }
});

// http://localhost:5000/singleuser/5ef19ee1a358fb03277fc23d - How to test below endpoint
app.get("/singleuser", auth, async function (req, res, next) {
  try {
    // req.user coming from auth function (That is what we are returning)
    const aUser = req.user._id;

    const UserFind = await User.findById(aUser);

    res.json({ user: UserFind });
  } catch (err) {
    res.json({ msg: err });
    // throw err;
  }
});

app.put("/edit_user/:id", auth, async function (req, res, next) {
  try {
    const singleUser = await User.findById(req.params.id);

    if (!singleUser) {
      return res.json({ msg: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    res.json({
      msg: "Account Updated Successfully",
      user: updatedUser
    });
  } catch (err) {
    res.json({ msg: err });
    // throw err;
  }
});

app.delete("/removeuser/:id", async function (req, res, next) {
  try {
    const singleUser = await User.findById(req.params.id);

    if (!singleUser) {
      return res.json({ msg: "User not found" });
    }

    const removedUser = await User.findByIdAndRemove(req.params.id);

    res.json({
      msg: "User Deleted Successfully"
    });
  } catch (err) {
    res.json({ msg: err });
    // throw err;
  }
});

// Posts Endpoints
app.post("/createpost", auth, async (req, res, next) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      created_by: req.user._id
    });

    const savedPost = await newPost.save();

    // console.log(savedPost)

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { no_of_post: +1 }, $push: { created_post: savedPost._id } },
      { new: true }
    );

    res.json({
      msg: "Post created successfully",
      post: savedPost
    });
  } catch (err) {
    res.json({ msg: err });
  }
});

// Update a single post (Protected Route) HINT: req.params
app.put("/updatepost/:postId", auth, async (req, res, next) => {
  try {
    const findPost = await Post.findById(req.params.postId);

    // console.log(findPost);
    if (!findPost) {
      return res.json({ msg: "Post not found" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      req.body,
      { new: true }
    );

    res.json({
      msg: "Post updated successfully",
      post: updatedPost
    });
  } catch (err) {
    res.json({ msg: err });
  }
});
// User to view post he/she Created (Protected Route)
app.get("/viewpersonalposts", auth, async (req, res, next) => {
  try {
    const personalPosts = await Post.find({ created_by: req.user._id });

    if (personalPosts.length === 0) {
      return res.json({ msg: "You have not created any posts" });
    }

    res.json({
      post: personalPosts
    });
  } catch (err) {
    res.json({ msg: err });
  }
});
// view all posts (Public Route)
// View Posts by category (Protected Route)
// View single post (Protected Route) HINT: req.params
// Delete a single Post (Protected Route) HINT: req.params

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
