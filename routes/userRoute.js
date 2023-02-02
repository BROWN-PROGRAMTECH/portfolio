const express = require('express');
const { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getUserData,
    loggedInStatus,
    updateUser, 
    changePassword,
    forgotPassword,
    resetPassword, 
} = require('../controllers/userController');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/getUserData', protect, getUserData);
router.get('/loggedInStatus', loggedInStatus)
router.patch('/updateUser', protect, updateUser);
router.patch('/changePassword', protect, changePassword);
router.post('/forgotPassword', forgotPassword)
router.put('/resetPassword/:resetToken', resetPassword)
module.exports = router   