const express = require('express');
const {
  getAllUsers,
  addUser,
  getUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
  deleteMe,
} = require('../controllers/userController');
const {
  signup,
  login,
  restrictTo,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
} = require('../controllers/authController');

const router = express.Router();

// Signup And log in routes
router.post('/signup', signup);
router.post('/login', login);

// Forget and reset routes
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// Protect all routes after this middleware
router.use(protect);

// Current users routes
router.get('/me', getMe, getUser);
router.patch('/updateMe', updateMe);
router.patch('/updateMyPassword', updatePassword);
router.delete('/deleteMe', deleteMe);

// Access just to the admin after this middleware
router.use(restrictTo('admin'));

// Api users routes
router.route('/').get(getAllUsers).post(addUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
