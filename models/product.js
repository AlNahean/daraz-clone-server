const mongoose = require("mongoose");

const KeywordSchema = new mongoose.Schema({
  id: Number,
  name: String,
});
const ImageSchema = new mongoose.Schema({
  id: Number,
  img: String,
  org: String,
});

const PostInfo = new mongoose.Schema({
  name: String,
  price: String,
  discount: String,
  images: [ImageSchema],
  keyWords2: [KeywordSchema],
  keyWords: [String],
  uploader: String,
  uploaderId: String,
  uploadTime: String,
  uploadTimeSort: Number,
});
module.exports = mongoose.model("PostInfoV1", PostInfo);
