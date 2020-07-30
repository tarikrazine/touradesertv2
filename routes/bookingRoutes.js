const express = require('express');

const {
  getCheckoutSession,
  getAllBookings,
  addBooking,
  getBooking,
  updateBooking,
  deleteBooking,
} = require('../controllers/bookingController');

const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

router.use(protect);

router.get('/checkout-session/:tourID', getCheckoutSession);

router.use(restrictTo('admin', 'lead-guide'));

router.route('/').get(getAllBookings).post(addBooking);

router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);

module.exports = router;
