const mongoose = require("mongoose");
const connectDB = (url) => {
  return mongoose.connect(url, {
    //this are almost default needded to get rid of errors
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
};
module.exports = connectDB;
