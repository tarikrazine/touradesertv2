const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = (req, res) => {
  res.status(200).render('base', {
    title: 'Morocco desert tours for adventurous people',
  });
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // Get tours data from collection
  const tours = await Tour.find();

  // Build template
  // Render that template using tour data
  res.status(200).render('tours', {
    title: 'All tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // Name of the tour
  const { slug } = req.params;

  // Get tour data from collection
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review user rating',
  });

  if (!tour) return next(new AppError('There is no tour with that name.', 404));

  // Build template
  // Render that template using tour data
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  // Build template
  // Render that template using tour data
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getMe = (req, res) => {
  res.status(200).render('me', {
    title: 'Your account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // Find all bookings
  const bookings = await Booking.find({ user: req.user._id });

  // Finds tours with the return IDs
  const tourIDs = bookings.map((el) => el.tour);

  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('tours', {
    title: 'My tours',
    tours,
  });
});
