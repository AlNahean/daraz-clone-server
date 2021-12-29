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

router.post("/", async (req, res) => {
  const gg = await Test.create({ ...req.body });
  // await showRedMsg(gg.name);
  res.json(req.body);
});

router.get("/", async (req, res) => {
  res.send("Nahean");
});

module.exports = router;
