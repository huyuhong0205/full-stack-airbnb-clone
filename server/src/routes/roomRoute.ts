/* url: host/api/v?/rooms */

// Express
import express from 'express';

// Controllers
// prettier-ignore
import { getRooms, getRoom, getMyRooms, checkCreateRoom, createRoom, checkUpdateRoom, updateRoom, deleteRoom } from '../controllers/roomController.js';
// Middleware
import { protect } from '../middleware/protectMiddleware.js';
import { restrictRole } from '../middleware/restrictRole.js';
import {
  uploadRoomImages,
  roomImagesProcessing,
} from '../middleware/multerRoomImages.js';

///////////////////////////////////////////////////////////////////
const router = express.Router();

router.route('/').get(getRooms);

router.route('/my').get(protect, restrictRole('host', 'admin'), getMyRooms); // [NOTE] need route before `/:roomId`

router.route('/:roomId').get(getRoom);

// Protect all routes after this middleware
router.use(protect);
// Restrict all routes after this middleware
router.use(restrictRole('host', 'admin'));

router.route('/').post(
  uploadRoomImages.fields([{ name: 'images', maxCount: 10 }]), // or uploadRoomImages.array('images', 10)
  roomImagesProcessing,
  checkCreateRoom,
  createRoom
);

router.route('/:roomId').patch(checkUpdateRoom, updateRoom).delete(deleteRoom);

export default router;
