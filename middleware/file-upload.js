const multer = require("multer");
const uuid = require("uuid/v1");

const connectDB = require("../db/connect");
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");
// const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
require("dotenv").config();
const mongoURI = process.env.MONGO_URI; //process.env.MONGO_URI

const express = require("express");
// const fileUpload = require("../middleware/file-upload");
const auth = require("../middleware/auth");
const Test = require("../models/test");

const imageStream = express.Router();

const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

let gfs;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "images",
  });
});

const storage = new GridFsStorage({
  url: mongoURI,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    // this function runs every time a new file is created
    return new Promise((resolve, reject) => {
      // use the crypto package to generate some random hex bytes
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        // turn the random bytes into a string and add the file extention at the end of it (.png or .jpg)
        // this way our file names will not collide if someone uploads the same file twice
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "images",
        };
        // resolve these properties so they will be added to the new file document
        resolve(fileInfo);
      });
    });
  },
});

// set up our multer to use the gridfs storage defined above
const fileUpload = multer({
  storage,
  // limit the size to 20mb for any files coming in
  limits: { fileSize: 20000000 },
  // filer out invalid filetypes
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

function checkFileType(file, cb) {
  // https://youtu.be/9Qzmri1WaaE?t=1515
  // define a regex that includes the file types we accept
  const filetypes = /jpeg|jpg|png|gif|webp/;
  //check the file extention
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // more importantly, check the mimetype
  const mimetype = filetypes.test(file.mimetype);
  // if both are good then continue
  if (mimetype && extname) return cb(null, true);
  // otherwise, return error message
  cb("filetype");
}

// const fileUpload = (req, res, next) => {
//   const upload = store.single("image");
//   upload(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       return res.status(400).send("File too large");
//     } else if (err) {
//       // check if our filetype error occurred
//       if (err === "filetype") return res.status(400).send("Image files only");
//       // An unknown error occurred when uploading.
//       return res.sendStatus(500);
//     }
//     // all good, proceed
//     next();
//   });
// };

//
//

// const MIME_TYPE_MAP = {
//   "image/png": "png",
//   "image/jpeg": "jpeg",
//   "image/jpg": "jpg",
//   "image/webp": "webp",
// };

// const fileUpload = multer({
//   limits: 500000,
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, "uploads/images");
//     },
//     filename: (req, file, cb) => {
//       const ext = MIME_TYPE_MAP[file.mimetype];
//       cb(null, uuid() + "." + ext);
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     const isValid = !!MIME_TYPE_MAP[file.mimetype];
//     let error = isValid ? null : new Error("Invalid mime type!");
//     cb(error, isValid);
//   },
// });

imageStream.get("/:id", async ({ params: { id } }, res) => {
  try {
    // console.log("dfgdfghjdhgjk");
    // if no id return error
    if (!id || id === "undefined") return res.status(400).send("no image id");
    // if there is an id string, cast it to mongoose's objectId type
    // console.log("id1", id);
    let _id = new mongoose.Types.ObjectId(id);
    // let _id = id;
    // console.log("id2", _id);
    // console.log(await gfs.find({ _id }).toArray());
    // search for the image by id
    await gfs.find({ _id }).toArray((err, files) => {
      if (!files || files.length === 0) {
        console.log(err, files);
        return res.status(400).send("no files exist");
      }
      // if a file exists, send the data
      gfs.openDownloadStream(_id).pipe(res); //f
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

const deleteImage = (id) => {
  // console.log("ImageDeleteId", id);
  if (!id || id === "undefined") return res.status(400).send("no image id");
  const _id = new mongoose.Types.ObjectId(id);
  gfs.delete(_id, (err) => {
    if (err) return res.status(500).send("image deletion error");
  });
};

module.exports = { fileUpload, imageStream, deleteImage };
