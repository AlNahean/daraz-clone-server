const express = require("express");

const baseUrl = require("./baseUrl");
console.log(baseUrl);
const userRouter = require("./router/user");
require("dotenv").config(); //to hide private key
const path = require("path");
const cors = require("cors");
const connectDb = require("./db/connect");
const productRouter = require("./router/product");
const testRouter = require("./router/test");
const searchRouter = require("./router/search");
const myAdmin = require("./router/myAdmin");
const { imageStream } = require("./middleware/file-upload");
const app = express();

app.use(express.json({ limit: "5000kb", extended: true })); //helps doing json
app.use(express.urlencoded({ limit: "5000kb", extended: true })); //turns url data to json like

app.use(express.static("./public")); //to set public folder

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); //--F--
// app.use("uploads/images", express.static(path.join("uploads", "images")));
// app.get("/test", (req, res) => {
//   res.send("working");
// });

app.use("/test", testRouter);
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/search", searchRouter);
app.use("/imageStream", imageStream);
app.use("/myAdmin", myAdmin);
app.get("/", (req, res) => {
  res.send("Welcome to My API");
});

const PORT = process.env.PORT || 4000;
// const url =
//   "mongodb+srv://Nahean:nahean@cluster0.zb2uq.mongodb.net/FbClone?retryWrites=true;";
const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    await app.listen(PORT, () => {
      console.log(`Server Listening at port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
