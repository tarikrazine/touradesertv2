const express = require('express');

const {
  getOverview,
  getAllTours,
  getTour,
  getLoginForm,
  getMe,
  getMyTours,
} = require('../controllers/viewController');

const { isLoggedIn, protect } = require('../controllers/authController');

const { createBookingCheckout } = require('../controllers/bookingController');

const router = express.Router();

router.get('/', createBookingCheckout, isLoggedIn, getOverview);

router.get('/tours', isLoggedIn, getAllTours);

router.get('/tour/:slug', isLoggedIn, getTour);

router.get('/login', isLoggedIn, getLoginForm);

router.get('/me', protect, getMe);

router.get('/my-tours', protect, getMyTours);

module.exports = router;
