const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

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
