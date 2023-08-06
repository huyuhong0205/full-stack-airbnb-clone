/* url: host/api/v?/users */

// Express
import express from 'express';

// Controllers
// prettier-ignore
import { checkSignup, signup, checkLogin, login, logout, checkUpdatePassword, updatePassword } from '../controllers/authController.js';
// prettier-ignore
import { getProfile, checkUpdateProfile, updateProfile } from '../controllers/userController.js';
// Middleware
import { protect } from '../middleware/protectMiddleware.js';
import {
  uploadProfilePhoto,
  profilePhotoProcessing,
} from '../middleware/multerProfilePhoto.js';

///////////////////////////////////////////////////////////////////
const router = express.Router();

router.route('/signup').post(checkSignup, signup);
router.route('/login').post(checkLogin, login);
router.route('/logout').get(logout);

// Protect all routes after this middleware
router.use(protect);

router.route('/password').patch(checkUpdatePassword, updatePassword);

router
  .route('/profile')
  .get(getProfile)
  .patch(
    uploadProfilePhoto.single('photo'),
    profilePhotoProcessing,
    checkUpdateProfile,
    updateProfile
  );

export default router;
