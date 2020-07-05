const Review = require('../models/reviewModel');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const {
  getAll,
  addOne,
  getOne,
  updateOne,
  deleteOne,
} = require('./handlerFactory');

exports.setTourUserIDs = catchAsync(async (req, res, next) => {
  // Get tour id
  const { tourID } = req.params;

  let tID;

  if (tourID) {
    // Check the tour id
    const currentTour = await Tour.findById(tourID);

    if (!currentTour)
      return next(
        new AppError('No Tour found for this ID, please check your ID!', 404)
      );

    tID = currentTour._id;
  }

  if (!req.body.tour) req.body.tour = tID;
  if (!req.body.user) req.body.user = req.user._id;

  next();
});

// Get all reviews
exports.getAllReviews = getAll(Review);
// Add review
exports.addReview = addOne(Review);
// Get review
exports.getReview = getOne(Review);
// Update review
exports.updateReview = updateOne(Review);
// Delete review
exports.deleteReview = deleteOne(Review);
