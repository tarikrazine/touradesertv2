const express = require('express');

const {
  getAllReviews,
  setTourUserIDs,
  addReview,
  getReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourUserIDs, addReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('admin', 'user'), updateReview)
  .delete(restrictTo('admin', 'user'), deleteReview);

module.exports = router;
