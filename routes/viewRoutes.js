const express = require('express');
const viewController = require('../controlers/viewController');
const authcontroller = require('../controlers/authControllers');

const router = express.Router();

router.get('/', authcontroller.isLoggedIn, viewController.getOverView);

router.get('/tour/:slug', authcontroller.isLoggedIn, viewController.getTour);
router.get('/login', authcontroller.isLoggedIn, viewController.getLoginForm);
router.get('/me', authcontroller.protect, viewController.getAccount);

router.get('/my-tours', authcontroller.protect, viewController.getMyTours);

router.post(
  '/submit-user-data',
  authcontroller.protect,
  viewController.updateUserData
);

module.exports = router;
