const asyncHandler = require("express-async-handler");
//const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler( (req, res, next) => {

  const token = req.cookies.token;
//res.send(token);
  if (!token) {
    res.status(401);
    throw new Error("Unauthorized access, please login first!");
  }

 
  try {

    //verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user_id = decoded._id;

  } catch (error) {
    res.status(401);
    throw new Error("Unauthorized access, please login!");
  }

  return next();
});

module.exports = protect; 
