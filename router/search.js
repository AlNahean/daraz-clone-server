const express = require("express");

const PostInfo = require("../models/product");

const router = express.Router();

router.get("/:keyword", async (req, res) => {
  try {
    const { keyword } = req.params;

    const test = `/${keyword}/i`;

    const searchResult = await PostInfo.find({
      $or: [
        { keyWords: { $regex: keyword, $options: "i" } },
        { name: { $regex: keyword, $options: "i" } },
      ],
    });

    res.json({ posts: searchResult });
  } catch (error) {
    console.log(error);
    res.json({ type: "F", msg: "server error1", error });
  }
});

module.exports = router;
