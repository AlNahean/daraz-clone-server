const express = require("express");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const Token = req.headers.authorization?.split(" ")[1];
    console.log(Token);
    let decodedData;

    decodedData = await jwt.verify(Token, "secret");
    req.userInfo = decodedData;
    next();
  } catch (error) {
    console.log(error);
    res.json({ type: "F", msg: "You need To Log In to take Action" });
  }
};

module.exports = auth;

/**
 * 
 * 
 * const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      res.json({ msg: "NO Token Provided", posts: [] });
      next();
    } else {
      // if (!Token) {
      //   res.json({ msg: "NO Token Provided" });
      // } else {
      const Token = req.headers.authorization?.split(" ")[1];
      let decodedData;
      if (Token) {
        decodedData = await jwt.verify(Token, "secret");
        req.userInfo = decodedData;
        // console.log("auth: decodeData");
        // console.log(decodedData);
        // } else {
        //   res.json({ msg: "NO token Provided" });
        // }
      }
      next();
    }
    next();
  } catch (error) {
    res.json({ msg: "NO token Provided" });
  }
};
 */
