const express = require('express');
const {
  getAllTours,
  addTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getToursStats,
  getMonthlyPlan,
  getToursWithin,
  getDistancesTours,
  uploadTourImages,
  resizeTourImages,
} = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:tourID/reviews', reviewRouter);

// Top 5 cheap tours
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

// Tours statistics
router.route('/stats').get(getToursStats);

// Monthly Plan
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

// Get tours within radius
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

// Get distances to tours from point
router.route('/distances/:latlng/unit/:unit').get(getDistancesTours);

// Api tours routes
router.route('/').get(getAllTours).post(
  protect,
  restrictTo('admin', 'lead-guide'),
  /* uploadTourImages,
    resizeTourImages, */
  addTour
);

router
  .route('/:id')
  .get(getTour)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTour
  )
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
