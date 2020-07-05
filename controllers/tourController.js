const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const {
  getAll,
  addOne,
  getOne,
  updateOne,
  deleteOne,
} = require('./handlerFactory');
const AppError = require('../utils/appError');

// Top 5 cheap tours
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage+price';
  req.query.fields = 'name+price+ratingsAverage+summary+difficulty';
  next();
};

// Get all tours
exports.getAllTours = getAll(Tour);
// Add new tour
exports.addTour = addOne(Tour);
// Get tour
exports.getTour = getOne(Tour, { path: 'reviews' });
// Update tour
exports.updateTour = updateOne(Tour);
// Delete tour
exports.deleteTour = deleteOne(Tour);

// Get tours status
exports.getToursStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gt: 4 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        minRating: { $min: '$ratingsAverage' },
        maxRating: { $max: '$ratingsAverage' },
      },
    },
    {
      $sort: { avgPrice: -1 },
    },
    /* {
      $match: { _id: { $ne: 'EASY' } },
    }, */
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

// Get monthly Plan
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const { year } = req.params;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        nameTours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: {
          $switch: {
            branches: [
              { case: { $eq: ['$_id', 1] }, then: 'January' },
              { case: { $eq: ['$_id', 2] }, then: 'February' },
              { case: { $eq: ['$_id', 3] }, then: 'March' },
              { case: { $eq: ['$_id', 4] }, then: 'April' },
              { case: { $eq: ['$_id', 5] }, then: 'May' },
              { case: { $eq: ['$_id', 6] }, then: 'June' },
              { case: { $eq: ['$_id', 7] }, then: 'July' },
              { case: { $eq: ['$_id', 8] }, then: 'August' },
              { case: { $eq: ['$_id', 9] }, then: 'September' },
              { case: { $eq: ['$_id', 10] }, then: 'October' },
              { case: { $eq: ['$_id', 11] }, then: 'November' },
              { case: { $eq: ['$_id', 12] }, then: 'December' },
            ],
            default: 'Did not match',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTours: -1,
      },
    },
    /* {
        $limit: 6,
      }, */
  ]);

  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      plan,
    },
  });
});

// Get tours within radius
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide a latitude and longitude in format of lat,lng.',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

// Get distances to tours from point
exports.getDistancesTours = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide a latitude and longitude in format of lat,lng.',
        400
      )
    );
  }

  console.log(lat, lng);

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
