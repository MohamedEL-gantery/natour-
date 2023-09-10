const express = require('express');
const bookingController = require('../controlers/bookingControllers');
const authController = require('../controlers/authControllers');

const router = express.Router();

// Protect All routes after this middleware
router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckOutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
