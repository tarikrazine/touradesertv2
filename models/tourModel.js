const mongoose = require('mongoose');
const slugify = require('slugify');
//const validator = require('validator');

//const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a price'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 Characters'],
      minlength: [10, 'A tour name must have more or equal then 40 Characters'],
      /* validate: [
        validator.isAlpha,
        'A tour name must only contain letters (a-zA-Z',
      ], */
    },
    slug: String,
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: 'A tour must have a size',
    },
    difficulty: {
      type: String,
      required: 'A tour must have a difficulty',
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 2) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        // The validate can only work on new document create not in update
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below the regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  // Duration in week
  const durationWeeks = this.duration / 7;

  return durationWeeks;
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// Document middleware: runs BEFORE save() or create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/* tourSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(async (id) => {
    return await User.findById(id);
  });

  this.guides = await Promise.all(guidesPromises);

  next();
}); */

/* tourSchema.pre('save', function (next) {
  console.log('Will save document...');
  next();
});

// Document middleware: runs AFTER save() or create()
tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
}); */

// Query middleware: runs BEFORE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

// Populate guides
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

// Query middleware: runs AFTER
/* tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${this.start - Date.now()} Milliseconds!`);
  //console.log(docs);
  next();
}); */

// Aggregation middleware: runs BEFORE
/* tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
}); */

// Aggregation middleware: runs AFTER
/* tourSchema.post('aggregate', function (docs, next) {
  console.log(docs);
  next();
}); */

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
