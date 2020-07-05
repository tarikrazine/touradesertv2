class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    // Copied query
    const objQuery = { ...this.queryStr };
    // Array of excluded fields
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    // Delete from objQuery => delete ['page', 'sort', 'limit', 'fields']
    excludeFields.forEach((el) => delete objQuery[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(objQuery);
    queryStr = queryStr.replace(/\b(lte|lt|gte|gt)\b/g, (match) => {
      return `$${match}`;
    });

    // Get all tour from database
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split('+').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split('+').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
