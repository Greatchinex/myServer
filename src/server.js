const express = require("express");

require("./config/db");

const User = require("./models/user");

const app = express();
app.use(express.json());
const port = 5000;

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

    const newUser = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password
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

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
