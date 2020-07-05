const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { getAll, getOne, updateOne, deleteOne } = require('./handlerFactory');

const objectFilter = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

// Get for current user
exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

// Update for current user
exports.updateMe = catchAsync(async (req, res, next) => {
  // Create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }

  // Filtered out the unwanted fields names that not allowed to be updated
  const filterReqBody = objectFilter(req.body, 'name', 'email');

  // Update user documents
  const updateUser = await User.findByIdAndUpdate(req.user.id, filterReqBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

// Delete for current user
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Get all users
exports.getAllUsers = getAll(User);
// Add user
exports.addUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! please use /signup instead',
  });
};
// Get user
exports.getUser = getOne(User);
// Update user
exports.updateUser = updateOne(User);
// Delete user
exports.deleteUser = deleteOne(User);
