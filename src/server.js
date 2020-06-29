const express = require("express");
const bcrypt = require("bcryptjs")

require("./config/db");

const User = require("./models/user");

const app = express();
app.use(express.json());
const port = 8000;

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

    const hashedPassword = bcrypt.hash(req.body.password, 12)

    const newUser = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      password: hashedPassword
    });

    // console.log(newUser);
    const savedUser = await newUser.save();

    res.json({
      msg: "User created successfully",
      user: savedUser
    });
  } catch (err) {
    res.json({ msg: err });
  }
});

app.get("/allusers", async (req, res, next) => {
  try {
    const allusers = await User.find();

    if (allusers.length === 0) {
      return res.json({ msg: "No users found" })
    }

    res.json({
      users: allusers
    })
  } catch (err) {
    res.json({ msg: err });
  }
});

app.get("/getuserbyemail", async (req, res, next) => {
  try {
    const userEmail = await User.findOne({ email: req.body.email });

    if (!userEmail) {
      return res.json({ msg: "User not found" })
    }

    res.json({ user: userEmail})
  } catch (err) {
    res.json({ msg: err });
  }
})

// http://localhost/5000/singleuser/5ef19ee1a358fb03277fc23d - How to test below endpoint
app.get("/singleuser/:id", async function (req, res, next) {
  try {
    const singleUser = await User.findById(req.params.id)

    if (!singleUser) {
      return res.json({ msg: "User not found" })
    }

    res.json({ user: singleUser })
  } catch (err) {
    res.json({ msg: err });
    // throw err;
  }
})

app.put("/edit_user/:id", async function (req, res, next) {
  try {
    const singleUser = await User.findById(req.params.id)

    if (!singleUser) {
      return res.json({ msg: "User not found" })
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.json({
      msg: "Account Updated Successfully",
      user: updatedUser
    })
  } catch (err) {
    res.json({ msg: err });
    // throw err;
  }
});

app.delete("/removeuser/:id", async function (req, res, next) {
   try {
    const singleUser = await User.findById(req.params.id)

    if (!singleUser) {
      return res.json({ msg: "User not found" })
    }

    const removedUser = await User.findByIdAndRemove(req.params.id)

    res.json({
      msg: "User Deleted Successfully"
    })
  } catch (err) {
    res.json({ msg: err });
    // throw err;
  }
})

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
