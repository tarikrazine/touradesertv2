const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (val) {
        return validator.isEmail(val);
      },
      message: 'Email: ({VALUE}) not valid',
    },
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'guide', 'lead-guide'],
    default: 'user',
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  } /*
  photo: String, */,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlenght: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete the confirm password
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function (next) {
  // Only run this function if password was modified
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.pre(/^find/, function (next) {
  // This points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// Function to check if the password are correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Function to check if the user are recently change his password
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Function to compared the new password with the old
userSchema.methods.comparedNewOld = async function (newPassword, oldPassword) {
  return await bcrypt.compare(newPassword, oldPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
