//import the express-async-handler module to avoid the use of try catch
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const Token = require("../models/tokenModel");
const sendEmail = require("../utils/sendEmail");

//function to generate the token
const generateToken = ({ _id }) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser = asyncHandler(async (req, res) => {
  //destructuring the user variable
  const { email, name, password } = req.body;

  //all fields validation verification
  if (!email || !name || !password) {
    res.status(400);
    throw new Error("please fill all fields!");
  }

  //password length validation
  if (password.length < 8) {
    res.status(411);
    throw new Error("please password is at least 8 characters!");
  }

  //existing email verification
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    res.status(409);
    throw new Error("there is already an existing email!");
  }

  //create new user
  const user = await User.create({
    email,
    name,
    password,
  });

  //generate token after create the user
  const token = generateToken(user);

  //send the cookie to the frontend

  res.cookie("token", token, {
    path: "/",
    secure: true,
    sameSite: "none",
    expires: new Date(Date.now() + 1000 * 86400),
    HttpOnly: true,
  });

  if (user) {
    const { _id, name, email, phone, photo, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      phone,
      bio,
      photo,
      token,
    });
  } else {
    res.status(500);
    throw new Error("invalid user data");
  }
});

//login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //empty field validation
  if (!email || !password) {
    res.status(400);
    throw new Error("please enter email and password!");
  }

  //verify if user exists

  const user = await User.findOne({ email });
  

  if (!user) {
    res.status(404);
    throw new Error("user not found,please signup!");
  }
  
  // if user exists, check if password is correct
  const passwordIsCorrected = await bcrypt.compare(
    password,
    user.password
  );

  //generate token after create the user
  const token = generateToken(user);
  //send the token to the front-end
  res.cookie("token", token, {
    path: "/",
    sameSite: "none",
    expires: new Date(Date.now() + 1000 * 86400),
    httpOnly: true,
    secure: true,
  });


  if (user && passwordIsCorrected) {
    const { _id, name, email, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password, please check again.");
  }
});

//logged out the user by expiring the the cookie delay and send it to ZERO
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    secure: true,
    sameSite: false,
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return res.status(200).send({ message: "Logged out successfully!" });
});

//get the user data
const getUserData = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user_id); 

  if (user) {
    const { _id, name, email, phone, bio, photo } = user;
    res.status(202).json({
      _id,
      name,
      email,
      phone, 
      bio,
      photo,
      
    });
  }
  //res.send('no data found')
});


//get the login status

const loggedInStatus = asyncHandler(async(req, res) =>{
  const token = req.cookies.token

  if(!token){
    return res.json(false);
  }

  //verification of the token

  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  if(decoded){
    return res.json(true)
  } else{
      return res.json(false)
  }
})

//update the user date except the email

const updateUser = asyncHandler(async(req, res) => {

  //get the user from the database
  const user = await User.findById(req.user_id)

  if(user){
    const  {_id, email, name, bio, photo, phone} = user
    user.email = email;
    user.name = req.body.name || name;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo|| photo;
    user.phone = req.body.phone || phone;

    //save the new user info
    const updatedUser = await user.save();

    res.status(202).json({
      _id: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name,
      bio: updatedUser.bio,
      phone: updatedUser.phone,
      photo: updatedUser.photo
    })
  } else {
    res.status(404)
    throw new Error('user not found!')
  }

})


//change the password

const changePassword = asyncHandler(async(req, res) => {
  const {oldPassword, password} = req.body

  const user = await User.findById(req.user_id)


  if(!user){
    res.status(404)
    throw new Error('user not found') 
  }

  if(!oldPassword || !password){ 
    res.status(400)
    throw new Error('please enter old password and new password')
  }

  //check if the old password correspond to the password in the DB
  const newPassword = await bcrypt.compare(oldPassword, user.password)

  if(user && newPassword){
    user.password = password;
    await user.save()
    res.status(200).send('password updated!')

  } else{ 
    res.status(500)
    throw new Error('old password is incorrect!')
  } 
})

//forgot password
const forgotPassword = asyncHandler(async(req, res) => {

  const {email} = req.body

  const user = await User.findOne({email})

  if(!user){
    res.status(404)
    throw new Error('user not found')
  }

  //deleting token if it exists
  let token = await Token.findOne({userId: user._id})
  if(token){
    await token.deleteOne()
  }

  //create the reset password token
  let resetToken = crypto.randomBytes(32).toString('hex') + user._id
  console.log(resetToken)
  //res.send(resetToken)

  //hashed the toked before save to the DB

  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  //res.send(hashedToken)
  //save the token to the database

  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000)
  }).save()

  //construct the reset url
  const resetUrl = `${process.env.CLIENT_URL}/resetPassword/${resetToken}`


  //reset message
  const message = `
  <h2>HELLO ${user.name}</h2>
  <p>You requested a reset password</p>
  <p>Please click the reset password link below.</p>
  <p>The link will expire after 30 min</p>
  <a href= ${resetUrl} clickTracking = off>${resetUrl}</a>

  <p>Regards...</p>
  <p>Portfolio builder team</p>
  `
  const subject = 'Reset Password request'
  const sent_to = user.email
  const sent_from = process.env.EMAIL_USER

  try {
    await sendEmail(subject, message, sent_to, sent_from)

    res.status(200).json({
      success: true,
      message: 'Reset Password sent successfully'
    })
  } catch (error) {
    res.status(500)
    throw new Error("email not sent, please try again!") 
  }

  
})


//reset password
const resetPassword = asyncHandler(async (req, res) =>{
  const {password} = req.body;
  const {resetToken} = req.params

  //hash token 
  const hashToken = await crypto.createHash('sha256').update(resetToken).digest('hex');
  
  //find token in the DB
  const userToken = await Token.findOne({
    token: hashToken,
    expiresAt:{
      $gt: Date.now()
    }
  })

  if(!userToken){
    res.status(404)
    throw new Error('user not found')
  }

  const user = await User.findOne({_id: userToken.userId})
  user.password = password
  await user.save()
  res.status(202).send('password updated successfully, please login')

})

module.exports = {
  registerUser, 
  loginUser, 
  logoutUser,
  getUserData, 
  loggedInStatus,  
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
};   
