const express = require("express");
const mongoose = require("mongoose");

const fileUpload = require("../middleware/file-upload");
const auth = require("../middleware/auth");
const Test = require("../models/test");

const router = express.Router();

// router.post("/", fileUpload.single("image"), auth, async (req, res) => {
//   console.log();
//   res.json({ path: `http://localhost:4000/${req.file.path}` });
// });

router.get("/:id", ({ params: { id } }, res) => {
  // console.log("ggggggggggggggggggggggggggggggggggggggggggggggggggggggg");
  // if no id return error
  if (!id || id === "undefined") return res.status(400).send("no image id");
  // if there is an id string, cast it to mongoose's objectId type
  const _id = new mongoose.Types.ObjectId(id);
  // search for the image by id
  gfs.find({ _id }).toArray((err, files) => {
    if (!files || files.length === 0)
      return res.status(400).send("no files exist");
    // if a file exists, send the data
    gfs.openDownloadStream(_id).pipe(res);
  });
});
module.exports = router;
