const express = require('express');
const userController = require('./../controlers/userContorller');
const authController = require('./../controlers/authControllers');

const router = express.Router();

router.post('/singup', authController.SingUp);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect All routes after this middleware
router.use(authController.protect);

router.patch('/updateMypassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
