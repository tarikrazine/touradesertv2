const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour
    const { tourID } = req.params;
    let filter = {};
    if (tourID) filter = { tour: tourID };

    // execute request
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    //const docs = await features.query.explain();
    const docs = await features.query;

    // Send response
    res.status(200).json({
      status: 'success',
      results: docs.length,
      createdTime: req.requestTime,
      data: {
        data: docs,
      },
    });
  });
};

exports.addOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    // Create new Document
    const doc = await Model.create(req.body);

    // Send response
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};

exports.getOne = (Model, populateOpt) => {
  return catchAsync(async (req, res, next) => {
    // Get id
    const { id } = req.params;

    let query = Model.findById(id);
    if (populateOpt) query = query.populate(populateOpt);

    // Get Document
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found, please check your ID', 404));
    }

    // Send response
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};

exports.updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    // Get id
    const { id } = req.params;

    // Update Document
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found, please check your ID', 404));
    }

    // Send response
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};

exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    // Get id
    const { id } = req.params;

    // Update document
    const doc = await Model.findByIdAndDelete(id);

    if (!doc)
      return next(new AppError('No document found, please check your ID', 404));

    // Send response
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
};
