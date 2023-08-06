/* url: host/api/v?/bookings */

// Express
import express from 'express';

// Controllers
// prettier-ignore
import { getMyBooking, checkCreateBooking, createBooking } from '../controllers/bookingController.js';
// Middleware
import { protect } from '../middleware/protectMiddleware.js';

///////////////////////////////////////////////////////////////////
const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.route('/my').get(getMyBooking);

router.route('/').post(checkCreateBooking, createBooking);

export default router;
