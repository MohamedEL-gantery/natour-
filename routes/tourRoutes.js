const express = require('express');
const tourController = require('./../controlers/tourController');
const authController = require('./../controlers/authControllers');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

//router.param('id',tourController.checkID);

// post/tour/2345f/reviews
// Get/tour/2345f/reviews

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tours-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/tours_within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours_within?distance=233&center=40,-45&unit=mi
// /tours_within/233/center=40,-45/unit=mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistance);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourimages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
