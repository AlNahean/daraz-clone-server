const express = require("express");

const router = express.Router();

const ProductInfo = require("../models/product");
const { fileUpload, deleteImage } = require("../middleware/file-upload");

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

// router.delete("/:id", async (req, res) => {
//   try {
//     const { id } = await req.params;
//     // console.log(id);
//     const deletedPost = await ProductInfo.findByIdAndDelete(id);

//     // console.log(deletedPost);

//     for (let i = 0; i < deletedPost.images.length; i++) {
//       // await fs.unlink(deletedPost.images[i].org, function (err) {
//       //   if (err) throw err;
//       //   console.log("File deleted!");
//       // });
//       await deleteImage(deletedPost.images[i].org);
//     }

//     res.json({ deletedPost, msg: "File Deleted Successfully" });
//   } catch (error) {
//     console.log(error);
//     res.json({ type: "F", msg: "server error" });
//   }
// });
// router.get("/delete/:id", async (req, res) => {
//   try {
//     const { id } = await req.params;
//     // console.log(id);

//     // console.log(deletedPost);

//     for (let i = 0; i < deletedPost.images.length; i++) {
//       // await fs.unlink(deletedPost.images[i].org, function (err) {
//       //   if (err) throw err;
//       //   console.log("File deleted!");
//       // });
//       await deleteImage(deletedPost.images[i].org);
//     }
//     const deletedPost = await ProductInfo.findByIdAndDelete(id);

//     res.json({ deletedPost, msg: "File Deleted Successfully" });
//   } catch (error) {
//     console.log(error);
//     res.json({ type: "F", msg: "server error" });
//   }
// });
module.exports = router;
