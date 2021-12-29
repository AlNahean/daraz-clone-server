const mongoose = require("mongoose");

const UserInfo = new mongoose.Schema({
  id: Number,
  name: String,
  email: String,
  password: String,
  img: String,
  org: String,
  deleteImgUrl: String,
});
module.exports = mongoose.model("UserInfoV1", UserInfo);
