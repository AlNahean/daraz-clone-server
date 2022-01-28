const express = require("express");
const mongoose = require("mongoose");
let fs = require("fs");
const auth = require("../middleware/auth");
const ProductInfo = require("../models/product");
const UserInfo = require("../models/user");
const { fileUpload, deleteImage } = require("../middleware/file-upload");
const baseUrl = require("../baseUrl");

const router = express.Router();

//w
router.get("/:type", async (req, res) => {
  try {
    // console.log(req.params.type);
    // console.log(req.query);

    if (req.params.type === "single") {
      const post = await ProductInfo.findById(req.query.id);
      res.json({ msg: "success", post });
    } else if (req.params.type === "userProducts") {
      // console.log(req.query);
      const post = await ProductInfo.find({
        uploaderId: req.query.id,
      })
        .limit(parseInt(req.query.limit))
        .skip(parseInt(req.query.skip))
        .sort({ uploadTimeSort: -1 });

      const postsArrayLength = await ProductInfo.countDocuments({
        uploaderId: req.query.id,
      });
      // console.log(post);
      res.json({ msg: "success", posts: post, postsArrayLength });
    } else {
      const post = await ProductInfo.find({
        $or: [
          { keyWords: { $regex: req.query.search, $options: "i" } },
          { name: { $regex: req.query.search, $options: "i" } },
        ],
      })
        .limit(parseInt(req.query.limit))
        .skip(parseInt(req.query.skip))
        .sort({ uploadTimeSort: -1 });

      // console.log(post);

      const postsArrayLength = await ProductInfo.countDocuments({
        $or: [
          { keyWords: { $regex: req.query.search, $options: "i" } },
          { name: { $regex: req.query.search, $options: "i" } },
        ],
      });
      let newPosts = post;

      // let newPosts2 = newPosts.sort(function (a, b) {
      //   return b.uploadTimeSort - a.uploadTimeSort;
      // });

      res.json({ msg: "success", posts: newPosts, postsArrayLength });
    }
  } catch (error) {
    console.log(error);
    res.json({ type: "F", msg: "server error" });
  }
});

//w
router.get("/", async (req, res) => {
  try {
    const post = await ProductInfo.find({});
    // console.log("/");
    let newPosts = post;

    let newPosts2 = newPosts.sort(function (a, b) {
      return b.uploadTime - a.uploadTime;
    });

    res.json({ msg: "success", posts: newPosts2 });
  } catch (error) {
    console.log(error);
    res.json({ type: "F", msg: "server error" });
  }
});

router.get("/:_id", async (req, res) => {
  try {
    // console.log(req.params._id);
    const post = await ProductInfo.findById(req.params._id);

    res.json({ msg: "success", post });
  } catch (error) {
    console.log(error);
    res.json({ type: "F", msg: "server error" });
  }
});
router.post("/w/", auth, fileUpload.array("images", 4), async (req, res) => {
  try {
    // console.log(req.files);
    res.json({
      ...req.body,
      ...req.files,
    });
  } catch (error) {
    console.log(error);
    res.json({ type: "F", msg: "server error1", eee: error });
  }
});

//w
router.post("/", auth, fileUpload.array("images", 4), async (req, res) => {
  try {
    const imageLink = [];

    for (let i = 0; i < req.files.length; i++) {
      imageLink.push({
        id: new Date().getTime(),
        img: `${baseUrl}imageStream/${req.files[i].id}`,
        org: req.files[i].id,
      });
    }
    // console.log(req.files);

    const productData = {
      name: req.body.name,
      images: imageLink,
      price: req.body.price,
      discount: req.body.discount,
      keyWords2: JSON.parse(req.body.keywords),
      keyWords: JSON.parse(req.body.keywords).map((item) => item.name),
      uploader: req.body.uploader,
      uploaderId: req.body.uploaderId,

      uploadTime: new Date().toDateString(),
      uploadTimeSort: new Date(),
    };
    const post = await ProductInfo.create({ ...productData });
    res.json({
      post,
    });
  } catch (error) {
    console.log(error);
    res.json({ type: "F", msg: "server error1" });
  }
});

//w
router.patch("/:id", auth, fileUpload.array("images", 4), async (req, res) => {
  try {
    const { id } = await req.params;
    const updatedPost = await ProductInfo.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        price: req.body.price,
        discount: req.body.discount,
        keyWords2: JSON.parse(req.body.keywords),
        keyWords: JSON.parse(req.body.keywords).map((item) => item.name),
        uploader: req.body.uploader,
        uploaderId: req.body.uploaderId,
        uploadTime: new Date().toDateString(),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(updatedPost);
  } catch (error) {
    console.log(erros);
    res.json({ type: "F", msg: "server error patch" });
  }
});

//w
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = await req.params;
    // console.log(id);
    const deletedPost = await ProductInfo.findByIdAndDelete(id);

    // console.log(deletedPost);

    for (let i = 0; i < deletedPost.images.length; i++) {
      // await fs.unlink(deletedPost.images[i].org, function (err) {
      //   if (err) throw err;
      //   console.log("File deleted!");
      // });
      await deleteImage(deletedPost.images[i].org);
    }

    res.json({ deletedPost, msg: "File Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ type: "F", msg: "server error" });
  }
});

module.exports = router;
