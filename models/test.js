const mongoose = require("mongoose");

const Test = new mongoose.Schema({
  id: Number,
  image: Buffer,
  name: String,
  email: String,
  password: String,
  postText: String,
  postImage: String,
  postPrivacy: String,
  uploader: String,
  uploaderImage: String,
  uploadTime: String,
  likeNum: { type: [String], default: [] },
  commentNum: { type: String, default: 0 },
  shareNum: { type: String, default: 0 },
});
module.exports = mongoose.model("TestV1", Test);
