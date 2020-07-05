const express = require('express');

const {
  getOverview,
  getAllTours,
  getTour,
  getLoginForm,
} = require('../controllers/viewController');

const { isLoggedIn } = require('../controllers/authController');

const router = express.Router();

router.use(isLoggedIn);

router.get('/', getOverview);

router.get('/tours', getAllTours);

router.get('/tour/:slug', getTour);

router.get('/login', getLoginForm);

module.exports = router;
