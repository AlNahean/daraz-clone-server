const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserInfo = require("../models/user");
const auth = require("../middleware/auth");
const { fileUpload, deleteImage } = require("../middleware/file-upload");
const baseUrl = require("../baseUrl");
let fs = require("fs");

const router = express.Router();

router.patch("/:id", auth, fileUpload.single("image"), async (req, res) => {
  const { id } = req.params;
  try {
    console.log(id);
    const userInfoCached = await UserInfo.findById(id);
    console.log(userInfoCached);
    await UserInfo.findByIdAndUpdate(
      id,
      { img: "" },
      {
        new: true,
        runValidators: true,
      }
    );
    const updatedUser = await UserInfo.findByIdAndUpdate(
      id,
      { img: `${baseUrl}imageStream/${req.file.path}`, org: req.file.id },
      {
        new: true,
        runValidators: true,
      }
    );

    await deleteImage(userInfoCached.org);

    // if (fs.existsSync(userInfoCached.org)) {
    //   await fs.unlink(userInfoCached.org, function (err) {
    //     if (err) throw err;
    //     console.log("File deleted!");
    //   });
    // }
    res.json({ ...req.body, img: `${baseUrl}${req.file.id}` });
  } catch (error) {
    console.log(error);
    res.json({ type: "F", msg: "server error" });
  }
});

router.post("/signup", async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const hashedpassword = await bcrypt.hash(password, 10);

    const result = await UserInfo.create({
      email,
      password: hashedpassword,
      name,
    });

    // const result = {
    //   _id: 1,
    //   email,
    //   name,
    //   password: hashedpassword,
    // };

    const token = jwt.sign(
      { email: result.email, id: result._id, name: result.name },
      "secret",
      {
        expiresIn: "10000h",
      }
    );
    res.status(200).json({
      name: result.name,
      id: result._id,
      token,
      tokenExp: new Date().getTime() + 36000000000,
    });
  } catch (error) {
    console.log(error);
    res.json({ type: "F", msg: "server error" });
  }
});
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    // console.log(req.userInfo);
    // console.log(req.headers.authorization.split(" ")[1]);
    const oldUser = await UserInfo.findOne({ email });
    if (!oldUser) {
      res.status(400).send({ msg: "user not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordCorrect) {
      res.status(200).send({ msg: "wrong password" });
    }
    const token = await jwt.sign(
      {
        name: oldUser.name,
        email: oldUser.email,
        id: oldUser._id,
      },
      "secret",
      { expiresIn: "10000h" }
    );
    res.status(200).send({
      name: oldUser.name,
      id: oldUser._id,
      token,
      tokenExp: new Date().getTime() + 36000000000,
      img: oldUser.img,
    });
    // res
    //   .status(200)
    //   .send({ name: result.name, email: result.email, id: result._id, token });
  } catch (error) {
    console.log(error);
    res.json({ type: "F", msg: "server error" });
  }
});

module.exports = router;
